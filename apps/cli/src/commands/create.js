import { join } from 'path';
import { createReactTS } from '../generators/frontend/reactts.js';
import { createReactJS } from '../generators/frontend/reactjs.js';
// import { createVueTS } from '../generators/frontend/vuets.js';
// import { createVueJS } from '../generators/frontend/vuejs.js';
import { createExpressTS } from '../generators/backend/expressts.js';
import { createExpressJS } from '../generators/backend/expressjs.js';
import { setupPrisma } from '../generators/orm/prismaSetup.js';
import { jwtAuth } from '../generators/auth/jwt.js';
import { mkdir } from 'fs/promises';
// import chalk from 'chalk';
// import ora from 'ora';

const emitLog = (message) => {
  console.log(`[Emit Logs]: ${message}`);
};

export async function createProject(projectName, options) {
  // const spinner = ora('Creating project...').start();
  
  try {
    const projectDir = join(options.projectPath, projectName);
    const config = {
      projectName,
      projectPath: options.projectPath,
      frontendPort: options.frontendPort,
      backendPort: options.backendPort,
      dbUrl: options.dbUrl,
      frontend: options.frontend,
      backend: options.backend,
    };
    console.log(config);
    // Create project directory
    await mkdir(projectDir, { recursive: true });
    
    // Frontend setup
    // spinner.text = 'Setting up frontend...';
    switch(options.frontend) {
      case 'React + TypeScript':
        await createReactTS(config, projectDir,emitLog);
        break;
      case 'React (JavaScript)':
        await createReactJS(config, projectDir,emitLog);
        break;
      default:
        console.log('No frontend selected');
        break;
      // case 'Vue (JavaScript)':
      //   await createVueJS(config, projectDir);
      //   break;
      // case 'Vue + TypeScript':
      //   await createVueTS(config, projectDir);
      //   break;
    }

    // Backend setup
    // spinner.text = 'Setting up backend...';
    switch(options.backend) {
      case 'Express + TypeScript':
        await createExpressTS(config, projectDir);
        break;
      case 'Express (JavaScript)':
        await createExpressJS(config, projectDir);
        break;
      default:
        console.log('No backend selected');
        break;
    }

    // // Optional features
    // if (options.dbUrl) {
    //   spinner.text = 'Setting up Prisma...';
    //   await setupPrisma(config, projectDir);
    // }

    // if (options.auth) {
    //   spinner.text = 'Setting up authentication...';
    //   await jwtAuth(config, projectDir);
    // }

    // spinner.succeed(chalk.green('Project created successfully!'));
    
    console.log('\nTo get started:');
    // console.log(chalk.cyan(`  cd ${projectName}`));
    // console.log(chalk.cyan('  npm install'));
    // console.log(chalk.cyan('  npm run dev'));
    
  } catch (error) {
    // spinner.fail(chalk.red('Failed to create project'));
    console.error(error);
    process.exit(1);
  }
}