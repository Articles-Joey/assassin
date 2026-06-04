import { useGameStore } from "@/hooks/useGameStore"
import ArticlesButton from "./Button"
import { useSearchParams } from "next/navigation"
import { useSocketStore } from "@/hooks/useSocketStore"
import { useStore } from "@/hooks/useStore"

export default function GameDetailsPanel() {

    const players = useGameStore(state => state.gameState?.players)
    const npc_players = useGameStore(state => state.gameState?.npc_players)
    const socket = useSocketStore(state => state.socket)

    const debug = useStore((state) => state.debug)

    return (
        <div className="card game-details-panel">

            <div className="card-body">

                <div className="h6 mb-3 d-flex justify-content-between">
                    <RoundAndTimer />
                </div>

                <div>Players</div>

                <div className="border mb-3">
                    {players?.length > 0 && players.map((player, index) => (
                        <div key={index} className="player-entry border p-2">

                            {/* <div className="player-color" style={{ backgroundColor: player.color }}></div> */}

                            <div className="" style={{ fontSize: "0.6rem" }}>
                                ID: {player.id}
                            </div>

                            <div className="player-name d-flex align-items-center">
                                <span
                                    className={`badge bg-black me-1`}
                                    style={{
                                        fontSize: "0.6rem"
                                    }}
                                    onClick={() => {
                                        socket.emit(`game:${process.env.NEXT_PUBLIC_GAME_KEY}:change-team`, {
                                            team: player.team === "Assassin" ? "Sniper" : "Assassin"
                                        })
                                    }}
                                >
                                    {player.team || "N/A"}
                                </span>
                                <span
                                    className={`badge bg-black me-1`}
                                    style={{
                                        fontSize: "0.6rem"
                                    }}
                                >
                                    {player.character_type || "N/A"}
                                </span>
                                <span>{player.nickname || "?"} </span>
                                <span>- {player.score || 0}</span>
                            </div>

                            {/* <div className="player-name">Ready: {player.ready ? "Yes" : "No"}</div> */}

                            {debug && <div className="d-flex justify-content-between">

                                <div>X: {player?.x?.toFixed(2) || 0} | Z: {player?.z?.toFixed(2) || 0}</div>

                            </div>}

                        </div>
                    ))}
                </div>

                {debug && <>
                    <div>NPC Players</div>
    
                    <div
                        className="border"
                        style={{
                            maxHeight: "250px",
                            overflowY: "auto"
                        }}
                    >
                        {npc_players?.length > 0 && npc_players.map((player, index) => (
                            <div key={index} className="player-entry border p-2">
    
                                {/* <div className="player-color" style={{ backgroundColor: player.color }}></div> */}
    
                                <div className="" style={{ fontSize: "0.6rem" }}>
                                    ID: {player.id}
                                </div>
    
                                <div className="player-name d-flex align-items-center">
                                    <span
                                        className={`badge bg-black me-1`}
                                        style={{
                                            fontSize: "0.6rem"
                                        }}
                                    >
                                        {player.character_type || "N/A"}
                                    </span>
                                    <span>{player.nickname || "?"} </span>
                                    <span>- {player.score || 0}</span>
                                </div>
    
                                {/* <div className="player-name">Ready: {player.ready ? "Yes" : "No"}</div> */}
    
                                <div className="d-flex justify-content-between">
    
                                    <div>X: {player?.x?.toFixed(2) || 0} | Z: {player?.z?.toFixed(2) || 0}</div>
    
                                    <div className="d-flex">
                                        <div className="me-2">
                                            <i className="fad fa-rocket"></i>
                                            {player.hitPower}
                                        </div>
                                        <div>
                                            <i className="fad fa-undo"></i>
                                            {player.hitRotation}
                                        </div>
                                    </div>
    
                                </div>
    
                            </div>
                        ))}
                    </div>
                </>}

            </div>

        </div>
    )
}

function RoundAndTimer() {

    const timer = useGameStore(state => state.gameState?.timer)
    const status = useGameStore(state => state.gameState?.status)

    const startGame = useSocketStore(state => state.startGame)

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server, local_play } = params

    return (
        <div className="w-100">

            <div className="d-flex align-items-center w-100 justify-content-between">
                {/* <div>Round: {gameState?.round || 0}</div> */}
                <div>Time: {timer?.toFixed(0) || 0}</div>
                <div>Status: {status || "N/A"}</div>
            </div>

            <ArticlesButton
                small
                className="w-100 mt-1"
                disabled={status === "In Progress"}
                onClick={() => {

                    if (local_play === "true") {
                        useGameStore.getState().setGameState({
                            ...useGameStore.getState().gameState,
                            status: "In Progress"
                        })
                    }

                    if (server) {
                        startGame(server, "In Progress")
                    }

                }}
            >
                Start Game
            </ArticlesButton>

        </div>
    )
}