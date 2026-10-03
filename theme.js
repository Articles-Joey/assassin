"use client";

import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { bootstrapCompatibilityTheme } from "@articles-media/articles-dev-box/bootstrapCompatibilityTheme";

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
});

export function createAppTheme(mode = "dark") {
    const cardBackground = mode === "dark" ? "#313131" : "#fff";

    return createTheme({
        cssVariables: true,
        palette: {
            mode,
            primary: { main: "#f9edcd" },
            secondary: { main: "#adafb3" },
            game: { card: cardBackground },
        },
        typography: {
            fontFamily: roboto.style.fontFamily,
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: { fontSize: "0.7rem", whiteSpace: "pre" },
                },
            },
            MuiAlert: {
                styleOverrides: {
                    root: {
                        variants: [{
                            props: { severity: "info" },
                            style: { backgroundColor: "#60a5fa" },
                        }],
                    },
                },
            },
            MuiCssBaseline: {
                // Shared dev-box components still use compatibility utilities internally.
                styleOverrides: (muiTheme) => ({
                    ...bootstrapCompatibilityTheme.MuiCssBaseline.styleOverrides(muiTheme),
                    "@font-face": {
                        fontFamily: "Sword",
                        src: 'url("/font/Sword.ttf") format("truetype")',
                        fontWeight: "normal",
                        fontStyle: "normal",
                        fontDisplay: "swap",
                    },
                    ":root": {
                        "--card-background-override": cardBackground,
                        "--articles-card-font-color": mode === "dark" ? "#fff" : "#212529",
                    },
                    ".stats-overlay": {
                        position: "fixed",
                        top: 0,
                        right: "0 !important",
                        left: "initial !important",
                        zIndex: 4,
                    },
                }),
            },
        },
    });
}

export default createAppTheme();
