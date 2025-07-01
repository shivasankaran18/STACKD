package templates

import "embed"

//go:embed expressjs/index.js.tmpl
var IndexJSTemplates embed.FS


//go:embed expressts/index.ts.tmpl
var IndexTSTemplates embed.FS

//go:embed expressjs/jwt.tmpl
var JwtJSTemplates embed.FS

//go:embed expressts/jwt.tmpl
var JwtTSTemplates embed.FS

//go:embed prisma/schema.tmpl
var PrismaTemplates embed.FS

//go:embed prisma/env.tmpl
var EnvTemplates embed.FS

//go:embed nextjs/nextauth.tmpl
var NextAuthTemplates embed.FS

