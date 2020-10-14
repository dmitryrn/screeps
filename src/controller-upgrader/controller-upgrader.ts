import type {ICreepsManager} from '../creeps-manager'
import * as model from '../model'
import {newLogger, ILogger} from '../logger'
import {StrategySpawner} from './strategy-spawner'

export interface UpgradeStrategy {
    execute(logger: ILogger, room: Room, creeps: Creep[]): void
}

interface IUpgrader {
    manage(): void
}

export const newUpgrader = (creepsManager: ICreepsManager, room: Room): IUpgrader => new Upgrader(creepsManager, room)

class Upgrader implements IUpgrader {
    private logger: ILogger

    constructor(
        private creepsManager: ICreepsManager,
        private room: Room,
    ) {
        this.logger = newLogger('upgrader')
    }

    private canControllerBeUpgraded(): boolean {
        if (this.room.controller) {
            return this.room.controller.level < 8
        }
        return false
    }

    private spawnUpgraderCreep() {
        this.creepsManager.spawnCreep(model.NCreep.harvesterOrBuilderBodyParts, {
            [model.NCreep.typeFieldName]: model.NCreep.UPGRADER,
        })
    }

    private haveUpgraderScreeps() {
        return this.creepsManager.getCreepsByType(this.room, model.NCreep.UPGRADER).length > 0
    }

    private upgradeStrategy(creep: Creep) {
        const spawnFromThatRoom = Object.values(Game.spawns).find(spawn => spawn.room == this.room)

        if (!this.room.controller) {
            this.logger.log(`no controller in room ${this.room} found`)
            return
        }

        if (!spawnFromThatRoom) {
            this.logger.log(`no spawn in room ${this.room} found`)
            return
        }

        if (creep.store[RESOURCE_ENERGY] < creep.store.getCapacity()) {
            this.logger.log(`creep ${creep.name} doesn't have enough energy in storage`)

            if (!creep.pos.isNearTo(spawnFromThatRoom.pos.x, spawnFromThatRoom.pos.y)) {
                this.logger.log(`moving creep ${creep.name} to spawn ${spawnFromThatRoom.name}`)
                creep.moveTo(spawnFromThatRoom)
                return
            }
        }

        let code = creep.transfer(spawnFromThatRoom, RESOURCE_ENERGY, 15)
        this.logger.log('transfer code', code)

        code = creep.upgradeController(this.room.controller)
        this.logger.log('upgradeController code', code)
        if (code === ERR_NOT_IN_RANGE) {
            creep.moveTo(this.room.controller)
        }
    }

    manage() {
        this.logger.log(`run upgrader for room ${this.room.name}`)

        if (!this.canControllerBeUpgraded())
            return

        if (!this.haveUpgraderScreeps()) {
            this.logger.log('spawning upgrader creep')
            this.spawnUpgraderCreep()
            return
        }

        const haveContainersWithEnergy = this.room.find(FIND_STRUCTURES, {
            filter: str => str.structureType === STRUCTURE_CONTAINER && str.store[RESOURCE_ENERGY] > 0
        })
        if (haveContainersWithEnergy) {
            this.logger.log('using containers strategy')
            return
        }

        const creeps = this.creepsManager
            .getCreepsByType(this.room, model.NCreep.UPGRADER)

        this.logger.log('upgrading using spawner strategy')
        new StrategySpawner().execute(this.logger, this.room, creeps)
    }
}
