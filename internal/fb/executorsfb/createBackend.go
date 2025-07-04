package executorsfb
import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"text/template"
	"github.com/shivasankaran18/STACKD/internal/fb/promptfb"

	"github.com/shivasankaran18/STACKD/internal/templates"

)



func CreateBackend(dir string, backend promptfb.BackendResponse) {
	switch backend {
	case promptfb.ExpressJS:
		CreateExpressJS(dir)
	case promptfb.ExpressTS:
		CreateExpressTS(dir)
	case promptfb.Backend_None:
		return
	default:
		return
	}
}

func CreateExpressJS(dir string) {
	var path string = dir + "/backend"
	error := os.MkdirAll(path, os.ModePerm)
	if error != nil {
		fmt.Println("Error creating backend directory:", error)
		os.Exit(1)
		return
	}
	command := exec.Command("npm", "init", "-y")
	command.Dir = path

	err := command.Run()
	if err != nil {
		fmt.Println("Error initializing npm,Check if Node and npm are installed", err)
		os.Exit(1)
		return
	}

	command = exec.Command("npm", "install", "express", "cors")
	command.Dir = path
	err = command.Run()

	if err != nil {
		fmt.Println("Error installing ExpressJS:", err)
		os.Exit(1)
		return
	}

	indexTmplPath := "expressjs/index.js.tmpl";
	indexTmpl, err := template.ParseFS(templates.IndexJSTemplates, indexTmplPath)

	if err != nil {
		log.Println("Error parsing index.js template:", err)
		os.Exit(1)
		return
	}

	f, err := os.Create(filepath.Join(path, "index.js"))
	if err != nil {
		fmt.Println("Error creating index.js file:", err)
		os.Exit(1)
		return
	}
	defer f.Close()

	err = indexTmpl.Execute(f, nil)
	if err != nil {
		fmt.Println("Error executing template for index.js:", err)
		os.Exit(1)
		return
	}

	newpath := filepath.Join(path, "routes")
	err = os.MkdirAll(newpath, os.ModePerm)
	if err != nil {
		fmt.Println("Error creating routes directory:", err)
		os.Exit(1)
		return
	}
	newpath = filepath.Join(newpath, "middlewares")
	err = os.MkdirAll(newpath, os.ModePerm)
	if err != nil {
		fmt.Println("Error creating middlewares directory:", err)
		os.Exit(1)
		return
	}

	newpath = filepath.Join(path, "controllers")
	err = os.MkdirAll(newpath, os.ModePerm)
	if err != nil {
		fmt.Println("Error creating controllers directory:", err)
		os.Exit(1)
		return
	}

}

func CreateExpressTS(dir string) {
	var path string = dir + "/backend"
	error := os.MkdirAll(path, os.ModePerm)
	if error != nil {
		fmt.Println("Error creating backend directory:", error)
		os.Exit(1)
		return
	}
	command := exec.Command("npm", "init", "-y")
	command.Dir = path
	err := command.Run()
	if err != nil {
		fmt.Println("Error initializing npm,Check if Node and npm are installed", err)
		os.Exit(1)
		return
	}
	
	command = exec.Command("npm", "install", "express", "cors", "@types/express", "@types/node","@types/cors", "typescript")
	command.Dir = path
	err = command.Run()
	if err != nil {
		fmt.Println("Error installing ExpressTS:", err)
		os.Exit(1)
		return
	}

	command=exec.Command("npx", "tsc", "--init")
	command.Dir = path
	err = command.Run()
	if err != nil {
		fmt.Println("Error initializing TypeScript,Check if TypeScript is installed", err)
		os.Exit(1)
		return
	}

	indexTmplPath := "expressts/index.ts.tmpl"
	indexTmpl, err := template.ParseFS(templates.IndexTSTemplates, indexTmplPath)
	if err != nil {
		log.Println("Error parsing index.ts template:", err)
		os.Exit(1)
		return
	}
	f, err := os.Create(filepath.Join(path, "index.ts"))
	if err != nil {
		fmt.Println("Error creating index.ts file:", err)
		os.Exit(1)
		return
	}
	defer f.Close()
	err = indexTmpl.Execute(f, nil)
	if err != nil {
		fmt.Println("Error executing template for index.ts:", err)
		os.Exit(1)
		return
	}

}

