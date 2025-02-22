import { join } from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'
import 'dotenv/config'

export async function setupMongoose(config: any, projectDir: string,emitLog: (log: string) => void) {
    const backendDir = join(projectDir, 'backend');
    const modelsDir = join(backendDir, 'src', 'models');
    await mkdir(modelsDir, { recursive: true });

    emitLog('Generating environment configuration...');
    const envContent = `
# MongoDB Configuration
${config.env?.MONGODB_URI_ENV || 'MONGODB_URI'}=mongodb://localhost:27017/${config.databaseName || 'myapp'}

# Add other environment variables here
NODE_ENV=development
PORT=3000
`;

    await writeFile(
        join(backendDir, '.env'),
        envContent.trim() + '\n'
    );
    emitLog('✅ Environment configuration created');

    emitLog('Setting up database connection...');
    const dbCode = `
import mongoose from 'mongoose';

const MONGODB_URI = process.env.${config.env?.MONGODB_URI_ENV || 'MONGODB_URI'} || 'mongodb://localhost:27017/${config.databaseName || 'myapp'}';

export async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}
    
export async function disconnectDB() {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
}
`;
    emitLog('✅ Database connection setup complete');
    await writeFile(
        join(backendDir, 'db.ts'),
        dbCode
    );

    const exampleModelCode = `
import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const Example = mongoose.model('Example', exampleSchema);
`;

    await writeFile(
        join(modelsDir, 'example.ts'),
        exampleModelCode
    );
}