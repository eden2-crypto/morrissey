'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useRef, type ReactNode } from 'react';
import { useIsCompactViewport, useInView, useWebGLSupport } from '@/lib/use-browser-state';

type SceneCanvasProps = {
  label: string;
  fallbackSrc: string;
  fallbackClassName?: string;
  className?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
  children: ReactNode;
};

export function SceneCanvas({
  label,
  fallbackSrc,
  fallbackClassName = 'object-cover opacity-50',
  className = '',
  cameraPosition = [0, 0, 5],
  fov = 45,
  children,
}: SceneCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { inView, hasBeenInView } = useInView(containerRef, '200px 0px');
  const webgl = useWebGLSupport();
  const compact = useIsCompactViewport();

  return (
    <div ref={containerRef} role="img" aria-label={label} className={`absolute inset-0 overflow-hidden ${className}`}>
      <img src={fallbackSrc} alt="" aria-hidden="true" loading="lazy" className={`absolute inset-0 h-full w-full ${fallbackClassName}`} />
      {webgl === true && hasBeenInView && (
        <Canvas
          className="!absolute inset-0"
          frameloop={inView ? 'always' : 'never'}
          dpr={compact ? [1, 1.25] : [1, 1.75]}
          camera={{ position: cameraPosition, fov }}
          gl={{ antialias: !compact, powerPreference: 'high-performance', alpha: true }}
        >
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      )}
    </div>
  );
}
