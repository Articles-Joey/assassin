"use client"
import { useEffect, useContext, useState, useRef, useMemo } from 'react';

import dynamic from "next/dynamic";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
// import Link from 'next/link';
// import dynamic from 'next/dynamic'
// import Script from 'next/script'

// import { useSelector, useDispatch } from 'react-redux'

// import ROUTES from '@/components/constants/routes';

import ArticlesButton from '@/components/UI/Button';

import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';
import { useControllerStore } from '@/hooks/useControllerStore';

import { useLocalStorageNew } from '@/hooks/useLocalStorageNew';
import LeftPanelContent from '@/components/UI/LeftPanel';
import { useSocketStore } from '@/hooks/useSocketStore';
import { useGameStore } from '@/hooks/useGameStore';
import { useStore } from '@/hooks/useStore';
import classNames from 'classnames';

import GameMenu from '@articles-media/articles-dev-box/GameMenu';
const GameCanvas = dynamic(() => import('@/components/Game/GameCanvas'), {
    ssr: false,
});

const game_name = process.env.NEXT_PUBLIC_GAME_NAME
const game_key = process.env.NEXT_PUBLIC_GAME_KEY

export default function GamePage() {

    const {
        socket
    } = useSocketStore(state => ({
        socket: state.socket
    }));

    // const router = useRouter()
    // const pathname = usePathname()
    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const serverGameState = useGameStore((state) => state.serverGameState)
    const setServerGameState = useGameStore((state) => state.setServerGameState)

    useEffect(() => {

        if (server && socket.connected) {

            socket.emit('join-room', `game:${game_key}-room-${server}`, {
                game_id: server,
                nickname: JSON.parse(localStorage.getItem('game:nickname')),
                client_version: '1',
            });

            socket.on(`game:${game_name}-room-${server}`, (data) => {
                console.log("Got a serverGameState event!", data)
                setServerGameState(data)
                // setPlayers(data); // Update the state
            })

        }

        return function cleanup() {
            // socket.emit('leave-room', 'game:glass-ceiling-landing')
            // socket.emit('leave-room', `game:${game_key}-room-${server}`);
            socket.off(`game:${game_name}:serverGameState`)
        };

    }, [socket]);

    const showMenu = useStore((state) => state.showMenu)
    const setShowMenu = useStore((state) => state.setShowMenu)
    const sidebar = useStore((state) => state.sidebar)
    const menuOpen = useStore((state) => state.menuOpen)
    const sceneKey = useStore((state) => state.sceneKey)
    const reloadScene = useStore((state) => state.reloadScene)

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

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

                <GameCanvas
                    key={sceneKey}
                />

            </div>

        </div>
    );
}