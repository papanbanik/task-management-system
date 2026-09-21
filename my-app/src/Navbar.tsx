import React from "react";

const Navbar = () => {
  return (
    <nav className="md:1 flex items-center justify-between  rounded py-4 px-20 text-white shadow-2xl">
      <a href="/" className="text-xl font-semibold px-">
        TaskPortal
      </a>

      <a
        href="/AddTopic"
        className="bg-[#FFCE12] hover:bg-white text-black rounded-full px-4 mx-10 py-2"
      >
        Add New Task
      </a>
    </nav>
  );
};

export default Navbar;
