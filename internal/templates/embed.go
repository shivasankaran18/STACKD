package templates

import (

	_ "embed"
)

//go:embed expressjs/index.js.tmpl
var IndexJSTemplates string


//go:embed expressts/index.ts.tmpl
var IndexTSTemplates string

//go:embed expressjs/jwt.tmpl
var JwtJSTemplates string

//go:embed expressts/jwt.tmpl
var JwtTSTemplates string

//go:embed prisma/schema.tmpl
var PrismaTemplates string

//go:embed prisma/env.tmpl
var EnvTemplates string

//go:embed nextjs/nextauth.tmpl
var NextAuthTemplates string

