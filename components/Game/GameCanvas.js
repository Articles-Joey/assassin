import { createContext, createRef, forwardRef, memo, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Sky, useDetectGPU, useTexture, OrbitControls, Cylinder, QuadraticBezierLine, Text, Outlines, Billboard } from "@react-three/drei";

import { NearestFilter, RepeatWrapping, TextureLoader, Vector3 } from "three";

import { Debug, Physics, useBox, useCylinder, useSphere } from "@react-three/cannon";
import { degToRad } from "three/src/math/MathUtils";
import FloorPlane from "./FloorPlane";
// import { Model as SpacesuitModel } from "@/components/Games/Assets/Quaternius/men/Spacesuit";
// import { Model as SpacesuitModel } from "./Spacesuit";
import Player from "./Player";
import { SpotLight } from "three";
import { useGameStore } from "@/hooks/useGameStore";
import TilePlane from "./Wall";
import LavaPlane from "./LavaPlane";
import LavaBurst from "./LavaBurst";
// import { socket } from "@/components/context/best-socket";
import { useSocketStore } from "@/hooks/useSocketStore";
import Npcs from "./Players";

const game_name = 'Assassin'
const game_key = 'assassin'

const texture = new TextureLoader().load(`${process.env.NEXT_PUBLIC_CDN}games/Race Game/grass.jpg`)

const GrassPlane = () => {

    const width = 110; // Set the width of the plane
    const height = 170; // Set the height of the plane

    texture.magFilter = NearestFilter;
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(5, 5)

    return (
        <>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                <planeGeometry attach="geometry" args={[width, height]} />
                <meshStandardMaterial attach="material" map={texture} />
            </mesh>
        </>
    );
};

function GameCanvas(props) {

    return (
        <Canvas camera={{ position: [0, 20, 20], fov: 50 }}>

            <OrbitControls
            // autoRotate={gameState?.status == 'In Lobby'}
            />

            {/* <Sky
                sunPosition={[0, 100, 0]}
            /> */}

            <ambientLight intensity={2.5} />
            {/* <spotLight intensity={30000} position={[-50, 100, 50]} angle={5} penumbra={1} /> */}

            <TilePlane
                args={[150, 75]}
                position={[
                    0,
                    (75 / 2),
                    -25
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

            <LavaBurst />

            <Physics debug>

                <Debug>

                    <Player />

                    {/* <Npc /> */}
                    <Npcs />

                    <Ground />

                </Debug>

            </Physics>

        </Canvas>
    )
}

export default memo(GameCanvas)

function Ground() {

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    const [ref, api] = useBox(() => ({
        mass: 0,
        type: 'Static',
        args: [100, 0.5, 100],
        position: [0, 0, 0],
        collisionFilterGroup: 2, // Rocks are in group 2
        collisionFilterMask: 1,  // Rocks collide with players
    }))

    const visualSpotlightRef = useRef()
    const [spotLightRef, spotLightApi] = useCylinder(() => ({
        mass: 0,
        type: 'Kinematic',
        args: [5, 5, 1, 32],
        position: [0, -10, 0], // Initially below the scene
        userData: {
            isSpotlight: true,
        },
        onCollideBegin: (e) => {
            // if (e.body.userData.isSpotlight) {
            //     console.log("Spotted!", e.body.userData.isSpotlight)
            //     setSpotted(true)
            //     setLastSpotted(new Date())
            // }
            if (e.body.userData.player) {
                console.log("Player under spotlight!", e.body.userData)
                touching.current.add(e.body)
                // setInPlayerReach(true)
            }
        },
        onCollideEnd: (e) => {
            // if (e.body.userData.isSpotlight) {
            //     console.log("Spotted!", e.body.userData.isSpotlight)
            //     setSpotted(false)
            //     setLastSpotted(new Date())
            // }
            if (e.body.userData.player) {
                console.log("Player not under spotlight!", e.body.userData)
                touching.current.delete(e.body)
                // setInPlayerReach(false)
            }
        }
    }))


    const touching = useRef(new Set())
    // const [bullets, setBullets] = useState(3);
    const bullets = useGameStore((state) => state.bullets)
    const setBullets = useGameStore((state) => state.setBullets)
    const removeBullet = useGameStore((state) => state.removeBullet)
    const setPlayers = useGameStore((state) => state.setPlayers)
    // const serverGameState = useGameStore((state) => state.serverGameState)
    // const setServerGameState = useGameStore((state) => state.setServerGameState)
    const isHost = useGameStore((state) => state.isHost)
    // const players = useGameStore((state) => state.players)

    // Local for a Assassin player
    const [hoverPosition, setHoverPosition] = useState(null); // To store mouse hover position
    // Server location for multiplayer
    const [syncedHoverPosition, setSyncedHoverPosition] = useState(null); // To store mouse hover position

    const [attackCoolDown, setAttackCoolDown] = useState(false);

    useEffect(() => {

        if (!attackCoolDown) return

        setTimeout(() => {

            setAttackCoolDown(false)

        }, 100)

    }, [attackCoolDown])

    useEffect(() => {

        socket.on(`game:${game_name}:spotLightMovement`, (data) => {
            // console.log("Got a spotLightMovement", data)
            setSyncedHoverPosition(data.location); // Update the state
        })

        socket.on(`game:${game_name}:playerLocations`, (data) => {
            console.log("Got a playerLocations event!", data)
            setPlayers(data); // Update the state
        })

        // socket.on(`game:${game_name}-room-${game.server_id}`, (data) => {
        //     console.log("Got a serverGameState event!", data)
        //     setServerGameState(data)
        //     // setPlayers(data); // Update the state
        // })

        return () => {
            socket.off(`game:${game_name}:spotLightMovement`)
            socket.off(`game:${game_name}:playerLocations`)
            // socket.off(`game:${game_name}:serverGameState`)
        }

    }, [socket])

    useEffect(() => {
        let playerLocationsInterval = null;

        if (isHost) {
            playerLocationsInterval = setInterval(() => {
                const players = useGameStore.getState().players;
                // console.group("players emit", players);
                socket.emit(`game:Assassin:playerLocations`, players);
            }, 1000 / 30); // 30 times per second
        }

        return () => {
            if (playerLocationsInterval) clearInterval(playerLocationsInterval);
        };
    }, [isHost]);

    // Update spotlight position when hover changes
    useEffect(() => {
        if (hoverPosition) {
            spotLightApi.position.set(...hoverPosition)

            if (visualSpotlightRef.current) {
                const [x, y, z] = hoverPosition
                visualSpotlightRef.current.position.set(x, y + 2, z)
                visualSpotlightRef.current.target.position.set(x, y - 5, z) // Point straight down
            }
        } else {
            // Optionally hide it by moving it far away
            spotLightApi.position.set(0, -10, 0)

            if (visualSpotlightRef.current) {
                visualSpotlightRef.current.position.set(0, -10, 0)
                visualSpotlightRef.current.target.position.set(0, -11, 0)
            }
        }
    }, [hoverPosition])

    const handlePointerMove = (event, socket) => {

        const point = event.point; // Get the 3D point on the geometry
        setHoverPosition([point.x, point.y, point.z]); // Update the state

        if (socket) {
            // console.log("Emit")a
            socket.emit(`game:${game_name}:spotLightMovement`, {
                location: [point.x, point.y, point.z]
            })
        }

    };

    const handlePointerOut = () => {
        setHoverPosition(null); // Reset when the mouse leaves the geometry
    };

    const handleOnClick = () => {
        console.log("touching", touching)
        console.log("bullets was", bullets)

        if (bullets >= 1) {

            removeBullet()

            const nearbyPlayers = Array.from(touching.current)
            const nearbyPlayersIdArray = nearbyPlayers.map((obj) => {
                return obj.userData.number
            })

            console.log("Attack made", nearbyPlayersIdArray)
            const players = useGameStore.getState().players

            let newPlayers = players.map(player_obj => {
                if (nearbyPlayersIdArray.includes(player_obj.number)) {
                    return {
                        ...player_obj,
                        dead: new Date()
                    }
                } else {
                    return player_obj
                }
            })

            console.log("newPlayers", newPlayers)
            setPlayers(newPlayers)
            setAttackCoolDown(true)
        }

    }

    const spotlight = useMemo(() => new SpotLight('#fff'), []);

    return (
        <group>

            <mesh
                ref={ref}
                castShadow
                onPointerMove={e => handlePointerMove(e, socket)} // Listen for pointer move
                onPointerOut={handlePointerOut} // Handle when the pointer leaves
                onClick={handleOnClick}
            >
                <boxGeometry args={[100, 0.5, 100]} />
                {/* <BeachBall /> */}
                <meshStandardMaterial opacity={0} transparent={true} color="#08e8de" />
            </mesh>

            {(syncedHoverPosition) &&
                <mesh position={syncedHoverPosition}>

                    <mesh>
                        <cylinderGeometry args={[1, 1, 10, 32]} /> {/* Cylinder dimensions */}
                        <meshStandardMaterial
                            color="red"
                            transparent={true}
                            opacity={0.75}
                        />
                    </mesh>

                </mesh>
            }

            {hoverPosition && (
                <mesh position={hoverPosition}>

                    <group>
                        <primitive
                            object={spotlight}
                            position={[0, 20, -20]}
                            intensity={1.5}
                            penumbra={0.5}
                        />
                        <primitive object={spotlight.target} position={[0, 0, 0]} />
                    </group>
                    {/* <spotLight
                        ref={visualSpotlightRef}
                        position={[0, -10, 0]} // start hidden
                        angle={Math.PI / 6}
                        distance={20}
                        intensity={1000}
                        penumbra={0.5}
                        castShadow
                    /> */}
                    {/* <primitive object={visualSpotlightRef?.current?.target} /> */}

                    <mesh>
                        <cylinderGeometry args={[5, 5, 1, 32]} /> {/* Cylinder dimensions */}
                        <meshStandardMaterial
                            color="white"
                            transparent={true}
                            opacity={0.5}
                        />
                    </mesh>

                    <Text
                        position={[0, 1, 3]}
                        rotation={[degToRad(-90), 0, 0]}
                        color="red"
                        scale={2}
                    >
                        {bullets}
                    </Text>

                </mesh>
            )}

        </group>
    )

}