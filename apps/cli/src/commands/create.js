import { join } from 'path';
import { createReactTS } from '../generators/frontend/reactts.js';
// import { createReactJS } from '../generators/frontend/reactjs';
// import { createVueTS } from '../generators/frontend/vuets';
// import { createVueJS } from '../generators/frontend/vuejs';
// import { createExpressTS } from '../generators/backend/expressts';
import { createExpressJS } from '../generators/backend/expressjs.js';
// import { setupPrisma } from '../generators/orms/prismaSetup';
// import { jwtAuth } from '../generators/auth/jwt';
import { mkdir } from 'fs/promises';
// import chalk from 'chalk';
// import ora from 'ora';

export async function createProject(projectName, options) {
  // const spinner = ora('Creating project...').start();
  
  try {
    const projectDir = join(process.cwd(), projectName);
    const config = {
      projectName,
      projectPath: process.cwd(),
      frontendPort: options.frontendPort,
      backendPort: options.backendPort,
      dbUrl: options.dbUrl,
      frontend: options.frontend,
      backend: options.backend,
    };

    // Create project directory
    await mkdir(projectDir, { recursive: true });
    
    // Frontend setup
    // spinner.text = 'Setting up frontend...';
    switch(options.frontend) {
      case 'react-ts':
        await createReactTS(config, projectDir);
        break;
      // case 'react':
      //   await createReactJS(config, projectDir);
      //   break;
      // case 'vue':
      //   await createVueJS(config, projectDir);
      //   break;
      // case 'vue-ts':
      //   await createVueTS(config, projectDir);
      //   break;
    }

    // Backend setup
    // spinner.text = 'Setting up backend...';
    switch(options.backend) {
      // case 'express-ts':
      //   await createExpressTS(config, projectDir);
      //   break;
      case 'express':
        await createExpressJS(config, projectDir);
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