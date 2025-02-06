import React from "react";

const Button = ({ label, backColor, color, wth, border, className , rounded}) => {
  return (
    <div>
      <button
        className={` border-formborder border py-1  px-4 ${
          backColor
            ? `${backColor} ${color} ${border}`
            : "bg-button_color text-white  font-semibold"
        }  ${wth && "w-full"} ${className && className} ${rounded? "rounded-full":"rounded-md"}`}
      >
        {label}
      </button>
    </div>
  );
};

export default Button;
