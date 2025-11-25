const { authenticateUser, checkProUser } = require('../../backend/middleware/auth');
const User = require('../../backend/models/User');

// Mock Firebase auth
jest.mock('../../backend/config/firebase', () => ({
  auth: {
    verifyIdToken: jest.fn()
  }
}));

const { auth } = require('../../backend/config/firebase');

describe('Auth Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('authenticateUser', () => {
    it('should reject request without authorization header', async () => {
      await authenticateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'No token provided' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token format', async () => {
      mockReq.headers.authorization = 'InvalidFormat';

      await authenticateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'No token provided' });
    });

    it('should reject request with invalid token', async () => {
      mockReq.headers.authorization = 'Bearer invalid-token';
      auth.verifyIdToken.mockRejectedValue(new Error('Invalid token'));

      await authenticateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid token' });
    });

    it('should authenticate valid token and create user if not exists', async () => {
      const mockToken = {
        uid: 'test-uid',
        email: 'test@example.com',
        name: 'Test User',
      };

      mockReq.headers.authorization = 'Bearer valid-token';
      auth.verifyIdToken.mockResolvedValue(mockToken);

      // Mock User.findOne to return null (user doesn't exist)
      jest.spyOn(User, 'findOne').mockResolvedValue(null);
      jest.spyOn(User, 'create').mockResolvedValue({
        _id: 'user-id',
        firebaseUid: mockToken.uid,
        email: mockToken.email,
      });

      await authenticateUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
      expect(mockReq.firebaseUid).toBe(mockToken.uid);
    });
  });

  describe('checkProUser', () => {
    it('should allow pro users with active subscription', () => {
      mockReq.user = {
        role: 'pro_user',
        subscriptionStatus: 'active',
      };

      checkProUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should reject free users', () => {
      mockReq.user = {
        role: 'free_user',
        subscriptionStatus: 'none',
      };

      checkProUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Pro subscription required',
        message: 'This feature is only available for Pro users',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject pro users without active subscription', () => {
      mockReq.user = {
        role: 'pro_user',
        subscriptionStatus: 'canceled',
      };

      checkProUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
