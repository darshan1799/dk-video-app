import mongoose, {model} from "mongoose";
import {Schema,models} from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    email: string;
    password: string;
    name:string;
    provider:string;
    image:string,
    _id?:mongoose.Types.ObjectId;
    created_at?: Date;
    updated_at?: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name:{type:String},
        email:{type:String,required:true,unique:true},
         provider: {
    type: String,
    enum: ["google", "credentials"],
    default: "credentials",
  },
    image:{type:String,default:" "},
        password:{type:String,validate:{validator:function(value)
            {
                if(this.provider ==="credentials")
                {
                    return value;
                }
                  return true;
            }
        }},
    },
    {
        timestamps: true
    });

UserSchema.pre("save", async function (next) {
     if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
     }
     next();
})

const UserModel  = models.User || model<IUser>("User", UserSchema);

export default UserModel;