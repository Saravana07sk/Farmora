import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 1. Floating Tomato: Red glossy sphere with 5-point green calyx and small stem
export const FloatingTomato = ({ position = [0, 0, 0], scale = 1, rotationSpeed = 0.8, floatSpeed = 1.2 }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * floatSpeed;
    groupRef.current.position.y = position[1] + Math.sin(t) * 0.12;
    groupRef.current.rotation.y += 0.005 * rotationSpeed;
    groupRef.current.rotation.x = Math.sin(t * 0.7) * 0.08;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Tomato Body */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial
          color="#d62828"
          roughness={0.25}
          metalness={0.1}
          clearcoat={0.6}
          clearcoatRoughness={0.15}
        />
      </mesh>
      {/* Tomato Stem */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.18, 8]} />
        <meshStandardMaterial color="#2d6a4f" roughness={0.6} />
      </mesh>
      {/* Calyx Leaves */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <mesh
          key={i}
          position={[0, 0.52, 0]}
          rotation={[0.3, (angle * Math.PI) / 180, -0.2]}
        >
          <coneGeometry args={[0.06, 0.22, 5]} />
          <meshStandardMaterial color="#40916c" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
};

// 2. Floating Mango: Golden-amber asymmetrical tapered shape
export const FloatingMango = ({ position = [0, 0, 0], scale = 1, rotationSpeed = 0.7, floatSpeed = 1.1 }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * floatSpeed + 1.2;
    groupRef.current.position.y = position[1] + Math.sin(t) * 0.14;
    groupRef.current.rotation.y += 0.006 * rotationSpeed;
    groupRef.current.rotation.z = Math.cos(t * 0.6) * 0.1;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh castShadow receiveShadow scale={[0.55, 0.8, 0.45]}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial
          color="#f4a261"
          roughness={0.3}
          metalness={0.05}
        />
      </mesh>
      {/* Mango stem */}
      <mesh position={[0, 0.52, 0]} rotation={[0.1, 0, 0.2]}>
        <cylinderGeometry args={[0.025, 0.03, 0.15, 8]} />
        <meshStandardMaterial color="#582f0e" roughness={0.7} />
      </mesh>
    </group>
  );
};

// 3. Floating Orange: Bright citrus with pebbled bump texture
export const FloatingOrange = ({ position = [0, 0, 0], scale = 1, rotationSpeed = 0.6, floatSpeed = 1.3 }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * floatSpeed + 2.5;
    groupRef.current.position.y = position[1] + Math.sin(t) * 0.1;
    groupRef.current.rotation.y += 0.004 * rotationSpeed;
    groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.07;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.52, 32, 32]} />
        <meshStandardMaterial
          color="#f77f00"
          roughness={0.45}
          metalness={0.05}
        />
      </mesh>
      {/* Small green tip */}
      <mesh position={[0, 0.51, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#2d6a4f" roughness={0.8} />
      </mesh>
    </group>
  );
};

// 4. Floating Carrot: Tapered orange cone with green leafy fronds
export const FloatingCarrot = ({ position = [0, 0, 0], scale = 1, rotationSpeed = 0.9, floatSpeed = 1.0 }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * floatSpeed + 3.8;
    groupRef.current.position.y = position[1] + Math.sin(t) * 0.13;
    groupRef.current.rotation.y += 0.007 * rotationSpeed;
    groupRef.current.rotation.z = 0.4 + Math.sin(t * 0.8) * 0.08;
  });

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={[0, 0, 0.4]}>
      {/* Carrot body */}
      <mesh castShadow receiveShadow position={[0, -0.2, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.22, 1.1, 24]} />
        <meshStandardMaterial color="#e76f51" roughness={0.5} />
      </mesh>
      {/* Green foliage top */}
      {[-0.2, 0, 0.2].map((angle, i) => (
        <mesh key={i} position={[0, 0.4, 0]} rotation={[0.2, 0, angle]}>
          <cylinderGeometry args={[0.015, 0.03, 0.45, 8]} />
          <meshStandardMaterial color="#52b788" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
};

// 5. Floating Apple: Classic crisp red/green orchard apple
export const FloatingApple = ({ position = [0, 0, 0], scale = 1, rotationSpeed = 0.7, floatSpeed = 1.15 }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * floatSpeed + 4.2;
    groupRef.current.position.y = position[1] + Math.sin(t) * 0.11;
    groupRef.current.rotation.y += 0.005 * rotationSpeed;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh castShadow receiveShadow scale={[0.55, 0.5, 0.55]}>
        <sphereGeometry args={[0.62, 32, 32]} />
        <meshStandardMaterial
          color="#ba181b"
          roughness={0.2}
          metalness={0.08}
          clearcoat={0.5}
        />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.32, 0]} rotation={[0.1, 0, 0.15]}>
        <cylinderGeometry args={[0.02, 0.025, 0.2, 8]} />
        <meshStandardMaterial color="#49281a" roughness={0.7} />
      </mesh>
    </group>
  );
};

// 6. Floating Leaf: Organic fluttering agricultural leaf
export const FloatingLeaf = ({ position = [0, 0, 0], scale = 1, color = "#52b788", floatSpeed = 1.4 }) => {
  const leafRef = useRef();

  useFrame((state) => {
    if (!leafRef.current) return;
    const t = state.clock.getElapsedTime() * floatSpeed;
    leafRef.current.position.y = position[1] + Math.sin(t) * 0.18;
    leafRef.current.position.x = position[0] + Math.cos(t * 0.8) * 0.08;
    leafRef.current.rotation.z = Math.sin(t * 1.2) * 0.25;
    leafRef.current.rotation.y += 0.008;
  });

  return (
    <group ref={leafRef} position={position} scale={scale}>
      <mesh castShadow>
        <coneGeometry args={[0.15, 0.6, 5]} />
        <meshStandardMaterial
          color={color}
          roughness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

// 7. Handcrafted 3D Wooden Harvest Crate/Basket with produce
export const CrateAndBasket = ({ position = [0, 0, 0], scale = 1 }) => {
  const basketRef = useRef();

  useFrame((state) => {
    if (!basketRef.current) return;
    const t = state.clock.getElapsedTime() * 0.8;
    basketRef.current.position.y = position[1] + Math.sin(t) * 0.06;
    basketRef.current.rotation.y = Math.sin(t * 0.3) * 0.08;
  });

  return (
    <group ref={basketRef} position={position} scale={scale}>
      {/* Wooden Crate Base */}
      <mesh position={[0, -0.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.4, 0.12, 1.8]} />
        <meshStandardMaterial color="#6f4e37" roughness={0.8} />
      </mesh>

      {/* Crate Slats Front & Back */}
      {[-0.85, 0.85].map((z, i) => (
        <group key={i}>
          <mesh position={[0, -0.2, z]} castShadow>
            <boxGeometry args={[2.4, 0.22, 0.08]} />
            <meshStandardMaterial color="#8b5a2b" roughness={0.75} />
          </mesh>
          <mesh position={[0, 0.12, z]} castShadow>
            <boxGeometry args={[2.4, 0.22, 0.08]} />
            <meshStandardMaterial color="#8b5a2b" roughness={0.75} />
          </mesh>
        </group>
      ))}

      {/* Crate Slats Left & Right */}
      {[-1.15, 1.15].map((x, i) => (
        <group key={i}>
          <mesh position={[x, -0.2, 0]} castShadow>
            <boxGeometry args={[0.08, 0.22, 1.7]} />
            <meshStandardMaterial color="#7a4f27" roughness={0.75} />
          </mesh>
          <mesh position={[x, 0.12, 0]} castShadow>
            <boxGeometry args={[0.08, 0.22, 1.7]} />
            <meshStandardMaterial color="#7a4f27" roughness={0.75} />
          </mesh>
        </group>
      ))}

      {/* Produce Inside Basket */}
      {/* Cluster of Tomatoes */}
      <group position={[-0.4, 0.05, 0.2]}>
        <FloatingTomato scale={0.7} floatSpeed={0} />
      </group>
      <group position={[-0.1, 0.15, 0.3]}>
        <FloatingTomato scale={0.65} floatSpeed={0} />
      </group>

      {/* Golden Mangoes */}
      <group position={[0.45, 0.1, 0.1]} rotation={[0.4, 0.2, -0.3]}>
        <FloatingMango scale={0.75} floatSpeed={0} />
      </group>

      {/* Bright Oranges */}
      <group position={[-0.5, 0.12, -0.3]}>
        <FloatingOrange scale={0.7} floatSpeed={0} />
      </group>
      <group position={[0.1, 0.2, -0.25]}>
        <FloatingOrange scale={0.65} floatSpeed={0} />
      </group>

      {/* Apples */}
      <group position={[0.55, 0.12, -0.3]}>
        <FloatingApple scale={0.72} floatSpeed={0} />
      </group>

      {/* Carrots angled out */}
      <group position={[-0.7, 0.2, 0]} rotation={[0.3, 0.6, 0.8]}>
        <FloatingCarrot scale={0.65} floatSpeed={0} />
      </group>
    </group>
  );
};
