"use client";
import { useFormik } from "formik";
import userSchema, { videoSchema } from "../validation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import UploadFile from "../../components/fileUPload";

export default function UploadVideo() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [videoRes, setVideoRes] = useState(null);

 
  useEffect(() => {
    if (status == "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const mutation = useMutation({
    mutationFn: submitData,
    onSuccess: () => {
     
    },
  });
  const { handleChange, handleBlur, handleSubmit, values, errors, touched } =
    useFormik({
      initialValues: {
        title: "",
        description: "",
      },
      validationSchema: videoSchema,
      onSubmit: (data) => {
        mutation.mutate(data);
      },
    });

  async function submitData(data) {
    const response = await videoRes;
    const res = await fetch("/api/video", {
      method: "POST",
      headers: { "Content-type": "Application/json" },
      body: JSON.stringify({
        ...data,
        thumbnailUrl: response?.thumbnailUrl || " ",
        videoUrl: response.url,
      }),
    });
    const resData = await res.json();
    if (!res.ok) {
      toast.error(resData.error);
    } else {
      await toast.success("video uploaded sucessfully!");
      router.push("/login");
    }
    return data;
  }

  if (status == "loading" || status == "unauthenticated") {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-300 px-4">
      <form
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 space-y-5"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center text-purple-700">
          Upload Video
        </h1>

        <div className="flex flex-col">
          <label
            htmlFor="title"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.title}
            placeholder="Enter video title"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.title && touched.title && (
            <p className="text-sm text-red-600 mt-1">{errors.title}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="description"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.description}
            placeholder="Enter video description"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
          {errors.description && touched.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="video"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Select Video File
          </label>
          <UploadFile
            fileType={"video"}
            onSuccess={(res) => {
              setVideoRes(res);
            }}
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className={`w-full text-white font-medium py-2 rounded-lg transition duration-300 cursor-pointer ${
            mutation.isPending
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {mutation.isPending ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
}
