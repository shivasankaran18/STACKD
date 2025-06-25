package prompt

import(
	"fmt"
	"github.com/manifoldco/promptui"
	"os"
)


type BackendResponse string

const (
	ExpressJS BackendResponse = "ExpressJS"
	ExpressTS BackendResponse = "ExpressTS"
	Backend_None BackendResponse = "None"
)

func AskBackend() BackendResponse{
	backendOptions := []string{
		"Express (JavaScript)",
		"Express (TypeScript)",
		"None",
	}

	prompt := promptui.Select{
		Label: "🖥️ Choose a Backend Framework",
		Items: backendOptions,
	}
	_, result, err := prompt.Run()
	var res BackendResponse = ""
	switch result {
	case "Express (JavaScript)":
		res = ExpressJS
		break
	case "Express (TypeScript)":
		res = ExpressTS
		break
	default:
		res = Backend_None

	
	}
	if err != nil {
		fmt.Printf("Prompt failed %v\n", err)
		os.Exit(1)
		return ""
	}
	return res


}
