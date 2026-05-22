import { createContext, createRef, forwardRef, memo, Suspense, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Sky, useDetectGPU, useTexture, OrbitControls, Cylinder, QuadraticBezierLine, Text, Outlines, Billboard, Stats } from "@react-three/drei";

// import { NearestFilter, RepeatWrapping, TextureLoader, Vector3 } from "three";

import { Debug, Physics, useBox, useCylinder, useSphere } from "@react-three/cannon";
import { degToRad } from "three/src/math/MathUtils";
import FloorPlane from "./FloorPlane";
// import { Model as SpacesuitModel } from "@/components/Games/Assets/Quaternius/men/Spacesuit";
// import { Model as SpacesuitModel } from "./Spacesuit";
import Player from "./Player";
// import { SpotLight } from "three";
// import { useGameStore } from "@/hooks/useGameStore";
import TilePlane from "./Wall";
import LavaPlane from "./LavaPlane";
import LavaBurst from "./LavaBurst";
import Npcs from "./Players";
import Ground from "./Ground";
import { useStore } from "@/hooks/useStore";

// const game_name = 'Assassin'
// const game_key = 'assassin'

function GameCanvas({
    landingAnimationMode = false,
}) {

    const debug = useStore((state) => state.debug)
    const showStats = useStore((state) => state?.debugConfig?.showStats);

    return (
        <Canvas camera={{ position: [0, 30, 45], fov: 50 }}>

            {showStats && <>
                <Stats className="stats-overlay" />
            </>}

            <OrbitControls
            // autoRotate={gameState?.status == 'In Lobby'}
            />

            {/* <Sky
                sunPosition={[0, 100, 0]}
            /> */}

            <ambientLight intensity={2.5} />
            {/* <spotLight intensity={30000} position={[-50, 100, 50]} angle={5} penumbra={1} /> */}

            <Suspense>
                <TilePlane
                    args={[150, 75]}
                    position={[
                        0,
                        (75 / 2),
                        -30
                    ]}
                // rotation={[degToRad(-90), 0, 0]}
                />
    
                <FloorPlane
                    args={[50, 50]}
                    position={[
                        0,
                        0,
                        0
                    ]}
                    rotation={[degToRad(-90), 0, 0]}
                />
    
                <LavaPlane
                    args={[150, 150]}
                    position={[
                        0,
                        -0.2,
                        0
                    ]}
                    rotation={[degToRad(-90), 0, 0]}
                />
            </Suspense>

            <Suspense>
                <LavaBurst />
            </Suspense>

            <Suspense>
                <Physics>
    
                    <Debug scale={debug ? 1 : 0}>
    
                        <Player />
    
                        {/* <Npc /> */}
                        <Npcs />
    
                        <Ground />
    
                    </Debug>
    
                </Physics>
            </Suspense>

        </Canvas>
    )
}

export default memo(GameCanvas)

