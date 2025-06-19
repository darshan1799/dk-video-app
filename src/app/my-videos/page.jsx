import { getServerSession } from "next-auth";
import Loader from "../../components/Loader";
import { redirect } from "next/navigation";
import { BiCameraMovie } from "react-icons/bi";
import VideoNotFound from "../../components/VideoNotFound";

export default async function () {
  const url = process.env.BASE_API_URL;
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }
  const res = await fetch(`${url}api/video?my-videos=${session.user.email}`);
  if (!res.ok) {
    return <Loader />;
  }
  const { videos } = await res.json();
  
  return (
    <>
      <div className="pt-14 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-dvh flex justify-center items-center ">
        {(!videos || videos.length === 0) && <VideoNotFound />}

        <div className=" gap-2 grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  items-center">
          {videos?.map((video, index) => {
            return (
              <div
                key={index}
                className="w-full max-w-md  bg-slate-900 text-white rounded-2xl overflow-hidden shadow-xl transition-transform duration-300 hover:scale-[1.01] hover:shadow-2xl max-h-96"
              >
                <div className="aspect-video bg-black hover:cursor-pointer">
                  <video
                    key={index}
                    src={video.videoUrl}
                    controls
                    className="w-full h-full object-contain bg-black rounded-none"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="w-full px-4 py-3 ">
                  <h2 className="text-lg font-bold text-white truncate">
                    {video.title}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1  truncate">
                    {video.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
