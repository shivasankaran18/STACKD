import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { readFile } from 'fs/promises';

export async function passportAuth(config, projectDir) {
    console.log("Setting up Passport.js authentication...");
    
    const backendDir = join(projectDir, 'backend');
    
    console.log("Adding Passport dependencies...");
    const packageJsonPath = join(backendDir, 'package.json');
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));

    packageJson.dependencies = {
        ...packageJson.dependencies,
        "passport": "^0.6.0",
        "passport-local": "^1.0.0",
        "passport-jwt": "^4.0.1",
        "bcryptjs": "^2.4.3",
        "express-session": "^1.17.3"
    };

    packageJson.devDependencies = {
        ...packageJson.devDependencies,
        "@types/passport": "^1.0.12",
        "@types/passport-local": "^1.0.35",
        "@types/passport-jwt": "^3.0.9",
        "@types/bcryptjs": "^2.4.2",
        "@types/express-session": "^1.17.7"
    };

    await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

    console.log("Creating Passport configuration...");
    const passportConfig = `
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';

interface User {
    id: number;
    email: string;
    password: string;
}

const users: User[] = [];

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            const user = users.find(u => u.email === email);
            
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

passport.use(new JWTStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET || 'your-secret-key'
    },
    async (payload, done) => {
        try {
            const user = users.find(u => u.id === payload.id);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser((id: number, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});

export default passport;`;

    const configDir = join(backendDir, 'src', 'config');
    await mkdir(configDir, { recursive: true });
    await writeFile(
        join(configDir, 'passport.ts'),
        passportConfig.trim()
    );

    console.log("Creating authentication routes...");
    const authRoutes = `
import { Router } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

const users: any[] = [];

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (users.find(u => u.email === email)) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = {
            id: users.length + 1,
            email,
            password: hash
        };
        users.push(user);

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your-secret-key');
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
});

router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET || 'your-secret-key');
    res.json({ token });
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
});

export default router;`;

    const routesDir = join(backendDir, 'src', 'routes');
    await mkdir(routesDir, { recursive: true });
    await writeFile(
        join(routesDir, 'auth.ts'),
        authRoutes.trim()
    );

    console.log("Updating main application file...");
    const mainAppUpdate = `
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from './config/passport';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || ${config.backendPort};

app.use(cors());
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(\`Server running on port \${port}\`);
});`;

    await writeFile(
        join(backendDir, 'src', 'index.ts'),
        mainAppUpdate.trim()
    );

    console.log("Passport.js authentication setup completed!");
}