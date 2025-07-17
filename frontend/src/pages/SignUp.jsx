import React, { useState } from "react";
import logo from "../images/logos/logo2.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../helper";
 import { toast } from 'react-toastify';

const SignUp = () => {
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const navigate = useNavigate();

const submitForm = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      API_BASE_URL + "/signup",
      {
        name: fullname,
        email: email,
        password: pwd,
      },
      {
        withCredentials: true,
      }
    );

    if (res.data?.success) {
      toast.success("Sign up successful!");
      setTimeout(() => navigate("/login"), 1000);
    } else {
      toast.error(res.data.message || "Sign up failed");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Something went wrong, try again!"
    );
  }
};

  return (
    <>
      <div className="con flex flex-col items-center justify-center min-h-screen bg-[url(./images\bg\bg.jpg)] bg-cover bg-center">
        <form
          onSubmit={submitForm}
          className="w-[80vw] max-w-md h-auto flex flex-col items-center  bg-[#0f0e0e]/80 backdrop-blur-none px-8 py-10 rounded-2xl shadow-2xl shadow-black/60 space-y-6"
        >
          <img
            src={logo}
            alt="InstantCode Logo"
            className="h-8 w-auto object-contain mb-10"
          />

          <input
            type="text"
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 rounded-md backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className="w-full px-4 py-2 rounded-md backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <button
            type="submit"
            className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300"
          >
            Sign Up
          </button>

          <p className="text-sm  text-white mt-2">
            Already have an account?{" "}
            <Link to={"/login"} className="text-blue-500 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default SignUp;
