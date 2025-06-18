import VideoModel from "@/models/Video";
import connectToDB from "./db";
import UserModel from "@/models/User";

async function getVideos() {
  try {
    await connectToDB();

    const videos = await VideoModel.find({}).sort({ createdAt: -1 }).lean();
    if (!videos || videos.length === 0) {
      return [];
    }

    const enrichedVideos = await Promise.all(
      videos.map(async (video) => {
        const userRes = await UserModel.findOne({ email: video.uploadUser });

        video.name = userRes.name || "unknown";
        video.image = userRes.image || null;
        return video;
      })
    );

    return enrichedVideos;
  } catch (err) {
    console.log(err);
    return "Something Went Wrong!";
  }
}

export default getVideos;
