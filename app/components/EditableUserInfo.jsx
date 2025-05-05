"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useUserContext } from "@/app/components/UserContext";

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
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
          <p className="text-2xl font-semibold mb-6 text-gray-900 tracking-tight">
            User Info
          </p>

          <div className="grid gap-6">
            {/* Username row */}
            <div className="flex justify-between items-start group">
              <div className="w-full">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Username
                </p>
                {editing ? (
                  <input
                    type="text"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  />
                ) : (
                  <p className="text-lg font-medium text-gray-800">
                    {username}
                  </p>
                )}
              </div>

              <div className="ml-3 mt-6">
                {editing && (
                  <div className="flex gap-2 pt-3">
                    <button
                      onClick={handleSave}
                      className="text-green-600 hover:text-green-800 transition-colors"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
                {!editing && isvalid && (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <FaEdit />
                  </button>
                )}
              </div>
            </div>

            {/* Email row */}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
              <p className="text-lg font-medium text-gray-800">{user.email}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditableUserInfo;
