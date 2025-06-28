package prompt

import (
	"fmt"
	"github.com/manifoldco/promptui"
	"os"
)

type ORMResponse string
const (
	Prisma ORMResponse = "Prisma"
	Drizzle  ORMResponse = "Drizzle ORM"
	Orms_None ORMResponse = "None"
)

func AskORM() ORMResponse {
	ormOptions := []string{
		string(Prisma),
		string(Drizzle),
		string(Orms_None),
	}
	prompt := promptui.Select{
		Label: "📦 Choose an ORM",
		Items: ormOptions,
	}
	_, result, err := prompt.Run()
	if err != nil {
		fmt.Printf("Prompt failed %v\n", err)
		os.Exit(1)
		return ""
	}

	var res ORMResponse=""
	switch result {
	case string(Prisma):
		res = Prisma
	case string(Drizzle):
		res = Drizzle
	default:
		res= Orms_None
	}

	
	return res

}	
