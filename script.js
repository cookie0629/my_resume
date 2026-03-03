// ==========================================
// 1. 3D 几何粒子连线背景 (Canvas 特效)
// ==========================================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
// 颜色取CSS变量的荧光青
const particleColor = 'rgba(0, 255, 204, 0.8)';
const lineColor = 'rgba(0, 255, 204, ';

// 设置画布大小
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', setCanvasSize);
setCanvasSize();

// 粒子类定义
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; // 极简的点
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        // 碰撞边界反弹
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
    }
}

// 初始化粒子网络
function initParticles() {
    particlesArray = [];
    const numberOfParticles = (canvas.width * canvas.height) / 15000; // 密度计算
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

// 动画循环与几何连线
function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        // 检测距离，绘制网格线
        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 阈值：节点足够近时连线
            if (distance < 120) {
                // 距离越近，透明度越高，呈现 3D 纵深感
                const opacity = 1 - (distance / 120);
                ctx.beginPath();
                ctx.strokeStyle = lineColor + opacity + ')';
                ctx.lineWidth = 1;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
}

initParticles();
animateParticles();


// ==========================================
// 2. Scroll Reveal 滚动监听淡入动画
// ==========================================
function revealElements() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    const elementVisible = 100; // 元素距离底部多少触发

    reveals.forEach(reveal => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
}

// 监听滚动事件，并初始化执行一次
window.addEventListener('scroll', revealElements);
revealElements();


// ==========================================
// 3. 中英俄三语切换逻辑 (原生实现)
// ==========================================
function switchLang(lang) {
    // 1. 切换按钮状态
    document.querySelectorAll('.lang-switcher button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`btn-${lang}`).classList.add('active');

    // 2. 遍历带有 i18n 类的 DOM，替换对应文本
    const elements = document.querySelectorAll('.i18n');
    elements.forEach(el => {
        const newText = el.getAttribute(`data-${lang}`);
        if (newText) {
            el.textContent = newText;
        }
    });
}