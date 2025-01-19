import React from "react";

export default function Dashboard() {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

            {/* Contoh ringkas: menampilkan summary atau quick stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold text-gray-500">Total Articles</h3>
                    <p className="text-2xl font-bold">120</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold text-gray-500">Total Certificates</h3>
                    <p className="text-2xl font-bold">45</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold text-gray-500">Total Comments</h3>
                    <p className="text-2xl font-bold">237</p>
                </div>
            </div>

            {/* Tabel ringkas Article */}
            <div className="bg-white p-4 rounded shadow mb-6">
                <h3 className="font-semibold mb-2">Recent Published Articles</h3>
                <table className="min-w-full text-sm">
                    <thead>
                    <tr className="border-b">
                        <th className="py-2 px-2 text-left">ID</th>
                        <th className="py-2 px-2 text-left">Title</th>
                        <th className="py-2 px-2 text-left">Publisher</th>
                        <th className="py-2 px-2 text-left">Published At</th>
                        <th className="py-2 px-2 text-left">View Count</th>
                        <th className="py-2 px-2 text-left">Reading Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* Loop data */}
                    <tr>
                        <td className="py-2 px-2">1</td>
                        <td className="py-2 px-2">Artikel Pertama</td>
                        <td className="py-2 px-2">Admin</td>
                        <td className="py-2 px-2">2025-01-16</td>
                        <td className="py-2 px-2">100</td>
                        <td className="py-2 px-2">5 min</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* Tabel ringkas Certificate */}
            <div className="bg-white p-4 rounded shadow mb-6">
                <h3 className="font-semibold mb-2">Recent Published Certificates</h3>
                <table className="min-w-full text-sm">
                    <thead>
                    <tr className="border-b">
                        <th className="py-2 px-2 text-left">ID</th>
                        <th className="py-2 px-2 text-left">Title</th>
                        <th className="py-2 px-2 text-left">Publisher</th>
                        <th className="py-2 px-2 text-left">Published At</th>
                        <th className="py-2 px-2 text-left">Start Date</th>
                        <th className="py-2 px-2 text-left">End Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="py-2 px-2">1</td>
                        <td className="py-2 px-2">React Basics</td>
                        <td className="py-2 px-2">Admin</td>
                        <td className="py-2 px-2">2025-01-15</td>
                        <td className="py-2 px-2">2025-01-10</td>
                        <td className="py-2 px-2">2025-12-31</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* Tabel ringkas Comments */}
            <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-2">Recent Comments</h3>
                <table className="min-w-full text-sm">
                    <thead>
                    <tr className="border-b">
                        <th className="py-2 px-2 text-left">ID Comment</th>
                        <th className="py-2 px-2 text-left">Article ID</th>
                        <th className="py-2 px-2 text-left">Title Article</th>
                        <th className="py-2 px-2 text-left">Name</th>
                        <th className="py-2 px-2 text-left">Email</th>
                        <th className="py-2 px-2 text-left">Comment</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="py-2 px-2">1</td>
                        <td className="py-2 px-2">12</td>
                        <td className="py-2 px-2">Artikel Pertama</td>
                        <td className="py-2 px-2">John Doe</td>
                        <td className="py-2 px-2">john@example.com</td>
                        <td className="py-2 px-2">Nice article!</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
