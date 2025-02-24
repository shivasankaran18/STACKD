#!/usr/bin/env ts-node

import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { spawn } from 'child_process';
import { join } from 'path';


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

const createBorder = () => chalk.cyan('='.repeat(60));

const executeCommand = (command: string, cwd: string) => {
  const [cmd, ...args] = command.split(' ');
  const process = spawn(cmd, args, { cwd, stdio: 'inherit', shell: true });

  process.on('error', (error) => {
    console.error(chalk.red(`Error: ${error.message}`));
  });

  return process;
};

const initializeProject = async () => {
  showBanner();
  console.log(createBorder());

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'interface',
      message: chalk.magenta.bold('🎯 Choose your preferred interface:'),
      choices: [
        { name: chalk.blue('CLI Interface'), value: 'cli' },
        { name: chalk.green('Web Interface'), value: 'web' }
      ]
    }
  ]);

  const rootDir = process.cwd();

  try {
    if (answer.interface === 'cli') {
      console.log(chalk.blue('\n📦 Starting CLI interface...\n'));
      executeCommand('npx tsx apps/cli/src/cli.ts run', rootDir);
    } else {
      console.log(chalk.green('\n🌐 Setting up Web Interface...\n'));
      await executeCommand('npm install', join(rootDir, 'apps/web'));

      console.log(chalk.green('\n🚀 Starting Web Interface...'));
      console.log(chalk.green('\n🌐 Web interface available at http://localhost:3000\n'));

      executeCommand('npm run dev', join(rootDir, 'apps/web')); 
    }
  } catch (error) {
    console.error(chalk.red('\n❌ Failed to start the selected interface'));
    process.exit(1);
  }
};

program
  .name('stackd')
  .description('CLI tool for creating full-stack applications')
  .version('6.0.0');

program
  .command('init')
  .action(initializeProject);


program
  .action(() => {
    console.log(chalk.yellow('\nNo command specified. Using "init" by default.\n'));
    initializeProject();
  });

program.parse(process.argv);




