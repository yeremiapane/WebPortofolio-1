import React from "react";

const articles = [
    {
        id: 1,
        category: "Design Tools",
        date: "August 13, 2021",
        title: "10 Hilarious Cartoons That Depict Real-Life Problems of Programmers",
        excerpt:
            "Redefined the user acquisition and redesigned the onboarding experience, all within 3 working weeks.",
        author: "John Doe",
        likes: 18,
        comments: 1,
        readTime: "5 min read",
        imageUrl: "https://via.placeholder.com/150x100?text=Sample1",
    },
    {
        id: 2,
        category: "Design Tools",
        date: "August 13, 2021",
        title: "How to Create Better UI Components in 3 Steps",
        excerpt:
            "Learn the fundamental principles of UI design, step-by-step, to speed up your workflow and improve user experience.",
        author: "Jane Doe",
        likes: 10,
        comments: 2,
        readTime: "4 min read",
        imageUrl: "https://via.placeholder.com/150x100?text=Sample2",
    },
    {
        id: 3,
        category: "Design Tools",
        date: "August 13, 2021",
        title: "10 Hilarious Cartoons That Depict Real-Life Problems of Programmers",
        excerpt:
            "Redefined the user acquisition and redesigned the onboarding experience, all within 3 working weeks.",
        author: "John Doe",
        likes: 18,
        comments: 1,
        readTime: "6 min read",
        imageUrl: "https://via.placeholder.com/150x100?text=Sample3",
    },
];

const ArticleList = () => {
    return (
        <section className="py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Heading */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">Design Tools</h2>
                </div>
                {/* Articles */}
                <div className="space-y-8">
                    {articles.map((article) => (
                        <div
                            key={article.id}
                            className="grid grid-cols-1 md:grid-cols-5 gap-4 border-b pb-4"
                        >
                            <div className="md:col-span-3">
                                <div className="flex items-center space-x-2 text-sm mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                    {article.category}
                  </span>
                                    <span className="text-gray-600">{article.date}</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-1">{article.title}</h3>
                                <p className="text-gray-700 mb-2">{article.excerpt}</p>
                                <div className="flex items-center text-sm text-gray-600 space-x-4">
                                    <span>by {article.author}</span>
                                    <span>{article.readTime}</span>
                                </div>
                                <div className="flex items-center space-x-4 mt-2 text-sm">
                                    <div className="flex items-center space-x-1">
                                        <span>❤️</span>
                                        <span>{article.likes}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span>💬</span>
                                        <span>{article.comments}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-2 flex justify-center md:justify-end">
                                <img
                                    src={article.imageUrl}
                                    alt={article.title}
                                    className="rounded-md w-full md:w-48 h-28 object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ArticleList;
