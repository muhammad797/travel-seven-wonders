import { SignupInput, CreateUserInput } from '../auth.types';

/**
 * Create a mock user signup input for testing
 */
export const createMockSignupInput = (overrides?: Partial<SignupInput>): SignupInput => {
  return {
    email: 'test@example.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    ...overrides,
  };
};

/**
 * Create a mock user creation input for testing
 */
export const createMockUserInput = (overrides?: Partial<CreateUserInput>): CreateUserInput => {
  return {
    email: 'test@example.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test',
    ...overrides,
  };
};

/**
 * Create multiple mock signup inputs
 */
export const createMockSignupInputs = (count: number): SignupInput[] => {
  return Array.from({ length: count }, (_, i) =>
    createMockSignupInput({
      email: `test${i + 1}@example.com`,
      firstName: `Test${i + 1}`,
      lastName: `User${i + 1}`,
    })
  );
};

