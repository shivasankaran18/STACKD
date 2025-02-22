import GitHubProvider from "next-auth/providers/github";
export const authOptions = {
    providers: [
        GitHubProvider({
          clientId: process.env.GITHUB_ID || " ",
          clientSecret: process.env.GITHUB_SECRET || " ",
          authorization: {
            params: {
              scope: "repo read:user read:org  workflow",
            },
          },
        }),
      ],
      callbacks: {
        async jwt({ token, account }: { token: any, account: any }) {
            console.log(account)
            if (account) {
              token.accessToken = account.access_token; 
            }
            return token;
          },
          async session({ session, token }: { session: any, token: any }) {
            // console.log(token)
            session.accessToken = token.accessToken; 
            return session;
          },
        async redirect({  baseUrl }: { baseUrl: string }) {
            return `${baseUrl}/home`;
          },
      },

      secret: process.env.NEXTAUTH_SECRET || " ",


}