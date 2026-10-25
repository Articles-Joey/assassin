// Keep Three's standard lighting, fog, and shadows while adding procedural stone.
const rockNoise = /* glsl */ `
    varying vec2 vRockPosition;

    float rockHash(vec2 p) {
        vec3 q = fract(vec3(p.xyx) * 0.1031);
        q += dot(q, q.yzx + 33.33);
        return fract((q.x + q.y) * q.z);
    }

    float rockNoise(vec2 p) {
        vec2 cell = floor(p);
        vec2 f = fract(p);
        vec2 blend = f * f * (3.0 - 2.0 * f);
        return mix(
            mix(rockHash(cell), rockHash(cell + vec2(1.0, 0.0)), blend.x),
            mix(rockHash(cell + vec2(0.0, 1.0)), rockHash(cell + vec2(1.0)), blend.x),
            blend.y
        );
    }

    float rockFbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5333;
        mat2 turn = mat2(0.8, -0.6, 0.6, 0.8);
        for (int i = 0; i < 4; i++) {
            value += rockNoise(p) * amplitude;
            p = turn * p * 2.03 + vec2(17.2, 9.4);
            amplitude *= 0.5;
        }
        return value;
    }
`;

function applyRockShader(shader) {
    shader.vertexShader = shader.vertexShader
        .replace(
            "#include <common>",
            "#include <common>\nvarying vec2 vRockPosition;",
        )
        .replace(
            "#include <begin_vertex>",
            "#include <begin_vertex>\nvRockPosition = transformed.xz;",
        );

    shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", `#include <common>\n${rockNoise}`)
        .replace(
            "#include <map_fragment>",
            /* glsl */ `
            #include <map_fragment>
            // World-sized layers avoid stretched detail across the long banks.
            vec2 rockP = vRockPosition;
            float rockMass = rockFbm(rockP * 0.22);
            vec2 rockWarp = vec2(rockMass, rockNoise(rockP * 0.31 + 7.0)) * 1.6;
            float rockFracture = abs(rockNoise(rockP * 0.85 + rockWarp) - 0.5);
            float rockCrack = 1.0 - smoothstep(0.012, 0.065, rockFracture);
            float rockChips = rockNoise(rockP * 3.5 + rockWarp);
            // Fade fine grain at distance to prevent shimmering when orbiting.
            float rockGrainFade = 1.0 - smoothstep(0.04, 0.2, length(fwidth(rockP)));
            float rockGrain = mix(0.5, rockNoise(rockP * 19.0), rockGrainFade);
            float rockTone = 0.78 + rockMass * 0.44 + (rockChips - 0.5) * 0.2;
            diffuseColor.rgb *= rockTone * (1.0 - rockCrack * 0.24);
            diffuseColor.rgb *= 1.0 + (rockGrain - 0.5) * 0.16;
            float rockHeight = rockMass * 0.28 + rockChips * 0.12
                + rockGrain * 0.025 - rockCrack * 0.065;
        `,
        )
        .replace(
            "#include <roughnessmap_fragment>",
            /* glsl */ `
            #include <roughnessmap_fragment>
            roughnessFactor *= 0.88 + rockChips * 0.12;
        `,
        )
        .replace(
            "#include <normal_fragment_maps>",
            /* glsl */ `
            #include <normal_fragment_maps>
            // Perturb the lit surface normal from procedural height derivatives.
            vec3 rockDx = dFdx(-vViewPosition);
            vec3 rockDy = dFdy(-vViewPosition);
            vec3 rockR1 = cross(rockDy, normal);
            vec3 rockR2 = cross(normal, rockDx);
            float rockDet = dot(rockDx, rockR1);
            vec3 rockGradient = sign(rockDet) * (
                dFdx(rockHeight) * rockR1 + dFdy(rockHeight) * rockR2
            );
            normal = normalize(max(abs(rockDet), 0.0000001) * normal - rockGradient);
        `,
        );
}

function rockProgramKey() {
    return "rocky-terrain-v1";
}

export default function RockyTerrainMaterial() {
    return (
        <meshStandardMaterial
            color="#352b28"
            roughness={1}
            flatShading
            onBeforeCompile={applyRockShader}
            customProgramCacheKey={rockProgramKey}
        />
    );
}
