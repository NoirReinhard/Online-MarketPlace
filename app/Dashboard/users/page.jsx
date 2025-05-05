"use client";
import React, { useEffect, useState } from "react";
import { Ban } from "lucide-react";
import { UserCheck } from "lucide-react";
import { toast } from "sonner";
import { banstatus } from "@/app/constants";
import Button from "@/app/elements/Button";

const page = () => {
  const [users, setUsers] = useState([]);
  const [lb, setLb] = useState("All");
  const [selectedRole, setSelectedRole] = useState("All");
  const [allUsers, setAllUsers] = useState([]);
  const [IsBan, setIsBan] = useState(false);
  useEffect(() => {
    fetch("/api/get-users")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUsers(data);
        setAllUsers(data);
        console.log(data.isBanned, "bannnnnnnnnnn");
      });
  }, []);
  const handleRoleFilter = (roleLabel) => {
    handleFilter(lb, roleLabel);
  };
  const handleFilter = (statusLabel, roleLabel = selectedRole) => {
    setLb(statusLabel);
    setSelectedRole(roleLabel);

    let filtered = allUsers;

    if (statusLabel !== "All") {
      filtered = filtered.filter((user) => user.isBanned === statusLabel);
    }

    if (roleLabel !== "All") {
      filtered = filtered.filter((user) => user.role === roleLabel);
    }

    setUsers(filtered);
  };
  const handleBanUser = async (id) => {
    try {
      const res = await fetch(`/api/ban-user/${id}`, {
        method: "PUT",
      });

      const data = await res.json();

      if (data.success == false) {
        toast.error(data.message);
      } else if (data.success) {
        toast.success(data.message);
        setUsers((prev) =>
          prev.map((user) =>
            user._id === id ? { ...user, isBanned: !user.isBanned } : user
          )
        );
        setAllUsers((prev) =>
          prev.map((user) =>
            user._id === id ? { ...user, isBanned: !user.isBanned } : user
          )
        );
        setIsBan((prev) => !prev);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Error banning user");
      console.error(error);
    }
  };
  return (
    <div className="space-y-3 p-4">
      <div className="flex gap-5 justify-center">
        {banstatus.map((category) => {
          const isActive = lb == category.status;
          const label =
            category.status === true
              ? "Banned"
              : category.status === false
              ? "Active"
              : "All";

          const color = isActive ? "text-white" : "text-blue-950 font-semibold";
          const bgColor = isActive ? "bg-button_color" : "bg-white";

          return (
            <Button
              key={category.status.toString()}
              label={label}
              border="border-gray-300"
              rounded={true}
              onClick={() => handleFilter(category.status)}
              className={`${bgColor} ${color} mx-2 mb-4`}
              color={color}
              backColor={bgColor}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-2 justify-center mt-4">
        <label
          htmlFor="role-filter"
          className="text-sm font-semibold text-gray-800 dark:text-white"
        >
          Filter by Role:
        </label>
        <div className="relative">
          <select
            id="role-filter"
            value={selectedRole}
            onChange={(e) => handleRoleFilter(e.target.value)}
            className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white text-sm px-4 py-2 pr-10 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-button_color transition duration-150"
          >
            <option value="All">All</option>
            <option value="admin">Admin</option>
            <option value="seller">Seller</option>
            <option value="buyer">Buyer</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
      {users.length > 0 ? (
        users.map((user, index) => (
          <div key={user._id} className="mx-auto w-full max-w-2xl">
            <div className="grid grid-cols-[auto_1fr_auto] items-center bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 hover:shadow-md transition duration-200">
              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-white mr-3">
                {user.username[0].toUpperCase()}
              </div>

              <div className="flex flex-col">
                <span className="text-md font-semibold text-gray-800 dark:text-white">
                  {user.username}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </span>
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-600 dark:text-gray-300 font-semibold capitalize">
                    {user.role}
                  </span>
                  <span
                    className={`mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full 
                    ${
                      user.isBanned
                        ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                        : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                    }
                  `}
                  >
                    {user.isBanned ? "Banned" : "Active"}
                  </span>
                </div>
                {user.isBanned ? (
                  <button
                    title="UnBan User"
                    onClick={() => handleBanUser(user._id)}
                    className="text-green-500 hover:text-white hover:bg-green-500 p-1.5 rounded-full transition duration-300"
                  >
                    <UserCheck className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    title="Ban User"
                    onClick={() => handleBanUser(user._id)}
                    className="text-red-500 hover:text-white hover:bg-red-500 p-1.5 rounded-full transition duration-300"
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          No users found.
        </p>
      )}
    </div>
  );
};

export default page;
