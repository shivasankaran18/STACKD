import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export async function installDjangoDependencies(projectPath: string) {
    try {
        // Create virtual environment
        await execAsync('python -m venv venv', { cwd: projectPath });

        // Activate virtual environment and install dependencies
        const activateCmd = process.platform === 'win32' ? 
            'venv\\Scripts\\activate' : 
            'source venv/bin/activate';

        await execAsync(`${activateCmd} && pip install django djangorestframework django-cors-headers`, 
            { cwd: projectPath});

        // Create Django project
        await execAsync(`${activateCmd} && django-admin startproject core .`, 
            { cwd: projectPath});

        // Create main app
        await execAsync(`${activateCmd} && python manage.py startapp main`, 
            { cwd: projectPath});

    } catch (error) {
        console.error('Error installing Django dependencies:', error);
        throw error;
    }
}

export default installDjangoDependencies;
