import React from "react";
import { getSession } from "../lib/getSession";
import { redirect } from "next/navigation";

const dashboard = async () => {
  const session = await getSession();
  const user = session?.user;
  if (user) {
    if (user.role != "admin") redirect("/");
  } else redirect("/Login");
  return (
    <div>
      <h1>Welcome to Dashboard</h1>
    </div>
  );
};

export default dashboard;
