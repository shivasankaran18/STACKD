package prompt


import(
	"fmt"
	"github.com/manifoldco/promptui"
	"os"
)

type UIResponse string

const (
	TailwindCSS UIResponse = "TailwindCSS"
	ShadCN UIResponse = "ShadCN"
	UI_None UIResponse = "None"
)


func AskUI() UIResponse {
	uiOptions := []string{
		"Tailwind CSS",
		"TailwindCSS + ShadCN",
		"None",
	}

	prompt := promptui.Select{
		Label: "🎨 Choose a UI Framework",
		Items: uiOptions,
	}
	_, result, err := prompt.Run()

	var res UIResponse = ""
	switch result {
	case "Tailwind CSS":
		res = TailwindCSS
	case "TailwindCSS + ShadCN":
		res = ShadCN
	default:
		res = UI_None
	}

	if err != nil {
		fmt.Printf("Prompt failed %v\n", err)
		os.Exit(1)
		return ""
	}
	return res
}
