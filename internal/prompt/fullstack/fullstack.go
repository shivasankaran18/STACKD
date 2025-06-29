package prompt_fullstack

import (
	"fmt"
	"os"

	"github.com/manifoldco/promptui"
)

type FullStackResponse string

const (
	NextJs FullStackResponse = "Next.Js"
	Django FullStackResponse = "Django"
)

func AskFullStack() FullStackResponse {
	fullStackOptions := []string{
		string(NextJs),
		string(Django),
	}

	prompt := promptui.Select{
		Label: "🌐 Choose a Full Stack Framework",
		Items: fullStackOptions,
	}
	_, result, err := prompt.Run()
	if err != nil {
		fmt.Printf("Prompt failed %v\n", err)
		os.Exit(1)
		return ""
	}
	var res FullStackResponse = ""
	switch result {
	case string(NextJs):
		res = NextJs
	case string(Django):
		res = Django
	default:
		fmt.Println("Invalid selection")
		os.Exit(1)
	}

	return res

}
