import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";


export default async  function Home() {
    const session=await getServerSession(authOptions)
    console.log(session)

    if(!session)
    {
     redirect("/api/auth/signin")
    }
    else{
     redirect("/home")
    }
  }
