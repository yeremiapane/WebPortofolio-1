import React, { useState, useEffect } from "react";

// Untuk Swiper
// import Swiper core and required modules
import { Navigation } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

// Fungsi bantu untuk memformat tanggal
function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
}

function App() {
    // STATE untuk navigasi open/close di mobile
    const [navOpen, setNavOpen] = useState(false);

    // STATE untuk header shadow saat scroll
    const [headerShadow, setHeaderShadow] = useState(false);

    // STATE untuk menampung data artikel (blog)
    const [articles, setArticles] = useState([]);

    // STATE untuk menampung data sertifikat
    const [certificates, setCertificates] = useState([]);

    // STATE untuk modal sertifikat
    const [showModal, setShowModal] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState(null);

    // Scroll event listener
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setHeaderShadow(true);
            } else {
                setHeaderShadow(false);
            }
        };
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Fetch articles (misalnya: /articles?page=1&limit=3)
    useEffect(() => {
        fetch("/articles?page=1&limit=3")
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => {
                setArticles(data);
            })
            .catch((err) => console.error("Error loading articles:", err));
    }, []);

    // Fetch certificates (misalnya: /certificates?page=1)
    useEffect(() => {
        fetch("/certificates?page=1")
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => {
                setCertificates(data);
            })
            .catch((err) => console.error("Error loading certificates:", err));
    }, []);

    // Fungsi bantu untuk memotong deskripsi artikel
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    // Ketika klik kartu sertifikat
    const handleCertificateClick = (id) => {
        fetch(`/certificates/${id}`)
            .then((res) => res.json())
            .then((detail) => {
                setSelectedCertificate(detail);
                setShowModal(true);
            })
            .catch((err) => console.error("Error fetching certificate details:", err));
    };

    // Tutup modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedCertificate(null);
    };

    return (
        <div className="font-sans relative">
            {/* ------------------------ HEADER ------------------------ */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-colors ${
                    headerShadow ? "bg-white shadow-md" : "bg-gray-900"
                }`}
            >
                <nav className="container mx-auto px-4 flex justify-between items-center">
                    {/* Brand */}
                    <a
                        href="#home"
                        className={`text-lg font-bold ${
                            headerShadow ? "text-gray-900" : "text-white"
                        }`}
                    >
                        YR.
                    </a>

                    {/* Tombol buka di mobile */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setNavOpen(true)}
                            className={`text-2xl ${
                                headerShadow ? "text-gray-800" : "text-white"
                            }`}
                        >
                            <i className="ri-menu-3-line"></i>
                        </button>
                    </div>

                    {/* Menu Navigasi */}
                    <ul
                        className={`fixed top-0 left-0 right-0 bottom-0 bg-white flex flex-col justify-center items-center gap-8 text-gray-900 text-lg font-medium transform transition-transform md:static md:flex-row md:bg-transparent md:translate-x-0 md:opacity-100 md:justify-end md:gap-6 md:text-base ${
                            navOpen
                                ? "translate-x-0 opacity-100"
                                : "translate-x-full opacity-0 md:opacity-100"
                        }`}
                    >
                        {/* Tombol Close (mobile) */}
                        <button
                            onClick={() => setNavOpen(false)}
                            className="absolute top-8 right-8 text-2xl md:hidden"
                        >
                            <i className="ri-close-line"></i>
                        </button>

                        {[
                            { href: "#home", label: "Home" },
                            { href: "#service", label: "Services" },
                            { href: "#about", label: "About" },
                            { href: "#skill", label: "Skills" },
                            { href: "#experience", label: "Experience" },
                            { href: "#portfolio", label: "Portfolio" },
                            { href: "#blog", label: "Blog" },
                        ].map((item) => (
                            <li key={item.href}>
                                <a
                                    onClick={() => setNavOpen(false)}
                                    href={item.href}
                                    className={`hover:text-blue-600 ${
                                        headerShadow
                                            ? "md:text-gray-900"
                                            : "md:text-white md:hover:text-blue-500"
                                    }`}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}

                        <li>
                            <a
                                onClick={() => setNavOpen(false)}
                                href="#contact"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
                            >
                                Contact
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>

            <main className="mt-16 overflow-hidden">
                {/* -------------------- HOME -------------------- */}
                <section
                    id="home"
                    className="min-h-screen bg-gray-900 flex items-center py-16"
                >
                    <div className="container mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 items-center px-4">
                        {/* Kiri */}
                        <div className="space-y-8">
                            {/* Social Links */}
                            <ul className="flex md:flex-col gap-4">
                                <li>
                                    <a
                                        href="https://www.linkedin.com/in/yeremia-yosefan-pane-74041921a/"
                                        className="w-10 h-10 flex items-center justify-center border border-gray-500 text-gray-200 rounded-full hover:bg-blue-600 hover:border-transparent transition"
                                    >
                                        <i className="ri-linkedin-line"></i>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://github.com/yeremiapane"
                                        className="w-10 h-10 flex items-center justify-center border border-gray-500 text-gray-200 rounded-full hover:bg-blue-600 hover:border-transparent transition"
                                    >
                                        <i className="ri-github-line"></i>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="w-10 h-10 flex items-center justify-center border border-gray-500 text-gray-200 rounded-full hover:bg-blue-600 hover:border-transparent transition"
                                    >
                                        <i className="ri-dribbble-line"></i>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="w-10 h-10 flex items-center justify-center border border-gray-500 text-gray-200 rounded-full hover:bg-blue-600 hover:border-transparent transition"
                                    >
                                        <i className="ri-youtube-line"></i>
                                    </a>
                                </li>
                            </ul>

                            {/* Info */}
                            <div>
                                <h1 className="text-4xl lg:text-5xl text-white font-bold mb-2 leading-tight">
                                    Yeremia <br />
                                    Yosefan Pane
                                </h1>
                                <p className="text-blue-400 text-lg font-semibold mb-4">
                                    Data Engineer / Data Analyst / Backend Developer
                                </p>
                                <p className="text-gray-200 text-sm leading-relaxed">
                                    I'm a Computer Science graduate from Medan State University.
                                    I'm known for my enthusiasm for data, love for challenges, and
                                    collaborative approach to finding new solutions and
                                    innovations. I have TensorFlow Developer certifications from{" "}
                                    <b className="text-blue-300">Google</b> and AI for Business
                                    Professionals certifications from{" "}
                                    <b className="text-blue-300">Certnexus</b>. My technical
                                    expertise includes Machine Learning Development, Data
                                    Analytics, and Data Science.
                                </p>

                                {/* Buttons */}
                                <div className="mt-6 flex items-center gap-4">
                                    <a
                                        href="#"
                                        className="px-5 py-2 rounded-lg border border-white text-white hover:bg-blue-700 transition"
                                    >
                                        Hire Me
                                    </a>
                                    <a
                                        href="#portfolio"
                                        className="relative text-white after:content-[''] after:w-0 after:h-[2px] after:bg-white after:absolute after:-bottom-2 after:left-0 hover:after:w-full transition-all"
                                    >
                                        See My Work
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Gambar kanan */}
                        <div className="flex justify-center md:justify-end">
                            <img
                                src="../../../public/img/home.png"
                                alt="Yeremia Yosefan Pane"
                                className="w-[350px] md:w-[450px]"
                            />
                        </div>
                    </div>
                </section>

                {/* -------------------- SERVICES -------------------- */}
                <section id="service" className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-xl mx-auto mb-12">
                            <h2 className="text-2xl font-bold mb-4">My Expertise</h2>
                            <p className="text-sm text-gray-600">
                                Some of the technology skills I have to be able to work.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            {/* Card 1 */}
                            <div className="bg-white shadow-lg p-6 rounded-lg hover:-translate-y-2 transition transform">
                                <div className="text-blue-600 text-4xl mb-4">
                                    <i className="ri-code-s-slash-line"></i>
                                </div>
                                <h3 className="font-bold text-lg mb-2">Web Development</h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    Design and build web systems with a high degree of
                                    attractiveness, ensuring they are highly functional.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white shadow-lg p-6 rounded-lg hover:-translate-y-2 transition transform">
                                <div className="text-blue-600 text-4xl mb-4">
                                    <i className="ri-pen-nib-fill"></i>
                                </div>
                                <h3 className="font-bold text-lg mb-2">
                                    Data Analyst / Data Engineer
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    Designing, Pulling, Analyzing data using Google Studio, Power
                                    BI, and Tableau.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white shadow-lg p-6 rounded-lg hover:-translate-y-2 transition transform">
                                <div className="text-blue-600 text-4xl mb-4">
                                    <i className="ri-device-line"></i>
                                </div>
                                <h3 className="font-bold text-lg mb-2">IT Support</h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    Perform analysis and troubleshooting for software/hardware and
                                    network improvements.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* -------------------- ABOUT -------------------- */}
                <section id="about" className="py-16">
                    <div className="container mx-auto px-4 grid gap-8 md:grid-cols-2 md:items-center">
                        {/* Teks */}
                        <div>
                            <h2 className="text-xl font-bold mb-4">About Me</h2>
                            <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                                I'm a Computer Science graduate from Medan State University. I'm
                                known for my enthusiasm for data, love for challenges, and
                                collaborative approach to finding new solutions and innovations.
                                During my studies, I actively participated in various activities
                                that added to my experience...
                            </p>
                            <a
                                href="../../../public/doc/CV Yeremia Yosefan Pane.pdf"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
                            >
                                My Resume
                            </a>
                        </div>

                        {/* Gambar */}
                        <div className="flex justify-center md:justify-end">
                            <img
                                src="../../../public/img/about.jpg"
                                alt="About me"
                                className="rounded-lg w-[300px] md:w-[400px]"
                            />
                        </div>
                    </div>
                </section>

                {/* -------------------- SKILL -------------------- */}
                <section id="skill" className="py-16 bg-gray-100 relative">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-xl mx-auto mb-12">
                            <h2 className="text-2xl font-bold mb-4">My Skills</h2>
                            <p className="text-sm text-gray-600">
                                Enim adipiscing duis facilisi sed eu tortor. Suspendisse
                                vulputate varius...
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            {/* Card 1 */}
                            <div className="bg-white rounded-lg p-6 text-center shadow hover:scale-105 transition">
                                <img
                                    src="../../../public/img/skill1.svg"
                                    alt="Skill"
                                    className="w-20 h-20 mx-auto mb-4"
                                />
                                <h3 className="text-lg font-bold mb-2">Data Analyst</h3>
                                <ul className="space-y-1 text-sm text-gray-600">
                                    <li>Tableu</li>
                                    <li>Power BI</li>
                                    <li>Looker Studio</li>
                                    <li>Python</li>
                                </ul>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white rounded-lg p-6 text-center shadow hover:scale-105 transition">
                                <img
                                    src="../../../public/img/skill2.svg"
                                    alt="Skill"
                                    className="w-20 h-20 mx-auto mb-4"
                                />
                                <h3 className="text-lg font-bold mb-2">Back-End</h3>
                                <ul className="space-y-1 text-sm text-gray-600">
                                    <li>Python</li>
                                    <li>Golang</li>
                                    <li>MySQL</li>
                                    <li>Docker</li>
                                </ul>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white rounded-lg p-6 text-center shadow hover:scale-105 transition">
                                <img
                                    src="../../../public/img/skill3.svg"
                                    alt="Skill"
                                    className="w-20 h-20 mx-auto mb-4"
                                />
                                <h3 className="text-lg font-bold mb-2">Framework</h3>
                                <ul className="space-y-1 text-sm text-gray-600">
                                    <li>Flask</li>
                                    <li>GIN</li>
                                    <li>Tensorflow</li>
                                    <li>Apache Spark</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* -------------------- EXPERIENCE -------------------- */}
                <section id="experience" className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-xl mx-auto mb-12">
                            <h2 className="text-2xl font-bold mb-4">My Experience</h2>
                        </div>

                        <div className="grid gap-12 md:grid-cols-2">
                            {/* Kiri (pendidikan) */}
                            <div className="space-y-8">
                                {/* Card 1 */}
                                <div className="bg-white rounded-lg p-6 shadow hover:scale-105 transition">
                                    <h3 className="flex items-center gap-2 text-sm font-medium mb-2">
                                        <i className="ri-book-fill text-blue-600"></i>
                                        Education
                                    </h3>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-lg font-bold">Computer Science</h4>
                                        <span className="text-xs font-bold">2020 - 2024</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-2">
                                        Most popular winner of a national programming competition...
                                    </p>
                                    <span className="text-sm font-medium">
                    Universitas Negeri Medan
                  </span>
                                </div>

                                {/* Card 2 */}
                                <div className="bg-white rounded-lg p-6 shadow hover:scale-105 transition">
                                    <h3 className="flex items-center gap-2 text-sm font-medium mb-2">
                                        <i className="ri-book-fill text-blue-600"></i>
                                        Education
                                    </h3>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-lg font-bold">AI For Junior Developer</h4>
                                        <span className="text-xs font-bold">
                      August 2023 - September 2023
                    </span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-2">
                                        In aliquam in leo ac et id rhoncus. Sit consectetur ultricies...
                                    </p>
                                    <span className="text-sm font-medium">
                    Huawei X Digitalent KOMINFO
                  </span>
                                </div>

                                {/* Card 3 */}
                                <div className="bg-white rounded-lg p-6 shadow hover:scale-105 transition">
                                    <h3 className="flex items-center gap-2 text-sm font-medium mb-2">
                                        <i className="ri-book-fill text-blue-600"></i>
                                        Education
                                    </h3>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-lg font-bold">AI Hacker</h4>
                                        <span className="text-xs font-bold">
                      August 2022 - December 2022
                    </span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-2">
                                        Learned about Machine Learning Process, Data Visualization...
                                    </p>
                                    <span className="text-sm font-medium">
                    PT Bisa AI Indonesia
                  </span>
                                </div>
                            </div>

                            {/* Kanan (pekerjaan) */}
                            <div className="space-y-8">
                                {/* Card 1 */}
                                <div className="bg-white rounded-lg p-6 shadow hover:scale-105 transition">
                                    <h3 className="flex items-center gap-2 text-sm font-medium mb-2">
                                        <i className="ri-book-fill text-blue-600"></i>
                                        Education
                                    </h3>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-lg font-bold">
                                            Machine Learning Specialist
                                        </h4>
                                        <span className="text-xs font-bold">
                      February 2023 - July 2023
                    </span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-2">
                                        Learned about machine learning development...
                                    </p>
                                    <span className="text-sm font-medium">
                    Bangkit Academy led by Google, GoTo, and Traveloka
                  </span>
                                </div>

                                {/* Card 2 */}
                                <div className="bg-white rounded-lg p-6 shadow hover:scale-105 transition">
                                    <h3 className="flex items-center gap-2 text-sm font-medium mb-2">
                                        <i className="ri-book-fill text-blue-600"></i>
                                        Education
                                    </h3>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-lg font-bold">
                                            Computer Hacking Forensic Investigator
                                        </h4>
                                        <span className="text-xs font-bold">
                      August 2021 - October 2021
                    </span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-2">
                                        Recognize, analyze, and investigate hacking...
                                    </p>
                                    <span className="text-sm font-medium">
                    PT Digital Innovation Lounge and CV. Rekhindo Pratama
                  </span>
                                </div>

                                {/* Card 3 (Work Experience) */}
                                <div className="bg-white rounded-lg p-6 shadow hover:scale-105 transition">
                                    <h3 className="flex items-center gap-2 text-sm font-medium mb-2">
                                        <i className="ri-briefcase-fill text-blue-600"></i>
                                        Work Experience
                                    </h3>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-lg font-bold">Web Developer</h4>
                                        <span className="text-xs font-bold">
                      November 2024 - December 2024
                    </span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-2">
                                        Responsible for the development of a tuition payment website...
                                    </p>
                                    <span className="text-sm font-medium">
                    Universitas Negeri Medan
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* -------------------- PORTFOLIO -------------------- */}
                <section id="portfolio" className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-xl mx-auto mb-12">
                            <h2 className="text-2xl font-bold mb-4">My Projects</h2>
                            <p className="text-sm text-gray-600">
                                Enim adipiscing duis facilisi sed eu tortor.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            {/* Project 1 */}
                            <div className="relative rounded-lg overflow-hidden group">
                                <img
                                    src="../../../public/img/portfolio1.jpg"
                                    alt="Portfolio"
                                    className="transform group-hover:scale-110 transition"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-white p-4 translate-y-full group-hover:translate-y-0 transition">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold">Web Development</h3>
                                            <span className="text-sm text-gray-600">
                        Web Development
                      </span>
                                        </div>
                                        <a
                                            href="#"
                                            className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full hover:bg-blue-800 transition"
                                        >
                                            <i className="ri-external-link-line"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Project 2 */}
                            <div className="relative rounded-lg overflow-hidden group">
                                <img
                                    src="../../../public/img/portfolio2.jpg"
                                    alt="Portfolio"
                                    className="transform group-hover:scale-110 transition"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-white p-4 translate-y-full group-hover:translate-y-0 transition">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold">App Development</h3>
                                            <span className="text-sm text-gray-600">
                        App Development
                      </span>
                                        </div>
                                        <a
                                            href="#"
                                            className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full hover:bg-blue-800 transition"
                                        >
                                            <i className="ri-external-link-line"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Project 3 */}
                            <div className="relative rounded-lg overflow-hidden group">
                                <img
                                    src="../../../public/img/portfolio3.jpg"
                                    alt="Portfolio"
                                    className="transform group-hover:scale-110 transition"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-white p-4 translate-y-full group-hover:translate-y-0 transition">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold">UI/UX Design</h3>
                                            <span className="text-sm text-gray-600">UI/UX Design</span>
                                        </div>
                                        <a
                                            href="#"
                                            className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full hover:bg-blue-800 transition"
                                        >
                                            <i className="ri-external-link-line"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* -------------------- CERTIFICATES -------------------- */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-xl mx-auto mb-12">
                            <h2 className="text-2xl font-bold mb-4">My Certifications</h2>
                            <p className="text-sm text-gray-600">
                                Enim adipiscing duis facilisi sed eu tortor.
                            </p>
                        </div>

                        {/* Slider */}
                        <div className="relative">
                            <Swiper
                                modules={[Navigation]}
                                navigation={{
                                    nextEl: ".swiper-button-next",
                                    prevEl: ".swiper-button-prev",
                                }}
                                spaceBetween={20}
                                slidesPerView={1}
                                breakpoints={{
                                    640: {
                                        slidesPerView: 2,
                                    },
                                    1024: {
                                        slidesPerView: 3,
                                    },
                                }}
                            >
                                {certificates.map((cert) => (
                                    <SwiperSlide key={cert.id}>
                                        <div
                                            className="bg-white rounded-lg shadow hover:scale-105 transition cursor-pointer flex flex-col"
                                            onClick={() => handleCertificateClick(cert.id)}
                                        >
                                            <div className="relative w-full pt-[75%] bg-gray-100 overflow-hidden">
                                                <img
                                                    src={cert.image_path}
                                                    alt={cert.issued_by}
                                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="p-4 text-center">
                                                <h3 className="text-blue-800 text-sm font-bold mb-2">
                                                    {cert.title}
                                                </h3>
                                                <h4 className="text-sm font-semibold text-gray-700">
                                                    {cert.issued_by}
                                                </h4>
                                                <p className="text-xs text-gray-600 mt-2">
                                                    {cert.description}
                                                </p>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            {/* Tombol navigasi swiper */}
                            <div className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-blue-600 transition z-10 ml-2">
                                <i className="ri-arrow-left-s-line text-xl"></i>
                            </div>
                            <div className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-blue-600 transition z-10 mr-2">
                                <i className="ri-arrow-right-s-line text-xl"></i>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Modal sertifikat */}
                {showModal && selectedCertificate && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
                        <div className="bg-white p-6 rounded-lg max-w-2xl w-full relative">
                            {/* Tombol close */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 bg-gray-400 text-white rounded px-2 py-1 hover:bg-gray-600 transition"
                            >
                                Close
                            </button>

                            {/* Isi modal */}
                            <h1 className="text-xl font-bold mb-2">
                                {selectedCertificate.title}
                            </h1>
                            <p className="text-sm text-gray-700 mb-2">
                                <strong>Issued By:</strong> {selectedCertificate.issued_by}
                            </p>
                            <img
                                src={selectedCertificate.image_path}
                                alt={selectedCertificate.issued_by}
                                className="my-4 max-h-60 mx-auto"
                            />
                            <p className="text-sm text-gray-700 mb-4">
                                {selectedCertificate.description}
                            </p>
                            <p className="text-sm text-gray-700">
                                <strong>Published At:</strong>{" "}
                                {formatDate(selectedCertificate.created_at)}
                            </p>
                        </div>
                    </div>
                )}

                {/* -------------------- BLOG -------------------- */}
                <section id="blog" className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-xl mx-auto mb-12">
                            <h2 className="text-2xl font-bold mb-4">Articles & News</h2>
                            <p className="text-sm text-gray-600">
                                Enim adipiscing duis facilisi sed eu tortor.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            {articles.map((article) => (
                                <div
                                    key={article.id}
                                    className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition"
                                >
                                    <div className="overflow-hidden h-60 bg-gray-200">
                                        <img
                                            src={article.image_url}
                                            alt={article.title}
                                            className="w-full h-full object-cover transform hover:scale-110 transition"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold mb-2">
                                            <a
                                                href={`read_article.html?id=${article.id}`}
                                                className="hover:text-blue-600"
                                            >
                                                {article.title}
                                            </a>
                                        </h3>
                                        <p className="text-sm text-gray-700 mb-4">
                                            {truncateText(article.description, 35)}
                                        </p>
                                        <div className="flex items-center justify-between text-xs font-bold">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {article.category}
                      </span>
                                            <span>{formatDate(article.published_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center mt-8">
                            <a
                                href="article_pages.html"
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-blue-800 transition"
                            >
                                Read More Article
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            {/* ------------------------ FOOTER ------------------------ */}
            <footer className="bg-gray-900 text-white py-10">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    {/* Kiri */}
                    <div>
                        <span className="block text-sm mb-1">Get In Touch</span>
                        <h2 className="text-2xl font-bold mb-4">Let's Talk About Work</h2>
                        <a
                            href="#contact"
                            className="relative text-white after:content-[''] after:w-0 after:h-[2px] after:bg-white after:absolute after:-bottom-2 after:left-0 hover:after:w-full transition-all"
                        >
                            Contact Me
                        </a>
                    </div>

                    {/* Kanan */}
                    <div>
                        <ul className="flex gap-4 mb-4 md:mb-2">
                            <li>
                                <a
                                    href="https://www.linkedin.com/in/yeremia-yosefan-pane-74041921a/"
                                    className="w-10 h-10 flex items-center justify-center border border-gray-500 text-gray-200 rounded-full hover:bg-blue-600 hover:border-transparent transition"
                                >
                                    <i className="ri-linkedin-line"></i>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/yeremiapane"
                                    className="w-10 h-10 flex items-center justify-center border border-gray-500 text-gray-200 rounded-full hover:bg-blue-600 hover:border-transparent transition"
                                >
                                    <i className="ri-github-line"></i>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="w-10 h-10 flex items-center justify-center border border-gray-500 text-gray-200 rounded-full hover:bg-blue-600 hover:border-transparent transition"
                                >
                                    <i className="ri-dribbble-line"></i>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="w-10 h-10 flex items-center justify-center border border-gray-500 text-gray-200 rounded-full hover:bg-blue-600 hover:border-transparent transition"
                                >
                                    <i className="ri-youtube-line"></i>
                                </a>
                            </li>
                        </ul>
                        <a
                            href="mailto:yeremiayosefanpane@hotmail.com"
                            className="block text-sm font-bold mb-1"
                        >
                            yeremiayosefanpane@hotmail.com
                        </a>
                        <a
                            href="https://wa.me/6285277603027"
                            className="block text-sm font-bold"
                        >
                            (+62) 8527 - 7603 - 027
                        </a>
                    </div>
                </div>
                <p className="text-center text-sm mt-8">
                    &copy; {new Date().getFullYear()} Yeremia Yosefan Pane
                </p>
            </footer>

            {/* Tombol scrolltop (opsional) */}
            <a
                href="#"
                className="fixed bottom-[-100%] right-8 w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full text-2xl transition-all hover:bg-blue-800"
            >
                <i className="ri-arrow-up-s-line"></i>
            </a>
        </div>
    );
}

export default App;
