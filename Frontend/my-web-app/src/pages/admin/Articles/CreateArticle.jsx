import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function CreateArticle() {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [mainImage, setMainImage] = useState(null);
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // logika submit
        alert("Article created!");
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Create Article</h2>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 shadow rounded">
                <div>
                    <label className="block font-semibold mb-1">Title</label>
                    <input
                        type="text"
                        className="border px-3 py-2 rounded w-full"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1">Author</label>
                    <input
                        type="text"
                        className="border px-3 py-2 rounded w-full"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1">Main Image</label>
                    <input
                        type="file"
                        onChange={(e) => setMainImage(e.target.files[0])}
                        className="block w-full"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1">Category</label>
                    <input
                        type="text"
                        className="border px-3 py-2 rounded w-full"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1">Tags</label>
                    <input
                        type="text"
                        className="border px-3 py-2 rounded w-full"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                    <small className="text-gray-500">
                        Pisahkan dengan koma, misal: react,tailwind,programming
                    </small>
                </div>

                <div>
                    <label className="block font-semibold mb-1">Description</label>
                    <textarea
                        className="border px-3 py-2 rounded w-full"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <div>
                    <label className="block font-semibold mb-1">Content</label>
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        className="bg-white"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
