"use client";

import Link from "next/link";

import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";

import PageTemplateLandingPage from "@articles-media/articles-dev-box/PageTemplateLandingPage";
import LandingBackgroundAnimation from "@/components/Game/LandingBackgroundAnimation";
import ArticlesButton from "@/components/UI/Button";
import AnimatedHero from "@/components/UI/AnimatedHero";
import Box from "@mui/material/Box";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { useAudioStore } from "@/hooks/useAudioStore";

export default function LobbyPage() {
    const darkMode = useStore((state) => state.darkMode);

    return (
        <Box
            sx={{
                flexGrow: 1,
                "& .servers": {
                    display: "grid",
                    gap: "5px",
                    gridTemplateColumns: "repeat(2, 1fr)",
                },
                "& .server": {
                    p: "0.5rem",
                    border: "1px solid rgba(0, 0, 0, 0.25)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                },
                "& .background-wrap": {
                    position: "fixed",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: -1,
                },
                "& .background-wrap img": { filter: "blur(2px)" },
            }}
        >
            <PageTemplateLandingPage
                useSocketStore={useSocketStore}
                useStore={useStore}
                useAudioStore={useAudioStore}
                // RotatingMascot={RotatingMascot}
                Link={Link}
                // logoImage={logo.src}
                LandingBackgroundAnimation={<LandingBackgroundAnimation />}
                // CardBodyOverride={<>
                // </>}
                heroOverride={
                    <>
                        <AnimatedHero />
                    </>
                }
                // disableHero
                backgroundImage={
                    darkMode
                        ? `img/previews/dark.webp`
                        : `img/previews/preview-1.webp`
                }
                CardBodyPrependContent={
                    <>
                        <Box
                            sx={{
                                mb: "0.5rem",
                                borderBottom: 1,
                                borderColor: "divider",
                                pb: "0.5rem",
                            }}
                        >
                            <ArticlesButton
                                component={Link}
                                href="/play?local_play=true"
                                sx={{ width: "100%" }}
                            >
                                <SportsEsportsIcon sx={{ mr: "0.5rem" }} />
                                Local Play
                                <Box
                                    component="span"
                                    sx={{
                                        ml: "0.5rem",
                                        px: "0.65em",
                                        py: "0.35em",
                                        fontSize: "0.75em",
                                        fontWeight: 700,
                                        lineHeight: 1,
                                        borderRadius: "0.375rem",
                                        bgcolor: "#212529",
                                        color: "#fff",
                                        scale: "1.1",
                                    }}
                                >
                                    Works offline!
                                </Box>
                            </ArticlesButton>
                            <Box
                                sx={{
                                    fontSize: "0.875em",
                                    textAlign: "center",
                                }}
                            >
                                Play with 2 to 4 gamepads locally.
                            </Box>
                        </Box>
                    </>
                }
                // singlePlayerConfig={{

                // }}
                NicknameInputConfig={{}}
                multiplayerConfig={{
                    type: "WebSocket",
                    // comingSoon: true,
                    defaultServers: 2,
                    // privateServerSupport: false,
                    onlinePlayersTemplate: "2.0",
                }}
                gameScoreboardConfig={{
                    append_score_text: "m",
                    metrics: [
                        {
                            label: "Max Distance",
                            key: "score",
                            format: (value) => `${value} m`,
                        },
                        {
                            label: "Distance Ran",
                            key: "total_distance",
                            format: (value) => `${value} m`,
                        },
                    ],
                }}
                // brandingTextClass="jaro-primary"
                disableGameScoreboard={
                    process.env.NEXT_PUBLIC_ENABLE_ARTICLES !== "true"
                }
                disableAd={process.env.NEXT_PUBLIC_ENABLE_ARTICLES !== "true"}
            />
        </Box>
    );
}
