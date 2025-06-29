package internal

import (
	"github.com/shivasankaran18/STACKD/internal/executors"
	executors_fb "github.com/shivasankaran18/STACKD/internal/executors/fb"
	executors_fullstack "github.com/shivasankaran18/STACKD/internal/executors/fullstack"
	executors_monorepo "github.com/shivasankaran18/STACKD/internal/executors/monorepo"
	"github.com/shivasankaran18/STACKD/internal/prompt"
	prompt_fb "github.com/shivasankaran18/STACKD/internal/prompt/fb"
	prompt_fullstack "github.com/shivasankaran18/STACKD/internal/prompt/fullstack"
	prompt_monorepo "github.com/shivasankaran18/STACKD/internal/prompt/monorepo"
)

func Scaffold() {
	dir := prompt.AskDirectory()
	projType := prompt.AskProjType()

	if projType == prompt.ProjectTypeFB {
		frontend := prompt_fb.AskFrontend()
		var ui prompt_fb.UIResponse
		var orm prompt.ORMResponse
		var dbType prompt.DbTypeResponse
		var dbURL string
		var backend prompt_fb.BackendResponse
		var auth prompt_fb.AuthResponse
		if frontend != prompt_fb.Frontend_None {
			ui = prompt_fb.AskUI()
		}

		backend = prompt_fb.AskBackend()
		if backend != prompt_fb.Backend_None {
			orm := prompt.AskORM()
			if orm != prompt.Orms_None {
				dbType = prompt.AskDatabaseType()
				dbURL = prompt.AskDatabaseURL()
			}
			auth = prompt_fb.AskAuth()
		}

		executors.CreateDirectories(dir)
		executors_fb.CreateFrontend(dir, frontend)
		if frontend != prompt_fb.Frontend_None {
			executors_fb.CreateUI(dir, ui, frontend)
		}
		executors_fb.CreateBackend(dir, backend)
		if backend != prompt_fb.Backend_None && orm != prompt.Orms_None {
			executors_fb.CreateORM(dir, orm, dbURL, dbType)
		}
		if backend != prompt_fb.Backend_None {
			executors_fb.CreateAuth(dir, auth, backend)
		}

	} else if projType == prompt.ProjectTypeFullStack {
		fullStack := prompt_fullstack.AskFullStack()
		auth := prompt_fullstack.AskAuth()
		orm := prompt.AskORM()
		dbType := prompt.AskDatabaseType()
		dbURL := prompt.AskDatabaseURL()

		executors.CreateDirectories(dir)
		executors_fullstack.CreateFullStack(dir, fullStack)


		if auth != prompt_fullstack.Auth_None {
			executors_fullstack.CreateAuth(dir, auth)
		}


		if orm != prompt.Orms_None {
			executors_fullstack.CreateORM(dir, orm, dbURL, dbType)
		}

	} else if projType == prompt.ProjectTypeMonoRepos {
		monorepo := prompt_monorepo.AskMonoRepo()

		executors.CreateDirectories(dir)
		executors_monorepo.CreateMonoRepo(dir, monorepo)
	} else {
		return
	}

}
