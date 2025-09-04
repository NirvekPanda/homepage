"use client";

import { useState, useEffect } from "react";
import { auth, googleProvider } from "../firebaseConfig";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import ProjectUpload from "./components/projectUpload";
import BlogUpload from "./components/blogUpload";
import VlogUpload from "./components/vlogUpload";

export default function UploadPage() {
  const [activeTab, setActiveTab] = useState("projects");
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, setUser);
  }, []);

  const handleSignIn = () => signInWithPopup(auth, googleProvider);
  const handleSignOut = () => signOut(auth);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-gradient-to-b from-gray-800 to-zinc-950 rounded-3xl p-8 shadow-lg border border-gray-700 max-w-md w-full mx-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#F5ECD5] mb-6">Upload Content Here</h1>
            <p className="text-white mb-6">Sign in to access the upload page.</p>
            <button
              onClick={handleSignIn}
              className="w-full bg-[#F5ECD5] text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-[#E6D4B8] transition-colors"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (user.email !== "nirvekpandey@gmail.com") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-gradient-to-b from-gray-800 to-zinc-950 rounded-3xl p-8 shadow-lg border border-gray-700 max-w-md w-full mx-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-500 mb-6">Unauthorized User</h1>
            <div className="text-center mb-6">
              <p className="text-white font-medium text-lg">{user.displayName || 'Unknown User'}</p>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "projects", name: "Projects", component: ProjectUpload },
    { id: "blogs", name: "Blogs", component: BlogUpload },
    { id: "vlogs", name: "Vlogs", component: VlogUpload },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <div className="text-center mb-6 mt-4">
          <h1 className="text-4xl font-bold text-[#F5ECD5] mb-4">Upload Content</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="bg-slate-800 rounded-lg p-1 flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-[#F5ECD5] text-gray-900 shadow-lg"
                    : "text-[#FFFAEC] hover:bg-slate-700"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-4xl mx-auto">
          {ActiveComponent && <ActiveComponent />}
        </div>

        <div className="text-center mt-6 mb-4">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-white font-medium text-lg">{user.displayName || 'User'}</p>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}