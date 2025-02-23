import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export async function installDjangoDependencies(projectPath: string) {
    try {
        await execAsync('python -m venv venv', { cwd: projectPath });

        const activateCmd = process.platform === 'win32' ? 
            'venv\\Scripts\\activate' : 
            'source venv/bin/activate';

        await execAsync(`${activateCmd} && pip install django djangorestframework django-cors-headers`, 
            { cwd: projectPath});

        await execAsync(`${activateCmd} && django-admin startproject myproject .`, 
            { cwd: projectPath});

        await execAsync(`${activateCmd} && python manage.py startapp myapp`, 
            { cwd: projectPath});

    } catch (error) {
        console.error('Error installing Django dependencies:', error);
        throw error;
    }
}

export default installDjangoDependencies;