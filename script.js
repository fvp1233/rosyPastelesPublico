document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. PANTALLA DE BIENVENIDA (SPLASH) CON LOGO
    // ==========================================

    const introSplash = document.getElementById('intro-splash');
    const introLogo = introSplash ? introSplash.querySelector('.intro-logo') : null;

    // Reinicia la animación del logo (para poder reproducirla varias veces)
    function replayIntroAnimation() {

        if (!introLogo) {
            return;
        }

        introLogo.style.animation = 'none';
        void introLogo.offsetWidth; // Forzar reflow
        introLogo.style.animation = '';

    }

    if (introSplash) {

        document.body.classList.add('intro-active');

        const MIN_SPLASH_TIME = 1800; // milisegundos que se muestra como mínimo (carga inicial)
        const startTime = Date.now();

        function hideSplash() {

            const elapsed = Date.now() - startTime;
            const remaining = Math.max(MIN_SPLASH_TIME - elapsed, 0);

            setTimeout(() => {
                introSplash.classList.add('intro-hidden');
                document.body.classList.remove('intro-active');
            }, remaining);

        }

        if (document.readyState === 'complete') {
            hideSplash();
        } else {
            window.addEventListener('load', hideSplash);
        }

    }


    // ==========================================
    // 0.1 ANIMACIÓN DEL LOGO AL NAVEGAR POR EL MENÚ
    // ==========================================

    const NAV_SPLASH_TIME = 900; // milisegundos que se muestra al navegar

    function playSplashThen(action) {

        if (!introSplash) {
            action();
            return;
        }

        document.body.classList.add('intro-active');
        introSplash.classList.remove('intro-hidden');
        replayIntroAnimation();

        setTimeout(() => {

            action();

            introSplash.classList.add('intro-hidden');
            document.body.classList.remove('intro-active');

        }, NAV_SPLASH_TIME);

    }

    const splashLinks = document.querySelectorAll(
        '.nav-menu a, .footer-links a, .btn-card, a[href^="https://wa.me/"]'
    );

    splashLinks.forEach(link => {

        link.addEventListener('click', (event) => {

            const href = link.getAttribute('href');

            if (!href) {
                return;
            }

            const isAnchor = href.startsWith('#');
            const isExternal = link.target === '_blank';

            event.preventDefault();

            // Cerrar el menú móvil de inmediato si estaba abierto
            const openNavMenu = document.getElementById('nav-menu');
            if (openNavMenu) {
                openNavMenu.classList.remove('active');
            }

            playSplashThen(() => {

                if (isAnchor && href !== '#') {

                    const targetElement = document.querySelector(href);

                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }

                } else if (isExternal) {

                    window.open(href, '_blank');

                } else {

                    window.location.href = href;

                }

            });

        });

    });


    // ==========================================
    // 1. MENÚ MÓVIL
    // ==========================================

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuBtn && navMenu) {

        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Cerrar el menú al seleccionar una opción
        navMenu.querySelectorAll('a').forEach(link => {

            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });

        });
    }


    // ==========================================
    // 2. CARRUSEL DE INICIO
    // ==========================================

    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    let currentSlide = 0;
    let carouselInterval;

    function showSlide(index) {

        carouselSlides.forEach(slide => {
            slide.classList.remove('active');
        });

        carouselDots.forEach(dot => {
            dot.classList.remove('active');
        });

        carouselSlides[index].classList.add('active');
        carouselDots[index].classList.add('active');

        currentSlide = index;
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % carouselSlides.length;
        showSlide(nextIndex);
    }

    function startCarousel() {
        carouselInterval = setInterval(nextSlide, 5000);
    }

    function resetCarousel() {
        clearInterval(carouselInterval);
        startCarousel();
    }

    if (carouselSlides.length > 0) {

        carouselDots.forEach(dot => {

            dot.addEventListener('click', () => {
                const slideIndex = parseInt(dot.getAttribute('data-slide'), 10);
                showSlide(slideIndex);
                resetCarousel();
            });

        });

        startCarousel();
    }


    // ==========================================
    // 3. FILTRADO DE PRODUCTOS
    // ==========================================

    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const filterableCards = document.querySelectorAll('#products-grid .product-card');

    filterButtons.forEach(button => {

        button.addEventListener('click', () => {

            playSplashThen(() => {

                // Quitar "active" de todos los botones
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                });

                // Activar el botón seleccionado
                button.classList.add('active');

                // Obtener categoría
                const category = button.getAttribute('data-category');

                // Mostrar u ocultar productos (solo los de Repostería)
                filterableCards.forEach(card => {

                    const cardCategory = card.getAttribute('data-category');

                    if (category === 'todos' || category === cardCategory) {

                        card.style.display = 'flex';

                    } else {

                        card.style.display = 'none';

                        // Ocultar descripción si estaba abierta
                        card.classList.remove('show-description');
                    }

                });

            });

        });

    });


    // ==========================================
    // 4. DESPLAZAMIENTO SUAVE
    // ==========================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        // Los enlaces del menú y del footer ya tienen su propio manejo (con animación)
        if (anchor.closest('.nav-menu') || anchor.closest('.footer-links')) {
            return;
        }

        anchor.addEventListener('click', function (e) {

            e.preventDefault();

            const targetId = this.getAttribute('href');

            if (targetId === '#') {
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (targetElement) {

                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

            }

        });

    });


    // ==========================================
    // 5. DESCRIPCIÓN DE CADA PRODUCTO
    // ==========================================

    productCards.forEach(card => {

        // ------------------------------------------
        // COMPUTADORA
        // ------------------------------------------
        // Cuando el cursor entra al producto,
        // aparece automáticamente su descripción.

        card.addEventListener('mouseenter', () => {

            card.classList.add('show-description');

        });


        // Cuando el cursor sale del producto,
        // desaparece la descripción.

        card.addEventListener('mouseleave', () => {

            card.classList.remove('show-description');

        });


        // ------------------------------------------
        // CELULAR / TABLET
        // ------------------------------------------
        // En dispositivos táctiles no existe cursor,
        // por eso se puede tocar el producto.

        card.addEventListener('click', (event) => {

            // Si se presiona el botón "Ordenar",
            // no mostrar/ocultar la descripción.

            if (event.target.closest('.btn-card')) {
                return;
            }


            // Comprobar si es un dispositivo táctil

            if (
                window.matchMedia(
                    '(hover: none) and (pointer: coarse)'
                ).matches
            ) {

                // Cerrar las descripciones de los demás productos

                productCards.forEach(otherCard => {

                    if (otherCard !== card) {

                        otherCard.classList.remove(
                            'show-description'
                        );

                    }

                });


                // Mostrar u ocultar la descripción
                // del producto seleccionado

                card.classList.toggle(
                    'show-description'
                );

            }

        });

    });


    // ==========================================
    // 6. VISOR DE CATALOGO PDF (efecto libro)
    // ==========================================

    // Cambia esta ruta por la ubicacion real de tu catalogo en PDF.
    const PDF_CATALOG_URL = 'assets/Catalogo_Rosy_pasteles.pdf';

    const openPdfBtn = document.getElementById('open-pdf-catalog');
    const pdfModal = document.getElementById('pdf-viewer-modal');
    const pdfModalClose = document.getElementById('pdf-modal-close');
    const pdfBook = document.getElementById('pdf-book');
    const pdfLoading = document.getElementById('pdf-loading');
    const frontPageDiv = document.getElementById('pdf-page-front');
    const backPageDiv = document.getElementById('pdf-page-back');
    const frontCanvas = document.getElementById('pdf-canvas-front');
    const backCanvas = document.getElementById('pdf-canvas-back');
    const prevBtn = document.getElementById('pdf-prev-btn');
    const nextBtn = document.getElementById('pdf-next-btn');
    const pageIndicator = document.getElementById('pdf-page-indicator');

    if (openPdfBtn && pdfModal && typeof pdfjsLib !== 'undefined') {

        pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        let pdfDoc = null;
        let currentPage = 1;
        let totalPages = 0;
        let isFlipping = false;
        let pdfLoadStarted = false;

        // Dibuja una pagina del PDF dentro de un <canvas>
        function renderPageOnCanvas(pageNumber, canvas) {

            return pdfDoc.getPage(pageNumber).then((page) => {

                const container = pdfBook.getBoundingClientRect();
                const baseViewport = page.getViewport({ scale: 1 });

                const scale = Math.min(
                    container.width / baseViewport.width,
                    container.height / baseViewport.height
                );

                const viewport = page.getViewport({ scale: scale || 1 });

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                const ctx = canvas.getContext('2d');

                return page.render({
                    canvasContext: ctx,
                    viewport: viewport
                }).promise;

            });

        }

        function updateControls() {

            pageIndicator.textContent = `Pagina ${currentPage} de ${totalPages}`;
            prevBtn.disabled = currentPage <= 1;
            nextBtn.disabled = currentPage >= totalPages;

        }

        function loadPdfCatalog() {

            if (pdfLoadStarted) {
                return;
            }

            pdfLoadStarted = true;
            pdfLoading.style.display = 'block';

            pdfjsLib.getDocument(PDF_CATALOG_URL).promise.then((doc) => {

                pdfDoc = doc;
                totalPages = doc.numPages;
                currentPage = 1;

                return renderPageOnCanvas(currentPage, frontCanvas);

            }).then(() => {

                pdfLoading.style.display = 'none';
                pdfBook.classList.add('ready');
                updateControls();

            }).catch((error) => {

                pdfLoading.textContent =
                    'No se pudo cargar el catalogo. Verifica la ruta del PDF.';
                console.error('Error al cargar el PDF:', error);

            });

        }

        function goToPage(newPage, direction) {

            if (
                isFlipping ||
                !pdfDoc ||
                newPage < 1 ||
                newPage > totalPages ||
                newPage === currentPage
            ) {
                return;
            }

            isFlipping = true;

            renderPageOnCanvas(newPage, backCanvas).then(() => {

                frontPageDiv.classList.remove('flip-origin-right', 'flip-next', 'flip-prev');

                if (direction === 'next') {
                    frontPageDiv.classList.add('flip-next');
                } else {
                    frontPageDiv.classList.add('flip-origin-right', 'flip-prev');
                }

                // Forzar reflow antes de animar
                void frontPageDiv.offsetWidth;

                frontPageDiv.classList.add('flipping');

                const onTransitionEnd = () => {

                    frontPageDiv.removeEventListener('transitionend', onTransitionEnd);

                    // Copiar la pagina ya renderizada de "back" hacia "front"
                    const ctx = frontCanvas.getContext('2d');
                    frontCanvas.width = backCanvas.width;
                    frontCanvas.height = backCanvas.height;
                    ctx.drawImage(backCanvas, 0, 0);

                    frontPageDiv.classList.remove(
                        'flipping', 'flip-next', 'flip-prev', 'flip-origin-right'
                    );

                    currentPage = newPage;
                    updateControls();
                    isFlipping = false;

                };

                frontPageDiv.addEventListener('transitionend', onTransitionEnd);

            }).catch((error) => {

                isFlipping = false;
                console.error('Error al pasar de pagina:', error);

            });

        }

        function openPdfModal() {

            pdfModal.classList.add('active');
            pdfModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            loadPdfCatalog();

        }

        function closePdfModal() {

            pdfModal.classList.remove('active');
            pdfModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';

        }

        openPdfBtn.addEventListener('click', () => playSplashThen(openPdfModal));
        pdfModalClose.addEventListener('click', closePdfModal);

        pdfModal.addEventListener('click', (event) => {

            if (event.target === pdfModal) {
                closePdfModal();
            }

        });

        document.addEventListener('keydown', (event) => {

            if (!pdfModal.classList.contains('active')) {
                return;
            }

            if (event.key === 'Escape') {
                closePdfModal();
            } else if (event.key === 'ArrowRight') {
                goToPage(currentPage + 1, 'next');
            } else if (event.key === 'ArrowLeft') {
                goToPage(currentPage - 1, 'prev');
            }

        });

        prevBtn.addEventListener('click', () => goToPage(currentPage - 1, 'prev'));
        nextBtn.addEventListener('click', () => goToPage(currentPage + 1, 'next'));

    }

});