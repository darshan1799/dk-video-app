import { authOptions } from "@/lib/auth";
import connectToDB from "@/lib/db";
import UserModel from "@/models/User";
import VideoModel, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
    try
    {

    await connectToDB();
    const email  = request.nextUrl.searchParams.get("my-videos") || null;
    
    let videos = [];
    if(email)
    {
          videos = await VideoModel.find({uploadUser:email+"ff"}).sort({createdAt:-1}).lean();
          return NextResponse.json({videos:videos},{status:200});   
    }
    videos = await VideoModel.find({}).sort({createdAt:-1}).lean();
    if(!videos || videos.length === 0)
    {
        return NextResponse.json({message:"No video Found!"},{status:404});
    }
     const enrichedVideos = await Promise.all(
        videos.map(async(video)=>
        {
            const userRes = await UserModel.findOne({email:video.uploadUser});
           
             video.name  = userRes.name || "unknown";
             video.image = userRes.image || null;
            return video;
        })
     )
   return NextResponse.json({videos:enrichedVideos},{status:200});
    }catch(err)
    {
        console.log(err);
        return NextResponse.json({error:"Failed to create video!",err},{status:500});
    }
}

export async function POST(request:NextRequest) {
    try
    {

       const session = await getServerSession(authOptions);
       
       if(!session)
        {
             return NextResponse.json({error:"Unauthorized!"},{status:401});
        } 
       const body:IVideo = await request.json();
       
       if(!body.title || !body.description || !body.thumbnailUrl || !body.videoUrl)
       {
        return NextResponse.json({error:"missing field!"},{status:400});
       }

      await connectToDB();
       const videoDetails=
       {
        ...body,
         uploadUser:session.user.email,
         controls:body?.controls ?? true,
          transformation:{
        height:1920,
        width:1080,
        quality:body.transformation?.quality ?? 100, 
       }

       }
      const newVideo = await VideoModel.create(videoDetails);

      return NextResponse.json(newVideo,{status:201});
    } catch(err)
    {
        return NextResponse.json({error:"Failed to create video!",err},{status:500});
    }
}