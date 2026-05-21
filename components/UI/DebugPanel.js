import { Dropdown, DropdownButton } from "react-bootstrap"
import ArticlesButton from "./Button"
import { useGameStore } from "@/hooks/useGameStore"
import { useStore } from "@/hooks/useStore"

export default function DebugPanel() {

    const resetPlayers = useGameStore((state) => state.resetPlayers)
    const reloadScene = useStore((state) => state.reloadScene)
    const debug = useStore((state) => state.debug)
    const setDebug = useStore((state) => state.setDebug)
    const setShowMenu = useStore((state) => state.setShowMenu)
    const cameraMode = useGameStore((state) => state.cameraMode)
    const setCameraMode = useGameStore((state) => state.setCameraMode)

    return (
        <div
            className="card card-articles card-sm"
        >
            <div className="card-body">

                <div className="small text-muted">Debug Controls</div>

                <div className='d-flex flex-column'>

                    <div className="d-flex flex-wrap">

                        <ArticlesButton
                            size="sm"
                            className="w-50"
                            onClick={() => reloadScene()}
                        >
                            <i className="fad fa-redo"></i>
                            Reload Game
                        </ArticlesButton>

                        <ArticlesButton
                            size="sm"
                            className="w-50"
                            onClick={() => reloadScene()}
                        >
                            <i className="fad fa-redo"></i>
                            Reset Camera
                        </ArticlesButton>

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
                                    setDebug(!debug)
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
    )

}