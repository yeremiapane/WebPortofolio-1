import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function CommentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Dummy data
    const [comment, setComment] = useState({
        id: 2,
        articleId: 1,
        parentId: null,
        articleTitle: "Mengenal React",
        name: "",
        email: "",
        content: "Nice article, thanks!",
        status: "Pending",
        publishComment: false,
    });

    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState("");

    const handleApprove = () => {
        setComment({ ...comment, status: "Approved", publishComment: true });
        alert("Comment Approved!");
    };

    const handleReject = () => {
        setComment({ ...comment, status: "Rejected", publishComment: false });
        alert("Comment Rejected!");
    };

    const handleReset = () => {
        setComment({ ...comment, status: "Pending", publishComment: false });
        alert("Comment Reset to Pending!");
    };

    const handleReply = () => {
        // Show or hide reply form
        setShowReplyForm(!showReplyForm);
    };

    const handleSubmitReply = (e) => {
        e.preventDefault();
        // logika reply
        alert(`Reply sent:\n${replyContent}`);
        setReplyContent("");
        setShowReplyForm(false);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-2">Comment Detail (ID: {id})</h2>
            <div className="bg-white p-4 rounded shadow space-y-2">
                <p><strong>Article ID:</strong> {comment.articleId}</p>
                <p><strong>Parent ID:</strong> {comment.parentId || "-"}</p>
                <p><strong>Article Title:</strong> {comment.articleTitle}</p>
                <p><strong>Name:</strong> {comment.name || "Anonym"}</p>
                <p><strong>Email:</strong> {comment.email || "-"}</p>
                <p><strong>Content:</strong> {comment.content}</p>
                <p><strong>Status:</strong> {comment.status}</p>
                <p><strong>Publish Comment:</strong> {comment.publishComment ? "Yes" : "No"}</p>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={handleApprove}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Approve
                </button>
                <button
                    onClick={handleReject}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Reject
                </button>
                <button
                    onClick={handleReset}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                    Reset
                </button>
                <button
                    onClick={handleReply}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {showReplyForm ? "Cancel Reply" : "Reply"}
                </button>
            </div>

            {/* Reply form */}
            {showReplyForm && (
                <form onSubmit={handleSubmitReply} className="bg-white p-4 rounded shadow space-y-2">
                    <label className="block font-semibold mb-1">Reply Content</label>
                    <ReactQuill theme="snow" value={replyContent} onChange={setReplyContent} />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
                    >
                        Submit Reply
                    </button>
                </form>
            )}
        </div>
    );
}
