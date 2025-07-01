package internal

import (
	executors_fb "github.com/shivasankaran18/STACKD/internal/fb/executorsfb"
	executors_fullstack "github.com/shivasankaran18/STACKD/internal/fs/executorsfs"
	executors_monorepo "github.com/shivasankaran18/STACKD/internal/monorepo/executorsmr"
	prompt_fb "github.com/shivasankaran18/STACKD/internal/fb/promptfb"
	prompt_fullstack "github.com/shivasankaran18/STACKD/internal/fs/promptfs"
	prompt_monorepo "github.com/shivasankaran18/STACKD/internal/monorepo/promptmr"
	"github.com/shivasankaran18/STACKD/internal/utils"
)

func Scaffold() {
	dir := utils.AskDirectory()
	projType := utils.AskProjType()

	if projType == utils.ProjectTypeFB {
		frontend := prompt_fb.AskFrontend()
		var ui prompt_fb.UIResponse
		var orm utils.ORMResponse
		var dbType utils.DbTypeResponse
		var dbURL string
		var backend prompt_fb.BackendResponse
		var auth prompt_fb.AuthResponse
		if frontend != prompt_fb.Frontend_None {
			ui = prompt_fb.AskUI()
		}

		backend = prompt_fb.AskBackend()
		if backend != prompt_fb.Backend_None {
			orm := utils.AskORM()
			if orm != utils.Orms_None {
				dbType = utils.AskDatabaseType()
				dbURL = utils.AskDatabaseURL(dbType)
			}
			auth = prompt_fb.AskAuth()
		}

		utils.CreateDirectories(dir)
		go func() {
			executors_fb.CreateFrontend(dir, frontend)
			if frontend != prompt_fb.Frontend_None {
				executors_fb.CreateUI(dir, ui, frontend)
			}
		}()
		executors_fb.CreateBackend(dir, backend)
		if backend != prompt_fb.Backend_None && orm != utils.Orms_None {
			executors_fb.CreateORM(dir, orm, dbURL, dbType)
		}
		if backend != prompt_fb.Backend_None {
			executors_fb.CreateAuth(dir, auth, backend)
		}

	} else if projType == utils.ProjectTypeFullStack {
		fullStack := prompt_fullstack.AskFullStack()
		auth := prompt_fullstack.AskAuth()
		orm := utils.AskORM()
		dbType := utils.AskDatabaseType()
		dbURL := utils.AskDatabaseURL(dbType)

		utils.CreateDirectories(dir)
		executors_fullstack.CreateFullStack(dir, fullStack)

		if auth != prompt_fullstack.Auth_None {
			executors_fullstack.CreateAuth(dir, auth)
		}

		if orm != utils.Orms_None {
			executors_fullstack.CreateORM(dir, orm, dbURL, dbType)
		}

	} else if projType == utils.ProjectTypeMonoRepos {
		monorepo := prompt_monorepo.AskMonoRepo()

		utils.CreateDirectories(dir)
		executors_monorepo.CreateMonoRepo(dir, monorepo)
	} else {
		return
	}

}
