import {NextResponse,NextRequest} from "next/server";
import UserModel from "@/models/User";
import connectToDB from "@/lib/db";

export async function POST(request: NextRequest)
{
    try {
        const {email, password,name} = await request.json();
        if (!email || !password) {
            return NextResponse.json({error: "Email or password is missing"}, {status: 400});
        }

        await connectToDB();
        const isExist = await UserModel.findOne({email: email});
        if (isExist) {
            return NextResponse.json({error: "Email already exists!"}, {status: 400});
        }

        await UserModel.create({
            email: email,
            password: password,
            name:name
        })

        return NextResponse.json({message: "user registered successfully!"},{status: 200});
    }catch (error)
    {
        console.log(error);
        return NextResponse.json({error:"failed to register"},{status:500})
    }

}
