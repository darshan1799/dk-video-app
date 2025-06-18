import {DefaultSession} from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"],
    }
}


//
// 💡 What's the Purpose of This Code?
// This code tells TypeScript:
//
//    “Hey! I’m adding a custom id field to the user object inside the session.”