import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const requireAuth = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header for Bearer token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7); // Remove "Bearer " prefix
    } else if (req.cookies && req.cookies.sentinel_session) {
      // Fallback to cookie
      token = req.cookies.sentinel_session;
    }

    if (!token) {
      return res.status(401).json({ detail: 'Not authenticated' });
    }

    // Decode JWT
    const decoded = jwt.verify(token, config.jwt.secret);
    const userId = parseInt(decoded.sub, 10);

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(401).json({ detail: 'Not authenticated' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ detail: 'Not authenticated' });
  }
};

export const createSessionToken = (userId) => {
  const payload = {
    sub: String(userId),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  };

  return jwt.sign(payload, config.jwt.secret, { algorithm: 'HS256' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    return null;
  }
};
