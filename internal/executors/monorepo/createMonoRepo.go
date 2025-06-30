package executors_monorepo

import (
	"log"
	"os/exec"

	prompt_monorepo "github.com/shivasankaran18/STACKD/internal/prompt/monorepo"
)

func CreateMonoRepo(dir string, monoRepo prompt_monorepo.MonoRepoResponse) {
	switch monoRepo {
	case prompt_monorepo.Turborepo:
		CreateTurbo(dir)
	case prompt_monorepo.Monorepo_None:
		return
	default:
		return
	}
}


func CreateTurbo(dir string) {
	cmd := exec.Command("npx", "create-turbo@latest",dir,"-m npm")
	err := cmd.Run()
	if err != nil {
		log.Fatalf("Error creating TurboRepo project: %v", err)
		return
	}
	log.Println("TurboRepo project created successfully at", dir)
}
