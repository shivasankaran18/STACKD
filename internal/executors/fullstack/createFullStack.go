package executors_fullstack

import (
	"log"
	"os/exec"

	prompt_fullstack "github.com/shivasankaran18/STACKD/internal/prompt/fullstack"
)

func CreateFullStack(dir string, fullstack prompt_fullstack.FullStackResponse) {
	switch fullstack {
	case prompt_fullstack.NextJs:
		CreateNext(dir)
	case prompt_fullstack.Django:
		//CreateDjango(dir)
	default:
		log.Println("No full stack framework selected")
		return
	}

}


func CreateNext(dir string){
	cmd := exec.Command("npx", "create-next-app@latest",dir, "--no-src-dir","--yes");
	err := cmd.Run()
	if err != nil {
		log.Fatalf("Error creating Next.js project: %v", err)
		return
	}
	log.Println("Next.js project created successfully at", dir)

}
