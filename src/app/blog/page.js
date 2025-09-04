"use client";

import { usePathname } from "next/navigation";
import LinkButton from "../components/button";
import { useState, useEffect } from "react";
import { firestore } from "../firebaseConfig";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import BlogCard from "../components/blogCard";
import Footer from "../components/footer";

function BlogList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const path = usePathname();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsCollection = collection(firestore, "blogs");
                const querySnapshot = await getDocs(postsCollection);

                const postsArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Filter and sort on the client side to avoid Firestore index requirements
                const filteredAndSortedPosts = postsArray
                    .filter(post => post.published === true)
                    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

                setPosts(filteredAndSortedPosts);
            } catch (error) {
                console.error("Error fetching blog posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen">
            <div className="flex flex-col items-center">
                <div className="text-center mb-6 mt-8">
                    <div className="mb-6">
                        <a
                            href="/upload"
                            className="px-6 py-3 rounded-md font-medium transition-all duration-200 bg-[#F5ECD5] text-gray-900 shadow-lg hover:bg-[#E6D4B8]"
                        >
                            Upload
                        </a>
                    </div>

                    <p className="text-xl text-[#FFFAEC]">
                        updates on my life, projects, school work, and whatever else comes to mind:
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="text-center text-gray-500 mt-2 mb-6 text-xl">
                    Loading Posts...
                </div>
            ) : (
                <div className="px-4 flex flex-wrap justify-center items-center w-[80%] max-w-[1200px] mx-auto">
                    {posts.length > 0 ? (
                        posts.map((post, index) => (
                            <div key={index} className="p-2 w-full flex justify-center sm:w-1/2 md:w-1/2 lg:w-1/3">
                                <div className="w-full max-w-sm">
                                    <BlogCard
                                        title={post.title}
                                        excerpt={post.excerpt}
                                        publishedAt={post.publishedAt}
                                        slug={post.slug}
                                        content={post.content}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 mt-4">
                            No blog posts published yet.
                        </div>
                    )}
                </div>
            )}
            
            <Footer />
        </div>
    );
}

export default BlogList;
