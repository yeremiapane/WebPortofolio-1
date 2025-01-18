import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayoutAccount from "../components/layouts/MainLayout";

// Import halaman admin
import Dashboard from "../pages/admin/Dashboard/Dashboard";
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
        <BrowserRouter >
            <Routes>
                <Route path="/" element={<DashboardLayoutAccount />}>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />

                    {/* Routes untuk Articles */}
                    <Route path="articles" element={<ArticleList />} />
                    <Route path="articles/create" element={<CreateArticle />} />
                    <Route path="articles/update/:id" element={<UpdateArticle />} />

                    {/* Routes untuk Certificates */}
                    <Route path="certificates" element={<CertificateList />} />
                    <Route path="certificates/create" element={<CreateCertificate />} />
                    <Route path="certificates/update/:id" element={<UpdateCertificate />} />

                    {/* Routes untuk Comments */}
                    <Route path="comments" element={<CommentList />} />
                    <Route path="comments/:id" element={<CommentDetail />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
