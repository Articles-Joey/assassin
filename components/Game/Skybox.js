import { BackSide } from "three";

// An inward-facing sky dome keeps the ember horizon continuous in every direction.
export default function Skybox() {
    return (
        <>
            <color
                attach="background"
                args={["#210b0a"]}
            />
            <fog
                attach="fog"
                args={["#3a1712", 90, 360]}
            />
            <mesh>
                <sphereGeometry args={[450, 40, 24]} />
                <shaderMaterial
                    side={BackSide}
                    depthWrite={false}
                    vertexShader={`
                        varying vec3 vDirection;
                        void main() {
                            vDirection = normalize(position);
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `}
                    fragmentShader={`
                        varying vec3 vDirection;
                        void main() {
                            vec3 d = normalize(vDirection);
                            float horizon = exp(-abs(d.y) * 5.0);
                            float smoke = sin(d.x * 18.0 + d.z * 12.0 + sin(d.y * 30.0))
                                * sin(d.z * 27.0 - d.y * 22.0) * 0.5 + 0.5;
                            vec3 color = mix(vec3(0.035, 0.012, 0.022), vec3(0.48, 0.105, 0.025), horizon);
                            color *= 0.65 + smoke * 0.35;
                            gl_FragColor = vec4(color, 1.0);
                            #include <tonemapping_fragment>
                            #include <colorspace_fragment>
                        }
                    `}
                />
            </mesh>
        </>
    );
}
