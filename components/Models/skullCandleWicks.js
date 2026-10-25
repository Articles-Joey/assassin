import { Box3, Vector3 } from "three";

const layouts = new WeakMap();

// The exported model merges its parts into one geometry. Weld UV seams and
// recover the disconnected, thin wick pieces without changing the source asset.
export default function skullCandleWicks(geometry) {
    if (layouts.has(geometry)) return layouts.get(geometry);
    geometry.computeBoundingBox();
    const bounds = geometry.boundingBox.clone();
    const size = bounds.getSize(new Vector3());
    const positions = geometry.attributes.position;
    const parents = Array.from({ length: positions.count }, (_, i) => i);
    const welded = new Map();
    const precision = Math.max(size.x, size.y, size.z) * 0.00001;
    const point = new Vector3();

    function root(index) {
        while (parents[index] !== index) {
            parents[index] = parents[parents[index]];
            index = parents[index];
        }
        return index;
    }
    function join(a, b) {
        parents[root(a)] = root(b);
    }

    for (let i = 0; i < positions.count; i++) {
        point.fromBufferAttribute(positions, i);
        const key = [point.x, point.y, point.z]
            .map((v) => Math.round(v / precision))
            .join(",");
        if (welded.has(key)) join(i, welded.get(key));
        else welded.set(key, i);
    }
    const indices = geometry.index;
    const count = indices ? indices.count : positions.count;
    for (let i = 0; i < count; i += 3) {
        const a = indices ? indices.getX(i) : i;
        join(a, indices ? indices.getX(i + 1) : i + 1);
        join(a, indices ? indices.getX(i + 2) : i + 2);
    }
    const parts = new Map();
    for (let i = 0; i < positions.count; i++) {
        const id = root(i);
        if (!parts.has(id)) parts.set(id, new Box3());
        parts.get(id).expandByPoint(point.fromBufferAttribute(positions, i));
    }

    const tips = [];
    for (const box of parts.values()) {
        const part = box.getSize(new Vector3());
        const thickness = Math.max(part.x, part.z);
        if (
            box.max.y > bounds.min.y + size.y * 0.55 &&
            part.x < size.x * 0.14 &&
            part.z < size.z * 0.14 &&
            part.y > size.y * 0.006 &&
            part.y < size.y * 0.25 &&
            part.y > thickness * 0.7
        ) {
            tips.push([
                (box.min.x + box.max.x) / 2,
                box.max.y,
                (box.min.z + box.max.z) / 2,
            ]);
        }
    }
    // Also support a version with a welded wick: anchor to its highest cap.
    if (!tips.length) {
        const cap = new Box3();
        for (let i = 0; i < positions.count; i++) {
            point.fromBufferAttribute(positions, i);
            if (point.y >= bounds.max.y - size.y * 0.002)
                cap.expandByPoint(point);
        }
        const center = cap.getCenter(new Vector3());
        tips.push([center.x, bounds.max.y, center.z]);
    }
    const layout = { bounds, size, tips };
    layouts.set(geometry, layout);
    return layout;
}
