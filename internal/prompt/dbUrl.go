package prompt

import (
	"fmt"
	"github.com/manifoldco/promptui"
	"os"

)

func AskDatabaseURL() string {
	prompt := promptui.Prompt{
		Label: "🔗 Enter the Database URL",
		Validate: func(input string) error {
			if input == "" {
				return fmt.Errorf("Database URL cannot be empty")
			}
			return nil
		},
	}

	result, err := prompt.Run()
	if err != nil {
		fmt.Printf("Prompt failed %v\n", err)
		os.Exit(1)
		return ""
	}

	return result
}
