import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
    console.error("MongoDB URI is missing");
}

let cached = global.mongoose;
if(!cached)
{
    cached = global.mongoose = {conn: null,promise:null};
}

async function connectToDB() {
    if(cached.conn)
    {
        return cached.conn;
    }

    if(!cached.promise)
    {
        const opts = {
            bufferCommands: false,
            maxPoolSize:10,
        }
      cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection);

    }

    try {
        cached.conn = await cached.promise;
    }catch (err)
    {
        cached.conn = null;
       throw err;
    }
return cached.conn;
}
 export default connectToDB;