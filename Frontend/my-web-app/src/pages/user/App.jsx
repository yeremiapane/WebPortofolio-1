import React, { useState, useEffect } from "react";
import ScrollReveal from "scrollreveal";
// Untuk Swiper
import { Navigation } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

// Import file CSS utama kita yang berisi Tailwind + main.css
import "../../Main_App.css";

function App() {
    // State untuk open/close nav menu di mobile
    const [navMenuOpen, setNavMenuOpen] = useState(false);

    // Scroll event: header scroll style
    const [headerScroll, setHeaderScroll] = useState(false);

    // Scroll event: scrolltop
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Data articles
    const [articles, setArticles] = useState([]);

    // Data certificates
    const [certificates, setCertificates] = useState([]);

    // Modal state
    const [modalActive, setModalActive] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    // Fungsi untuk fetch data articles
    const loadArticlesForHomepage = () => {
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
            .catch((err) => {
                console.error("Error loading articles:", err);
            });
    };

    // Fungsi untuk fetch data certificates
    const loadCertificatesForHomepage = () => {
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
            .catch((err) => {
                console.error("Error loading certificates:", err);
            });
    };

    // Lifecycle
    useEffect(() => {
        loadArticlesForHomepage();
        loadCertificatesForHomepage();

        // Scroll event listener
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setHeaderScroll(true);
            } else {
                setHeaderScroll(false);
            }

            if (window.scrollY > 150) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };
        window.addEventListener("scroll", handleScroll);

        // Inisialisasi ScrollReveal
        const sr = ScrollReveal({
            distance: "100px",
            duration: 1500,
            delay: 200,
            reset: true,
        });
        sr.reveal(
            ".home__content, .about__img, .testimonial__wrapper, .footer__wrapper"
        );
        sr.reveal(".home__img, .about__content", { origin: "top" });
        sr.reveal(
            ".service__item, .skill__item, .experience__group, .portfolio__project, .blog__card",
            { interval: 100 }
        );

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Fungsi bantu
    const truncateText = (text, maxLength) => {
        if (!text) return "";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { year: "numeric", month: "long", day: "numeric" };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

    // Saat klik kartu sertifikat
    const handleCertificateCardClick = (id) => {
        fetch(`/certificates/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setModalContent(data);
                setModalActive(true);
            })
            .catch((err) => {
                console.error("Error fetching certificate details:", err);
            });
    };

    return (
        <>
            {/* Header */}
            <header
                id="header"
                className={`header ${headerScroll ? "header--scroll" : ""}`}
            >
                <nav className="nav container">
                    <a href="#" className="nav__brand">
                        YR.
                    </a>
                    <div
                        className={`nav__menu ${navMenuOpen ? "nav__menu--open" : ""}`}
                        id="nav-menu"
                    >
                        <ul className="nav__list">
                            <li className="nav__item">
                                <a href="#home" className="nav__link nav__link--active">
                                    Home
                                </a>
                            </li>
                            <li className="nav__item">
                                <a href="#service" className="nav__link">
                                    Services
                                </a>
                            </li>
                            <li className="nav__item">
                                <a href="#about" className="nav__link">
                                    About
                                </a>
                            </li>
                            <li className="nav__item">
                                <a href="#skill" className="nav__link">
                                    Skills
                                </a>
                            </li>
                            <li className="nav__item">
                                <a href="#experience" className="nav__link">
                                    Experience
                                </a>
                            </li>
                            <li className="nav__item">
                                <a href="#portfolio" className="nav__link">
                                    Portfolio
                                </a>
                            </li>
                            <li className="nav__item">
                                <a href="#blog" className="nav__link">
                                    Blog
                                </a>
                            </li>
                            <li className="nav__item">
                                <a href="#contact" className="btn btn--primary">
                                    Contact
                                </a>
                            </li>
                        </ul>
                        <span
                            className="nav__close"
                            onClick={() => setNavMenuOpen(false)}
                            style={{ cursor: "pointer" }}
                        >
              <i id="nav-close" className="ri-close-line"></i>
            </span>
                    </div>
                    <span
                        className="nav__open"
                        onClick={() => setNavMenuOpen(true)}
                        style={{ cursor: "pointer" }}
                    >
            <i id="nav-open" className="ri-menu-3-line"></i>
          </span>
                </nav>
            </header>

            {/* Main */}
            <main className="main">
                {/* HOME */}
                <section id="home" className="home">
                    <div className="d-grid home__wrapper container">
                        <div className="home__content">
                            <div className="home__social">
                                <ul className="social__list">
                                    <li className="social__item">
                                        <a
                                            href="https://www.linkedin.com/in/yeremia-yosefan-pane-74041921a/"
                                            className="social__link"
                                        >
                                            <i className="ri-linkedin-line"></i>
                                        </a>
                                    </li>
                                    <li className="social__item">
                                        <a href="https://github.com/yeremiapane" className="social__link">
                                            <i className="ri-github-line"></i>
                                        </a>
                                    </li>
                                    <li className="social__item">
                                        <a href="#" className="social__link">
                                            <i className="ri-dribbble-line"></i>
                                        </a>
                                    </li>
                                    <li className="social__item">
                                        <a href="#" className="social__link">
                                            <i className="ri-youtube-line"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="home__info">
                                <h1 className="home__name">
                                    Yeremia
                                    <br />
                                    Yosefan Pane
                                </h1>
                                <p className="home__profession">
                                    Data Engineer/Data Analyst/Backend Developer
                                </p>
                                <p className="home__description">
                                    I'm a Computer Science graduate from Medan State University.
                                    I'm known for my enthusiasm for data, love for challenges, and
                                    collaborative approach to finding new solutions and
                                    innovations. I have TensorFlow Developer certifications from
                                    <b style={{ color: "azure" }}> Google </b>
                                    and AI for Business Professionals certifications from{" "}
                                    <b style={{ color: "azure" }}>Certnexus</b>. My technical
                                    expertise includes Machine Learning Development, Data
                                    Analytics, and Data Science.
                                </p>
                                <div className="home__buttons">
                                    <a href="#" className="btn btn--outline">
                                        Hire Me
                                    </a>
                                    <a href="#" className="btn--line">
                                        See My Work
                                    </a>
                                </div>
                            </div>
                        </div>
                        <img
                            src="../../../public/img/home.png"
                            alt="Yeremia Yosefan Pane"
                            className="home__img"
                        />
                    </div>
                </section>

                {/* SERVICE */}
                <section id="service" className="section service">
                    <div className="container">
                        <div className="section__header">
                            <h2 className="section__title">My Expertise</h2>
                            <p className="section__description">
                                Some of the technology skills I have to be able to work.
                            </p>
                        </div>
                    </div>
                    <div className="d-grid service__wrapper container">
                        {/* service 1 */}
                        <div className="service__item">
                            <div className="service__card">
                                <div className="service__icon">
                                    <i className="ri-code-s-slash-line"></i>
                                </div>
                                <h3 className="service__name">Web Development</h3>
                                <p className="service__description">
                                    Design and build web systems with a high degree of
                                    attractiveness, ensuring they are highly functional.
                                </p>
                            </div>
                        </div>
                        {/* service 2 */}
                        <div className="service__item">
                            <div className="service__card">
                                <div className="service__icon">
                                    <i className="ri-pen-nib-fill"></i>
                                </div>
                                <h3 className="service__name">Data Analyst/Data Engineer</h3>
                                <p className="service__description">
                                    Designing, Pulling, Analyzing data using several tools such as
                                    Google Studio, Power BI, and Tableu.
                                </p>
                            </div>
                        </div>
                        {/* service 3 */}
                        <div className="service__item">
                            <div className="service__card">
                                <div className="service__icon">
                                    <i className="ri-device-line"></i>
                                </div>
                                <h3 className="service__name">IT Support</h3>
                                <p className="service__description">
                                    Perform analysis and troubleshooting for software or hardware
                                    and network improvements.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ABOUT */}
                <section id="about" className="section about">
                    <div className="d-grid about__wrapper container">
                        <div className="about__content">
                            <h2 className="about__title">About Me</h2>
                            <p className="about__description">
                                I'm a Computer Science graduate from Medan State University. I'm
                                known for my enthusiasm for data, love for challenges, and
                                collaborative approach to finding new solutions and innovations.
                                During my studies, I actively participated in various activities
                                that added to my experience...
                            </p>
                            <a href="./assets/doc/CV Yeremia Yosefan Pane.pdf" className="btn btn--primary">
                                My Resume
                            </a>
                        </div>
                        <img src="../../../public/img/about.jpg" alt="" className="about__img" />
                    </div>
                </section>

                {/* SKILL */}
                <section id="skill" className="skill section">
                    <div className="container">
                        <div className="section__header">
                            <h2 className="section__title">My Skills</h2>
                            <p className="section__description">
                                Enim adipiscing duis facilisi sed eu tortor. Suspendisse
                                vulputate varius eu sollicitudin amet placerat feugiat sem
                                felis.
                            </p>
                        </div>
                    </div>
                    <div className="d-grid skill__wrapper container">
                        <div className="section-bg"></div>
                        <div className="skill__item">
                            <div className="skill__card">
                                <img src="../../../public/img/skill1.svg" alt="" className="skill__img" />
                                <h3 className="skill__name">Data Analyst</h3>
                                <ul className="skill__list">
                                    <li className="skill__item">Tableu</li>
                                    <li className="skill__item">Power BI</li>
                                    <li className="skill__item">Looker Studio</li>
                                    <li className="skill__item">Python</li>
                                </ul>
                            </div>
                        </div>
                        <div className="skill__item">
                            <div className="skill__card">
                                <img src="../../../public/img/skill2.svg" alt="" className="skill__img" />
                                <h3 className="skill__name">Back-End</h3>
                                <ul className="skill__list">
                                    <li className="skill__item">Python</li>
                                    <li className="skill__item">Golang</li>
                                    <li className="skill__item">MySQL</li>
                                    <li className="skill__item">Docker</li>
                                </ul>
                            </div>
                        </div>
                        <div className="skill__item">
                            <div className="skill__card">
                                <img src="../../../public/img/skill3.svg" alt="" className="skill__img" />
                                <h3 className="skill__name">Framework</h3>
                                <ul className="skill__list">
                                    <li className="skill__item">Flask</li>
                                    <li className="skill__item">GIN</li>
                                    <li className="skill__item">Tensorflow</li>
                                    <li className="skill__item">Apache Spark</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* EXPERIENCE */}
                <section id="experience" className="section experience">
                    <div className="container">
                        <div className="section__header">
                            <h2 className="section__title">My Experience</h2>
                        </div>
                    </div>
                    <div className="d-grid experience__wrapper container">
                        <div className="section-bg"></div>
                        {/* Education */}
                        <div className="experience__group">
                            <div className="experience__group-wrapper d-grid">
                                {/* Education 1 */}
                                <div className="experience__item">
                                    <div className="experience__card">
                                        <h3 className="experience__title">
                                            <i className="ri-book-fill"></i>
                                            Education
                                        </h3>
                                        <div className="experience__header">
                                            <h3 className="experience__name">Computer Science</h3>
                                            <span className="experience__date">2020 - 2024</span>
                                        </div>
                                        <p className="experience__description">
                                            Most popular winner of a national programming competition
                                            involving more than 20 public universities...
                                        </p>
                                        <span className="experience__place">
                      Universitas Negeri Medan
                    </span>
                                    </div>
                                </div>
                                {/* Education 2 */}
                                <div className="experience__item">
                                    <div className="experience__card">
                                        <h3 className="experience__title">
                                            <i className="ri-book-fill"></i>
                                            Education
                                        </h3>
                                        <div className="experience__header">
                                            <h3 className="experience__name">AI For Junior Developer</h3>
                                            <span className="experience__date">
                        August 2023 - September 2023
                      </span>
                                        </div>
                                        <p className="experience__description">
                                            In aliquam in leo ac et id rhoncus. Sit consectetur
                                            ultricies sit id aliquam lectus sit ornare pharetra.
                                        </p>
                                        <span className="experience__place">
                      Huawei X Digitalent KOMINFO
                    </span>
                                    </div>
                                </div>
                                {/* Education 3 */}
                                <div className="experience__item">
                                    <div className="experience__card">
                                        <h3 className="experience__title">
                                            <i className="ri-book-fill"></i>
                                            Education
                                        </h3>
                                        <div className="experience__header">
                                            <h3 className="experience__name">AI Hacker</h3>
                                            <span className="experience__date">
                        August 2022 - December 2022
                      </span>
                                        </div>
                                        <p className="experience__description">
                                            Learned about Machine Learning Process, Data
                                            Visualization, Data Science...
                                        </p>
                                        <span className="experience__place">PT Bisa AI Indonesia</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Work Experience */}
                        <div className="experience__group">
                            <div className="experience__group-wrapper d-grid">
                                {/* Work 1 */}
                                <div className="experience__item">
                                    <div className="experience__card">
                                        <h3 className="experience__title">
                                            <i className="ri-book-fill"></i>
                                            Education
                                        </h3>
                                        <div className="experience__header">
                                            <h3 className="experience__name">
                                                Machine Learning Specialist
                                            </h3>
                                            <span className="experience__date">
                        February 2023 - July 2023
                      </span>
                                        </div>
                                        <p className="experience__description">
                                            Learned about machine learning development...
                                        </p>
                                        <span className="experience__place">
                      Bangkit Academy led by Google, GoTo, and Traveloka
                    </span>
                                    </div>
                                </div>
                                {/* Work 2 */}
                                <div className="experience__item">
                                    <div className="experience__card">
                                        <h3 className="experience__title">
                                            <i className="ri-book-fill"></i>
                                            Education
                                        </h3>
                                        <div className="experience__header">
                                            <h3 className="experience__name">
                                                Computer Hacking Forensic Investigator
                                            </h3>
                                            <span className="experience__date">
                        August 2021 - October 2021
                      </span>
                                        </div>
                                        <p className="experience__description">
                                            Recognize, analyze, and investigate hacking on mobile and
                                            desktop devices...
                                        </p>
                                        <span className="experience__place">
                      PT Digital Innovation Lounge and CV. Rekhindo Pratama
                    </span>
                                    </div>
                                </div>
                                {/* Work 3 */}
                                <div className="experience__item">
                                    <div className="experience__card">
                                        <h3 className="experience__title">
                                            <i className="ri-briefcase-fill"></i>
                                            Work Experience
                                        </h3>
                                        <div className="experience__header">
                                            <h3 className="experience__name">Web Developer</h3>
                                            <span className="experience__date">
                        November 2024 - December 2024
                      </span>
                                        </div>
                                        <p className="experience__description">
                                            Responsible for the development of a tuition payment
                                            website with multiple payment methods.
                                        </p>
                                        <span className="experience__place">
                      Universitas Negeri Medan
                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PORTFOLIO */}
                <section id="portfolio" className="section porfolio">
                    <div className="container">
                        <div className="section__header">
                            <h2 className="section__title">My Projects</h2>
                            <p className="section__description">
                                Enim adipiscing duis facilisi sed eu tortor. Suspendisse
                                vulputate varius eu sollicitudin amet placerat feugiat sem felis.
                            </p>
                        </div>
                    </div>
                    <div className="d-grid portfolio__wrapper container">
                        {/* project 1 */}
                        <div className="portfolio__project">
                            <img
                                src="../../../public/img/portfolio1.jpg"
                                alt=""
                                className="portfolio__img"
                            />
                            <div className="portfolio__content">
                                <div className="portfolio__info">
                                    <h3 className="portfolio__name">Web Development</h3>
                                    <span className="portfolio__category">Web Development</span>
                                </div>
                                <a href="#" className="portfolio__link">
                                    <i className="ri-external-link-line"></i>
                                </a>
                            </div>
                        </div>
                        {/* project 2 */}
                        <div className="portfolio__project">
                            <img
                                src="../../../public/img/portfolio2.jpg"
                                alt=""
                                className="portfolio__img"
                            />
                            <div className="portfolio__content">
                                <div className="portfolio__info">
                                    <h3 className="portfolio__name">App Development</h3>
                                    <span className="portfolio__category">App Development</span>
                                </div>
                                <a href="#" className="portfolio__link">
                                    <i className="ri-external-link-line"></i>
                                </a>
                            </div>
                        </div>
                        {/* project 3 */}
                        <div className="portfolio__project">
                            <img
                                src="../../../public/img/portfolio3.jpg"
                                alt=""
                                className="portfolio__img"
                            />
                            <div className="portfolio__content">
                                <div className="portfolio__info">
                                    <h3 className="portfolio__name">UI/UX Design</h3>
                                    <span className="portfolio__category">UI/UX Design</span>
                                </div>
                                <a href="#" className="portfolio__link">
                                    <i className="ri-external-link-line"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CERTIFICATIONS */}
                <section className="section certificates">
                    <div className="container">
                        <div className="section__header">
                            <h2 className="section__title">My Certifications</h2>
                            <p className="section__description">
                                Enim adipiscing duis facilisi sed eu tortor. Suspendisse vulputate
                                varius eu sollicitudin amet placerat feugiat sem felis.
                            </p>
                        </div>
                    </div>
                    <div className="certificates__wrapper container swiper">
                        <div className="section-bg"></div>
                        {/* Swiper container */}
                        <Swiper
                            modules={[Navigation]}
                            navigation={{
                                nextEl: ".swiper__next",
                                prevEl: ".swiper__prev",
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
                                        className="certification__card swiper-slide"
                                        data-id={cert.id}
                                        onClick={() => handleCertificateCardClick(cert.id)}
                                    >
                                        <div className="certification__img-wrapper">
                                            <img
                                                src={cert.image_path}
                                                alt={cert.issued_by}
                                                className="certification__img"
                                            />
                                        </div>
                                        <div className="certification__content">
                                            <h1 className="certification__category">{cert.title}</h1>
                                            <h3 className="certification__publisher">
                                                {cert.issued_by}
                                            </h3>
                                            <p className="certification__description">
                                                {cert.description}
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <div className="swiper__navigation">
                        <div className="swiper__button swiper__prev">
                            <i className="ri-arrow-left-s-line"></i>
                        </div>
                        <div className="swiper__button swiper__next">
                            <i className="ri-arrow-right-s-line"></i>
                        </div>
                    </div>
                </section>

                {/* Modal Sertifikat */}
                <div
                    id="certificateModal"
                    className={`${modalActive ? "active" : ""}`}
                    style={{ position: "relative" }}
                >
                    {modalActive && (
                        <>
                            <button id="closeModal" onClick={() => setModalActive(false)}>
                                Close
                            </button>
                            <div id="modalContent">
                                {modalContent && (
                                    <>
                                        <h1>{modalContent.title}</h1>
                                        <p>
                                            <strong>Issued By:</strong> {modalContent.issued_by}
                                        </p>
                                        <img
                                            src={modalContent.image_path}
                                            alt={modalContent.issued_by}
                                            style={{ maxWidth: "100%", margin: "1rem 0" }}
                                        />
                                        <p>{modalContent.description}</p>
                                        <p>
                                            <strong>Published At:</strong>{" "}
                                            {formatDate(modalContent.created_at)}
                                        </p>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* BLOG */}
                <section id="blog" className="section blog">
                    <div className="container">
                        <div className="section__header">
                            <h2 className="section__title">Articles & News</h2>
                            <p className="section__description">
                                Enim adipiscing duis facilisi sed eu tortor. Suspendisse vulputate
                                varius eu sollicitudin amet placerat feugiat sem felis.
                            </p>
                        </div>
                    </div>
                    <div className="d-grid blog__wrapper container">
                        {articles.map((article) => (
                            <div key={article.id} className="blog__card">
                                <div className="blog__img-wrapper">
                                    <img
                                        src={article.image_url}
                                        alt={article.title}
                                        className="blog__img"
                                    />
                                </div>
                                <div className="blog__content">
                                    <h3 className="blog__title">
                                        <a
                                            href={`read_article.html?id=${article.id}`}
                                            style={{ textDecoration: "none", color: "inherit" }}
                                        >
                                            {article.title}
                                        </a>
                                    </h3>
                                    <p className="blog__description">
                                        {truncateText(article.description, 35)}
                                    </p>
                                </div>
                                <div className="blog__footer">
                                    <span className="blog__category">{article.category}</span>
                                    <span className="blog__date">
                    {formatDate(article.published_at)}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="read-more-container">
                        <a href="article_pages.html" className="read-more-button">
                            Read More Article
                        </a>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="footer section">
                <div className="footer__wrapper container">
                    <div className="footer__content">
                        <span className="footer__subtitle">Get In Touch</span>
                        <h2 className="footer__title">Let's Talk About Work</h2>
                        <a href="#" className="btn--line">
                            Contact Me
                        </a>
                    </div>
                    <div className="footer__contact">
                        <div className="footer__social">
                            <ul className="social__list">
                                <li className="social__item">
                                    <a
                                        href="https://www.linkedin.com/in/yeremia-yosefan-pane-74041921a/"
                                        className="social__link"
                                    >
                                        <i className="ri-linkedin-line"></i>
                                    </a>
                                </li>
                                <li className="social__item">
                                    <a href="https://github.com/yeremiapane" className="social__link">
                                        <i className="ri-github-line"></i>
                                    </a>
                                </li>
                                <li className="social__item">
                                    <a href="#" className="social__link">
                                        <i className="ri-dribbble-line"></i>
                                    </a>
                                </li>
                                <li className="social__item">
                                    <a href="#" className="social__link">
                                        <i className="ri-youtube-line"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <a
                            href="mailto:yeremiayosefanpane@hotmail.com"
                            className="footer__contact-item"
                        >
                            yeremiayosefanpane@hotmail.com
                        </a>
                        <a
                            href="https://wa.me/6285277603027"
                            className="footer__contact-item"
                        >
                            (+62) 8527 - 7603 - 027
                        </a>
                    </div>
                </div>
                <p className="footer__copyright container">
                    &copy; Yeremia Yosefan Pane
                </p>
            </footer>

            {/* Scrolltop */}
            <a
                href="#"
                className={`scrolltop ${showScrollTop ? "scrolltop--show" : ""}`}
                id="scrolltop"
            >
                <i className="ri-arrow-up-s-line"></i>
            </a>
        </>
    );
}

export default App;
