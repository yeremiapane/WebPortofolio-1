import React from "react";

// Contoh data
const relatedPostsData = [
    {
        id: 1,
        title: "React vs Vue vs Angular",
        date: "2022-05-14",
        tags: ["React", "Vue.js", "Angular.js"],
        readingTime: "5 min read",
        imageUrl:
            "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 2,
        title: "How to use TypeScript with React",
        date: "2022-05-10",
        tags: ["React", "TypeScript"],
        readingTime: "4 min read",
        imageUrl:
            "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 3,
        title: "Image test",
        date: "2023-07-25",
        tags: ["Test"],
        readingTime: "3 min read",
        imageUrl:
            "https://images.unsplash.com/photo-1603603882079-09c7f37194c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 4,
        title: 'When to use "useEffect"?',
        date: "2023-08-03",
        tags: ["React"],
        readingTime: "6 min read",
        imageUrl:
            "https://images.unsplash.com/photo-1484417894907-623942c8ee29?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 5,
        title: "React Custom Hooks",
        date: "2023-03-13",
        tags: ["React"],
        readingTime: "7 min read",
        imageUrl:
            "https://images.unsplash.com/photo-1604131623805-c8cbb6bfa9a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 6,
        title: "Next.js vs React: What are the differences?",
        date: "2023-03-11",
        tags: ["React", "Next.js"],
        readingTime: "5 min read",
        imageUrl:
            "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    },
];

const RelatedPosts = () => {
    return (
        <section className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Related Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPostsData.map((post) => (
                    <div
                        key={post.id}
                        className="bg-white dark:bg-gray-800 rounded shadow p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="mb-3">
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="rounded w-full h-40 object-cover"
                            />
                        </div>
                        <h3 className="font-semibold text-lg mb-2 dark:text-white">
                            {post.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            {post.date}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {post.readingTime}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full"
                                >
                  {tag}
                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 text-center">
                <button className="px-6 py-2 bg-red-200 text-red-800 rounded hover:bg-red-300 font-semibold transition-colors">
                    Load More
                </button>
            </div>
        </section>
    );
};

export default RelatedPosts;
