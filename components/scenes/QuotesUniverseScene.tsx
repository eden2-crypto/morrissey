'use client';

import { Line, Stars } from '@react-three/drei';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '@/lib/use-browser-state';

type QuotesUniverseSceneProps = {
  count: number;
  selected: number;
  onSelect: (index: number) => void;
};

const RADIUS = 2.6;
const STEP = 0.95;
const VERTICAL_GAP = 0.32;
const GOLD = new THREE.Color('#d8be93');
const SILVER = new THREE.Color('#8fb3d9');

function nodePosition(index: number, count: number) {
  const angle = index * STEP;
  const y = (index - (count - 1) / 2) * VERTICAL_GAP;
  return { angle, position: new THREE.Vector3(RADIUS * Math.sin(angle), y, RADIUS * Math.cos(angle)) };
}

function ChapterNode({
  position,
  active,
  onSelect,
}: {
  position: THREE.Vector3;
  active: boolean;
  onSelect: () => void;
}) {
  const { gl } = useThree();
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const emphasis = active ? 1.9 : hovered ? 1.45 : 1;

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const next = mesh.scale.x + (emphasis - mesh.scale.x) * Math.min(1, delta * 8);
    mesh.scale.setScalar(next);
  });

  const handleOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(true);
    gl.domElement.style.cursor = 'pointer';
  };
  const handleOut = () => {
    setHovered(false);
    gl.domElement.style.cursor = '';
  };
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect();
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
      onClick={handleClick}
    >
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial
        color={active ? GOLD : SILVER}
        emissive={active ? GOLD : SILVER}
        emissiveIntensity={active ? 1.4 : hovered ? 0.9 : 0.45}
        roughness={0.35}
      />
    </mesh>
  );
}

export function QuotesUniverseScene({ count, selected, onSelect }: QuotesUniverseSceneProps) {
  const reduced = usePrefersReducedMotion();
  const groupRef = useRef<THREE.Group>(null);
  const nodes = useMemo(() => Array.from({ length: count }, (_, i) => nodePosition(i, count)), [count]);
  const path = useMemo(() => nodes.map((n) => n.position), [nodes]);
  const targetAngle = nodes[selected]?.angle ?? 0;

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const drift = reduced ? 0 : Math.sin(clock.elapsedTime * 0.25) * 0.04;
    const target = -targetAngle + drift;
    group.rotation.y += (target - group.rotation.y) * Math.min(1, delta * 3);
  });

  return (
    <>
      <color attach="background" args={['#05070b']} />
      <Stars radius={60} depth={30} count={1800} factor={2} saturation={0} fade speed={0.2} />
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 3, 6]} intensity={12} color="#f2ece1" />
      <group ref={groupRef}>
        <Line points={path} color="#3d6a9e" lineWidth={1} transparent opacity={0.35} />
        {nodes.map((node, i) => (
          <ChapterNode
            key={i}
            position={node.position}
            active={i === selected}
            onSelect={() => onSelect(i)}
          />
        ))}
      </group>
    </>
  );
}
