import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
// import PublicLayout from "../components/layouts/PublicLayout";
import MainLayout from "../components/layouts/MainLayout";

// Public Pages
import App from "../pages/user/App.jsx";
import BlogApp from "../pages/blogs/BlogApp";
import BlogRead from "../pages/blogs/BlogRead";
// Auth Pages
// import Login from "../pages/Login";
// import Register from "../pages/Register";

// Admin Pages
import DashboardLayouts from "../pages/admin/Dashboard/Dashboard";
import ArticleList from "../pages/admin/Articles/ArticleList";
import CreateArticle from "../pages/admin/Articles/CreateArticle";
import UpdateArticle from "../pages/admin/Articles/UpdateArticle";
import CertificateList from "../pages/admin/Certificates/CertificateList";
import CreateCertificate from "../pages/admin/Certificates/CreateCertificate";
import UpdateCertificate from "../pages/admin/Certificates/UpdateCertificate";
import CommentList from "../pages/admin/Comments/CommentList";
import CommentDetail from "../pages/admin/Comments/CommentDetail";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rute publik dengan layout umum */}
                {/*<Route element={<PublicLayout />}>*/}
                <Route path="/" element={<App />} />
                <Route path="/blog" element={<BlogApp />} />
                <Route path="/blog/read" element={<BlogRead />} />
                {/*</Route>*/}

                {/*/!* Rute autentikasi *!/*/}
                {/*<Route path="/login" element={<Login />} />*/}
                {/*<Route path="/register" element={<Register />} />*/}

                {/* Rute admin dengan layout khusus */}
                <Route path="/admin" element={<MainLayout />}>
                    <Route index element={<DashboardLayouts />} />
                    <Route path="dashboard" element={<DashboardLayouts />} />

                    {/* Article routes */}
                    <Route path="articles" element={<ArticleList />} />
                    <Route path="articles/create" element={<CreateArticle />} />
                    <Route path="articles/update/:id" element={<UpdateArticle />} />

                    {/* Certificate routes */}
                    <Route path="certificates" element={<CertificateList />} />
                    <Route path="certificates/create" element={<CreateCertificate />} />
                    <Route path="certificates/update/:id" element={<UpdateCertificate />} />

                    {/* Comments routes */}
                    <Route path="comments" element={<CommentList />} />
                    <Route path="comments/:id" element={<CommentDetail />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
