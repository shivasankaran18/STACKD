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
		"Prisma",
		"Drizzle ORM",
		"None",
	}
	prompt := promptui.Select{
		Label: "📦 Choose an ORM",
		Items: ormOptions,
	}
	_, result, err := prompt.Run()

	var res ORMResponse=""
	switch result {
	case "Prisma":
		res = Prisma
	case "Drizzle ORM":
		res = Drizzle
	default:
		res= Orms_None
	}

	if err != nil {
		fmt.Printf("Prompt failed %v\n", err)
		os.Exit(1)
		return ""
	}
	return res

}	
