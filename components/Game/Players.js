import { createContext, createRef, forwardRef, memo, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber"

import { NearestFilter, RepeatWrapping, TextureLoader, Vector3 } from "three";

import { Debug, Physics, useBox, useCylinder, useSphere } from "@react-three/cannon";
import { Model as SpacesuitModel } from "./Spacesuit";
import { useGameStore } from "@/hooks/useGameStore";

export default function Npcs() {

    const players = useGameStore((state) => state.players)

    useEffect(() => {
        console.log("players", players)
    }, [])

    return (
        <group>
            {players.map((item, item_i) => {
                return (
                    <mesh key={`npc-${item_i}`}>
                        <Npc
                            key={item_i}
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
        mass: 0,
        type: 'Dynamic',
        args: [1, 1, 5, 8],
        position: getRandomPosition(),
        userData: {
            player: true,
            number: player_data?.number,
            dead: player_data?.dead
        },
        onCollideBegin: (e) => {
            if (e.body.userData.isSpotlight) {
                console.log("Spotted!", e.body.userData, player_data)
                setSpotted(true)
                setLastSpotted(new Date())
            }
            // if (e.body.userData.playerReach) {
            //     console.log("Entered player reach!", e.body.userData)
            //     setInPlayerReach(true)
            // }
        },
        onCollideEnd: (e) => {
            if (e.body.userData.isSpotlight) {
                console.log("Spotted!", e.body.userData.isSpotlight)
                setSpotted(false)
                setLastSpotted(new Date())
            }
            // if (e.body.userData.playerReach) {
            //     console.log("Left player reach!", e.body.userData)
            //     setInPlayerReach(false)
            // }
        }
    }))

    useEffect(() => {
        // ref.current.position.set(getRandomPosition())
        // Set the first target position
        setTargetPosition(getRandomPosition());
    }, []);

    // useFrame(() => {
    //     if (npcRef.current) {
    //         const npc = npcRef.current.position;
    //         const [targetX, targetY, targetZ] = targetPosition;

    //         // Calculate the direction vector
    //         const dx = targetX - npc.x;
    //         const dz = targetZ - npc.z;

    //         // Calculate the distance to the target
    //         const distance = Math.sqrt(dx ** 2 + dz ** 2);

    //         // Rotate the NPC to face the target
    //         if (distance > 0.1) {
    //             const angle = Math.atan2(dz, dx); // Angle in radians
    //             npcRef.current.rotation.y = angle; // Set rotation on the Y-axis
    //         }

    //         // If the NPC is close enough to the target, pick a new random position
    //         if (distance < 0.1) {
    //             setTargetPosition(getRandomPosition());
    //         } else {
    //             // Move the NPC toward the target position
    //             const speed = 0.05; // Adjust speed as needed
    //             npc.x += dx * speed / distance; // Normalize the movement vector
    //             npc.z += dz * speed / distance; // Normalize the movement vector
    //         }
    //     }
    // });

    const [waiting, setWaiting] = useState(false);

    useFrame(() => {
        // Get current position from physics body
        if (!ref.current) return


        // if (player_data.dead) return

        if (!isHost) {
            setWaiting(true)
            setTargetPosition([0, 0, 0])
            api.position.set(
                player_data?.location?.x, 
                player_data?.location?.y, 
                player_data?.location?.z,
            )
            return
        }

        const npcPosition = new Vector3()
        ref.current.getWorldPosition(npcPosition)

        // if (player_data.number === 0) {
            const players = useGameStore.getState().players
            let location = ref.current.getWorldPosition(npcPosition)
            setPlayers(players.map(obj => {
                if (obj.number === player_data.number) {
                    return {
                        ...obj,
                        location,
                    }
                } else {
                    return obj
                }
            }))
        // }

        const [targetX, _, targetZ] = targetPosition

        if (deadRef.current && lastSpotted > deadRef.current) {
            // console.log("Player is dead")
            // setTargetPosition([0, 0, 0])a
            api.velocity.set(0, 0, 0)
            return
        }

        const dx = targetX - npcPosition.x
        const dz = targetZ - npcPosition.z
        const distance = Math.sqrt(dx ** 2 + dz ** 2)

        if (distance < 0.5) {

            // setTargetPosition(getRandomPosition())

            if (!waiting) {
                setWaiting(true);
                const waitTime = Math.random() * 4000 + 1000; // 1000ms to 5000ms (1s to 5s)
                setTimeout(() => {
                    setTargetPosition(getRandomPosition());
                    setWaiting(false);
                }, waitTime);
                // Stop moving while waiting
                api.velocity.set(0, 0, 0);
            }

        } else if ((!waiting)) {
            const speed = 1.5
            const vx = (dx / distance) * speed
            const vz = (dz / distance) * speed
            api.velocity.set(vx, 0, vz)

            // Optional: rotate model toward direction
            const angle = Math.atan2(vz, vx)
            if (npcRef.current) {
                npcRef.current.rotation.y = angle - Math.PI / 2
            }
        }
    })

    return (
        <>
            <group ref={ref}>
                <group ref={npcRef}>

                    <SpacesuitModel scale={spotted ? 3 : 2} action={deadRef.current && lastSpotted > deadRef.current ? 'Death' : 'Walk'} />

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
            {/* {targetPosition &&
                <mesh position={targetPosition}>
                    <cylinderGeometry args={[1, 1, 10, 8]} />
                    <meshStandardMaterial
                        color={'green'}
                        transparent={true}
                        opacity={0.75}
                    />
                </mesh>
            } */}
        </>
    );
}