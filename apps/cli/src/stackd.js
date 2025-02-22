#!/usr/bin/env node

import { Command } from 'commander';
import { createProject } from './commands/create.js';

const program = new Command();

// Define package version manually since we're having JSON import issues
const VERSION = '1.0.0';

program
  .name('stackd')
  .description('CLI to scaffold full-stack applications')
  .version(VERSION);

program
  .command('create')
  .description('Create a new full-stack project')
  .argument('<project-name>', 'Name of the project')
  .option('-f, --frontend <framework>', 'Frontend framework (react, react-ts, vue, vue-ts)', 'react-ts')
  .option('-b, --backend <framework>', 'Backend framework (express, express-ts)', 'express-ts')
  .option('--frontend-port <port>', 'Frontend port number', '3000')
  .option('--backend-port <port>', 'Backend port number', '5000')
  .option('--db-url <url>', 'Database URL for Prisma')
  .option('--auth', 'Add JWT authentication', false)
  .action(async (projectName, options) => {
    try {
      const config = {
        projectName,
        projectPath: process.cwd(),
        frontendPort: options.frontendPort,
        backendPort: options.backendPort,
        dbUrl: options.dbUrl,
        frontend: options.frontend,
        backend: options.backend,
        auth: options.auth
      };

      await createProject(projectName, options);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

program.parse(process.argv);