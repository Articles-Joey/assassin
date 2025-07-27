import { memo, useState } from "react";

import Link from "next/link";
import dynamic from "next/dynamic";

import ROUTES from '@/components/constants/routes';

import ArticlesButton from "@/components/UI/Button";

import { useSocketStore } from "@/hooks/useSocketStore";
import { useGameStore } from "@/hooks/useGameStore";

const InfoModal = dynamic(
    () => import('@/components/UI/InfoModal'),
    { ssr: false }
)

const game_name = 'Assassin'
const game_key = 'assassin'

function LeftPanelContent(props) {

    const {
        isFullscreen,
        requestFullscreen,
        exitFullscreen,
        reloadScene
    } = props;

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    // const players = useGameStore((state) => state.players)
    const resetPlayers = useGameStore((state) => state.resetPlayers)
    const resetBullets = useGameStore((state) => state.resetBullets)
    const isHost = useGameStore((state) => state.isHost)
    const setIsHost = useGameStore((state) => state.setIsHost)
    const serverGameState = useGameStore((state) => state.serverGameState)

    const [showInfoModal, setShowInfoModal] = useState(false)

    return (
        <div className='w-100'>

            <div className="card card-articles card-sm">

                <div className="card-body">

                    <Link
                        href={ROUTES.GAME_ASSASSIN}
                        className=""
                    >
                        <ArticlesButton
                            className='w-50'
                            small
                        >
                            <i className="fad fa-arrow-alt-square-left"></i>
                            <span>Leave Game</span>
                        </ArticlesButton>
                    </Link>

                    <ArticlesButton
                        small
                        className="w-50"
                        active={isFullscreen}
                        onClick={() => {
                            if (isFullscreen) {
                                exitFullscreen()
                            } else {
                                requestFullscreen('maze-game-page')
                            }
                        }}
                    >
                        {isFullscreen && <span>Exit </span>}
                        {!isFullscreen && <span><i className='fad fa-expand'></i></span>}
                        <span>Fullscreen</span>
                    </ArticlesButton>

                    <ArticlesButton
                        size="sm"
                        className="w-50"
                        onClick={reloadScene}
                    >
                        <i className="fad fa-redo"></i>
                        Reload Game
                    </ArticlesButton>

                    <>
                        <ArticlesButton
                            className={`w-50`}
                            small
                            onClick={() => {
                                setShowInfoModal({
                                    game: game_name
                                })
                            }}
                        >
                            <i className="fad fa-info-square"></i>
                            Rules
                        </ArticlesButton>

                        {showInfoModal &&
                            <InfoModal
                                show={showInfoModal}
                                setShow={setShowInfoModal}
                            />
                        }
                    </>

                </div>

                <div className="card-body border-top">

                    <h6>Game Info</h6>

                    <div className="">
                        Time Left: 0:00
                    </div>         

                    {serverGameState?.players?.map(player_obj => {
                        return (
                            <div>
                                {player_obj.username}
                            </div>
                        )
                    })}

                </div>

                <div className="card-body border-top">

                    <h6>Debug Data</h6>

                    <div>Test</div>

                    <ArticlesButton
                        size="sm"
                        className="w-50"
                        onClick={() => {
                            resetPlayers()
                        }}
                    >
                        <i className="fad fa-redo"></i>
                        Reset Players
                    </ArticlesButton>
                    <ArticlesButton
                        size="sm"
                        className="w-50"
                        onClick={() => {
                            resetBullets(3)
                            socket.emit(`game:Assassin:resetBullets`)
                        }}
                    >
                        <i className="fad fa-redo"></i>
                        Reset Bullets
                    </ArticlesButton>

                    <ArticlesButton
                        size="sm"
                        className="w-50"
                        onClick={() => {
                            socket.emit(`game:Assassin:spotLightMovement`, {
                                location: [0, 0, 0]
                            })
                        }}
                    >
                        <i className="fad fa-redo"></i>
                        Test Socket
                    </ArticlesButton>

                    <ArticlesButton
                        size="sm"
                        className="w-50"
                        onClick={() => {
                            const players = useGameStore.getState().players
                            console.group("players emit", players)
                            socket.emit(`game:Assassin:playerLocations`, players)
                        }}
                    >
                        <i className="fad fa-redo"></i>
                        Emit Players
                    </ArticlesButton>

                    <ArticlesButton
                        size="sm"
                        className="w-50"
                        onClick={() => {
                            const players = useGameStore.getState().players
                            console.group("players emit", players)
                            socket.emit(`game:Assassin:playerLocations`, players)

                            if (isHost) {
                                setIsHost(false)
                                // socket.emit(`game:Assassin:playerLocations`, players)
                            } else {
                                setIsHost(true)
                                socket.emit(`game:Assassin:playerLocations`, players)
                            }

                        }}
                    >
                        <i className="fad fa-redo"></i>
                        {isHost ? 'Become Player' : 'Become Host'}
                    </ArticlesButton>

                </div>

            </div>

        </div>
    )

}

export default memo(LeftPanelContent)