import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { ModelFishBone } from "@/public/models/FishBone/Fish Bone by Quaternius - bU5RLZnq6v";
import { RIVER_LENGTH, riverPosition, lavaBobY } from "./riverLayout";

function FloatingFishBone() {
    const group = useRef();
    const [fish] = useState(() => ({
        x: (Math.random() - 0.5) * RIVER_LENGTH,
        side: Math.random() < 0.5 ? -1 : 1,
        lane: Math.random(),
        speed: 1.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        bobHeight: 0.5 + Math.random() * 0.35,
        bobSpeed: 0.9 + Math.random() * 0.6,
        scale: 0.45 + Math.random() * 0.35,
    }));

    useFrame(({ clock }, delta) => {
        fish.x =
            ((fish.x + RIVER_LENGTH / 2 + delta * fish.speed) % RIVER_LENGTH) -
            RIVER_LENGTH / 2;
        const z = riverPosition(fish.x, fish.side, fish.lane);
        const nextZ = riverPosition(fish.x + 0.1, fish.side, fish.lane);
        const time = clock.elapsedTime;
        if (!group.current) return;
        const y = lavaBobY(time, fish);
        group.current.position.set(fish.x, y, z);
        group.current.rotation.set(
            0,
            -Math.atan2(nextZ - z, 0.1),
            Math.sin(time + fish.phase) * 0.04,
        );
    });

    return (
        <group
            ref={group}
            position={[
                fish.x,
                lavaBobY(0, fish),
                riverPosition(fish.x, fish.side, fish.lane),
            ]}
        >
            <ModelFishBone scale={fish.scale * 6} />
        </group>
    );
}

export default function LavaFishBones() {
    return (
        <group>
            {Array.from({ length: 20 }, (_, i) => (
                <FloatingFishBone key={i} />
            ))}
        </group>
    );
}
