import { execSync } from "child_process";
import path from "path";

export default async function createAngularTS(config: any, projectDir: any) {
    try {

        const projectFullPath = path.join(projectDir, 'frontend');

        console.log('Installing Angular CLI...');
        await execSync(`npx @angular/cli@latest new frontend --skip-git --style=scss --routing=true --strict`, {
            cwd: projectDir,
            stdio: 'inherit'
        });

       
        console.log('Installing dependencies...');
        await execSync('npm install', {
            cwd: projectFullPath,
            stdio: 'inherit'
        });

        console.log('Angular project created successfully!');
        
    } catch (error) {
        console.error('Error creating Angular project:', error);
        throw error;
    }
}

