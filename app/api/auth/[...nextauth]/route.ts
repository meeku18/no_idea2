import { prismaClient } from "@/app/lib/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
    secret: process.env.NEXTAUTH_SECRET ?? "secret",
    callbacks:{
        async signIn(params){
            if(!params.user.email) return false;
            
            const existingUser = await prismaClient.user.findFirst({
                where:{email : params.user.email || ""}
            })

            if(existingUser) return true;

            await prismaClient.user.create({
                data:{
                    email:params.user.email || "",
                    provider: "Google"
                }
            })
            return true;
        }
    }
})

export { handler as GET , handler as POST }