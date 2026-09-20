import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function WaterCanvasBackground({ opacity = 0.85, interactive = true }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    /* ─── 1. Scene & Camera Setup ─── */
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.022);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.set(0, 10, 26);
    camera.lookAt(0, -1, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x030712, 1);
    container.appendChild(renderer.domElement);

    /* ─── 2. Mouse Tracking ─── */
    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);

    const handleMouseMove = (e) => {
      if (!interactive) return;
      targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    /* ─── 3. Fluid Surface Mesh (PlaneGeometry 60,60,128,128) ─── */
    const waterGeo = new THREE.PlaneGeometry(60, 60, 128, 128);
    waterGeo.rotateX(-Math.PI / 2.3);

    // Custom Shader combining compound sine/cosine displacement, mouse ripple & cyber-hydraulic glow
    const waterMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColorBase: { value: new THREE.Color(0x030712) },     // Deep Canvas Background
        uColorSecondary: { value: new THREE.Color(0x0284c7) },// Aquamarine Blue
        uColorPrimary: { value: new THREE.Color(0x00f0ff) },  // Electric Cyan
        uColorSafe: { value: new THREE.Color(0x10b981) },     // Bioluminescent Green
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        varying float vElevation;
        varying vec2 vUv;
        varying vec3 vWorldPos;

        void main() {
          vUv = uv;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);

          float x = worldPos.x;
          float y = worldPos.z;

          float wave = sin(x * 0.4 + uTime) * 1.2 + cos(y * 0.3 + uTime * 0.8) * 0.8;
          wave += sin(x * 0.85 + y * 0.7 + uTime * 1.5) * 0.3;
          wave += cos(x * 1.3 - y * 1.1 + uTime * 2.1) * 0.15;

          float dist = length(worldPos.xz - uMouse * 22.0);
          float mouseDisturbance = sin(dist * 2.4 - uTime * 5.0) * exp(-dist * 0.14) * 0.9;
          wave += mouseDisturbance;

          worldPos.y += wave;
          vElevation = wave;
          vWorldPos = worldPos.xyz;

          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uColorBase;
        uniform vec3 uColorSecondary;
        uniform vec3 uColorPrimary;
        uniform vec3 uColorSafe;
        uniform float uTime;
        varying float vElevation;
        varying vec2 vUv;
        varying vec3 vWorldPos;

        void main() {
          float norm = clamp((vElevation + 2.0) / 4.0, 0.0, 1.0);

          vec3 col = mix(uColorBase, uColorSecondary, smoothstep(0.1, 0.5, norm));
          col = mix(col, uColorPrimary, smoothstep(0.48, 0.85, norm));

          float crest = smoothstep(0.82, 1.0, norm);
          col = mix(col, uColorSafe, crest * 0.4);

          float grid = abs(fract(vUv.x * 64.0 - 0.5) - 0.5) / fwidth(vUv.x * 64.0);
          grid = min(grid, abs(fract(vUv.y * 64.0 - 0.5) - 0.5) / fwidth(vUv.y * 64.0));
          float lineGlow = 1.0 - min(grid, 1.0);
          col += uColorPrimary * lineGlow * 0.18;

          float alpha = mix(0.38, 0.78, norm);
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.y = -2.8;
    scene.add(waterMesh);

    /* ─── 4. Bioluminescent Suspended Droplets (1,200 particles) ─── */
    const PARTICLE_COUNT = 1200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const pColors = new Float32Array(PARTICLE_COUNT * 3);

    const cyanColor = new THREE.Color(0x00f0ff);
    const emeraldColor = new THREE.Color(0x10b981);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = Math.random() * 28 - 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      velocities[i * 3] = (Math.random() - 0.5) * 0.015;
      velocities[i * 3 + 1] = 0.012 + Math.random() * 0.024;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.015;

      const c = Math.random() > 0.45 ? cyanColor : emeraldColor;
      pColors[i * 3] = c.r;
      pColors[i * 3 + 1] = c.g;
      pColors[i * 3 + 2] = c.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const particleMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);

          float pulse = sin(uTime * 1.8 + position.x * 0.4 + position.z * 0.3) * 0.35 + 0.65;
          gl_PointSize = 4.2 * pulse * uPixelRatio * (55.0 / -mvPos.z);
          gl_PointSize = clamp(gl_PointSize, 1.5, 16.0);

          vAlpha = pulse * 0.75;
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          float glow = pow(1.0 - dist * 2.0, 2.0);
          gl_FragColor = vec4(vColor, glow * vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    /* ─── 5. Ambient & Point Lighting ─── */
    const ambientLight = new THREE.AmbientLight(0x0284c7, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f0ff, 1.2, 50);
    pointLight.position.set(0, 8, 10);
    scene.add(pointLight);

    /* ─── 6. Animation Loop ─── */
    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      mouse.lerp(targetMouse, 0.05);

      waterMesh.rotation.z = mouse.x * 0.04;
      waterMesh.rotation.x = -Math.PI / 2.3 + mouse.y * 0.03;

      waterMat.uniforms.uTime.value = elapsed;
      waterMat.uniforms.uMouse.value.copy(mouse);
      particleMat.uniforms.uTime.value = elapsed;

      const pos = particleGeo.attributes.position.array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos[i * 3 + 1] += velocities[i * 3 + 1];
        pos[i * 3] += velocities[i * 3] + Math.sin(elapsed * 0.6 + i) * 0.003;
        pos[i * 3 + 2] += velocities[i * 3 + 2] + Math.cos(elapsed * 0.4 + i) * 0.003;

        if (pos[i * 3 + 1] > 20) {
          pos[i * 3 + 1] = -6;
          pos[i * 3] = (Math.random() - 0.5) * 60;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    /* ─── 7. Throttled Window Resize ─── */
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        particleMat.uniforms.uPixelRatio.value = renderer.getPixelRatio();
      }, 100);
    };
    window.addEventListener('resize', handleResize);

    /* ─── 8. Cleanup ─── */
    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      waterGeo.dispose();
      waterMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}
