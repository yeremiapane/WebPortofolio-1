import React from "react";
import MenuIcon from "@mui/icons-material/Menu";

const Topbar = () => {
    // Toggle sidebar mobile version dsb. (opsional)
    return (
        <div className="flex items-center justify-between bg-white px-4 py-2 shadow">
            <div className="flex items-center">
                <button className="md:hidden p-2">
                    <MenuIcon />
                </button>
                <h1 className="ml-2 font-bold text-lg">Admin Dashboard</h1>
            </div>
            <div>
                {/* Bisa diisi user profile, notifikasi, dsb. */}
                <span className="text-gray-600">Hello, Admin!</span>
            </div>
        </div>
    );
};

export default Topbar;
