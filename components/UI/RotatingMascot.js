import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
// import { ModelBackpack } from "../Models/Backpack";
import { Suspense } from "react";
import Box from '@mui/material/Box';

export default function RotatingMascot() {
    return (
        <Box className="rotating-mascot-container" sx={{ width: '100%', height: '100%' }}>
            <Suspense>
                <Canvas>
    
                    <OrbitControls
                        autoRotate
                        enableZoom={false}
                        enablePan={false}
                        enableRotate={false}
                        autoRotateSpeed={10}
                    />
    
                    <ambientLight intensity={1} />
    
                    <Suspense fallback={null}>
                        {/* <ModelBackpack
                            scale={3}
                        /> */}
                    </Suspense>
    
                </Canvas>
            </Suspense>
        </Box>
    );
}
