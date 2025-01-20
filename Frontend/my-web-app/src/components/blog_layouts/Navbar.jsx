import React, { useState } from "react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        alert(`Mencari: ${searchValue}`);
        // Di sini Anda bisa menambahkan logika pencarian sebenarnya
    };

    return (
        <nav className="bg-blue-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo / Brand */}
                    <div className="flex-shrink-0">
                        <a href="/" className="text-2xl font-bold">
                            BLOGGA
                        </a>
                    </div>
                    {/* Menu */}
                    <div className="hidden md:flex space-x-4 items-center">
                        <a
                            href="#"
                            className="hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Design Tools
                        </a>
                        <a
                            href="#"
                            className="hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Daily Updates
                        </a>
                        <a
                            href="#"
                            className="hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Tutorials
                        </a>
                        <a
                            href="#"
                            className="hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Library
                        </a>
                        {/* Form Search */}
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="rounded-md px-2 py-1 text-black"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="absolute right-0 top-0 bottom-0 px-2 text-black"
                            >
                            </button>
                        </form>
                        {/* Subscribe Button */}
                        <button className="bg-gray-100 text-blue-900 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-semibold">
                            Subscribe
                        </button>
                    </div>
                    {/* Hamburger Icon - Mobile */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="focus:outline-none">
                            <svg
                                className="h-6 w-6 fill-current"
                                viewBox="0 0 24 24"
                            >
                                {isOpen ? (
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M4 5h16v2H4V5zm0 12h16v2H4v-2z"
                                    />
                                ) : (
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M4 5h16v2H4V5zm0 12h16v2H4v-2z"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Dropdown Menu - Mobile */}
            {isOpen && (
                <div className="md:hidden bg-blue-800">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <a
                            href="#"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                        >
                            Design Tools
                        </a>
                        <a
                            href="#"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                        >
                            Daily Updates
                        </a>
                        <a
                            href="#"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                        >
                            Tutorials
                        </a>
                        <a
                            href="#"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                        >
                            Library
                        </a>
                        {/* Form Search Mobile */}
                        <form onSubmit={handleSearch} className="relative mb-2 px-3">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="rounded-md px-2 py-1 text-black w-full"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="absolute right-4 top-0 bottom-0 text-black"
                            >
                                🔍
                            </button>
                        </form>
                        {/* Subscribe Button */}
                        <button className="bg-gray-100 text-blue-900 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-semibold w-full">
                            Subscribe
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
