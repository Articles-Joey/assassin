import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { ModelBone } from "@/public/models/Bone/Bone by Quaternius - uMs0lDp1u3";
import { lavaBobY, riverPosition } from "./riverLayout";

const MIN_BONE_DISTANCE = 4;
const BONES_PER_POCKET = 18;

function scatterPocketBones(side) {
    const bones = [];
    for (
        let attempt = 0;
        attempt < 1200 && bones.length < BONES_PER_POCKET;
        attempt++
    ) {
        // Sample a triangle that narrows away from each end of the square.
        const width = Math.sqrt(Math.random());
        const x = side * (22.5 + (1 - width) * 20.5);
        // Keep a margin from the innermost fish lane on both branches.
        const halfWidth = Math.max(
            0,
            Math.min(
                18 * width,
                Math.abs(riverPosition(x, 1, 0)) - 2.2,
                Math.abs(riverPosition(x, -1, 0)) - 2.2,
            ),
        );
        const z = (Math.random() * 2 - 1) * halfWidth;
        if (
            bones.some(
                (bone) =>
                    (bone.x - x) ** 2 + (bone.z - z) ** 2 <
                    MIN_BONE_DISTANCE ** 2,
            )
        ) {
            continue;
        }
        bones.push({
            x,
            z,
            yaw: Math.random() * Math.PI * 2,
            phase: Math.random() * Math.PI * 2,
            bobHeight: 0.5 + Math.random() * 0.35,
            bobSpeed: 0.9 + Math.random() * 0.6,
            scale: (0.45 + Math.random() * 0.35) * 3,
        });
    }
    // Leave space empty if the pocket is full rather than violate the spacing.
    return bones;
}

function PocketBone({ bone }) {
    const group = useRef();

    useFrame(({ clock }) => {
        if (!group.current) return;
        const time = clock.elapsedTime;
        group.current.position.y = lavaBobY(time, bone);
        group.current.rotation.z = Math.sin(time + bone.phase) * 0.04;
    });

    return (
        <group
            ref={group}
            position={[bone.x, lavaBobY(0, bone), bone.z]}
            rotation={[0, bone.yaw, 0]}
        >
            <ModelBone scale={bone.scale} />
        </group>
    );
}

export default function LavaBonePockets() {
    const [bones] = useState(() => [
        ...scatterPocketBones(-1),
        ...scatterPocketBones(1),
    ]);

    return (
        <group>
            {bones.map((bone, i) => (
                <PocketBone
                    key={i}
                    bone={bone}
                />
            ))}
        </group>
    );
}
