import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbconnect from "../../../../lib/dbconnect";
import  UserModel  from "../../../../models/User";


export const authOptions : NextAuthOptions = {
    // console.log("Hello");
    
    providers:[
        CredentialsProvider({
            name: "Credentials",
            id:"credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials){
                await dbconnect();
                try {
                    if (!credentials) {
                        throw new Error('Credentials are not provided');
                    }
                    const user = await UserModel.findOne({
                        $or:[
                            {email:credentials.email},
                        ]
                    })
                    if(!user){
                        throw new Error('No user found with this email')
                    }
                    // if(!user.isVerifiedEmail){
                    //     throw new Error('Email is not verified, Please verify it')
                    // }
                    const isPasswordCorrect =  await bcrypt.compare(credentials.password, user.password)

                    if(isPasswordCorrect){
                        return user as unknown as User
                    }
                    else{
                        throw new Error('Password is incorrect')
                    }

                } catch (error) {
                    throw error
                }
              }
        })
    ],
    callbacks:{
                  
           async jwt({ token, user,trigger,session  }) {
            if(user){
                token.id = user.id.toString(),
                token.name = user.name as string,
                token.email = user.email as string,
                token.role = user.role as string,
                token.photoUrl = user.photoUrl as string,
                token.enrolledCourses = user.enrolledCourses as string[]
            }
            if(trigger === 'update'){
                return { ...token,  ...session?.user }
            }
            return token
          },
          async session({ session, token }) {
            if(token){
                session.user.id = token.id as string,
                session.user.name = token.name as string,
                session.user.email = token.email as string,
                session.user.role = token.role as string,
                session.user.photoUrl = token.photoUrl as string,
                session.user.enrolledCourses = token.enrolledCourses as string[]
            }
            return session
          }
    },
    pages:{
        signIn: '/signin'

    },
    session:{
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET || "gyani2004"
}