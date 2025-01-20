import React, { useState } from "react";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const Navbar = ({ isDarkMode, toggleDarkMode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        alert(`Mencari: ${searchValue}`);
        // Ganti dengan logika pencarian sebenarnya jika diinginkan
    };

    return (
        <nav className="bg-white dark:bg-gray-900 border-b dark:border-gray-700">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Brand */}
                    <div className="flex-shrink-0 text-xl font-bold">
                        <a href="/" className="block py-2">
                            BLOGGA
                        </a>
                    </div>
                    {/* Menu besar (desktop) */}
                    <div className="hidden md:flex items-center space-x-6">
                        <a href="#blog" className="hover:text-blue-500 dark:hover:text-blue-400">
                            Blog
                        </a>
                        <a href="#about" className="hover:text-blue-500 dark:hover:text-blue-400">
                            About
                        </a>
                        <a href="#contact" className="hover:text-blue-500 dark:hover:text-blue-400">
                            Contact
                        </a>
                        <a href="#projects" className="hover:text-blue-500 dark:hover:text-blue-400">
                            Projects
                        </a>
                    </div>
                    {/* Hamburger (mobile) */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="focus:outline-none text-gray-600 dark:text-gray-200"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {isOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {/* Menu Mobile */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-700">
                    <div className="px-2 py-3 space-y-1">
                        <a
                            href="#blog"
                            className="block px-3 py-2 hover:text-blue-500 dark:hover:text-blue-400"
                        >
                            Blog
                        </a>
                        <a
                            href="#about"
                            className="block px-3 py-2 hover:text-blue-500 dark:hover:text-blue-400"
                        >
                            About
                        </a>
                        <a
                            href="#contact"
                            className="block px-3 py-2 hover:text-blue-500 dark:hover:text-blue-400"
                        >
                            Contact
                        </a>
                        <a
                            href="#projects"
                            className="block px-3 py-2 hover:text-blue-500 dark:hover:text-blue-400"
                        >
                            Projects
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
