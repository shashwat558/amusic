import { prismaClient } from "@/app/lib/db";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";
import bcrypt from "bcrypt";
import { Session } from "next-auth-session";
import { JWT } from "next-auth/jwt";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library";






const emailSchema = z.string({message: "Email is required"}).email({message: "Invalid email"});

const passwordSchema = z.string({message: "password is required"}).min(8).regex(/^(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "Invlaid password"
}
)




export const authOptions = {
    provider: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        }),
        Credentials({
            credentials: {
                email: {type: "email"},
                passwords: {type: "password"}
            },
            async authorize(credentials){
                if(!credentials || !credentials.email || !credentials.passwords ){
                    return null;
                }

                const emailValidation = emailSchema.safeParse(credentials.email);

                if(!emailValidation.success){
                    throw new Error("Invalid email")
                }
                
                const passwordValidation = passwordSchema.safeParse(credentials.passwords)
                if(!passwordValidation.success){
                    throw new Error(passwordValidation.error.issues[0].message);
                }

                try {

                    const user = await prismaClient.user.findFirst({
                        where:{
                            email: emailValidation.data,
                        }
                    })
                    if(!user){
                        const hashedPassword = await bcrypt.hash(passwordValidation.data, 10)

                        const newUser = await prismaClient.user.create({
                            data:{
                                email: emailValidation.data,
                                password: hashedPassword,
                                provider: "Google",
                                role: "EndUser"
                            }
                        });
                        return newUser;
                                  
                    }
                    if(!user.password){
                        const hashedPassword = await bcrypt.hash(passwordValidation.data, 10);

                        const authUser = await prismaClient.user.update({
                            where: {
                                email: emailValidation.data
                            },
                            data: {
                                password: hashedPassword
                            }
                        })

                        return authUser;
                    }

                    const passwordVerification = await bcrypt.compare(passwordValidation.data, user.password);
                    if(!passwordVerification){
                        throw new Error("Invalid Password");
                    }

                    return user;
                    
                } catch (error) {
                    console.log(error)
                    throw error
                    
                    
                }
            }
        })
    ],
    pages: {
        signIn: "/auth"
    },
    
    secret: process.env.NEXTAUTH_SECRET ?? "secret",
    session: {
        strategy: "jwt"
    },
    callbacks:{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async jwt({ token, account, profile }:any) {
            if (account && profile) {
              token.email = profile.email as string;
              token.id = account.access_token;
            }
            return token;
          },
          async session({session, token}:{
            session: Session,
            token: JWT
          }){
            try {

                
                    const user = await prismaClient.user.findUnique({
                      where: {
                        email: token.email ?? ""
                      }
                    });
            
                    if (user) {
                      session.user.id = user.id;
                    }

                
            } catch (error) {
                if(error instanceof PrismaClientInitializationError){
                    throw new Error("Internal server error")
                }
                console.log(error);
                throw error;
            }
            return session;
          },

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          async signIn({account, profile}: any){
            try {
                if(account.provider === "Google"){
                    const user = await prismaClient.user.findUnique({
                        where:{
                            email: profile?.email,
                        }

                    })
                    if(!user){
                        const newUser = await prismaClient.user.create({
                            data:{
                                email: profile?.email,
                                provider: "Google",
                                role: "EndUser"
                            }
                        })
                        return newUser;
                    }
                    return true;
                }
            } catch (error) {
                console.log(error)
                return false;
            }

          }
    }
} 


