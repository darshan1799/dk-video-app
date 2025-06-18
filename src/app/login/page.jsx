"use client";
import { useFormik } from "formik";
import { loginSchema } from "../validation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "../../components/Loader";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: submitData,
    onSuccess: () => {
      console.log("success");
    },
  });
  const { handleChange, handleBlur, handleSubmit, values, errors, touched } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: loginSchema,
      onSubmit: (data) => {
        mutation.mutate(data);
      },
    });

  async function submitData(data) {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
   
    if (res?.error) {
      toast.error(res.error);
    } else {
      await toast.success("login successfully!");
      router.push("/");
    }
    return data;
  }
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status == "authenticated") {
      router.push("/");
    }
  }, [status]);

  if (status == "loading" || status == "authenticated") {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-300 px-4">
      <form
        className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-6 space-y-5"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center text-purple-700">
          log in
        </h1>
        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            placeholder="Enter your email"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.email && touched.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
            placeholder="Enter your password"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.password && touched.password && (
            <p className="text-sm text-red-600 mt-1">{errors.password}</p>
          )}
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
          {mutation.isPending ? "login..." : "login"}
        </button>
        <div className="relative flex items-center ">
          <div className="flex-grow border-t border-gray-300 h-0.5"></div>
          <span className="mx-2 text-xs text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300 h-0.5"></div>
        </div>

        <button
          onClick={() => signIn("google")}
          className="flex items-center justify-center gap-3 px-6 py-2 rounded-xl border border-gray-300 bg-white shadow-md hover:shadow-lg transition duration-200 ease-in-out hover:bg-gray-100 w-full cursor-pointer"
          type="button"
        >
          <FcGoogle size={24} />
          <span className="text-gray-800 font-medium">Sign in with Google</span>
        </button>
        <p className="text-center text-sm text-gray-600">
          Not registered?
          <Link href="/signup" className="text-purple-600 hover:underline ml-1">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
