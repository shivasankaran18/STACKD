package internal

import (
	"github.com/shivasankaran18/STACKD/internal/executors"
	"github.com/shivasankaran18/STACKD/internal/prompt"
)

func Scaffold() {
	dir := prompt.AskDirectory()
	projType := prompt.AskProjType()


	if projType == prompt.ProjectTypeFB {
		frontend := prompt.AskFrontend()
		ui := prompt.AskUI()
		backend := prompt.AskBackend()
		orm := prompt.AskORM()
		dbURL := prompt.AskDatabaseURL()

		executors.CreateDirectories(dir)
		executors.CreateFrontend(dir, frontend)
		executors.CreateUI(dir, ui, frontend)
		executors.CreateBackend(dir, backend)
		executors.CreateORM(dir, orm, dbURL)

	}else if projType == prompt.ProjectTypeFullStack {
		fullStack := prompt.AskFullStack()

		executors.CreateDirectories(dir)
		executors.CreateFullStack(dir,fullStack)
	}else if projType == prompt.ProjectTypeMonoRepos {
		monorepo:=prompt.AskMonoRepo()


		executors.CreateDirectories(dir)
		executors.CreateMonoRepo(dir, monorepo)
	} else {
		return
	}


}
