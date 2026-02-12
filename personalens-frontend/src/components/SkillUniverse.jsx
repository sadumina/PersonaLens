import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

/**
 * Individual glowing sphere
 */
function SkillSphere({ position, size, color }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
      />
    </mesh>
  );
}

/**
 * Main Universe Component
 */
export default function SkillUniverse({ clusters }) {

  const sphereData = useMemo(() => {
    if (!clusters) return [];

    const entries = Object.entries(clusters);

    return entries.map(([name, value], index) => ({
      name,
      size: 0.5 + value * 0.2, // bigger cluster = bigger sphere
      position: [
        (index - entries.length / 2) * 3,
        Math.random() * 2 - 1,
        Math.random() * -3,
      ],
      color: new THREE.Color(`hsl(${index * 60}, 100%, 60%)`),
    }));
  }, [clusters]);

  return (
    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10 h-[400px]">
      <h2 className="text-white text-lg mb-4">3D Skill Universe</h2>

      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        {sphereData.map((sphere, i) => (
          <SkillSphere
            key={i}
            position={sphere.position}
            size={sphere.size}
            color={sphere.color}
          />
        ))}

        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
