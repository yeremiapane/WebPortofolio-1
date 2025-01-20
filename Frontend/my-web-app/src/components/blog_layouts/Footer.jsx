import React from "react";

const Footer = () => {
    return (
        <footer className="bg-blue-900 text-white py-6 mt-8">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} BLOGGA. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
