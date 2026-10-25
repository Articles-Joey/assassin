import { useEffect, useMemo } from "react";
import { BufferGeometry, DoubleSide, Float32BufferAttribute } from "three";

function MountainRing({ radius, base, color, phase }) {
    const geometry = useMemo(() => {
        const positions = [];
        const indices = [];
        const segments = 192;
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const peak =
                12 +
                Math.abs(Math.sin(angle * 13 + phase)) * 19 +
                Math.abs(Math.sin(angle * 29 + phase)) * 9;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            positions.push(x, base, z, x, base + peak, z);
            if (i < segments) {
                const a = i * 2;
                indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
            }
        }
        const result = new BufferGeometry();
        result.setAttribute(
            "position",
            new Float32BufferAttribute(positions, 3),
        );
        result.setIndex(indices);
        return result;
    }, [radius, base, phase]);
    useEffect(() => () => geometry.dispose(), [geometry]);

    return (
        <mesh geometry={geometry}>
            <meshBasicMaterial
                color={color}
                side={DoubleSide}
                fog={false}
            />
        </mesh>
    );
}

// Flat silhouette imagery on closed rings: no gaps when orbiting the scene.
export default function DistantMountains() {
    return (
        <group>
            <MountainRing
                radius={290}
                base={-10}
                color="#54271f"
                phase={0}
            />
            <MountainRing
                radius={250}
                base={-12}
                color="#321b19"
                phase={1.7}
            />
            <MountainRing
                radius={210}
                base={-14}
                color="#201514"
                phase={3.1}
            />
        </group>
    );
}
