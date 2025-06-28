package prompt

import (
	"fmt"
	"os"

	"github.com/manifoldco/promptui"
)

type FrontEndResponse string

const (
	ReactJS       FrontEndResponse = "React (JavaScript)"
	ReactTS       FrontEndResponse = "React (TypeScript)"
	Frontend_None FrontEndResponse = "None"
)

func AskFrontend() FrontEndResponse {
	frontendOptions := []string{
		string(ReactJS),
		string(ReactTS),
		string(Frontend_None),
	}
	prompt := promptui.Select{
		Label: "🎨 Choose a Frontend Framework",
		Items: frontendOptions,
	}
	_, result, err := prompt.Run()
	if err != nil {
		fmt.Printf("Prompt failed %v\n", err)
		os.Exit(1)
		return ""
	}
	var res FrontEndResponse = ""
	switch result {
	case string(ReactJS):
		res = ReactJS
		break
	case string(ReactTS):
		res = ReactTS
		break
	default:
		res = Frontend_None

	}

	return res
}
