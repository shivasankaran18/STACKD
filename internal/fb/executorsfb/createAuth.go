package executorsfb

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"text/template"
	"log"
	"github.com/shivasankaran18/STACKD/internal/fb/promptfb"
	"github.com/shivasankaran18/STACKD/internal/templates"

)

func CreateAuth(dir string, auth promptfb.AuthResponse, backend promptfb.BackendResponse) {
	switch auth {
	case promptfb.JWT:
		CreateJWT(dir, backend)
	case promptfb.Auth_None:
		return
	default:
		return
	}
}

func CreateJWT(dir string, backend promptfb.BackendResponse) {
	switch backend {
	case promptfb.ExpressJS:
		CreateJWTExpressJS(dir)
	case promptfb.ExpressTS:
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

	jwtTmpl,err:=template.New("jwt.js").Parse(templates.JwtJSTemplates)
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

	jwtTmpl,err:=template.New("jwt.ts").Parse(templates.JwtTSTemplates)
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



