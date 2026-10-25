import * as THREE from "three";

import { useTexture } from "@react-three/drei";
// import { useFrame } from '@react-three/fiber'

export default function WoodFloor(props) {
    const base_link = `${process.env.NEXT_PUBLIC_CDN}games/Assassin/`;

    const texture = useTexture({
        map: `${base_link}rock.webp`,
    });

    texture.map.repeat.set(20, 20);
    texture.map.wrapS = texture.map.wrapT = THREE.RepeatWrapping;

    return (
        <group {...props}>
            <mesh
                castShadow
                receiveShadow
            >
                <boxGeometry args={[40, 1, 40]} />
                <meshStandardMaterial
                    attach="material-0"
                    color="#444"
                />
                <meshStandardMaterial
                    attach="material-1"
                    color="#444"
                />
                <meshStandardMaterial
                    attach="material-2"
                    {...texture}
                />
                <meshStandardMaterial
                    attach="material-3"
                    color="#444"
                />
                <meshStandardMaterial
                    attach="material-4"
                    color="#444"
                />
                <meshStandardMaterial
                    attach="material-5"
                    color="#444"
                />
            </mesh>
        </group>
    );
}
