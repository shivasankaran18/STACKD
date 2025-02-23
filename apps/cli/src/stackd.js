#!/usr/bin/env node


import { program } from 'commander';
import inquirer from 'inquirer';
import { createProject } from './commands/create.js';

program
  .command('new <projectName>')
  .description('Create a new full-stack project')
  .action(async (projectName) => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectPath',
        message: 'Where do you want to create the project?',
        default: process.cwd(),
      },
      {
        type: 'number',
        name: 'frontendPort',
        message: 'Enter frontend port:',
        default: 3000,
      },
      {
        type: 'number',
        name: 'backendPort',
        message: 'Enter backend port:',
        default: 3001,
      },
      {
        type: 'list',
        name: 'frontend',
        message: 'Choose a frontend framework (optional):',
        choices: ['React + TypeScript', 'React (JavaScript)', 'Vue + TypeScript', 'Vue (JavaScript)', 'Django Templates', 'None'],
        default: 'None',
      },
      {
        type: 'list',
        name: 'backend',
        message: 'Choose a backend framework:',
        choices: (answers) => {
          if (answers.frontend === 'Django Templates') {
            return ['Django'];
          }
          return ['Express + TypeScript', 'Express (JavaScript)', 'Django','None'];
        },
        default: 'Express + TypeScript',
      },
      {
        type: 'list',
        name: 'database',
        message: 'Choose a database:',
        choices: ['PostgreSQL', 'MongoDB', 'None'],
      },
      {
        type: 'list',
        name: 'orm',
        message: 'Choose an ORM:',
        choices: (answers) => {
          return answers.database === 'PostgreSQL'
            ? ['Prisma', 'Drizzle','None']
            : ['Mongoose','None']; // Only Mongoose for MongoDB
        },
      },
      {
        type: 'list',
        name: 'auth',
        message: 'Choose an authentication method (optional):',
        choices: ['JWT', 'NextAuth', 'Passport', 'None'],
        default: 'None',
      },
      {
        type: 'input',
        name: 'dbUrl',
        message: 'Enter database connection URL:',
      },
    ]);

    // Adjust logic based on selections
    if (answers.frontend === 'Django Templates') {
      answers.backend = 'Django'; // Enforce Django backend
    }
    if (answers.backend === 'Django') {
      answers.frontend = 'Django Templates'; // Enforce Django frontend
    }

    if (answers.database === 'MongoDB' && answers.orm !== 'Mongoose') {
      console.error("❌ Error: MongoDB supports only Mongoose ORM.");
      process.exit(1);
    }
    if (answers.database === 'PostgreSQL' && !['Prisma', 'Drizzle'].includes(answers.orm)) {
      console.error("❌ Error: PostgreSQL supports only Prisma or Drizzle ORM.");
      process.exit(1);
    }

    console.log("\n📦 Creating your project...");
    await createProject(projectName, answers);
  });

program.parse(process.argv);
