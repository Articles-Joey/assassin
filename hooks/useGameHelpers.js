import { useSearchParams } from "next/navigation";
import { useGameStore } from "./useGameStore";
import { useSocketStore } from "./useSocketStore";
import { useEffect, useMemo, useState } from "react";

export default function useGameHelpers() {
    const searchParams = useSearchParams();
    const params = Object.fromEntries(searchParams.entries());
    const { local_play, server } = params;

    const socket = useSocketStore((state) => state.socket);
    const players = useGameStore((state) => state.gameState?.players);

    function handleSpotPlayer(playerId) {
        console.log("handleSpotPlayer", playerId);

        if (server) {
            socket.emit(
                `game:${process.env.NEXT_PUBLIC_GAME_KEY}:spot_player`,
                {
                    server,
                    playerId,
                },
            );
        }

        // if (local_play === "true") {

        // }
    }

    function handleKillPlayer(players) {
        console.log("handleKillPlayer", players);

        if (server) {
            // setPlayers(newPlayers)
            socket.emit(
                `game:${process.env.NEXT_PUBLIC_GAME_KEY}:kill_players`,
                {
                    server,
                    players: players,
                },
            );
        }

        if (local_play === "true") {
            // setPlayers(newPlayers)
        }
    }

    function handleChangeTeam() {}

    const [usersPlayer, setUsersPlayer] = useState(null);

    useEffect(() => {
        console.log("socket.id", socket.id);

        const gameState = useGameStore.getState().gameState;
        // const playerId = useGameStore.getState().playerId

        if (gameState) {
            const player = [
                ...(gameState.players || []),
                ...(gameState.npc_players || []),
            ].find((p) => p.id === socket.id);
            setUsersPlayer(player);
        }
    }, [socket.id, players]);

    const usersBulletCount = useMemo(() => {
        if (server) {
            const gameState = useGameStore.getState().gameState;
            const player = [
                ...(gameState.players || []),
                ...(gameState.npc_players || []),
            ].find((p) => p.id === socket.id);
            return player?.bullets || 0;
        }
    }, [players]);

    function removeBullet() {
        if (server) {
            socket.emit(
                `game:${process.env.NEXT_PUBLIC_GAME_KEY}:remove_bullet`,
                {
                    server,
                },
            );
        }
    }

    return {
        handleKillPlayer,
        handleSpotPlayer,
        usersPlayer,
        usersBulletCount,
        removeBullet,
        setUsersPlayer,
    };
}
