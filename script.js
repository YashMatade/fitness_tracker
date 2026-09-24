/* ============================================
   COACH APEX — INTERACTIVE LOGIC
   ============================================ */

(function () {
    'use strict';

    // ---- DOM REFS ----
    const copyBtn = document.getElementById('copyBtn');
    const promptSection = document.querySelector('.prompt-section');
    const promptText = document.getElementById('promptText');
    const toast = document.getElementById('toast');
    const btnText = copyBtn.querySelector('.btn-text');

    // ---- COPY LOGIC ----
    let copyTimeout = null;

    function copyPrompt() {
        const text = promptText.textContent;

        navigator.clipboard.writeText(text).then(() => {
            showCopiedFeedback();
        }).catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showCopiedFeedback();
        });
    }

    function showCopiedFeedback() {
        // Button feedback
        copyBtn.classList.add('copied');
        btnText.textContent = 'Copied!';

        // Show toast
        toast.classList.add('visible');

        // Ripple animation on the prompt card
        createRipple();

        // Clear previous timeout
        if (copyTimeout) clearTimeout(copyTimeout);

        copyTimeout = setTimeout(() => {
            copyBtn.classList.remove('copied');
            btnText.textContent = 'Copy Prompt';
            toast.classList.remove('visible');
        }, 2500);
    }

    // Click on the copy button
    copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        copyPrompt();
    });

    // Click anywhere on the prompt section
    promptSection.addEventListener('click', (e) => {
        if (e.target.closest('.copy-btn')) return;
        copyPrompt();
    });

    // ---- RIPPLE EFFECT ----
    function createRipple() {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(244, 124, 32, 0.12), transparent 70%);
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 3;
        `;

        promptSection.appendChild(ripple);

        ripple.animate([
            { width: '0px', height: '0px', opacity: 1 },
            { width: '1200px', height: '1200px', opacity: 0 }
        ], {
            duration: 700,
            easing: 'ease-out'
        });

        setTimeout(() => ripple.remove(), 700);
    }


    // ---- PARTICLE BACKGROUND ----
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 80);

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.3 + 0.05
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            // Draw dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(244, 124, 32, ${p.opacity})`;
            ctx.fill();

            // Draw connection lines
            for (let j = i + 1; j < particles.length; j++) {
                const dx = p.x - particles[j].x;
                const dy = p.y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(244, 124, 32, ${0.04 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });

        animationId = requestAnimationFrame(drawParticles);
    }

    // Initialize particles
    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });

    // ---- INTERSECTION OBSERVER for scroll animations ----
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards and steps
    document.querySelectorAll('.feature-card, .step').forEach(el => {
        observer.observe(el);
    });


    // ---- KEYBOARD SHORTCUT ----
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Shift + C to copy
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            copyPrompt();
        }
    });

})();
