package prompt

import (
	"fmt"
	"os"

	"github.com/manifoldco/promptui"
)

type BackendResponse string

const (
	ExpressJS    BackendResponse = "ExpressJS"
	ExpressTS    BackendResponse = "ExpressTS"
	Backend_None BackendResponse = "None"
)

func AskBackend() BackendResponse {
	backendOptions := []string{
		string(ExpressJS),
		string(ExpressTS),
		string(Backend_None),
	}

	prompt := promptui.Select{
		Label: "🖥️ Choose a Backend Framework",
		Items: backendOptions,
	}
	_, result, err := prompt.Run()
	if err != nil {
		fmt.Printf("Prompt failed %v\n", err)
		os.Exit(1)
		return ""
	}
	var res BackendResponse = ""
	switch result {
	case string(ExpressJS):
		res = ExpressJS
		break
	case string(ExpressTS):
		res = ExpressTS
		break
	default:
		res = Backend_None

	}

	return res

}
