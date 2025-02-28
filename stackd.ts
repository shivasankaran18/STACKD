#!/usr/bin/env tsx
import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const getPackageRoot = () => {
  let currentDir = __dirname;
  while (!fs.existsSync(join(currentDir, 'package.json'))) {
    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) {
      
      return process.cwd();
    }
    currentDir = parentDir;
  }
  return currentDir;
};

const packageRoot = getPackageRoot();

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

const getAppPath = (appName: string) => {
  const devPath = join(packageRoot, 'apps', appName);
  if (fs.existsSync(devPath)) {
    return devPath;
  }
  
  const publishedPath = join(packageRoot, 'node_modules', '@shivasankaran','stackd','apps', appName);
  if (fs.existsSync(publishedPath)) {
    return publishedPath;
  }
  
  return join(packageRoot, appName);
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
  
  try {
    if (answer.interface === 'cli') {
      console.log(chalk.blue('\n📦 Starting CLI interface...\n'));
      
      const cliAppPath = getAppPath('cli');
      const cliScriptPath = join(cliAppPath, 'src', 'cli.ts');
      console.log(cliScriptPath);
      if (!fs.existsSync(cliScriptPath)) {
        console.log(chalk.yellow(`\nCLI script not found at ${cliScriptPath}. Trying alternative paths...\n`));
        
        const command = 'npx tsx @stackd/cli/src/cli.ts run';
        executeCommand(command, process.cwd());
      } else {
        console.log("hello");
        executeCommand(`npx tsx ${cliScriptPath} run`, process.cwd());
      }
    } else {
      const webAppPath = getAppPath('web');
      
      console.log(chalk.green(`\n🌐 Setting up Web Interface at ${webAppPath}...\n`));
      
      if (!fs.existsSync(webAppPath)) {
        console.error(chalk.red(`\n❌ Web app directory not found at: ${webAppPath}`));
        process.exit(1);
      }
      
      await executeCommand('npm install', webAppPath);
      console.log(chalk.green('\n🚀 Starting Web Interface...'));
      console.log(chalk.green('\n🌐 Web interface available at http://localhost:3000\n'));
      executeCommand('npm run dev', webAppPath); 
    }
  } catch (error: any) {
    console.error(chalk.red(`\n❌ Failed to start the selected interface: ${error.message}`));
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