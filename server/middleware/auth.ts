import { Request, Response, NextFunction } from 'express';

// Middleware to check if user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized" });
};

// Middleware to check if user is an admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user && (req.user as any).role === "admin") {
    return next();
  }
  return res.status(403).json({ error: "Forbidden" });
};

// Middleware to check if user is a seller
export const isSeller = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user && (req.user as any).role === "seller") {
    return next();
  }
  return res.status(403).json({ error: "Forbidden" });
};

// Middleware to check if user is a buyer
export const isBuyer = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user && (req.user as any).role === "buyer") {
    return next();
  }
  return res.status(403).json({ error: "Forbidden" });
};

// Middleware to check if user is either an admin or a seller
export const isAdminOrSeller = (req: Request, res: Response, next: NextFunction) => {
  if (
    req.isAuthenticated() && 
    req.user && 
    ((req.user as any).role === "admin" || (req.user as any).role === "seller")
  ) {
    return next();
  }
  return res.status(403).json({ error: "Forbidden" });
};