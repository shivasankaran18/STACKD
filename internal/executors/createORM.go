package executors
import (
	"fmt"
	"os"
	"github.com/shivasankaran18/STACKD/internal/prompt"
	"os/exec"
	"path/filepath"
	"text/template"
)


func CreateORM(dir string, orm prompt.ORMResponse,  dbURL string) {
	switch orm {
	case prompt.Prisma:
		CreatePrisma(dir ,dbURL)
	case prompt.Drizzle:
	//	CreateDrizzle(dir, backend, dbURL)
	case prompt.Orms_None:
return
	default:
		return
	}
}

func CreatePrisma(dir string,dbURL string){
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
	fmt.Println("Prisma installed successfully")
	command = exec.Command("npx", "prisma", "init")
	command.Dir = path
	err = command.Run()
	if err != nil {
		fmt.Println("Error initializing Prisma:", err)
		os.Exit(1)
		return
	}
	fmt.Println("Prisma initialized successfully")
	file:=filepath.Join(path,".env")

	
	f,err:=os.Create(file)
	if err != nil {
		fmt.Println("Error creating .env file:", err)
		os.Exit(1)
		return
	}
	fmt.Println("Creating .env file at", file)
	defer f.Close()

	envTemplPath := filepath.Join("internal/templates/prisma", "env.tmpl")
	envTmpl, err := template.ParseFiles(envTemplPath)
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


}
