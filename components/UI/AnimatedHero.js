"use client";
import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function AnimatedHero() {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const heroRef = useRef(null);

    useEffect(() => {
        const move = () => {
            if (!heroRef.current) return;

            const parentWidth = heroRef.current.offsetWidth;
            const parentHeight = heroRef.current.offsetHeight;

            // Match the crosshair's rendered width and height.
            const imgSize = 50;

            setPos({
                x: Math.floor(Math.random() * (parentWidth - imgSize)),
                y: Math.floor(Math.random() * (parentHeight - imgSize)),
            });
        };

        move(); // Initial position
        const interval = setInterval(move, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box
            className="hero"
            ref={heroRef}
            sx={{ position: "relative", mb: "1rem", transform: "scale(1.75)" }}
        >
            <Typography
                component="h1"
                sx={{
                    fontFamily: '"Sword", cursive, sans-serif',
                    fontSize: "4rem",
                    textAlign: "center",
                    color: "#000",
                    textShadow: "-2px 0 2px #fff",
                    WebkitTextStroke: "0.7px black",
                    fontWeight: 500,
                    lineHeight: 1.2,
                    mb: "0.5rem",
                }}
            >
                (Assassin)
            </Typography>
            <Box
                component="img"
                src={"img/crosshair.png"}
                alt=""
                sx={{
                    width: 50,
                    height: 50,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    transform: `translate(${pos.x}px, ${pos.y}px)`,
                    transition: "transform 2s ease-in-out",
                    animation: "none",
                }}
            />
        </Box>
    );
}
