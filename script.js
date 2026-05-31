const canvas = document.getElementById('mcCanvas');
const ctx = canvas.getContext('2d');
const terrainCanvas = document.createElement('canvas');
const terrainCtx = terrainCanvas.getContext('2d');
let W, H;

function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    terrainCanvas.width = W;
    terrainCanvas.height = H;
    if (texLoaded) drawTerrainStatic();
}
resize();
window.addEventListener('resize', resize);

const BS = 16;
const textures = {};
let texLoaded = false;

function loadTextures() {
    let loaded = 0;
    const names = ['grass', 'dirt', 'stone'];
    names.forEach(name => {
        const img = new Image();
        img.onload = () => {
            loaded++;
            if (loaded === names.length) {
                texLoaded = true;
                drawTerrainStatic();
            }
        };
        img.src = name + '.png';
        textures[name] = img;
    });
}

function drawTerrainStatic() {
    terrainCtx.clearRect(0, 0, W, H);
    const groundY = Math.floor(H * 0.75);
    const grassY = groundY - BS * 2;
    const dirtY = groundY - BS;

    for (let x = 0; x <= W + BS; x += BS)
        terrainCtx.drawImage(textures.grass, x, grassY, BS, BS);
    for (let x = 0; x <= W + BS; x += BS)
        terrainCtx.drawImage(textures.dirt, x, dirtY, BS, BS);
    for (let y = groundY; y < H; y += BS)
        for (let x = 0; x <= W + BS; x += BS)
            terrainCtx.drawImage(textures.stone, x, y, BS, BS);
}

function render(time) {
    const groundY = Math.floor(H * 0.75);
    const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
    const t = (Math.sin(time * 0.0003) * 0.5 + 0.5) * 0.3 + 0.1;
    skyGrad.addColorStop(0, `hsl(230, 30%, ${8 + t * 8}%)`);
    skyGrad.addColorStop(0.5, `hsl(220, 25%, ${10 + t * 6}%)`);
    skyGrad.addColorStop(1, `hsl(210, 20%, ${12 + t * 4}%)`);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, groundY);

    if (!render.stars) {
        render.stars = [];
        for (let i = 0; i < 80; i++) render.stars.push({
            x: Math.random() * W, y: Math.random() * groundY * 0.7,
            r: Math.random() * 1.5 + 0.5, sp: Math.random() * 0.5 + 0.2
        });
    }
    render.stars.forEach(s => {
        ctx.globalAlpha = (Math.sin(time * 0.001 * s.sp + s.x) * 0.3 + 0.7) * 0.6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;

    if (texLoaded) ctx.drawImage(terrainCanvas, 0, 0);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);
loadTextures();

const particleContainer = document.getElementById('particles');
const bc = ['#44bd32', '#3d6b34', '#6b4c2a', '#7a7a7a', '#f0c040', '#4070f0', '#c04040'];
for (let i = 0; i < 12; i++) {
    const el = document.createElement('div');
    el.className = 'particle';
    const s = 16 + Math.random() * 20;
    el.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*100}%;background:${bc[i%7]};border-radius:2px;border:1px solid rgba(0,0,0,0.2);animation-duration:${15+Math.random()*20}s;animation-delay:${Math.random()*20}s`;
    particleContainer.appendChild(el);
}

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60));

const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));

const track = document.getElementById('carouselTrack');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
function goToSlide(i) {
    currentSlide = i;
    track.style.transform = `translateX(-${i*100}%)`;
    dots.forEach((d, j) => d.classList.toggle('active', j === i));
}
dots.forEach(d => d.addEventListener('click', () => goToSlide(parseInt(d.dataset.index))));
setInterval(() => goToSlide((currentSlide+1)%dots.length), 5000);

const counters = document.querySelectorAll('.stat-num');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const t = parseInt(e.target.dataset.target);
            let c = 0;
            const inc = Math.max(1, Math.ceil(t/60));
            const iv = setInterval(() => {
                c += inc;
                if (c >= t) { e.target.textContent = t+(t===100?'%':'+'); clearInterval(iv); }
                else e.target.textContent = c;
            }, 25);
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.5 });
counters.forEach(c => observer.observe(c));

const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => { glow.style.left = e.clientX+'px'; glow.style.top = e.clientY+'px'; });
document.addEventListener('mouseleave', () => glow.style.opacity = '0');
document.addEventListener('mouseenter', () => glow.style.opacity = '1');

const revealEls = document.querySelectorAll('.feature-card, .section-header, .download-card');
const ro = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
            ro.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });
revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    ro.observe(el);
});
