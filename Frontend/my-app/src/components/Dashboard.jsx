import React, { useState, useEffect } from "react";

/**
 * Contoh data mock
 * (Silakan ganti dengan data nyata dari API / database Anda)
 */
const articles = [
  {
    id: 1,
    title: "Belajar React Dasar",
    publishDate: "2025-01-01",
    author: "John Doe",
    commentsCount: 10,
    readTime: "5 min",
  },
  {
    id: 2,
    title: "Tips Tailwind CSS",
    publishDate: "2025-01-05",
    author: "Jane Smith",
    commentsCount: 8,
    readTime: "4 min",
  },
  {
    id: 3,
    title: "Meningkatkan Performa React",
    publishDate: "2025-01-10",
    author: "Alex Johnson",
    commentsCount: 15,
    readTime: "7 min",
  },
];

const certificates = [
  {
    id: 1,
    title: "Cert React Beginner",
    publishDate: "2025-01-02",
  },
  {
    id: 2,
    title: "Cert Advanced React",
    publishDate: "2025-01-06",
  },
];

const comments = [
  {
    id: 1,
    articleId: 1,
    articleTitle: "Belajar React Dasar",
    name: "User A",
    email: "userA@example.com",
    comment: "Artikel ini sangat bermanfaat!",
    publishDate: "2025-01-03",
  },
  {
    id: 2,
    articleId: 1,
    articleTitle: "Belajar React Dasar",
    name: "User B",
    email: "userB@example.com",
    comment: "Terima kasih atas informasinya.",
    publishDate: "2025-01-04",
  },
  {
    id: 3,
    articleId: 2,
    articleTitle: "Tips Tailwind CSS",
    name: "User C",
    email: "userC@example.com",
    comment: "Mantap, langsung praktik nih!",
    publishDate: "2025-01-07",
  },
];

/**
 * Komponen Toast
 * - Menampilkan notifikasi “mengambang” di pojok kanan atas
 * - Menerima props:
 *    - message: string pesan yang ingin ditampilkan
 *    - type: "success" | "error" | "info" (untuk warna border/latar berbeda)
 *    - show: boolean, apakah toast ditampilkan atau tidak
 * - Menggunakan animasi transition dengan Tailwind
 */
function Toast({ message, type = "info", show }) {
  if (!show) return null;

  let bgColor = "bg-blue-100 border-blue-400 text-blue-700";
  if (type === "success") bgColor = "bg-green-100 border-green-500 text-green-700";
  if (type === "error") bgColor = "bg-red-100 border-red-500 text-red-700";

  return (
    <div
      className={`
        fixed top-5 right-5
        w-80 p-4 mb-4 border-l-4 rounded shadow-lg
        transition transform duration-300
        ${bgColor}
      `}
      style={{
        animation: "fadeInDown 0.5s ease-out",
      }}
    >
      <p className="font-semibold">{message}</p>
    </div>
  );
}

function Dashboard() {
  // State untuk menampilkan toast
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info");
  const [showToast, setShowToast] = useState(false);

  /**
   * Ketika `showToast` = true, toast akan tampil.
   * Kita set timer untuk auto-hide dalam 2 detik (bisa disesuaikan).
   */
  useEffect(() => {
    let timer;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showToast]);

  /**
   * Helper function untuk menampilkan toast
   */
  const triggerToast = (message, type = "info") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  /**
   * Fungsi-fungsi handler untuk aksi edit, delete, approve, reject
   * (Sementara hanya menampilkan toast)
   */
  const handleEditArticle = (id) => {
    triggerToast(`Edit article dengan id = ${id}`, "info");
  };

  const handleDeleteArticle = (id) => {
    triggerToast(`Delete article dengan id = ${id}`, "error");
  };

  const handleEditCertificate = (id) => {
    triggerToast(`Edit certificate dengan id = ${id}`, "info");
  };

  const handleDeleteCertificate = (id) => {
    triggerToast(`Delete certificate dengan id = ${id}`, "error");
  };

  const handleApproveComment = (id) => {
    triggerToast(`Approve comment dengan id = ${id}`, "success");
  };

  const handleRejectComment = (id) => {
    triggerToast(`Reject comment dengan id = ${id}`, "error");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Toast untuk notifikasi */}
      <Toast message={toastMessage} type={toastType} show={showToast} />

      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>

      {/* Section: Articles */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">List Articles (Published)</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">ID</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Title
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Publish Date
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Author
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Comments
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Read Time
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b border-gray-200">
                    {article.id}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {article.title}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {article.publishDate}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {article.author}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {article.commentsCount}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {article.readTime}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    <button
                      onClick={() => handleEditArticle(article.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(article.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section: Certificates */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">List Certificates (Published)</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">ID</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Title
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Publish Date
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b border-gray-200">{cert.id}</td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {cert.title}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {cert.publishDate}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    <button
                      onClick={() => handleEditCertificate(cert.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCertificate(cert.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section: Comments (Approval) */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Comments Approval</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">ID</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Article ID
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Article Title
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Name
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Email
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Comment
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Publish Date
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {comments.map((cmt) => (
                <tr key={cmt.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b border-gray-200">{cmt.id}</td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {cmt.articleId}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {cmt.articleTitle}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {cmt.name}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {cmt.email}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {cmt.comment}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {cmt.publishDate}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    <button
                      onClick={() => handleApproveComment(cmt.id)}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1 rounded mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectComment(cmt.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
