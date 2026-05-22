"use client"
import { useEffect, useRef, useState } from "react";

export default function AnimatedHero() {

    const [pos, setPos] = useState({ x: 0, y: 0 });
    const heroRef = useRef(null);

    useEffect(() => {

        const move = () => {
            if (!heroRef.current) return;

            const parentWidth = heroRef.current.offsetWidth;
            const parentHeight = heroRef.current.offsetHeight;

            // Assuming crosshair is roughly 50px as per scss
            const imgSize = 50;

            setPos({
                x: Math.floor(Math.random() * (parentWidth - imgSize)),
                y: Math.floor(Math.random() * (parentHeight - imgSize))
            });
        };

        move(); // Initial position
        const interval = setInterval(move, 2000);

        return () => clearInterval(interval);

    }, []);

    return (
        <div className='hero' ref={heroRef}>
            <h1 className="SwordFont">(Assassin)</h1>
            <img
                src={"img/crosshair.png"}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transform: `translate(${pos.x}px, ${pos.y}px)`,
                    transition: "transform 2s ease-in-out",
                    animation: 'none'
                }}
            ></img>
        </div>
    )
}