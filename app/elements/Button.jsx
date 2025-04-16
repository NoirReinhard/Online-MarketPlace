import React from "react";

const Button = ({ label, backColor, color, wth, border, className , rounded,onClick}) => {
  return (
    <div>
      <button
        className={` border-formborder border py-1  px-4 ${
          backColor
            ? `${backColor} ${color} ${border}`
            : "bg-button_color text-white  font-semibold"
        }  ${wth && "w-full"} ${className && className} ${rounded? "rounded-full":"rounded-md"}`}
        onClick={onClick}
      >
        {label}
      </button>
    </div>
  );
};

export default Button;
