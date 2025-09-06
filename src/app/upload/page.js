"use client";

import { useState, useEffect } from "react";
import { auth, googleProvider, clearIndexedDB } from "../firebaseConfig";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import ProjectUpload from "./components/projectUpload";
import BlogUpload from "./components/blogUpload";
import VlogUpload from "./components/vlogUpload";
import BackgroundUpload from "./components/backgroundUpload";

export default function UploadPage() {
  const [activeTab, setActiveTab] = useState("projects");
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState("");
  const [isClearingStorage, setIsClearingStorage] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthError(""); // Clear any previous errors
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      setAuthError("");
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Sign in successful:', result.user);
    } catch (error) {
      console.error('Sign in error:', error);
      
      // Handle specific error types
      if (error.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        setAuthError('Popup was blocked by your browser. Please allow popups for this site.');
      } else if (error.code === 'auth/network-request-failed') {
        setAuthError('Network error. Please check your connection and try again.');
      } else if (error.message?.includes('IndexedDB') || error.message?.includes('storage')) {
        setAuthError('Storage error detected. Try the "Clear Storage" button below or use incognito mode.');
      } else {
        setAuthError(`Sign-in failed: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setAuthError("");
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthError(`Sign-out failed: ${error.message}`);
    }
  };

  const handleClearStorage = async () => {
    setIsClearingStorage(true);
    try {
      await clearIndexedDB();
      setAuthError("Storage cleared successfully. Please try signing in again.");
    } catch (error) {
      console.error('Clear storage error:', error);
      setAuthError(`Failed to clear storage: ${error.message}`);
    } finally {
      setIsClearingStorage(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center mt-16">
        <div className="bg-gradient-to-b from-gray-800 to-zinc-950 rounded-3xl p-8 shadow-lg border border-gray-700 max-w-md w-full mx-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#F5ECD5] mb-6">Upload Content Here</h1>
            <p className="text-white mb-6">Sign in to access the upload page.</p>
            
            {/* Error Message */}
            {authError && (
              <div className="mb-4 p-4 bg-red-900/30 text-red-300 border border-red-700 rounded-lg text-sm">
                {authError}
              </div>
            )}
            
            <button
              onClick={handleSignIn}
              className="w-full bg-[#F5ECD5] text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-[#E6D4B8] transition-colors mb-3"
            >
              Sign in with Google
            </button>
            
            {/* Clear Storage Button */}
            <button
              onClick={handleClearStorage}
              disabled={isClearingStorage}
              className="w-full bg-slate-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isClearingStorage ? 'Clearing Storage...' : 'Clear Storage & Retry'}
            </button>
            
            <div className="mt-4 text-xs text-slate-400">
              If you're having trouble signing in, try the "Clear Storage" button above or use incognito mode.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user.email !== "nirvekpandey@gmail.com") {
    return (
      <div className="flex items-center justify-center mt-16">
        <div className="bg-gradient-to-b from-gray-800 to-zinc-950 rounded-3xl p-8 shadow-lg border border-gray-700 max-w-md w-full mx-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-500 mb-6">Unauthorized User</h1>
            <div className="text-center mb-6">
              <p className="text-white font-medium text-lg">{user.displayName || 'Unknown User'}</p>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
            
            {/* Error Message */}
            {authError && (
              <div className="mb-4 p-4 bg-red-900/30 text-red-300 border border-red-700 rounded-lg text-sm">
                {authError}
              </div>
            )}
            
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
    { id: "backgrounds", name: "Backgrounds", component: BackgroundUpload },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div>
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

        {/* Error Message */}
        {authError && (
          <div className="max-w-4xl mx-auto mb-4 p-4 bg-red-900/30 text-red-300 border border-red-700 rounded-lg text-sm">
            {authError}
          </div>
        )}

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