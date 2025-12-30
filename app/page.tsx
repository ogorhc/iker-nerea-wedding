'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useRef } from 'react';
import BikeWorld, { Bike } from './components/bike-world-loading';

// Generate particle positions outside component to avoid render-time Math.random calls
function generateParticlePositions() {
  const count = 1200;
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    arr[i3 + 0] = (Math.random() - 0.5) * 18; // x
    arr[i3 + 1] = (Math.random() - 0.5) * 10; // y
    arr[i3 + 2] = (Math.random() - 0.5) * 18; // z
  }
  return arr;
}

const particlePositions = generateParticlePositions();

function FoggyBackground() {
  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!ref.current) return;
    // Rotación muy suave para dar vida
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.03;
    ref.current.rotation.x = state.clock.getElapsedTime() * 0.01;
  });

  return (
    <>
      {/* Neblina (fog) */}
      <fog attach='fog' args={['#0f172a', 4, 18]} />

      {/* Luz ambiental suave */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 2, 2]} intensity={0.5} />

      {/* Partículas */}
      <Points ref={ref} positions={particlePositions} stride={3} frustumCulled>
        {/* color lo hereda; no hace falta especificar nada */}
        <PointMaterial color='#0f172a' size={0.03} sizeAttenuation depthWrite={false} />
      </Points>
    </>
  );
}

export default function Home() {
  return (
    <main className='relative min-h-screen overflow-hidden bg-slate-200 text-slate-100'>
      {/* Fondo Three.js */}
      <div className='absolute inset-0'>
        <div className='absolute inset-0'>{/* <BikeWorld /> */}</div>
        <Canvas camera={{ position: [0, 0, 10], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
          <FoggyBackground />
        </Canvas>

        {/* Velo para mejorar contraste */}
        {/* <div className='absolute inset-0 bg-linear-to-b from-slate-200/10 via-slate-200/50 to-slate-200' /> */}
      </div>

      {/* Contenido */}
      <div className='relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-16'>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className='w-full'
        >
          <div className='mx-auto flex max-w-xl flex-col items-center text-center'>
            <motion.div className='relative mb-6 h-64 w-96 overflow-hidden rounded-2xl ring-4 ring-slate-900 shadow-2xl'>
              <Image
                src='/WIP_polygons.png'
                alt='Work In Progress...'
                fill
                priority
                className='object-contain bg-slate-900'
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className='text-balance text-4xl font-semibold text-slate-900 tracking-tight sm:text-5xl'
            >
              Nerea & Iker
            </motion.h1>
            <BikeWorld />

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className='text-balance text-lg  text-slate-900 tracking-tight sm:text-2xl'
            >
              Work In Progress...
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className='mt-4 text-pretty text-base text-slate-900/50 sm:text-lg'
            >
              Se está preparando la web de la boda. Pronto estarán disponibles la ubicación, horarios y confirmación de
              asistencia.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
