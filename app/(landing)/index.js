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
import AnimatedHero from '@/components/UI/AnimatedHero';

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
                    <AnimatedHero />
                </>}
                // disableHero                
                backgroundImage={`${process.env.NEXT_PUBLIC_CDN}games/Assassin/assassin-thumbnail.webp`}
                CardBodyPrependContent={<>
                    <div className='mb-2 border-bottom pb-2'>
                        <Link href={"/play?local_play=true"} className="w-100">
                            <ArticlesButton
                                className="w-100"
                            >
                                <i className='fas fa-gamepad-alt fa-lg me-2'></i>
                                Local Play
                                <span className='ms-2 badge bg-dark' style={{scale: '1.1'}}>Works offline!</span>
                            </ArticlesButton>
                        </Link>
                        <div className='small text-center'>Play with 2 to 4 gamepads locally.</div>
                    </div>
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
                    onlinePlayersTemplate: "2.0"
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