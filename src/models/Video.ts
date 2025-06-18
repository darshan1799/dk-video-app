import mongoose, {Schema,model,models} from "mongoose";

const VIDEO_DIMENSIONS =
    {
 height:1920,
        width:1020,

    } as const;

export interface IVideo {
    _id?: mongoose.Types.ObjectId;
    title: string,
    description: string,
    thumbnailUrl:string,
    videoUrl:string,
    controls?:boolean,
    transformation?:{
        height:number,
        width:number,
        quality?:number,
    }
    uploadUser:string,
    createdAt?: Date;
    updatedAt?: Date;
}

const videoSchema = new Schema<IVideo>({
    title: {type:String, required:true},
    description: {type:String, required:true},
    thumbnailUrl: {type:String, required:true},
    videoUrl: {type:String, required:true},
    controls: {type:String, required:true,default:false},
    uploadUser:{type:String},
    transformation: {
            width:{type:Number,default:VIDEO_DIMENSIONS.width},
            height:{type:Number,default:VIDEO_DIMENSIONS.height},
            quality:{type:Number,min:1,max:100},
        },
},{timestamps: true});

const VideoModel = models.Video || model<IVideo>("Video", videoSchema);
export default VideoModel;