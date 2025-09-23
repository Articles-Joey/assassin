import Link from "next/link";

import { Dropdown, DropdownButton } from "react-bootstrap";

// import ROUTES from '@/components/constants/routes';
import { useGameStore } from "@/hooks/useGameStore";
import ArticlesButton from "@/components/UI/Button";

import ControllerPreview from "@/components/ControllerPreview";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";

export default function LeftPanelContent(props) {

    const {
        server,
        players,
        touchControlsEnabled,
        setTouchControlsEnabled,
        reloadScene,
        controllerState,
        isFullscreen,
        requestFullscreen,
        exitFullscreen,
        setShowMenu
    } = props;

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    const debug = useStore((state) => state.debug)
    const toggleDebug = useStore((state) => state.toggleDebug)

    const theme = useStore((state) => state.theme)
    const setTheme = useStore((state) => state.setTheme)

    const {
        cameraMode, setCameraMode,
        teleport, setTeleport,
        playerLocation, setPlayerLocation,
        maxHeight, setMaxHeight,
        shift,
        // touchControls, setTouchControls
    } = useGameStore()

    return (
        <div className='w-100'>

            <div className="card card-articles card-sm">

                <div className="card-body">

                    <div className="mb-2">
                        <Link
                            href={'/'}
                            className=""
                        >
                            <ArticlesButton
                                className="w-50"
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
                                    requestFullscreen('assassin-game-page')
                                }
                            }}
                        >
                            {isFullscreen && <span>Exit </span>}
                            {!isFullscreen && <span><i className='fad fa-expand'></i></span>}
                            <span>Fullscreen</span>
                        </ArticlesButton>
                    </div>

                    <div className="card-footer border">

                        <div className='flex-header'>
                            <div>Server: {server}</div>
                            <div>Players: {players.length || 0}/50</div>
                        </div>

                        {!socket?.connected &&
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

                </div>
            </div>

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

            {/* Touch Controls */}
            <div
                className="card card-articles card-sm"
            >
                <div className="card-body">

                    <div className="small text-muted">Touch Controls</div>

                    <div className='d-flex flex-column'>

                        <div>
                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                active={!touchControlsEnabled}
                                onClick={() => {
                                    setTouchControlsEnabled(false)
                                }}
                            >
                                <i className="fad fa-redo"></i>
                                Off
                            </ArticlesButton>

                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                active={touchControlsEnabled}
                                onClick={() => {
                                    setTouchControlsEnabled(true)
                                }}
                            >
                                <i className="fad fa-redo"></i>
                                On
                            </ArticlesButton>
                        </div>

                    </div>

                </div>
            </div>

            {/* Debug Controls */}
            <div
                className="card card-articles card-sm"
            >
                <div className="card-body">

                    <div className="small text-muted">Debug Controls</div>

                    <div className='d-flex flex-column'>

                        <div>
                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                onClick={reloadScene}
                            >
                                <i className="fad fa-redo"></i>
                                Reload Game
                            </ArticlesButton>

                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                onClick={reloadScene}
                            >
                                <i className="fad fa-redo"></i>
                                Reset Camera
                            </ArticlesButton>
                        </div>

                        <div className='d-flex'>

                            {/* Teleport Mode */}
                            <div className='w-50'>
                                <DropdownButton
                                    variant="articles w-100"
                                    size='sm'
                                    id="dropdown-basic-button"
                                    className="dropdown-articles"
                                    title={
                                        <span>
                                            <i className="fad fa-ufo"></i>
                                            <span>Teleport</span>
                                        </span>
                                    }
                                >

                                    <div style={{ maxHeight: '600px', overflowY: 'auto', width: '200px' }}>

                                        {[
                                            {
                                                name: '20',
                                                position: [-4, 20, 0]
                                            },
                                            {
                                                name: '30',
                                                position: [-4, 31, 0]
                                            },
                                            {
                                                name: '100',
                                                position: [-4, 101, 0]
                                            },
                                            {
                                                name: 'Sprint 1 116',
                                                position: [-28, 116.5, 0]
                                            },
                                            {
                                                name: 'Sprint 2 132',
                                                position: [27, 131, 0]
                                            }
                                        ]
                                            .map(location =>
                                                <Dropdown.Item
                                                    key={location.name}
                                                    onClick={() => {
                                                        setTeleport(location.position)
                                                        setShowMenu(false)
                                                    }}
                                                    className="d-flex justify-content-between"
                                                >

                                                    {maxHeight > location.position[1] ?
                                                        <i className="fad fa-unlock"></i>
                                                        :
                                                        <i className="fad fa-lock"></i>
                                                    }

                                                    {location.name}
                                                </Dropdown.Item>
                                            )}

                                    </div>

                                </DropdownButton>
                            </div>

                            {/* Camera Mode */}
                            <div className='w-50'>
                                <DropdownButton
                                    variant="articles w-100"
                                    size='sm'
                                    id="dropdown-basic-button"
                                    className="dropdown-articles"
                                    title={
                                        <span>
                                            <i className="fad fa-camera"></i>
                                            <span>Camera</span>
                                        </span>
                                    }
                                >

                                    <div style={{ maxHeight: '600px', overflowY: 'auto', width: '200px' }}>

                                        {[
                                            {
                                                name: 'Free',
                                            },
                                            {
                                                name: 'Player',
                                            }
                                        ]
                                            .map(location =>
                                                <Dropdown.Item
                                                    key={location.name}
                                                    active={cameraMode == location.name}
                                                    onClick={() => {
                                                        setCameraMode(location.name)
                                                        setShowMenu(false)
                                                    }}
                                                    className="d-flex justify-content-between"
                                                >
                                                    <i className="fad fa-camera"></i>
                                                    {location.name}
                                                </Dropdown.Item>
                                            )}

                                    </div>

                                </DropdownButton>
                            </div>

                        </div>

                        <div className='d-flex'>

                            <div className='w-50'>

                                <ArticlesButton
                                    small
                                    className="w-100"
                                    onClick={() => {
                                        toggleDebug()
                                    }}
                                >
                                    <i className="fad fa-bug"></i>
                                    <span>Debug: {debug ? 'True' : 'Disable'}</span>
                                </ArticlesButton>

                                {/* <DropdownButton
                                    variant="articles w-100"
                                    size='sm'
                                    id="dropdown-basic-button"
                                    className="dropdown-articles"
                                    title={
                                        <span>
                                            <i className="fad fa-bug"></i>
                                            <span>Debug: {debug ? 'True' : 'Disable'}</span>
                                        </span>
                                    }
                                >

                                    <div style={{ maxHeight: '600px', overflowY: 'auto', width: '200px' }}>

                                        {[
                                            true,
                                            false
                                        ]
                                            .map((choice, index) =>
                                                <Dropdown.Item
                                                    key={index}
                                                    onClick={() => {
                                                        // setTeleport(location.position)
                                                        // setShowMenu(false)
                                                        toggleDebug()
                                                    }}
                                                    className="d-flex justify-content-between"
                                                >
                                                    {choice ? 'Enable' : 'Disable'}
                                                </Dropdown.Item>
                                            )}

                                    </div>

                                </DropdownButton> */}

                            </div>

                            <div className='w-50'>

                                <ArticlesButton
                                    small
                                    className="w-100"
                                    onClick={() => {
                                        if (theme == "Dark") {
                                            setTheme("Light")
                                        } else {
                                            setTheme("Dark")
                                        }
                                    }}
                                >
                                    <i className="fad fa-eye-dropper"></i>
                                    <span>Theme: {theme == "Dark" ? 'Dark' : 'Light'}</span>
                                </ArticlesButton>

                                {/* <DropdownButton
                                    variant="articles w-100"
                                    size='sm'
                                    id="dropdown-basic-button"
                                    className="dropdown-articles"
                                    title={
                                        <span>
                                            <i className="fad fa-eye-dropper"></i>
                                            <span>Theme</span>
                                        </span>
                                    }
                                >

                                    <div style={{ maxHeight: '600px', overflowY: 'auto', width: '200px' }}>

                                        {[
                                            {
                                                name: 'Dark',
                                            },
                                            {
                                                name: 'Light',
                                            }
                                        ]
                                            .map(location =>
                                                <Dropdown.Item
                                                    key={location.name}
                                                    active={cameraMode == location.name}
                                                    onClick={() => {
                                                        setCameraMode(location.name)
                                                        setShowMenu(false)
                                                    }}
                                                    className="d-flex justify-content-between"
                                                >
                                                    <i className="fad fa-camera"></i>
                                                    {location.name}
                                                </Dropdown.Item>
                                            )}

                                    </div>

                                </DropdownButton> */}

                            </div>

                        </div>

                    </div>

                </div>
            </div>

            {controllerState?.connected &&
                <div className="panel-content-group p-0 text-dark">

                    <div className="p-1 border-bottom border-dark">
                        <div className="fw-bold" style={{ fontSize: '0.7rem' }}>
                            {controllerState?.id}
                        </div>
                    </div>

                    <div className='p-1'>
                        <ArticlesButton
                            small
                            className="w-100"
                            active={showControllerState}
                            onClick={() => {
                                setShowControllerState(prev => !prev)
                            }}
                        >
                            {showControllerState ? 'Hide' : 'Show'} Controller Preview
                        </ArticlesButton>
                    </div>

                    {showControllerState && <div className='p-3'>

                        <ControllerPreview
                            controllerState={controllerState}
                            showJSON={true}
                            showVibrationControls={true}
                            maxHeight={300}
                            showPreview={true}
                        />
                    </div>}

                </div>
            }

        </div>
    )

}