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
            <img src="${article.MainImage}" alt="${article.Title}" class="blog__img">
          </div>
          <div class="blog__content">
            <h3 class="blog__title">
              <a href="article/${article.ID}" style="text-decoration: none; color: inherit;">
                ${article.Title}
              </a>
            </h3>
            <p class="blog__description">${truncateText(article.Description, 35)}</p>
          </div>
          <div class="blog__footer">
            <span class="blog__category">${article.Category}</span>
            <span class="blog__date">${formatDate(article.UpdatedAt)}</span>
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

// Variabel global untuk daftar sertifikat dan index sertifikat yang sedang ditampilkan
let certificatesList = [];
let currentCertIndex = null;
let modalSwiper = null;

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('certificateModal');
  const modalClose = modal.querySelector('.modal-close');
  const modalTitle = modal.querySelector('.modal-title');
  const modalSubtitle = modal.querySelector('.modal-subtitle');
  const modalDescription = modal.querySelector('.modal-description');
  const swiperWrapper = modal.querySelector('.modal-swiper .swiper-wrapper');
  const btnPrevCert = modal.querySelector('.modal-prev');
  const btnNextCert = modal.querySelector('.modal-next');

  // Fungsi untuk memuat daftar sertifikat pada halaman utama
  function loadCertificatesForHomepage() {
    fetch('/certificates?page=1')
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        })
        .then(certificates => {
          const wrapper = document.querySelector('.certification__cards');
          if (!wrapper) {
            console.error('Certification cards container not found!');
            return;
          }
          wrapper.innerHTML = '';

          // Simpan seluruh data sertifikat ke array global
          certificatesList = certificates;

          certificates.forEach((cert, index) => {
            // Buat string tanggal issue dan end
            let issueString = '';
            if (cert.IssueMonth && cert.IssueYear) {
              const monthName = getMonthName(cert.IssueMonth);
              issueString = `${monthName} ${cert.IssueYear}`;
            }

            let endString = '';
            if (cert.EndMonth && cert.EndYear) {
              const endMonthName = getMonthName(cert.EndMonth);
              endString = `${endMonthName} ${cert.EndYear}`;
            } else {
              endString = 'No Expiry Date';
            }

            // Tangani multiple images
            const imagePaths = cert.Images ? cert.Images.split(',') : [];
            const firstImage = imagePaths.length > 0 ? imagePaths[0].trim() : '';
            const additionalImagesCount = imagePaths.length > 1 ? imagePaths.length - 1 : 0;

            // Buat elemen kartu sertifikat
            const card = document.createElement('div');
            card.classList.add('certification__card', 'swiper-slide');
            card.setAttribute('data-id', cert.ID);
            card.setAttribute('data-index', index);

            // Tentukan sumber gambar
            const imageSrc = firstImage
                ? `/uploads/certificate/${encodeURIComponent(firstImage)}`
                : '/uploads/certificate/default.jpg';

            card.innerHTML = `
            <div class="certification__img-wrapper">
              <img src="${imageSrc}" alt="${cert.Publisher}" class="certification__img">
              ${additionalImagesCount > 0 ? `<span class="image-count">+${additionalImagesCount}</span>` : ''}
            </div>
            <div class="certification__content">
              <h1 class="certification__title">${cert.Title}</h1>
              <h3 class="certification__publisher">${cert.Publisher}</h3>
              <p class="certification__dates">
                <strong>Issue:</strong> ${issueString}<br>
                <strong>End:</strong> ${endString}
              </p>
            </div>
          `;

            // Saat kartu diklik, simpan index saat ini dan muat detail sertifikat ke modal
            card.addEventListener('click', () => {
              const certId = card.getAttribute('data-id');
              currentCertIndex = parseInt(card.getAttribute('data-index'));
              loadCertificateDetail(certId);
            });

            wrapper.appendChild(card);
          });

          // Inisialisasi Swiper untuk halaman utama (Landing Page)
          window.mySwiper = new Swiper('.swiper', {
            navigation: {
              nextEl: '.swiper__next',
              prevEl: '.swiper__prev',
            },
            loop: true,
          });
        })
        .catch(error => {
          console.error('Error loading certificates:', error);
        });
  }

  // Fungsi untuk mengonversi nomor bulan ke nama bulan
  function getMonthName(num) {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[num - 1] || "";
  }

  // Fungsi untuk memformat tanggal (misalnya dari ISO string)
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  }

  // Fungsi untuk memuat detail sertifikat ke dalam modal
  function loadCertificateDetail(certId) {
    fetch(`/certificates/${certId}`)
        .then(response => {
          if (!response.ok) throw new Error('Failed to fetch certificate detail');
          return response.json();
        })
        .then(certDetail => {
          // Set judul dan subjudul modal
          modalTitle.textContent = certDetail.Title;
          modalSubtitle.textContent = `Issued by ${certDetail.Publisher}`;

          // Format tanggal issue & end
          let detailIssue = '';
          if (certDetail.IssueMonth && certDetail.IssueYear) {
            const imStr = getMonthName(certDetail.IssueMonth);
            detailIssue = `${imStr} ${certDetail.IssueYear}`;
          }
          let detailEnd = '';
          if (certDetail.EndMonth && certDetail.EndYear) {
            const emStr = getMonthName(certDetail.EndMonth);
            detailEnd = `${emStr} ${certDetail.EndYear}`;
          } else {
            detailEnd = 'No Expiry';
          }

          // Tampilkan skills, verification link, dan category jika ada
          let extraInfo = '';
          if (certDetail.Skills) {
            extraInfo += `<p><strong>Skills:</strong> ${certDetail.Skills}</p>`;
          }
          if (certDetail.VerificationLink) {
            extraInfo += `<p><strong>Verification Link:</strong> <a href="${certDetail.VerificationLink}" target="_blank">Open Link</a></p>`;
          }
          if (certDetail.Category) {
            extraInfo += `<p><strong>Category:</strong> ${certDetail.Category}</p>`;
          }
          const dateCreated = certDetail.CreatedAt ? formatDate(certDetail.CreatedAt) : 'N/A';

          // Gabungkan deskripsi lengkap
          const sanitizedDescription = DOMPurify.sanitize(certDetail.Description);
          modalDescription.innerHTML = `
          <p style="font-size: 18px;"><strong>Description:</strong></p>
          <div style="font-size: 16px;">${sanitizedDescription}</div>
          <p><strong>Issue:</strong> ${detailIssue}</p>
          <p><strong>End:</strong> ${detailEnd}</p>
          ${extraInfo}
          <p><strong>Created At:</strong> ${dateCreated}</p>
        `;

          // Tangani multiple images untuk modal (gunakan default jika tidak ada gambar)
          const modalImagePaths = certDetail.Images ? certDetail.Images.split(',') : [];
          let modalImagesHTML = '';
          modalImagePaths.forEach(img => {
            if (img.trim() !== '') {
              modalImagesHTML += `<div class="swiper-slide">
              <img src="/uploads/certificate/${encodeURIComponent(img.trim())}" alt="${certDetail.Publisher}" />
            </div>`;
            }
          });
          if (modalImagesHTML === '') {
            modalImagesHTML = `<div class="swiper-slide">
            <img src="/uploads/certificate/default.jpg" alt="${certDetail.Publisher}" />
          </div>`;
          }
          // Muat ulang konten slider
          swiperWrapper.innerHTML = modalImagesHTML;

          // Jika modalSwiper sudah diinisialisasi sebelumnya, hancurkan dulu agar tidak terjadi duplikasi
          if (modalSwiper) {
            modalSwiper.destroy(true, true);
          }
          // Inisialisasi Swiper untuk modal
          modalSwiper = new Swiper('.modal-swiper', {
            loop: true,
            navigation: {
              nextEl: '.modal-swiper-next',
              prevEl: '.modal-swiper-prev',
            },
          });

          // Tampilkan modal
          modal.classList.add('active');
        })
        .catch(err => {
          console.error('Error fetching certificate details:', err);
        });
  }

  // Event listener untuk tombol close modal
  modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  // Event listener untuk tombol navigasi antar sertifikat (Sertifikat Sebelumnya)
  btnPrevCert.addEventListener('click', () => {
    if (certificatesList.length === 0 || currentCertIndex === null) return;
    // Mengurangi index, jika sudah di awal maka kembali ke akhir list (loop)
    currentCertIndex = (currentCertIndex - 1 + certificatesList.length) % certificatesList.length;
    const prevCertId = certificatesList[currentCertIndex].ID;
    loadCertificateDetail(prevCertId);
  });

  // Event listener untuk tombol navigasi antar sertifikat (Sertifikat Selanjutnya)
  btnNextCert.addEventListener('click', () => {
    if (certificatesList.length === 0 || currentCertIndex === null) return;
    // Menambah index, jika sudah di akhir maka kembali ke awal list
    currentCertIndex = (currentCertIndex + 1) % certificatesList.length;
    const nextCertId = certificatesList[currentCertIndex].ID;
    loadCertificateDetail(nextCertId);
  });

  // Panggil fungsi untuk memuat sertifikat pada halaman utama
  loadCertificatesForHomepage();
});
