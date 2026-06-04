"use client"
import { useEffect, useContext, useState, useRef, useMemo } from 'react';

import dynamic from "next/dynamic";

import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';

import LeftPanelContent from '@/components/UI/LeftPanel';
import { useStore } from '@/hooks/useStore';
import classNames from 'classnames';

import GameMenu from '@articles-media/articles-dev-box/GameMenu';
import TouchControls from '@/components/UI/TouchControls';
import LobbyOverlay from '@/components/UI/LobbyOverlay';
const GameCanvas = dynamic(() => import('@/components/Game/GameCanvas'), {
    ssr: false,
});

export default function GamePage() {

    const sidebar = useStore((state) => state.sidebar)
    const menuOpen = useStore((state) => state.menuOpen)
    const sceneKey = useStore((state) => state.sceneKey)

    return (

        <div
            className={classNames(
                `${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`,
                {
                    'menu-open': menuOpen,
                    'fullscreen': useFullscreen().isFullscreen,
                    'show-sidebar': sidebar,
                }
            )}
            id={`${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`}
        >

            <GameMenu
                useStore={useStore}
                LeftPanelContent={LeftPanelContent}
                menuBarConfig={{
                    style: "Corner Button",
                    menuBarButtonPosition: "Left"
                }}
                sidebarConfig={{
                    style: "Static Panel",
                }}
            />

            <div className='canvas-wrap'>

                <TouchControls />

                <LobbyOverlay />

                <GameCanvas
                    key={sceneKey}
                />

            </div>

        </div>
    );
}