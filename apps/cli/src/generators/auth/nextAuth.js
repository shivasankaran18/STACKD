import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { readFile } from 'fs/promises';

export async function nextAuth(config, projectDir) {
    console.log("Setting up NextAuth.js authentication...");
    
    const frontendDir = join(projectDir, 'frontend');

    console.log("Adding NextAuth dependencies...");
    const packageJsonPath = join(frontendDir, 'package.json');
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));

    packageJson.dependencies = {
        ...packageJson.dependencies,
        "next-auth": "^4.24.5",
        "@auth/prisma-adapter": "^1.0.0"
    };

    await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

    const authDir = join(frontendDir, 'src', 'app', 'api', 'auth', '[...nextauth]');
    await mkdir(authDir, { recursive: true });

    console.log("Creating NextAuth configuration...");
    const nextAuthConfig = `
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || '',
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID || '',
            clientSecret: process.env.GOOGLE_SECRET || '',
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Add your credentials logic here
                return null;
            }
        })
    ],
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error',
    },
    callbacks: {
        async session({ session, token }) {
            return session;
        },
        async jwt({ token, user }) {
            return token;
        }
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };`;

    await writeFile(
        join(authDir, 'route.ts'),
        nextAuthConfig.trim()
    );

    console.log("Creating auth components...");
    const authButton = `
'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export function AuthButton() {
    const { data: session } = useSession();

    if (session) {
        return (
            <div>
                Signed in as {session.user?.email} <br />
                <button onClick={() => signOut()}>Sign out</button>
            </div>
        );
    }
    return (
        <button onClick={() => signIn()}>Sign in</button>
    );
}`;

    const componentsDir = join(frontendDir, 'src', 'components');
    await mkdir(componentsDir, { recursive: true });
    await writeFile(
        join(componentsDir, 'AuthButton.tsx'),
        authButton.trim()
    );

    console.log("Updating environment configuration...");
    const envContent = `
NEXTAUTH_URL=http://localhost:${config.frontendPort}
NEXTAUTH_SECRET=your-nextauth-secret # Change this in production
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret
GOOGLE_ID=your-google-id
GOOGLE_SECRET=your-google-secret
`;

    await writeFile(
        join(frontendDir, '.env'),
        envContent.trim() + '\n'
    );

    console.log("NextAuth.js setup completed!");
}