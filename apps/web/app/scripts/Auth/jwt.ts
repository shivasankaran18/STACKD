import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import fs from 'fs';

export async function jwtAuth(config: any, projectDir: any) {
    const packageJsonPath = join(projectDir, 'backend','package.json');
    const jsonData = await JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    jsonData.dependencies = jsonData.dependencies || {};
    jsonData.dependencies["jsonwebtoken"] = "^9.0.2";

    fs.writeFileSync(packageJsonPath, JSON.stringify(jsonData, null, 2), 'utf8');

    const jwtAuthFile = `
    const jwt = require('jsonwebtoken');

export const authenticateToken = (req:any, res:any, next:any) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access Denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err:any, user) => {
        if (err) return res.status(403).json({ error: 'Invalid Token' });
        req.user = user;
        next();
    });
};
`;

    const middlewareDir = join(projectDir, 'backend', 'src', 'middleware');
    await mkdir(middlewareDir, { recursive: true });

    await writeFile(join(middlewareDir, 'middleware.ts'), jwtAuthFile, 'utf8');
}
