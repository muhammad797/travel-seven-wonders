import { User } from '../user.model';
import { createMockUserInput } from './auth.testHelpers';

describe('User Model', () => {
  describe('Password Hashing', () => {
    it('should hash password before saving', async () => {
      const userData = createMockUserInput({ password: 'TestPassword123!' });
      const user = new User(userData);
      await user.save();

      expect(user.password).not.toBe('TestPassword123!');
      expect(user.password).toHaveLength(60); // bcrypt hash length
      expect(user.password).toMatch(/^\$2[aby]\$/); // bcrypt hash format
    });

    it('should not rehash password if unchanged', async () => {
      const userData = createMockUserInput();
      const user = new User(userData);
      await user.save();

      const originalPassword = user.password;
      user.firstName = 'Updated';
      await user.save();

      expect(user.password).toBe(originalPassword);
    });

    it('should rehash password if changed', async () => {
      const userData = createMockUserInput();
      const user = new User(userData);
      await user.save();

      const originalPassword = user.password;
      user.password = 'NewPassword123!';
      await user.save();

      expect(user.password).not.toBe(originalPassword);
      expect(user.password).not.toBe('NewPassword123!');
    });
  });

  describe('Password Comparison', () => {
    it('should compare password correctly', async () => {
      const userData = createMockUserInput({ password: 'TestPassword123!' });
      const user = new User(userData);
      await user.save();

      const isValid = await user.comparePassword('TestPassword123!');
      expect(isValid).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const userData = createMockUserInput({ password: 'TestPassword123!' });
      const user = new User(userData);
      await user.save();

      const isValid = await user.comparePassword('WrongPassword123!');
      expect(isValid).toBe(false);
    });
  });

  describe('Email Validation', () => {
    it('should save user with valid email', async () => {
      const userData = createMockUserInput({ email: 'valid@example.com' });
      const user = new User(userData);
      await expect(user.save()).resolves.toBeDefined();
    });

    it('should convert email to lowercase', async () => {
      const userData = createMockUserInput({ email: 'Test@Example.COM' });
      const user = new User(userData);
      await user.save();

      expect(user.email).toBe('test@example.com');
    });

    it('should enforce unique email', async () => {
      const userData = createMockUserInput({ email: 'unique@example.com' });
      await User.create(userData);

      const duplicateUser = new User(userData);
      await expect(duplicateUser.save()).rejects.toThrow();
    });
  });

  describe('Default Values', () => {
    it('should set default rewardPoints to 0', async () => {
      const userData = createMockUserInput();
      delete (userData as any).rewardPoints;
      const user = new User(userData);
      await user.save();

      expect(user.rewardPoints).toBe(0);
    });

    it('should set default joinedAt to current date', async () => {
      const userData = createMockUserInput();
      const beforeSave = new Date();
      const user = new User(userData);
      await user.save();
      const afterSave = new Date();

      expect(user.joinedAt).toBeInstanceOf(Date);
      expect(user.joinedAt.getTime()).toBeGreaterThanOrEqual(beforeSave.getTime());
      expect(user.joinedAt.getTime()).toBeLessThanOrEqual(afterSave.getTime());
    });
  });

  describe('Password Field Selection', () => {
    it('should not include password in default queries', async () => {
      const userData = createMockUserInput();
      await User.create(userData);

      const user = await User.findOne({ email: userData.email });
      expect(user).not.toBeNull();
      expect((user as any).password).toBeUndefined();
    });

    it('should include password when explicitly selected', async () => {
      const userData = createMockUserInput();
      await User.create(userData);

      const user = await User.findOne({ email: userData.email }).select('+password');
      expect(user).not.toBeNull();
      expect(user?.password).toBeDefined();
    });
  });

  describe('Timestamps', () => {
    it('should set createdAt and updatedAt automatically', async () => {
      const userData = createMockUserInput();
      const user = new User(userData);
      await user.save();

      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should update updatedAt on modification', async () => {
      const userData = createMockUserInput();
      const user = new User(userData);
      await user.save();

      const originalUpdatedAt = user.updatedAt;
      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait a bit
      user.firstName = 'Updated';
      await user.save();

      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
});

