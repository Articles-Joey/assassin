export default function Gravestone(props) {
    return (
        <group {...props}>
            {/* Keep the base top at y=0.24 and extend its foundation downward. */}
            <mesh
                castShadow
                receiveShadow
                position={[0, -0.28, 0]}
            >
                <boxGeometry args={[1.5, 1.04, 0.8]} />
                <meshStandardMaterial
                    color="#393533"
                    roughness={1}
                />
            </mesh>
            <mesh
                castShadow
                receiveShadow
                position={[0, 0.85, 0]}
            >
                <boxGeometry args={[1.05, 1.5, 0.32]} />
                <meshStandardMaterial
                    color="#69615a"
                    roughness={1}
                />
            </mesh>
            <group
                position={[0, 1.6, 0]}
                rotation={[Math.PI / 2, 0, 0]}
            >
                <mesh
                    castShadow
                    receiveShadow
                >
                    <cylinderGeometry
                        args={[0.525, 0.525, 0.32, 10, 1, false, 0, Math.PI]}
                    />
                    <meshStandardMaterial
                        color="#69615a"
                        roughness={1}
                    />
                </mesh>
                {/* Close the cylinder's radial cut without changing its outline. */}
                <mesh
                    castShadow
                    receiveShadow
                    rotation={[0, -Math.PI / 2, 0]}
                >
                    <planeGeometry args={[1.05, 0.32]} />
                    <meshStandardMaterial
                        color="#69615a"
                        roughness={1}
                    />
                </mesh>
            </group>
            <mesh position={[0, 1.05, 0.168]}>
                <boxGeometry args={[0.09, 0.55, 0.025]} />
                <meshStandardMaterial color="#252121" />
            </mesh>
            <mesh position={[0, 1.15, 0.17]}>
                <boxGeometry args={[0.4, 0.09, 0.025]} />
                <meshStandardMaterial color="#252121" />
            </mesh>
        </group>
    );
}
