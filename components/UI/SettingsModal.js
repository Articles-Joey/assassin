"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import ArticlesButton from "./Button";
import ArticlesModal from "./ArticlesModal";

const controls = [
    { action: "Move Up", defaultKeyboardKey: "W" },
    { action: "Move Down", defaultKeyboardKey: "S" },
    { action: "Move Left", defaultKeyboardKey: "A" },
    { action: "Move Right", defaultKeyboardKey: "D" },
    { action: "Shoot", defaultKeyboardKey: "Touch or Click" },
];

export default function FourFrogsSettingsModal({ show = true, setShow }) {
    const [tab, setTab] = useState("Controls");

    return (
        <ArticlesModal
            show={show}
            setShow={setShow}
            title="Game Settings"
            centered={false}
            contentSx={{ display: "flex", flexDirection: "column", p: 0 }}
            footerOverride={(setOpen) => (
                <Box>
                    <ArticlesButton
                        variant="outline-dark"
                        onClick={() => setOpen(false)}
                    >
                        Close
                    </ArticlesButton>
                    <ArticlesButton
                        variant="outline-danger"
                        color="error"
                        sx={{ ml: "1rem" }}
                        onClick={() => setShow(false)}
                    >
                        Reset
                    </ArticlesButton>
                </Box>
            )}
        >
            <Tabs
                value={tab}
                onChange={(_, value) => setTab(value)}
                aria-label="Settings categories"
            >
                {["Controls", "Audio", "Chat"].map((item) => (
                    <Tab
                        key={item}
                        value={item}
                        label={item}
                    />
                ))}
            </Tabs>
            <Divider />
            <Box sx={{ p: "0.5rem" }}>
                {tab === "Controls" && (
                    <Box>
                        {controls.map((control) => (
                            <Box
                                key={control.action}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    borderBottom: 1,
                                    borderColor: "divider",
                                    pb: "0.25rem",
                                    mb: "0.25rem",
                                }}
                            >
                                <Box>{control.action}</Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Chip
                                        size="small"
                                        label={control.defaultKeyboardKey}
                                        sx={{
                                            mr: "0.25rem",
                                            bgcolor: "primary.main",
                                            color: "primary.contrastText",
                                        }}
                                    />
                                    <ArticlesButton small>
                                        Change Key
                                    </ArticlesButton>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
                {tab === "Audio" && (
                    <>
                        <Typography id="game-volume-label">
                            Game Volume
                        </Typography>
                        <Slider
                            aria-labelledby="game-volume-label"
                            defaultValue={50}
                        />
                        <Typography id="music-volume-label">
                            Music Volume
                        </Typography>
                        <Slider
                            aria-labelledby="music-volume-label"
                            defaultValue={50}
                        />
                    </>
                )}
                {tab === "Chat" && (
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <FormControlLabel
                            control={<Switch />}
                            label="Game chat panel"
                        />
                        <FormControlLabel
                            control={<Switch />}
                            label="Censor chat"
                        />
                        <FormControlLabel
                            control={<Switch />}
                            label="Game chat speech bubbles"
                        />
                    </Box>
                )}
            </Box>
        </ArticlesModal>
    );
}
