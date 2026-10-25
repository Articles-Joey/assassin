import { useState } from "react";

export default function BurntTree(props) {
    const [branches] = useState(() =>
        Array.from({ length: 5 }, (_, i) => ({
            y: 1.2 + i * 0.65,
            angle: Math.random() * Math.PI * 2,
            lean: 0.65 + Math.random() * 0.5,
            length: 1.3 + Math.random() * 1.3,
        })),
    );

    return (
        <group {...props}>
            <mesh
                castShadow
                receiveShadow
                position={[0, 2.4, 0]}
                rotation={[0.07, 0, -0.08]}
            >
                <cylinderGeometry args={[0.12, 0.42, 4.8, 7]} />
                <meshStandardMaterial
                    color="#201510"
                    roughness={1}
                    flatShading
                />
            </mesh>
            {branches.map((branch, i) => (
                <group
                    key={i}
                    position={[0, branch.y, 0]}
                    rotation={[0, branch.angle, 0]}
                >
                    <group rotation={[0, 0, branch.lean]}>
                        <mesh
                            castShadow
                            receiveShadow
                            position={[0, branch.length / 2, 0]}
                        >
                            <cylinderGeometry
                                args={[0.025, 0.15, branch.length, 5]}
                            />
                            <meshStandardMaterial
                                color={i % 2 ? "#100e0d" : "#332218"}
                                roughness={1}
                                flatShading
                            />
                        </mesh>
                        <mesh
                            castShadow
                            receiveShadow
                            position={[0.2, branch.length * 0.8, 0]}
                            rotation={[0, 0, -0.8]}
                        >
                            <cylinderGeometry args={[0.01, 0.065, 0.85, 5]} />
                            <meshStandardMaterial
                                color="#151110"
                                roughness={1}
                            />
                        </mesh>
                    </group>
                </group>
            ))}
        </group>
    );
}
