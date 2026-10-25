import { useState } from "react";
import DecoratedModelSkullCandle from "@/components/Models/DecoratedModelSkullCandle";
import { RIVER_LENGTH, riverEdge, terrainHeight } from "./riverLayout";

export default function TerrainSkullCandles({ flameAnimationDistance }) {
    const [candles] = useState(() =>
        [-1, 1].flatMap((side) =>
            Array.from({ length: 8 }, (_, i) => {
                // One randomized placement per strip keeps all eight spread out.
                const x =
                    -RIVER_LENGTH / 2 +
                    15 +
                    ((i + 0.2 + Math.random() * 0.6) * (RIVER_LENGTH - 30)) / 8;
                const distance = 18 + Math.random() * 70;
                return {
                    position: [
                        x,
                        terrainHeight(x, distance),
                        riverEdge(x, side) + side * distance,
                    ],
                    rotation: [0, Math.random() * Math.PI * 2, 0],
                    scale: 3 + Math.random() * 1.5,
                };
            }),
        ),
    );

    return (
        <group>
            {candles.map((props, i) => (
                <DecoratedModelSkullCandle
                    key={i}
                    {...props}
                    flameAnimationDistance={flameAnimationDistance}
                />
            ))}
        </group>
    );
}
