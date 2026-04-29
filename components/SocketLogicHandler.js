"use client";
import { useState, useEffect, useContext, useRef, memo } from 'react'

import { useRouter, usePathname } from 'next/navigation';

import { useSocketStore } from "@/hooks/useSocketStore";

const game_key = 'assassin'
const game_name = 'Assassin'

// SocketContextControl
export default function SocketLogicHandler(props) {

    const router = useRouter()
    const pathname = usePathname()

    // const userReduxState = useSelector((state) => state.auth.user_details)

    const socket = useSocketStore((state) => state.socket)
    const connectSocket = useSocketStore((state) => state.connectSocket)
    const disconnectSocket = useSocketStore((state) => state.disconnectSocket)
    const setTotalUsers = useSocketStore((state) => state.setTotalUsers)

    const connected = useSocketStore((state) => state.connected)
    const setConnected = useSocketStore((state) => state.setConnected)

    // const {
    //     socket,
    //     // totalUsers,
    //     setTotalUsers,
    //     connectSocket
    // } = useSocketStore(state => ({
    //     socket: state.socket,
    //     // totalUsers: state.totalUsers,
    //     setTotalUsers: state.setTotalUsers,
    //     connectSocket: state.connectSocket,
    // }));

    // const [lastPage, setLastPage] = useState('');

    // const [initialConnectAttempt, setInitialConnectAttempt] = useState(false);
    const initialized = useRef(false)

    // const { session, status } = useSession()

    // function onConnect() {
    //     console.log("Connect Event")
    //     setIsConnected(true);
    //     socket.emit('getUserCount');
    // }

    // function onDisconnect() {
    //     console.log("Disconnect Event")
    //     setIsConnected(false);
    // }

    function userCount(value) {
        setTotalUsers(value)
        // setSocketData(prevState => ({
        //     ...prevState,
        //     total_users: value
        // }))
    }

    // useEffect(() => {

    //     if (!initialConnectAttempt) {

    //         console.log("Was called twice")
    //         setInitialConnectAttempt(true)
    //         connectSocket()
    //     }

    // }, [initialConnectAttempt])

    useEffect(() => {

        // Makes sure connect is only called once during reactStrictMode
        if (!initialized.current) {
            initialized.current = true
            connectSocket()
        }

        // if (!socket.connected) return

        socket.on('connect', () => {
            console.log("[📶Socket] Connected to server!");
            // setSocketData(prevState => ({
            //     ...prevState,
            //     connected: true
            // }))
            // socket.emit('activePage', router.pathname);
            setConnected(true);
            // socket.emit('login', { userId: userReduxState?._id })
            // socket.emit( 'isOnline', socketsToCheckIfOnline )
        });

        socket.on('disconnect', () => {
            console.log("[📶Socket] Disconnected from server!");
            // setSocketData(prevState => ({
            //     ...prevState,
            //     connected: false,
            //     authenticated: false
            // }))
            setConnected(false);
            // setSocketLoggedIn(false);
        });

        socket.on('force-page', (data) => {
            console.log("[📶Socket] You are being forced to a new page!");
            console.log(data)
            router.push(data.page)
            // setSocketData(prevState => ({
            //     ...prevState,
            //     connected: false,
            //     authenticated: false
            // }))
            // setConnected(false);
            // setSocketLoggedIn(false);
        });

        socket.on('roomsList', (value) => {
            console.log("[📶Socket] roomsList", value);
        });

        socket.emit('getUserCount');

        socket.on('userCount', userCount);

        console.log(`[📶 Socket] Page change emit`)
        socket.emit('activePage', pathname);

        socket.on(`game:${game_key}-landing-details`, function (msg) {
            console.log(`game:${game_key}-landing-details`, msg)

            if (JSON.stringify(msg) !== JSON.stringify(lobbyDetails)) {
                setLobbyDetails(msg)
            }
        });

        // router.events.on('routeChangeStart', handleRouteChange)

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('force-page');
            socket.off('roomsList');
            socket.off('userCount', userCount);
            socket.off(`game:${game_key}-landing-details`);
            // router.events.off('routeChangeStart', handleRouteChange)
        };

    }, [socket]);
}