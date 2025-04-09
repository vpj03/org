import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { randomBytes, scrypt as _scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User } from "@shared/schema";

const scryptAsync = promisify(_scrypt);

// Hash password
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Compare passwords
async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  if (!hashed || !salt) return false;
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Setup authentication
export async function setupAuth(app: Express) {
  // Session configuration
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'orgpick-secret-key',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    }
  };

  // Setup middleware
  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure LocalStrategy for authentication
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Get user by username
        let user;
        try {
          user = await storage.getUserByUsername(username);
          
          // If no user found, return error
          if (!user) {
            console.log(`Login failed: User '${username}' not found`);
            return done(null, false, { message: 'Invalid username or password' });
          }
        } catch (error) {
          console.error('Database error during login:', error);
          // Handle specific database errors
          if (error.name === 'MongoServerError') {
            return done(null, false, { message: 'Database connection error. Please try again later.' });
          }
          return done(null, false, { message: 'Unable to fetch user data. Please try again later.' });
        }

        // Verify password
        const isValidPassword = await comparePasswords(password, user.password);
        if (!isValidPassword) {
          console.log(`Login failed: Invalid password for user '${username}'`);

          return done(null, false, { message: 'Invalid username or password' });
        }
        
        console.log(`User '${username}' logged in successfully`);
        return done(null, user);
      } catch (error) {
        console.error('Login error:', error);
        return done(error);
      }
    }),
  );

  // Serialize user to session
  passport.serializeUser((user: any, done) => {
    done(null, user._id || user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      console.error('Error deserializing user:', error);
      done(error);
    }
  });

  // Register API route
  app.post("/api/register", async (req, res, next) => {
    try {
      // Check if user already exists
      const existingUserByUsername = await storage.getUserByUsername(req.body.username);
      const existingUserByEmail = await storage.getUserByEmail(req.body.email);
      
      if (existingUserByUsername || existingUserByEmail) {
        return res.status(400).json({ 
          error: "Username or email already exists" 
        });
      }

      // Create new user with hashed password
      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword
      });

      // Log in the new user
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Remove password from response
        const userResponse = { ...user };
        delete userResponse.password;
        res.status(201).json(userResponse);
      });
    } catch (error) {
      next(error);
    }
  });

  // Login API route
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", async (err: Error, user: User, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ 
          error: info?.message || "Login failed: Unable to fetch user data" 
        });
      }
      
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Remove password from response
        const userResponse = { ...user };
        delete userResponse.password;
        return res.status(200).json(userResponse);
      });
    })(req, res, next);
  });

  // Logout API route
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Get current user API route
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.sendStatus(401);
    }
    
    // Remove password from response
    const userResponse = { ...req.user as User };
    delete userResponse.password;
    res.json(userResponse);
  });
}