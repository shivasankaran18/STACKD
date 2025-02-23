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


const createBorder = () => {
  const border = '='.repeat(60);
  return chalk.cyan(border);

};

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
  SKIP: 'Skip',
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

    // Step 1: Project Settings
    const projectSettings = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectPath',
        message: chalk.magenta.bold('📁 Where do you want to create the project?'),

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
      }
    ]);

    // Step 2: Frontend Selection
    const frontendChoice = await inquirer.prompt([
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
          CHOICES.SKIP
        ],
        default: CHOICES.SKIP,
      }
    ]);

    // Step 3: Backend Selection
    const backendChoice = await inquirer.prompt([
      {
        type: 'list',
        name: 'backend',
        message: chalk.cyan.bold('🛠️  Choose a backend framework:'),
        choices: (answers) => {
          if (frontendChoice.frontend === chalk.green(CHOICES.DJANGO_TEMPLATES)) {
            return [chalk.green(CHOICES.DJANGO)];
          }
          return [
            chalk.blue(CHOICES.EXPRESS_TS),
            chalk.blue(CHOICES.EXPRESS_JS),
            chalk.green(CHOICES.DJANGO),
            CHOICES.SKIP
          ];
        },
        default: chalk.blue(CHOICES.EXPRESS_TS),
      }
    ]);

    // Step 4: Database Selection
    const databaseChoice = await inquirer.prompt([
      {
        type: 'list',
        name: 'database',
        message: chalk.magenta.bold('🗄️  Choose a database:'),
        choices: [
          chalk.blue(CHOICES.POSTGRESQL),
          chalk.green(CHOICES.MONGODB),
          CHOICES.SKIP
        ],
        default: CHOICES.SKIP,
      }
    ]);

    // Step 5: ORM Selection (only if database is selected)
    let ormChoice = { orm: CHOICES.SKIP };
    if (databaseChoice.database !== CHOICES.SKIP) {
      ormChoice = await inquirer.prompt([
        {
          type: 'list',
          name: 'orm',
          message: chalk.yellow.bold('🔗 Choose an ORM:'),
          choices: () => {
            const cleanDatabase = databaseChoice.database.replace(/\u001b\[\d+m/g, '').trim();
            return cleanDatabase === CHOICES.POSTGRESQL
              ? [chalk.magenta(CHOICES.PRISMA), chalk.cyan(CHOICES.DRIZZLE), CHOICES.SKIP]
              : [chalk.green(CHOICES.MONGOOSE), CHOICES.SKIP];
          },
          default: CHOICES.SKIP,
        }
      ]);
    }

    // Step 6: Authentication Selection
    const authChoice = await inquirer.prompt([
      {
        type: 'list',
        name: 'auth',
        message: chalk.cyan.bold('🔐 Choose an authentication method:'),
        choices: [
          chalk.yellow(CHOICES.JWT),
          chalk.blue(CHOICES.NEXTAUTH),
          chalk.green(CHOICES.PASSPORT),
          CHOICES.SKIP
        ],
        default: CHOICES.SKIP,
      }
    ]);

    // Step 7: Database URL (only if database is selected)
    let dbUrlChoice = { dbUrl: '' };
    if (databaseChoice.database !== CHOICES.SKIP) {
      dbUrlChoice = await inquirer.prompt([
        {
          type: 'input',
          name: 'dbUrl',
          message: chalk.green.bold('🔌 Enter database connection URL:'),
        }
      ]);
    }

    // Combine all answers
    const answers = {
      ...projectSettings,
      ...frontendChoice,
      ...backendChoice,
      ...databaseChoice,
      ...ormChoice,
      ...authChoice,
      ...dbUrlChoice,
    };

    // Clean the answers (remove color codes)
    const cleanAnswers = Object.entries(answers).reduce((acc, [key, value]) => {
      if (typeof value === 'string') {
        const cleanValue = value.replace(/\u001b\[\d+m/g, '').trim();
        acc[key] = cleanValue;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});

    // Validate combinations
    if (cleanAnswers.database !== 'Skip' && cleanAnswers.orm !== 'Skip') {
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
    }

    // Handle Django Templates special case
    if (cleanAnswers.frontend === 'Django Templates') {
      cleanAnswers.backend = 'Django';
    }
    if (cleanAnswers.backend === 'Django') {
      cleanAnswers.frontend = 'Django Templates';
    }

    console.log('\n' + createBorder());
    console.log(chalk.bgGreen.black.bold("\n 📦 Creating your project... \n"));
    console.log(createBorder() + '\n');
    
    await createProject(projectName, cleanAnswers);
  });

program.parse(process.argv);