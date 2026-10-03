"use client";
import { useGameStore } from "@/hooks/useGameStore";
import { useSearchParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import StartGame from "./StartGame";
import { useSocketStore } from "@/hooks/useSocketStore";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import ConnectedControllersPreview from "./ConnectedControllersPreview";
// import { useGamepadStore } from "@/hooks/useGamepadStore";

export default function LobbyOverlay() {

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server, local_play } = params

    const socket = useSocketStore(state => state.socket);

    const gameState = useGameStore(state => state.gameState);
    const serverPlayers = useGameStore(state => state.gameState?.players || []);

    // const gamepads = useGamepadStore(state => state.gamepads);
    const gamepads = []

    // Fix hydration error: only render window-dependent string on client
    const [clientUrl, setClientUrl] = useState("");
    useEffect(() => {
        if (typeof window !== "undefined") {
            setClientUrl(window.location.href);
        }
    }, []);

    const [enlarge, setEnlarge] = useState(false);

    if (gameState?.status !== "In Lobby") return null;

    return (
        <Box className="lobby-overlay" sx={{
            position: 'absolute', width: enlarge ? 'calc(400px + 1rem + 3px)' : 'calc(200px + 1rem + 5px)',
            height: enlarge ? 800 : 400, bgcolor: 'rgba(0, 0, 0, 0.75)', borderRadius: '0.5rem',
            border: '3px solid', borderColor: 'success.main', zIndex: 1, bottom: 50,
            left: '50%', transform: 'translateX(-50%)', color: '#fff', p: '0.5rem',
            display: 'flex', flexDirection: 'column',
        }}>

            <IconButton aria-label={enlarge ? 'Shrink lobby' : 'Enlarge lobby'} onClick={() => setEnlarge(!enlarge)} sx={{
                position: 'absolute', top: 0, right: 0, transform: 'translate(50%, -50%)',
                width: '2rem', height: '2rem', borderRadius: '50%', border: '1px solid black',
                zIndex: 2, bgcolor: enlarge ? 'warning.main' : 'success.main', color: '#fff',
                transitionDuration: '200ms', '&:hover': { bgcolor: enlarge ? 'warning.dark' : 'success.dark', transform: 'scale(1.1) translate(50%, -50%)' },
            }}>
                {enlarge ? <CloseFullscreenIcon fontSize="small" /> : <OpenInFullIcon fontSize="small" />}
            </IconButton>

            {server &&
                <Box>

                    <Box className="qr-code-wrap" sx={{
                        position: 'relative', height: enlarge ? 400 : 200, mb: '0.5rem',
                        ...(enlarge && { width: 'calc(400px + 1rem)' }),
                        '& canvas': { position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', m: '0 auto' },
                    }}>
                        <QRCodeCanvas
                            value={`${clientUrl}`}
                            size={enlarge ? 400 : 200}
                        />
                    </Box>

                    <Box component="button" type="button"
                        onClick={() => {
                            navigator.clipboard.writeText(clientUrl);
                        }}
                        sx={{
                            mb: '0.25rem', border: 0, p: 0, background: 'transparent', color: 'inherit', textAlign: 'left', fontFamily: 'inherit',
                            fontSize: "0.8rem",
                            textDecoration: "underline",
                            cursor: "pointer",
                        }}
                    >
                        <ContentCopyIcon sx={{ fontSize: 'inherit', mr: '0.2rem', verticalAlign: 'middle' }} />
                        {clientUrl}
                    </Box>

                    <Box
                        sx={{ mt: '0.5rem', mb: 0, fontSize: '0.875em' }}
                        onClick={() => {
                            console.log(serverPlayers)
                        }}
                    >
                        Connected Players: {serverPlayers.length}
                    </Box>

                    <Box sx={{ fontSize: '0.875em', mb: '0.5rem' }}>
                        {serverPlayers.length === 0 ?
                            "No Connections"
                            :
                            serverPlayers.map((player, index) => (
                                <Box key={index}>
                                    - {player.nickname || `Player ${index + 1}`}
                                    {player.id == socket?.id && " (You)"}
                                </Box>
                            ))
                        }
                    </Box>

                </Box>
            }

            {local_play === "true" &&
                <Box
                    sx={{ fontSize: '0.875em', mb: '0.25rem' }}
                >

                    <Box>Connect Controllers: {gamepads.length || 0}</Box>
                    {/* <ConnectedControllersPreview /> */}
                    {/* <div>Connect up to 4 controllers to play locally!</div> */}

                </Box>
            }

            <Box sx={{ mt: 'auto' }}>
                <StartGame

                />
            </Box>

        </Box>
    )
}
