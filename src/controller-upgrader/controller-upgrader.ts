import type {ICreepsManager} from '../creeps-manager'
import * as model from '../model'
import {newLogger, ILogger} from '../logger'
import {StrategySources} from './strategy-sources'

export interface UpgradeStrategy {
    execute(logger: ILogger, room: Room, creeps: Creep[]): void
}

interface IControllerUpgrader {
    manage(): void
}

export const newControllerUpgrader = (creepsManager: ICreepsManager, room: Room): IControllerUpgrader => new Upgrader(creepsManager, room)

class Upgrader implements IControllerUpgrader {
    private logger: ILogger

    constructor(
        private creepsManager: ICreepsManager,
        private room: Room,
    ) {
        this.logger = newLogger('controller-upgrader')
    }

    canControllerBeUpgraded(): boolean {
        if (this.room.controller) {
            return this.room.controller.level < 8
        }
        return false
    }

    spawnUpgraderCreep() {
        this.creepsManager.spawnCreep(this.room, model.NCreep.harvesterOrBuilderBodyParts, {
            [model.NCreep.typeFieldName]: model.NCreep.UPGRADER,
        })
    }

    haveUpgraderScreeps() {
        return this.creepsManager.getCreepsByType(this.room, model.NCreep.UPGRADER).length > 0
    }

    manage() {
        if (!this.canControllerBeUpgraded()) {
            return
        }

        if (!this.haveUpgraderScreeps() && !this.room.find(FIND_MY_SPAWNS)[0]?.spawning) {
            this.spawnUpgraderCreep()
            return
        }

        const haveContainersWithEnergy = this.room.find(FIND_STRUCTURES, {
            filter: str => str.structureType === STRUCTURE_CONTAINER && str.store[RESOURCE_ENERGY] > 0
        })
        if (haveContainersWithEnergy.length) {
            return
        }

        const creeps = this.creepsManager
            .getCreepsByType(this.room, model.NCreep.UPGRADER)

        new StrategySources().execute(this.logger, this.room, creeps)
    }
}
