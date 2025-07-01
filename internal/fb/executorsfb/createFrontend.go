package executorsfb

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/shivasankaran18/STACKD/internal/fb/promptfb"
)

func CreateFrontend(dir string, frontend promptfb.FrontEndResponse) {

	switch frontend {
	case promptfb.ReactJS:
		CreateReactJS(dir)
	case promptfb.ReactTS:
		CreateReactTS(dir)
	case promptfb.Frontend_None:
		return
	default:
		return
	}
}

func CreateReactJS(dir string) {
	var path string = dir + "/frontend"
	error := os.MkdirAll(path, os.ModePerm)
	if error != nil {
		fmt.Println("Error creating frontend directory:", error)
		os.Exit(1)
		return
	}
	command := exec.Command("npm", "create", "vite@latest", dir+"/frontend", "--", "--template", "react")

	err := command.Run()
	if err != nil {
		fmt.Println("Error creating ReactJS project:", err)
		os.Exit(1)
	}

}
func CreateReactTS(dir string) {
	command := exec.Command("npm", "create", "vite@latest", dir+"/frontend", "--", "--template", "react-ts")

	err := command.Run()
	if err != nil {
		fmt.Println("Error creating ReactTS project:", err)
		os.Exit(1)
	}

}
