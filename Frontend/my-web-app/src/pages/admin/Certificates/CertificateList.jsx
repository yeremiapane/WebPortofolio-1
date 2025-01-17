import React, { useState } from "react";
import { Link } from "react-router-dom";

const dummyCertificates = [
    {
        id: 1,
        title: "Front-End Development",
        publisher: "Admin",
        publishedAt: "2025-01-01",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
    },
];

export default function CertificateList() {
    const [search, setSearch] = useState("");
    const [certificates, setCertificates] = useState(dummyCertificates);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const filteredData = certificates.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id) => {
        const newData = certificates.filter((c) => c.id !== id);
        setCertificates(newData);
        alert(`Certificate with ID ${id} deleted!`);
    };

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Published Certificates</h2>
                <Link
                    to="/certificates/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Create Certificate
                </Link>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    className="border px-3 py-2 rounded w-full md:w-1/2"
                    placeholder="Search certificate..."
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
                        <th className="py-2 px-2 text-left">Start Date</th>
                        <th className="py-2 px-2 text-left">End Date</th>
                        <th className="py-2 px-2 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredData.map((cert) => (
                        <tr key={cert.id} className="border-b hover:bg-gray-100">
                            <td className="py-2 px-2">{cert.id}</td>
                            <td className="py-2 px-2">{cert.title}</td>
                            <td className="py-2 px-2">{cert.publisher}</td>
                            <td className="py-2 px-2">{cert.publishedAt}</td>
                            <td className="py-2 px-2">{cert.startDate}</td>
                            <td className="py-2 px-2">{cert.endDate}</td>
                            <td className="py-2 px-2 flex gap-2">
                                <Link
                                    to={`/certificates/update/${cert.id}`}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                >
                                    Update
                                </Link>
                                <button
                                    onClick={() => handleDelete(cert.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}

                    {filteredData.length === 0 && (
                        <tr>
                            <td colSpan="7" className="text-center py-4">
                                No certificates found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
