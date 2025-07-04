package executorsfs

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"text/template"

	"github.com/shivasankaran18/STACKD/internal/fs/promptfs"
	"github.com/shivasankaran18/STACKD/internal/templates"
)

func CreateAuth(dir string, auth promptfs.AuthResponse) {
	switch auth {

	case promptfs.NextAuth:
		CreateNextAuth(dir)
	case promptfs.Auth_None:
		return
	default:
		return
	}
}

func CreateNextAuth(dir string) {
	var path string = dir
	error := os.MkdirAll(path+"/app/api/auth/[...nextauth]", os.ModePerm)
	if error != nil {
		fmt.Println("Error creating [...nextauth] directory:", error)
		os.Exit(1)
		return
	}
	command := exec.Command("npm", "install", "next-auth")
	command.Dir = path
	err := command.Run()
	if err != nil {
		fmt.Println("Error installing next-auth:", err)
		os.Exit(1)
		return
	}
	nextAuthTmplPath := "nextjs/nextauth.tmpl"
	nextAuthTmpl, err := template.ParseFS(templates.NextAuthTemplates, nextAuthTmplPath)
	if err != nil {
		log.Println("Error parsing nextauth.tmpl template:", err)
		os.Exit(1)
		return
	}
	var nextAuthPath string = path + "/app/api/auth/[...nextauth]"
	f, err := os.Create(nextAuthPath + "/route.ts")
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

