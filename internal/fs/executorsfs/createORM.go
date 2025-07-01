package executorsfs

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"text/template"

	"github.com/shivasankaran18/STACKD/internal/templates"
	"github.com/shivasankaran18/STACKD/internal/utils"
)

func CreateORM(dir string, orm utils.ORMResponse, dbURL string, dbType utils.DbTypeResponse) {
	switch orm {
	case utils.Prisma:
		CreatePrisma(dir, dbURL, dbType)
	case utils.Drizzle:
		//CreateDrizzle(dir, dbURL, dbType)
	case utils.Orms_None:
		return
	default:
		return
	}
}

func CreatePrisma(dir string, dbURL string, dbType utils.DbTypeResponse) {
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
	prismaTemplPath := filepath.Join("prisma", "schema.tmpl")
	prismaTmpl, err := template.ParseFS(templates.PrismaTemplates, prismaTemplPath)
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
	envTemplPath := filepath.Join("prisma", "env.tmpl")
	envTmpl, err := template.ParseFS(templates.EnvTemplates, envTemplPath)
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

