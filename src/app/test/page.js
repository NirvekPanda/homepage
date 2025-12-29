"use client";

import { useState, useEffect } from 'react';
import { 
    initializeBackgroundUpdater, 
    getCurrentBackground, 
    getImageCount,
    triggerBackgroundUpdate,
    triggerImageCountUpdate,
    stopBackgroundUpdater
} from '../utils/backgroundUpdater';

export default function TestPage() {
    const [backgroundUrl, setBackgroundUrl] = useState(null);
    const [imageCount, setImageCount] = useState(0);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        initializeBackgroundUpdater();
        setBackgroundUrl(getCurrentBackground());
        setImageCount(getImageCount());
        
        const originalLog = console.log;
        console.log = (...args) => {
            originalLog(...args);
            setLogs(prev => [...prev.slice(-9), args.join(' ')]);
        };
        
        return () => {
            console.log = originalLog;
            stopBackgroundUpdater();
        };
    }, []);

    const handleTriggerBackground = () => {
        triggerBackgroundUpdate();
        setBackgroundUrl(getCurrentBackground());
    };

    const handleTriggerCount = () => {
        triggerImageCountUpdate();
        setImageCount(getImageCount());
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Background System Test</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Current Background</h3>
                        {backgroundUrl ? (
                            <div className="space-y-2">
                                <img 
                                    src={backgroundUrl} 
                                    alt="Current background" 
                                    className="w-full max-w-sm h-32 object-cover rounded-lg"
                                />
                                <p className="text-sm text-gray-300 break-all">
                                    {backgroundUrl}
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-400">No background loaded</p>
                        )}
                    </div>
                    
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Image Count</h3>
                        <p className="text-2xl text-blue-400">{imageCount}</p>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg mb-8">
                    <h3 className="text-lg font-semibold mb-4">Manual Controls</h3>
                    <div className="space-x-4 mb-4">
                        <button
                            onClick={handleTriggerBackground}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                        >
                            Trigger Background Update
                        </button>
                        <button
                            onClick={handleTriggerCount}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
                        >
                            Trigger Count Update
                        </button>
                    </div>
                    <div className="text-sm text-gray-300">
                        <p><strong>Automatic Updates:</strong></p>
                        <p>• Image count: Every 10 minutes</p>
                        <p>• Background: On initialization only</p>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Console Logs</h3>
                    <div className="bg-gray-900 p-4 rounded-lg max-h-64 overflow-y-auto">
                        {logs.length === 0 ? (
                            <p className="text-gray-400">No logs yet...</p>
                        ) : (
                            logs.map((log, index) => (
                                <div key={index} className="text-sm text-gray-300 mb-1">
                                    {log}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
