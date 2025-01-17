import React, { useState } from "react";
import { Link } from "react-router-dom";
import CustomAlert from "../../../components/ui/CustomAlerts.jsx"

// Dummy data
const dummyArticles = [
    {
        id: 1,
        title: "Mengenal React",
        publisher: "Admin",
        publishedAt: "2025-01-15",
        viewCount: 234,
        readingTime: "6 min",
    },
    {
        id: 2,
        title: "Belajar Tailwindcss",
        publisher: "Admin",
        publishedAt: "2025-01-16",
        viewCount: 120,
        readingTime: "4 min",
    },
];

export default function ArticleList() {
    const [search, setSearch] = useState("");
    const [articles, setArticles] = useState(dummyArticles);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const filteredArticles = articles.filter((article) =>
        article.title.toLowerCase().includes(search.toLowerCase())
    );

    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("success");

    const handleDelete = (id) => {
        const newData = articles.filter((a) => a.id !== id);
        setArticles(newData);

        setAlertMessage(`Article with ID ${id} deleted successfully.`);
        setAlertSeverity("info");

        // Lalu atur timer untuk hide alert
        setTimeout(() => setAlertMessage(""), 3000);
    };

    return (
        <div>
            {alertMessage && (
                <CustomAlert
                    severity={alertSeverity}
                    message={alertMessage}
                    onClose={() => setAlertMessage("")}
                />
            )}

            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Published Articles</h2>
                <Link
                    to="/articles/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Create Article
                </Link>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    className="border px-3 py-2 rounded w-full md:w-1/2"
                    placeholder="Search article..."
                    value={search}
                    onChange={handleSearch}
                />
            </div>

            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full text-sm">
                    <thead className="border-b bg-gray-50">
                    <tr>
                        <th className="py-2 px-2 text-left">ID</th>
                        <th className="py-2 px-2 text-left">Title</th>
                        <th className="py-2 px-2 text-left">Publisher</th>
                        <th className="py-2 px-2 text-left">Published At</th>
                        <th className="py-2 px-2 text-left">View Count</th>
                        <th className="py-2 px-2 text-left">Reading Time</th>
                        <th className="py-2 px-2 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredArticles.map((article) => (
                        <tr key={article.id} className="border-b hover:bg-gray-100">
                            <td className="py-2 px-2">{article.id}</td>
                            <td className="py-2 px-2">{article.title}</td>
                            <td className="py-2 px-2">{article.publisher}</td>
                            <td className="py-2 px-2">{article.publishedAt}</td>
                            <td className="py-2 px-2">{article.viewCount}</td>
                            <td className="py-2 px-2">{article.readingTime}</td>
                            <td className="py-2 px-2 flex gap-2">
                                <Link
                                    to={`/articles/update/${article.id}`}
                                    className="px-8 py-4 rounded hover:bg-yellow-600"
                                >
                                    Update
                                </Link>
                                <button
                                    onClick={() => handleDelete(article.id)}
                                    className="rounded hover:bg-red-600"
                                    variant="outlined"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}

                    {filteredArticles.length === 0 && (
                        <tr>
                            <td colSpan="7" className="text-center py-4">
                                No articles found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
