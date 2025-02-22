'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Layout, Server, Database, FolderOpen } from "lucide-react"
import { Steps } from "@/components/ui/steps"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ProjectConfig {
    projectName: string;
    projectPath: string;
    frontendPort: number;
    backendPort: number;
    frontend: string | null;
    backend: string | null;
    database: string | null;
}

export default function ScaffoldPage() {
    const [step, setStep] = useState(0)
    const [config, setConfig] = useState<ProjectConfig>({
        projectName: '',
        projectPath: process.cwd(),
        frontendPort: 3000,
        backendPort: 3001,
        frontend: null,
        backend: null,
        database: null
    })

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
                            onChange={(e) => setConfig(prev => ({ 
                                ...prev, 
                                projectName: e.target.value 
                            }))}
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor="projectPath">Project Location</Label>
                        <Input
                            id="projectPath"
                            placeholder="/path/to/your/project"
                            value={config.projectPath}
                            onChange={(e) => setConfig(prev => ({ 
                                ...prev, 
                                projectPath: e.target.value 
                            }))}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="frontendPort">Frontend Port</Label>
                            <Input
                                id="frontendPort"
                                type="number"
                                value={config.frontendPort}
                                onChange={(e) => setConfig(prev => ({ 
                                    ...prev, 
                                    frontendPort: parseInt(e.target.value) 
                                }))}
                            />
                        </div>
                        <div>
                            <Label htmlFor="backendPort">Backend Port</Label>
                            <Input
                                id="backendPort"
                                type="number"
                                value={config.backendPort}
                                onChange={(e) => setConfig(prev => ({ 
                                    ...prev, 
                                    backendPort: parseInt(e.target.value) 
                                }))}
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
                { 
                    id: 'react-ts',
                    name: 'React + TypeScript',
                    description: 'React with TypeScript template',
                    features: ['Vite', 'TypeScript', 'React Router', 'TailwindCSS']
                },
                { 
                    id: 'react',
                    name: 'React (JavaScript)',
                    description: 'React with JavaScript template',
                    features: ['Vite', 'JavaScript', 'React Router', 'TailwindCSS']
                }
            ]
        },
        {
            title: "Backend",
            description: "Select your backend",
            icon: <Server className="w-5 h-5" />,
            options: [
                {
                    id: 'express-ts',
                    name: 'Express + TypeScript',
                    description: 'Express with TypeScript setup',
                    features: ['TypeScript', 'API Routes', 'Middleware', 'CORS']
                },
                {
                    id: 'express',
                    name: 'Express (JavaScript)',
                    description: 'Express with JavaScript setup',
                    features: ['JavaScript', 'API Routes', 'Middleware', 'CORS']
                }
            ]
        },
        {
            title: "Database",
            description: "Pick your database",
            icon: <Database className="w-5 h-5" />,
            options: [
                {
                    id: 'postgresql',
                    name: 'PostgreSQL',
                    description: 'Powerful, open source database',
                    features: ['Prisma ORM', 'Migrations', 'TypeScript']
                },
                {
                    id: 'mongodb',
                    name: 'MongoDB',
                    description: 'NoSQL document database',
                    features: ['Mongoose', 'Schemas', 'TypeScript']
                }
            ]
        }
    ]

    const handleSelect = (key: keyof ProjectConfig, value: string) => {
        setConfig(prev => ({ ...prev, [key]: value }))
        if (step < steps.length - 1) {
            setStep(step + 1)
        }
    }

    const validateConfig = () => {
        if (!config.projectName.trim()) {
            toast.error('Please enter a project name')
            return false
        }
        if (!config.projectPath.trim()) {
            toast.error('Please enter a project location')
            return false
        }
        if (config.frontendPort === config.backendPort) {
            toast.error('Frontend and backend ports must be different')
            return false
        }
        return true
    }

    const handleGenerate = async () => {
        if (!validateConfig()) return

        try {
            const response = await fetch('/api/scaffold', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            })

            if (!response.ok) throw new Error('Failed to generate project')

            const result = await response.json()
            
            if (result.success) {
                toast.success('Project generated successfully!', {
                    description: (
                        <div className="mt-2">
                            <p className="font-medium">Project created at:</p>
                            <code className="block bg-secondary p-2 rounded mt-1">
                                {result.projectPath}
                            </code>
                            
                            <p className="font-medium mt-4">To start development:</p>
                            <div className="bg-secondary p-2 rounded mt-1">
                                {result.instructions.setup.map((step: string, i: number) => (
                                    <code key={i} className="block">{step}</code>
                                ))}
                            </div>

                            <p className="font-medium mt-4">Your app will run at:</p>
                            <div className="bg-secondary p-2 rounded mt-1">
                                <code className="block">Frontend: http://localhost:{config.frontendPort}</code>
                                <code className="block">Backend: http://localhost:{config.backendPort}</code>
                            </div>
                        </div>
                    ),
                    duration: 10000,
                })
            }
        } catch (error) {
            toast.error('Failed to generate project')
        }
    }

    return (
        <div className="min-h-screen p-8 bg-background">
            <div className="max-w-4xl mx-auto">
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
                    {steps[step].component ? (
                        steps[step].component
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                            {steps[step].options?.map((option) => (
                                <Card 
                                    key={option.id}
                                    className={`p-4 cursor-pointer transition-all ${
                                        config[steps[step].title.toLowerCase() as keyof ProjectConfig] === option.id
                                            ? 'border-primary' 
                                            : 'hover:border-primary/50'
                                    }`}
                                    onClick={() => handleSelect(steps[step].title.toLowerCase() as keyof ProjectConfig, option.id)}
                                >
                                    <h3 className="font-medium mb-1">{option.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {option.description}
                                    </p>
                                    <div className="space-y-1">
                                        {option.features.map((feature, index) => (
                                            <div key={index} className="text-xs text-muted-foreground">
                                                • {feature}
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 flex justify-between">
                        <Button
                            variant="outline"
                            onClick={() => setStep(Math.max(0, step - 1))}
                            disabled={step === 0}
                        >
                            Previous
                        </Button>

                        {step === steps.length - 1 ? (
                            <Button 
                                onClick={handleGenerate}
                                disabled={!config.frontend || !config.backend || !config.database}
                            >
                                Generate Project
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
                                disabled={step === 0 ? !config.projectName || !config.projectPath : !config[steps[step].title.toLowerCase() as keyof ProjectConfig]}
                            >
                                Next
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}