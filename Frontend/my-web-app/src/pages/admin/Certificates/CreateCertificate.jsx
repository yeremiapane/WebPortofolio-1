import React, { useState } from "react";

export default function CreateCertificate() {
    const [title, setTitle] = useState("");
    const [publisher, setPublisher] = useState("");
    const [certImage, setCertImage] = useState(null);
    const [category, setCategory] = useState("");
    const [skills, setSkills] = useState("");
    const [description, setDescription] = useState("");
    const [verificationLink, setVerificationLink] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Certificate created!");
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Create Certificate</h2>
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
                    <label className="block font-semibold mb-1">Publisher</label>
                    <input
                        type="text"
                        className="border px-3 py-2 rounded w-full"
                        value={publisher}
                        onChange={(e) => setPublisher(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1">Certification Image</label>
                    <input
                        type="file"
                        onChange={(e) => setCertImage(e.target.files[0])}
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
                    <label className="block font-semibold mb-1">Skills</label>
                    <input
                        type="text"
                        className="border px-3 py-2 rounded w-full"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                    />
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
                    <label className="block font-semibold mb-1">Link Verifikasi (Opsional)</label>
                    <input
                        type="text"
                        className="border px-3 py-2 rounded w-full"
                        value={verificationLink}
                        onChange={(e) => setVerificationLink(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1">Issue Start Date</label>
                    <input
                        type="date"
                        className="border px-3 py-2 rounded w-full"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1">Issue End Date (Opsional)</label>
                    <input
                        type="date"
                        className="border px-3 py-2 rounded w-full"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
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
