import * as model from './model'
import type {ICreepsManager} from './creeps-manager'

interface IHarvesterManager {
    // Manage all harvesters using strategy
    manage(): void
}

export const newHarvesterManager = (room: Room, creepManager: ICreepsManager): IHarvesterManager => new HarvesterManager(room, creepManager)

class HarvesterManager implements IHarvesterManager {
    constructor(private room: Room, private creepManager: ICreepsManager) {
    }

    shouldCreateHarvester() {
        const should =
            this.creepManager.getCreepsByType(this.room, model.NCreep.HARVESTER).length < 1 
            && this.creepManager.canSpawnCreep(this.room, model.NCreep.harvesterOrBuilderBodyParts)

        console.log('shouldCreateHarvester:', should)
        return should
    }

    manage() {
        if (this.shouldCreateHarvester()) {
            this.creepManager.spawnCreep(model.NCreep.harvesterOrBuilderBodyParts, {
                [model.NCreep.typeFieldName]: model.NCreep.HARVESTER,
            })
        }

        const strategy = (creep: Creep) => {
            if(creep.store.getFreeCapacity() > 0) {
                const sources = creep.room.find(FIND_SOURCES);

                const code = creep.harvest(sources[0])
                console.log('creep.harvest:', code)

                if(code === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }
            else {
                if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.spawns['Spawn1']);
                }
            }
        }

        this.creepManager
            .getCreepsByType(this.room, "HARVESTER")
            .forEach(strategy)
    }
}
