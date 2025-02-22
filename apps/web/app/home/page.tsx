import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Project Scaffolder</h1>
                <p className="text-xl text-muted-foreground mb-8">
                    Create your full-stack application in minutes
                </p>
                <Link href="/scaffold">
                    <Button size="lg">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </main>
    )
}