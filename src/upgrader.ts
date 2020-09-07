import type {ICreepsManager} from './creeps-manager'
import * as model from './model'

interface IUpgrader {
    manage(): void
}

export const newUpgrader = (creepsManager: ICreepsManager, room: Room): IUpgrader => new Upgrader(creepsManager, room)

class Upgrader implements IUpgrader {
    creepsManager: ICreepsManager
    room: Room

    constructor(creepsManager: ICreepsManager, room: Room) {
        this.creepsManager = creepsManager
        this.room = room
    }

    canControllerBeUpgraded(): boolean {
        if (this.room.controller) {
            return this.room.controller.level < 8
        }
        return false
    }

    spawnUpgraderCreep() {
        this.creepsManager.spawnCreep(model.NCreep.harvesterBodyParts, {
            [model.NCreep.typeFieldName]: model.NCreep.UPGRADER,
        })
    }

    haveUpgraderScreeps() {
        return this.creepsManager.getCreepsByType(model.NCreep.UPGRADER).length > 0
    }

    upgradeStrategy(creep: Creep) {
        // const spawnFromThatRoom = Object.values(Game.spawns).find(spawn => spawn.room == this.room)

        // if (!spawnFromThatRoom)
        //     return

        // if (creep.store[RESOURCE_ENERGY] < creep.store.getCapacity()) {
        //     if (spawnFromThatRoom) {

        //     }
        //     creep.moveTo(spawnFromThatRoom)
        // }

        // if (this.room.controller) {
        //     const code = creep.upgradeController(this.room.controller)
        //     if (code === ERR_NOT_IN_RANGE) {
        //         creep.moveTo(this.room.controller)
        //     }
        // }
    }

    manage() {
        if (!this.canControllerBeUpgraded())
            return

        if (!this.haveUpgraderScreeps())
            this.spawnUpgraderCreep()

        this.creepsManager.getCreepsByType(model.NCreep.UPGRADER).forEach(this.upgradeStrategy)
    }
}
