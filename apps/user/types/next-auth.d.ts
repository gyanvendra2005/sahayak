import  "next-auth";
import { DefaultSession } from "next-auth";

declare module 'next-auth' {
    interface User{
        _id?:string;
        name?:string;
        email?:string;
        photoUrl?:string;
        role?:string;
        enrolledCourses?:string[];
    }
    interface Session{
        user:{
             id?:string;
             name?:string;
             email?:string;
             photoUrl?:string;
             role?:string;
             enrolledCourses?:string[];

        }  & DefaultSession;['user']

    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?:string;
        name?:string;
        email?:string;
        photoUrl?:string;
        role?:string;
        enrolledCourses?:string[];   
    }
}