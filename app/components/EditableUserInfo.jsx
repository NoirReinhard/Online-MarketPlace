"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useUserContext } from "@/app/components/UserContext";
import Loader from "@/app/components/Loader";

const EditableUserInfo = ({ user }) => {
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [tempUsername, setTempUsername] = useState(user.username);
  const [imgURL, setImgURL] = useState(user.imgURL);
  const [isUploading, setIsUploading] = useState(false);
  const { data: session } = useSession();
  const isvalid = user._id == session?.user.id;
  const { setProfileImage } = useUserContext();

  const handleSave = async () => {
    const res = await fetch(`/api/update-username/${username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: tempUsername }),
    });
    const response = await res.json();
    if (response.success) {
      toast.success("Username updated successfully!");
    } else {
      toast.error("Failed to update username.");
    }
    setUsername(tempUsername);
    setEditing(false);
  };

  const handleCancel = () => {
    setTempUsername(username);
    setEditing(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setIsUploading(true);
    try {
      const res = await fetch("/api/edit-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Profile image changed successfully!");
        setImgURL(data.imgURL);
        setProfileImage(data.imgURL);
      } else {
        toast.error(data.error || "Failed to change profile image");
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      toast.error("An error occurred while uploading the product.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <section className="profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="text-24-black uppercase text-center line-clamp-1">
              {tempUsername}
            </h3>
          </div>
          <div className="relative">
            {isUploading && (
              <div className="absolute inset-0 bg-white/60 rounded-full flex items-center justify-center z-10">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            <Image
              src={imgURL}
              alt="name"
              width={220}
              height={220}
              className="profile_image z-10"
            />
            {isvalid && (
              <>
                <input
                  id="imageUpload"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  className="hidden"
                />
                <label
                  htmlFor="imageUpload"
                  className="z-50 w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-300 cursor-pointer hover:bg-gray-200 transition duration-200 absolute bottom-2 right-2"
                >
                  <FontAwesomeIcon
                    icon={faCamera}
                    className="text-gray-500 text-xl "
                    height={20}
                    width={20}
                  />
                </label>
              </>
            )}
          </div>

          <p className="text-30-extrabold mt-7 text-center">@{user.role}</p>
        </div>
        <div className="relative border-l-4 border-gradient-to-b from-blue-500 via-purple-500 to-pink-500 pl-8 py-6 w-full max-w-2xl">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 mb-10 relative inline-block after:content-[''] after:block after:h-1 after:bg-primary after:mt-1 after:rounded-full after:w-2/3">
            User Profile
          </h2>

          <div className="space-y-10 text-white">
            {/* Username Row */}
            <div className="flex justify-between items-start">
              <div className="w-full">
                <label className="block text-sm uppercase font-bold text-gray-300 mb-1 tracking-widest">
                  Username
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    className="bg-white/10 backdrop-blur-lg text-black px-4 py-2 w-full rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-gray-300"
                    placeholder="Enter username"
                  />
                ) : (
                  <p className="text-xl font-semibold tracking-tight text-black">
                    {username}
                  </p>
                )}
              </div>

              <div className="ml-4 mt-4">
                {editing ? (
                  <div className="flex gap-3 items-center mt-4">
                    <button
                      onClick={handleSave}
                      className="text-green-400 hover:text-green-600 text-2xl"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-red-400 hover:text-red-600 text-2xl"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  isvalid && (
                    <button
                      onClick={() => setEditing(true)}
                      className="text-primary hover:text-pink-700 text-2xl"
                    >
                      <FaEdit />
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-60" />

            {/* Email Row */}
            <div>
              <label className="block text-sm uppercase font-bold text-gray-300 mb-1 tracking-widest">
                Email
              </label>
              <p className="text-xl font-semibold tracking-tight text-black">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditableUserInfo;
