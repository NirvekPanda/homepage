"use client";
import React from 'react';
import Footer from '../components/footer';
import { useTheme } from '../contexts/ThemeContext';


const Calendar = () => {
    const { isDarkMode } = useTheme();

    return (
        <>
        <div className="flex flex-col items-center justify-start pt-6 pb-4">
            <iframe src="https://calendar.google.com/calendar/embed?src=nipandey%40ucsd.edu&ctz=America%2FLos_Angeles" 
                style={{border: 0, width: '70%', maxWidth: '100%'}} 
                height="600" 
                className={isDarkMode ? 'invert hue-rotate-180' : ''}

                >
            </iframe>
            
        </div>
        {/* <Footer /> */}
        </>
    );
};

export default Calendar;
