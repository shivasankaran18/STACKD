package executors

import (
	"os/exec"
	"fmt"
	"os"
	"github.com/shivasankaran18/STACKD/internal/prompt"
)

func CreateFrontend(dir string, frontend prompt.FrontEndResponse) {

	switch frontend {
	case prompt.ReactJS:
		CreateReactJS(dir)
	case prompt.ReactTS:
		CreateReactTS(dir)
	case prompt.Frontend_None:
		return
	default:
		return
	}
}

func CreateReactJS(dir string) {
	var path string= dir+"/frontend"
	error:=os.MkdirAll(path, os.ModePerm)
	if error != nil {
		fmt.Println("Error creating frontend directory:", error)
		os.Exit(1)
		return
	}
	command :=exec.Command("npm","create","vite@latest",dir+"/frontend","--","--template","react")

	err := command.Run()
	if err != nil {
		fmt.Println("Error creating ReactJS project:", err)
		os.Exit(1)
	}

}
func CreateReactTS(dir string) {
	command :=exec.Command("npm","create","vite@latest",dir+"/frontend","--","--template","react-ts")

	err := command.Run()
	if err != nil {
		fmt.Println("Error creating ReactTS project:", err)
		os.Exit(1)
	}

}
