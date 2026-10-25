"use client";

import { useId, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ReplayIcon from "@mui/icons-material/Replay";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import BugReportIcon from "@mui/icons-material/BugReport";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArticlesButton from "./Button";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";

export default function DebugPanel() {
    const resetPlayers = useGameStore((state) => state.resetPlayers);
    const reloadScene = useStore((state) => state.reloadScene);
    const debug = useStore((state) => state.debug);
    const setDebug = useStore((state) => state.setDebug);
    const setShowMenu = useStore((state) => state.setShowMenu);
    const cameraMode = useStore((state) => state.cameraMode);
    const setCameraMode = useStore((state) => state.setCameraMode);
    const [cameraAnchor, setCameraAnchor] = useState(null);
    const cameraMenuId = useId();
    const cameraButtonId = useId();

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
                    Debug Controls
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        <ArticlesButton
                            small
                            sx={{ width: "50%" }}
                            onClick={() => reloadScene()}
                        >
                            <ReplayIcon
                                sx={{ fontSize: "inherit", mr: "0.2rem" }}
                            />
                            Reload Game
                        </ArticlesButton>
                        <ArticlesButton
                            small
                            sx={{ width: "50%" }}
                            onClick={() => reloadScene()}
                        >
                            <ReplayIcon
                                sx={{ fontSize: "inherit", mr: "0.2rem" }}
                            />
                            Reset Camera
                        </ArticlesButton>
                        <ArticlesButton
                            small
                            sx={{ width: "50%" }}
                            onClick={() => resetPlayers()}
                        >
                            <ReplayIcon
                                sx={{ fontSize: "inherit", mr: "0.2rem" }}
                            />
                            Reset Players
                        </ArticlesButton>
                        <Box sx={{ width: "50%" }}>
                            <ArticlesButton
                                small
                                id={cameraButtonId}
                                sx={{ width: "100%" }}
                                aria-haspopup="menu"
                                aria-controls={
                                    cameraAnchor ? cameraMenuId : undefined
                                }
                                aria-expanded={Boolean(cameraAnchor)}
                                onClick={(event) =>
                                    setCameraAnchor(event.currentTarget)
                                }
                            >
                                <PhotoCameraIcon
                                    sx={{ fontSize: "inherit", mr: "0.2rem" }}
                                />
                                Camera
                                <ArrowDropDownIcon fontSize="small" />
                            </ArticlesButton>
                            <Menu
                                id={cameraMenuId}
                                anchorEl={cameraAnchor}
                                open={Boolean(cameraAnchor)}
                                onClose={() => setCameraAnchor(null)}
                                slotProps={{
                                    list: { "aria-labelledby": cameraButtonId },
                                    paper: {
                                        sx: { maxHeight: 600, width: 200 },
                                    },
                                }}
                            >
                                {["Free", "Player"].map((mode) => (
                                    <MenuItem
                                        key={mode}
                                        selected={cameraMode === mode}
                                        onClick={() => {
                                            setCameraMode(mode);
                                            setCameraAnchor(null);
                                            setShowMenu(false);
                                        }}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <PhotoCameraIcon fontSize="small" />
                                        {mode}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex" }}>
                        <ArticlesButton
                            small
                            sx={{ width: "50%" }}
                            onClick={() => setDebug(!debug)}
                        >
                            <BugReportIcon
                                sx={{ fontSize: "inherit", mr: "0.2rem" }}
                            />
                            <span>Debug: {debug ? "True" : "Disable"}</span>
                        </ArticlesButton>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
