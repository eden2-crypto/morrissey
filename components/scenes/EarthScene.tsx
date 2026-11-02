'use client';

import { Stars } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '@/lib/use-browser-state';
import { NOISE_GLSL } from './glsl-noise';

const surfaceVertex = /* glsl */ `
varying vec3 vObjPos;
varying vec3 vNormal;
void main(){
  vObjPos = position;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const surfaceFragment = NOISE_GLSL + /* glsl */ `
uniform vec3 uLight;
varying vec3 vObjPos;
varying vec3 vNormal;
void main(){
  vec3 p = normalize(vObjPos);
  float h = fbm(p * 1.8);
  float land = smoothstep(0.0, 0.06, h);
  float depth = smoothstep(-0.2, 0.4, snoise(p * 4.0));
  vec3 ocean = mix(vec3(0.015, 0.045, 0.11), vec3(0.04, 0.12, 0.24), depth);
  vec3 terrain = mix(vec3(0.16, 0.19, 0.17), vec3(0.42, 0.41, 0.37), smoothstep(0.06, 0.25, h));
  vec3 base = mix(ocean, terrain, land);
  float ice = smoothstep(0.86, 0.97, abs(p.y));
  base = mix(base, vec3(0.86, 0.91, 0.95), ice);
  vec3 n = normalize(vNormal);
  float ndl = dot(n, uLight);
  float wrap = clamp((ndl + 0.2) / 1.2, 0.0, 1.0);
  vec3 col = base * (0.05 + 0.95 * wrap);
  vec3 hv = normalize(uLight + vec3(0.0, 0.0, 1.0));
  float spec = pow(max(dot(n, hv), 0.0), 48.0) * (1.0 - land) * 0.35 * step(0.0, ndl);
  col += vec3(0.6, 0.7, 0.85) * spec;
  gl_FragColor = vec4(col, 1.0);
}`;

const cloudFragment = NOISE_GLSL + /* glsl */ `
uniform vec3 uLight;
uniform float uTime;
varying vec3 vObjPos;
varying vec3 vNormal;
void main(){
  vec3 p = normalize(vObjPos);
  float c = fbm(p * 2.6 + vec3(uTime * 0.015, 0.0, uTime * 0.01));
  float a = smoothstep(0.0, 0.32, c) * 0.85;
  float wrap = clamp((dot(normalize(vNormal), uLight) + 0.2) / 1.2, 0.0, 1.0);
  gl_FragColor = vec4(vec3(0.9, 0.93, 0.97) * (0.08 + 0.92 * wrap), a);
}`;

const haloVertex = /* glsl */ `
varying vec3 vNormal;
void main(){
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const haloFragment = /* glsl */ `
varying vec3 vNormal;
void main(){
  float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
  gl_FragColor = vec4(vec3(0.3, 0.55, 0.9), pow(rim, 4.0) * 0.8);
}`;

const LIGHT_DIRECTION = new THREE.Vector3(-0.8, 0.35, 0.6).normalize();

export function EarthScene() {
  const reduced = usePrefersReducedMotion();
  const { size } = useThree();
  const globeRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const cloudMaterial = useRef<THREE.ShaderMaterial>(null);

  const surfaceMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: surfaceVertex,
        fragmentShader: surfaceFragment,
        uniforms: { uLight: { value: LIGHT_DIRECTION } },
      }),
    [],
  );

  const cloudUniforms = useMemo(() => ({ uLight: { value: LIGHT_DIRECTION }, uTime: { value: 0 } }), []);

  useFrame((_, delta) => {
    const globe = globeRef.current;
    if (!globe) return;
    const spin = reduced ? 0.01 : 0.05;
    globe.rotation.y += delta * spin;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * (reduced ? 0 : 0.01);
    if (cloudMaterial.current) cloudMaterial.current.uniforms.uTime.value += reduced ? 0 : delta;

    const wide = size.width > 900;
    globe.position.x = wide ? 1.35 : 0;
    globe.position.y = wide ? -0.05 : -0.95;
    globe.rotation.z = 0.41;
  });

  return (
    <>
      <color attach="background" args={['#05070b']} />
      <Stars radius={80} depth={40} count={2600} factor={2.4} saturation={0} fade speed={0.3} />
      <ambientLight intensity={0.1} />
      <group ref={globeRef}>
        <mesh material={surfaceMaterial}>
          <sphereGeometry args={[1, 96, 96]} />
        </mesh>
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[1.012, 80, 80]} />
          <shaderMaterial
            ref={cloudMaterial}
            vertexShader={surfaceVertex}
            fragmentShader={cloudFragment}
            uniforms={cloudUniforms}
            transparent
            depthWrite={false}
          />
        </mesh>
        <mesh scale={1.14} raycast={() => null}>
          <sphereGeometry args={[1, 64, 64]} />
          <shaderMaterial
            vertexShader={haloVertex}
            fragmentShader={haloFragment}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </>
  );
}
