interface Step {
    title: string;
    description: string;
    icon: React.ReactNode;
}

interface StepsProps {
    steps: Step[];
    currentStep: number;
    onStepClick: (step: number) => void;
}

export function Steps({ steps, currentStep, onStepClick }: StepsProps) {
    return (
        <div className="flex justify-between">
            {steps.map((step, index) => (
                <div
                    key={step.title}
                    className={`flex flex-col items-center cursor-pointer ${
                        index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                    }`}
                    onClick={() => onStepClick(index)}
                >
                    <div className={`
                        w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2
                        ${index <= currentStep ? 'border-primary' : 'border-muted'}
                    `}>
                        {step.icon}
                    </div>
                    <div className="text-sm font-medium">{step.title}</div>
                    <div className="text-xs text-muted-foreground">{step.description}</div>
                </div>
            ))}
        </div>
    )
}