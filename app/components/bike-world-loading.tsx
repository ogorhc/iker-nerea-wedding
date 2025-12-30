'use client';

import * as THREE from 'three';
import { useMemo, useRef, forwardRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

const SPEED = 0.03;

const Colors = {
  red: 0xf25346,
  yellow: 0xedeb27,
  white: 0xd8d0d1,
  brown: 0x59332e,
  pink: 0xf5986e,
  brownDark: 0x23190f,
  blue: 0x68c3c0,
  green: 0x458248,
  purple: 0x551a8b,
  lightgreen: 0x629265,
  gray: 0x808080,
  black: 0x000000,
};

const spokes = [
  { rotation: [0, 0, 0] },
  { rotation: [0, 0, -1.2] },
  { rotation: [0, 0, -1.8] },
  { rotation: [0, 0, -2.4] },
  { rotation: [0, 0, -3.6] },
];

const Spoke = ({ rotation }: { rotation: [number, number, number] }) => {
  return (
    <mesh position={[0, 0, 0]} rotation={rotation} castShadow>
      <boxGeometry args={[0.01, 0.7, 0.05]} />
      <meshStandardMaterial color={Colors.gray} roughness={0.7} />
    </mesh>
  );
};

const Wheel = forwardRef<THREE.Group, { position: [number, number, number] }>(({ position }, ref) => {
  return (
    <mesh ref={ref} position={position} castShadow>
      <torusGeometry args={[0.35, 0.05, 10, 20]} />
      <meshStandardMaterial color={Colors.black} roughness={0.6} />
      {spokes.map((spoke) => (
        <Spoke key={spoke.rotation.join(',')} rotation={spoke.rotation as [number, number, number]} />
      ))}
    </mesh>
  );
});
Wheel.displayName = 'Wheel';

export function Bike() {
  const group = useRef<THREE.Group>(null);
  const wheelL = useRef<THREE.Group>(null);
  const wheelR = useRef<THREE.Group>(null);

  useFrame((state) => {
    // Pequeño “bobbing” divertido
    if (group.current) group.current.position.x = 0.6 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    // Girar ruedas
    wheelL.current && (wheelL.current.rotation.z -= SPEED);
    wheelR.current && (wheelR.current.rotation.z -= SPEED);
  });

  return (
    <group ref={group} position={[0, 1, 4]}>
      {/* Frame */}
      <mesh position={[0.3, 0.2, 0]} castShadow>
        <boxGeometry args={[1, 0.05, 0.1]} />
        <meshStandardMaterial color={Colors.white} roughness={0} />
      </mesh>
      {/* “Horquilla” */}
      <mesh position={[0.8, 0.12, 0]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.05, 0.7, 0.1]} />
        <meshStandardMaterial color={Colors.white} roughness={0.7} />
      </mesh>
      <mesh position={[0.3, -0, 0]} rotation={[0, 0, -1.1]} castShadow>
        <boxGeometry args={[0.05, 1, 0.1]} />
        <meshStandardMaterial color={Colors.white} roughness={0.7} />
      </mesh>
      <mesh position={[-0.4, -0.03, 0]} rotation={[0, 0, -0.76]} castShadow>
        <boxGeometry args={[0.05, 0.64, 0.1]} />
        <meshStandardMaterial color={Colors.white} roughness={0.7} />
      </mesh>
      <mesh position={[-0.35, -0.25, 0]} castShadow>
        <boxGeometry args={[0.5, 0.05, 0.1]} />
        <meshStandardMaterial color={Colors.white} roughness={0} />
      </mesh>

      {/* Manillar */}
      <mesh position={[0.7, 0.5, 0]} castShadow>
        <boxGeometry args={[0.4, 0.08, 0.1]} />
        <meshStandardMaterial color={Colors.brownDark} roughness={0.8} />
      </mesh>

      {/* Sillín */}
      <mesh position={[-0.1, 0.5, 0]} castShadow>
        <boxGeometry args={[0.4, 0.08, 0.12]} />
        <meshStandardMaterial color={Colors.brownDark} roughness={0.9} />
        <mesh position={[-0.05, -0.4, 0]} rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial color={Colors.white} roughness={0.9} />
        </mesh>
      </mesh>

      {/* Rueda izquierda */}
      <Wheel ref={wheelL} position={[0.8, -0.25, 0]} />

      {/* Rueda derecha */}
      <Wheel ref={wheelR} position={[-0.6, -0.25, 0]} />
    </group>
  );
}

function Ground() {
  const ground = useRef<THREE.Mesh>(null);

  // Segmentos que se mueven en loop para simular avance
  // const strips = useMemo(() => Array.from({ length: 14 }, (_, i) => i), []);

  useFrame((_, delta) => {
    if (!ground.current) return;
    // desplazamos la textura/posicion del suelo en Z
    ground.current.position.x -= delta * 3.5;
    if (ground.current.position.z > 8) ground.current.position.z = 0;
  });

  return (
    <group>
      {/* Plano grande */}
      <mesh ref={ground} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10000, 1000000, 1, 1]} />
        <meshStandardMaterial color={Colors.gray} roughness={1} />
      </mesh>

      {/* “Carril” con bandas (sensación movimiento) */}
      {/* {strips.map((i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -18 + i * 3]} receiveShadow>
          <planeGeometry args={[2.2, 1.2]} />
          <meshStandardMaterial color={Colors.green} roughness={1} />
        </mesh>
      ))} */}
    </group>
  );
}

export default function BikeWorld() {
  return (
    <div>
      <Canvas className='' shadows camera={{ position: [1, 1.5, 7], fov: 45 }} gl={{ antialias: true }}>
        {/* Niebla */}
        <fog attach='fog' args={['#0b1220', 6, 22]} />

        {/* Luces */}
        <hemisphereLight args={[0xaaaaaa, 0x000000, 0.9]} />
        <directionalLight
          position={[4, 8, 4]}
          intensity={0.9}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        {/* <Ground /> */}
        <Bike />
      </Canvas>

      {/* velo para contraste */}
      {/* <div className='absolute inset-0 bg-linear-to-b from-slate-950/30 via-slate-950/60 to-slate-950' /> */}
    </div>
  );
}
