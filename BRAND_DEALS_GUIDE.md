# Brand Deals Feature Guide

## Overview
The Brand Deals feature allows content creators to track and manage their brand partnerships, sponsorships, and collaborations all in one place.

## Features

### 📊 Dashboard Overview
- **Total Revenue**: Track cumulative earnings from all brand deals
- **Active Deals**: Monitor currently ongoing partnerships
- **Completed Deals**: View successfully finished collaborations
- Real-time statistics with animated counters

### 📝 Deal Management

#### Create New Deal
1. Click "New Deal" button in the top right
2. Fill in the required information:
   - **Brand Name** (required)
   - **Description**: Details about the partnership
   - **Amount**: Deal value in USD
   - **Status**: pending, active, completed, or cancelled
   - **Start/End Dates**: Partnership timeline
   - **Contact Email**: Brand contact information
   - **Deliverables**: What you need to deliver (e.g., "3 Instagram posts, 1 YouTube video")
   - **Notes**: Additional information or reminders

#### Edit Deal
1. Click the pencil icon on any deal card
2. Modify the information
3. Click "Update Deal" to save changes

#### Delete Deal
1. Click the trash icon on any deal card
2. Confirm deletion in the popup
3. Deal is permanently removed

### 🎨 Status Types

- **🕒 Pending** (Yellow): Deal is in negotiation or waiting to start
- **🔵 Active** (Blue): Deal is currently ongoing
- **✅ Completed** (Green): Deal has been successfully finished
- **❌ Cancelled** (Red): Deal was cancelled or didn't work out

### 📱 Visual Design
- Clean, modern card-based layout
- Responsive design (works on mobile, tablet, and desktop)
- Dark mode support
- Smooth animations and transitions
- Color-coded status indicators

### 🔒 Access Control

#### Free Users
- Limited to **1 brand deal**
- Full access to all features within the limit
- Upgrade prompt when trying to create more deals

#### Pro Users
- **Unlimited brand deals**
- All features unlocked
- Priority support

## API Endpoints

### Get All Deals
```
GET /api/brand-deals
```
Returns all brand deals for the authenticated user.

### Create Deal
```
POST /api/brand-deals
Body: {
  brandName: string (required),
  description: string,
  amount: number,
  status: string,
  startDate: date,
  endDate: date,
  deliverables: string,
  contactEmail: string,
  notes: string
}
```

### Update Deal
```
PUT /api/brand-deals/:id
Body: Same as create
```

### Delete Deal
```
DELETE /api/brand-deals/:id
```

### Get Statistics
```
GET /api/brand-deals/stats
```
Returns aggregated statistics about deals.

## Usage Tips

### Best Practices
1. **Update Status Regularly**: Keep your deals status current for accurate tracking
2. **Document Deliverables**: Clearly list what you need to deliver
3. **Track Payments**: Update status to "completed" once paid
4. **Save Contact Info**: Always include brand contact email
5. **Use Notes**: Add contract details, special requirements, or reminders

### Organizing Deals
- Use dates to track campaign timelines
- Set reminders for delivery deadlines
- Review completed deals to calculate total earnings
- Keep cancelled deals for records and learning

### Revenue Tracking
- The dashboard shows total revenue across all deals
- Filter by status to see pending vs. completed earnings
- Use the stats to track your growth over time

## Technical Details

### Frontend
- **Location**: `/app/brand-deals/page.js`
- **Framework**: Next.js 14 (App Router)
- **UI Library**: Framer Motion for animations
- **Icons**: Lucide React Icons
- **Styling**: Tailwind CSS

### Backend
- **Controller**: `/backend/controllers/brandDealController.js`
- **Routes**: `/backend/routes/brandDeals.js`
- **Model**: `/backend/models/BrandDeal.js`
- **Authentication**: JWT-based user authentication

### Database Schema
```javascript
{
  userId: ObjectId (ref: User),
  brandName: String (required),
  description: String,
  amount: Number (default: 0),
  status: String (enum: pending, active, completed, cancelled),
  startDate: Date,
  endDate: Date,
  deliverables: String,
  contactEmail: String,
  notes: String,
  relatedProjects: [ObjectId] (ref: Project),
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### Deal Not Saving
- Ensure "Brand Name" is filled in (required field)
- Check network connection
- Verify user is authenticated
- Check browser console for errors

### Can't Create More Deals (Free Users)
- Free users are limited to 1 brand deal
- Upgrade to Pro for unlimited deals
- Or delete an existing deal to create a new one

### Stats Not Updating
- Refresh the page
- Ensure deals have amounts entered
- Check that status is set correctly

## Future Enhancements (Roadmap)

- [ ] Invoice generation and PDF export
- [ ] Payment tracking and reminders
- [ ] Contract upload and storage
- [ ] Email integration for brand contacts
- [ ] Revenue analytics and charts
- [ ] Deal templates for common partnerships
- [ ] Calendar integration for deadlines
- [ ] Notification reminders for deliverables
- [ ] Export to CSV/Excel
- [ ] Multi-currency support

## Support

For issues or questions:
- Check the FAQ
- Contact support through the dashboard
- Visit the help center
- Email: support@yourapp.com

---

**Last Updated**: January 2025
**Version**: 1.0
