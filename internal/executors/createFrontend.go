package executors

import (
	"os/exec"
	"fmt"
	"os"
	"github.com/shivasankaran18/STACKD/internal/prompt"
)

func CreateFrontend(dir string, frontend prompt.FrontEndResponse) {

	switch frontend {
	case "React+JS":
		CreateReactJS(dir)
	case "React+TS":
		CreateReactTS(dir)
	case "None":
		return
	default:
		return
	}
}

func CreateReactJS(dir string) {
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
