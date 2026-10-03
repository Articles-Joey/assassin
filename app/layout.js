import { Suspense } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import AppThemeProvider from "@/components/AppThemeProvider";
import SocketLogicHandler from "@/components/Handlers/SocketLogicHandler";
import LocalPlayHandler from "@/components/Handlers/LocalPlayHandler";
import LayoutClient from "./layout-client";

import "@articles-media/articles-gamepad-helper/dist/articles-gamepad-helper.css";

export const metadata = {
    title: "Assassin",
    description: "",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    <AppThemeProvider>
                        <LayoutClient />
                        <Suspense>
                            <SocketLogicHandler />
                            <LocalPlayHandler />
                        </Suspense>
                        {children}
                    </AppThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
