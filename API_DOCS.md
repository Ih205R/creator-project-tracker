# API Documentation

Base URL: `http://localhost:5000/api` (development)

## Authentication

All endpoints (except webhooks) require authentication via Firebase ID token.

### Headers
```
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

---

## Projects

### Get All Projects
```
GET /projects
```

**Response:**
```json
{
  "projects": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "My YouTube Video",
      "description": "Video about React",
      "platform": "YouTube",
      "status": "Drafting",
      "priority": "High",
      "tags": ["react", "tutorial"],
      "dueDate": "2024-12-31T00:00:00.000Z",
      "createdAt": "2024-11-16T00:00:00.000Z",
      "updatedAt": "2024-11-16T00:00:00.000Z"
    }
  ]
}
```

### Create Project
```
POST /projects
```

**Request Body:**
```json
{
  "title": "New Video Idea",
  "description": "Description here",
  "platform": "YouTube",
  "status": "Idea",
  "priority": "Medium",
  "tags": ["tech"],
  "dueDate": "2024-12-31"
}
```

**Response:** `201 Created`
```json
{
  "project": { ... }
}
```

### Get Single Project
```
GET /projects/:id
```

### Update Project
```
PUT /projects/:id
```

**Request Body:** (any fields to update)
```json
{
  "status": "Editing",
  "priority": "Urgent"
}
```

### Delete Project
```
DELETE /projects/:id
```

**Response:** `200 OK`
```json
{
  "message": "Project deleted successfully"
}
```

### Update Project Order (Drag & Drop)
```
POST /projects/order
```

**Request Body:**
```json
{
  "updates": [
    {
      "id": "507f1f77bcf86cd799439011",
      "status": "Drafting",
      "order": 0
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "status": "Drafting",
      "order": 1
    }
  ]
}
```

---

## Brand Deals

### Get All Brand Deals
```
GET /brand-deals
```

### Create Brand Deal
```
POST /brand-deals
```

**Request Body:**
```json
{
  "brandName": "TechCorp",
  "contactPerson": "John Doe",
  "contactEmail": "john@techcorp.com",
  "amount": 5000,
  "currency": "USD",
  "status": "Discussion",
  "dueDate": "2024-12-31",
  "notes": "Partnership for 3 videos",
  "deliverables": ["3 YouTube videos", "2 Instagram posts"]
}
```

### Get Brand Deal Statistics
```
GET /brand-deals/stats
```

**Response:**
```json
{
  "stats": [
    {
      "_id": "Completed",
      "count": 5,
      "totalAmount": 25000
    },
    {
      "_id": "In Progress",
      "count": 2,
      "totalAmount": 10000
    }
  ],
  "totalRevenue": 25000
}
```

### Get Single Brand Deal
```
GET /brand-deals/:id
```

### Update Brand Deal
```
PUT /brand-deals/:id
```

### Delete Brand Deal
```
DELETE /brand-deals/:id
```

---

## Calendar

### Get Calendar Items
```
GET /calendar?startDate=2024-11-01&endDate=2024-11-30
```

**Query Parameters:**
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string

**Response:**
```json
{
  "items": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Video Upload",
      "description": "Upload tutorial video",
      "startDate": "2024-11-20T14:00:00.000Z",
      "endDate": "2024-11-20T15:00:00.000Z",
      "allDay": false,
      "type": "content",
      "projectId": "507f1f77bcf86cd799439012"
    }
  ]
}
```

### Create Calendar Item
```
POST /calendar
```

**Request Body:**
```json
{
  "title": "Video Upload",
  "description": "Upload to YouTube",
  "startDate": "2024-11-20T14:00:00.000Z",
  "endDate": "2024-11-20T15:00:00.000Z",
  "allDay": false,
  "type": "content",
  "projectId": "507f1f77bcf86cd799439012"
}
```

### Update Calendar Item
```
PUT /calendar/:id
```

### Delete Calendar Item
```
DELETE /calendar/:id
```

---

## AI Tools (Pro Users Only)

### Generate Captions
```
POST /ai/captions
```

**Request Body:**
```json
{
  "title": "How to Learn React",
  "description": "Beginner tutorial",
  "platform": "Instagram",
  "tone": "professional"
}
```

**Response:**
```json
{
  "captions": [
    "🚀 Master React in 2024! This comprehensive guide...",
    "Learn React the right way! 💻 In this tutorial...",
    "React made simple! ✨ Perfect for beginners..."
  ]
}
```

### Generate Titles
```
POST /ai/titles
```

**Request Body:**
```json
{
  "topic": "React Hooks Tutorial",
  "platform": "YouTube",
  "keywords": ["react", "hooks", "tutorial"]
}
```

**Response:**
```json
{
  "titles": [
    "React Hooks Complete Guide 2024 - Master useState, useEffect & More!",
    "Learn React Hooks in 20 Minutes - Beginner to Pro",
    "React Hooks Tutorial: The Ultimate Guide for Modern React",
    "Master React Hooks Today - Complete Beginner's Guide",
    "React Hooks Explained: Everything You Need to Know"
  ]
}
```

### Generate Script Outline
```
POST /ai/script
```

**Request Body:**
```json
{
  "title": "React Hooks Tutorial",
  "topic": "Teaching React hooks to beginners",
  "duration": "10-15 minutes",
  "platform": "YouTube"
}
```

**Response:**
```json
{
  "script": "**HOOK (0:00-0:30)**\n\n- Open with a relatable problem...\n\n**INTRO (0:30-1:00)**\n\n- Introduce yourself...\n\n**MAIN CONTENT**\n\n1. What are React Hooks?...\n\n**CALL TO ACTION**\n\n- Ask viewers to subscribe...\n\n**OUTRO**\n\n- Thank viewers..."
}
```

### Generate All Suggestions
```
POST /ai/all
```

**Request Body:**
```json
{
  "title": "React Hooks Tutorial",
  "description": "Complete guide to React Hooks",
  "platform": "YouTube"
}
```

**Response:**
```json
{
  "suggestions": {
    "captions": ["...", "...", "..."],
    "titles": ["...", "...", "..."],
    "script": "..."
  }
}
```

---

## Stripe

### Create Checkout Session
```
POST /stripe/create-checkout-session
```

**Request Body:**
```json
{
  "priceId": "price_xxxxx"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_xxxxx",
  "url": "https://checkout.stripe.com/pay/cs_test_xxxxx"
}
```

### Create Billing Portal Session
```
POST /stripe/create-portal-session
```

**Response:**
```json
{
  "url": "https://billing.stripe.com/session/xxxxx"
}
```

### Get Subscription Status
```
GET /stripe/subscription-status
```

**Response:**
```json
{
  "subscription": {
    "status": "active",
    "role": "pro_user",
    "periodEnd": "2024-12-16T00:00:00.000Z",
    "customerId": "cus_xxxxx"
  }
}
```

### Stripe Webhook (No Auth Required)
```
POST /stripe/webhook
```

This endpoint handles Stripe webhook events. Configure in Stripe Dashboard.

**Webhook Events Handled:**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

---

## User

### Get Profile
```
GET /user/profile
```

**Response:**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firebaseUid": "xxxxx",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "pro_user",
    "subscriptionStatus": "active",
    "preferences": {
      "theme": "dark",
      "notifications": {
        "email": true,
        "push": true
      }
    }
  }
}
```

### Update Profile
```
PUT /user/profile
```

**Request Body:**
```json
{
  "displayName": "Jane Doe",
  "preferences": {
    "theme": "dark",
    "notifications": {
      "email": true,
      "push": false
    }
  }
}
```

### Update Push Token
```
POST /user/push-token
```

**Request Body:**
```json
{
  "token": "fcm_device_token_here"
}
```

### Remove Push Token
```
DELETE /user/push-token
```

**Request Body:**
```json
{
  "token": "fcm_device_token_here"
}
```

### Get User Statistics
```
GET /user/stats
```

**Response:**
```json
{
  "stats": {
    "projects": {
      "total": 45,
      "byStatus": [
        { "_id": "Idea", "count": 10 },
        { "_id": "Drafting", "count": 15 },
        { "_id": "Posted", "count": 20 }
      ]
    },
    "brandDeals": {
      "total": 8,
      "byStatus": [
        { "_id": "Completed", "count": 5, "totalAmount": 25000 },
        { "_id": "In Progress", "count": 3, "totalAmount": 15000 }
      ]
    }
  }
}
```

---

## Notifications

### Get Notifications
```
GET /notifications?unreadOnly=true
```

**Query Parameters:**
- `unreadOnly` (optional): boolean, default false

**Response:**
```json
{
  "notifications": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "type": "due_date",
      "title": "⏰ Project Due Soon",
      "body": "\"My Video\" is due in less than 24 hours!",
      "data": {
        "projectId": "507f1f77bcf86cd799439012",
        "projectTitle": "My Video"
      },
      "read": false,
      "createdAt": "2024-11-16T10:00:00.000Z"
    }
  ]
}
```

### Mark as Read
```
PUT /notifications/:id/read
```

### Mark All as Read
```
PUT /notifications/read-all
```

### Delete Notification
```
DELETE /notifications/:id
```

---

## Error Responses

All endpoints return standard error responses:

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Pro subscription required",
  "message": "This feature is only available for Pro users"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limits

Currently no rate limiting is implemented. It's recommended to add rate limiting in production using `express-rate-limit`.

Example implementation:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## Pagination

Large datasets should implement pagination. Add to future versions:

```
GET /projects?page=1&limit=20
```

---

## WebSocket Support (Future)

For real-time updates, consider adding Socket.IO:
- Real-time Kanban board updates
- Live collaboration
- Instant notifications

---

## API Testing

Use tools like Postman or curl:

```bash
# Get projects
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/projects

# Create project
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","platform":"YouTube"}' \
  http://localhost:5000/api/projects
```
