"use client"
import { useEffect, useContext, useState } from 'react';

import Link from 'next/link'

import { useSocketStore } from '@/hooks/useSocketStore';
import { useStore } from '@/hooks/useStore';

import PageTemplateLandingPage from '@articles-media/articles-dev-box/PageTemplateLandingPage';
import { GamepadKeyboard, PieMenu } from '@articles-media/articles-gamepad-helper';
import RotatingMascot from '@/components/UI/RotatingMascot';
import LandingBackgroundAnimation from '@/components/Game/LandingBackgroundAnimation';
import ArticlesButton from '@/components/UI/Button';

export default function LobbyPage() {

    return (
        <>
            <PageTemplateLandingPage
                useSocketStore={useSocketStore}
                useStore={useStore}
                // RotatingMascot={RotatingMascot}
                Link={Link}
                // logoImage={logo.src}
                LandingBackgroundAnimation={
                    <LandingBackgroundAnimation />
                }
                // CardBodyOverride={<>
                // </>}
                heroOverride={<>
                    <div className='hero'>
                        <h1 className="SwordFont">(Assassin)</h1>
                        <img src={"img/crosshair.png"}></img>
                    </div>
                </>}
                // disableHero                
                backgroundImage={`${process.env.NEXT_PUBLIC_CDN}games/Assassin/assassin-thumbnail.webp`}
                CardBodyPrependContent={<>
                    <Link href={"/play?local_play=true"} className="w-100">
                        <ArticlesButton
                            className="w-100 mb-3"
                        >
                            <i className='fas fa-play me-2'></i>
                            Local Play
                        </ArticlesButton>
                    </Link>
                </>}
                // singlePlayerConfig={{

                // }}
                NicknameInputConfig={{
                    // PreComponent: <div className='flex-shrink-0 me-2'></div>
                }}
                multiplayerConfig={{
                    type: "WebSocket",
                    // comingSoon: true,
                    defaultServers: 2,
                    // privateServerSupport: false,
                }}
                gameScoreboardConfig={{
                    append_score_text: "m",
                    metrics: [
                        {
                            label: 'Max Distance',
                            key: "score",
                            format: (value) => `${value} m`
                        },
                        {
                            label: 'Distance Ran',
                            key: "total_distance",
                            format: (value) => `${value} m`
                        }
                    ]
                }}
                // brandingTextClass="jaro-primary"
                disableGameScoreboard={process.env.NEXT_PUBLIC_ENABLE_ARTICLES !== 'true'}
                disableAd={process.env.NEXT_PUBLIC_ENABLE_ARTICLES !== 'true'}
            />
        </>
    );
}