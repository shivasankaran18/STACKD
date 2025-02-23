#!/usr/bin/env node

import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { createProject } from './commands/create.js';

const showBanner = () => {
  console.log(chalk.cyan(`
     ██████╗████████╗ █████╗  ██████╗██╗  ██╗'██████╗ 
    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝██╔══██╗
    ╚█████╗    ██║   ███████║██║     █████═╝ ██║  ██║
     ╚═══██╗   ██║   ██╔══██║██║     ██╔═██╗ ██║  ██║
    ██████╔╝   ██║   ██║  ██║╚██████╗██║  ██╗██████╔╝
    ╚═════╝    ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═════╝ 
  `));
  console.log(chalk.yellow.bold('  🚀 Full Stack Project Generator\n'));
};

// Create a colorful border
const createBorder = () => {
  const border = '='.repeat(60);
  return chalk.cyan(border);
  // Alternative: return chalk.bgCyan('='.repeat(60));
};

// First, let's define our choices as constants to ensure consistency
const CHOICES = {
  EXPRESS_TS: 'Express + TypeScript',
  EXPRESS_JS: 'Express (JavaScript)',
  DJANGO: 'Django',
  REACT_TS: 'React + TypeScript',
  REACT_JS: 'React (JavaScript)',
  VUE_TS: 'Vue + TypeScript',
  VUE_JS: 'Vue (JavaScript)',
  DJANGO_TEMPLATES: 'Django Templates',
  NONE: 'None',
  POSTGRESQL: 'PostgreSQL',
  MONGODB: 'MongoDB',
  PRISMA: 'Prisma',
  DRIZZLE: 'Drizzle',
  MONGOOSE: 'Mongoose',
  JWT: 'JWT',
  NEXTAUTH: 'NextAuth',
  PASSPORT: 'Passport'
};

program
  .command('new <projectName>')
  .description('Create a new full-stack project')
  .action(async (projectName) => {
    showBanner();
    console.log(createBorder());
    console.log(chalk.bgCyan.white.bold('\n  💫 Let\'s create something awesome!  \n'));
    console.log(createBorder() + '\n');

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectPath',
        message: chalk.magenta.bold('📁 Where do you want to create the project?'),
        default: process.cwd(),
      },
      {
        type: 'number',
        name: 'frontendPort',
        message: chalk.blue.bold('🌐 Enter frontend port:'),
        default: 3000,
      },
      {
        type: 'number',
        name: 'backendPort',
        message: chalk.green.bold('⚙️  Enter backend port:'),
        default: 3001,
      },
      {
        type: 'list',
        name: 'frontend',
        message: chalk.yellow.bold('🎨 Choose a frontend framework:'),
        choices: [
          chalk.blue(CHOICES.REACT_TS),
          chalk.blue(CHOICES.REACT_JS),
          chalk.green(CHOICES.VUE_TS),
          chalk.green(CHOICES.VUE_JS),
          chalk.green(CHOICES.DJANGO_TEMPLATES),
          CHOICES.NONE
        ],
        default: CHOICES.NONE,
      },
      {
        type: 'list',
        name: 'backend',
        message: chalk.cyan.bold('🛠️  Choose a backend framework:'),
        choices: (answers) => {
          if (answers.frontend === CHOICES.DJANGO_TEMPLATES) {
            return [chalk.green(CHOICES.DJANGO)];
          }
          return [
            chalk.blue(CHOICES.EXPRESS_TS),
            chalk.blue(CHOICES.EXPRESS_JS),
            chalk.green(CHOICES.DJANGO),
            CHOICES.NONE
          ];
        },
        default: chalk.blue(CHOICES.EXPRESS_TS),
      },
      {
        type: 'list',
        name: 'database',
        message: chalk.magenta.bold('🗄️  Choose a database:'),
        choices: [
          chalk.blue(CHOICES.POSTGRESQL),
          chalk.green(CHOICES.MONGODB),
          CHOICES.NONE
        ],
      },
      {
        type: 'list',
        name: 'orm',
        message: chalk.yellow.bold('🔗 Choose an ORM:'),
        choices: (answers) => {
          const cleanDatabase = answers.database.replace(/\u001b\[\d+m/g, '').trim();
          return cleanDatabase === CHOICES.POSTGRESQL
            ? [chalk.magenta(CHOICES.PRISMA), chalk.cyan(CHOICES.DRIZZLE), CHOICES.NONE]
            : [chalk.green(CHOICES.MONGOOSE), CHOICES.NONE];
        },
      },
      {
        type: 'list',
        name: 'auth',
        message: chalk.cyan.bold('🔐 Choose an authentication method:'),
        choices: [
          chalk.yellow(CHOICES.JWT),
          chalk.blue(CHOICES.NEXTAUTH),
          chalk.green(CHOICES.PASSPORT),
          CHOICES.NONE
        ],
        default: CHOICES.NONE,
      },
      {
        type: 'input',
        name: 'dbUrl',
        message: chalk.green.bold('🔌 Enter database connection URL:'),
      },
    ]);

    // Update the cleanup function to handle all choices
    const cleanAnswers = Object.entries(answers).reduce((acc, [key, value]) => {
      if (typeof value === 'string') {
        // Remove ANSI color codes and trim
        const cleanValue = value.replace(/\u001b\[\d+m/g, '').trim();
        
        // Map all choices back to their constant values
        switch (key) {
          case 'frontend':
            acc[key] = Object.values(CHOICES).find(choice => choice === cleanValue) || cleanValue;
            break;
          case 'backend':
            acc[key] = Object.values(CHOICES).find(choice => choice === cleanValue) || cleanValue;
            break;
          case 'database':
            acc[key] = Object.values(CHOICES).find(choice => choice === cleanValue) || cleanValue;
            break;
          case 'orm':
            acc[key] = Object.values(CHOICES).find(choice => choice === cleanValue) || cleanValue;
            break;
          case 'auth':
            acc[key] = Object.values(CHOICES).find(choice => choice === cleanValue) || cleanValue;
            break;
          default:
            acc[key] = cleanValue;
        }
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});

    // Adjust logic based on selections
    if (cleanAnswers.frontend === 'Django Templates') {
      cleanAnswers.backend = 'Django';
    }
    if (cleanAnswers.backend === 'Django') {
      cleanAnswers.frontend = 'Django Templates';
    }

    if (cleanAnswers.database === 'MongoDB' && cleanAnswers.orm !== 'Mongoose') {
      console.log('\n' + createBorder());
      console.error(chalk.bgRed.white.bold(" ❌ Error: MongoDB supports only Mongoose ORM. "));
      console.log(createBorder());
      process.exit(1);
    }
    if (cleanAnswers.database === 'PostgreSQL' && !['Prisma', 'Drizzle'].includes(cleanAnswers.orm)) {
      console.log('\n' + createBorder());
      console.error(chalk.bgRed.white.bold(" ❌ Error: PostgreSQL supports only Prisma or Drizzle ORM. "));
      console.log(createBorder());
      process.exit(1);
    }

    console.log('\n' + createBorder());
    console.log(chalk.bgGreen.black.bold("\n 📦 Creating your project... \n"));
    console.log(createBorder() + '\n');
    
    await createProject(projectName, cleanAnswers);
  });

program.parse(process.argv);
