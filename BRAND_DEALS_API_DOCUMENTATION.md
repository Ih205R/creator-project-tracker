# 🎯 Brand Deals API - Complete Documentation

## Overview
Your Brand Deals feature is **fully functional** and ready to use! This document explains all available APIs and how to use them.

---

## 🔗 Base URL
```
http://localhost:5001/api/brand-deals
```

---

## 🔐 Authentication
All endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📋 Available API Endpoints

### 1. **Get All Brand Deals**
Retrieve all brand deals for the authenticated user.

**Endpoint:**
```http
GET /api/brand-deals
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200 OK):**
```json
{
  "brandDeals": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "userId": "user123",
      "brandName": "Nike",
      "description": "Sponsored content for new shoe line",
      "amount": 5000,
      "status": "active",
      "startDate": "2025-01-15T00:00:00.000Z",
      "endDate": "2025-02-15T00:00:00.000Z",
      "deliverables": "3 Instagram posts, 1 YouTube video",
      "contactEmail": "partner@nike.com",
      "notes": "Include #NikePartner in all posts",
      "relatedProjects": [],
      "createdAt": "2025-01-10T10:30:00.000Z",
      "updatedAt": "2025-01-10T10:30:00.000Z"
    }
  ]
}
```

**Frontend Usage:**
```javascript
import { brandDealsAPI } from '@/lib/api';

const response = await brandDealsAPI.getAll();
const deals = response.data.brandDeals;
```

---

### 2. **Create New Brand Deal**
Create a new brand partnership.

**Endpoint:**
```http
POST /api/brand-deals
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "brandName": "Nike",           // Required
  "description": "Shoe campaign",
  "amount": 5000,
  "status": "pending",           // pending, active, completed, cancelled
  "startDate": "2025-01-15",
  "endDate": "2025-02-15",
  "deliverables": "3 posts, 1 video",
  "contactEmail": "partner@nike.com",
  "notes": "Additional notes here"
}
```

**Response (201 Created):**
```json
{
  "brandDeal": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "userId": "user123",
    "brandName": "Nike",
    // ... rest of the fields
  }
}
```

**Frontend Usage:**
```javascript
const newDeal = {
  brandName: "Nike",
  description: "Shoe campaign",
  amount: 5000,
  status: "pending",
  startDate: "2025-01-15",
  endDate: "2025-02-15",
  deliverables: "3 posts, 1 video",
  contactEmail: "partner@nike.com",
  notes: "Additional notes"
};

const response = await brandDealsAPI.create(newDeal);
```

**Error Responses:**
```json
// 400 - Validation Error
{
  "error": "Brand name is required"
}

// 400 - Free User Limit
{
  "error": "Free users are limited to 1 brand deal. Upgrade to Pro for unlimited brand deals."
}

// 401 - Not Authenticated
{
  "error": "Authentication required"
}
```

---

### 3. **Get Single Brand Deal**
Retrieve details of a specific brand deal.

**Endpoint:**
```http
GET /api/brand-deals/:id
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200 OK):**
```json
{
  "brandDeal": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "brandName": "Nike",
    // ... all fields
  }
}
```

**Frontend Usage:**
```javascript
const response = await brandDealsAPI.getOne(dealId);
const deal = response.data.brandDeal;
```

**Error Responses:**
```json
// 404 - Not Found
{
  "error": "Brand deal not found"
}
```

---

### 4. **Update Brand Deal**
Update an existing brand deal.

**Endpoint:**
```http
PUT /api/brand-deals/:id
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "brandName": "Nike Updated",
  "status": "active",
  "amount": 6000
  // Any fields you want to update
}
```

**Response (200 OK):**
```json
{
  "brandDeal": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    // Updated fields
  }
}
```

**Frontend Usage:**
```javascript
const updates = {
  status: "completed",
  amount: 6000
};

const response = await brandDealsAPI.update(dealId, updates);
```

---

### 5. **Delete Brand Deal**
Permanently delete a brand deal.

**Endpoint:**
```http
DELETE /api/brand-deals/:id
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200 OK):**
```json
{
  "message": "Brand deal deleted successfully"
}
```

**Frontend Usage:**
```javascript
await brandDealsAPI.delete(dealId);
```

---

### 6. **Get Brand Deal Statistics**
Get aggregated statistics about your brand deals.

**Endpoint:**
```http
GET /api/brand-deals/stats
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200 OK):**
```json
{
  "stats": [
    {
      "_id": "active",
      "count": 3,
      "totalAmount": 15000
    },
    {
      "_id": "completed",
      "count": 5,
      "totalAmount": 25000
    }
  ],
  "totalRevenue": 25000
}
```

**Frontend Usage:**
```javascript
const response = await brandDealsAPI.getStats();
const { stats, totalRevenue } = response.data;
```

---

## 📊 Data Model

### Brand Deal Schema
```javascript
{
  userId: ObjectId,              // Auto-set (current user)
  brandName: String,             // Required
  description: String,           // Optional
  amount: Number,                // Default: 0
  status: String,                // Enum: pending, active, completed, cancelled
  startDate: Date,               // Optional
  endDate: Date,                 // Optional
  deliverables: String,          // Optional
  contactEmail: String,          // Optional
  notes: String,                 // Optional
  relatedProjects: [ObjectId],   // Optional (refs to Project)
  createdAt: Date,               // Auto-generated
  updatedAt: Date                // Auto-generated
}
```

### Status Options
- **pending**: Deal is being negotiated or waiting to start
- **active**: Deal is currently in progress
- **completed**: Deal has been finished successfully
- **cancelled**: Deal was cancelled or didn't work out

---

## 🎨 Frontend Implementation

### Already Implemented in `/app/brand-deals/page.js`

**Features:**
- ✅ Display all brand deals in card layout
- ✅ Create new deals via modal form
- ✅ Edit existing deals
- ✅ Delete deals with confirmation
- ✅ Real-time stats (Total Revenue, Active Deals, Completed Deals)
- ✅ Status badges with colors
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Loading states
- ✅ Error handling

**Key Components:**

1. **Stats Dashboard**
   - Shows Total Revenue, Active Deals, Completed Deals
   - Updates automatically after CRUD operations

2. **Deal Cards**
   - Displays all deal information
   - Edit and Delete buttons
   - Color-coded status indicators

3. **Create/Edit Modal**
   - Form with all fields
   - Validation (brandName required)
   - Date pickers for start/end dates
   - Status dropdown

4. **Actions**
   - Create new deal
   - Edit existing deal
   - Delete with confirmation

---

## 🧪 Testing the API

### Test with cURL

**1. Get All Deals:**
```bash
curl -X GET http://localhost:5001/api/brand-deals \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**2. Create Deal:**
```bash
curl -X POST http://localhost:5001/api/brand-deals \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "brandName": "Test Brand",
    "amount": 1000,
    "status": "pending"
  }'
```

**3. Update Deal:**
```bash
curl -X PUT http://localhost:5001/api/brand-deals/DEAL_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "active",
    "amount": 1500
  }'
```

**4. Delete Deal:**
```bash
curl -X DELETE http://localhost:5001/api/brand-deals/DEAL_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🚀 How to Use (Step by Step)

### 1. Start Your Servers
```bash
# Terminal 1: Backend
npm run backend:dev

# Terminal 2: Frontend
npm run dev
```

### 2. Access Brand Deals Page
```
http://localhost:3000/brand-deals
```

### 3. Create Your First Deal
1. Click "New Deal" button
2. Fill in the form:
   - **Brand Name**: Required (e.g., "Nike")
   - **Description**: Optional details
   - **Amount**: Deal value in dollars
   - **Status**: Select from dropdown
   - **Start/End Dates**: Campaign timeline
   - **Deliverables**: What you need to deliver
   - **Contact Email**: Brand contact
   - **Notes**: Additional information
3. Click "Create Deal"

### 4. Manage Deals
- **Edit**: Click pencil icon on any deal card
- **Delete**: Click trash icon and confirm
- **View Stats**: Check dashboard at top

---

## 🔒 Access Control

### Free Users
- **Limit**: 1 brand deal
- **Message when exceeded**: "Free users are limited to 1 brand deal. Upgrade to Pro for unlimited brand deals."
- **Enforcement**: Backend checks on creation

### Pro Users
- **Limit**: Unlimited
- **All features unlocked**

---

## 💡 Usage Examples

### Example 1: Sponsored Video
```javascript
const sponsoredVideo = {
  brandName: "Skillshare",
  description: "Educational platform sponsorship",
  amount: 2500,
  status: "active",
  startDate: "2025-01-20",
  endDate: "2025-01-27",
  deliverables: "1 integrated sponsor segment (60-90 seconds)",
  contactEmail: "partnerships@skillshare.com",
  notes: "Include custom link in description"
};

await brandDealsAPI.create(sponsoredVideo);
```

### Example 2: Product Review
```javascript
const productReview = {
  brandName: "Sony",
  description: "Camera gear review",
  amount: 3000,
  status: "pending",
  startDate: "2025-02-01",
  endDate: "2025-02-15",
  deliverables: "Full review video + social media posts",
  contactEmail: "marketing@sony.com",
  notes: "Product ships next week"
};

await brandDealsAPI.create(productReview);
```

### Example 3: Brand Ambassador
```javascript
const brandAmbassador = {
  brandName: "GymShark",
  description: "3-month brand ambassador program",
  amount: 10000,
  status: "active",
  startDate: "2025-01-01",
  endDate: "2025-03-31",
  deliverables: "12 posts across platforms, monthly vlog feature",
  contactEmail: "ambassadors@gymshark.com",
  notes: "Quarterly payment schedule"
};

await brandDealsAPI.create(brandAmbassador);
```

---

## 📈 Best Practices

### 1. **Update Status Regularly**
Keep your deal status current:
- Start as "pending" when negotiating
- Change to "active" when live
- Mark as "completed" when done
- Use "cancelled" if it doesn't work out

### 2. **Document Deliverables**
Be specific about what you need to deliver:
- "3 Instagram posts, 1 YouTube video, 5 Stories"
- "Weekly podcast mention for 4 weeks"
- "Product review video (10-15 minutes)"

### 3. **Track Payments**
Use the amount field to track revenue:
- Enter the full deal value
- Update if terms change
- Use completed status when paid

### 4. **Save Contact Info**
Always include the brand contact email:
- Quick access when needed
- Reference for follow-ups
- Contract verification

### 5. **Use Notes Field**
Document important details:
- Payment schedule
- Contract specifics
- Special requirements
- Follow-up reminders

---

## 🐛 Troubleshooting

### Issue: Can't create more than 1 deal (Free User)
**Solution**: Upgrade to Pro or delete an existing deal

### Issue: Deal not saving
**Check**:
- Brand name is filled in (required)
- User is authenticated
- Backend server is running
- Check browser console for errors

### Issue: Stats not updating
**Solution**: 
- Refresh the page
- Ensure amounts are entered
- Check status is set correctly

### Issue: Can't edit/delete deals
**Check**:
- User is authenticated
- Deal belongs to current user
- Backend server is running

---

## 🎯 API Status Checklist

✅ **Backend**
- [x] Routes configured (`/api/brand-deals`)
- [x] Controller with all CRUD operations
- [x] Model with proper schema
- [x] Authentication middleware
- [x] Free user limits
- [x] Error handling

✅ **Frontend**
- [x] API client configured (`lib/api.js`)
- [x] Brand Deals page (`/app/brand-deals/page.js`)
- [x] Create functionality
- [x] Edit functionality
- [x] Delete functionality
- [x] Stats dashboard
- [x] Loading states
- [x] Error handling
- [x] Dark mode
- [x] Responsive design

✅ **Features**
- [x] Full CRUD operations
- [x] Real-time stats
- [x] Status tracking
- [x] Date management
- [x] Contact tracking
- [x] Deliverables notes
- [x] Free user limits
- [x] Beautiful UI

---

## 📞 Support

Everything is already implemented and working! If you encounter any issues:

1. **Check servers are running**: 
   - Backend: `npm run backend:dev`
   - Frontend: `npm run dev`

2. **Check authentication**: Make sure you're logged in

3. **Check console**: Look for error messages

4. **Verify MongoDB**: Ensure database is connected

5. **Check this documentation**: All APIs are documented here

---

## 🎉 Summary

Your Brand Deals feature is **100% complete and functional**:

✅ All API endpoints working
✅ Full CRUD operations
✅ Beautiful UI with stats
✅ Free user limits enforced
✅ Dark mode support
✅ Responsive design
✅ Error handling
✅ Loading states

**Just start your servers and start using it!** 🚀

---

**Last Updated**: January 2025  
**Status**: ✅ Production Ready  
**Version**: 1.0
