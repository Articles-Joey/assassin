"use client"
import packageInfo from '@/package.json';
import DarkModeHandler from "@articles-media/articles-dev-box/DarkModeHandler";
import { useStore } from '@/hooks/useStore';
import GlobalBody from '@articles-media/articles-dev-box/GlobalBody';
import ToontownModeHandler from '@articles-media/articles-dev-box/ToontownModeHandler';
import GlobalClientModals from '@articles-media/articles-dev-box/GlobalClientModals';
import { useHotkeys } from "react-hotkeys-hook";
import { useAudioStore } from "@/hooks/useAudioStore";
import useTouchControlsStore from "@/hooks/useTouchControlsStore";
import { useSocketStore } from "@/hooks/useSocketStore";
import { Suspense, useEffect } from 'react';
import ArticlesButton from '@/components/UI/Button';
import { useGameStore } from '@/hooks/useGameStore';
import { usePathname } from 'next/navigation';

export default function LayoutClient({ children }) {

    const pathname = usePathname();

    const darkMode = useStore((state) => state.darkMode);
    const setGameState = useGameStore((state) => state.setGameState);

    useHotkeys('r', () => {
        console.log("Reloading Scene")
        useStore.getState().reloadScene();
    }, [])

    useEffect(() => {
        setGameState(null);
    }, [pathname])

    return (
        <>
            <ToontownModeHandler
                useStore={useStore}
            />
            <GlobalBody />
            <DarkModeHandler
                useStore={useStore}
            />
            <Suspense>
                <GlobalClientModals
                    useStore={useStore}
                    useAudioStore={useAudioStore}
                    useTouchControlsStore={useTouchControlsStore}
                    useSocketStore={useSocketStore}

                    packageInfo={packageInfo}
                    settingsModalConfig={{
                        tabs: {
                            'Graphics': {
                                darkMode: true,
                                landingAnimation: true,
                                children: <>
                                </>,
                            },
                            'Audio': {
                                sliders: [
                                    ...useAudioStore.getState().audioSettings ?
                                        Object.keys(useAudioStore.getState().audioSettings).filter(key => key !== "enabled").map(key => ({
                                            key,
                                            label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                                        }))
                                        :
                                        [],
                                ]
                            },
                            'Controls': {
                                touchControls: true,
                                // defaultKeyBindings: {
                                //     // moveUp: "W",
                                //     // moveDown: "S",
                                //     // moveLeft: "A",
                                //     // moveRight: "D",
                                // }
                            },
                            'Multiplayer': {
                                serverUrl: true,
                                // children: <>Test</>
                            },
                            'Other': {
                                // toontownMode: true,
                                children: <>
                                </>,
                            }
                        },
                        reset: () => {
                            useAudioStore.getState().resetAudioSettings();
                        }
                    }}
                    infoModalConfig={{
                        previewImage: darkMode ? "img/preview.webp" : "img/preview.webp",
                        appendContent: <>
                            <div className="small text-muted mb-2">
                                View video of game that inspired this game below.
                            </div>

                            <div>
                                <div className="ratio ratio-16x9">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src="https://www.youtube.com/embed/JBqNpDytBLg?start=8032"
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        </>
                    }}
                />
            </Suspense>
        </>
    );
}
