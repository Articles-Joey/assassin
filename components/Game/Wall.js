import * as THREE from 'three'

import { useTexture } from "@react-three/drei"

export default function TilePlane(props) {

    const base_link = `${process.env.NEXT_PUBLIC_CDN}games/Assassin/wall-tile.webp`

    const texture = useTexture({
        map: `${base_link}`,
        // displacementMap: `${base_link}GroundSand005_DISP_1K.jpg`,
        // normalMap: `${base_link}GroundSand005_NRM_1K.jpg`,
        // roughnessMap: `${base_link}GroundSand005_BUMP_1K.jpg`,
        // aoMap: `${base_link}GroundSand005_AO_1K.jpg`,
    })

    texture.map.repeat.set(30, 15);
    texture.map.wrapS = texture.map.wrapT = THREE.RepeatWrapping;

    return (
        <group {...props}>
            <mesh>
                <planeGeometry {...props} />
                <meshStandardMaterial {...texture} />
            </mesh>
        </group>
    )

};