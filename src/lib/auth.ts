import {NextAuthOptions} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import connectToDB from './db';
import { error } from 'console';
import UserModel from '@/models/User';
import bcrypt from 'bcryptjs';



export const authOptions: NextAuthOptions = {
  providers:[
    CredentialsProvider(
        {
            name:"Credentials",
            credentials:
            {
               email:{label:"email",type:"text"},
               password:{label:"password",type:"password"}
            },
           async authorize(credentials){
        
            if(!credentials?.email|| !credentials?.password )
            {
                throw new Error("missing email or password!");
            }
            try
            {
             await connectToDB();
            const user = await UserModel.findOne({email:credentials.email});
           
            if(!user)
            {
                throw new Error("user not registered!");
            }
            if(user.provider == "google")
            {
                throw new Error("Please Try with Google! Your Account is created using google");
            }
            const {_id,email,password} = user;
          
            const isValid = await bcrypt.compare(credentials.password,password);
             if(!isValid)
            {
             throw new Error("invalid Credentials!");
            }

            return {
                id : _id.toString(),
                email
                //this will be stores in session
            }
            }catch(error:any)
            {
             throw new Error(error.message);
            }

           }

        }
    ),
    GoogleProvider(
      {
         clientId:process.env.GOOGLE_CLIENT_ID!,
         clientSecret:process.env.GOOGLE_CLIENT_SECRET!,
        authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
      
     })
  ],
  callbacks:{
    async jwt({token,user}){

       if(user)
        {
            token.id = user.id;
        }
        return token;
    },
    async session({session,token})
    {
        if(session.user)
        {
            session.user.id=token.id as string;
        }
        return session;
    }
  },
  events:
  {
      async signIn({user,account}:any)
      {
        
        if(account?.provider == "google")
        {
           await connectToDB();
           const exist = await UserModel.findOne({email:user.email});
           if(!exist)
           {
              const userInfo = await UserModel.create(
              {
                email:user.email,
                provider:account.provider,
                image:user.image,
                name:user.name
              }
            )
            user.id= userInfo._id;
           }else
           {
           user.id = exist._id;
           
           }
           return user;
        }
        return user;
      }
  },
  pages:
  {
    signIn:'/login',
    error:"/login"
  },
  session:
  {
    strategy:"jwt",
    maxAge:30*24*60*60
  },
  secret:process.env.AUTH_SECRET,
  
}