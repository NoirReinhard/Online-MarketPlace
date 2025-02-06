"use client";
import "../globals.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faBars,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { useState, useEffect } from "react";

import { Logo, nav } from "../constants";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();

  const [toggle, settoggle] = useState(false);
  const handleSignOut = () => {
    signOut({
      redirect: true,
      callbackUrl: "/Login",
    });
  };
  const toggleNavigation = () => {
    if (toggle) {
      settoggle(false);
    } else {
      settoggle(true);
    }
  };
  console.log("Session Updated",session);

  return (
    <>
      <div
        className={`${
          toggle ? "absolute" : "hidden"
        }  bg-black opacity-70 z-40 h-full w-full`}
      ></div>
      <div className="px-[8px] py-5 flex justify-between bg-separate items-center">
        <FontAwesomeIcon
          onClick={toggleNavigation}
          icon={faBars}
          width={24}
          height={24}
          className=" hover:cursor-pointer"
        />
        <div className="border-gray-600 border-solid border p-3 rounded-md w-[400px] h-10 flex items-center justify-between">
          <input type="text" placeholder="Search Products" className="bg-transparent focus:outline-none" />
          <FontAwesomeIcon icon={faMagnifyingGlass} width={20} height={20}/>
        </div>
        <div className="flex gap-5 items-center">
          <FontAwesomeIcon icon={faUser} width={24} height={24} />
          <FontAwesomeIcon icon={faCartPlus} width={24} height={24} />
          {!session ? (
            <button className="max-md:hidden text-white bg-[#4b5966] rounded-full px-2 py-1">
              Sign In
            </button>
          ) : (
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
                className="max-md:hidden text-white bg-border border-2 rounded-full px-2.5 py-1.5 hover:border-[#4b5966] hover:border-2 hover:bg-transparent hover:text-border"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
      <div
        className={`${
          toggle ? "left-0" : "left-[-320px]"
        } w-[320px] absolute bg-white px-[20px] py-[10px] h-full left-0 top-0 z-50 ease-in duration-300`}
      >
        <div className="flex justify-between">
          <h2 className="py-2">My Menu</h2>
          <FontAwesomeIcon
            icon={faTimes}
            className="hover:cursor-pointer text-xl"
            onClick={toggleNavigation}
          />
        </div>
        <ul className="py-[10px]">
          {nav.map((item, index) => (
            <div className="py-[5px]" key={index}>
              <li className="py-[10px] border-bdr border px-[10px] rounded-md flex justify-between items-center">
                {item.title}
                {item.icon}
              </li>
            </div>
          ))}
        </ul>
        <ul className="flex items-center justify-center gap-2">
          {Logo.map((item, index) => (
              <li  key={index} className="flex items-center justify-center py-[10px] bg-slate-400 rounded-md px-2 h-8 hover:bg-slate-500 hover:cursor-pointer">
                {item.logo}
              </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
{
  /* <Image src="/assets/Real Logo.png" height={40} width={40}alt="logo" /> */
}
