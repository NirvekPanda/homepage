"use client";

import { useState, useEffect, useRef } from "react";
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
  const [loginFailed, setLoginFailed] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const tabRefs = useRef([]);

  const tabs = [
    { id: "projects", name: "Projects", component: ProjectUpload },
    { id: "blogs", name: "Blogs", component: BlogUpload },
    { id: "vlogs", name: "Vlogs", component: VlogUpload },
    { id: "backgrounds", name: "Backgrounds", component: BackgroundUpload },
  ];

  const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthError("");
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (activeTabIndex >= 0 && tabRefs.current[activeTabIndex]) {
      const activeEl = tabRefs.current[activeTabIndex];
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        opacity: 1,
      });
    }
  }, [activeTab, activeTabIndex]);

  const handleSignIn = async () => {
    try {
      setAuthError("");
      setLoginFailed(false);
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Sign in successful:', result.user);
    } catch (error) {
      console.error('Sign in error:', error);
      setLoginFailed(true);
      
      if (error.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        setAuthError('Popup was blocked by your browser. Please allow popups for this site.');
      } else if (error.code === 'auth/network-request-failed') {
        setAuthError('Network error. Please check your connection and try again.');
      } else if (error.message?.includes('IndexedDB') || error.message?.includes('storage')) {
        setAuthError('Storage error detected. Clearing storage automatically...');
        try {
          await clearIndexedDB();
          setAuthError('Storage cleared successfully. Please try signing in again.');
        } catch (clearError) {
          console.error('Auto clear storage error:', clearError);
          setAuthError('Storage error detected. Please try using incognito mode.');
        }
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


  if (!user) {
    return (
      <div className="flex items-center justify-center mt-16">
        <div className="bg-white/25 dark:bg-black/25 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-white/30 dark:border-gray-700/30 max-w-md w-full mx-4 transition-all duration-200">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-200">Upload Content Here</h1>
            
            {authError && (
              <div className="mb-4 p-4 bg-red-500/20 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-400/50 dark:border-red-700 rounded-lg text-sm transition-colors duration-200">
                {authError}
              </div>
            )}
            
            <button
              onClick={handleSignIn}
              className="w-full bg-white/90 dark:bg-slate-700 text-gray-900 dark:text-white py-3 px-6 rounded-lg font-semibold hover:bg-white dark:hover:bg-slate-600 shadow-lg transition-all duration-200"
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
      <div className="flex items-center justify-center mt-16">
        <div className="bg-white/25 dark:bg-black/25 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-white/30 dark:border-gray-700/30 max-w-md w-full mx-4 transition-all duration-200">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600 dark:text-red-500 mb-6 transition-colors duration-200">Unauthorized User</h1>
            <div className="text-center mb-6">
              <p className="text-gray-900 dark:text-white font-medium text-lg transition-colors duration-200">{user.displayName || 'Unknown User'}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-200">{user.email}</p>
            </div>
            
            {authError && (
              <div className="mb-4 p-4 bg-red-500/20 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-400/50 dark:border-red-700 rounded-lg text-sm transition-colors duration-200">
                {authError}
              </div>
            )}
            
            <button
              onClick={handleSignOut}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div>
      <div className="container mx-auto px-4 py-4">
        <div className="text-center mb-6 mt-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Upload Content</h1>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative bg-white/25 dark:bg-black/25 backdrop-blur-sm rounded-lg p-1 flex space-x-1 border border-white/30 dark:border-gray-700/30 transition-all duration-200">
            <div
              className="absolute top-1 bottom-1 bg-white/90 dark:bg-black/50 dark:border dark:border-gray-600/50 rounded-md shadow-lg transition-all duration-300 ease-in-out"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity,
              }}
            />
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                ref={(el) => (tabRefs.current[index] = el)}
                onClick={() => setActiveTab(tab.id)}
                className={`relative z-10 px-6 py-3 rounded-md font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? "text-gray-900 dark:text-white"
                    : "text-black dark:text-white hover:bg-white/40 dark:hover:bg-black/40"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {ActiveComponent && <ActiveComponent />}
        </div>

        {authError && (
          <div className="max-w-4xl mx-auto mb-4 p-4 bg-red-500/20 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-400/50 dark:border-red-700 rounded-lg text-sm transition-colors duration-200">
            {authError}
          </div>
        )}

        <div className="text-center mt-6 mb-4">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-gray-900 dark:text-white font-medium text-lg transition-colors duration-200">{user.displayName || 'User'}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-200">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}