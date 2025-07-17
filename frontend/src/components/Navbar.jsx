import React from "react";
import logo from "../images/logos/logo2.png";
import axios from "axios";
import { API_BASE_URL } from "../helper";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.post(
        API_BASE_URL + "/logout",
        {},
        {
          withCredentials: true,
        }
      );

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong, try again!"
      );
    }
  };

  return (
    <nav className="navbar bg-black text-white px-6 py-4 shadow-lg border-b border-gray-800">
      <div className="flex-1 flex items-center space-x-3">
        <img
          src={logo}
          alt="InstantCode Logo"
          className="h-8 w-auto object-contain"
        />
      </div>

      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 space-x-6">
          <li>
            <a className="hover:text-blue-500 transition duration-200 cursor-pointer">
              Home
            </a>
          </li>
          <li>
            <a className="hover:text-blue-500 transition duration-200 cursor-pointer">
              About
            </a>
          </li>
          <li>
            <a className="hover:text-blue-500 transition duration-200 cursor-pointer">
              Service
            </a>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold shadow hover:shadow-lg transition-all"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
