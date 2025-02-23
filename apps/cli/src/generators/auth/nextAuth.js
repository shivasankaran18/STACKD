import { join } from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'
import 'dotenv/config'

export async function setupNextAuth(config, projectDir,emitLog) {
    try {
        const authDir = join(projectDir, 'frontend', 'src', 'app', 'api', 'auth');
        await mkdir(authDir, { recursive: true });
        emitLog('Creating auth directory...');
        const routeCode = `
import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
export const authOptions: AuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Add your credentials logic here
                if (!credentials?.email || !credentials?.password) return null;
                
                try {
                    // Example user verification
                    const user = { id: "1", email: credentials.email, name: "User" };
                    return user;
                } catch (error) {
                    return null;
                }
            }
        }),
    ],
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
`;

        await writeFile(
            join(authDir, 'route.ts'),
            routeCode.trim() + '\n'
        );

        const utilsDir = join(projectDir, 'frontend', 'src', 'utils');
        await mkdir(utilsDir, { recursive: true });
        emitLog('Creating utils directory...');
        const utilsCode = `
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/route";

export async function getSession() {
    return await getServerSession(authOptions);
}

export async function getCurrentUser() {
    const session = await getSession();
    return session?.user;
}

export async function isAuthenticated() {
    const session = await getSession();
    return !!session;
}
`;
        emitLog('Writing utils.ts...');
        await writeFile(
            join(utilsDir, 'auth.ts'),
            utilsCode.trim() + '\n'
        );

        const envContent = `
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:${config.frontendPort}

# OAuth Providers
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
`;
        emitLog('Writing .env file...');
        await writeFile(
            join(projectDir, 'frontend', '.env'),
            envContent.trim() + '\n'
        );
        emitLog('Writing AuthProvider.tsx...');
        const providerCode = `
'use client';

import { SessionProvider } from "next-auth/react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}
`;
        emitLog('Creating components directory...');
        const providersDir = join(projectDir, 'frontend', 'src', 'components', 'auth');
        await mkdir(providersDir, { recursive: true });
        await writeFile(
            join(providersDir, 'AuthProvider.tsx'),
            providerCode.trim() + '\n'
        );
        emitLog('✅ NextAuth setup completed successfully!');
    } catch (error) {
        emitLog(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
    }
}
