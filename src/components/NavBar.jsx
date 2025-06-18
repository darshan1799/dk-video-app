"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { BiLogIn, BiLogOut, BiUpload, BiUser } from "react-icons/bi";
import { HiHome, HiMenu } from "react-icons/hi";
import Image from "next/image";

export default function NavBar() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { data: session } = useSession();
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("logout successfully!");
    } catch (e) {
      toast.error("logout failed! try again");
    }
  };

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <HiHome className="w-6 h-6 text-gray-700" />
                </button>
              </Link>
            </div>
            <div className="flex-1 flex justify-center">
              <h1 className="text-2xl font-bold text-gray-800">
                Video <span className="text-purple-600">DK</span>
              </h1>
            </div>
            <div className="relative">
              {session ? (
                <div
                  className="relative  inline-block"
                  onMouseEnter={() => setShowUserMenu(true)}
                  onClick={() => setShowUserMenu((prev) => !prev)}
                >
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors hover:cursor-pointer">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          width={32}
                          height={32}
                          alt="profile image"
                          className="rounded-full"
                        />
                      ) : (
                        <BiUser className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </button>

                  {/* Keep this inside the same container */}
                  {showUserMenu && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                      onMouseLeave={() => setShowUserMenu(false)}
                    >
                      <Link href="/upload">
                        <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                          <BiUpload className="w-4 h-4" />
                          <span>Upload Video</span>
                        </button>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <BiLogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                  <Link href="/login">Login</Link>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
