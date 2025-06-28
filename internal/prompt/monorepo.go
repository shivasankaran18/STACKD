package prompt


import(
	"fmt"
	"github.com/manifoldco/promptui"
	"os"
)


type MonoRepoResponse string

const(
	Turborepo MonoRepoResponse = "Turborepo"
	MonoRepo_None MonoRepoResponse = "None"
)

func AskMonoRepo() MonoRepoResponse {
	monoRepoOption:=[]string{
		string(Turborepo),
		string(MonoRepo_None),
	}
	prompt := promptui.Select{
		Label: "📦 Choose a Monorepo Tool",
		Items: monoRepoOption,
	}

	_, result, err := prompt.Run()
	if err != nil {
		fmt.Printf("Prompt failed %v\n", err)
		os.Exit(1)
		return ""
	}

	var res MonoRepoResponse="";

	switch result {
	case string(Turborepo):
		res = Turborepo
		break
	case string(MonoRepo_None):
		res = MonoRepo_None
		break
	default:
		res = MonoRepo_None
	}
	return res
	

}
