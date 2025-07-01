package executorsmr

import (
	"fmt"
	"log"
	"os/exec"
	"github.com/shivasankaran18/STACKD/internal/monorepo/promptmr"

)

func CreateMonoRepo(dir string, monoRepo promptmr.MonoRepoResponse) {
	switch monoRepo {
	case promptmr.Turborepo:
		CreateTurbo(dir)
	case promptmr.Monorepo_None:
		return
	default:
		return
	}
}


func CreateTurbo(dir string) {
	fmt.Println("Creating TurboRepo project at", dir[2:])
	fmt.Println("npx create-turbo@latest ", dir[2:], " -m npm")
	cmd:=exec.Command("npx create-turbo@latest"+" "+dir[2:]+" -m npm")
	err := cmd.Run()
	if err != nil {
		log.Fatalf("Error creating TurboRepo project: %v", err)
		return
	}
	log.Println("TurboRepo project created successfully at", dir)
}

