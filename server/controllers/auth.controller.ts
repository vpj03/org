import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';
import { storage } from '../storage';
import { scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

// Store reset tokens temporarily (in a real app, these would be stored in a database)
const passwordResetTokens: Record<string, { userId: string; expires: Date }> = {};

// Request password reset
export const requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Find user by email
    const user = await storage.getUserByEmail(email);
    
    // Don't reveal if user exists or not for security reasons
    if (!user) {
      return res.status(200).json({ 
        message: 'If an account with that email exists, we have sent password reset instructions.' 
      });
    }
    
    // Generate a random token
    const token = randomBytes(32).toString('hex');
    
    // Store the token with an expiration time (1 hour)
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);
    
    passwordResetTokens[token] = {
      userId: user.id || user._id,
      expires
    };
    
    // In a real application, send an email with the reset link
    // For this example, we'll just return the token in the response
    const resetLink = `${req.protocol}://${req.get('host')}/reset-password?token=${token}`;
    
    // For development purposes, log the reset link
    console.log('Password reset link:', resetLink);
    
    // Return success message
    return res.status(200).json({ 
      message: 'If an account with that email exists, we have sent password reset instructions.' 
    });
  } catch (error) {
    next(error);
  }
};

// Verify reset token
export const verifyResetToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query;
    
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Invalid token' });
    }
    
    const resetData = passwordResetTokens[token];
    
    if (!resetData) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    
    if (new Date() > resetData.expires) {
      // Token has expired, remove it
      delete passwordResetTokens[token];
      return res.status(400).json({ error: 'Token has expired' });
    }
    
    // Token is valid
    return res.status(200).json({ valid: true });
  } catch (error) {
    next(error);
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }
    
    const resetData = passwordResetTokens[token];
    
    if (!resetData) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    
    if (new Date() > resetData.expires) {
      // Token has expired, remove it
      delete passwordResetTokens[token];
      return res.status(400).json({ error: 'Token has expired' });
    }
    
    // Get user
    const user = await storage.getUser(resetData.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Hash the new password
    const salt = randomBytes(16).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    const hashedPassword = `${buf.toString('hex')}.${salt}`;
    
    // Update user's password
    await storage.updateUser(resetData.userId, { password: hashedPassword });
    
    // Remove the used token
    delete passwordResetTokens[token];
    
    return res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    next(error);
  }
};