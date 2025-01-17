import React, { useState } from "react";
import { Link } from "react-router-dom";

const dummyComments = [
    {
        id: 1,
        articleId: 2,
        articleTitle: "Belajar Tailwindcss",
        name: "John Doe",
        email: "john@example.com",
        comment: "Mantap sekali!",
        publishComment: true,
    },
    {
        id: 2,
        articleId: 1,
        articleTitle: "Mengenal React",
        name: null,
        email: null,
        comment: "Nice article, thanks!",
        publishComment: true,
    },
];

export default function CommentList() {
    const [search, setSearch] = useState("");
    const [comments, setComments] = useState(dummyComments);

    const filteredComments = comments.filter((c) =>
        c.comment.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Comments List</h2>
            <div className="mb-4">
                <input
                    type="text"
                    className="border px-3 py-2 rounded w-full md:w-1/2"
                    placeholder="Search comment..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full text-sm">
                    <thead className="border-b bg-gray-50">
                    <tr>
                        <th className="py-2 px-2 text-left">ID Comment</th>
                        <th className="py-2 px-2 text-left">ID Article</th>
                        <th className="py-2 px-2 text-left">Title Article</th>
                        <th className="py-2 px-2 text-left">Name</th>
                        <th className="py-2 px-2 text-left">Email</th>
                        <th className="py-2 px-2 text-left">Comment</th>
                        <th className="py-2 px-2 text-left">Publish Comment</th>
                        <th className="py-2 px-2 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredComments.map((c) => (
                        <tr key={c.id} className="border-b hover:bg-gray-100">
                            <td className="py-2 px-2">{c.id}</td>
                            <td className="py-2 px-2">{c.articleId}</td>
                            <td className="py-2 px-2">{c.articleTitle}</td>
                            <td className="py-2 px-2">{c.name || "Anonym"}</td>
                            <td className="py-2 px-2">{c.email || "-"}</td>
                            <td className="py-2 px-2">{c.comment}</td>
                            <td className="py-2 px-2">
                                {c.publishComment ? "Published" : "Unpublished"}
                            </td>
                            <td className="py-2 px-2 flex gap-2">
                                <Link
                                    to={`/comments/${c.id}`}
                                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                >
                                    Detail
                                </Link>
                            </td>
                        </tr>
                    ))}

                    {filteredComments.length === 0 && (
                        <tr>
                            <td colSpan="8" className="text-center py-4">
                                No comments found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
