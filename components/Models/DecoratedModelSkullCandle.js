import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Vector2, Vector3 } from "three";
import {
    ModelSkullCandle,
    skullCandleSource,
} from "@/public/models/Skull Candle/Skull Candle by Kay Lousberg - 94tuTO5eJv";
import skullCandleWicks from "./skullCandleWicks";

const flameProfile = [
    new Vector2(0, 0),
    new Vector2(0.16, 0.08),
    new Vector2(0.22, 0.3),
    new Vector2(0.15, 0.62),
    new Vector2(0.06, 0.86),
    new Vector2(0, 1),
];

function CandleFlame({ position, size, animate }) {
    const flame = useRef();
    const [phase] = useState(() => Math.random() * Math.PI * 2);
    useFrame(({ clock }) => {
        if (!flame.current || !animate.current) return;
        const time = clock.elapsedTime;
        const flicker =
            1 +
            Math.sin(time * 13 + phase) * 0.09 +
            Math.sin(time * 21 + phase) * 0.04;
        flame.current.scale.set(
            size * (2 - flicker),
            size * flicker,
            size * (2 - flicker),
        );
        flame.current.rotation.z = Math.sin(time * 4 + phase) * 0.12;
        flame.current.rotation.x = Math.cos(time * 3.2 + phase) * 0.08;
    });
    return (
        <group position={position}>
            <group
                ref={flame}
                scale={size}
            >
                <mesh>
                    <latheGeometry args={[flameProfile, 12]} />
                    <meshBasicMaterial
                        color="#ff8a16"
                        toneMapped={false}
                        transparent
                        opacity={0.7}
                        depthWrite={false}
                    />
                </mesh>
                <mesh
                    position={[0, 0.02, 0]}
                    scale={[0.65, 0.72, 0.65]}
                >
                    <latheGeometry args={[flameProfile, 12]} />
                    <meshBasicMaterial
                        color="#fff1a6"
                        toneMapped={false}
                    />
                </mesh>
            </group>
        </group>
    );
}

// A unit-height decoration: the caller's scale is its height in world units.
export default function DecoratedModelSkullCandle({
    flameAnimationDistance = 80,
    ...props
}) {
    const { nodes } = useGLTF(skullCandleSource);
    const layout = useMemo(
        () => skullCandleWicks(nodes.skull_candle.geometry),
        [nodes],
    );
    const source = useRef();
    const decoration = useRef();
    const light = useRef();
    const animateFlames = useRef(false);
    const [worldPosition] = useState(() => new Vector3());
    const [cameraPosition] = useState(() => new Vector3());
    const [phase] = useState(() => Math.random() * Math.PI * 2);
    const sourceHeight = layout.size.y * 100;
    const wickPositions = layout.tips.map(([x, y, z]) => [
        x * 100,
        (y - layout.bounds.min.y) * 100,
        z * 100,
    ]);

    useLayoutEffect(() => {
        source.current?.traverse((object) => {
            if (object.isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
    }, []);
    useFrame(({ camera, clock }) => {
        if (!decoration.current) return;
        decoration.current.getWorldPosition(worldPosition);
        camera.getWorldPosition(cameraPosition);
        animateFlames.current =
            cameraPosition.distanceToSquared(worldPosition) <=
            flameAnimationDistance ** 2;
        if (!animateFlames.current) return;
        if (light.current)
            light.current.intensity =
                1.8 + Math.sin(clock.elapsedTime * 11 + phase) * 0.3;
    }, -1);

    return (
        <group
            ref={decoration}
            {...props}
        >
            <group scale={1 / sourceHeight}>
                <group ref={source}>
                    <ModelSkullCandle
                        position={[0, -layout.bounds.min.y * 100, 0]}
                    />
                </group>
                {wickPositions.map((position, i) => (
                    <CandleFlame
                        key={i}
                        position={position}
                        size={sourceHeight * 0.12}
                        animate={animateFlames}
                    />
                ))}
            </group>
            <pointLight
                ref={light}
                position={[0, 0.85, 0]}
                color="#ffb34e"
                intensity={1.8}
                distance={6}
                decay={2}
            />
        </group>
    );
}
