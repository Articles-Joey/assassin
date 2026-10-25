import {
    createContext,
    createRef,
    forwardRef,
    memo,
    Suspense,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
    Sky,
    useDetectGPU,
    useTexture,
    OrbitControls,
    Cylinder,
    QuadraticBezierLine,
    Text,
    Outlines,
    Billboard,
    Stats,
} from "@react-three/drei";

// import { NearestFilter, RepeatWrapping, TextureLoader, Vector3 } from "three";

import { Physics } from "@react-three/rapier";
import { degToRad } from "three/src/math/MathUtils";
import FloorPlane from "./FloorPlane";
// import { Model as SpacesuitModel } from "@/components/Games/Assets/Quaternius/men/Spacesuit";
// import { Model as SpacesuitModel } from "./Spacesuit";
import Player from "./Player";
// import { SpotLight } from "three";
// import { useGameStore } from "@/hooks/useGameStore";
import RiverTerrain from "./RiverTerrain";
import Skybox from "./Skybox";
import DistantMountains from "./DistantMountains";
import SkullSwordLandmarks from "./SkullSwordLandmarks";
import TerrainSkullCandles from "./TerrainSkullCandles";
import LavaFishBones from "./LavaFishBones";
import LavaBonePockets from "./LavaBonePockets";
import LavaPlane from "./LavaPlane";
import LavaBurst from "./LavaBurst";
import Npcs from "./Players";
import Ground from "./Ground";
import { useStore } from "@/hooks/useStore";

// const game_name = 'Assassin'
// const game_key = 'assassin'

function GameCanvas({ landingAnimationMode = false }) {
    const darkMode = useStore((state) => state.darkMode);
    const showStats = useStore((state) => state?.debugConfig?.showStats);
    const showPhysicsDebug = useStore(
        (state) => state?.debugConfig?.showPhysicsDebug,
    );

    return (
        <Canvas
            shadows="soft"
            camera={{ position: [0, 30, 45], fov: 50 }}
        >
            {showStats && (
                <>
                    <Stats className="stats-overlay" />
                </>
            )}

            <OrbitControls
            // autoRotate={gameState?.status == 'In Lobby'}
            />

            {/* <Sky
                sunPosition={[0, 100, 0]}
            /> */}

            <Skybox />
            <DistantMountains />
            <Suspense fallback={null}>
                <SkullSwordLandmarks />
            </Suspense>
            <Suspense fallback={null}>
                <TerrainSkullCandles />
            </Suspense>
            <ambientLight
                intensity={darkMode ? 1.2 : 2}
                color={darkMode ? "#d99c83" : "#ffe2ce"}
            />
            <hemisphereLight
                args={[
                    darkMode ? "#c55b3c" : "#ffd4ad",
                    darkMode ? "#36100b" : "#765044",
                    darkMode ? 1.5 : 2.2,
                ]}
            />
            <directionalLight
                position={[-120, 150, 60]}
                intensity={darkMode ? 2 : 3.2}
                color={darkMode ? "#ff9c62" : "#ffe4c4"}
                castShadow
                shadow-mapSize={[4096, 4096]}
                shadow-camera-left={-190}
                shadow-camera-right={190}
                shadow-camera-top={190}
                shadow-camera-bottom={-190}
                shadow-camera-near={1}
                shadow-camera-far={500}
                shadow-bias={-0.0001}
                shadow-normalBias={0.08}
                shadow-radius={2}
            />
            {/* <spotLight intensity={30000} position={[-50, 100, 50]} angle={5} penumbra={1} /> */}

            <Suspense>
                <RiverTerrain />

                <FloorPlane
                    args={[50, 50]}
                    position={[0, -0.5, 0]}
                    rotation={[degToRad(0), 0, 0]}
                />

                <LavaPlane
                    args={[300, 50]}
                    position={[0, -0.5, 0]}
                    rotation={[degToRad(-90), 0, 0]}
                />
            </Suspense>

            <Suspense fallback={null}>
                <LavaFishBones />
            </Suspense>

            <Suspense fallback={null}>
                <LavaBonePockets />
            </Suspense>

            <Suspense>
                <LavaBurst
                    innerSize={20}
                    outerSize={30}
                />
            </Suspense>

            <Suspense>
                <Physics
                    debug={showPhysicsDebug}
                    gravity={[0, -9.81, 0]}
                >
                    {!landingAnimationMode && <Player />}

                    {/* <Npc /> */}
                    <Npcs />

                    <Ground />
                </Physics>
            </Suspense>
        </Canvas>
    );
}

export default memo(GameCanvas);
