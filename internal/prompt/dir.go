package prompt

import (
	"fmt"
	"github.com/manifoldco/promptui"
)

func AskDirectory() string {
	prompt := promptui.Prompt{
		Label:   "📁 Enter project directory",
		Default: "./my-app",

	}
	result, err := prompt.Run()
	if err != nil {
		fmt.Printf("Prompt failed %v\n", err)
		return ""
	}
	return result
}
