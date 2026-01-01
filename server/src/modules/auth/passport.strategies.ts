import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from './user.model';
import { JWT_SECRET } from '../../config/env';
import logger from '../../utils/logger';

/**
 * Local Strategy for email/password authentication
 */
export const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      // Find user and include password field
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

      if (!user) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      // Return user without password
      const userObj = user.toObject();
      delete userObj.password;
      return done(null, userObj);
    } catch (error) {
      logger.error('Local strategy error:', error);
      return done(error);
    }
  }
);

/**
 * JWT Strategy for token authentication
 * Note: Token blacklist check is done in auth.middleware before this strategy is called
 */
export const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  async (payload, done) => {
    try {
      const user = await User.findById(payload.userId);

      if (!user) {
        return done(null, false);
      }

      // Return user without password
      const userObj = user.toObject();
      delete userObj.password;
      return done(null, userObj);
    } catch (error) {
      logger.error('JWT strategy error:', error);
      return done(error);
    }
  }
);

