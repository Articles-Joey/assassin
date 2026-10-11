import { interactionGroups } from "@react-three/rapier";

// Rapier uses group indices: player 0, ground 1, NPC 2, sensors 3.
// Sensors detect NPCs without making players and NPCs physically collide.
export const COLLISION_GROUPS = {
    player: interactionGroups(0, [1]),
    ground: interactionGroups(1, [0, 2]),
    npc: interactionGroups(2, [1, 3]),
    sensor: interactionGroups(3, [2]),
};
