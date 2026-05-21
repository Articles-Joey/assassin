import { ModelAdventurer } from "../Models/players/Adventurer";
import { ModelBeach } from "../Models/players/Beach";
import { ModelCasual2 } from "../Models/players/Casual_2";
import { ModelCasualHoodie } from "../Models/players/Casual_Hoodie";
import { ModelFarmer } from "../Models/players/Farmer";
import { ModelKing } from "../Models/players/King";
import { ModelPunk } from "../Models/players/Punk";
import { ModelSpacesuit } from "../Models/players/Spacesuit";
import { ModelSuit } from "../Models/players/Suit";
import { ModelSwat } from "../Models/players/Swat";
import { ModelWorker } from "../Models/players/Worker";

export default function Character({ type, scale }) {

    function getModelComponent(type) {
        switch (type) {
            case 1:
                return ModelSpacesuit;
            case 2:
                return ModelWorker;
            case 3:
                return ModelSwat;
            case 4:
                return ModelAdventurer;
            case 5:
                return ModelBeach;
            case 6:
                return ModelCasual2;
            case 7:
                return ModelCasualHoodie;
            case 8:
                return ModelFarmer;
            case 9:
                return ModelKing;
            case 10:
                return ModelPunk;
            case 11:
                return ModelSuit;
            default:
                return ModelSwat;
        }
    }

    const ModelComponent = getModelComponent(type);

    return (
        <group >
            {ModelComponent ? <ModelComponent scale={scale} /> : null}
        </group>
    );
}