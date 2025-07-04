package executorsfb
import (
	"fmt"
	"os"
	"github.com/shivasankaran18/STACKD/internal/utils"
	"os/exec"
	"path/filepath"
	"text/template"
	"github.com/shivasankaran18/STACKD/internal/templates"
)


func CreateORM(dir string, orm utils.ORMResponse,  dbURL string, dbType utils.DbTypeResponse) {
	switch orm {
	case utils.Prisma:
		CreatePrisma(dir ,dbURL, dbType)
	case utils.Drizzle:
	//	CreateDrizzle(dir, backend, dbURL)
	case utils.Orms_None:
return
	default:
		return
	}
}

func CreatePrisma(dir string,dbURL string, dbType utils.DbTypeResponse){
	path := dir + "/backend";
	error := os.MkdirAll(path, os.ModePerm)
	if error != nil {
		fmt.Println("Error creating backend directory:", error)
		os.Exit(1)
		return
	}
	command := exec.Command("npm", "install","prisma")
	command.Dir = path
	err := command.Run()
	if err != nil {
		fmt.Println("Error installing Prisma:", err)
		os.Exit(1)
		return
	}
	prismaTemplPath := "prisma/schema.tmpl"
	
	prismaTmpl, err := template.ParseFS(templates.PrismaTemplates,prismaTemplPath)
	if err != nil {
		fmt.Println("Error parsing Prisma template:", err)
		os.Exit(1)
		return
	}
	err = os.MkdirAll(filepath.Join(path, "prisma"), os.ModePerm)
	if err != nil {
		fmt.Println("Error creating prisma directory:", err)
		os.Exit(1)
		return
	}
	prismaPath := filepath.Join(path, "prisma", "schema.prisma")
	prismaFile, err := os.Create(prismaPath)
	if err != nil {
		fmt.Println("Error creating Prisma schema file:", err)
		os.Exit(1)
		return
	}
	defer prismaFile.Close()

	err = prismaTmpl.Execute(prismaFile, map[string]string{
		"dbType": string(dbType),
	})
	if err != nil {
		fmt.Println("Error executing Prisma template:", err)
		os.Exit(1)
		return
	}
	file:=filepath.Join(path,".env")

	
	f,err:=os.Create(file)
	if err != nil {
		fmt.Println("Error creating .env file:", err)
		os.Exit(1)
		return
	}
	fmt.Println("Creating .env file at", file)
	defer f.Close()

	envTemplPath := "prisma/env.tmpl"

	envTmpl, err := template.ParseFS(templates.EnvTemplates, envTemplPath)
	fmt.Println(f);
	fmt.Println(envTmpl)
	err = envTmpl.Execute(f,map[string]string{
		"DATABASE_URL": dbURL,
	})
	if err != nil {
		fmt.Println("Error creating .env file:", err)
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



