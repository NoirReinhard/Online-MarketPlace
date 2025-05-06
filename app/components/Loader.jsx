"use client";

import { MoonLoader } from "react-spinners";

const Loader = ({ loading = true, color = "green", size = 60 }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <MoonLoader color={color} loading={loading} size={size} />
    </div>
  );
};

export default Loader;
