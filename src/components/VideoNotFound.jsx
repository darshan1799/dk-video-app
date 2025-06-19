"use client";

import { useRouter } from "next/navigation";
import { BiCameraMovie } from "react-icons/bi";

export default function VideoNotFound() {
  const router = useRouter();
  return (
    <>
      <div className="w-full h-dvh flex justify-center items-center -mt-20">
        <div className="h-fit py-6 flex flex-col items-center justify-center bg-white rounded-2xl shadow-md border border-dashed border-gray-300 -mt-18">
          <BiCameraMovie className="text-5xl text-purple-500 mb-4" />

          <h1 className="text-2xl font-bold text-gray-700">No Videos Found</h1>

          <p className="text-gray-500 text-sm text-center max-w-sm mt-2">
            You haven't uploaded any videos yet. Start sharing your content to
            engage with others.
          </p>

          <button
            className="mt-5 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all cursor-pointer"
            onClick={() => router.push("/upload")}
          >
            Upload Video
          </button>
        </div>
      </div>
    </>
  );
}
