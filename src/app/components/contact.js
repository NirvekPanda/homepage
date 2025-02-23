export default function ContactForm() {
    return (
        <div className="max-w-2xl mx-auto bg-gray-700 p-6 rounded-3xl shadow-lg text-white">
            <h2 className="text-3xl font-bold text-center mb-6 underline">Reach Out Below!</h2>

            <form className="flex flex-col gap-4">
                {/* Username Field */}
                <div>
                    <label htmlFor="username" className="block text-sm font-medium mb-2">
                        Username
                    </label>
                    <div className="flex items-center bg-gray-600 rounded-lg border border-gray-500">
                        <span className="inline-flex items-center px-3 text-sm text-gray-400">
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            id="username"
                            className="w-full bg-gray-600 border-none text-white focus:ring-blue-500 focus:border-blue-500 p-2.5 rounded-r-lg"
                            placeholder="Your Name"
                        />
                    </div>
                </div>

                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                                <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                                <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                            </svg>
                        </div>
                        <input
                            type="email"
                            id="email"
                            className="w-full bg-gray-600 border border-gray-500 text-white focus:ring-blue-500 focus:border-blue-500 p-2.5 rounded-lg ps-10"
                            placeholder="name@example.com"
                        />
                    </div>
                </div>

                {/* Phone Number Field */}
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Phone Number
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6.62 10.79a15.051 15.051 0 0 0 6.57 6.57l2.2-2.2a1 1 0 0 1 1.06-.24 10.02 10.02 0 0 0 3.15.51 1 1 0 0 1 1 1v3.35a1 1 0 0 1-1 1A18 18 0 0 1 3 5a1 1 0 0 1 1-1h3.35a1 1 0 0 1 1 1 10.02 10.02 0 0 0 .51 3.15 1 1 0 0 1-.24 1.06l-2.2 2.2Z" />
                            </svg>
                        </div>
                        <input
                            type="tel"
                            id="phone"
                            className="w-full bg-gray-600 border border-gray-500 text-white focus:ring-blue-500 focus:border-blue-500 p-2.5 rounded-lg ps-10"
                            placeholder="(123) 456-7890"
                        />
                    </div>
                </div>

                {/* Message Field */}
                <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message
                    </label>
                    <textarea
                        id="message"
                        rows="4"
                        className="w-full bg-gray-600 border border-gray-500 text-white focus:ring-blue-500 focus:border-blue-500 p-2.5 rounded-lg"
                        placeholder="Write your message here..."
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg mt-4 transition duration-300"
                >
                    Send Message
                </button>
            </form>
        </div>
    );
}
