import { useFrame, useThree } from "@react-three/fiber"
import { BallCollider, CylinderCollider, RigidBody, useBeforePhysicsStep, useRapier } from "@react-three/rapier"
import { useGLTF, useAnimations, Text } from '@react-three/drei'
import { memo, useEffect, useRef, useState } from "react"
import { Vector3 } from "three"
import { useKeyboard } from "@/hooks/useKeyboard"

import { useControllerStore } from '@/hooks/useControllerStore';
import { useGameStore } from "@/hooks/useGameStore";

import { useSearchParams } from "next/navigation"
import { useSocketStore } from "@/hooks/useSocketStore"
import useGameHelpers from "@/hooks/useGameHelpers"
import useTouchControlsStore from "@/hooks/useTouchControlsStore"

// import Character from '@articles-media/articles-amcot-character/QuaterniusModular';
import Character from "./Character"
import { COLLISION_GROUPS } from "./physicsGroups"

const JUMP_FORCE = 0;
const SPEED = 6;

let lastLocation

function myToFixed(i, digits) {
    var pow = Math.pow(10, digits);

    return Math.floor(i * pow) / pow;
}

function Player(props) {

    const characterRef = useRef(null)
    const playerReachRef = useRef(null)
    const { rapier } = useRapier()

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
                characterRef.current?.setTranslation({ x: -1, y: 5, z: 0 }, true);
            } else {
                characterRef.current?.setTranslation({ x: 1, y: 5, z: 0 }, true);
            }

        }

    }, [controllerState]);

    useEffect(() => {

        if (teleport && characterRef.current) {

            console.log("Teleport has been called!", teleport)
            characterRef.current.setTranslation({ x: teleport[0], y: teleport[1], z: teleport[2] }, true);
            setTeleport(false)

        }

    }, [teleport]);

    const { moveBackward, moveForward, moveRight, moveLeft, jump, shift: isShifting, crouch } = useKeyboard()

    const { camera } = useThree()

    const pos = useRef([0, 0, 0])

    const touching = useRef(new Set())

    const handleReachEnter = ({ other }) => {
        const body = other.rigidBodyObject
        if (body?.userData.player) {
            console.log("Entered player reach!", body.userData)
            touching.current.add(body)
        }
    }

    const handleReachExit = ({ other }) => {
        const body = other.rigidBodyObject
        if (body?.userData.player) {
            console.log("Left player reach!", body.userData)
            touching.current.delete(body)
        }
    }

    const playerModelRef = useRef()
    const [currentAction, setCurrentAction] = useState('Idle')
    const movingFrames = useRef(0)
    const idleFrames = useRef(0)
    useBeforePhysicsStep(() => {
        // Keep the reach sensor upright while following the dynamic sphere.
        if (characterRef.current && playerReachRef.current) {
            playerReachRef.current.setNextKinematicTranslation(characterRef.current.translation())
        }
    })

    useEffect(() => {
        console.log("Shift", isShifting)
        setShift(isShifting)
    }, [isShifting])

    useFrame(() => {

        const body = characterRef.current
        if (!body) return

        const position = body.translation()
        pos.current = [position.x, position.y, position.z]

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

            if (socket) {
                socket.emit(`game:${process.env.NEXT_PUBLIC_GAME_KEY}:move`, {
                    server: server,
                    x: newLocation.x,
                    // y: newLocation.y,
                    z: newLocation.z,
                    action: currentAction,
                    // rotation: [0, degToRad(lastMove), 0]
                })
            }
            
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

        body.setLinvel({ x: direction.x, y: 0, z: direction.z }, true)

        const BOUNDS = 23; // Half of 23x23
        if (Math.abs(pos.current[0]) > BOUNDS || Math.abs(pos.current[2]) > BOUNDS) {
            pos.current[0] = Math.max(-BOUNDS, Math.min(BOUNDS, pos.current[0]))
            pos.current[2] = Math.max(-BOUNDS, Math.min(BOUNDS, pos.current[2]))
            body.setTranslation({ x: pos.current[0], y: pos.current[1], z: pos.current[2] }, true);
        }

        // Ensure the visual model faces movement direction and stays upright.
        if (playerModelRef.current) {
            // Face movement direction when moving (use small threshold to avoid jitter)
            if (direction.lengthSq() > 0.0001) {
                const angle = Math.atan2(direction.x, direction.z)
                playerModelRef.current.rotation.y = angle
            }
            playerModelRef.current.rotation.x = 0
            playerModelRef.current.rotation.z = 0
            playerModelRef.current.position.set(pos.current[0], 0, pos.current[2])
        }

        // Debounce player animation switching to avoid rapid flashing
        const MOVE_THRESHOLD = 0.0005
        if (direction.lengthSq() > MOVE_THRESHOLD) {
            movingFrames.current++
            idleFrames.current = 0
        } else {
            idleFrames.current++
            movingFrames.current = 0
        }

        if (movingFrames.current >= 2 && currentAction !== 'Walk') {
            setCurrentAction('Walk')
            movingFrames.current = 0
        }

        if (idleFrames.current >= 6 && currentAction !== 'Idle') {
            setCurrentAction('Idle')
            idleFrames.current = 0
        }

        if (
            (jump || touchControls.jump)
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

            {/* <group
                ref={playerModelRef}
            >
                <SpacesuitModel
                    scale={2}
                    position={[0, -1, 0]}
                    action="Walk"
                />
            </group> */}

            <RigidBody
                ref={playerReachRef}
                type="kinematicPosition"
                colliders={false}
                position={[0, -10, 0]}
                userData={{ playerReach: true }}
            >
                {/* Both the reach sensor and NPCs are kinematic bodies. */}
                <CylinderCollider
                    args={[0.5, 2]}
                    sensor
                    collisionGroups={COLLISION_GROUPS.sensor}
                    activeCollisionTypes={rapier.ActiveCollisionTypes.ALL}
                    onIntersectionEnter={handleReachEnter}
                    onIntersectionExit={handleReachExit}
                />
                <mesh>
                    <cylinderGeometry args={[2, 2, 1, 8]} />
                    <meshStandardMaterial color="orange" transparent={true} opacity={0.5} />
                </mesh>
            </RigidBody>

            <RigidBody
                ref={characterRef}
                colliders={false}
                position={[0, 2, 0]}
                onCollisionEnter={({ other }) => {
                    console.log("Player Collided", other.rigidBodyObject?.userData?.number)
                }}
            >
                <BallCollider args={[1]} mass={1} collisionGroups={COLLISION_GROUPS.player} />
            </RigidBody>

            <group 
                ref={playerModelRef}
            >
                <Character 
                    scale={2}
                    action={currentAction}
                />
            </group>

        </group>
    )
}

export default Player
