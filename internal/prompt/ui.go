package prompt


import(
	"fmt"
	"github.com/manifoldco/promptui"
	"os"
)

type UIResponse string

const (
	TailwindCSS UIResponse = "TailwindCSS"
	ShadCN UIResponse = "TailwindCSS + ShadCN"
	UI_None UIResponse = "None"
)


func AskUI() UIResponse {
	uiOptions := []string{
		string(TailwindCSS),
		string(ShadCN),
		string(UI_None),
		
	}

	prompt := promptui.Select{
		Label: "🎨 Choose a UI Framework",
		Items: uiOptions,
	}
	_, result, err := prompt.Run()
	
	if err != nil {
		fmt.Printf("Prompt failed %v\n", err)
		os.Exit(1)
		return ""
	}

	var res UIResponse = ""
	switch result {
	case string(TailwindCSS):
		res = TailwindCSS
	case string(ShadCN):
		res = ShadCN
	default:
		res = UI_None
	}

	return res
}
