"use client";
import { useEffect, useRef } from "react";
import { useGameStore } from "@/hooks/useGameStore";
import { v4 as uuidv4 } from "uuid";

const SPEED = 6;        // units per second
const BOUNDS = 11.5;      // 23x23 area
const DEAD_ZONE = 0.15; // ignore small stick drift
const FPS = 30;
const INTERVAL = 1000 / FPS;

const PLAYER_COLORS = ["#4488ff", "#ff4444", "#44dd44", "#ffdd00"];

export default function LocalPlayGamepadHandler() {

    // Maps gamepadIndex -> player id
    const gamepadPlayerMap = useRef({});
    const prevButtonStates = useRef({}); // Maps gamepadIndex -> { lb: boolean, rb: boolean }
    const loopRef = useRef(null);

    useEffect(() => {

        const addPlayer = (gamepadIndex) => {
            if (gamepadPlayerMap.current[gamepadIndex] !== undefined) return;

            const id = uuidv4();
            gamepadPlayerMap.current[gamepadIndex] = id;

            const slotIndex = Object.keys(gamepadPlayerMap.current).length - 1;
            const currentGameState = useGameStore.getState().gameState;

            useGameStore.getState().setGameState({
                ...currentGameState,
                players: [
                    ...(currentGameState.players || []),
                    {
                        id,
                        x: 0,
                        z: 0,
                        type: "LOCAL",
                        team: "Assassin",
                        gamepadIndex,
                        color: PLAYER_COLORS[slotIndex % PLAYER_COLORS.length],
                    },
                ],
            });

            console.log(`[LocalPlayGamepadHandler] Gamepad ${gamepadIndex} connected → player ${id}`);
        };

        const removePlayer = (gamepadIndex) => {
            const playerId = gamepadPlayerMap.current[gamepadIndex];
            if (playerId === undefined) return;

            delete gamepadPlayerMap.current[gamepadIndex];

            const currentGameState = useGameStore.getState().gameState;

            useGameStore.getState().setGameState({
                ...currentGameState,
                players: (currentGameState.players || []).filter(
                    (p) => p.id !== playerId
                ),
            });

            console.log(`[LocalPlayGamepadHandler] Gamepad ${gamepadIndex} disconnected → removed player ${playerId}`);
        };

        const handleConnect = (e) => addPlayer(e.gamepad.index);
        const handleDisconnect = (e) => removePlayer(e.gamepad.index);

        window.addEventListener("gamepadconnected", handleConnect);
        window.addEventListener("gamepaddisconnected", handleDisconnect);

        // Some browsers fire gamepadconnected immediately on page load if a
        // gamepad was already connected; others don't. Poll once on mount to
        // catch pre-existing gamepads.
        const initialGamepads = navigator.getGamepads();
        for (let i = 0; i < initialGamepads.length; i++) {
            if (initialGamepads[i]) addPlayer(i);
        }

        return () => {
            window.removeEventListener("gamepadconnected", handleConnect);
            window.removeEventListener("gamepaddisconnected", handleDisconnect);
        };

    }, []);

    // Movement polling loop — runs at the same FPS as LocalPlayHandler's game loop
    useEffect(() => {

        loopRef.current = setInterval(() => {

            const gamepads = navigator.getGamepads();
            const map = gamepadPlayerMap.current;

            if (Object.keys(map).length === 0) return;

            const currentGameState = useGameStore.getState().gameState;
            const players = currentGameState.players;

            if (!players || players.length === 0) return;

            const isLobby = currentGameState.status === "In Lobby";
            let changed = false;

            const updatedPlayers = players.map((player) => {
                if (player.type !== "LOCAL") return player;

                const gamepad = gamepads[player.gamepadIndex];
                if (!gamepad) return player;

                // --- Team Change Logic (In Lobby only) ---
                let newTeam = player.team;
                if (isLobby) {
                    const lbPressed = gamepad.buttons[4]?.pressed; // Left Bumper
                    const rbPressed = gamepad.buttons[5]?.pressed; // Right Bumper
                    
                    const prev = prevButtonStates.current[player.gamepadIndex] || { lb: false, rb: false };

                    // Toggle on LB or RB press (detecting transition from false to true)
                    if ((lbPressed && !prev.lb) || (rbPressed && !prev.rb)) {
                        newTeam = player.team === "Assassin" ? "Sniper" : "Assassin";
                        changed = true;
                    }

                    // Store current state for next tick
                    prevButtonStates.current[player.gamepadIndex] = { lb: lbPressed, rb: rbPressed };
                }

                // --- Movement Logic ---
                const rawX = gamepad.axes[0] ?? 0;
                const rawZ = gamepad.axes[1] ?? 0;

                const dx = Math.abs(rawX) > DEAD_ZONE ? rawX : 0;
                const dz = Math.abs(rawZ) > DEAD_ZONE ? rawZ : 0;

                if (dx === 0 && dz === 0 && newTeam === player.team) return player;

                const step = SPEED / FPS;

                changed = true;

                return {
                    ...player,
                    team: newTeam,
                    ry: Math.atan2(dx, dz),
                    x: Math.max(-BOUNDS, Math.min(BOUNDS, player.x + dx * step)),
                    z: Math.max(-BOUNDS, Math.min(BOUNDS, player.z + dz * step)),
                };
            });

            if (changed) {
                useGameStore.getState().setGameState({
                    ...currentGameState,
                    players: updatedPlayers,
                });
            }

        }, INTERVAL);

        return () => {
            if (loopRef.current) clearInterval(loopRef.current);
        };

    }, []);

    return null;
}
