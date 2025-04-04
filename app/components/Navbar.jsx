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
import { useState, useEffect } from "react";
import { Logo, nav } from "../constants";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useCart } from "./CartContext";
import Link from "next/link";
import dynamic from "next/dynamic";
const Button = dynamic(() => import("../elements/Button"), { ssr: false });

const Navbar = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { data: session } = useSession();
  const [toggle, setToggle] = useState(false);
  const [scart, setcart] = useState(false);
  const [search, setSearch] = useState("");
  const [price, setPrice] = useState(0);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [total, setTotal] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = () => {
    signOut({
      redirect: true,
      callbackUrl: "/Login",
    });
  };

  const toggleNavigation = () => setToggle(!toggle);
  const cartNavigation = () => setcart(!scart);

  const searchProduct = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    console.log("Search Product", search);
  }, [search]);

  useEffect(() => {
    const subtotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setPrice(subtotal);

    const delivery = subtotal * 0.05;
    setDeliveryCost(delivery);

    setTotal(subtotal + delivery);
  }, [cart]);

  return (
    <>
      {(toggle || scart) && (
        <div className="fixed bg-black opacity-70 z-50 h-full w-full top-0 left-0"></div>
      )}

      <div className="px-4 py-5 flex justify-between items-center bg-separate sticky top-0 z-40">
        <div className="flex items-center gap-2 md:hidden">
          <FontAwesomeIcon
            onClick={toggleNavigation}
            icon={faBars}
            width={24}
            height={24}
            className="hover:cursor-pointer md:hidden"
          />
          <Link href="/">
            <Image src="/assets/Logo2.png" alt="Logo" width={30} height={30} />
          </Link>
        </div>
        <Link href="/">
          <div className=" items-end hidden md:flex">
            <Image src="/assets/Logo2.png" alt="Logo" width={40} height={40} />
            <h4 className="text-3xl font-semibold ">
              <span className="text-primary">Ten</span>sai Tra
              <span className="text-primary">de</span>
            </h4>
          </div>
        </Link>

        <div className="flex items-center  border-black rounded-full border-[3px] px-3 font-bold py-1 w-[448px] max-lg:w-[350px] max-md:w-[250px] max-md:px-2 max-md:wi[250px] max-md:font-semibold max-md:text-xs">
          <input
            type="text"
            suppressHydrationWarning
            placeholder="Search Products"
            className="flex-1 bg-transparent focus:outline-none"
            onChange={(e) => searchProduct(e)}
          />
          <Link href={`/search/${search}`} passHref>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              width={20}
              height={20}
              className="bg-black text-white p-2 rounded-full max-md:p-1 "
            />
          </Link>
        </div>

        <div className="flex gap-5 items-center">
          {mounted && (
            <>
              <div className="flex items-center font-semibold text-lg gap-1">
                <FontAwesomeIcon icon={faUser} width={24} height={24} />
                <p className=" text-primary max-lg:hidden">User</p>
              </div>

              <div
                className="flex items-center font-semibold text-lg gap-1 hover:cursor-pointer"
                onClick={cartNavigation}
              >
                <div className="relative">
                  <p className="bg-button_color text-white px-1 text-xs rounded-full absolute top-[-3px] right-[-5px]">
                    {cart.length}
                  </p>
                  <FontAwesomeIcon icon={faCartPlus} width={24} height={24} />
                </div>
                <p className=" text-primary max-lg:hidden">Cart</p>
              </div>
            </>
          )}
          {mounted && session ? (
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
            mounted && (
              <button className="hidden md:block text-white bg-[#4b5966] rounded-full px-4 py-2">
                Sign In
              </button>
            )
          )}
        </div>
      </div>
      {/*Cart*/}
      <div
        className={`${
          scart ? "right-0" : "-right-full"
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
        {cart.length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          <>
            <div className="flex flex-col justify-between h-[80vh]">
              <div className="overflow-y-auto scrollbar-hidden">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center border width-full rounded-md py-2 mt-5 px-4"
                  >
                    <Image
                      src={item.imageUrl}
                      width={75}
                      height={85}
                      alt={item.name}
                      className="rounded-md"
                    />
                    <div>
                      <h3 className="text-gray-500 text-lg">{item.name}</h3>
                      <p className="text-md mt-2">
                        <span className="font-semibold text-lg text-gray-600">
                          ₹{item.price}.00
                        </span>{" "}
                        x {item.quantity} {item.unit}
                      </p>
                      <div className="flex justify-around border text-lg text-gray-500 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              item.quantity > 1
                                ? item.quantity - 1
                                : item.quantity
                            )
                          }
                        >
                          -
                        </button>
                        <p>{item.quantity}</p>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="hover:cursor-pointer text-md self-start text-red-500"
                      onClick={() => removeFromCart(item._id)}
                    />
                  </div>
                ))}
              </div>
              {/* Subtotal, Delivery Cost, and Total */}
              <div className="border-t z-100">
                <div className="flex justify-between items-center mt-5">
                  <p className="text-gray-500 font-semibold">Sub-Total:</p>
                  <p className="text-gray-600 font-bold">₹{price.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center mt-5">
                  <p className="text-gray-500 font-semibold">
                    Delivery-Cost(5%):
                  </p>
                  <p className="text-gray-600 font-bold">
                    ₹{deliveryCost.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-5">
                  <p className="text-gray-500 font-semibold">Total:</p>
                  <p className="text-gray-600 font-bold">₹{total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </>
        )}
        {cart.length > 0 && (
          <div className="flex mt-3 justify-around">
            <a href="/cart">
              <Button
                className="font-bold py-2 px-7 hover:bg-button_color"
                backColor="bg-gray-600"
                color="text-white"
                label="View Cart"
              />
            </a>
            <button
              className="font-bold py-2 px-7 bg-button_color rounded-md text-white"
              onClick={() => clearCart()}
            >
              Clear Cart
            </button>
          </div>
        )}
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
