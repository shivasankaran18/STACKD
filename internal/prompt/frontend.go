package prompt

import (
	"fmt"
	"github.com/manifoldco/promptui"
	"os"
)

type FrontEndResponse string

const (
	ReactJS FrontEndResponse = "React+JS"
	ReactTS FrontEndResponse = "React+TS"
	Frontend_None   FrontEndResponse = "None"
)



func AskFrontend() FrontEndResponse {
	frontendOptions := []string{
		"React (JavaScript)",
		"React (TypeScript)",
		"None",
	}
	prompt := promptui.Select{
		Label: "🎨 Choose a Frontend Framework",
		Items: frontendOptions,
	}
	_, result, err := prompt.Run()
	
	var res FrontEndResponse=""
	switch result {
		case "React (JavaScript)":
			res = ReactJS
			break
		case "React (TypeScript)":
			res = ReactTS
			break
		default:
			res= Frontend_None
	
	}


	if err != nil {
		fmt.Printf("Prompt failed %v\n", err)
		os.Exit(1)
		return ""
	}
	return res
}
