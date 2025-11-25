const Stripe = require('stripe');
const User = require('../models/User');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create checkout session for Pro subscription
exports.createCheckoutSession = async (req, res) => {
  try {
    const { priceId } = req.body;

    // Create or get Stripe customer
    let customerId = req.user.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        metadata: {
          userId: req.user._id.toString(),
          firebaseUid: req.user.firebaseUid
        }
      });
      
      customerId = customer.id;
      req.user.stripeCustomerId = customerId;
      await req.user.save();
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId || process.env.STRIPE_PRO_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/cancelled`,
      metadata: {
        userId: req.user._id.toString()
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

// Create billing portal session
exports.createPortalSession = async (req, res) => {
  try {
    if (!req.user.stripeCustomerId) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    const { returnUrl } = req.body;

    const session = await stripe.billingPortal.sessions.create({
      customer: req.user.stripeCustomerId,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Create portal session error:', error);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
  try {
    if (!req.user.subscriptionId) {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    // Cancel at period end (user keeps access until billing cycle ends)
    const subscription = await stripe.subscriptions.update(
      req.user.subscriptionId,
      {
        cancel_at_period_end: true,
      }
    );

    // Update user record
    req.user.subscriptionStatus = 'canceling';
    await req.user.save();

    res.json({ 
      success: true, 
      message: 'Subscription will be cancelled at the end of the billing period',
      periodEnd: subscription.current_period_end 
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
};

// Request refund
exports.requestRefund = async (req, res) => {
  try {
    if (!req.user.stripeCustomerId) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    // Get the latest invoice
    const invoices = await stripe.invoices.list({
      customer: req.user.stripeCustomerId,
      limit: 1,
    });

    if (invoices.data.length === 0) {
      return res.status(400).json({ error: 'No invoices found' });
    }

    const latestInvoice = invoices.data[0];
    
    // Check if invoice is within 14 days
    const invoiceDate = new Date(latestInvoice.created * 1000);
    const now = new Date();
    const daysSinceInvoice = Math.floor((now - invoiceDate) / (1000 * 60 * 60 * 24));
    
    if (daysSinceInvoice > 14) {
      return res.status(400).json({ 
        error: 'Refund period has expired. Refunds are available within 14 days of purchase.' 
      });
    }

    // Check if payment intent exists and was successful
    if (!latestInvoice.payment_intent) {
      return res.status(400).json({ error: 'No payment found for this subscription' });
    }

    // Create refund
    const refund = await stripe.refunds.create({
      payment_intent: latestInvoice.payment_intent,
      reason: 'requested_by_customer',
    });

    // Cancel the subscription immediately
    if (req.user.subscriptionId) {
      await stripe.subscriptions.cancel(req.user.subscriptionId);
    }

    // Update user record
    req.user.subscriptionStatus = 'canceled';
    req.user.role = 'free_user';
    await req.user.save();

    res.json({ 
      success: true, 
      message: 'Refund processed successfully',
      refundId: refund.id,
      amount: refund.amount / 100, // Convert cents to euros
    });
  } catch (error) {
    console.error('Request refund error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to process refund request' 
    });
  }
};

// Get subscription status
exports.getSubscriptionStatus = async (req, res) => {
  try {
    const subscription = {
      status: req.user.subscriptionStatus,
      role: req.user.role,
      periodEnd: req.user.subscriptionPeriodEnd,
      customerId: req.user.stripeCustomerId
    };

    res.json({ subscription });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription status' });
  }
};

// Get session data for success page and update user immediately
exports.getSessionData = async (req, res) => {
  try {
    const { sessionId } = req.params;
    console.log('📥 Getting session data for:', sessionId);
    
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'line_items']
    });

    if (!session) {
      console.error('❌ Session not found:', sessionId);
      return res.status(404).json({ error: 'Session not found' });
    }

    console.log('✅ Session retrieved:', {
      id: session.id,
      customer: session.customer,
      payment_status: session.payment_status,
      subscription: typeof session.subscription === 'string' ? session.subscription : session.subscription?.id
    });

    // Update user data immediately if payment was successful
    if (session.payment_status === 'paid' && session.subscription) {
      console.log('💳 Payment successful, updating subscription...');
      // session.subscription is already an expanded object if it's an object,
      // otherwise it's a string ID that needs to be retrieved
      let subscription;
      if (typeof session.subscription === 'string') {
        subscription = await stripe.subscriptions.retrieve(session.subscription);
      } else {
        subscription = session.subscription;
      }
      await handleSubscriptionUpdate(subscription);
    }

    // Extract plan details from line items
    const lineItem = session.line_items?.data[0];
    const planName = lineItem?.description || 'Pro';
    const amount = session.amount_total;
    const currency = session.currency;
    
    // Determine billing cycle from price
    let billingCycle = 'monthly';
    if (lineItem?.price?.recurring?.interval === 'year') {
      billingCycle = 'annual';
    }

    // Get updated user profile
    const user = await User.findOne({ stripeCustomerId: session.customer });
    
    console.log('👤 Updated user data:', user ? {
      email: user.email,
      role: user.role,
      plan: user.subscriptionPlan,
      status: user.subscriptionStatus
    } : 'User not found');

    res.json({
      sessionId: session.id,
      planName,
      amount,
      currency,
      billingCycle,
      customerEmail: session.customer_email,
      status: session.payment_status,
      user: user ? {
        role: user.role,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPeriodEnd: user.subscriptionPeriodEnd
      } : null
    });
  } catch (error) {
    console.error('❌ Get session data error:', error);
    res.status(500).json({ error: 'Failed to fetch session data' });
  }
};

// Webhook handler for Stripe events
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

// Helper functions
async function handleCheckoutCompleted(session) {
  console.log('🎉 Checkout completed for session:', session.id);
  
  // Check if this is a credit purchase (one-time payment)
  if (session.mode === 'payment' && session.metadata?.creditsAmount) {
    try {
      const creditsAmount = parseInt(session.metadata.creditsAmount);
      const user = await User.findOne({ stripeCustomerId: session.customer });
      
      if (user) {
        // Add credits to user account
        user.aiCredits = (user.aiCredits || 0) + creditsAmount;
        await user.save();
        
        console.log(`💎 Added ${creditsAmount} credits to user ${user.email}. New balance: ${user.aiCredits}`);
      }
    } catch (error) {
      console.error('Error handling credit purchase:', error);
    }
  }
  // If it's a subscription checkout
  else if (session.subscription && session.customer) {
    try {
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      await handleSubscriptionUpdate(subscription);
    } catch (error) {
      console.error('Error handling checkout completion:', error);
    }
  }
}

async function handleSubscriptionUpdate(subscription) {
  console.log('🔄 Handling subscription update for customer:', subscription.customer);
  console.log('📊 Subscription details:', {
    id: subscription.id,
    status: subscription.status,
    items: subscription.items.data.map(item => ({
      priceId: item.price.id,
      interval: item.price.recurring?.interval
    }))
  });
  
  const user = await User.findOne({ stripeCustomerId: subscription.customer });
  
  if (user) {
    console.log('👤 Found user:', user.email);
    
    user.subscriptionId = subscription.id;
    user.subscriptionStatus = subscription.status;
    user.subscriptionPeriodEnd = new Date(subscription.current_period_end * 1000);
    user.role = subscription.status === 'active' ? 'pro_user' : 'free_user';
    
    // Determine plan from price ID
    const priceId = subscription.items.data[0]?.price?.id;
    console.log('💰 Price ID:', priceId);
    console.log('🔑 Available price IDs:', {
      STRIPE_PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY,
      STRIPE_PRO_ANNUAL: process.env.STRIPE_PRO_ANNUAL,
      STRIPE_PREMIUM_MONTHLY: process.env.STRIPE_PREMIUM_MONTHLY,
      STRIPE_PREMIUM_ANNUAL: process.env.STRIPE_PREMIUM_ANNUAL
    });
    
    if (priceId) {
      // Check against all price IDs (both monthly and annual)
      if (priceId === process.env.STRIPE_PRO_MONTHLY || priceId === process.env.STRIPE_PRO_ANNUAL) {
        user.subscriptionPlan = 'Pro';
        console.log('✅ Matched Pro plan');
      } else if (priceId === process.env.STRIPE_PREMIUM_MONTHLY || priceId === process.env.STRIPE_PREMIUM_ANNUAL) {
        user.subscriptionPlan = 'Premium';
        console.log('✅ Matched Premium plan');
      } else {
        // Fallback - check if the price ID contains plan keywords
        console.warn('⚠️ Unknown price ID, using fallback detection');
        const priceLower = priceId.toLowerCase();
        if (priceLower.includes('premium')) {
          user.subscriptionPlan = 'Premium';
        } else {
          user.subscriptionPlan = 'Pro'; // Default fallback
        }
        console.log('⚠️ Fallback plan set to:', user.subscriptionPlan);
      }
    } else {
      console.error('❌ No price ID found in subscription');
      user.subscriptionPlan = 'Pro'; // Default fallback
    }
    
    await user.save();
    
    console.log(`✅ Updated subscription for user ${user.email}`);
    console.log(`   Plan: ${user.subscriptionPlan}`);
    console.log(`   Status: ${user.subscriptionStatus}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Period End: ${user.subscriptionPeriodEnd}`);
  } else {
    console.warn(`⚠️ User not found for customer ${subscription.customer}`);
  }
}

async function handleSubscriptionDeleted(subscription) {
  const user = await User.findOne({ stripeCustomerId: subscription.customer });
  
  if (user) {
    user.subscriptionStatus = 'canceled';
    user.subscriptionPlan = null;
    user.role = 'free_user';
    await user.save();
    
    console.log(`❌ Subscription deleted for user ${user.email}`);
  }
}

async function handlePaymentSucceeded(invoice) {
  const user = await User.findOne({ stripeCustomerId: invoice.customer });
  
  if (user) {
    console.log(`💰 Payment succeeded for user ${user.email}`);
    // Could send a confirmation email or notification here
  }
}

async function handlePaymentFailed(invoice) {
  const user = await User.findOne({ stripeCustomerId: invoice.customer });
  
  if (user) {
    user.subscriptionStatus = 'past_due';
    await user.save();
    
    console.log(`⚠️ Payment failed for user ${user.email}`);
    // Could send a notification here
  }
}

// Purchase AI credits (one-time payment)
exports.purchaseCredits = async (req, res) => {
  try {
    const { package: packageType } = req.body; // 'small', 'medium', or 'large'

    // Define credit packages
    const packages = {
      small: { credits: 10, price: 999, label: '10 Credits' },
      medium: { credits: 50, price: 3999, label: '50 Credits' },
      large: { credits: 100, price: 6999, label: '100 Credits' }
    };

    const selectedPackage = packages[packageType];
    if (!selectedPackage) {
      return res.status(400).json({ error: 'Invalid package type' });
    }

    // Create or get Stripe customer
    let customerId = req.user.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        metadata: {
          userId: req.user._id.toString(),
          firebaseUid: req.user.firebaseUid
        }
      });
      
      customerId = customer.id;
      req.user.stripeCustomerId = customerId;
      await req.user.save();
    }

    // Create one-time payment session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `AI Credits - ${selectedPackage.label}`,
              description: `Purchase ${selectedPackage.credits} AI credits for advanced features`,
              images: []
            },
            unit_amount: selectedPackage.price, // Price in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // One-time payment, not subscription
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/analytics/deep?purchase=success&credits=${selectedPackage.credits}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/analytics/deep?purchase=cancelled`,
      metadata: {
        userId: req.user._id.toString(),
        creditsAmount: selectedPackage.credits.toString(),
        packageType: packageType
      }
    });

    res.json({ 
      sessionId: session.id, 
      url: session.url,
      credits: selectedPackage.credits 
    });
  } catch (error) {
    console.error('Purchase credits error:', error);
    res.status(500).json({ error: 'Failed to create purchase session' });
  }
};

module.exports = exports;
