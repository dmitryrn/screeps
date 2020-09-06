import * as model from './model'
import type {ICreepsManager} from './creeps-manager'

interface IHarvesterManager {
    // Spawn new harvesters if necessary
    deployHarvester(): void

    // Manage all harvesters using strategy
    managerHarvesters(): void
}

export const newHarvesterManager = (creepManager: ICreepsManager): IHarvesterManager => new HarvesterManager(creepManager)

class HarvesterManager implements IHarvesterManager {
    creepManager: ICreepsManager

    constructor(creepManager: ICreepsManager) {
        this.creepManager = creepManager
    }

    shouldCreateHarvester() {
        const should = this.creepManager.getCreepsByType(model.NCreep.HARVESTER).length < 1 
            && this.creepManager.canSpawnCreep(model.NCreep.harvesterBodyParts)
        console.log('shouldCreateHarvester:', should)
        return should
    }

    deployHarvester() {
        if (this.shouldCreateHarvester()) {
            this.creepManager.spawnCreep(model.NCreep.harvesterBodyParts, {
                [model.NCreep.typeFieldName]: model.NCreep.HARVESTER,
            })
        }
    }

    managerHarvesters() {
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

        this.creepManager.getCreepsByType("HARVESTER").forEach(strategy)
    }
}
