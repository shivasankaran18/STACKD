import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { readFile } from 'fs/promises';

export async function jwtAuth(config, projectDir) {
    console.log("Setting up JWT authentication...");
    
    const backendDir = join(projectDir, 'backend');
    const middlewareDir = join(backendDir, 'src', 'middleware');
    const routesDir = join(backendDir, 'src', 'routes');

    // Create directories
    await mkdir(middlewareDir, { recursive: true });
    await mkdir(routesDir, { recursive: true });

    // Update package.json to add JWT dependencies
    console.log("Adding JWT dependencies...");
    const packageJsonPath = join(backendDir, 'package.json');
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));

    packageJson.dependencies = {
        ...packageJson.dependencies,
        "jsonwebtoken": "^9.0.2",
        "bcryptjs": "^2.4.3"
    };

    packageJson.devDependencies = {
        ...packageJson.devDependencies,
        "@types/jsonwebtoken": "^9.0.2",
        "@types/bcryptjs": "^2.4.2"
    };

    await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // Create JWT middleware
    console.log("Creating JWT middleware...");
    const jwtMiddleware = `
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access Denied' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid Token' });
    }
};

export const generateToken = (payload: any) => {
    return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
};`;

    await writeFile(
        join(middlewareDir, 'auth.ts'),
        jwtMiddleware.trim()
    );

    // Create auth routes
    console.log("Creating authentication routes...");
    const authRoutes = `
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { authenticateToken, generateToken } from '../middleware/auth';

const router = Router();

// Example user storage (replace with your database)
const users: any[] = [];

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = {
            id: users.length + 1,
            email,
            password: hashedPassword
        };
        users.push(user);

        // Generate token
        const token = generateToken({ id: user.id, email: user.email });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Generate token
        const token = generateToken({ id: user.id, email: user.email });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

router.get('/me', authenticateToken, (req, res) => {
    res.json(req.user);
});

export default router;`;

    await writeFile(
        join(routesDir, 'auth.ts'),
        authRoutes.trim()
    );

    // Update main app file
    console.log("Updating main application file...");
    const mainAppUpdate = `
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import { authenticateToken } from './middleware/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || ${config.backendPort};

app.use(cors());
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

// Public route example
app.get('/api/public', (req, res) => {
    res.json({ message: 'This is a public route' });
});

app.listen(port, () => {
    console.log(\`Server running on port \${port}\`);
});`;

    await writeFile(
        join(backendDir, 'src', 'index.ts'),
        mainAppUpdate.trim()
    );

    // Create environment file with JWT secret
    console.log("Setting up environment configuration...");
    const envContent = `
JWT_SECRET=your-secret-key-change-this-in-production
PORT=${config.backendPort}
`;

    await writeFile(
        join(backendDir, '.env'),
        envContent.trim() + '\n'
    );

    console.log("JWT authentication setup completed!");
}