"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useGameStore } from "@/hooks/useGameStore";
import { v4 as uuidv4 } from 'uuid';
import { set } from "date-fns";
import LocalPlayGamepadHandler from "./LocalPlayGamepadHandler";
import generateRandomInteger from "@/util/generateRandomInteger";

const initialGameState = {
    players: [],
    npc_players: [],
    status: "In Lobby",
    timer: 0,
}

function generateNPC(existingItems = []) {

    const spawnRange = 40;
    const MAX_ATTEMPTS = 20;

    let x, z, attempts = 0;
    do {
        x = Math.floor(Math.random() * spawnRange) - (spawnRange / 2);
        z = Math.floor(Math.random() * spawnRange) - (spawnRange / 2);
        attempts++;
    } while (
        attempts < MAX_ATTEMPTS &&
        existingItems.some(item => Math.sqrt((x - item.x) ** 2 + (z - item.z) ** 2) <= 1)
    );

    const id = uuidv4();
    const spawnedAt = new Date();
    const type = 'NPC';

    return {
        id,
        x,
        z,
        type,
        spawnedAt,
        character_type: generateRandomInteger(1, 11), // Random character type for variety
        nextMoveTime: new Date(Date.now() + Math.floor(Math.random() * 3000) + 2000), // Move every 2-5 seconds
    };
}

export default function LocalPlayHandler() {

    const pathname = usePathname()
    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { local_play } = params

    const gameState = useGameStore(state => state.gameState)
    const setGameState = useGameStore(state => state.setGameState)

    const loopRef = useRef(null);

    useEffect(() => {

        if (
            local_play === "true"
            ||
            pathname === "/"
        ) {
            console.log("[LocalPlayHandler] local_play param detected, setting up local play environment")

            const initialGameStateCopy = {
                ...initialGameState,
                npc_players: [...Array(10)].map(() => generateNPC())
            }

            // On setup create a game from initialGameState
            setGameState(initialGameStateCopy);

            // Game loop runs 30 times a second
            const fps = 30;
            const interval = 1000 / fps;

            loopRef.current = setInterval(() => {

                const gameState = useGameStore.getState().gameState; // Get latest game state

                const gameOver = gameState?.timer > 59;
                const gameStarted = gameState?.status == 'In Progress';

                // Game logic tick
                setGameState({
                    ...gameState,
                    ...((
                        gameStarted
                        ||
                        pathname === "/"
                    ) ?
                        {
                            timer: (gameState?.timer || 0) + (1 / 30),
                            npc_players: gameState.npc_players?.map(npc => {
                                const SPEED = 5; // units per second
                                const STEP = SPEED / 30;

                                // Moving toward target
                                if (npc.targetX !== undefined && npc.targetZ !== undefined) {
                                    const dx = npc.targetX - npc.x;
                                    const dz = npc.targetZ - npc.z;
                                    const dist = Math.sqrt(dx * dx + dz * dz);

                                    if (dist <= STEP) {
                                        // Arrived — stop and schedule next move
                                        return {
                                            ...npc,
                                            x: npc.targetX,
                                            z: npc.targetZ,
                                            targetX: undefined,
                                            targetZ: undefined,
                                            nextMoveTime: new Date(Date.now() + Math.floor(Math.random() * 3000) + 2000),
                                        };
                                    }
                                    // Step toward target at constant speed
                                    return {
                                        ...npc,
                                        ry: Math.atan2(dx, dz),
                                        x: npc.x + (dx / dist) * STEP,
                                        z: npc.z + (dz / dist) * STEP,
                                    };
                                }

                                // Not moving — pick new target if nextMoveTime has passed
                                if (new Date(npc.nextMoveTime) <= Date.now()) {
                                    const angle = Math.random() * Math.PI * 2;
                                    const distance = 3 + Math.random() * 7; // 3–10 units
                                    const BOUNDS = 11.5;
                                    const targetX = Math.max(-BOUNDS, Math.min(BOUNDS, npc.x + Math.cos(angle) * distance));
                                    const targetZ = Math.max(-BOUNDS, Math.min(BOUNDS, npc.z + Math.sin(angle) * distance));
                                    return { ...npc, targetX, targetZ };
                                }

                                return npc;
                            }),
                        }
                        :
                        {}
                    ),
                    ...(gameOver ? { status: 'Game Over' } : {}),
                })
            }, interval);

            return () => {
                if (loopRef.current) {
                    clearInterval(loopRef.current);
                }
            };
        }

    }, [local_play, setGameState])

    return (
        <>
            <LocalPlayGamepadHandler />
        </>
    )

}