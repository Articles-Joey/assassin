import * as THREE from "three";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";

export default function LavaPlane({
    args = [300, 50],
    tileSize = 3,
    ...props
}) {
    const base_link = `${process.env.NEXT_PUBLIC_CDN}games/Assassin/`;

    const texture = useTexture({
        map: `${base_link}lava.webp`,
        // displacementMap: `${base_link}GroundSand005_DISP_1K.jpg`,
        // normalMap: `${base_link}GroundSand005_NRM_1K.jpg`,
        // roughnessMap: `${base_link}GroundSand005_BUMP_1K.jpg`,
        // aoMap: `${base_link}GroundSand005_AO_1K.jpg`,
    });

    const map = useMemo(() => texture.map.clone(), [texture.map]);
    const [width, height] = args;
    useEffect(() => {
        map.repeat.set(width / tileSize, height / tileSize);
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.needsUpdate = true;
    }, [map, width, height, tileSize]);
    useEffect(() => () => map.dispose(), [map]);

    useFrame((state, delta) => {
        map.offset.x -= delta * 0.2;
    });

    return (
        <group {...props}>
            <mesh>
                <planeGeometry args={args} />
                <meshStandardMaterial
                    map={map}
                    emissiveMap={map}
                    emissive="#ff6018"
                    emissiveIntensity={0.8}
                />
            </mesh>
        </group>
    );
}
