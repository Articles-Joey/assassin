import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/hooks/useStore';

const BURST_COUNT = 5;

function getRandomPosition(innerSize = 40, outerSize = 60) {
    const outerHalf = outerSize / 2;
    const innerHalf = innerSize / 2;
    let x, z;
    // Pick uniformly inside the outer square, but reject points inside the inner square
    do {
        x = Math.random() * outerSize - outerHalf;
        z = Math.random() * outerSize - outerHalf;
    } while (Math.abs(x) <= innerHalf && Math.abs(z) <= innerHalf);
    return new THREE.Vector3(x, 0, z);
}

// ─── LOW QUALITY: stacked cone column ────────────────────────────────────────

function LowBurst({ color, innerSize, outerSize }) {
    const meshRef = useRef();
    const [bursting, setBursting] = useState(false);
    const [position, setPosition] = useState(() => getRandomPosition(innerSize, outerSize));

    useEffect(() => {
        let timer;
        const schedule = () => {
            timer = setTimeout(() => {
                setPosition(getRandomPosition(innerSize, outerSize));
                setBursting(true);
                timer = setTimeout(() => {
                    setBursting(false);
                    schedule();
                }, 1800);
            }, Math.random() * 3000 + 2000);
        };
        schedule();
        return () => clearTimeout(timer);
    }, []);

    useFrame((_, delta) => {
        if (!meshRef.current) return;
        const targetY = bursting ? 3.5 : -2.5;
        meshRef.current.position.y = THREE.MathUtils.lerp(
            meshRef.current.position.y,
            targetY,
            2.5 * delta
        );
        meshRef.current.position.x = position.x;
        meshRef.current.position.z = position.z;
    });

    return (
        <mesh ref={meshRef} position={[position.x, -2.5, position.z]}>
            {[
                { offset: 0,    size: 0.55, color: color,  intensity: 1.0 },
                { offset: -0.5, size: 0.48, color: color,  intensity: 0.8 },
                { offset: -1.0, size: 0.40, color: 'red',  intensity: 0.6 },
                { offset: -1.5, size: 0.30, color: 'red',  intensity: 0.3 },
            ].map((c, i) => (
                <mesh key={i} position={[0, c.offset, 0]} rotation={[Math.PI, 0, 0]}>
                    <coneGeometry args={[c.size, 1.3, 8]} />
                    <meshStandardMaterial color={c.color} emissive={c.color} emissiveIntensity={c.intensity} />
                </mesh>
            ))}
        </mesh>
    );
}

// ─── MEDIUM / HIGH QUALITY: instanced particle burst ─────────────────────────

const _particleGeo = new THREE.SphereGeometry(0.14, 5, 5);
const _dummy = new THREE.Object3D();

function ParticleBurst({ color, particleCount, innerSize, outerSize }) {
    const instancedRef = useRef();
    const basePosition = useRef(getRandomPosition(innerSize, outerSize));

    const particles = useMemo(() =>
        [...Array(particleCount)].map(() => ({
            active: false,
            position: new THREE.Vector3(),
            velocity: new THREE.Vector3(),
            life: 0,
            maxLife: 0,
        })),
    [particleCount]);

    const triggerBurst = () => {
        basePosition.current = getRandomPosition(innerSize, outerSize);
        particles.forEach((p) => {
            p.active = true;
            p.life = 0;
            p.maxLife = Math.random() * 1.5 + 1.5;
            p.position.set(
                basePosition.current.x + (Math.random() - 0.5) * 0.6,
                0.1,
                basePosition.current.z + (Math.random() - 0.5) * 0.6,
            );
            const speed = Math.random() * 7 + 4;
            const spread = (Math.random() * Math.PI * 0.35);
            const rotY = Math.random() * Math.PI * 2;
            p.velocity.set(
                Math.sin(rotY) * Math.sin(spread) * speed * 0.6,
                Math.cos(spread) * speed,
                Math.cos(rotY) * Math.sin(spread) * speed * 0.6,
            );
        });
    };

    useEffect(() => {
        let timer;
        const schedule = () => {
            timer = setTimeout(() => {
                triggerBurst();
                schedule();
            }, Math.random() * 3000 + 2000);
        };
        triggerBurst();
        schedule();
        return () => clearTimeout(timer);
    }, []);

    useFrame((_, delta) => {
        if (!instancedRef.current) return;
        const gravity = -9.8;

        particles.forEach((p, i) => {
            if (!p.active) {
                _dummy.scale.setScalar(0);
                _dummy.updateMatrix();
                instancedRef.current.setMatrixAt(i, _dummy.matrix);
                return;
            }
            p.life += delta;
            if (p.life >= p.maxLife || p.position.y < -1) {
                p.active = false;
                _dummy.scale.setScalar(0);
                _dummy.updateMatrix();
                instancedRef.current.setMatrixAt(i, _dummy.matrix);
                return;
            }
            p.velocity.y += gravity * delta;
            p.position.addScaledVector(p.velocity, delta);
            const t = p.life / p.maxLife;
            _dummy.position.copy(p.position);
            _dummy.scale.setScalar((1 - t) * 0.9 + 0.08);
            _dummy.updateMatrix();
            instancedRef.current.setMatrixAt(i, _dummy.matrix);
        });

        instancedRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={instancedRef} args={[_particleGeo, null, particleCount]}>
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
        </instancedMesh>
    );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function LavaBurst({ color = 'orange' }) {
    const graphicsQuality = useStore((state) => state.graphicsQuality);

    const particleCount = graphicsQuality === 'High' ? 40 : 20;
    const BurstComponent = graphicsQuality === 'Low' ? LowBurst : ParticleBurst;

    return (
        <group>
            {[...Array(BURST_COUNT)].map((_, i) =>
                graphicsQuality === 'Low'
                    ? <LowBurst key={i} color={color} />
                    : <ParticleBurst key={i} color={color} particleCount={particleCount} />
            )}
        </group>
    );
}
