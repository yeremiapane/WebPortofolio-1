import React from "react";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CommentIcon from "@mui/icons-material/Comment";

const Sidebar = () => {
    const { pathname } = useLocation();

    const menuItems = [
        { name: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
        { name: "Articles", path: "/admin/articles", icon: <ArticleIcon /> },
        { name: "Certificates", path: "/admin/certificates", icon: <AssignmentIcon /> },
        { name: "Comments", path: "/admin/comments", icon: <CommentIcon /> },
    ];

    return (
        <div className="w-64 bg-white border-r shadow-md hidden md:flex flex-col">
            <div className="p-4 font-bold text-lg text-center border-b">
                Admin Panel
            </div>

            <div className="flex-1">
                {menuItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center px-4 py-3 hover:bg-gray-200 ${
                            pathname.startsWith(item.path) ? "bg-gray-100 font-semibold" : ""
                        }`}
                    >
                        <span className="mr-2 text-gray-700">{item.icon}</span>
                        {item.name}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
