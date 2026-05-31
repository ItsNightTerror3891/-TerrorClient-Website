// CANVAS MINECRAFT BACKGROUND
const canvas = document.getElementById('mcCanvas');
const ctx = canvas.getContext('2d');
let W, H;

function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const TERRAIN_BLOCK_SIZE = 16;
const terrainColors = {
    grass: ['#4a7c3f', '#3d6b34', '#5a8f4f', '#2d5a24'],
    dirt: ['#6b4c2a', '#5a3e22', '#7a5c32', '#4d341c'],
    stone: ['#7a7a7a', '#6a6a6a', '#8a8a8a', '#5a5a5a']
};

function drawBlock(x, y, size, colors) {
    const idx = (Math.floor(x / size) * 7 + Math.floor(y / size) * 13) % colors.length;
    ctx.fillStyle = colors[idx];
    ctx.fillRect(x, y, size, size);
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, size, size);
}

function drawTerrain(time) {
    const groundY = H * 0.75;
    const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
    const t = (Math.sin(time * 0.0003) * 0.5 + 0.5) * 0.3 + 0.1;
    skyGrad.addColorStop(0, `hsl(230, 30%, ${8 + t * 8}%)`);
    skyGrad.addColorStop(0.5, `hsl(220, 25%, ${10 + t * 6}%)`);
    skyGrad.addColorStop(1, `hsl(210, 20%, ${12 + t * 4}%)`);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, groundY);

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    if (!drawTerrain.stars) {
        drawTerrain.stars = [];
        for (let i = 0; i < 80; i++) {
            drawTerrain.stars.push({
                x: Math.random() * W, y: Math.random() * groundY * 0.7,
                r: Math.random() * 1.5 + 0.5, speed: Math.random() * 0.5 + 0.2
            });
        }
    }
    drawTerrain.stars.forEach(s => {
        const twinkle = Math.sin(time * 0.001 * s.speed + s.x) * 0.3 + 0.7;
        ctx.globalAlpha = twinkle * 0.6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;

    const grassY = groundY - TERRAIN_BLOCK_SIZE * 2;
    for (let x = 0; x <= W + TERRAIN_BLOCK_SIZE; x += TERRAIN_BLOCK_SIZE)
        drawBlock(x, grassY, TERRAIN_BLOCK_SIZE, terrainColors.grass);

    const dirtY = groundY - TERRAIN_BLOCK_SIZE;
    for (let x = 0; x <= W + TERRAIN_BLOCK_SIZE; x += TERRAIN_BLOCK_SIZE)
        drawBlock(x, dirtY, TERRAIN_BLOCK_SIZE, terrainColors.dirt);

    for (let y = groundY; y < H; y += TERRAIN_BLOCK_SIZE)
        for (let x = 0; x <= W + TERRAIN_BLOCK_SIZE; x += TERRAIN_BLOCK_SIZE)
            drawBlock(x, y, TERRAIN_BLOCK_SIZE, terrainColors.stone);

    ctx.strokeStyle = '#5a8f4f';
    ctx.lineWidth = 2;
    for (let x = 0; x < W; x += 24 + Math.sin(x * 0.5) * 8) {
        const bx = Math.floor(x / TERRAIN_BLOCK_SIZE) * TERRAIN_BLOCK_SIZE + TERRAIN_BLOCK_SIZE / 2;
        const by = grassY;
        const sway = Math.sin(time * 0.002 + x * 0.02) * 3;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.quadraticCurveTo(bx + sway, by - 10, bx + sway * 1.5, by - 18);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(bx - 4, by);
        ctx.quadraticCurveTo(bx - 4 + sway, by - 8, bx - 4 + sway * 1.5, by - 14);
        ctx.stroke();
    }

    ctx.fillStyle = 'rgba(200, 210, 230, 0.06)';
    for (let i = 0; i < 4; i++) {
        const cx = ((time * 0.02 + i * W * 0.3) % (W + 200)) - 100;
        const cy = 60 + i * 50 + Math.sin(i * 2) * 20;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 80 + i * 20, 20 + i * 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx - 40, cy + 5, 50, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + 40, cy + 3, 45, 12, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}

function render(time) {
    drawTerrain(time);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);

// BLOCK PARTICLES
const particleContainer = document.getElementById('particles');
const blockColors = ['#44bd32', '#3d6b34', '#6b4c2a', '#7a7a7a', '#f0c040', '#4070f0', '#c04040'];

for (let i = 0; i < 12; i++) {
    const el = document.createElement('div');
    el.className = 'particle';
    const size = 16 + Math.random() * 20;
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.left = Math.random() * 100 + '%';
    el.style.background = blockColors[Math.floor(Math.random() * blockColors.length)];
    el.style.borderRadius = '2px';
    el.style.border = '1px solid rgba(0,0,0,0.2)';
    el.style.animationDuration = (15 + Math.random() * 20) + 's';
    el.style.animationDelay = (Math.random() * 20) + 's';
    particleContainer.appendChild(el);
}

// NAVBAR SCROLL
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// HAMBURGER
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));

// CAROUSEL
const track = document.getElementById('carouselTrack');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;

function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
}

dots.forEach(d => {
    d.addEventListener('click', () => goToSlide(parseInt(d.dataset.index)));
});

setInterval(() => goToSlide((currentSlide + 1) % dots.length), 5000);

// COUNTER ANIMATION
const counters = document.querySelectorAll('.stat-num');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target);
            let current = 0;
            const inc = Math.max(1, Math.ceil(target / 60));
            const interval = setInterval(() => {
                current += inc;
                if (current >= target) {
                    entry.target.textContent = target + (target === 100 ? '%' : '+');
                    clearInterval(interval);
                } else entry.target.textContent = current;
            }, 25);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
counters.forEach(c => observer.observe(c));

// CURSOR GLOW
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
});
document.addEventListener('mouseleave', () => glow.style.opacity = '0');
document.addEventListener('mouseenter', () => glow.style.opacity = '1');

// REVEAL ON SCROLL
const revealEls = document.querySelectorAll('.feature-card, .section-header, .download-card');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});
