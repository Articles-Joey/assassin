"use client";
import { useEffect, useState } from "react";
import Box from '@mui/material/Box';

import ArticlesButton from "@/components/UI/Button"
// import { useControlsStore, useGameStore } from "@/hooks/useGameStore"
import useTouchControlsStore from "@/hooks/useTouchControlsStore";
import { useStore } from "@/hooks/useStore";
import { useGameStore } from "@/hooks/useGameStore";
import useGameHelpers from "@/hooks/useGameHelpers";

function ActionButtons() {

    const setTouchControls = useTouchControlsStore(state => state.setTouchControls);

    return (
        <Box className="action-buttons" sx={{
            position: 'fixed', right: '1rem', bottom: 50, display: 'flex',
            flexDirection: 'column', gap: '1rem', zIndex: 2,
        }}>

            <ArticlesButton
                sx={{
                    width: 100, height: 100, borderRadius: '50%', opacity: 0.75,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    fontSize: '1.5rem', fontWeight: 'bold', transitionDuration: '200ms',
                    '&:hover': { opacity: 1 },
                }}
                onClick={() => {
                    const touchControls = useTouchControlsStore.getState().touchControls;
                    console.log("Jump!")
                    setTouchControls({
                        ...touchControls,
                        jump: true
                    })
                }}
            >
                Attack
            </ArticlesButton>

        </Box>
    )
}

export default function TouchControls(props) {

    // const {
    //     touchControlsEnabled,
    // } = props;

    const sceneKey = useStore(state => state.sceneKey)
    const cameraMode = useGameStore(state => state.cameraMode)

    const touchControls = useTouchControlsStore(state => state.touchControls);
    const setTouchControls = useTouchControlsStore(state => state.setTouchControls);
    const touchControlsEnabled = useTouchControlsStore(state => state.enabled);

    const [nippleCreated, setNippleCreated] = useState(false)

    const [nStart, setnStart] = useState(false)
    const [nDirection, setnDirection] = useState(false)

    const {
        usersPlayer
    } = useGameHelpers()

    // const {
    //     touchControls, setTouchControls
    // } = useTouchControlsStore()

    function startNipple() {

        // console.log("n", nipplejs)

        // return

        var options = {
            zone: document.getElementById('zone_joystick'),
            // threshold: 0.5
            // lockX: true,
        };

        // var manager = nipplejs.create(options);
        var manager = require('nipplejs').create(options);

        setNippleCreated(true)

        let dragDistance
        let dragDirection

        manager.on('start end', function (evt, data) {
            // dump(evt.type);
            // debug(data);
            console.log("1", evt.type)

            if (evt.type == 'start') {
                setnStart(true)
            } else if (evt.type == 'end') {
                setnStart(false)
                setnDirection(false)
                dragDistance = 0
                dragDirection = false
                const currentControls = useTouchControlsStore.getState().touchControls;
                setTouchControls({
                    ...currentControls,
                    left: false,
                    right: false,
                    up: false,
                    down: false,
                    joystickVector: { x: 0, y: 0 }
                })
            }

        })
            .on('move', function (evt, data) {

                // debug(data);
                dragDistance = data.distance
                // console.log("2", dragDistance, data.vector)

                if (dragDistance > 5) {

                    const currentControls = useTouchControlsStore.getState().touchControls;
                    setTouchControls({
                        ...currentControls,
                        joystickVector: data.vector
                    })

                } else {
                    const currentControls = useTouchControlsStore.getState().touchControls;
                    setTouchControls({
                        ...currentControls,
                        left: false,
                        right: false,
                        joystickVector: { x: 0, y: 0 }
                    })
                }

            })
            .on(' ' +
                'dir:up plain:up dir:left plain:left dir:down ' +
                'plain:down dir:right plain:right',
                function (evt, data) {

                    if (evt.type == 'move') {
                        dragDistance = data.distance
                    }

                    // dump(evt.type);
                    console.log("3", evt.type, dragDistance)



                    if (evt.type == 'dir:left') {
                        dragDirection = 'left'
                        // setnDirection('left')
                        // setTouchControls({
                        //     ...touchControls,
                        //     left: true,
                        //     right: false
                        // })
                    }

                    if (evt.type == 'dir:right') {
                        dragDirection = 'right'
                        // setnDirection('right')
                        // setTouchControls({
                        //     ...touchControls,
                        //     left: false,
                        //     right: true
                        // })
                    }

                    if (evt.type == 'dir:up') {
                        dragDirection = 'up'
                        // setnDirection('up')
                        // setTouchControls({
                        //     ...touchControls,
                        //     up: true,
                        //     down: false
                        // })
                    }

                    if (evt.type == 'dir:down') {
                        dragDirection = 'down'
                        // setnDirection('down')
                        // setTouchControls({
                        //     ...touchControls,
                        //     up: false,
                        //     down: true
                        // })
                    }

                }
            )
            .on('pressure', function (evt, data) {
                // debug({
                //   pressure: data
                // });
            });

        return manager;
    }

    useEffect(() => {

        if (!touchControlsEnabled) {
            return;
        }

        console.log("Load nipple")
        const manager = startNipple()

        return () => {
            if (manager) {
                console.log("Destroy nipple")
                manager.destroy()
            }
        }

    }, [sceneKey]);

    if (cameraMode == "Free" || !touchControlsEnabled) return null

    // if (!touchControlsEnabled) {
    //     return null;
    // }

    return (
        <Box
            className="touch-controls-area"
            sx={{
                position: 'absolute', right: 0, width: '100%', height: '100%', zIndex: 1,
                display: usersPlayer?.team === 'Sniper' ? 'none' : 'flex',
                justifyContent: 'space-between', alignItems: 'center',
            }}
        >

            <Box sx={{ width: '100%', height: '100%' }}>
                <Box sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    // backgroundColor: 'black',
                    zIndex: 1,
                }} id="zone_joystick" />
            </Box>

            <Box sx={{ display: 'none' }}>

                <Box>
                    {/* <ArticlesButton
                    onClick={() => {
                        setTouchControls({
                            left: true
                        })
                    }}
                >
                    Left
                </ArticlesButton>
                <ArticlesButton
                    onClick={() => {
                        setTouchControls({
                            right: true
                        })
                    }}
                >
                    Right
                </ArticlesButton> */}

                </Box>

                <Box sx={{ ml: '0.5rem', display: 'none', '@media (min-width: 992px)': { display: 'block' } }}>
                    <Box>Active: {nStart ? 'True' : 'False'}</Box>
                    <Box>Direction: {nDirection ? nDirection : 'None'}</Box>
                    <Box>Touch: {JSON.stringify(touchControls)}</Box>
                </Box>

            </Box>

            <ActionButtons />

        </Box>
    )
}
