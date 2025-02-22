'use client'

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export default function ConfigurePage() {
    const searchParams = useSearchParams()
    const initialTech = {
        frontend: searchParams.get('frontend'),
        backend: searchParams.get('backend'),
        database: searchParams.get('database'),
    }

    const [config, setConfig] = useState({
        projectName: '',
        typescript: true,
        tailwind: true,
        ...initialTech
    })

    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/scaffold', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config),
            })

            if (!response.ok) {
                throw new Error('Failed to generate project')
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${config.projectName}.zip`
            document.body.appendChild(a)
            a.click()
            a.remove()
            
            toast.success('Project generated successfully!')
        } catch (error) {
            console.error('Error:', error)
            toast.error('Failed to generate project')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen p-8 bg-background">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Configure Your Project</h1>
                
                <Card className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">
                                Project Name
                            </label>
                            <Input
                                value={config.projectName}
                                onChange={(e) => setConfig(prev => ({ 
                                    ...prev, 
                                    projectName: e.target.value 
                                }))}
                                placeholder="my-awesome-project"
                                className="mt-1"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">
                                TypeScript
                            </label>
                            <Switch
                                checked={config.typescript}
                                onCheckedChange={(checked) => setConfig(prev => ({ 
                                    ...prev, 
                                    typescript: checked 
                                }))}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">
                                Tailwind CSS
                            </label>
                            <Switch
                                checked={config.tailwind}
                                onCheckedChange={(checked) => setConfig(prev => ({ 
                                    ...prev, 
                                    tailwind: checked 
                                }))}
                            />
                        </div>

                        <div className="pt-4">
                            <Button 
                                className="w-full" 
                                onClick={handleSubmit}
                                disabled={!config.projectName || isLoading}
                            >
                                {isLoading ? 'Generating...' : 'Generate Project'}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}