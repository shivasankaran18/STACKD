import { join } from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'

export async function setupPassport(config, projectDir,emitLog) {
    emitLog('Setting up Passport...');
    try {
        const backendDir = join(projectDir, 'backend');
        const authDir = join(backendDir, 'src', 'auth');
        const configDir = join(backendDir, 'src', 'config');
        emitLog('Creating auth and config directories...');
        await mkdir(authDir, { recursive: true });
        await mkdir(configDir, { recursive: true });

        const passportConfigCode = `
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user.model';
import { config } from '../config';

// Local Strategy
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }
            
            const isValid = await user.comparePassword(password);
            if (!isValid) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// JWT Strategy
passport.use(new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwt.secret,
    },
    async (payload, done) => {
        try {
            const user = await User.findById(payload.sub);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }
));

// Google OAuth Strategy
passport.use(new GoogleStrategy(
    {
        clientID: config.google.clientId,
        clientSecret: config.google.clientSecret,
        callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });
            
            if (!user) {
                user = await User.create({
                    googleId: profile.id,
                    email: profile.emails?.[0]?.value,
                    name: profile.displayName,
                });
            }
            
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }
));

// Serialization
passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;
`;
        emitLog('Writing passport.config.ts...');
        await writeFile(
            join(authDir, 'passport.config.ts'),
            passportConfigCode.trim() + '\n'
        );
        emitLog('Creating authentication middleware...');
        const authMiddlewareCode = `
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export const authenticateJWT = passport.authenticate('jwt', { session: false });

export const authenticateLocal = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: info?.message || 'Authentication failed' });
        }
        
        const token = jwt.sign({ sub: user.id }, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn,
        });
        
        req.user = user;
        res.locals.token = token;
        next();
    })(req, res, next);
};

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};
`;
        emitLog('Writing middleware.ts...');
        await writeFile(
            join(authDir, 'middleware.ts'),
            authMiddlewareCode.trim() + '\n'
        );
        emitLog('Creating authentication routes...');
        const authRoutesCode = `
import { Router } from 'express';
import passport from 'passport';
import { authenticateLocal } from './middleware';

const router = Router();

router.post('/login', authenticateLocal, (req, res) => {
    res.json({
        user: req.user,
        token: res.locals.token,
    });
});

router.post('/register', async (req, res) => {
    // Add your registration logic here
});

router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        // Handle successful authentication
        res.redirect('/');
    }
);

router.post('/logout', (req, res) => {
    req.logout();
    res.json({ message: 'Logged out successfully' });
});

export default router;
`;
        emitLog('Writing routes.ts...');
        await writeFile(
            join(authDir, 'routes.ts'),
            authRoutesCode.trim() + '\n'
        );
        emitLog('Creating configuration file...');
        const configCode = `
export const config = {
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: '1d',
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    session: {
        secret: process.env.SESSION_SECRET || 'session-secret',
    },
};
`;
        emitLog('Writing index.ts...');
        await writeFile(
            join(configDir, 'index.ts'),
            configCode.trim() + '\n'
        );
        emitLog('Adding environment variables...');
        const envContent = `
# Authentication
JWT_SECRET=your-jwt-secret-key
SESSION_SECRET=your-session-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
`;
        emitLog('Writing .env file...');
        await writeFile(
            join(backendDir, '.env'),
            envContent.trim() + '\n'
        );
        emitLog('✅ Passport.js setup completed successfully!');
    } catch (error) {
        emitLog(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
    }
}