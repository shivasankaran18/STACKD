package internal

import (
	"github.com/shivasankaran18/STACKD/internal/prompt"
	"github.com/shivasankaran18/STACKD/internal/executors"
)

func Scaffold(){
	dir:=prompt.AskDirectory()
	executors.CreateDirectories(dir)
	
	frontend := prompt.AskFrontend()
	
	executors.CreateFrontend(dir, frontend)



}
