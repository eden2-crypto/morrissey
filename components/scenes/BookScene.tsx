'use client';

import { ContactShadows, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '@/lib/use-browser-state';

type Progress = { current: number };

const BOOK_WIDTH = 1.5;
const BOOK_HEIGHT = 2.3;
const COVER_DEPTH = 0.12;

export function BookScene({ progress, coverSrc }: { progress: Progress; coverSrc: string }) {
  const reduced = usePrefersReducedMotion();
  const { gl } = useThree();
  const cover = useTexture(coverSrc);
  const bookRef = useRef<THREE.Group>(null);
  const drag = useRef({ active: false, lastX: 0, lastY: 0, offsetX: 0, offsetY: 0 });
  const rotation = useRef({ x: 0, y: 0 });

  const materials = useMemo(() => {
    cover.colorSpace = THREE.SRGBColorSpace;
    cover.anisotropy = 4;
    const coverMaterial = new THREE.MeshPhysicalMaterial({
      map: cover,
      roughness: 0.55,
      metalness: 0,
      clearcoat: 0.35,
      clearcoatRoughness: 0.45,
    });
    const clothMaterial = new THREE.MeshStandardMaterial({ color: '#1b1d22', roughness: 0.85 });
    const pageMaterial = new THREE.MeshStandardMaterial({ color: '#e6dccb', roughness: 0.92 });
    return { coverMaterial, clothMaterial, pageMaterial };
  }, [cover]);

  useEffect(() => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    const element = gl.domElement;
    const onMove = (event: PointerEvent) => {
      if (!drag.current.active) return;
      drag.current.offsetY += (event.clientX - drag.current.lastX) * 0.008;
      drag.current.offsetX = Math.max(-0.6, Math.min(0.6, drag.current.offsetX + (event.clientY - drag.current.lastY) * 0.004));
      drag.current.lastX = event.clientX;
      drag.current.lastY = event.clientY;
    };
    const onUp = () => {
      drag.current.active = false;
      element.style.cursor = 'grab';
    };
    const onDown = (event: PointerEvent) => {
      drag.current.active = true;
      drag.current.lastX = event.clientX;
      drag.current.lastY = event.clientY;
      element.style.cursor = 'grabbing';
    };
    element.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    element.style.cursor = 'grab';
    return () => {
      element.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      element.style.cursor = '';
    };
  }, [gl]);

  useFrame(({ clock }, delta) => {
    const book = bookRef.current;
    if (!book) return;
    const idle = reduced ? 0 : Math.sin(clock.elapsedTime * 0.4) * 0.12;
    const targetY = drag.current.offsetY + progress.current * Math.PI * 0.55 + idle - 0.35;
    const targetX = drag.current.offsetX - 0.08;
    const ease = 1 - Math.exp(-delta * 5);
    rotation.current.y += (targetY - rotation.current.y) * ease;
    rotation.current.x += (targetX - rotation.current.x) * ease;
    book.rotation.set(rotation.current.x, rotation.current.y, 0);
    book.position.y = reduced ? 0 : Math.sin(clock.elapsedTime * 0.8) * 0.04;
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <spotLight
        position={[-3.5, 4.5, 4]}
        angle={0.55}
        penumbra={1}
        intensity={45}
        color="#f5e6cc"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[3.5, 1, -3]} intensity={8} color="#6f94c4" />
      <group ref={bookRef}>
        <mesh castShadow material={[materials.clothMaterial, materials.clothMaterial, materials.pageMaterial, materials.pageMaterial, materials.coverMaterial, materials.coverMaterial]}>
          <boxGeometry args={[BOOK_WIDTH, BOOK_HEIGHT, COVER_DEPTH]} />
        </mesh>
        <mesh castShadow position={[0.03, 0, 0.005]} material={materials.pageMaterial}>
          <boxGeometry args={[BOOK_WIDTH - 0.08, BOOK_HEIGHT - 0.06, COVER_DEPTH - 0.03]} />
        </mesh>
      </group>
      <ContactShadows position={[0, -BOOK_HEIGHT / 2 - 0.3, 0]} opacity={0.55} scale={6} blur={2.6} far={2} />
    </>
  );
}
