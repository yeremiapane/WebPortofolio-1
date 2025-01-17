import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const dummyData = {
    id: 1,
    title: "Mengenal React (Dummy)",
    author: "Admin",
    category: "Programming",
    tags: "react,javascript",
    description: "Belajar React untuk pemula",
    content: "<p>Konten article...</p>",
};

export default function UpdateArticle() {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [mainImage, setMainImage] = useState(null);
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        // fetch data by id
        setTitle(dummyData.title);
        setAuthor(dummyData.author);
        setCategory(dummyData.category);
        setTags(dummyData.tags);
        setDescription(dummyData.description);
        setContent(dummyData.content);
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // logika update
        alert(`Article with ID ${id} updated!`);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Update Article (ID: {id})</h2>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 shadow rounded">
                {/* form input sama dengan CreateArticle */}
                {/* ... */}
                <div>
                    <button
                        type="submit"
                        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
}
