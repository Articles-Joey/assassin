"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LoginIcon from "@mui/icons-material/Login";
import { useGameStore } from "@/hooks/useGameStore";
import ArticlesButton from "@/components/UI/Button";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";
import GameMenuPrimaryButtonGroup from "@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup";
import { useRouter, useSearchParams } from "next/navigation";
import DebugPanel from "./DebugPanel";
import GameDetailsPanel from "./GameDetailsPanel";
import { useAudioStore } from "@/hooks/useAudioStore";

export default function LeftPanelContent() {
    const debug = useStore((state) => state.debug);

    return (
        <Box sx={{ width: "100%" }}>
            <GameMenuSection />
            <ServerSection />
            <GameDetailsPanel />
            <PlayerDataSection />
            <MaxHeightSection />
            {debug && <DebugPanel />}
        </Box>
    );
}

function ServerSection() {
    const server = useSearchParams().get("server");
    const players = useGameStore((state) => state.gameState?.players);
    const socket = useSocketStore((state) => state.socket);

    if (!server) return null;

    return (
        <Box sx={{ width: "100%" }}>
            <Card
                variant="outlined"
                sx={{
                    bgcolor: "game.card",
                    fontSize: "0.875rem",
                    borderRadius: "0.375rem",
                }}
            >
                <CardContent
                    sx={{ p: "0.5rem", "&:last-child": { pb: "0.5rem" } }}
                >
                    {server && (
                        <Box
                            sx={{
                                p: "0.5rem 1rem",
                                border: 1,
                                borderColor: "divider",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Box>Server: {server}</Box>
                                <Box>Players: {players?.length || 0}/4</Box>
                            </Box>
                            {!socket?.connected && (
                                <Box>
                                    <Box
                                        sx={{
                                            fontSize: "1rem",
                                            fontWeight: 500,
                                            mb: "0.25rem",
                                        }}
                                    >
                                        Not connected
                                    </Box>
                                    <ArticlesButton
                                        small
                                        sx={{ width: "100%" }}
                                        onClick={() => socket.connect()}
                                    >
                                        <LoginIcon
                                            sx={{
                                                fontSize: "inherit",
                                                mr: "0.2rem",
                                            }}
                                        />
                                        Reconnect!
                                    </ArticlesButton>
                                </Box>
                            )}
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}

function PlayerDataSection() {
    const playerLocation = useGameStore((state) => state.playerLocation);
    const shift = useGameStore((state) => state.shift);

    return (
        <Card
            variant="outlined"
            sx={{
                bgcolor: "game.card",
                fontSize: "0.875rem",
                borderRadius: "0.375rem",
            }}
        >
            <CardContent
                sx={{
                    p: "0.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    "&:last-child": { pb: "0.5rem" },
                }}
            >
                <Box>
                    <Box
                        sx={{
                            fontSize: "0.875em",
                            color: "text.secondary",
                        }}
                    >
                        playerData
                    </Box>
                    <Box sx={{ fontSize: "0.875em" }}>
                        <Box>X: {playerLocation?.x}</Box>
                        <Box>Y: {playerLocation?.y}</Box>
                        <Box>Z: {playerLocation?.z}</Box>
                        <Box>Shift: {shift ? "True" : "False"}</Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

function GameMenuSection() {
    return (
        <Card
            variant="outlined"
            sx={{
                bgcolor: "game.card",
                fontSize: "0.875rem",
                borderRadius: "0.375rem",
            }}
        >
            <CardContent sx={{ p: "0.5rem", "&:last-child": { pb: "0.5rem" } }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", mb: "1rem" }}>
                    <GameMenuPrimaryButtonGroup
                        useStore={useStore}
                        type="GameMenu"
                        useRouter={useRouter}
                        useAudioStore={useAudioStore}
                    />
                </Box>
            </CardContent>
        </Card>
    );
}

function MaxHeightSection() {
    const playerLocation = useGameStore((state) => state.playerLocation);
    const maxHeight = useGameStore((state) => state.maxHeight);
    const setMaxHeight = useGameStore((state) => state.setMaxHeight);

    return (
        <Card
            variant="outlined"
            sx={{
                bgcolor: "game.card",
                fontSize: "0.875rem",
                borderRadius: "0.375rem",
            }}
        >
            <CardContent sx={{ p: "0.5rem", "&:last-child": { pb: "0.5rem" } }}>
                <Box sx={{ fontSize: "0.875em", color: "text.secondary" }}>
                    maxHeight
                </Box>
                <Box>Y: {maxHeight}</Box>
                <ArticlesButton
                    small
                    onClick={() => setMaxHeight(playerLocation?.y)}
                >
                    Reset
                </ArticlesButton>
            </CardContent>
        </Card>
    );
}
