import React, { useState, useEffect } from "react";
import Navbar from "../../components/blog_reads/Navbar";
import BlogPost from "../../components/blog_reads/BlogPost";
import RelatedPosts from "../../components/blog_reads/RelatedPost";
import Footer from "../../components/blog_reads/Footer";

function BlogRead() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Toggle dark mode
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Cek preferensi dark mode di localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            setIsDarkMode(true);
        }
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            <BlogPost />
            <RelatedPosts />
            <Footer />
        </div>
    );
}

export default BlogRead;
