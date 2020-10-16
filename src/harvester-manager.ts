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
            this.creepManager.spawnCreep(this.room, model.NCreep.harvesterOrBuilderBodyParts, {
                [model.NCreep.typeFieldName]: model.NCreep.HARVESTER,
            })
        }

        const strategy = (creep: Creep) => {
            if(creep.store.getFreeCapacity() > 0) {
                const source = creep.pos.findClosestByRange(FIND_SOURCES)
                if (!source) {
                    console.log('cannot find any source')
                    return
                }

                const code = creep.harvest(source)
                if(code === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source)
                }
            }  else {
                const spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS)
                if (!spawn) {
                    console.log('cannot find any spawn')
                    return
                }

                if(creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn)
                }
            }
        }

        this.creepManager
            .getCreepsByType(this.room, "HARVESTER")
            .forEach(strategy)
    }
}
