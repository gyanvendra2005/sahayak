import  "next-auth";
import { DefaultSession } from "next-auth";

declare module 'next-auth' {
    interface User{
        _id?:string;
        name?:string;
        email?:string;
        role?:string;
        location?:string;
        department?:string;
    }
    interface Session{
        user:{
             id?:string;
             name?:string;
             email?:string;
             role?:string;
             location?:string;
             department?:string;

        }  & DefaultSession;['user']

    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?:string;
        name?:string;
        email?:string;
        role?:string;
        location?:string;
        department?:string;
    }
}