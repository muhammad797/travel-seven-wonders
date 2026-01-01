import { authService } from '../auth.service';
import { User } from '../user.model';
import { createMockSignupInput } from './auth.testHelpers';

describe('AuthService', () => {
  describe('signup', () => {
    it('should create a new user and return token', async () => {
      const signupData = createMockSignupInput();

      const result = await authService.signup(signupData);

      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(signupData.email.toLowerCase());
      expect(result.user.firstName).toBe(signupData.firstName);
      expect(result.user.lastName).toBe(signupData.lastName);
      expect(result.user.rewardPoints).toBe(0);
      expect(result.user.id).toBeDefined();
      expect(result.user.password).toBeUndefined(); // Password should not be in response
    });

    it('should hash password before saving', async () => {
      const signupData = createMockSignupInput({ password: 'TestPassword123!' });

      await authService.signup(signupData);

      const user = await User.findOne({ email: signupData.email }).select('+password');
      expect(user).not.toBeNull();
      expect(user?.password).not.toBe(signupData.password);
      expect(user?.password).toHaveLength(60); // bcrypt hash length
    });

    it('should generate avatar URL if not provided', async () => {
      const signupData = createMockSignupInput();
      delete (signupData as any).avatar;

      const result = await authService.signup(signupData);

      expect(result.user.avatar).toBeDefined();
      expect(result.user.avatar).toContain('dicebear.com');
    });

    it('should throw error if email already exists', async () => {
      const signupData = createMockSignupInput();
      await authService.signup(signupData);

      await expect(authService.signup(signupData)).rejects.toThrow(
        'User with this email already exists'
      );
    });

    it('should convert email to lowercase', async () => {
      const signupData = createMockSignupInput({ email: 'Test@Example.COM' });

      const result = await authService.signup(signupData);

      expect(result.user.email).toBe('test@example.com');
    });

    it('should set default reward points to 0', async () => {
      const signupData = createMockSignupInput();

      const result = await authService.signup(signupData);

      expect(result.user.rewardPoints).toBe(0);
    });
  });

  describe('login', () => {
    it('should login user with correct credentials', async () => {
      const signupData = createMockSignupInput();
      await authService.signup(signupData);

      const result = await authService.login({
        email: signupData.email,
        password: signupData.password,
      });

      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(signupData.email.toLowerCase());
    });

    it('should throw error for invalid email', async () => {
      await expect(
        authService.login({
          email: 'nonexistent@example.com',
          password: 'TestPassword123!',
        })
      ).rejects.toThrow('Invalid email or password');
    });

    it('should throw error for invalid password', async () => {
      const signupData = createMockSignupInput();
      await authService.signup(signupData);

      await expect(
        authService.login({
          email: signupData.email,
          password: 'WrongPassword123!',
        })
      ).rejects.toThrow('Invalid email or password');
    });

    it('should be case-insensitive for email', async () => {
      const signupData = createMockSignupInput();
      await authService.signup(signupData);

      const result = await authService.login({
        email: signupData.email.toUpperCase(),
        password: signupData.password,
      });

      expect(result.user.email).toBe(signupData.email.toLowerCase());
    });
  });

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      const signupData = createMockSignupInput();
      const signupResult = await authService.signup(signupData);

      const result = await authService.getUserById(signupResult.user.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(signupResult.user.id);
      expect(result?.email).toBe(signupData.email.toLowerCase());
    });

    it('should return null if user not found', async () => {
      const result = await authService.getUserById('507f1f77bcf86cd799439011');

      expect(result).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      const signupData = createMockSignupInput();
      await authService.signup(signupData);

      const result = await authService.getUserByEmail(signupData.email);

      expect(result).not.toBeNull();
      expect(result?.email).toBe(signupData.email.toLowerCase());
    });

    it('should return null if user not found', async () => {
      const result = await authService.getUserByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });

    it('should be case-insensitive for email', async () => {
      const signupData = createMockSignupInput();
      await authService.signup(signupData);

      const result = await authService.getUserByEmail(signupData.email.toUpperCase());

      expect(result).not.toBeNull();
      expect(result?.email).toBe(signupData.email.toLowerCase());
    });
  });

  describe('updateRewardPoints', () => {
    it('should update user reward points', async () => {
      const signupData = createMockSignupInput();
      const signupResult = await authService.signup(signupData);

      const result = await authService.updateRewardPoints(signupResult.user.id, 100);

      expect(result.rewardPoints).toBe(100);
    });

    it('should increment reward points', async () => {
      const signupData = createMockSignupInput();
      const signupResult = await authService.signup(signupData);
      await authService.updateRewardPoints(signupResult.user.id, 50);

      const result = await authService.updateRewardPoints(signupResult.user.id, 25);

      expect(result.rewardPoints).toBe(75);
    });

    it('should throw error if user not found', async () => {
      await expect(
        authService.updateRewardPoints('507f1f77bcf86cd799439011', 100)
      ).rejects.toThrow('User not found');
    });
  });

  describe('generateAuthResponse', () => {
    it('should generate auth response from user object', async () => {
      const signupData = createMockSignupInput();
      const signupResult = await authService.signup(signupData);

      const user = await User.findById(signupResult.user.id);
      expect(user).not.toBeNull();

      const result = authService.generateAuthResponse(user!);

      expect(result.token).toBeDefined();
      expect(result.user.id).toBe(signupResult.user.id);
      expect(result.user.email).toBe(signupData.email.toLowerCase());
    });
  });
});

