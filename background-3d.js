(function () {
    'use strict';

    var container = document.getElementById('canvas-3d-background');
    if (!container) return;

    var scene, camera, renderer, particles, particleGeometry, particleMaterial;
    var glowingOrbs = [];
    var clock = new THREE.Clock();
    var scrollProgress = 0;
    var targetScrollProgress = 0;

    function getThemeColor() {
        var theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            return { r: 0.08, g: 0.72, b: 0.65 };
        }
        return { r: 0.05, g: 0.58, b: 0.53 };
    }

    function init() {
        var w = window.innerWidth;
        var h = window.innerHeight;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 2000);
        camera.position.z = 400;

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        var c = getThemeColor();
        var theme = document.documentElement.getAttribute('data-theme');
        var isDark = theme === 'dark';

        // Floating glowing orbs (soft blobs in the back)
        var orbGeometry = new THREE.SphereGeometry(1, 32, 32);
        var orbPositions = [
            { x: -180, y: 80, z: -350, scale: 120 },
            { x: 220, y: -100, z: -400, scale: 90 },
            { x: -80, y: -180, z: -300, scale: 100 },
            { x: 160, y: 120, z: -450, scale: 70 },
            { x: -250, y: -80, z: -380, scale: 60 }
        ];
        for (var o = 0; o < orbPositions.length; o++) {
            var op = orbPositions[o];
            var orbMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(c.r, c.g, c.b),
                transparent: true,
                opacity: isDark ? 0.12 : 0.08,
                depthWrite: false
            });
            var orb = new THREE.Mesh(orbGeometry, orbMat);
            orb.position.set(op.x, op.y, op.z);
            orb.scale.setScalar(op.scale);
            orb.userData = { baseX: op.x, baseY: op.y, baseZ: op.z, speed: 0.3 + Math.random() * 0.4 };
            scene.add(orb);
            glowingOrbs.push(orb);
        }

        // Particle field – starfield / constellation style
        var particleCount = 2200;
        var positions = new Float32Array(particleCount * 3);
        var size = 1400;
        var depth = 1000;

        for (var i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * size;
            positions[i * 3 + 1] = (Math.random() - 0.5) * size;
            positions[i * 3 + 2] = (Math.random() - 0.5) * depth - 150;
        }

        particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        particleMaterial = new THREE.PointsMaterial({
            color: new THREE.Color(c.r, c.g, c.b),
            size: 2.2,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        window.addEventListener('resize', onResize);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    function onResize() {
        var w = window.innerWidth;
        var h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

    function onScroll() {
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        targetScrollProgress = docHeight <= 0 ? 0 : window.scrollY / docHeight;
    }

    function animate() {
        requestAnimationFrame(animate);
        var delta = clock.getDelta();
        var t = clock.getElapsedTime();

        scrollProgress += (targetScrollProgress - scrollProgress) * delta * 2;
        var opacity = 1 - scrollProgress;
        if (particleMaterial) {
            particleMaterial.opacity = Math.max(0, 0.7 * opacity);
        }

        if (particles) {
            particles.rotation.y += 0.0006;
            particles.rotation.x = Math.sin(t * 0.12) * 0.04;
        }

        // Slow drift for glowing orbs
        for (var i = 0; i < glowingOrbs.length; i++) {
            var orb = glowingOrbs[i];
            var ud = orb.userData;
            orb.position.x = ud.baseX + Math.sin(t * ud.speed) * 25;
            orb.position.y = ud.baseY + Math.cos(t * ud.speed * 0.7) * 20;
            orb.position.z = ud.baseZ + Math.sin(t * 0.5) * 15;
        }

        renderer.render(scene, camera);
    }

    init();
    animate();

    // Update colors when theme changes
    var observer = new MutationObserver(function () {
        var c = getThemeColor();
        var theme = document.documentElement.getAttribute('data-theme');
        var isDark = theme === 'dark';
        if (particleMaterial) particleMaterial.color.setRGB(c.r, c.g, c.b);
        for (var i = 0; i < glowingOrbs.length; i++) {
            glowingOrbs[i].material.color.setRGB(c.r, c.g, c.b);
            glowingOrbs[i].material.opacity = isDark ? 0.12 : 0.08;
        }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
})();
