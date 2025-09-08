"use client";

import { usePathname } from "next/navigation";
import LinkButton from "../components/button";
import { useState, useEffect } from "react";
import { firestore } from "../firebaseConfig";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import ThreeDCarousel from "../components/ThreeDCarousel";
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
        <div>
            <div className="flex flex-col items-center">
                <div className="text-center mt-9 mb-6">
                        <a
                            href="/upload"
                            className="px-6 py-3 rounded-md font-medium transition-all duration-200 bg-[#F5ECD5] text-gray-900 shadow-lg hover:bg-[#E6D4B8]"
                        >
                            Upload
                        </a>
                    </div>
            </div>

            {loading ? (
                <div className="text-center text-gray-500 mt-2 mb-4 text-xl">
                    Loading Posts...
                </div>
            ) : posts.length > 0 ? (
                <ThreeDCarousel
                    items={posts.map((post, index) => ({
                        id: post.id || index,
                        title: post.title,
                        brand: "Blog Post",
                        description: post.excerpt,
                        tags: [], // Blog posts don't have language tags like projects
                        imageUrl: `/blog-images/${post.slug}.jpg`,
                        link: "#", // Blog posts don't have external links
                        github: null,
                        demo: null,
                        // Store original blog data for modal
                        content: post.content,
                        slug: post.slug,
                        publishedAt: post.publishedAt,
                        excerpt: post.excerpt
                    }))}
                    autoRotate={true}
                    rotateInterval={6000}
                    cardHeight={400}
                    contentType="blog"
                />
            ) : (
                <div className="text-center text-gray-500 mt-4">
                    No blog posts published yet.
                </div>
            )}
            
            <Footer />
        </div>
    );
}

export default BlogList;
