import React from 'react';
import "./globals.css";
import { getSession } from './lib/getSession';
import { redirect } from 'next/navigation';

const page = async() => {
  const session = await getSession();
    const user = session?.user;
    if (user) {
      if (user.role == "seller") redirect("/seller");
    } else redirect("/Login");
  return (
    <div>
      Welcome to Home
    </div>


  )
}

export default page
