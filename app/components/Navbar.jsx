"use client";
import "../globals.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faBars,
  faMagnifyingGlass,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Logo, nav } from "../constants";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  const [toggle, setToggle] = useState(false);
  const [cart, setcart] = useState(false);

  const handleSignOut = () => {
    signOut({
      redirect: true,
      callbackUrl: "/Login",
    });
  };

  const toggleNavigation = () => setToggle(!toggle);
  const cartNavigation = () => setcart(!cart);

  return (
    <>
      {(toggle || cart) && (
        <div
          className="fixed bg-black opacity-70 z-50 h-full w-full top-0 left-0"
          onClick={toggleNavigation}
        ></div>
      )}

      <div className="px-4 py-5 flex justify-between items-center bg-separate sticky top-0 z-40">
        <FontAwesomeIcon
          onClick={toggleNavigation}
          icon={faBars}
          width={24}
          height={24}
          className="hover:cursor-pointer"
        />

        <div className="flex items-center border border-gray-600 rounded-md px-3 py-2 w-full max-w-md">
          <input
            type="text"
            placeholder="Search Products"
            className="flex-1 bg-transparent focus:outline-none"
          />
          <FontAwesomeIcon icon={faMagnifyingGlass} width={20} height={20} />
        </div>

        <div className="flex gap-5 items-center">
          <FontAwesomeIcon icon={faUser} width={24} height={24} />
          <FontAwesomeIcon
            icon={faCartPlus}
            width={24}
            height={24}
            onClick={cartNavigation}
          />
          {session ? (
            <>
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
                width={24}
                height={24}
                onClick={handleSignOut}
                className="md:hidden hover:cursor-pointer"
              />
              <button
                onClick={handleSignOut}
                className="hidden md:block text-white bg-border border-2 rounded-full px-4 py-2 hover:border-[#4b5966] hover:bg-transparent hover:text-border"
              >
                Logout
              </button>
            </>
          ) : (
            <button className="hidden md:block text-white bg-[#4b5966] rounded-full px-4 py-2">
              Sign In
            </button>
          )}
        </div>
      </div>
      {/*Cart*/}
      <div
        className={`${
          cart ? "right-0" : "-right-full"
        } w-80 fixed bg-white px-5 py-4 h-full top-0 z-50 transition-all duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center">
          <h2 className="py-2 text-lg font-semibold">My Cart</h2>
          <FontAwesomeIcon
            icon={faTimes}
            className="hover:cursor-pointer text-xl"
            onClick={cartNavigation}
          />
        </div>

        {/* Navigation items */}
        <ul className="mt-4 space-y-3">
          {nav.map((item, index) => (
            <li
              key={index}
              className="py-3 px-4 border rounded-md flex justify-between items-center hover:bg-gray-100"
            >
              {item.title}
              {item.icon}
            </li>
          ))}
        </ul>

        <ul className="mt-6 flex items-center justify-center gap-4">
          {Logo.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-center py-2 px-3 bg-slate-400 rounded-md h-8 hover:bg-slate-500 hover:cursor-pointer"
            >
              {item.logo}
            </li>
          ))}
        </ul>
      </div>
      <div
        className={`${
          toggle ? "left-0" : "-left-full"
        } w-80 fixed bg-white px-5 py-4 h-full top-0 z-50 transition-all duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center">
          <h2 className="py-2 text-lg font-semibold">My Menu</h2>
          <FontAwesomeIcon
            icon={faTimes}
            className="hover:cursor-pointer text-xl"
            onClick={toggleNavigation}
          />
        </div>

        {/* Navigation items */}
        <ul className="mt-4 space-y-3">
          {nav.map((item, index) => (
            <li
              key={index}
              className="py-3 px-4 border rounded-md flex justify-between items-center hover:bg-gray-100"
            >
              {item.title}
              {item.icon}
            </li>
          ))}
        </ul>

        <ul className="mt-6 flex items-center justify-center gap-4">
          {Logo.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-center py-2 px-3 bg-slate-400 rounded-md h-8 hover:bg-slate-500 hover:cursor-pointer"
            >
              {item.logo}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
