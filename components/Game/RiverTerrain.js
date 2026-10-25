import { useEffect, useMemo, useState } from "react";
import { BufferGeometry, Float32BufferAttribute } from "three";
import BurntTree from "./BurntTree";
import Gravestone from "./Gravestone";
import RockyTerrainMaterial from "./RockyTerrainMaterial";
import { RIVER_LENGTH, riverEdge, terrainHeight } from "./riverLayout";

function Bank({ side }) {
    const geometry = useMemo(() => {
        const vertices = [];
        const indices = [];
        const lengthSegments = 100;
        const depthSegments = 28;
        for (let i = 0; i <= lengthSegments; i++) {
            const x = -RIVER_LENGTH / 2 + (i * RIVER_LENGTH) / lengthSegments;
            for (let j = 0; j <= depthSegments; j++) {
                const distance = j * 6;
                vertices.push(
                    x,
                    terrainHeight(x, distance),
                    riverEdge(x, side) + side * distance,
                );
            }
        }
        for (let i = 0; i < lengthSegments; i++) {
            for (let j = 0; j < depthSegments; j++) {
                const a = i * (depthSegments + 1) + j;
                const b = a + depthSegments + 1;
                if (side > 0) indices.push(a, a + 1, b, b, a + 1, b + 1);
                else indices.push(a, b, a + 1, b, b + 1, a + 1);
            }
        }
        const result = new BufferGeometry();
        result.setAttribute(
            "position",
            new Float32BufferAttribute(vertices, 3),
        );
        result.setIndex(indices);
        result.computeVertexNormals();
        return result;
    }, [side]);
    useEffect(() => () => geometry.dispose(), [geometry]);

    return (
        <mesh
            geometry={geometry}
            receiveShadow
        >
            <RockyTerrainMaterial />
        </mesh>
    );
}

function scatter(count, minDistance, depth) {
    return Array.from({ length: count }, (_, i) => {
        const side = i % 2 ? 1 : -1;
        const x = (Math.random() - 0.5) * (RIVER_LENGTH - 8);
        const distance = minDistance + Math.random() * depth;
        return {
            position: [
                x,
                terrainHeight(x, distance),
                riverEdge(x, side) + side * distance,
            ],
            rotation: [
                0,
                Math.random() * Math.PI * 2,
                (Math.random() - 0.5) * 0.22,
            ],
            scale: 0.7 + Math.random() * 1.1,
        };
    });
}

export default function RiverTerrain() {
    const [trees] = useState(() => scatter(80, 5, 79));
    const [graves] = useState(() => scatter(60, 14, 70));
    const [rocks] = useState(() => scatter(150, 0.2, 4));

    return (
        <group>
            <Bank side={-1} />
            <Bank side={1} />
            {trees.map((props, i) => (
                <BurntTree
                    key={`tree-${i}`}
                    {...props}
                />
            ))}
            {graves.map((props, i) => (
                <Gravestone
                    key={`grave-${i}`}
                    {...props}
                />
            ))}
            {rocks.map((props, i) => (
                <mesh
                    key={`rock-${i}`}
                    {...props}
                    castShadow
                    receiveShadow
                    scale={[
                        props.scale * 1.5,
                        props.scale * 0.6,
                        props.scale * 0.55,
                    ]}
                >
                    <dodecahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial
                        color={i % 3 ? "#292321" : "#514038"}
                        roughness={1}
                        flatShading
                    />
                </mesh>
            ))}
        </group>
    );
}
