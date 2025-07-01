package executorsfs
import (
	"log"
	"os/exec"
	"github.com/shivasankaran18/STACKD/internal/fs/promptfs"

)

func CreateFullStack(dir string, fullstack promptfs.FullStackResponse) {
	switch fullstack {
	case promptfs.NextJs:
		CreateNext(dir)
	case promptfs.Django:
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

