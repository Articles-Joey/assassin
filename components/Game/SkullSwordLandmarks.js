import { useLayoutEffect, useRef, useState } from "react";
import { Center, Resize } from "@react-three/drei";
import { ModelSkull } from "@/public/models/Skull/Skull by Quaternius - YgmRBtFlcF";
import { ModelSword } from "@/public/models/Sword/Sword by Quaternius - 9lLmH8Et4K";
import { riverEdge, terrainHeight } from "./riverLayout";

function SkullSwordLandmark({ side }) {
    const group = useRef();
    const [layout] = useState(() => {
        const x = side * 24 + (Math.random() - 0.5) * 18;
        const distance = 112 + Math.random() * 8;
        return {
            position: [
                x,
                terrainHeight(x, distance),
                riverEdge(x, side) + side * distance,
            ],
            yaw: (side > 0 ? Math.PI : 0) + (Math.random() - 0.5) * 0.45,
            skullTilt: (Math.random() - 0.5) * 0.18,
            swordPitch: 0.12 + Math.random() * 0.12,
            swordLean: side * (0.1 + Math.random() * 0.12),
            swordTwist: (Math.random() - 0.5) * 0.5,
        };
    });

    useLayoutEffect(() => {
        group.current?.traverse((object) => {
            if (object.isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
    }, []);

    return (
        <group
            ref={group}
            position={layout.position}
            rotation={[0, layout.yaw, 0]}
        >
            {/* Rest the skull on its side, with its lower edge embedded in the bank. */}
            <group
                position={[0, 8, 0]}
                rotation={[layout.skullTilt, 0, (side * Math.PI) / 2]}
            >
                <Resize scale={26}>
                    <Center>
                        <ModelSkull />
                    </Center>
                </Resize>
            </group>
            {/* The blade crosses the skull and continues below ground; the hilt stays above it. */}
            <group
                position={[1, 20, 0]}
                rotation={[
                    Math.PI + layout.swordPitch,
                    layout.swordTwist,
                    layout.swordLean,
                ]}
            >
                <Resize scale={54}>
                    <Center>
                        <ModelSword />
                    </Center>
                </Resize>
            </group>
        </group>
    );
}

export default function SkullSwordLandmarks() {
    return (
        <group>
            <SkullSwordLandmark side={-1} />
            <SkullSwordLandmark side={1} />
        </group>
    );
}
