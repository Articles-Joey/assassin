import { createContext, createRef, forwardRef, memo, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber"

import { NearestFilter, RepeatWrapping, TextureLoader, Vector3 } from "three";

import { Debug, Physics, useBox, useCylinder, useSphere } from "@react-three/cannon";
import { Model as SpacesuitModel } from "./Spacesuit";
import { useGameStore } from "@/hooks/useGameStore";
import Character from "./Character";
import { Billboard, Text } from "@react-three/drei";

export default function Npcs() {

    // const isHost = useGameStore((state) => state.isHost)
    const gameState = useGameStore((state) => state.gameState)
    const players = useGameStore((state) => state.gameState.players)
    const npc_players = useGameStore((state) => state.gameState.npc_players)

    // useEffect(() => {
    //     if (isHost && !players) {
    //         const initialNpcs = [...Array(10)].map((_, i) => ({
    //             number: i,
    //             x: Math.random() * 50 - 25,
    //             z: Math.random() * 50 - 25,
    //             dead: false
    //         }))
    //         useGameStore.setState({
    //             gameState: {
    //                 ...gameState,
    //                 npc_players: initialNpcs
    //             }
    //         })
    //     }
    // }, [isHost, players, gameState])

    // useEffect(() => {
    //     console.log("npc_players update", players)
    // }, [players])

    return (
        <group>
            {players?.map((item, item_i) => {
                return (
                    <mesh key={`npc-${item.number ?? item_i}`}>
                        <Npc
                            key={item.number ?? item_i}
                            player_data={item}
                        />
                        {/* <Outlines thickness={0.05} color="hotpink" /> */}
                    </mesh>
                )
            })}
            {npc_players?.map((item, item_i) => {
                return (
                    <mesh key={`npc-${item.number ?? item_i}`}>
                        <Npc
                            key={item.number ?? item_i}
                            player_data={item}
                        />
                        {/* <Outlines thickness={0.05} color="hotpink" /> */}
                    </mesh>
                )
            })}
        </group>
    )
}

export function Npc({ player_data }) {

    const isHost = useGameStore((state) => state.isHost)
    const setPlayers = useGameStore((state) => state.setPlayers)

    const [inPlayerReach, setInPlayerReach] = useState(false);
    const [dead, setDead] = useState(false);

    const [spotted, setSpotted] = useState(false);
    const [lastSpotted, setLastSpotted] = useState(false);

    const [targetPosition, setTargetPosition] = useState([0, 0, 0]); // Initial target position
    const npcRef = useRef();

    const [currentAnimation, setCurrentAnimation] = useState('Idle');
    const posHistory = useRef([]);

    const deadRef = useRef(player_data?.dead)
    useEffect(() => {
        deadRef.current = player_data?.dead
    }, [player_data?.dead])

    // Function to generate a random position within -25 to 25 range on X and Z
    const getRandomPosition = () => {
        const x = Math.random() * 50 - 25; // Random X between -25 and 25
        const z = Math.random() * 50 - 25; // Random Z between -25 and 25
        return [x, 0, z]; // Y remains 0 for a flat plane
    };

    const [ref, api] = useCylinder(() => ({
        mass: 1,
        type: 'Kinematic',
        args: [1, 1, 5, 8],
        position: [
            player_data?.x || 0,
            0,
            player_data?.z || 0,
        ],
        collisionFilterGroup: 2,
        userData: {
            player: true,
            id: player_data?.id,
            dead: player_data?.dead
        },
        onCollideBegin: (e) => {
            if (e.body.userData.isSpotlight) {
                console.log("Spotted!", e.body.userData, player_data)
                setSpotted(true)
                setLastSpotted(new Date())
            }
        },
        onCollideEnd: (e) => {
            if (e.body.userData.isSpotlight) {
                console.log("Spotted!", e.body.userData.isSpotlight)
                setSpotted(false)
                setLastSpotted(new Date())
            }
        }
    }))

    useFrame(() => {
        if (player_data) {
            api.position.set(
                player_data.x || 0,
                0,
                player_data.z || 0
            )

            if (player_data.ry !== undefined && npcRef.current) {
                npcRef.current.rotation.y = player_data.ry
            }

            // Animation logic based on movement in last 3 frames
            const currentPos = { x: player_data.x || 0, z: player_data.z || 0 };
            posHistory.current.push(currentPos);
            if (posHistory.current.length > 3) posHistory.current.shift();

            let nextAnimation = 'Idle';
            if (player_data.seenDead) {
                nextAnimation = 'Death';
            } else if (posHistory.current.length === 3) {
                const first = posHistory.current[0];
                const last = posHistory.current[2];
                const distance = Math.sqrt(
                    Math.pow(last.x - first.x, 2) + Math.pow(last.z - first.z, 2)
                );
                // If moved more than a small threshold, set to Walk
                if (distance > 0.01) {
                    nextAnimation = 'Walk';
                }
            }

            if (nextAnimation !== currentAnimation) {
                setCurrentAnimation(nextAnimation);
            }
        }
    })

    return (
        <>
            <group ref={ref}>
                <group ref={npcRef}>

                    {/* <SpacesuitModel
                        scale={spotted ? 3 : 2}
                        action={deadRef.current && lastSpotted > deadRef.current ? 'Death' : 'Walk'}
                    /> */}

                    <Billboard>

                        {player_data?.seenDead && (<Text
                            position={[0, 6, 0]}
                            scale={0.7}
                        >
                            Dead
                        </Text>)}

                        {player_data?.spottedAt && (<Text
                            position={[0, 4, 0]}
                            scale={0.7}
                        >
                            Last Spotted: {new Date(player_data?.spottedAt).toTimeString().split(' ')[0]}
                        </Text>)}

                        {player_data?.killedAt && (<Text
                            position={[0, 5, 0]}
                            scale={0.7}
                        >
                            Killed At: {new Date(player_data.killedAt).toTimeString().split(' ')[0]}
                        </Text>)}

                    </Billboard>

                    <Character
                        type={player_data?.character_type}
                        scale={spotted ? 3 : 2}
                        action={currentAnimation}
                    />

                    {lastSpotted &&
                        <mesh>
                            <cylinderGeometry args={[1, 1, 1, 8]} /> {/* Cylinder dimensions */}
                            <meshStandardMaterial
                                color={!player_data.dead ? 'blue' : 'red'}
                                transparent={true}
                                opacity={0.5}
                            />
                        </mesh>
                    }

                    {/* <Outlines thickness={1} color="red" /> */}

                </group>
            </group>
            {targetPosition &&
                <mesh position={targetPosition}>
                    <cylinderGeometry args={[1, 1, 10, 8]} />
                    <meshStandardMaterial
                        color={'green'}
                        transparent={true}
                        opacity={0.75}
                    />
                </mesh>
            }
        </>
    );
}