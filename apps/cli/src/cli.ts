#!/usr/bin/env node
import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { createProject } from './commands/create.js'

export interface ProjectConfig {
  projectName: string;
  projectPath: string;
  frontendPort: number;
  backendPort: number;
  frontend: string;
  backend: string;
  database: string;
  orm: string;
  auth: string;
  dbUrl: string;
  ui: string;
}

interface Answers {
  projectPath: string;
  frontendPort: number;
  backendPort: number;
  frontend: string;
  backend: string;
  database: string;
  orm: string;
  auth: string;
  dbUrl: string;
  projectName: string;
  ui: string;
}

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
  PASSPORT: 'Passport',
  TAILWIND: 'Tailwind CSS',
  SHADCN: 'shadcn/ui + Tailwind'
};

program
  .command('run ')
  .description('Create a new full-stack project')
  .action(async () => {
    // showBanner();
    // console.log(createBorder());
    // console.log(chalk.bgCyan.white.bold('\n  💫 Let\'s create something awesome!  \n'));
    // console.log(createBorder() + '\n');

    const projectSettings = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectPath',
        message: chalk.magenta.bold('📁 Where do you want to create the project?'),

      },
      {
        type:'input',
        name:'projectName',
        message:chalk.magenta.bold('💫 Enter the project name:'),
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

    // Add UI framework selection after frontend
    let uiChoice = { ui: CHOICES.NONE };
    if (frontendChoice.frontend !== chalk.green(CHOICES.DJANGO_TEMPLATES) && 
        frontendChoice.frontend !== CHOICES.SKIP) {
      uiChoice = await inquirer.prompt([
        {
          type: 'list',
          name: 'ui',
          message: chalk.magenta.bold('🎨 Choose a UI framework:'),
          choices: (answers) => {
            const isReact = frontendChoice.frontend.includes('React');
            return [
              chalk.blue(CHOICES.TAILWIND),
              ...(isReact ? [chalk.cyan(CHOICES.SHADCN)] : []),
              CHOICES.NONE
            ];
          },
          default: CHOICES.NONE,
        }
      ]);
    }

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


    const answers = {
      ...projectSettings,
      ...frontendChoice,
      ...uiChoice,
      ...backendChoice,
      ...databaseChoice,
      ...ormChoice,
      ...authChoice,
      ...dbUrlChoice,
    };


    const cleanAnswers = Object.entries(answers).reduce((acc, [key, value]) => {
      if (typeof value === 'string') {
        const cleanValue = value.replace(/\u001b\[\d+m/g, '').trim();
        // @ts-ignore
        acc[key] = cleanValue;
      } else {
        // @ts-ignore
        acc[key] = value;
      }
      return acc;
    }, {});


    // @ts-ignore
    if (cleanAnswers.database !== 'Skip' && cleanAnswers.orm !== 'Skip') {
      // @ts-ignore
      if (cleanAnswers.database === 'MongoDB' && cleanAnswers.orm !== 'Mongoose') {
        console.log('\n' + createBorder());
        console.error(chalk.bgRed.white.bold(" ❌ Error: MongoDB supports only Mongoose ORM. "));
        console.log(createBorder());
        process.exit(1);
      }
      // @ts-ignore
      if (cleanAnswers.database === 'PostgreSQL' && !['Prisma', 'Drizzle'].includes(cleanAnswers.orm)) {
        console.log('\n' + createBorder());
        console.error(chalk.bgRed.white.bold(" ❌ Error: PostgreSQL supports only Prisma or Drizzle ORM. "));
        console.log(createBorder());
        process.exit(1);
      }
    }


    // @ts-ignore
    if (cleanAnswers.frontend === 'Django Templates') {
      // @ts-ignore
      cleanAnswers.backend = 'Django';
    }
    // @ts-ignore
    if (cleanAnswers.backend === 'Django') {
      // @ts-ignore
      cleanAnswers.frontend = 'Django Templates';
    }

    console.log('\n' + createBorder());
    console.log(chalk.bgGreen.black.bold("\n 📦 Creating your project... \n"));
    console.log(createBorder() + '\n');
    // @ts-ignore
    await createProject(projectSettings.projectName, cleanAnswers);
  });

program.parse(process.argv);