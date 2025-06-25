package internal

import (
	"github.com/shivasankaran18/STACKD/internal/prompt"
	"github.com/shivasankaran18/STACKD/internal/executors"
)

func Scaffold(){
	dir:=prompt.AskDirectory()
	frontend := prompt.AskFrontend()
	ui:=prompt.AskUI()
	backend:=prompt.AskBackend()




	executors.CreateDirectories(dir)
	executors.CreateFrontend(dir, frontend)
	executors.CreateUI(dir, ui,frontend)
	executors.CreateBackend(dir, backend)



}
