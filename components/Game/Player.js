import { useFrame, useThree } from "@react-three/fiber"
import { useCylinder, useSphere } from "@react-three/cannon"
import { useGLTF, useAnimations, Text } from '@react-three/drei'
import { memo, useEffect, useRef, useState } from "react"
import { Vector3 } from "three"
import * as THREE from 'three';
import { useKeyboard } from "@/hooks/useKeyboard"

import { useControllerStore } from '@/hooks/useControllerStore';
import { useGameStore } from "@/hooks/useGameStore";

import { useSearchParams } from "next/navigation"
import { useSocketStore } from "@/hooks/useSocketStore"
import useGameHelpers from "@/hooks/useGameHelpers"
import useTouchControlsStore from "@/hooks/useTouchControlsStore"

const JUMP_FORCE = 0;
const SPEED = 6;

let lastLocation

function myToFixed(i, digits) {
    var pow = Math.pow(10, digits);

    return Math.floor(i * pow) / pow;
}

function Player(props) {

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { local_play, server } = params

    // const { setPlayerData, teleportPlayer, setTeleportPlayer } = props;

    const socket = useSocketStore(state => state.socket)

    const {
        handleKillPlayer,
        handleSpotPlayer
    } = useGameHelpers()

    const {
        cameraMode, setCameraMode,
        teleport, setTeleport,
        setPlayerLocation,
        maxHeight, setMaxHeight,
        shift, setShift,
        addDistance,
        setPlayers
    } = useGameStore()

    const {
        touchControls, setTouchControls
    } = useTouchControlsStore()

    const [attackCoolDown, setAttackCoolDown] = useState(false);

    useEffect(() => {

        if (!attackCoolDown) return

        setTimeout(() => {

            setAttackCoolDown(false)

        }, 100)

    }, [attackCoolDown])

    const { controllerState, setControllerState } = useControllerStore()

    // Attach event listeners when the component mounts
    useEffect(() => {

        if (controllerState.axes && Math.abs(controllerState?.axes[0]) > 0.3) {

            if (controllerState?.axes[0] > 0) {
                api.position.set([-1, 5, 0]);
            } else {
                api.position.set([1, 5, 0]);
            }

        }

    }, [controllerState]);

    useEffect(() => {

        if (teleport) {

            console.log("Teleport has been called!", teleport)
            api.position.set(teleport[0], teleport[1], teleport[2]);
            setTeleport(false)

        }

    }, [teleport]);

    const { moveBackward, moveForward, moveRight, moveLeft, jump, shift: isShifting, crouch } = useKeyboard()

    const { camera } = useThree()

    const [ref, api] = useSphere(() => ({
        mass: 1,
        args: [1],
        position: [0, 2, 0],
        collisionFilterGroup: 1, // Player is in group 1
        collisionFilterMask: 2, // Player can collide with group 2 (rocks)
        onCollide: (e) => {
            console.log("Player Collided", e?.body.userData?.number)
        }
    }))

    const material = new THREE.MeshPhysicalMaterial({
        color: 'blue',
        // opacity: 0.5,
        // transparent: true
    });

    const vel = useRef([0, 0, 0])
    useEffect(() => {
        api.velocity.subscribe((v) => vel.current = v)
    }, [api.velocity])

    const pos = useRef([0, 0, 0])

    const touching = useRef(new Set())

    const [playerReachRef, playerReachApi] = useCylinder(() => ({
        mass: 0,
        type: 'Kinematic',
        isTrigger: true,
        args: [2, 2, 1, 8],
        position: [0, -10, 0], // Initially below the scene
        userData: {
            playerReach: true,
        },
        onCollideBegin: (e) => {
            // if (e.body.userData.isSpotlight) {
            //     console.log("Spotted!", e.body.userData.isSpotlight)
            //     setSpotted(true)
            //     setLastSpotted(new Date())
            // }
            if (e.body.userData.player) {
                console.log("Entered player reach!", e.body.userData)
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
                console.log("Left player reach!", e.body.userData)
                touching.current.delete(e.body)
                // setInPlayerReach(false)
            }
        }
    }))

    const playerModelRef = useRef()
    useEffect(() => {

        api.position.subscribe((p) => {

            pos.current = p

            playerReachApi.position.set(...p)

        })

        if (playerModelRef.current) {
            // Get the current position of the sphere from the physics API
            api.position.subscribe((position) => {

                playerModelRef?.current?.position.set(...position);

            });
        }

    }, [api.position])

    useEffect(() => {
        console.log("Shift", isShifting)
        setShift(isShifting)
    }, [isShifting])

    useFrame(() => {

        addDistance(0.1)

        // if (cameraMode == "Player") {
        //     camera.position.copy(new Vector3(0, pos.current[1], (pos.current[2] + 10)))
        //     camera.lookAt(new Vector3(0, pos.current[1], (pos.current[2] + 5)))
        // }

        let posX = 0
        if (pos.current[0]) {
            posX = myToFixed(pos.current[0], 2)
        }

        // console.log(pos.current[1])
        let posY = 0
        if (pos.current[1]) {
            posY = myToFixed(pos.current[1], 2)
        }

        let posZ = 0
        if (pos.current[2]) {
            posZ = myToFixed(pos.current[2], 2)
        }

        // console.log(posX)

        let newLocation = new Vector3(posX, posY, posZ)

        if (JSON.stringify(lastLocation) !== JSON.stringify(newLocation)) {
            // console.log(newLocation, lastLocation)
            setPlayerLocation(newLocation)
            lastLocation = newLocation
        }
        // else {
        //     console.log("location unchanged")
        // }

        if (pos.current[1] > maxHeight) {
            setMaxHeight(pos.current[1].toFixed(2))
        }

        const direction = new Vector3()

        if (touchControls.joystickVector?.x || touchControls.joystickVector?.y) {

            direction.set(
                touchControls.joystickVector.x,
                0,
                -touchControls.joystickVector.y
            )

        } else {

            const frontVector = new Vector3(
                0,
                0,
                (moveForward ? -1 : 0) - (moveBackward ? -1 : 0),
            )

            const sideVector = new Vector3(
                (moveLeft ? 1 : 0) - (moveRight ? 1 : 0),
                0,
                0,
            )

            direction.subVectors(frontVector, sideVector)
        }

        direction
            .normalize()
            .multiplyScalar(SPEED * (shift ? 2 : 1))
        // .applyEuler(camera.rotation)

        api.velocity.set(direction.x, 0, direction.z)

        const BOUNDS = 23; // Half of 23x23
        if (Math.abs(pos.current[0]) > BOUNDS || Math.abs(pos.current[2]) > BOUNDS) {
            api.position.set(
                Math.max(-BOUNDS, Math.min(BOUNDS, pos.current[0])),
                pos.current[1],
                Math.max(-BOUNDS, Math.min(BOUNDS, pos.current[2]))
            );
        }

        if (
            (jump || touchControls.jump)
            // && 
            // Math.abs(vel.current[1]) < 0.05 
            &&
            !attackCoolDown
        ) {

            const nearbyPlayers = Array.from(touching.current)
            const nearbyPlayersIdArray = nearbyPlayers.map((obj) => {
                return obj.userData.id
            })

            console.log("nearbyPlayersIdArray", nearbyPlayersIdArray)

            // const players = useGameStore.getState().players

            // let newPlayers = players.map(player_obj => {

            //     if (nearbyPlayersIdArray.includes(player_obj.number)) {
            //         return {
            //             ...player_obj,
            //             killedAt: new Date(),
            //             dead: new Date()
            //         }
            //     } else {
            //         return player_obj
            //     }

            // })

            handleKillPlayer(nearbyPlayersIdArray)

            setAttackCoolDown(true)

            if (touchControls.jump) {
                setTouchControls({
                    ...touchControls,
                    jump: false,
                })
            }
        }

    })

    return (
        <group>

            <group
                ref={playerModelRef}
            >
                {/* <SpacesuitModel
                    scale={2}
                    position={[0, -1, 0]}
                    action="Walk"
                /> */}
            </group>

            <mesh ref={playerReachRef}>
                <cylinderGeometry args={[2, 2, 1, 8]} /> {/* Cylinder dimensions */}
                <meshStandardMaterial
                    color="orange"
                    transparent={true}
                    opacity={0.5}
                />
            </mesh>

            <mesh
                ref={ref}
                // {...props}
                // position={position}
                material={material}
            >
                <sphereGeometry args={[1, 32, 32]} />

                {/* {character.model == 'Clownfish' && <ClownfishModel rotation={[0, Math.PI / 1, 0]} />}
                {character.model == 'Bone Fish' && <BoneFishModel rotation={[0, -Math.PI / 2, 0]} />} */}

                {/* <Text
                    color="black" position={[0, -0.7, 0]} scale={0.3} anchorX="center" anchorY="middle"
                >
                    Player ({character.model})
                </Text> */}

            </mesh>

        </group>
    )
}

export default Player