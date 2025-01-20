import React from "react";

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-700 py-4">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    &copy; {new Date().getFullYear()} Jihoo Kim. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
