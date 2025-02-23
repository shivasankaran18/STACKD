import { exec } from 'child_process';
import {  mkdirSync } from 'fs';
import util from 'util';

const execAsync = util.promisify(exec);

export async function installDjangoDependencies(projectPath) {
    try {
        
        mkdirSync(`${projectPath}/backend`, { recursive: true });

        await execAsync('python -m venv venv', { cwd: `${projectPath}/backend` });

        const pythonCmd = process.platform === 'win32' ? 'venv\\Scripts\\python.exe' : 'venv/bin/python';

        await execAsync(`${pythonCmd} -m pip install django djangorestframework django-cors-headers djangorestframework_simplejwt`, { cwd: `${projectPath}/backend` });

        await execAsync(`${pythonCmd} -m django startproject core .`, { cwd: `${projectPath}/backend` });

        await execAsync(`${pythonCmd} manage.py startapp main`, { cwd: `${projectPath}/backend` });

        console.log("Django project setup completed!");

    } catch (error) {
        console.error('Error installing Django dependencies:', error);
        throw error;
    }
}

export default installDjangoDependencies;