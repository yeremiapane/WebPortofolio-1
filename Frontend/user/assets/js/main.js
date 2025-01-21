const header = document.getElementById("header"),
  navMenu = document.getElementById("nav-menu"),
  navOpen = document.getElementById("nav-open"),
  navClose = document.getElementById("nav-close"),
  navLinks = document.querySelectorAll(".nav__link");

/* Change header on scroll
---------------------------------------*/
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    header.classList.add("header--scroll");
  } else {
    header.classList.remove("header--scroll");
  }
});

/* Navigation Menu
---------------------------------------*/

// Open
navOpen.addEventListener("click", () => {
  navMenu.classList.add("nav__menu--open");
});

// Close
navClose.addEventListener("click", () => {
  navMenu.classList.remove("nav__menu--open");
});

// Close the nav menu when the user clicks on each nav link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("nav__menu--open");
  });
});

/* 
Active link on scroll section 
-------------------------------------*/
function addActiveLink() {
  const section = document.querySelectorAll("section[id]");
  section.forEach((section) => {
    const scrollY = window.scrollY,
      sectionTop = section.offsetTop - 100,
      sectionHeight = section.offsetHeight,
      sectionId = section.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav__link[href*=" + sectionId + "]")
        .classList.add("nav__link--active");
    } else {
      document
        .querySelector(".nav__link[href*=" + sectionId + "]")
        .classList.remove("nav__link--active");
    }
  });
}

window.addEventListener("scroll", addActiveLink);

/* 
Scrolltop 
----------------------------------------------*/
const scrolltop = document.getElementById("scrolltop");

function showScrollTop() {
  if (window.scrollY > 150) {
    scrolltop.classList.add("scrolltop--show");
  } else {
    scrolltop.classList.remove("scrolltop--show");
  }
}

window.addEventListener("scroll", showScrollTop);

/* 
Testimonial Swiper
----------------------------------------------*/
const testimonialSwiper = new Swiper(".testimonial__wrapper", {
  loop: true,
  spaceBetween: 40,
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  navigation: {
    nextEl: ".swiper__next",
    prevEl: ".swiper__prev",
  },
});

/* 
ScrollReveal
----------------------------------------------*/
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

document.addEventListener('DOMContentLoaded', () => {
  loadArticlesForHomepage();
});

function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function loadArticlesForHomepage() {
  fetch('/articles?page=1&limit=3')  // sesuaikan URL dan parameter
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(articles => {
        const wrapper = document.querySelector('.blog__wrapper');
        if (!wrapper) {
          console.error('Blog wrapper not found!');
          return;
        }
        wrapper.innerHTML = ''; // Kosongkan kontainer sebelum menambahkan artikel

        articles.forEach(article => {
          // Buat elemen blog__card
          const card = document.createElement('div');
          card.classList.add('blog__card');

          card.innerHTML = `
          <div class="blog__img-wrapper">
            <img src="${article.image_url}" alt="${article.title}" class="blog__img">
          </div>
          <div class="blog__content">
            <h3 class="blog__title">
              <a href="read_article.html?id=${article.id}" style="text-decoration: none; color: inherit;">
                ${article.title}
              </a>
            </h3>
            <p class="blog__description">${truncateText(article.description, 35)}</p>
          </div>
          <div class="blog__footer">
            <span class="blog__category">${article.category}</span>
            <span class="blog__date">${formatDate(article.published_at)}</span>
          </div>
        `;

          wrapper.appendChild(card);
        });
      })
      .catch(error => {
        console.error('Error loading articles:', error);
      });
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
}

document.addEventListener('DOMContentLoaded', () => {
  // Inisialisasi modal dan referensi elemen terkait
  const modal = document.getElementById('certificateModal');
  const closeModal = document.getElementById('closeModal');
  const modalContent = document.getElementById('modalContent');

  // Inisialisasi Quill atau fungsi lain yang diperlukan di sini jika ada

  // Fungsi untuk memuat sertifikat dan menambahkan event listener ke kartu
  function loadCertificatesForHomepage() {
    fetch('/certificates?page=1')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(certificates => {
          const wrapper = document.querySelector('.swiper-wrapper');
          if (!wrapper) {
            console.error('Swiper wrapper not found!');
            return;
          }
          wrapper.innerHTML = '';

          certificates.forEach(cert => {
            const card = document.createElement('div');
            card.classList.add('certification__card', 'swiper-slide');
            card.setAttribute('data-id', cert.id);

            card.innerHTML = `
            <div class="certification__img-wrapper">
              <img src="${cert.image_path}" alt="${cert.issued_by}" class="certification__img">
            </div>
            <div class="certification__content">
              <h1 class="certification__category">${cert.title}</h1>
              <h3 class="certification__publisher">${cert.issued_by}</h3>
              <p class="certification__description">${cert.description}</p>
            </div>
          `;

            card.addEventListener('click', () => {
              const certId = card.getAttribute('data-id');
              if (!certId) return;

              fetch(`/certificates/${certId}`)
                  .then(response => response.json())
                  .then(cert => {
                    modalContent.innerHTML = `
                  <h1>${cert.title}</h1>
                  <p><strong>Issued By:</strong> ${cert.issued_by}</p>
                  <img src="${cert.image_path}" alt="${cert.publisher}" style="max-width:100%; margin: 1rem 0;">
                  <p>${cert.description}</p>
                  <p><strong>Published At:</strong> ${new Date(cert.created_at).toLocaleDateString()}</p>
                `;
                    modal.classList.add('active');
                  })
                  .catch(err => {
                    console.error('Error fetching certificate details:', err);
                  });
            });

            wrapper.appendChild(card);
          });

          if (window.mySwiper) {
            window.mySwiper.update();
          } else {
            window.mySwiper = new Swiper('.swiper', {
              navigation: {
                nextEl: '.swiper__next',
                prevEl: '.swiper__prev',
              },
            });
          }
        })
        .catch(error => {
          console.error('Error loading certificates:', error);
        });
  }

  // Panggil fungsi untuk memuat sertifikat
  loadCertificatesForHomepage();

  // Event listener untuk tombol Close pada modal
  closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
  });
});


