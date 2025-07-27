import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function LavaBurst({ color = 'orange' }) {
    
    const meshRef = useRef();
    const [bursting, setBursting] = useState(false);
    const [position, setPosition] = useState(getRandomPosition());

    const [timer, setTimer] = useState(0);

    function getRandomPosition() {
        let x, z;
        do {
          x = Math.random() * 100 - 50; // -50 to 50
          z = Math.random() * 100 - 50;
        } while (Math.abs(x) < 20 && Math.abs(z) < 20); // Exclude center ±20
        return new THREE.Vector3(x, 0, z);
      }

      useEffect(() => {
        const interval = setInterval(() => {
          setBursting(true);
          setTimeout(() => {
            setBursting(false);
            setPosition(getRandomPosition());
          }, 500); // Stays up for 0.5s
        }, Math.random() * 3000 + 2000); // Random 2-5 seconds
        return () => clearInterval(interval);
      }, []);
    
      useFrame((state, delta) => {
        if (!meshRef.current) return;
    
        const targetY = bursting ? 4 : -1; // Up or down
        meshRef.current.position.y = THREE.MathUtils.lerp(
          meshRef.current.position.y,
          targetY,
          5 * delta
        );
    
        // Always update X and Z from current position
        meshRef.current.position.x = position.x;
        meshRef.current.position.z = position.z;
      });

    return (
        <mesh ref={meshRef} position={position}>

            <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.5, 1, 32]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
            </mesh>

            <mesh position={[0, -0.2, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.5, 1, 32]} />
                <meshStandardMaterial color={'red'} emissive={color} emissiveIntensity={0.1} />
            </mesh>

        </mesh>
    );
}