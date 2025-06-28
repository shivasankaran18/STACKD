package executors

import (
	"log"
	"os/exec"
	"github.com/shivasankaran18/STACKD/internal/prompt"

)

func CreateMonoRepo(dir string, monoRepo prompt.MonoRepoResponse) {
	switch monoRepo {
	case prompt.Turborepo:
		CreateTurbo(dir)
	case prompt.MonoRepo_None:
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
