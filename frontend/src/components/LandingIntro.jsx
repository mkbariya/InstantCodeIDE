import React from "react";

const LandingIntro = () => {
  return (
    <>
      <section className="px-6 py-24 text-center bg-black text-white min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Decorative Background Gradient Blur */}
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-blue-500 rounded-full blur-3xl opacity-20 z-0"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-purple-500 rounded-full blur-3xl opacity-20 z-0"></div>

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Welcome to <span className="text-blue-500">InstantCode</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-8">
            Instantly write, run, and share code in your favorite programming
            languages — all in one powerful web IDE.
          </p>

          <button className="px-6 py-3 rounded-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium text-lg transition-all duration-300 shadow-md hover:shadow-lg">
            Create Project
          </button>
        </div>
      </section>
    </>
  );
};

export default LandingIntro;
