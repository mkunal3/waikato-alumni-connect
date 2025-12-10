import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * Custom Request type extending Express Request
 * with authenticated user properties attached
 */
export interface AuthRequest extends Request {
  userId?: number;
  email?: string;
  role?: string;
}

/**
 * JWT payload structure
 */
interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

/**
 * Middleware: Authenticate JWT token from Authorization header
 * 
 * Expected header: Authorization: Bearer <token>
 * On success: Attaches userId, email, role to request object
 * On failure: Returns 401 Unauthorized
 */
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Remove "Bearer " prefix
    const token = authHeader.slice(7);

    // Verify and decode token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET not configured");
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Attach user data to request
    req.userId = decoded.userId;
    req.email = decoded.email;
    req.role = decoded.role;

    // Proceed to next middleware/route
    next();
  } catch (error) {
    // Handle token verification errors (invalid, expired, etc.)
    if (error instanceof jwt.JsonWebTokenError) {
      console.error("JWT verification failed:", error.message);
    } else {
      console.error("Authentication error:", error);
    }
    res.status(401).json({ error: "Unauthorized" });
  }
};
