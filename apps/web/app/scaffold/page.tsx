'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Layout, Server, Database, FolderOpen } from 'lucide-react';
import { Steps } from '@/components/ui/steps';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

interface ProjectConfig {
  projectName: string;
  projectPath: string;
  frontendPort: number;
  backendPort: number;
  frontend: string | 'Skip' | null;
  backend: string | 'Skip' | null;
  database: string | 'Skip' | null;
  orm: string | 'Skip' | null;
  dbUrl: string;
  giturl: string | null;
  ui : string | null;
}

const SkipButton = ({ onSkip }: { onSkip: () => void }) => (
  <Button
    variant="outline"
    onClick={onSkip}
    className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/10 border-orange-200 hover:border-orange-300 dark:border-orange-800"
  >
    Skip
  </Button>
);

const Navbar = () => (
  <nav className="navbar backdrop-blur-sm">
    <div className="max-w-6xl mx-auto px-8 py-3 flex justify-center">
      <div className="flex flex-col items-center">
        <pre className="text-cyan-500 text-xs leading-none font-bold">
{`     ██████╗████████╗ █████╗  ██████╗██╗  ██╗'██████╗ 
    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝██╔══██╗
    ╚█████╗    ██║   ███████║██║     █████═╝ ██║  ██║
     ╚═══██╗   ██║   ██╔══██║██║     ██╔═██╗ ██║  ██║
    ██████╔╝   ██║   ██║  ██║╚██████╗██║  ██╗██████╔╝
    ╚═════╝    ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═════╝`}
        </pre>
        <p className="text-sm text-cyan-500/80 mt-2">Full Stack Project Generator</p>
      </div>
      
      <a 
        href="https://github.com/ShyamSunder06/STACKD" 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute right-8 text-muted-foreground hover:text-foreground"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="currentColor"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </a>
    </div>
  </nav>
);

const TerminalLogs = ({ logs }: { logs: string[] }) => (
  <div className="bg-black rounded-lg p-4 font-mono text-sm text-green-400 max-h-96 overflow-auto">
    {logs.map((log, i) => (
      <div key={i} className="whitespace-pre-wrap">
        <span className="text-blue-400">$</span> {log}
      </div>
    ))}
  </div>
);

const SuccessAnimation = ({ projectPath }: { projectPath: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center p-8"
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.5 }}
      className="text-6xl mb-4"
    >
      🎉
    </motion.div>
    <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
    <p className="text-muted-foreground mb-6">
      Your project is ready. Happy coding!
    </p>
    <div className="bg-secondary p-4 rounded-lg mb-6">
      <p className="font-medium mb-2">Project Location:</p>
      <code className="text-sm">{projectPath}</code>
    </div>
    <Button
      onClick={() => window.open(`file://${projectPath}`, '_blank')}
      className="gap-2"
    >
      <FolderOpen className="h-4 w-4" />
      Open Project Folder
    </Button>
  </motion.div>
);

const ScaffoldPage = () => {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<ProjectConfig>({
    projectName: '',
    projectPath: process.cwd(),
    frontendPort: 3000,
    backendPort: 3001,
    frontend: null,
    backend: null,
    database: null,
    orm: null,
    auth: null,
    dbUrl: '',
    giturl: null,
    ui : null,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedPath, setGeneratedPath] = useState('');

  useEffect(() => {
    if (isGenerating) {
      const eventSource = new EventSource('/api/scaffold/logs');
      
      eventSource.onmessage = (event) => {
        setLogs(prev => [...prev, event.data]);
      };

      eventSource.onerror = () => {
        eventSource.close();
      };

      return () => eventSource.close();
    }
  }, [isGenerating]);

  const steps = [
    {
      title: "Project Settings",
      description: "Basic configuration",
      icon: <FolderOpen className="w-5 h-5" />,
      component: (
        <div className="space-y-4 w-full max-w-md">
          <div>
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              placeholder="my-fullstack-app"
              value={config.projectName}
              onChange={(e) => setConfig(prev => ({ ...prev, projectName: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="projectPath">Project Location</Label>
            <Input
              id="projectPath"
              placeholder="/path/to/your/project"
              value={config.projectPath}
              onChange={(e) => setConfig(prev => ({ ...prev, projectPath: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frontendPort">Frontend Port</Label>
              <Input
                id="frontendPort"
                type="number"
                value={config.frontendPort}
                onChange={(e) => setConfig(prev => ({ ...prev, frontendPort: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="backendPort">Backend Port</Label>
              <Input
                id="backendPort"
                type="number"
                value={config.backendPort}
                onChange={(e) => setConfig(prev => ({ ...prev, backendPort: parseInt(e.target.value) }))}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Frontend",
      description: "Choose your frontend",
      icon: <Layout className="w-5 h-5" />,
      options: [
        { id: 'react-ts', name: 'React + TypeScript', description: 'React with TypeScript template', features: ['Vite', 'TypeScript', 'React Router', 'TailwindCSS'] },
        { id: 'react', name: 'React (JavaScript)', description: 'React with JavaScript template', features: ['Vite', 'JavaScript', 'React Router', 'TailwindCSS'] },
        { id: 'django', name: 'Django Templates', description: 'Django framework', features: ['Full-stack', 'Django ORM', 'Django Admin'] },
        { id: 'vue-ts', name: 'Vue + TypeScript', description: 'Vue 3 with TypeScript template', features: ['Vite', 'TypeScript', 'Vue Router', 'Pinia', 'TailwindCSS'] },
        { id: 'vue', name: 'Vue (JavaScript)', description: 'Vue 3 with JavaScript template', features: ['Vite', 'JavaScript', 'Vue Router', 'Pinia', 'TailwindCSS'] },
        { id: 'angularts', name: 'Angular (Typescript)', description: 'Angular 16 with Typescript template', features: ['Angular CLI', 'Typescript', 'Angular Router', 'Angular Material', 'TailwindCSS'] },
        { id: 'nextjs', name: 'Next.js', description: 'Next.js with TypeScript template', features: ['Next.js', 'TypeScript', 'TailwindCSS'] },
        { id: 'Skip', name: 'Skip', description: 'Skip frontend configuration', features: ['Skip this step'] },
      ]
    },
    {
        title : "UI",
        description : "Choose your UI",
        icon : <Layout className="w-5 h-5" />,
        options : [
            { id: 'shadcn', name: 'Shadcn', description: 'Shadcn UI', features: ['Shadcn UI', 'TailwindCSS'] },
            { id: 'tailwind', name: 'TailwindCSS', description: 'TailwindCSS', features: ['TailwindCSS', 'React'] },
            { id: 'Skip', name: 'Skip', description: 'Skip UI configuration', features: ['Skip this step'] },
        ]
    },
    {
      title: "Backend",
      description: "Select your backend",
      icon: <Server className="w-5 h-5" />,
      options: [
        { id: 'express-ts', name: 'Express + TypeScript', description: 'Express with TypeScript setup', features: ['TypeScript', 'API Routes', 'Middleware', 'CORS'] },
        { id: 'express', name: 'Express (JavaScript)', description: 'Express with JavaScript setup', features: ['JavaScript', 'API Routes', 'Middleware', 'CORS'] },
        { id: 'django', name: 'Django', description: 'Django framework', features: ['Full-stack', 'Django ORM', 'Django Admin'] },
        { id: 'Skip', name: 'Skip', description: 'Skip backend configuration', features: ['Skip this step'] }
      ]
    },
    {
      title: "Database",
      description: "Pick your database",
      icon: <Database className="w-5 h-5" />,
      options: [
        { id: 'postgresql', name: 'PostgreSQL', description: 'Powerful, open source database', features: ['Prisma ORM', 'Migrations', 'TypeScript'] },
        { id: 'mongodb', name: 'MongoDB', description: 'NoSQL document database', features: ['Mongoose', 'Schemas', 'TypeScript'] },
        { id: 'Skip', name: 'Skip', description: 'Skip database configuration', features: ['Skip this step'] }
      ]
    },
    {
      title: "ORM",
      description: "Select your ORM",
      icon: <Database className="w-5 h-5" />,
      options: config.database === 'postgresql' ? [
        { id: 'prisma', name: 'Prisma', description: 'Prisma ORM', features: ['Type-safe', 'Migrations'] },
        { id: 'drizzle', name: 'Drizzle', description: 'Drizzle ORM', features: ['Lightweight', 'Flexible'] },
        { id: 'Skip', name: 'Skip', description: 'Skip ORM configuration', features: ['Skip this step'] }
      ] : config.database === 'mongodb' ? [
        { id: 'mongoose', name: 'Mongoose', description: 'Mongoose ORM', features: ['Schemas', 'Validation'] },
        { id: 'Skip', name: 'Skip', description: 'Skip ORM configuration', features: ['Skip this step'] }
      ] : [
        { id: 'Skip', name: 'Skip', description: 'Skip ORM configuration', features: ['Skip this step'] }
      ]
    },
    {
      title: "auth",
      description: "Choose your authentication method",
      icon: <Server className="w-5 h-5" />,
      options: [
        { id: 'jwt', name: 'JWT', description: 'JSON Web Tokens', features: ['Stateless', 'Secure'] },
        { id: 'nextauth', name: 'NextAuth', description: 'NextAuth.js', features: ['Strategies', 'Middleware'] },
        { id: 'passport', name: 'Passport', description: 'Passport.js', features: ['Strategies', 'Middleware'] },
        { id: 'Skip', name: 'Skip', description: 'Skip authentication configuration', features: ['Skip this step'] }
      ]
    },
    {
      title: "Database URL",
      description: "Enter your database URL",
      icon: <Database className="w-5 h-5" />,
      component: config.database !== 'Skip' ? (
        <div className="space-y-4 w-full max-w-md">
          <div>
            <Label htmlFor="dbUrl">Database URL</Label>
            <Input
              id="dbUrl"
              placeholder="Enter your database URL"
              value={config.dbUrl}
              onChange={(e) => setConfig(prev => ({ ...prev, dbUrl: e.target.value }))}
            />
          </div>
        </div>
      ) : null
    },{
        title: "Git URL",
        description: "Enter your git URL",
        icon: <Database className="w-5 h-5" />,
        component: config.giturl !== 'Skip' ? (
          <div className="space-y-4 w-full max-w-md">
            <div>
              <Label htmlFor="giturl">Git URL</Label>
              <Input
                id="giturl"
                placeholder="Enter your git URL"
                value={config.giturl || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, giturl: e.target.value }))}
              />
            </div>
          </div>
        ) : null
      }
  ];

  const handleSelect = (key: keyof ProjectConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const validateConfig = () => {
    if (!config.projectName.trim()) {
      toast.error('Please enter a project name');
      return false;
    }
    if (!config.projectPath.trim()) {
      toast.error('Please enter a project location');
      return false;
    }
    if (config.frontendPort === config.backendPort) {
      toast.error('Frontend and backend ports must be different');
      return false;
    }
    return true;
  };

  const handleGenerate = async () => {
    if (!validateConfig()) return;

    try {
      setIsGenerating(true);
      setLogs([]);
      
      const response = await fetch('/api/scaffold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (!response.ok) throw new Error('Failed to generate project');

      const result = await response.json();

      if (result.success) {
        setGeneratedPath(result.projectPath);
        setIsSuccess(true);
      }
    } catch (error) {
      toast.error('Failed to generate project');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Create Your Project</h1>
            <p className="text-muted-foreground">
              Configure your full-stack application
            </p>
          </div>

          <Steps
            steps={steps.map(s => ({
              title: s.title,
              description: s.description,
              icon: s.icon
            }))}
            currentStep={step}
            onStepClick={setStep}
          />

          <div className="mt-8">
            {steps[step]?.component ? (
              <div className="flex justify-center">
                {steps[step].component}
              </div>
            ) : (
              <div className="relative">
                <div className="grid md:grid-cols-3 gap-4 card-grid">
                  {steps[step]?.options?.filter(option => option.id !== 'Skip').map((option) => (
                    <Card
                      key={option.id}
                      className={`card p-4 cursor-pointer interactive-element ${
                        config[steps[step]?.title.toLowerCase() as keyof ProjectConfig] === option.id
                          ? 'border-primary/50 bg-primary/5 card-selected'
                          : ''
                      }`}
                      onClick={() => handleSelect(steps[step]?.title.toLowerCase() as keyof ProjectConfig, option.id)}
                    >
                      <div className="relative z-10">
                        <h3 className="font-medium mb-2 text-lg">{option.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {option.description}
                        </p>
                        <div className="space-y-1">
                          {option.features.map((feature, index) => (
                            <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                              <span className="text-primary">•</span> {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="px-6"
              >
                Previous
              </Button>

              {step === steps.length - 1 ? (
                <Button onClick={handleGenerate} className="px-6">
                  Generate Project
                </Button>
              ) : (
                <div className="flex gap-2">
                  {step > 0 && !steps[step].component && (
                    <SkipButton
                      onSkip={() => handleSelect(
                        steps[step]?.title.toLowerCase() as keyof ProjectConfig,
                        'Skip'
                      )}
                    />
                  )}
                  <Button
                    onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
                    disabled={
                      step === 0 
                        ? !config.projectName || !config.projectPath 
                        : step === steps.length - 2 && config.database !== 'Skip'  // Database URL step
                        ? !config.dbUrl
                        : step === steps.length - 1 && config.giturl !== 'Skip'    // Git URL step
                        ? !config.giturl
                        : !config[steps[step]?.title.toLowerCase() as keyof ProjectConfig]
                    }
                    className="px-6"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>

          {isSuccess ? (
            <SuccessAnimation projectPath={generatedPath} />
          ) : isGenerating ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Generating Your Project...</h2>
              <TerminalLogs logs={logs} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ScaffoldPage;