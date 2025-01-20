import React from "react";
import Navbar from "../../components/blog_layouts/Navbar";
import Hero from "../../components/blog_layouts/Hero";
import ArticleList from "../../components/blog_layouts/Article_List";
import Footer from "../../components/blog_layouts/Footer";

function BlogApp() {
    return (
        <div className="font-sans">
            <Navbar />
            <Hero />
            <ArticleList />
            <Footer />
        </div>
    );
}

export default BlogApp;
