import React, { useState } from "react";

const BlogPost = () => {
    // Contoh data statis
    const postData = {
        title: "How to test React with Jest",
        coverImage:
            "https://images.unsplash.com/photo-1570910525231-62f86558b5e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1300&q=80",
        category: "JavaScript Testing",
        tags: ["React", "Testing", "Jest"],
        date: "2023-05-20",
        author: "notion ai",
        readingTime: "8 min read",
        introduction: `
      Testing is an integral part of software development, and React is no exception.
      Jest is a popular testing framework that is widely used in the React community.
      In this blog post, we will discuss how to test React components using Jest.
      We will also provide code examples to illustrate the concepts.
    `,
        setup: `
      Before we can start testing React components with Jest, we need to install Jest.
      Jest can be installed using npm, the Node.js package manager. Once Jest is installed,
      we need to configure it to work with React...
    `,
        writing: `
      With Jest installed and configured, we can start writing tests for our React components.
      In Jest, tests are defined using the "test" function. The "test" function takes two arguments:
      a description of the test and a function that contains the test code...
    `,
        conclusion: `
      In this blog post, we discussed how to test React components using Jest. We covered the setup
      process for Jest and how to write tests using Jest's test function. We also provided a code example
      to illustrate the concepts. Testing is an important part of software development, and Jest makes it
      easy to test React components...
    `,
    };

    // State untuk like
    const [likeCount, setLikeCount] = useState(23); // Contoh
    // State untuk komentar
    const [comments, setComments] = useState([]); // array of { name, email, content, isAnon }
    // State form komentar
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [content, setContent] = useState("");
    // State untuk menandai apakah anonymous diaktifkan
    const [isAnonymous, setIsAnonymous] = useState(false);

    // Handler penambahan like
    const handleLike = () => {
        setLikeCount((prev) => prev + 1);
    };

    // Handler submit komentar
    const handleSubmit = (e) => {
        e.preventDefault();

        // Jika anonymous, name & email = "" agar tidak tersimpan
        const commentData = {
            name: isAnonymous ? "" : name,
            email: isAnonymous ? "" : email,
            content: content,
            isAnon: isAnonymous,
        };

        setComments((prev) => [...prev, commentData]);

        // Reset form
        setName("");
        setEmail("");
        setContent("");
    };

    // Handler toggle anonymous
    const handleAnonymousToggle = () => {
        setIsAnonymous(!isAnonymous);
        // Jika diaktifkan, kosongkan name & email
        if (!isAnonymous) {
            setName("");
            setEmail("");
        }
    };

    return (
        <main className="max-w-4xl mx-auto px-4 py-8">
            {/* Cover Image */}
            <div className="mb-4">
                <img
                    src={postData.coverImage}
                    alt="blog cover"
                    className="w-full h-auto rounded-md shadow"
                />
            </div>

            {/* Category di bawah cover image */}
            <div className="mb-4">
        <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-sm px-3 py-1 rounded-full">
          {postData.category}
        </span>
            </div>

            {/* Title, Penulis, Tanggal, Reading Time */}
            <h1 className="text-3xl font-bold mb-2 dark:text-white">
                {postData.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                This post is written by {postData.author}
            </p>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                <span className="mr-4">Date: {postData.date}</span>
                <span className="mr-4">Reading time: {postData.readingTime}</span>
            </div>

            {/* Konten Artikel */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2 dark:text-white">
                    Introduction
                </h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                    {postData.introduction}
                </p>
            </section>
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2 dark:text-white">
                    Setting Up Jest
                </h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                    {postData.setup}
                </p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4 text-sm text-gray-800 dark:text-gray-100">
{`npm install jest --save-dev
npm install react-test-renderer --save-dev`}
        </pre>
            </section>
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2 dark:text-white">
                    Writing Tests with Jest
                </h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                    {postData.writing}
                </p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm text-gray-800 dark:text-gray-100">
{`import React from 'react';
import renderer from 'react-test-renderer';
import MyComponent from './MyComponent';

test('MyComponent renders correctly', () => {
  const tree = renderer.create(<MyComponent />).toJSON();
  expect(tree).toMatchSnapshot();
});`}
        </pre>
            </section>
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2 dark:text-white">
                    Conclusion
                </h2>
                <p className="text-gray-700 dark:text-gray-300">{postData.conclusion}</p>
            </section>

            {/* Bagian setelah artikel: Like, Jumlah Komentar, Form Komentar */}
            <div className="border-t pt-4 mt-8 dark:border-gray-700">
                {/* Like & Comments Info */}
                <div className="flex items-center space-x-6 mb-4">
                    <button
                        onClick={handleLike}
                        className="flex items-center space-x-2 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full hover:bg-blue-300 dark:hover:bg-blue-700 transition"
                    >
                        <span>👍</span>
                        <span>{likeCount} Likes</span>
                    </button>

                    <div className="text-gray-600 dark:text-gray-300">
                        {comments.length} Comments
                    </div>
                </div>

                {/* Form Komentar */}
                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="flex items-center mb-2">
                        <input
                            id="anonymous"
                            type="checkbox"
                            checked={isAnonymous}
                            onChange={handleAnonymousToggle}
                            className="mr-2"
                        />
                        <label htmlFor="anonymous" className="dark:text-gray-200">
                            Comment as Anonymous
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-semibold mb-1 dark:text-gray-200"
                            >
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                className="w-full border rounded px-3 py-2 dark:text-black"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isAnonymous}
                                placeholder={isAnonymous ? "Anonymous active" : "Your name"}
                            />
                        </div>
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold mb-1 dark:text-gray-200"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="w-full border rounded px-3 py-2 dark:text-black"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isAnonymous}
                                placeholder={isAnonymous ? "Anonymous active" : "Your email"}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mb-4">
                        <label
                            htmlFor="content"
                            className="block text-sm font-semibold mb-1 dark:text-gray-200"
                        >
                            Comment
                        </label>
                        <textarea
                            id="content"
                            rows="3"
                            className="w-full border rounded px-3 py-2 dark:text-black"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your comment..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-green-200 dark:bg-green-700 text-green-800 dark:text-white px-4 py-2 rounded hover:bg-green-300 dark:hover:bg-green-600 transition"
                    >
                        Post Comment
                    </button>
                </form>

                {/* Daftar Komentar */}
                {comments.length > 0 && (
                    <div className="space-y-4">
                        {comments.map((comment, index) => (
                            <div
                                key={index}
                                className="border rounded p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                            >
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                    {comment.isAnon ? "Anonymous" : comment.name || "N/A"}{" "}
                                    {comment.email && !comment.isAnon && `(${comment.email})`}
                                </p>
                                <p className="text-gray-700 dark:text-gray-200">
                                    {comment.content}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tags di bagian bawah */}
            <div className="mt-8 border-t pt-4 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-2 dark:text-white">Tags</h2>
                <div className="flex flex-wrap items-center gap-2">
                    {postData.tags.map((tag) => (
                        <span
                            key={tag}
                            className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-2 py-1 rounded-full text-sm"
                        >
              {tag}
            </span>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default BlogPost;
