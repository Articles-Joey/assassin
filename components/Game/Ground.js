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

import { NearestFilter, RepeatWrapping, TextureLoader, Vector3 } from "three";

import {
    CuboidCollider,
    CylinderCollider,
    RigidBody,
    useBeforePhysicsStep,
    useRapier,
} from "@react-three/rapier";
import { degToRad } from "three/src/math/MathUtils";

import { SpotLight } from "three";
import { useGameStore } from "@/hooks/useGameStore";
import { useSocketStore } from "@/hooks/useSocketStore";
import useGameHelpers from "@/hooks/useGameHelpers";
import { COLLISION_GROUPS } from "./physicsGroups";

const game_name = "Assassin";
const game_key = "assassin";

export default function Ground() {
    const { rapier } = useRapier();

    const { socket } = useSocketStore((state) => ({
        socket: state.socket,
    }));

    const {
        handleKillPlayer,
        handleSpotPlayer,
        usersBulletCount,
        removeBullet,
    } = useGameHelpers();

    const visualSpotlightRef = useRef();
    const spotLightRef = useRef(null);

    const handleSpotlightEnter = ({ other }) => {
        const body = other.rigidBodyObject;
        if (body?.userData.player) {
            console.log("Player under spotlight!", body.userData);
            touching.current.add(body);
            handleSpotPlayer(body.userData.id);
        }
    };

    const handleSpotlightExit = ({ other }) => {
        const body = other.rigidBodyObject;
        if (body?.userData.player) {
            console.log("Player not under spotlight!", body.userData);
            touching.current.delete(body);
        }
    };

    const touching = useRef(new Set());

    // const [bullets, setBullets] = useState(3);
    // const bullets = useGameStore((state) => state.gameState)
    // const setBullets = useGameStore((state) => state.setBullets)

    // const removeBullet = useGameStore((state) => state.removeBullet)
    const setPlayers = useGameStore((state) => state.setPlayers);
    // const serverGameState = useGameStore((state) => state.serverGameState)
    // const setServerGameState = useGameStore((state) => state.setServerGameState)
    const isHost = useGameStore((state) => state.isHost);
    // const players = useGameStore((state) => state.players)

    // Local for a Assassin player
    const [hoverPosition, setHoverPosition] = useState(null); // To store mouse hover position
    // Server location for multiplayer
    const [syncedHoverPosition, setSyncedHoverPosition] = useState(null); // To store mouse hover position

    const [attackCoolDown, setAttackCoolDown] = useState(false);

    useEffect(() => {
        if (!attackCoolDown) return;

        setTimeout(() => {
            setAttackCoolDown(false);
        }, 100);
    }, [attackCoolDown]);

    useEffect(() => {
        socket.on(`game:${game_name}:spotLightMovement`, (data) => {
            // console.log("Got a spotLightMovement", data)
            setSyncedHoverPosition(data.location); // Update the state
        });

        socket.on(`game:${game_name}:playerLocations`, (data) => {
            console.log("Got a playerLocations event!", data);
            setPlayers(data); // Update the state
        });

        // socket.on(`game:${game_name}-room-${game.server_id}`, (data) => {
        //     console.log("Got a serverGameState event!", data)
        //     setServerGameState(data)
        //     // setPlayers(data); // Update the state
        // })

        return () => {
            socket.off(`game:${game_name}:spotLightMovement`);
            socket.off(`game:${game_name}:playerLocations`);
            // socket.off(`game:${game_name}:serverGameState`)
        };
    }, [socket]);

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

    useBeforePhysicsStep(() => {
        const [x, y, z] = hoverPosition || [0, -10, 0];
        spotLightRef.current?.setNextKinematicTranslation({ x, y, z });
    });

    // Update the visual spotlight position when hover changes.
    useEffect(() => {
        if (hoverPosition) {
            if (visualSpotlightRef.current) {
                const [x, y, z] = hoverPosition;
                visualSpotlightRef.current.position.set(x, y + 2, z);
                visualSpotlightRef.current.target.position.set(x, y - 5, z); // Point straight down
            }
        } else {
            // Optionally hide it by moving it far away
            if (visualSpotlightRef.current) {
                visualSpotlightRef.current.position.set(0, -10, 0);
                visualSpotlightRef.current.target.position.set(0, -11, 0);
            }
        }
    }, [hoverPosition]);

    const handlePointerMove = (event, socket) => {
        const point = event.point; // Get the 3D point on the geometry
        setHoverPosition([point.x, point.y, point.z]); // Update the state

        if (socket) {
            // console.log("Emit")a
            socket.emit(`game:${game_name}:spotLightMovement`, {
                location: [point.x, point.y, point.z],
            });
        }
    };

    const handlePointerOut = () => {
        setHoverPosition(null); // Reset when the mouse leaves the geometry
    };

    const handleOnClick = () => {
        console.log("touching", touching);
        console.log("usersBulletCount was", usersBulletCount);

        if (usersBulletCount >= 1) {
            removeBullet();

            const nearbyPlayers = Array.from(touching.current);
            const nearbyPlayersIdArray = nearbyPlayers.map((obj) => {
                return obj.userData.number;
            });

            console.log("Attack made", nearbyPlayersIdArray);
            const players = useGameStore.getState().players;

            let newPlayers = players.map((player_obj) => {
                if (nearbyPlayersIdArray.includes(player_obj.number)) {
                    return {
                        ...player_obj,
                        dead: new Date(),
                    };
                } else {
                    return player_obj;
                }
            });

            console.log("newPlayers", newPlayers);
            setPlayers(newPlayers);
            setAttackCoolDown(true);
        }
    };

    const spotlight = useMemo(() => new SpotLight("#fff"), []);

    return (
        <group>
            <RigidBody
                type="fixed"
                colliders={false}
            >
                <CuboidCollider
                    args={[50, 0.25, 50]}
                    collisionGroups={COLLISION_GROUPS.ground}
                />
                <mesh
                    onPointerMove={(e) => handlePointerMove(e, socket)} // Listen for pointer move
                    onPointerOut={handlePointerOut} // Handle when the pointer leaves
                    onClick={handleOnClick}
                >
                    <boxGeometry args={[100, 0.5, 100]} />
                    {/* <BeachBall /> */}
                    <meshStandardMaterial
                        opacity={0}
                        transparent={true}
                        color="#08e8de"
                    />
                </mesh>
            </RigidBody>

            <RigidBody
                ref={spotLightRef}
                type="kinematicPosition"
                colliders={false}
                position={[0, -10, 0]}
                userData={{ isSpotlight: true }}
            >
                {/* Spotlight intersections must include kinematic NPCs. */}
                <CylinderCollider
                    args={[0.5, 5]}
                    sensor
                    collisionGroups={COLLISION_GROUPS.sensor}
                    activeCollisionTypes={rapier.ActiveCollisionTypes.ALL}
                    onIntersectionEnter={handleSpotlightEnter}
                    onIntersectionExit={handleSpotlightExit}
                />
            </RigidBody>

            {syncedHoverPosition && (
                <mesh position={syncedHoverPosition}>
                    <mesh>
                        <cylinderGeometry args={[1, 1, 10, 32]} />{" "}
                        {/* Cylinder dimensions */}
                        <meshStandardMaterial
                            color="red"
                            transparent={true}
                            opacity={0.75}
                        />
                    </mesh>
                </mesh>
            )}

            {hoverPosition && (
                <mesh position={hoverPosition}>
                    <group>
                        <primitive
                            object={spotlight}
                            position={[0, 20, -20]}
                            intensity={1.5}
                            penumbra={0.5}
                        />
                        <primitive
                            object={spotlight.target}
                            position={[0, 0, 0]}
                        />
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
                        <cylinderGeometry args={[5, 5, 1, 32]} />{" "}
                        {/* Cylinder dimensions */}
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
                        {usersBulletCount}
                    </Text>
                </mesh>
            )}
        </group>
    );
}
