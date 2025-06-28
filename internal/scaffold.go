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
		if(frontend!=prompt.Frontend_None){
			ui := prompt.AskUI()
		}
		
		backend := prompt.AskBackend()
		if(backend!=prompt.Backend_None){
			orm := prompt.AskORM()
			if(orm!=prompt.ORM_None){
				dbType := prompt.AskDatabaseType()
				dbURL := prompt.AskDatabaseURL()
			}


		executors.CreateDirectories(dir)
		executors.CreateFrontend(dir, frontend)
		if(frontend!=prompt.Frontend_None){
			executors.CreateUI(dir, ui, frontend)
		}
		executors.CreateBackend(dir, backend)
		if(backend!=prompt.Backend_None && orm!=prompt.ORM_None){
			executors.CreateORM(dir, orm, dbURL, dbType)
		}

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
