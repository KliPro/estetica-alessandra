document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Menu Mobile Toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });

        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
            });
        });
    }

    // 2. Animação de Fade-in ao Rolar
    const fadeElements = document.querySelectorAll(".fade-section");

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));

    // 3. Lista de Imagens da Galeria
    const galleryItems = [
        { id: 0, category: "facial", image: "imagens/ToxinaBotulínica0.jpeg" },
        { id: 1, category: "facial", image: "imagens/ToxinaBotulinica1.jpeg" },
        { id: 2, category: "facial", image: "imagens/ToxinaBotulinica2.jpeg" },
        { id: 3, category: "facial", image: "imagens/ToxinaBotulinica3.jpeg" },
        { id: 4, category: "facial", image: "imagens/ToxinaBotulinica4.jpeg" },
        { id: 5, category: "facial", image: "imagens/ToxinaBotulinica5.jpeg" }
    ];

    const galleryGrid = document.getElementById("dynamic-gallery");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const lightbox = document.getElementById("lightbox-modal");
    const lightboxImg = document.getElementById("lightbox-img");
    const btnClose = document.getElementById("close-lightbox");
    const btnNext = document.getElementById("next-btn");
    const btnPrev = document.getElementById("prev-btn");

    let currentCategory = "all";
    let filteredItems = [...galleryItems];
    let currentIndex = 0;

    // Renderização dos cards da galeria
    function renderGallery(filter = "all") {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = "";

        filteredItems = filter === "all" 
            ? galleryItems 
            : galleryItems.filter(item => item.category === filter);

        if (filteredItems.length === 0) {
            galleryGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: #888; padding: 40px 0;">Nenhum resultado cadastrado nesta categoria ainda.</p>`;
            return;
        }

        filteredItems.forEach((item, index) => {
            const thumb = document.createElement("div");
            thumb.className = "gallery-thumb";
            thumb.innerHTML = `<img src="${item.image}" alt="Resultado">`;
            thumb.addEventListener("click", () => openLightbox(index));
            galleryGrid.appendChild(thumb);
        });
    }

    // Funções do Modal
    function openLightbox(index) {
        if (!lightbox || !lightboxImg) return;
        currentIndex = index;
        lightboxImg.src = filteredItems[currentIndex].image;
        lightbox.classList.add("active");
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove("active");
    }

    function nextImage() {
        if (filteredItems.length === 0 || !lightboxImg) return;
        currentIndex = (currentIndex + 1) % filteredItems.length;
        lightboxImg.src = filteredItems[currentIndex].image;
    }

    function prevImage() {
        if (filteredItems.length === 0 || !lightboxImg) return;
        currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
        lightboxImg.src = filteredItems[currentIndex].image;
    }

    // Inicialização
    renderGallery();

    // Filtros
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentCategory = btn.getAttribute("data-filter");
            renderGallery(currentCategory);
        });
    });

    // Eventos do Modal
    if (btnClose) btnClose.addEventListener("click", closeLightbox);
    if (btnNext) btnNext.addEventListener("click", (e) => { e.stopPropagation(); nextImage(); });
    if (btnPrev) btnPrev.addEventListener("click", (e) => { e.stopPropagation(); prevImage(); });

    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content') || e.target.classList.contains('lightbox-image-container')) {
                closeLightbox();
            }
        });
    }

    // Teclado
    document.addEventListener("keydown", (e) => {
        if (!lightbox || !lightbox.classList.contains("active")) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
    });
});