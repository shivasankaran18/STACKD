package executors_fb

import (
	"fmt"
	"os"
	"os/exec"
	"text/template"

	prompt_fb "github.com/shivasankaran18/STACKD/internal/prompt/fb"
)


func CreateUI(dir string, ui prompt_fb.UIResponse,frontend prompt_fb.FrontEndResponse) {
	switch ui {
	case prompt_fb.TailwindCSS:
		CreateTailwindCSS(dir,frontend)
		break
	case prompt_fb.ShadCN:
		//CreateShadCN(dir)
		break
	case prompt_fb.UI_None:
		return
	default:
		return
	}	
}

func CreateTailwindCSS(dir string, frontend prompt_fb.FrontEndResponse) {
	path:=dir+"/frontend"
	error := os.MkdirAll(path, os.ModePerm)
	if error != nil {
		fmt.Println("Error creating TailwindCSS directory:", error)
		os.Exit(1)
		return
	}
	command:=exec.Command("npm","install","tailwindcss","@tailwindcss/vite")
	command.Dir = path

	err := command.Run()
	if err != nil {
		fmt.Println("Error installing TailwindCSS:", err)
		os.Exit(1)
		return
	}

	if(frontend==prompt_fb.ReactJS){
		viteTmplPath := "internal/templates/tailwindcss/react/vite.config.tmpl"
		viteTmpl,err:=template.ParseFiles(viteTmplPath)
		if err != nil {
			fmt.Println("Error parsing vite.config.js template:", err)
			os.Exit(1)
			return
		}
		viteFile, err := os.Create(path + "/vite.config.js")
		if err != nil {
			fmt.Println("Error creating vite.config.js file:", err)
			os.Exit(1)
			return
		}
		defer viteFile.Close()

		err = viteTmpl.Execute(viteFile, nil)
		if err != nil {
			fmt.Println("Error executing vite.config.js template:", err)
			os.Exit(1)
			return
		}

		indexCssTmplPath:="internal/templates/tailwindcss/react/index.css.tmpl"
		indexCssTmpl,err:=template.ParseFiles(indexCssTmplPath);
		if err != nil {
			fmt.Println("Error parsing index.css template:", err)
			os.Exit(1)
			return
		}
		indexCssFile, err := os.Create(path + "/src/index.css")
		if err != nil {
			fmt.Println("Error creating index.css file:", err)
			os.Exit(1)
			return
		}
		defer indexCssFile.Close()
		err = indexCssTmpl.Execute(indexCssFile, nil)
		if err != nil {
			fmt.Println("Error executing index.css template:", err)
			os.Exit(1)
			return
		}

		

	}
}
