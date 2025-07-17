import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { API_BASE_URL } from "../helper";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const [isCreatedModel, setIsCreatedModel] = useState(false);
  const [isEditModelShow, setIsEditModelShow] = useState(false);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [projectName, setProjectName] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  const getRuntimes = async () => {
    let res = await fetch("https://emkc.org/api/v2/piston/runtimes");
    const data = await res.json();

    const filteredLanguage = [
      "javascript",
      "python",
      "java",
      "c++",
      "c",
      "go",
      "bash",
    ];
    const options = data
      .filter((runtimes) => filteredLanguage.includes(runtimes.language))
      .map((runtimes) => ({
        label: `${runtimes.language}(${runtimes.version})`,
        value: runtimes.language,
        version: runtimes.version,
      }));

    setLanguageOptions(options);
  };

  const handleProject = async () => {
    try {
      const res = await axios.post(
        API_BASE_URL + "/createproject",
        {
          name: projectName,
          projLanguage: selectedLanguage,
          version: selectedVersion,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data?.success) {
        toast.success("Project Created successfully!");
        setTimeout(() => navigate(`/editor/${res.data.project._id}`), 1000);
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong, try again!"
      );
    }
  };

  const handleEditProject = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/editproject/${selectedProjectId}`,
        {
          name: projectName,
          projLanguage: selectedLanguage,
          verion: selectedVersion,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Project updated successfully!");
        setIsEditModelShow(false);
        getProjects();
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const getProjects = async () => {
    try {
      const res = await axios.get(API_BASE_URL + "/getprojects", {
        withCredentials: true,
      });

      setProjects(res.data.projects);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  const deleteProject = async (id) => {
    try {
      if (confirm("Are You Sure You Want To Delete This Project?")) {
        await axios.delete(`${API_BASE_URL}/deleteproject/${id}`, {
          withCredentials: true,
        });

        toast.success("Project deleted successfully");

        getProjects();
      }
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to delete project");
    }
  };

  useEffect(() => {
    getRuntimes();
    getProjects();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(API_BASE_URL + "/verifyuser", {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (error) {
      console.error("User not authenticated");
    }
  };
  const LanguageImages = {
    javascript: "https://cdn-icons-png.freepik.com/512/5968/5968292.png",
    java: "https://images.seeklogo.com/logo-png/15/1/java-logo-png_seeklogo-158094.png",
    python: "https://images.icon-icons.com/112/PNG/512/python_18894.png",
    "c++": "https://cdn-icons-png.flaticon.com/512/6132/6132222.png",
    c: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUXlq0oluVp1sezj1iJYRJ3WnBfUavCO2xIw&s",
    bash: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQlh6K9vydVsMxyiTA1t7h8mZnJvdCiWHkOQ&s",
    go: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUTc3wwVFk4RrsQHsAafyJYQOkKwrb7WSIiQ&s",
  };

  return (
    <>
      <div className="min-h-screen w-full bg-black text-white">
        <Navbar />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 mx-6 p-6 bg-[#121212] rounded-2xl shadow-lg border border-gray-800">
          <h3 className="text-2xl font-bold">
            Hi 👋,{" "}
            <span className="text-blue-400">{user?.fullName || "User"}</span>
          </h3>
    
          <button
            onClick={() => setIsCreatedModel(true)}
            className="px-6 py-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            + Create New Project
          </button>
        </div>

        {projects ? (
          <div className="projects px-6 mt-10 space-y-6">
            {projects &&
              projects.map((project) => {
                return (
                  <div
                    key={project._id}
                    className="p-6 rounded-2xl  bg-[#181818] border border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6"
                  >
                    <div
                      className="flex items-center gap-6"
                      onClick={() => navigate(`/editor/${project._id}`)}
                    >
                      <img
                        className="w-20 h-20 rounded-lg object-contain bg-white p-2"
                        src={`${
                          LanguageImages[project.projLanguage.toLowerCase()]
                        }`}
                        alt="Project Language Icon"
                      />
                      <div>
                        <h3 className="text-2xl font-semibold">
                          {project.name}
                        </h3>
                        <p className="text-[16px] text-gray-400">
                          Created on:{" "}
                          {new Date(project.date).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setProjectName(project.name);
                          setSelectedLanguage(project.projLanguage);
                          setIsEditModelShow(true);
                          setSelectedProjectId(project._id);
                          setSelectedVersion(project.version);
                        }}
                        className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow hover:shadow-lg transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProject(project._id)}
                        className="px-5 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold shadow hover:shadow-lg transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <h1>No Projects Found</h1>
        )}
      </div>

      {isCreatedModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] p-4">
          <div className="bg-[#1c1c1c] rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in-down border border-gray-700">
            <button
              onClick={() => setIsCreatedModel(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold"
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold mb-6 text-center text-white">
              🚀 Create New Project
            </h3>

            <input
              type="text"
              placeholder="Project Name"
              className="w-full mb-4 px-4 py-3 rounded-md bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              onChange={(e) => setProjectName(e.target.value)}
            />

            <select
              value={selectedLanguage}
              onChange={(e) => {
                const lang = languageOptions.find(
                  (opt) => opt.value === e.target.value
                );
                setSelectedLanguage(lang.value);
                setSelectedVersion(lang.version);
              }}
              className="w-full mb-6 px-4 py-3 rounded-md bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            >
              <option value="">Select Language</option>
              {languageOptions.map((language) => (
                <option key={language.value} value={language.value}>
                  {language.label}
                </option>
              ))}
            </select>

            <button
              onClick={handleProject}
              className="w-full py-3 rounded-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              Create Project
            </button>
          </div>
        </div>
      )}

      {isEditModelShow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] p-4">
          <div className="bg-[#1c1c1c] rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in-down border border-gray-700">
            <button
              onClick={() => setIsEditModelShow(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold"
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold mb-6 text-center text-white">
              🚀 Edit Project
            </h3>

            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              className="w-full mb-4 px-4 py-3 rounded-md bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              onChange={(e) => setProjectName(e.target.value)}
            />

            <select
              value={selectedLanguage.toLowerCase()}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full mb-6 px-4 py-3 rounded-md bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            >
              <option value="">Select Language</option>
              {languageOptions.map((language) => (
                <option key={language.value} value={language.value}>
                  {language.label}
                </option>
              ))}
            </select>

            <button
              onClick={handleEditProject}
              className="w-full py-3 rounded-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              Update Project
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
