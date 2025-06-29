package executors_fb

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"text/template"
	"log"

	prompt_fb "github.com/shivasankaran18/STACKD/internal/prompt/fb"
)

func CreateAuth(dir string, auth prompt_fb.AuthResponse, backend prompt_fb.BackendResponse) {
	switch auth {
	case prompt_fb.JWT:
		CreateJWT(dir, backend)
	case prompt_fb.Auth_None:
		return
	default:
		return
	}
}

func CreateJWT(dir string, backend prompt_fb.BackendResponse) {
	switch backend {
	case prompt_fb.ExpressJS:
		CreateJWTExpressJS(dir)
	case prompt_fb.ExpressTS:
		CreateJWTExpressTS(dir)
	default:
		return
	}
}

func CreateJWTExpressJS(dir string) {
	var path string=dir+"/backend"
	error := os.MkdirAll(path+"/middleware", os.ModePerm)
	if error != nil {
		fmt.Println("Error creating middleware directory:", error)
		os.Exit(1)
		return
	}
	command := exec.Command("npm", "install", "jsonwebtoken")
	command.Dir = path
	err := command.Run()
	if err != nil {
		fmt.Println("Error installing jsonwebtoken:", err)
		os.Exit(1)
		return
	}

	jwtTmplPath := filepath.Join("internal/templates/expressjs", "jwt.tmpl")
	jwtTmpl, err := template.ParseFiles(jwtTmplPath)
	if err != nil {
		log.Println("Error parsing jwt.tmpl template:", err)
		os.Exit(1)
		return
	}
	f, err := os.Create(filepath.Join(path, "middleware", "auth.js"))
	if err != nil {
		fmt.Println("Error creating auth.js file:", err)
		os.Exit(1)
		return
	}
	defer f.Close()

	err = jwtTmpl.Execute(f, nil)
	if err != nil {
		fmt.Println("Error executing jwt.tmpl template:", err)
		os.Exit(1)
		return
	}
}

func CreateJWTExpressTS(dir string) {
	var path string=dir+"/backend"
	error := os.MkdirAll(path+"/middleware", os.ModePerm)
	if error != nil {
		fmt.Println("Error creating middleware directory:", error)
		os.Exit(1)
		return
	}
	command := exec.Command("npm", "install", "jsonwebtoken")
	command.Dir = path
	err := command.Run()
	if err != nil {
		fmt.Println("Error installing jsonwebtoken:", err)
		os.Exit(1)
		return
	}
	command=exec.Command("npm", "install", "@types/jsonwebtoken")
	command.Dir = path
	err = command.Run()
	if err != nil {
		fmt.Println("Error installing @types/jsonwebtoken:", err)
		os.Exit(1)
		return
	}

	jwtTmplPath := filepath.Join("internal/templates/expressts", "jwt.tmpl")
	jwtTmpl, err := template.ParseFiles(jwtTmplPath)
	if err != nil {
		log.Println("Error parsing jwt.tmpl template:", err)
		os.Exit(1)
		return
	}
	f, err := os.Create(filepath.Join(path, "middleware", "auth.ts"))
	if err != nil {
		fmt.Println("Error creating auth.ts file:", err)
		os.Exit(1)
		return
	}
	defer f.Close()
	err = jwtTmpl.Execute(f, nil)
	if err != nil {
		fmt.Println("Error executing jwt.tmpl template:", err)
		os.Exit(1)
		return
	}
}


