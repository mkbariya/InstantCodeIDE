import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../helper";
import axios from "axios";

const CodeEditor = () => {
  const { id } = useParams();
  const [project, setProject] = useState({});
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const languageMap = {
    javascript: "javascript",
    python: "python",
    java: "java",
    "c++": "cpp",
    c: "c",
    go: "go",
    bash: "shell",
  };

  
  const getProject = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/getproject/${id}`, {
        withCredentials: true,
      });
      setProject(res.data.project);
      setCode(res.data.project.code); 
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  }, [id]);

 
  const saveProject = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/saveproject`,
        { projectId: id, code },
        { withCredentials: true }
      );
      getProject(); 
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };


  const runProject = async () => {
    try {
      setOutput("");
      setError("");
      const res = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language: languageMap[project?.projLanguage?.toLowerCase()],
        version: project.version,
        files: [{ name: "main", content: code }],
      });

      const result = res.data.run;
      if (result.stderr) {
        setError(result.stderr);
      } else {
        setOutput(result.stdout);
      }
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      setError("Failed to execute code.");
    }
  };


  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveProject();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code]);

  useEffect(() => {
    getProject();
  }, [getProject]);

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <Navbar />
      <div className="flex justify-between">

        <div className="w-[50%]">
          <Editor
            value={code}
            onChange={(newCode) => setCode(newCode || "")}
            height="90vh"
            theme="vs-dark"
            language={languageMap[project?.projLanguage?.toLowerCase()] || "javascript"}
          />
        </div>


        <div className="w-[50%] h-full bg-black text-white">
          <div className="flex pb-2 p-2 border-b border-[#27272a] items-center justify-between px-8">
            <p className="p-3 font-semibold text-lg">Output</p>
            <button
              onClick={runProject}
              className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300"
            >
              Run
            </button>
          </div>

          <pre className="w-full h-[75vh] p-4 whitespace-pre-wrap overflow-y-auto">
            {error ? (
              <span className="text-red-500">{error}</span>
            ) : (
              <span className="text-green-400">{output}</span>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
