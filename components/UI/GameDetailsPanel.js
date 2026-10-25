"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import UndoIcon from "@mui/icons-material/Undo";
import { useGameStore } from "@/hooks/useGameStore";
import ArticlesButton from "./Button";
import { useSearchParams } from "next/navigation";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";

const badgeSx = {
    display: "inline-block",
    bgcolor: "#000",
    color: "#fff",
    mr: "0.25rem",
    px: "0.65em",
    py: "0.35em",
    fontSize: "0.6rem",
    fontWeight: 700,
    lineHeight: 1,
    borderRadius: "0.375rem",
};

export default function GameDetailsPanel() {
    const players = useGameStore((state) => state.gameState?.players);
    const npcPlayers = useGameStore((state) => state.gameState?.npc_players);
    const socket = useSocketStore((state) => state.socket);
    const debug = useStore((state) => state.debug);

    return (
        <Card
            className="game-details-panel"
            variant="outlined"
            sx={{ bgcolor: "game.card", borderRadius: "0.375rem" }}
        >
            <CardContent sx={{ p: "1rem", "&:last-child": { pb: "1rem" } }}>
                <Box
                    sx={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        mb: "1rem",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <RoundAndTimer />
                </Box>
                <Box>Players</Box>
                <Box sx={{ border: 1, borderColor: "divider", mb: "1rem" }}>
                    {players?.map((player, index) => (
                        <Box
                            key={player.id || index}
                            className="player-entry"
                            sx={{
                                border: 1,
                                borderColor: "divider",
                                p: "0.5rem",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    fontSize: "0.6rem",
                                }}
                            >
                                <Box sx={{ mr: 1 }}>ID: {player.id}</Box>

                                <Box
                                    component="button"
                                    type="button"
                                    sx={{
                                        ...badgeSx,
                                        border: 0,
                                        cursor: "pointer",
                                        fontFamily: "inherit",
                                    }}
                                    onClick={() => {
                                        socket.emit(
                                            `game:${process.env.NEXT_PUBLIC_GAME_KEY}:change-team`,
                                            {
                                                team:
                                                    player.team === "Assassin"
                                                        ? "Sniper"
                                                        : "Assassin",
                                            },
                                        );
                                    }}
                                >
                                    {player.team || "N/A"}
                                </Box>
                                <Box
                                    component="span"
                                    sx={badgeSx}
                                >
                                    {player.character_type || "N/A"}
                                </Box>
                            </Box>
                            <Box
                                className="player-name"
                                sx={{ display: "flex", alignItems: "center" }}
                            >
                                <span>{player.nickname || "?"} </span>
                                <span>- {player.score || 0}</span>
                            </Box>
                            {debug && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Box>
                                        X: {player?.x?.toFixed(2) || 0} | Z:{" "}
                                        {player?.z?.toFixed(2) || 0}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>
                {debug && (
                    <>
                        <Box>NPC Players</Box>
                        <Box
                            sx={{
                                border: 1,
                                borderColor: "divider",
                                maxHeight: 250,
                                overflowY: "auto",
                            }}
                        >
                            {npcPlayers?.map((player, index) => (
                                <Box
                                    key={player.id || index}
                                    className="player-entry"
                                    sx={{
                                        border: 1,
                                        borderColor: "divider",
                                        p: "0.5rem",
                                    }}
                                >
                                    <Box sx={{ fontSize: "0.6rem" }}>
                                        ID: {player.id}
                                    </Box>
                                    <Box
                                        className="player-name"
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Box
                                            component="span"
                                            sx={badgeSx}
                                        >
                                            {player.character_type || "N/A"}
                                        </Box>
                                        <span>{player.nickname || "?"} </span>
                                        <span>- {player.score || 0}</span>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Box>
                                            X: {player?.x?.toFixed(2) || 0} | Z:{" "}
                                            {player?.z?.toFixed(2) || 0}
                                        </Box>
                                        <Box sx={{ display: "flex" }}>
                                            <Box sx={{ mr: "0.5rem" }}>
                                                <RocketLaunchIcon
                                                    sx={{
                                                        fontSize: "inherit",
                                                        mr: "0.2rem",
                                                    }}
                                                />
                                                {player.hitPower}
                                            </Box>
                                            <Box>
                                                <UndoIcon
                                                    sx={{
                                                        fontSize: "inherit",
                                                        mr: "0.2rem",
                                                    }}
                                                />
                                                {player.hitRotation}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

function RoundAndTimer() {
    const timer = useGameStore((state) => state.gameState?.timer);
    const status = useGameStore((state) => state.gameState?.status);
    const startGame = useSocketStore((state) => state.startGame);
    const searchParams = useSearchParams();
    const server = searchParams.get("server");
    const localPlay = searchParams.get("local_play");

    return (
        <Box sx={{ width: "100%" }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between",
                }}
            >
                <Box>Time: {timer?.toFixed(0) || 0}</Box>
                <Box>Status: {status || "N/A"}</Box>
            </Box>
            <ArticlesButton
                small
                sx={{ width: "100%", mt: "0.25rem" }}
                disabled={status === "In Progress"}
                onClick={() => {
                    if (localPlay === "true") {
                        useGameStore.getState().setGameState({
                            ...useGameStore.getState().gameState,
                            status: "In Progress",
                        });
                    }
                    if (server) startGame(server, "In Progress");
                }}
            >
                Start Game
            </ArticlesButton>
        </Box>
    );
}
