package executors_fullstack

import (
	prompt_fullstack "github.com/shivasankaran18/STACKD/internal/prompt/fullstack"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"text/template"
	"log"
)

func CreateAuth(dir string, auth prompt_fullstack.AuthResponse) {
	switch auth {

	case prompt_fullstack.NextAuth:
		CreateNextAuth(dir)
	case prompt_fullstack.Auth_None:
		return
	default:
		return
	}
}

func CreateNextAuth(dir string) {
	var path string =dir
	error := os.MkdirAll(path+"app/api/auth/[...nextauth]", os.ModePerm)
	if error != nil {
		fmt.Println("Error creating [...nextauth] directory:", error)
		os.Exit(1)
		return
	}
	command:=exec.Command("npm", "install", "next-auth")
	command.Dir = path
	err := command.Run()
	if err != nil {
		fmt.Println("Error installing next-auth:", err)
		os.Exit(1)
		return
	}
	nextAuthTmplPath := filepath.Join("internal/templates/nextjs", "nextauth.tmpl")
	nextAuthTmpl, err := template.ParseFiles(nextAuthTmplPath)
	if err != nil {
		log.Println("Error parsing nextauth.tmpl template:", err)
		os.Exit(1)
		return
	}
	f, err := os.Create(filepath.Join(path, "app", "api", "auth", "[...nextauth]", "route.ts"))
	if err != nil {
		fmt.Println("Error creating route.ts file:", err)
		os.Exit(1)
		return
	}
	defer f.Close()
	err = nextAuthTmpl.Execute(f, nil)
	if err != nil {
		fmt.Println("Error executing nextauth.tmpl template:", err)
		os.Exit(1)
		return
	}
	
}