package executors_fullstack

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"text/template"

	"github.com/shivasankaran18/STACKD/internal/prompt"
)

func CreateORM(dir string, orm prompt.ORMResponse, dbURL string, dbType prompt.DbTypeResponse) {
	switch orm {
	case prompt.Prisma:
		CreatePrisma(dir, dbURL, dbType)
	case prompt.Drizzle:
		//CreateDrizzle(dir, dbURL, dbType)
	case prompt.Orms_None:
		return
	default:
		return
	}
}

func CreatePrisma(dir string, dbURL string, dbType prompt.DbTypeResponse) {
	path := dir
	error := os.MkdirAll(path+"/prisma", os.ModePerm)
	if error != nil {
		fmt.Println("Error creating prisma directory:", error)
		os.Exit(1)
		return
	}
	command := exec.Command("npm", "install", "prisma")
	command.Dir = path
	err := command.Run()
	if err != nil {
		fmt.Println("Error installing Prisma:", err)
		os.Exit(1)
		return
	}
	prismaTemplPath := filepath.Join("internal/templates/prisma", "prisma.tmpl")
	prismaTmpl, err := template.ParseFiles(prismaTemplPath)
	if err != nil {
		fmt.Println("Error parsing Prisma template:", err)
		os.Exit(1)
		return
	}
	f, err := os.Create(filepath.Join(path, "prisma", "schema.prisma"))
	if err != nil {
		fmt.Println("Error creating schema.prisma file:", err)
		os.Exit(1)
		return
	}
	defer f.Close()
	err = prismaTmpl.Execute(f, map[string]string{
		"dbType": string(dbType),
	})
	if err != nil {
		fmt.Println("Error executing Prisma template:", err)
		os.Exit(1)
		return
	}
	file := filepath.Join(path, ".env")
	f, err = os.Create(file)
	if err != nil {
		fmt.Println("Error creating .env file:", err)
		os.Exit(1)
		return
	}
	defer f.Close()
	envTemplPath := filepath.Join("internal/templates/prisma", "env.tmpl")
	envTmpl, err := template.ParseFiles(envTemplPath)
	if err != nil {
		fmt.Println("Error parsing Prisma template:", err)
		os.Exit(1)
		return
	}
	err = envTmpl.Execute(f, map[string]string{
		"DATABASE_URL": dbURL,
	})
	if err != nil {
		fmt.Println("Error executing Prisma template:", err)
		os.Exit(1)
		return
	}
	command = exec.Command("npx", "prisma", "generate")
	command.Dir = path
	err = command.Run()
	if err != nil {
		fmt.Println("Error generating Prisma:", err)
		os.Exit(1)
		return
	}

}
