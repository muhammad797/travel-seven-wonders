import request from 'supertest';
import { createTestApp } from '../../../__tests__/helpers/testApp';
import { User } from '../user.model';
import { createMockSignupInput } from './auth.testHelpers';

describe('Auth API Endpoints', () => {
  const app = createTestApp();

  describe('POST /api/auth/signup', () => {
    it('should create a new user and return token', async () => {
      const signupData = createMockSignupInput();

      const response = await request(app)
        .post('/api/auth/signup')
        .send(signupData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(signupData.email.toLowerCase());
      expect(response.body.data.user.firstName).toBe(signupData.firstName);
      expect(response.body.data.user.lastName).toBe(signupData.lastName);
      expect(response.body.data.user.rewardPoints).toBe(0);
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should return 409 if email already exists', async () => {
      const signupData = createMockSignupInput();
      await request(app).post('/api/auth/signup').send(signupData).expect(201);

      const response = await request(app)
        .post('/api/auth/signup')
        .send(signupData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          // Missing password, firstName, lastName
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });

    it('should convert email to lowercase', async () => {
      const signupData = createMockSignupInput({ email: 'Test@Example.COM' });

      const response = await request(app)
        .post('/api/auth/signup')
        .send(signupData)
        .expect(201);

      expect(response.body.data.user.email).toBe('test@example.com');
    });

    it('should generate avatar if not provided', async () => {
      const signupData = createMockSignupInput();
      delete (signupData as any).avatar;

      const response = await request(app)
        .post('/api/auth/signup')
        .send(signupData)
        .expect(201);

      expect(response.body.data.user.avatar).toBeDefined();
      expect(response.body.data.user.avatar).toContain('dicebear.com');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a user for login tests
      const signupData = createMockSignupInput();
      await request(app).post('/api/auth/signup').send(signupData);
    });

    it('should login user with correct credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'TestPassword123!',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(loginData.email.toLowerCase());
    });

    it('should return 401 for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'TestPassword123!',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid email or password');
    });

    it('should return 401 for invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid email or password');
    });

    it('should be case-insensitive for email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'TEST@EXAMPLE.COM',
          password: 'TestPassword123!',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('test@example.com');
    });

    it('should return 400 if email is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'TestPassword123!',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 if password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken: string;

    beforeEach(async () => {
      // Create a user and get token
      const signupData = createMockSignupInput();
      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send(signupData);
      authToken = signupResponse.body.data.token;
    });

    it('should return current user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.password).toBeUndefined();
    });

    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/auth/me').expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Unauthorized');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Unauthorized');
    });

    it('should return 401 with malformed token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    let authToken: string;

    beforeEach(async () => {
      // Create a user and get token
      const signupData = createMockSignupInput();
      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send(signupData);
      authToken = signupResponse.body.data.token;
    });

    it('should logout user with valid token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('successfully');
    });

    it('should return 401 without token', async () => {
      const response = await request(app).post('/api/auth/logout').expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('User Model Integration', () => {
    it('should hash password before saving', async () => {
      const signupData = createMockSignupInput();

      await request(app).post('/api/auth/signup').send(signupData).expect(201);

      const user = await User.findOne({ email: signupData.email }).select('+password');
      expect(user).not.toBeNull();
      expect(user?.password).not.toBe(signupData.password);
      expect(user?.password).toHaveLength(60); // bcrypt hash length
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'invalid-email',
          password: 'TestPassword123!',
          firstName: 'Test',
          lastName: 'User',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should enforce unique email constraint', async () => {
      const signupData = createMockSignupInput();
      await request(app).post('/api/auth/signup').send(signupData).expect(201);

      // Try to create another user with same email
      const response = await request(app)
        .post('/api/auth/signup')
        .send(signupData)
        .expect(409);

      expect(response.body.success).toBe(false);
    });
  });
});

