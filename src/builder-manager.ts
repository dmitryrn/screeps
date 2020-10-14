import { ICreepsManager } from './creeps-manager'
import {ILogger, newLogger} from './logger'
import * as model from './model'

export interface IBuilderManager {
    manage(): void
}

export const newBuilderManager = (room: Room, creepsManager: ICreepsManager): IBuilderManager => new BuilderManager(room, creepsManager)

class BuilderManager implements IBuilderManager {
    private logger: ILogger

    constructor(private room: Room, private creepsManager: ICreepsManager) {
        this.logger = newLogger('builder-manager')
    }

    getConstructionSites(): ConstructionSite<BuildableStructureConstant>[] {
        return this.room.find(FIND_CONSTRUCTION_SITES)
    }

    getBuilderCreeps(): Creep[] {
        return this.creepsManager.getCreepsByType(this.room, model.NCreep.BUILDER)
    }

    createBuilderCreep(): boolean {
        return this.creepsManager.spawnCreep(model.NCreep.harvesterOrBuilderBodyParts, {
            [model.NCreep.typeFieldName]: model.NCreep.BUILDER,
        })
    }

    manage() {
        this.logger.log('this.getConstructionSites()', this.getConstructionSites())

        if (!this.getConstructionSites().length) {
            this.logger.log('no constr sites')
            return
        }

        const sites = this.getConstructionSites()

        if (!this.getBuilderCreeps().length) {
            this.logger.log('creating builder creep')
            this.createBuilderCreep()
            return
        }

        this.logger.log('have builder creeps, building')
    }
}
