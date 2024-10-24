import React from "react";
import { User } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/global/mode-toogle";
import { currentUser } from "@clerk/nextjs/server";
import {  AdminLoginUserSidebar,  onLoginUserSidebar } from "@/actions/auth";

interface Props {
  user?: null | User;
}

const Navbar = async ({ user }: Props) => {
  const authUser = await currentUser();
  const authenticated = await AdminLoginUserSidebar();
  const authenticatedUser = await onLoginUserSidebar()
  return (
    <div className="p-4 fixed top-0 left-0 right-0 z-10 bg-white dark:bg-[#03070f] z-10 flex items-center justify-between">
      <aside className="flex items-center gap-2">
        <Image
          src={"/logo.png"}
          alt="image"
          width={40}
          height={40}
        />
        <span className="text-xl font-bold ">Sphera  Vault.</span>
      </aside>

      <nav className="hidden md:block absolute left-[50%] top-[50%] transform translate-x-[-50%]  translate-y-[-50%] ">
        <ul className="flex items-center justify-center gap-8">
          <Link href={"#"}> Home </Link>
          <Link href={"#investment"}> Investments </Link>
          <Link href={"#about"}> About Us </Link>
          <Link href={"#company"}> Company </Link>
          <Link href={"#contact"}> Contact </Link>
        </ul>
      </nav>
      <aside className="flex gap-2 items-center">
       
      {authenticated ? (
  // Admin view
  <div>
    <Link
      href={"/admin/dashboard"}
      className="bg-primary text-white p-2 px-4 hover:bg-primary/80 rounded-md"
    >
      Admin Dashboard
    </Link>
  </div>
) : authenticatedUser ? (
  // Regular user view
  <div>
    <Link
      href={"/dashboard"}
      className="bg-primary text-white p-2 px-4 hover:bg-primary/80 rounded-md"
    >
       Dashboard
    </Link>
  </div>
) : (
  // Not authenticated view
  <div>
    <Link
      href={"/sign-in"}
      className="bg-primary text-white p-2 px-4 hover:bg-primary/80 rounded-md"
    >
      Login
    </Link>
  </div>
)}

        <UserButton afterSignOutUrl="/" />
        <ModeToggle />
      </aside>
    </div>
  );
};

export default Navbar;
