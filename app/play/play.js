"use client";

import dynamic from "next/dynamic";
import Box from "@mui/material/Box";

import useFullscreen from "@articles-media/articles-dev-box/useFullscreen";

import LeftPanelContent from "@/components/UI/LeftPanel";
import { useStore } from "@/hooks/useStore";
import classNames from "classnames";

import GameMenu from "@articles-media/articles-dev-box/GameMenu";
import TouchControls from "@/components/UI/TouchControls";
import LobbyOverlay from "@/components/UI/LobbyOverlay";
const GameCanvas = dynamic(() => import("@/components/Game/GameCanvas"), {
    ssr: false,
});

export default function GamePage() {
    const sidebar = useStore((state) => state.sidebar);
    const showMenu = useStore((state) => state.showMenu);
    const sceneKey = useStore((state) => state.sceneKey);
    const { isFullscreen } = useFullscreen();

    return (
        <Box
            className={classNames(
                `${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`,
                {
                    "menu-open": showMenu,
                    fullscreen: isFullscreen,
                    "show-sidebar": sidebar,
                },
            )}
            id={`${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`}
            sx={{ position: "relative", display: "flex" }}
        >
            <GameMenu
                useStore={useStore}
                LeftPanelContent={LeftPanelContent}
                menuBarConfig={{
                    style: "Corner Button",
                    menuBarButtonPosition: "Left",
                }}
                sidebarConfig={{
                    style: "Static Panel",
                }}
            />

            <Box
                className="canvas-wrap"
                sx={{
                    position: "relative",
                    width: "100vw",
                    height: "100vh",
                    "& canvas": {
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        left: 0,
                        top: 0,
                    },
                }}
            >
                <TouchControls />

                <LobbyOverlay />

                <GameCanvas key={sceneKey} />
            </Box>
        </Box>
    );
}
