"use client";
import "../globals.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faBars,
  faMagnifyingGlass,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { Logo, nav } from "../constants";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useCart } from "./CartContext";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useUserContext } from "@/app/components/UserContext";

const Button = dynamic(() => import("../elements/Button"), { ssr: false });

const Navbar = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { data: session, status } = useSession();
  const [toggle, setToggle] = useState(false);
  const [scart, setcart] = useState(false);
  const [search, setSearch] = useState("");
  const [price, setPrice] = useState(0);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [total, setTotal] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [ban, setBan] = useState(false);
  const [profileImg, setProfileImg] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  var MenuItems = [];

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    fetch("/api/get-products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);
  useEffect(() => {
    if (!session?.user?.email) return;

    fetch("/api/get-users")
      .then((res) => res.json())
      .then((data) => {
        const user = data.find((item) => item.email === session.user.email);
        if (user) {
          setProfileImg(user.imgURL);
        }

        const isBanned = user?.banned === true;
        setBan(isBanned);

        if (isBanned) {
          toast.error("You are banned from this site", {
            duration: 5000,
            description: "Please contact support for more information.",
            action: {
              text: "Contact Support",
              onClick: () =>
                (window.location.href = "mailto:janakimano6@gmail.com"),
            },
          });

          signOut({
            redirect: true,
            callbackUrl: "/Login",
          });
        }
      });
  }, [session?.user?.email]);

  const handleSignOut = () => {
    signOut({
      redirect: true,
      callbackUrl: "/Login",
    });
  };
  const pathname = usePathname();
  const toggleNavigation = () => setToggle(!toggle);
  const cartNavigation = () => setcart(!scart);

  const searchProduct = (e) => {
    const keyword = e.target.value;
    setSearch(keyword);

    if (keyword.trim() === "") {
      setFilteredProducts([]);
      return;
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    const subtotal = cart.reduce(
      (acc, item) => acc + item.price * item.cquantity,
      0
    );
    setPrice(subtotal);

    const delivery = subtotal * 0.05;
    setDeliveryCost(delivery);

    setTotal(subtotal + delivery);
  }, [cart]);

  const isAdmin = session?.user?.role === "admin";
  const isSeller = session?.user?.role === "seller";
  const isBuyer = !isAdmin && !isSeller;

  const onSellerPage = pathname.startsWith("/seller");
  const onAdminPage = pathname.startsWith("/Dashboard");
  const onBuyerPage =
    pathname === "/" ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/products");

  if (session) {
    if (isAdmin) {
      if (onAdminPage) {
        MenuItems.push(
          { title: "Dashboard", link: "/Dashboard" },
          { title: "Users", link: "/Dashboard/users" }
        );
      }

      if (onSellerPage) {
        MenuItems.push(
          { title: "Sell Item", link: "/seller/sellItem" },
          { title: "Orders", link: "/seller/orders" }
        );
      }

      if (onBuyerPage) {
        MenuItems.push(
          { title: "Orders", link: "/orders" },
          { title: "Cart", link: "/cart" },
          { title: "Seller", link: "/seller" }
        );
      }

      if (!MenuItems.find((item) => item.link === "/Dashboard")) {
        MenuItems.unshift({ title: "Dashboard", link: "/Dashboard" });
      }
    } else if (isSeller || onSellerPage) {
      MenuItems.push(
        { title: "Sell Item", link: "/seller/sellItem" },
        { title: "Orders", link: "/seller/orders" }
      );
    } else if (isBuyer || onBuyerPage) {
      MenuItems.push(
        { title: "Orders", link: "/orders" },
        { title: "Cart", link: "/cart" }
      );
    }
  }
  const { profileImage } = useUserContext();

  return (
    <>
      {(toggle || scart) && (
        <div
          className="fixed bg-black opacity-70 z-50 h-full w-full top-0 left-0"
          onClick={cartNavigation}
        ></div>
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
        {mounted && session && session?.user?.role != "seller" && (
          <div className="flex items-center  border-black rounded-full border-[3px] px-3 font-bold py-1 w-[448px] max-lg:w-[350px] max-md:w-[250px] max-md:px-2 max-md:w[250px] max-md:font-semibold max-md:text-xs relative">
            <input
              type="text"
              value={search}
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
                className="bg-black text-white p-2 rounded-full max-md:p-1"
                onClick={() => {
                  setSearch("");
                  setSearch("");
                }}
              />
            </Link>
            {search && filteredProducts.length > 0 && (
              <div
                className="absolute bg-white border border-gray-300 top-[55px] rounded-md mt-1 font-bold  w-[448px] max-lg:w-[350px] max-md:w-[250px] max-md:px-2 max-md:font-semibold max-md:text-xs overflow-y-auto z-50 left-0"
                onClick={() => setSearch("")}
              >
                {filteredProducts.map((product, index) => (
                  <div
                    className={`flex justify-between ${
                      filteredProducts.length == index + 1
                        ? ""
                        : "border-b border-gray-300"
                    } items-center p-2 hover:bg-gray-200 w-full hover:cursor-pointer`}
                    key={product._id}
                  >
                    <div>
                      <Link
                        key={product._id}
                        href={`/products/${product._id}`}
                        className="flex items-center gap-2 p-2 w-[300px]"
                      >
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={60}
                          height={60}
                          className="rounded-md"
                        />
                        <div>
                          <h3 className="text-gray-700 font-semibold">
                            {product.name}
                          </h3>
                          <p className="text-gray-500">₹{product.price}.00</p>
                        </div>
                      </Link>
                    </div>
                    <Link href={`/profile/${product.sellerId._id}`}>
                      <div className="flex items-center gap-2">
                        <h3 className="text-gray-700 text-sm font-semibold">
                          {product.sellerId.username}
                        </h3>
                        <Image
                          src={
                            product.sellerId.imgURL ||
                            "https://res.cloudinary.com/dpk7ntarg/image/upload/v1746411877/e48089c4-7a32-48ee-b879-0c8a69bbdbe4.png"
                          }
                          alt="Profile"
                          width={40}
                          height={20}
                          className="rounded-full object-cover h-[30px] w-[30px] border-1 border-red-500 hover:cursor-pointer"
                        />
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-5 items-center">
          {mounted && (
            <>
              {MenuItems.map((item, index) => {
                if (item.title === "Cart") {
                  return (
                    <div
                      key={index}
                      className="flex items-center font-semibold text-lg gap-1 hover:cursor-pointer"
                      onClick={cartNavigation}
                    >
                      <div className="relative">
                        <p className="bg-button_color text-white px-1 text-xs rounded-full absolute top-[-3px] left-[15px] ">
                          {cart.length}
                        </p>
                        <div className="flex justify-center items-center gap-1">
                          <FontAwesomeIcon
                            icon={faCartPlus}
                            width={24}
                            height={24}
                            className="text-black"
                          />
                          <p className="hidden md:flex text-primary text-lg font-semibold hover:cursor-pointer">
                            {item.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link href={item.link} key={index}>
                    <p className="hidden md:flex text-primary text-lg font-semibold hover:cursor-pointer">
                      {item.title}
                    </p>
                  </Link>
                );
              })}
            </>
          )}
          {mounted && session ? (
            <>
              <Link href={`/profile/${session.user?.id}`}>
                <Image
                  src={
                    profileImage ||
                    profileImg ||
                    "https://res.cloudinary.com/dpk7ntarg/image/upload/v1746411877/e48089c4-7a32-48ee-b879-0c8a69bbdbe4.png"
                  }
                  alt="Profile"
                  width={40}
                  height={20}
                  className="rounded-full object-cover  h-[42px] w-[42px]  hover:cursor-pointer"
                />
              </Link>
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
              <Link href="/register">
                <button className="hidden md:block text-white bg-[#4b5966] rounded-full px-4 py-2">
                  Sign In
                </button>
              </Link>
            )
          )}
        </div>
      </div>

      {/* Cart */}
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

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[80vh] gap-2">
            <img src="/assets/cart3.png" height="200px" width="200px" alt="" />
            <p className="font-semibold text-gray-500 text-lg">
              Cart is empty!
            </p>
          </div>
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
                              item.cquantity > 1
                                ? item.cquantity - 1
                                : item.cquantity
                            )
                          }
                        >
                          -
                        </button>
                        <p>{item.cquantity}</p>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.cquantity + 1)
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

      {/* Side Menu */}
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
