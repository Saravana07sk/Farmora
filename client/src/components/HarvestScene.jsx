import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HarvestScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x10251e, 0.035);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 80);
    camera.position.set(0, 0.35, 8.4);

    scene.add(new THREE.AmbientLight(0xc5e86c, 0.55));
    const keyLight = new THREE.PointLight(0xc5e86c, 18, 28, 2);
    keyLight.position.set(4.2, 3.4, 5);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xe47744, 12, 24, 2);
    rimLight.position.set(-5, -2.2, 3);
    scene.add(rimLight);

    const group = new THREE.Group();
    scene.add(group);

    const globe = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.15, 2),
      new THREE.MeshStandardMaterial({
        color: 0x183025,
        emissive: 0x10251e,
        metalness: 0.35,
        roughness: 0.28,
        transparent: true,
        opacity: 0.88,
      }),
    );
    group.add(globe);

    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.18, 2),
      new THREE.MeshBasicMaterial({ color: 0xc5e86c, wireframe: true, transparent: true, opacity: 0.38 }),
    );
    group.add(wire);

    const inner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.55, 1),
      new THREE.MeshBasicMaterial({ color: 0xe47744, wireframe: true, transparent: true, opacity: 0.18 }),
    );
    group.add(inner);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.05, 0.012, 16, 180),
      new THREE.MeshBasicMaterial({ color: 0xc5e86c, transparent: true, opacity: 0.45 }),
    );
    ring.rotation.x = Math.PI / 2.4;
    group.add(ring);

    const ringTwo = ring.clone();
    ringTwo.rotation.x = Math.PI / 1.7;
    ringTwo.rotation.z = 0.6;
    ringTwo.material = ring.material.clone();
    ringTwo.material.color = new THREE.Color(0xffb887);
    ringTwo.material.opacity = 0.28;
    group.add(ringTwo);

    const nodeGeo = new THREE.SphereGeometry(0.07, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({ color: 0xc5e86c, emissive: 0x6f9a2a, roughness: 0.2 });
    const produceMat = [
      new THREE.MeshStandardMaterial({ color: 0xe23d2c, emissive: 0x4a120c, roughness: 0.45 }),
      new THREE.MeshStandardMaterial({ color: 0xc5e86c, emissive: 0x31480f, roughness: 0.4 }),
      new THREE.MeshStandardMaterial({ color: 0xffb887, emissive: 0x4a2612, roughness: 0.35 }),
    ];
    const nodes = [];
    for (let i = 0; i < 18; i += 1) {
      const phi = Math.acos(-1 + (2 * i) / 18);
      const theta = Math.sqrt(18 * Math.PI) * phi;
      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      mesh.position.setFromSphericalCoords(2.18, phi, theta);
      group.add(mesh);
      nodes.push(mesh);
    }

    const produce = [];
    for (let i = 0; i < 9; i += 1) {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.16 + (i % 3) * 0.04, 24, 24), produceMat[i % 3]);
      mesh.userData = {
        radius: 2.85 + (i % 4) * 0.28,
        speed: 0.18 + (i % 5) * 0.05,
        offset: i * 0.72,
        tilt: 0.35 + (i % 3) * 0.2,
      };
      group.add(mesh);
      produce.push(mesh);
    }

    const particleCount = 900;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({ color: 0xc5e86c, size: 0.028, transparent: true, opacity: 0.55 }),
    );
    scene.add(particles);

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onPointerMove = (event) => {
      const rect = mount.getBoundingClientRect();
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      const nextWidth = mount.clientWidth || window.innerWidth;
      const nextHeight = mount.clientHeight || window.innerHeight;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    };
    window.addEventListener('resize', onResize);

    let frame = 0;
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(mount);

    const clock = new THREE.Clock();
    const animate = () => {
      frame = window.requestAnimationFrame(animate);
      if (!visible) return;
      const t = clock.getElapsedTime();
      pointer.x += (target.x - pointer.x) * 0.04;
      pointer.y += (target.y - pointer.y) * 0.04;

      const motion = reducedMotion ? 0 : 1;
      group.rotation.y = t * 0.12 * motion + pointer.x * 0.35;
      group.rotation.x = 0.18 + pointer.y * -0.18;
      ring.rotation.z = t * 0.22 * motion;
      ringTwo.rotation.y = t * -0.16 * motion;
      inner.rotation.y = t * -0.28 * motion;
      wire.rotation.y = t * 0.08 * motion;
      particles.rotation.y = t * 0.02 * motion;

      produce.forEach((mesh) => {
        const { radius, speed, offset, tilt } = mesh.userData;
        const angle = t * speed * motion + offset;
        mesh.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle * 0.8) * tilt,
          Math.sin(angle) * radius,
        );
      });

      camera.position.x = pointer.x * 0.7;
      camera.position.y = 0.35 + pointer.y * -0.35;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      globe.geometry.dispose();
      wire.geometry.dispose();
      inner.geometry.dispose();
      ring.geometry.dispose();
      nodeGeo.dispose();
      particleGeo.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="agri-hero-canvas" aria-hidden="true" />;
};

export default HarvestScene;
