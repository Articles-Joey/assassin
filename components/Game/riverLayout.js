export const RIVER_LENGTH = 300;
export const RIVER_WIDTH = 50;
export const LAVA_Y = -0.5;

export function lavaBobY(time, { phase, bobSpeed, bobHeight }) {
    return (
        LAVA_Y -
        0.08 +
        (Math.sin(time * bobSpeed + phase) - 1) * bobHeight * 0.5
    );
}

// Keep the banks outside the platform, while leaving two flowing side channels.
export function riverEdge(x, side) {
    const central = Math.exp(-Math.pow(x / 38, 4));
    const curve = Math.sin(x * 0.055) * 1.2 + Math.sin(x * 0.13 + side) * 0.5;
    return side * (22.2 + central * 2.3) + curve * (1 - central);
}

export function terrainHeight(x, distance) {
    return (
        -0.1 +
        distance * 0.045 +
        (Math.sin(x * 0.12 + distance * 0.18) +
            Math.cos(x * 0.24 - distance * 0.1)) *
            Math.min(distance / 10, 1) *
            0.65
    );
}

export function riverPosition(x, side, lane) {
    const edge = Math.abs(riverEdge(x, side));
    const bypass = 1 - smoothstep(24, 46, Math.abs(x));
    const middle = 2 + lane * 9;
    const channel = 21.5 + lane * Math.max(0, edge - 22.5);
    return side * (middle + (channel - middle) * bypass);
}

function smoothstep(a, b, value) {
    const t = Math.max(0, Math.min(1, (value - a) / (b - a)));
    return t * t * (3 - 2 * t);
}
