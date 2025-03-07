"use client";

import React, { useState } from 'react';
import { db } from "@/app/firebaseConfig";
import { ref, push, set } from "firebase/database";
import MessageSent from './messageSent';

async function addData(name, email, phone, message) {
    try {
        const newMessageRef = push(ref(db, "contact"));
        await set(newMessageRef, {
            name,
            email,
            phone,
            message,
            timestamp: Date.now()
        });
        console.log("Message sent successfully");
        return true;
    } catch (e) {
        console.error("Error adding message: ", e);
        return false;
    }
}

export default function ContactForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const isFormValid = name.trim() && email.trim() && phone.trim() && message.trim();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        const success = await addData(name, email, phone, message);
        if (success) {
            // Reset form fields
            setName("");
            setEmail("");
            setPhone("");
            setMessage("");

            // Show success message
            setIsSubmitted(true);

            // Auto-hide the message after 10 seconds
            setTimeout(() => setIsSubmitted(false), 10000);
        } else {
            alert("Failed to send message. Please try again.");
        }
    };

    var textArea = "w-full bg-gray-600 border border-gray-500 text-white focus:ring-blue-500 focus:border-blue-500 p-2.5 rounded-lg";

    return (
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-gray-800 to-zinc-950 p-6 rounded-3xl shadow-lg text-white">
            <h2 className="text-3xl font-bold text-center mb-4 mt-2 underline">Reach Out Below!</h2>

            {isSubmitted ? (
                <div className="flex justify-center items-center h-40">
                    <MessageSent />
                </div>
            ) : (
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className={textArea}
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className={textArea}
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Phone Number Field */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            className={textArea}
                            placeholder="(123) 456-7890"
                            value={phone}
                            onChange={(e) => {
                                let input = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                                if (input.length > 10) input = input.slice(0, 10); // Limit to 10 digits

                                let formatted = input;
                                if (input.length > 6) {
                                    formatted = `(${input.slice(0, 3)}) ${input.slice(3, 6)} - ${input.slice(6)}`;
                                } else if (input.length > 3) {
                                    formatted = `(${input.slice(0, 3)}) ${input.slice(3)}`;
                                } else if (input.length > 0) {
                                    formatted = `(${input}`;
                                }

                                setPhone(formatted);
                            }}
                        />
                    </div>

                    {/* Message Field */}
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                            Message
                        </label>
                        <textarea
                            id="message"
                            rows="4"
                            className={textArea}
                            placeholder="Write your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`w-full font-bold py-2 px-4 rounded-lg mt-4 transition duration-300 ${isFormValid
                            ? "bg-gray-900 hover:bg-gray-700 text-white"
                            : "bg-gray-500 text-gray-300 cursor-not-allowed"
                            }`}
                        disabled={!isFormValid}
                    >
                        Send Message
                    </button>
                </form>
            )}
        </div>
    );
}
