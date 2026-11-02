'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '@/lib/use-browser-state';
import { NOISE_GLSL } from './glsl-noise';

type Progress = { current: number };

const FOG_COLOR = new THREE.Color('#14222f');
const SKY_HORIZON = new THREE.Color('#2b4256');
const SKY_ZENITH = new THREE.Color('#05080f');

const terrainHeight = /* glsl */ `
float terrainHeight(vec2 q){
  float inland = smoothstep(3.0, -12.0, q.y);
  float hills = 0.5 + 0.5 * fbm(vec3(q.x * 0.09, 0.0, q.y * 0.09));
  float ridge = 1.0 - abs(snoise(vec3(q.x * 0.05, q.y * 0.05, 3.0)));
  float h = inland * (0.6 + 3.2 * hills + 2.2 * pow(ridge, 3.0) * inland);
  h += snoise(vec3(q * 0.35, 1.0)) * 0.08;
  return h - (1.0 - smoothstep(0.5, 3.0, q.y)) * 0.6;
}
`;

const terrainVertex = NOISE_GLSL + terrainHeight + /* glsl */ `
varying float vH;
varying vec3 vNormal;
varying vec3 vWorld;
void main(){
  vec2 q = position.xy;
  float h = terrainHeight(q);
  float e = 0.25;
  float hx = terrainHeight(q + vec2(e, 0.0)) - terrainHeight(q - vec2(e, 0.0));
  float hz = terrainHeight(q + vec2(0.0, e)) - terrainHeight(q - vec2(0.0, e));
  vNormal = normalize(vec3(-hx, 2.0 * e, -hz));
  vH = h;
  vec4 wp = modelMatrix * vec4(q.x, h, q.y, 1.0);
  vWorld = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const terrainFragment = NOISE_GLSL + /* glsl */ `
uniform vec3 uFog;
varying float vH;
varying vec3 vNormal;
varying vec3 vWorld;
void main(){
  vec3 col = mix(vec3(0.09, 0.11, 0.14), vec3(0.2, 0.25, 0.22), smoothstep(0.0, 1.2, vH));
  col = mix(col, vec3(0.44, 0.48, 0.52), smoothstep(1.8, 3.6, vH));
  col = mix(col, vec3(0.84, 0.89, 0.94), smoothstep(3.8, 5.0, vH + 0.4 * snoise(vWorld * 0.5)));
  float ndl = max(dot(normalize(vNormal), normalize(vec3(-0.4, 0.8, 0.5))), 0.0);
  col *= 0.3 + 0.9 * ndl;
  float d = length(cameraPosition - vWorld);
  col = mix(col, uFog, clamp((d - 14.0) / 38.0, 0.0, 1.0));
  gl_FragColor = vec4(col, 1.0);
}`;

const waterVertex = /* glsl */ `
uniform float uTime;
varying vec3 vWorld;
void main(){
  vec2 q = position.xy;
  float h = sin(q.x * 0.6 + uTime * 0.9) * 0.05 + cos(q.y * 0.5 + uTime * 0.7) * 0.05;
  vec4 wp = modelMatrix * vec4(q.x, h, q.y, 1.0);
  vWorld = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const waterFragment = NOISE_GLSL + /* glsl */ `
uniform float uTime;
uniform vec3 uFog;
varying vec3 vWorld;
void main(){
  float glints = snoise(vec3(vWorld.x * 2.2, vWorld.z * 6.0, uTime * 0.35));
  vec3 col = mix(vec3(0.02, 0.05, 0.09), vec3(0.07, 0.16, 0.24), smoothstep(-0.2, 0.6, glints));
  col += vec3(0.5, 0.6, 0.7) * smoothstep(0.55, 0.9, glints) * 0.25;
  float d = length(cameraPosition - vWorld);
  col = mix(col, uFog, clamp((d - 14.0) / 38.0, 0.0, 1.0));
  gl_FragColor = vec4(col, 1.0);
}`;

const skyVertex = /* glsl */ `
varying vec3 vDir;
void main(){
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const skyFragment = /* glsl */ `
uniform vec3 uHorizon;
uniform vec3 uZenith;
uniform float uTime;
varying vec3 vDir;
void main(){
  float up = clamp(vDir.y, 0.0, 1.0);
  vec3 col = mix(uHorizon, uZenith, pow(up, 0.55));
  float band = smoothstep(0.12, 0.0, abs(vDir.y - 0.32 + sin(vDir.x * 3.0 + uTime * 0.05) * 0.04));
  col += vec3(0.25, 0.55, 0.5) * band * 0.12;
  gl_FragColor = vec4(col, 1.0);
}`;

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function Icebergs() {
  const groupRef = useRef<THREE.Group>(null);
  const bergs = useMemo(() => {
    const rand = seeded(11);
    return [
      { x: -4.5, z: 4.5, s: 1.3 },
      { x: 3.2, z: 6.5, s: 0.85 },
      { x: 0.4, z: 9.5, s: 0.55 },
      { x: 7.5, z: 3.0, s: 1.05 },
    ].map((b) => {
      const geometry = new THREE.IcosahedronGeometry(1, 2);
      const pos = geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i);
        const jitter = 0.78 + rand() * 0.3;
        v.multiply(new THREE.Vector3(1, 0.55, 1)).multiplyScalar(jitter);
        if (v.y > 0.05) v.y *= 0.5;
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geometry.computeVertexNormals();
      return { ...b, geometry, phase: rand() * Math.PI * 2 };
    });
  }, []);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) return;
    group.children.forEach((child, i) => {
      child.position.y = Math.sin(clock.elapsedTime * 0.6 + bergs[i].phase) * 0.08 - 0.05;
      child.rotation.y = clock.elapsedTime * 0.02 + i;
    });
  });

  return (
    <group ref={groupRef}>
      {bergs.map((b, i) => (
        <mesh key={i} geometry={b.geometry} position={[b.x, -0.05, b.z]} scale={b.s * 1.6}>
          <meshStandardMaterial color="#e3edf4" roughness={0.3} emissive="#0c1d2b" emissiveIntensity={0.4} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function DistantRange() {
  const peaks = useMemo(() => {
    const rand = seeded(29);
    return Array.from({ length: 16 }, (_, i) => ({
      x: -46 + i * 6.2 + rand() * 2.5,
      z: -34 - rand() * 6,
      height: 9 + rand() * 9,
      radius: 4.5 + rand() * 3,
    }));
  }, []);
  return (
    <group>
      {peaks.map((p, i) => (
        <mesh key={i} position={[p.x, p.height / 2 - 1, p.z]}>
          <coneGeometry args={[p.radius, p.height, 6]} />
          <meshStandardMaterial color="#1b2a3b" roughness={0.9} flatShading />
        </mesh>
      ))}
    </group>
  );
}

export function LabradorScene({ progress }: { progress: Progress }) {
  const reduced = usePrefersReducedMotion();
  const { camera } = useThree();
  const time = useRef(0);

  const terrainMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: terrainVertex,
        fragmentShader: terrainFragment,
        uniforms: { uFog: { value: FOG_COLOR } },
      }),
    [],
  );

  const waterMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: waterVertex,
        fragmentShader: waterFragment,
        uniforms: { uTime: { value: 0 }, uFog: { value: FOG_COLOR } },
      }),
    [],
  );

  const skyMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: skyVertex,
        fragmentShader: skyFragment,
        uniforms: { uHorizon: { value: SKY_HORIZON }, uZenith: { value: SKY_ZENITH }, uTime: { value: 0 } },
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [],
  );

  useFrame((_, delta) => {
    time.current += reduced ? 0 : delta;
    waterMaterial.uniforms.uTime.value = time.current;
    skyMaterial.uniforms.uTime.value = time.current;
    const targetZ = 14 - progress.current * 6;
    const targetY = 4.6 - progress.current * 1.6;
    camera.position.z += (targetZ - camera.position.z) * 0.06;
    camera.position.y += (targetY - camera.position.y) * 0.06;
    camera.lookAt(0, 1.2, -4);
  });

  return (
    <>
      <color attach="background" args={['#14222f']} />
      <mesh material={skyMaterial}>
        <sphereGeometry args={[90, 32, 16]} />
      </mesh>
      <mesh material={terrainMaterial}>
        <planeGeometry args={[90, 90, 260, 260]} />
      </mesh>
      <mesh material={waterMaterial}>
        <planeGeometry args={[160, 160, 120, 120]} />
      </mesh>
      <Icebergs />
      <DistantRange />
      <ambientLight intensity={0.35} color="#8fa7bd" />
      <directionalLight position={[-6, 8, 5]} intensity={0.9} color="#dbe7f2" />
    </>
  );
}
