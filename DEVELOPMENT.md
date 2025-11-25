# 👨‍💻 Development Workflow Guide

## Daily Development Routine

### Starting Development
```bash
# Terminal 1 - Backend
cd /Users/ihorromanenko/Desktop/test25
npm run backend:dev

# Terminal 2 - Frontend  
cd /Users/ihorromanenko/Desktop/test25
npm run dev

# Terminal 3 - Mobile (optional)
cd /Users/ihorromanenko/Desktop/test25/mobile
npm run ios
# or
npm run android
```

### Making Changes

#### 1. Backend Changes
Files auto-reload with nodemon:
- Edit files in `backend/`
- Save
- Server restarts automatically
- Test API with Postman/curl

#### 2. Frontend Changes
Next.js hot reload:
- Edit files in `app/`, `components/`, `contexts/`
- Save
- Browser updates instantly
- No manual refresh needed

#### 3. Database Schema Changes
- Edit model in `backend/models/`
- Restart backend server
- Mongoose auto-syncs schema
- Test with API calls

---

## Common Development Tasks

### Adding a New API Endpoint

1. **Create Controller Function**
```javascript
// backend/controllers/newController.js
exports.newFunction = async (req, res) => {
  try {
    // Your logic here
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

2. **Create Route**
```javascript
// backend/routes/new.js
const express = require('express');
const router = express.Router();
const { newFunction } = require('../controllers/newController');
const { authenticateUser } = require('../middleware/auth');

router.use(authenticateUser);
router.post('/action', newFunction);

module.exports = router;
```

3. **Add to Server**
```javascript
// backend/server.js
app.use('/api/new', require('./routes/new'));
```

4. **Test**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data": "value"}' \
  http://localhost:5000/api/new/action
```

### Adding a New Frontend Page

1. **Create Page File**
```javascript
// app/dashboard/new-page/page.js
'use client';

import { useState, useEffect } from 'react';

export default function NewPage() {
  return (
    <div>
      <h1>New Page</h1>
    </div>
  );
}
```

2. **Add to Navigation**
```javascript
// app/dashboard/layout.js
const navigation = [
  // ...existing items
  { name: 'New Page', href: '/dashboard/new-page', icon: '🆕' },
];
```

3. **Test**
Visit: http://localhost:3000/dashboard/new-page

### Adding a New Database Model

1. **Create Model**
```javascript
// backend/models/NewModel.js
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: String,
  // Add fields
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NewModel', schema);
```

2. **Create Controller**
```javascript
// backend/controllers/newModelController.js
const NewModel = require('../models/NewModel');

exports.getAll = async (req, res) => {
  const items = await NewModel.find({ userId: req.user._id });
  res.json({ items });
};

exports.create = async (req, res) => {
  const item = await NewModel.create({
    ...req.body,
    userId: req.user._id
  });
  res.status(201).json({ item });
};
```

3. **Create Routes**
```javascript
// backend/routes/newModel.js
const express = require('express');
const router = express.Router();
const { getAll, create } = require('../controllers/newModelController');
const { authenticateUser } = require('../middleware/auth');

router.use(authenticateUser);
router.get('/', getAll);
router.post('/', create);

module.exports = router;
```

---

## Testing Workflow

### Manual Testing

1. **Test Authentication**
```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -d '{"email":"test@test.com","password":"test123"}'

# Get token from Firebase
# Use token in subsequent requests
```

2. **Test API Endpoints**
```bash
# Get projects
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/projects

# Create project
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","platform":"YouTube"}' \
  http://localhost:5000/api/projects
```

3. **Test in Browser**
- Open http://localhost:3000
- Sign up / Sign in
- Test features manually
- Check browser console for errors
- Check Network tab for API calls

### Automated Testing

```bash
# Run all tests
npm test

# Run specific test
npm test auth.test.js

# Run with coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

### Writing Tests

```javascript
// __tests__/controllers/project.test.js
const projectController = require('../../backend/controllers/projectController');

describe('Project Controller', () => {
  it('should create a project', async () => {
    const req = {
      user: { _id: 'userId' },
      body: { title: 'Test' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    await projectController.createProject(req, res);
    
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
```

---

## Debugging

### Backend Debugging

1. **Add Console Logs**
```javascript
console.log('Debug:', variable);
```

2. **Use VS Code Debugger**
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/server.js",
      "envFile": "${workspaceFolder}/.env"
    }
  ]
}
```

3. **Check Logs**
```bash
# Terminal with backend running
# Logs appear in real-time

# Or check MongoDB logs
# MongoDB Atlas dashboard
```

### Frontend Debugging

1. **Browser DevTools**
- F12 or Cmd+Option+I
- Console tab for errors
- Network tab for API calls
- React DevTools extension

2. **Next.js Debugging**
```javascript
// Add to any component
useEffect(() => {
  console.log('Component mounted');
  console.log('Props:', props);
}, []);
```

3. **API Call Debugging**
```javascript
// lib/api.js
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
```

---

## Database Management

### MongoDB Compass (GUI)
1. Download: https://www.mongodb.com/products/compass
2. Connect with your MONGODB_URI
3. Browse collections
4. Run queries
5. Edit documents

### MongoDB Shell
```bash
# Connect
mongo "mongodb+srv://cluster.mongodb.net/creator-tracker"

# List collections
show collections

# Find users
db.users.find()

# Find projects for specific user
db.projects.find({ userId: ObjectId("...") })

# Update document
db.projects.updateOne(
  { _id: ObjectId("...") },
  { $set: { status: "Posted" } }
)

# Delete document
db.projects.deleteOne({ _id: ObjectId("...") })
```

---

## Git Workflow

### Daily Commits
```bash
git status
git add .
git commit -m "feat: add new feature"
git push origin main
```

### Feature Branch Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# Commit frequently
git add .
git commit -m "feat: implement feature"

# Push to remote
git push origin feature/new-feature

# Create pull request on GitHub
# Merge after review
```

### Commit Message Format
```
feat: add new feature
fix: fix bug in controller
docs: update README
style: format code
refactor: restructure component
test: add tests
chore: update dependencies
```

---

## Environment Management

### Development Environment
```bash
# .env
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Production Environment
```bash
# .env.production
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.yourapp.com
```

### Testing Environment
```bash
# .env.test
NODE_ENV=test
MONGODB_URI=mongodb://localhost:27017/test
```

---

## Code Quality

### Linting
```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### Formatting
```bash
# Install Prettier (if needed)
npm install -D prettier

# Format code
npx prettier --write .

# Add to package.json
"scripts": {
  "format": "prettier --write ."
}
```

### Pre-commit Hooks
Already configured in setup.sh:
```bash
# .git/hooks/pre-commit
#!/bin/bash
npm run lint
```

---

## Performance Monitoring

### Backend Performance
```javascript
// Add timing middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });
  next();
});
```

### Frontend Performance
- Use React DevTools Profiler
- Check Lighthouse score
- Monitor bundle size
- Use Next.js Analytics

---

## Troubleshooting Common Issues

### "Port already in use"
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "MongoDB connection failed"
- Check MONGODB_URI in .env
- Verify IP whitelist in MongoDB Atlas
- Check network connectivity

### "Firebase auth error"
- Verify Firebase config in .env
- Check Firebase console settings
- Regenerate service account key

### "Stripe webhook not working"
- Use Stripe CLI for local testing
- Verify webhook secret
- Check webhook endpoint URL

---

## Productivity Tips

### VS Code Extensions
- ES7+ React/Redux snippets
- Tailwind CSS IntelliSense
- MongoDB for VS Code
- REST Client
- GitLens

### Keyboard Shortcuts
- `Cmd+P` - Quick file open
- `Cmd+Shift+F` - Search in files
- `Cmd+B` - Toggle sidebar
- `Ctrl+` - Toggle terminal
- `F5` - Start debugging

### Code Snippets
Create `.vscode/snippets.code-snippets`:
```json
{
  "React Component": {
    "prefix": "rfc",
    "body": [
      "'use client';",
      "",
      "export default function ${1:Component}() {",
      "  return (",
      "    <div>",
      "      $0",
      "    </div>",
      "  );",
      "}"
    ]
  }
}
```

---

## Best Practices

### Code Organization
- One component per file
- Group related files in folders
- Use meaningful names
- Keep functions small
- Add comments for complex logic

### Error Handling
- Always use try-catch in async functions
- Return appropriate HTTP status codes
- Provide meaningful error messages
- Log errors for debugging

### Security
- Never commit .env files
- Validate all user input
- Use parameterized queries
- Keep dependencies updated
- Use HTTPS in production

### Performance
- Use pagination for large datasets
- Add database indexes
- Implement caching
- Optimize images
- Lazy load components

---

## Quick Reference

### Start Development
```bash
npm run backend:dev  # Terminal 1
npm run dev          # Terminal 2
```

### Run Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
```

### Deploy
```bash
git push heroku main  # Backend
vercel --prod         # Frontend
```

---

Happy coding! 🚀
