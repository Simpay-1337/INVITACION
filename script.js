document.addEventListener('DOMContentLoaded', () => {

    // Bloquear scroll inicial
    document.body.classList.add('no-scroll');

    // =========================================
    // 1. ANIMACIÓN DE LA CARTA Y AUDIO
    // =========================================
    const entryGate = document.getElementById('entry-gate');
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const entryControls = document.getElementById('entry-controls');
    const btnEnterMusic = document.getElementById('btn-enter-music');
    const btnEnterNoMusic = document.getElementById('btn-enter-nomusic');
    const bgMusic = document.getElementById('bg-music');
    const musicToggleBtn = document.getElementById('music-toggle-btn');

    const startEnvelopeAnimation = () => {
        // 1. Ocultar botones
        entryControls.classList.add('hidden');
        
        // 2. Abrir la solapa del sobre
        setTimeout(() => {
            envelopeWrapper.classList.add('open');
            
            // 3. Sacar la carta después de que la solapa se abre
            setTimeout(() => {
                envelopeWrapper.classList.add('pull');
                
                // 4. Desvanecer toda la pantalla de entrada
                setTimeout(() => {
                    entryGate.classList.add('hidden');
                    
                    // 5. Permitir scroll
                    setTimeout(() => {
                        document.body.classList.remove('no-scroll');
                        entryGate.style.display = 'none'; // Quitar del DOM visual
                    }, 1500); // tiempo del fade-out del entry-gate

                }, 2000); // tiempo para leer la carta
                
            }, 1000); // tiempo que tarda la solapa en abrirse

        }, 300);
    };

    if (btnEnterMusic) {
        btnEnterMusic.addEventListener('click', () => {
            bgMusic.play().catch(e => console.log("Auto-play bloqueado:", e));
            musicToggleBtn.classList.remove('paused');
            startEnvelopeAnimation();
        });
    }

    if (btnEnterNoMusic) {
        btnEnterNoMusic.addEventListener('click', () => {
            musicToggleBtn.classList.add('paused');
            startEnvelopeAnimation();
        });
    }

    if (musicToggleBtn) {
        musicToggleBtn.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play();
                musicToggleBtn.classList.remove('paused');
            } else {
                bgMusic.pause();
                musicToggleBtn.classList.add('paused');
            }
        });
    }

    // =========================================
    // 2. CUENTA REGRESIVA
    // =========================================
    const countDownDate = new Date("Jun 20, 2026 14:00:00").getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        if (distance < 0) {
            document.getElementById("cd-days").innerText = "00";
            document.getElementById("cd-hours").innerText = "00";
            document.getElementById("cd-minutes").innerText = "00";
            document.getElementById("cd-seconds").innerText = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("cd-days").innerText = days.toString().padStart(2, '0');
        document.getElementById("cd-hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("cd-minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("cd-seconds").innerText = seconds.toString().padStart(2, '0');
    };

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // =========================================
    // 3. EFECTO FADE-UP AL HACER SCROLL
    // =========================================
    const fadeElements = document.querySelectorAll('.fade-up');

    const checkFade = () => {
        const triggerBottom = window.innerHeight * 0.85;
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                element.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', checkFade);
    checkFade(); 

    // =========================================
    // 4. EFECTO DE VIDEO SCRUBBING
    // =========================================
    const video = document.getElementById('scroll-video');
    
    video.addEventListener('loadedmetadata', () => {
        video.pause();
        window.addEventListener('scroll', () => {
            // Solo procesar si el scroll está activo (carta ya se fue)
            if (document.body.classList.contains('no-scroll')) return;

            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const maxScroll = Math.max(
                document.body.scrollHeight, 
                document.documentElement.scrollHeight
            ) - window.innerHeight;

            if (maxScroll > 0) {
                const scrollFraction = scrollTop / maxScroll;
                const videoTime = video.duration * scrollFraction;
                if (!isNaN(videoTime) && isFinite(videoTime)) {
                    requestAnimationFrame(() => {
                        video.currentTime = videoTime;
                    });
                }
            }
        });
    });


    // =========================================
    // 5. CARRUSEL RETRATOS (3 FOTOS ROTATIVO)
    // =========================================
    const retratoItems = document.querySelectorAll('.retrato-item');
    const retratosDots = document.querySelectorAll('.retrato-dot');
    const imgs = ['assets/img/1.jpg', 'assets/img/2.jpg', 'assets/img/3.jpg'];

    // Estado: índice de la foto CENTRAL
    let centerIdx = 0;

    function updateRetratos() {
        const total = imgs.length;
        const leftIdx  = (centerIdx - 1 + total) % total;
        const rightIdx = (centerIdx + 1) % total;

        const [leftItem, centerItem, rightItem] = retratoItems;
        leftItem.querySelector('.retrato-img').src   = imgs[leftIdx];
        centerItem.querySelector('.retrato-img').src = imgs[centerIdx];
        rightItem.querySelector('.retrato-img').src  = imgs[rightIdx];

        // Dots
        retratosDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === centerIdx);
        });
    }

    // Auto-rotate cada 4 segundos
    if (retratoItems.length > 0) {
        updateRetratos();
        setInterval(() => {
            centerIdx = (centerIdx + 1) % imgs.length;
            updateRetratos();
        }, 4000);

        // Click en dots
        retratosDots.forEach(dot => {
            dot.addEventListener('click', () => {
                centerIdx = parseInt(dot.dataset.index);
                updateRetratos();
            });
        });
    }


    // =========================================
    // 6. TOGGLE FORMULARIO RSVP
    // =========================================
    const rsvpToggleBtn = document.getElementById('rsvp-toggle-btn');
    const rsvpFormWrap  = document.getElementById('rsvp-form-wrap');

    if (rsvpToggleBtn && rsvpFormWrap) {
        rsvpToggleBtn.addEventListener('click', () => {
            rsvpFormWrap.classList.toggle('hidden');
            rsvpToggleBtn.textContent = rsvpFormWrap.classList.contains('hidden')
                ? 'Confirmar asistencia'
                : 'Ocultar formulario';
        });
    }

    // =========================================
    // 7. FORMULARIO RSVP
    // =========================================
    const form = document.getElementById('rsvp-form');
    const submitBtn = document.getElementById('submit-btn');
    const formMessage = document.getElementById('form-message');

    // URL DEL GOOGLE APPS SCRIPT
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/TU_SCRIPT_ID_AQUI/exec';

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (GOOGLE_SCRIPT_URL.includes('TU_SCRIPT_ID_AQUI')) {
                formMessage.textContent = 'Falta conectar tu Google Sheet. (Ver instrucciones)';
                formMessage.className = 'form-message error';
                formMessage.classList.remove('hidden');
                return;
            }

            const formData = new FormData(form);
            const data = new URLSearchParams(formData);

            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Enviando...';
            formMessage.classList.add('hidden');

            try {
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    body: data,
                    mode: 'no-cors' 
                });

                formMessage.textContent = '¡Gracias por confirmar!';
                formMessage.className = 'form-message success';
                formMessage.classList.remove('hidden');
                form.reset();
            } catch (error) {
                formMessage.textContent = 'Error al enviar. Intenta de nuevo.';
                formMessage.className = 'form-message error';
                formMessage.classList.remove('hidden');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Confirmar';
            }
        });
    }

    // =========================================
    // 8. EFECTOS MÁGICOS (PARTÍCULAS)
    // =========================================
    function createParticles() {
        const container = document.getElementById('particles-container');
        if (!container) return;
        
        const particleCount = 25;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random properties
            const size = Math.random() * 6 + 2;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const duration = Math.random() * 10 + 5;
            const delay = Math.random() * 5;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.top = `${top}%`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            
            container.appendChild(particle);
        }
    }
    
    // Iniciar partículas
    createParticles();

});
