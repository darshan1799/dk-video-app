"use client"; // This component must be a client component

import { upload } from "@imagekit/next";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const UploadFile = ({ onSuccess, onError, fileType }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const validateFile = (file) => {
    if (fileType === "video") {
     
      if (!file.type.startsWith("video/")) {
        toast.error("please upload valid video!");
        setError("please upload valid video!");
        return false;
      }
    }
    if (file >= 100 * 1024 * 1024) {
      toast.error("video size must be less than 100mb!");
      setError("video size must be less than 100mb!");
      return false;
    }
    return true;
  };

  const handelFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !validateFile(file)) {
      
      return;
    }
    setUploading(true);
    setError(null);

    try {
      const res = await fetch("/api/imagekit-auth", { method: "GET" });
      const authParameter = await res.json();

      const finalRes = upload({
        expire: authParameter.expire,
        token: authParameter.token,
        signature: authParameter.signature,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
        file,
        fileName: file.name,
        onProgress: (event) => {
          if (event.lengthComputable) {
            const percentage = (event.loaded / event.total) * 100;
            setProgress(Math.round(percentage));
          }
        },
      });

      setError(null);
      onSuccess(finalRes);
    } catch (err) {
     
      console.log("failed to upload!");
    } finally {
      setUploading(false);
      setError(null);
    }
  };

  return (
    <>
      <input
        id="video"
        type="file"
        name="video"
        accept={fileType == "video" ? "video/*" : "image/*"}
        onChange={handelFileChange} // handle separately from formik
        className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white file:mr-3 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-purple-600 file:text-white hover:file:bg-purple-700"
      />
    </>
  );
};

export default UploadFile;
