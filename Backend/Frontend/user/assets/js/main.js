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

document.addEventListener('DOMContentLoaded', () => {
  // Inisialisasi modal dan referensi elemen terkait
  const modal = document.getElementById('certificateModal');
  const closeModalButton = document.getElementById('closeModal');
  const modalContent = document.getElementById('modalContent');

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
          const wrapper = document.querySelector('.certification__cards');
          if (!wrapper) {
            console.error('Certification cards container not found!');
            return;
          }
          wrapper.innerHTML = '';

          certificates.forEach(cert => {
            // Helper: build Issue date string
            let issueString = '';
            if (cert.IssueMonth && cert.IssueYear) {
              const monthName = getMonthName(cert.IssueMonth);
              issueString = `${monthName} ${cert.IssueYear}`;
            }

            // Helper: build End date string
            let endString = '';
            if (cert.EndMonth && cert.EndYear) {
              const endMonthName = getMonthName(cert.EndMonth);
              endString = `${endMonthName} ${cert.EndYear}`;
            } else {
              endString = 'No Expiry Date';
            }

            // Menangani multiple images
            const imagePaths = cert.Images ? cert.Images.split(',') : [];
            const firstImage = imagePaths.length > 0 ? imagePaths[0].trim() : '';
            const additionalImagesCount = imagePaths.length > 1 ? imagePaths.length - 1 : 0;

            // Debugging: Periksa nilai imagePaths, firstImage, additionalImagesCount
            console.log(`Certificate ID: ${cert.ID}`);
            console.log(`Images: ${cert.Images}`);
            console.log(`First Image: ${firstImage}`);
            console.log(`Additional Images Count: ${additionalImagesCount}`);

            // Buat card
            const card = document.createElement('div');
            card.classList.add('certification__card', 'swiper-slide');
            card.setAttribute('data-id', cert.ID);

            // Periksa apakah firstImage kosong
            const imageSrc = firstImage ? `/uploads/certificate/${encodeURIComponent(firstImage)}` : '/uploads/certificate/default.jpg';

            card.innerHTML = `
                        <div class="certification__img-wrapper">
                            <img src="${imageSrc}" alt="${cert.Publisher}" class="certification__img">
                            ${additionalImagesCount > 0 ? `<span class="image-count">+${additionalImagesCount}</span>` : ''}
                        </div>
                        <div class="certification__content">
                            <h1 class="certification__title">${cert.Title}</h1>
                            <h3 class="certification__publisher">${cert.Publisher}</h3>
                            <!-- Tambahkan info Issue & End -->
                            <p class="certification__dates">
                                <strong>Issue:</strong> ${issueString}<br>
                                <strong>End:</strong> ${endString}
                            </p>
                        </div>
                    `;

            // Card onClick => fetch detail, buka modal
            card.addEventListener('click', () => {
              const certId = card.getAttribute('data-id');
              if (!certId) return;

              fetch(`/certificates/${certId}`)
                  .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch certificate detail');
                    return response.json();
                  })
                  .then(certDetail => {
                    // Build detail Issue & End
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

                    // Tampilkan skill (jika misal `certDetail.skills` = "ML, CV, UL")
                    let skillsStr = '';
                    if (certDetail.Skills) {
                      skillsStr = `<p><strong>Skills:</strong> ${certDetail.Skills}</p>`;
                    }

                    // Tampilkan verification link (jika ada)
                    let verifyLink = '';
                    if (certDetail.VerificationLink) {
                      verifyLink = `
                                        <p>
                                            <strong>Verification Link:</strong> 
                                            <a href="${certDetail.VerificationLink}" target="_blank">Open Link</a>
                                        </p>
                                    `;
                    }

                    // Tampilkan category (opsional)
                    let categoryStr = '';
                    if (certDetail.Category) {
                      categoryStr = `<p><strong>Category:</strong> ${certDetail.Category}</p>`;
                    }

                    const dateCreated = certDetail.CreatedAt ? formatDate(certDetail.CreatedAt) : 'N/A';

                    // Sanitasi deskripsi
                    const sanitizedDescription = DOMPurify.sanitize(certDetail.Description);

                    // Menangani multiple images di modal
                    const modalImagePaths = certDetail.Images ? certDetail.Images.split(',') : [];
                    let modalImagesHTML = '';
                    modalImagePaths.forEach(img => {
                      if (img.trim() !== '') {
                        modalImagesHTML += `<div class="swiper-slide"><img src="/uploads/certificate/${encodeURIComponent(img.trim())}" alt="${certDetail.Publisher}" /></div>`;
                      }
                    });

                    // Pastikan ada minimal satu slide
                    if (modalImagesHTML === '') {
                      modalImagesHTML = `<div class="swiper-slide"><img src="/uploads/certificate/default.jpg" alt="${certDetail.Publisher}" /></div>`;
                    }

                    modalContent.innerHTML = `
                                    <button id="closeModal">Close</button>
                                    <h1 style="text-align: center; font-size:45px;">${certDetail.Title}</h1>
                                    <p style="text-align: center; font-size : 20px;"><strong>Issued By:</strong> ${certDetail.Publisher}</p>
                                    
                                    <!-- Swiper Container -->
                                    <div class="swiper-container-modal">
                                        <div class="swiper-wrapper">${modalImagesHTML}</div>
                                        <!-- Add Navigation -->
                                        <div class="swiper-button-next"></div>
                                        <div class="swiper-button-prev"></div>
                                    </div>
                                    
                                    <p style="font-size : 18px;"><strong>Description:</strong></p>
                                    <div style="font-size: 16px;">${sanitizedDescription}</div>
                                    
                                    <p><strong>Issue:</strong> ${detailIssue}</p>
                                    <p><strong>End:</strong> ${detailEnd}</p>
                                    
                                    ${categoryStr}
                                    ${skillsStr}
                                    ${verifyLink}
                                    
                                    <p><strong>Created At:</strong> ${dateCreated}</p>
                                `;

                    // Inisialisasi Swiper untuk modal
                    // Pastikan hanya inisialisasi Swiper sekali
                    if (!modal.querySelector('.swiper-container-modal').swiper) {
                      new Swiper('.swiper-container-modal', {
                        loop: true,
                        navigation: {
                          nextEl: '.swiper-button-next',
                          prevEl: '.swiper-button-prev',
                        },
                      });
                    }

                    // Tambahkan event listener untuk tombol close di modal
                    const closeModalBtn = modalContent.querySelector('#closeModal');
                    if (closeModalBtn) {
                      closeModalBtn.addEventListener('click', () => {
                        modal.classList.remove('active');
                      });
                    }

                    // Tampilkan modal
                    modal.classList.add('active');
                  })
                  .catch(err => {
                    console.error('Error fetching certificate details:', err);
                  });
            });

            wrapper.appendChild(card);
          });

          // Inisialisasi Swiper untuk Landing Page
          // Pastikan hanya inisialisasi sekali
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

  // Helper function: month number -> month name
  function getMonthName(num) {
    const months = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];
    return months[num - 1] || "";
  }

  // Panggil fungsi untuk memuat sertifikat
  loadCertificatesForHomepage();

  // Event listener untuk tombol Close pada modal (fallback)
  closeModalButton.addEventListener('click', () => {
    modal.classList.remove('active');
  });
});