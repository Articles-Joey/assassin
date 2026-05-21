import Link from "next/link";

import { Dropdown, DropdownButton } from "react-bootstrap";

// import ROUTES from '@/components/constants/routes';
import { useGameStore } from "@/hooks/useGameStore";
import ArticlesButton from "@/components/UI/Button";

// import ControllerPreview from "@/components/ControllerPreview";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";

import GameMenuPrimaryButtonGroup from '@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup';
import { useRouter, useSearchParams } from "next/navigation";
import DebugPanel from "./DebugPanel";
import GameDetailsPanel from "./GameDetailsPanel";

export default function LeftPanelContent(props) {

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const players = useGameStore((state) => state.gameState?.players)

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    const debug = useStore((state) => state.debug)
    const setDebug = useStore((state) => state.setDebug)
    const reloadScene = useStore((state) => state.reloadScene)
    const setShowMenu = useStore((state) => state.setShowMenu)

    // const sidebar = useStore((state) => state.sidebar)
    // const toggleSidebar = useStore((state) => state.toggleSidebar)
    // const darkMode = useStore((state) => state.darkMode)
    // const toggleDarkMode = useStore((state) => state.toggleDarkMode)
    // const setShowSettingsModal = useStore((state) => state.setShowSettingsModal)

    const {
        playerLocation,
        maxHeight, setMaxHeight,
        shift,
        gameState
    } = useGameStore()

    return (
        <div className='w-100'>

            <div className="card card-articles card-sm">

                <div className="card-body">

                    <div className="d-flex flex-wrap mb-3">
                        <GameMenuPrimaryButtonGroup
                            useStore={useStore}
                            type="GameMenu"
                            useRouter={useRouter}
                        />
                    </div>

                    {server &&
                        <div className="card-footer border">

                            <div className='flex-header'>
                                <div>Server: {server}</div>
                                <div>Players: {players?.length || 0}/4</div>
                            </div>

                            {/* <div className="mb-2">
                                Status: {gameState?.status || 'N/A'}
                            </div>

                            <div>
                                {gameState?.status == 'In Lobby' &&
                                    <ArticlesButton
                                        small
                                        className="w-100"
                                        onClick={() => {
                                            socket.emit("start-game")
                                        }}
                                    >
                                        Start Game
                                    </ArticlesButton>
                                }
                            </div> */}

                            {(!socket?.connected && server) &&
                                <div
                                    className=""
                                >

                                    <div className="">

                                        <div className="h6 mb-1">Not connected</div>

                                        <ArticlesButton
                                            className="w-100 "
                                            small
                                            onClick={() => {
                                                console.log("Reconnect")
                                                socket.connect()
                                            }}
                                        >
                                            <i className="fad fa-arrow-alt-square-left"></i>
                                            Reconnect!
                                        </ArticlesButton>

                                    </div>

                                </div>
                            }

                        </div>
                    }                    

                </div>
            </div>

            <GameDetailsPanel />

            <div
                className="card card-articles card-sm"
            >
                <div className="card-body d-flex justify-content-between">

                    <div>
                        <div className="small text-muted">playerData</div>
                        <div className="small">
                            <div>X: {playerLocation?.x}</div>
                            <div>Y: {playerLocation?.y}</div>
                            {/* <div>Test{playerLocation.y}</div> */}
                            <div>Z: {playerLocation?.z}</div>
                            <div>Shift: {shift ? 'True' : 'False'}</div>
                        </div>
                        {/* {JSON.stringify(playerData, undefined, 2)} */}
                    </div>

                    <div>
                        <div className="small text-muted">maxHeight</div>
                        <div>Y: {maxHeight}</div>
                        <ArticlesButton
                            small
                            onClick={() => {
                                setMaxHeight(playerLocation?.y)
                            }}
                        >
                            Reset
                        </ArticlesButton>
                    </div>

                </div>
            </div>

            {/* Debug Controls */}
            {debug &&
                <DebugPanel />
            }

        </div>
    )

}