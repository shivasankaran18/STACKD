package prompt

import (
	"fmt"
	"github.com/manifoldco/promptui"
	"os"
)

type ProjectTypeResponse string
const (
	ProjectTypeFB ProjectTypeResponse="Frontend + Backend"
	ProjectTypeFullStack ProjectTypeResponse="Full Stack Framworks"
	ProjectTypeMonoRepos ProjectTypeResponse="MonoRepos"
)


func AskProjType() ProjectTypeResponse {
	prompt := promptui.Select{
		Label: "Select Project Type",
		Items: []string{
			string(ProjectTypeFB),
			string(ProjectTypeFullStack),
			string(ProjectTypeMonoRepos),
		},
	}

	_, result, err := prompt.Run()

	if err != nil {
		fmt.Printf("Prompt failed %v\n", err)
		os.Exit(1)
		return ""
	}
	var res ProjectTypeResponse = ""
	switch result {
		case string(ProjectTypeFB):
			res = ProjectTypeFB
			break
		case string(ProjectTypeFullStack):
			res = ProjectTypeFullStack
			break
		case string(ProjectTypeMonoRepos):
			res = ProjectTypeMonoRepos
			break
		default:
			fmt.Println("Invalid project type selected")

	}
	return res


	
} 


