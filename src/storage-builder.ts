import {ILogger, newLogger} from './logger'
import { IEnergyStoragePolicy } from './policies/energy-storage'

export interface IStorageBuilder {
    manage(): void
}

export const newStorageBuilder = (room: Room, energyStoragePolicy: IEnergyStoragePolicy): IStorageBuilder => new StorageBuilder(room, energyStoragePolicy)

class StorageBuilder implements IStorageBuilder {
    private logger: ILogger

    constructor(private room: Room, private energyStoragePolicy: IEnergyStoragePolicy) {
        this.logger = newLogger('storage-builder')
    }

    private findPlaceToBuild(startX: number, startY: number): [boolean, number, number] {
        const res = this.room.lookAt(startX - 1, startY)
        res.forEach(r => {
            console.log('place to build', Object.keys(r))
        })
        return [false, 0, 0]
    }

    areContainerBuildingsInProgress(): boolean {
        const sites = this.room.find(FIND_CONSTRUCTION_SITES, {
            filter: str => str.structureType === STRUCTURE_CONTAINER
        })
        return sites.length > 0
    }

    manage() {
        if (this.areContainerBuildingsInProgress()) {
            return
        }

        if (this.energyStoragePolicy.shouldBuildMoreContainers(this.room)) {
            this.logger.log('building storage')

            const spawn = this.room.find(FIND_STRUCTURES, {
                filter: str => str.structureType === 'spawn'
            })[0]

            if (!spawn) {
                this.logger.warn(`spawn at room ${this.room} not found`)
                return
            }

            // this.findPlaceToBuild(spawn.pos.x, spawn.pos.y)

            const buildCode = this.room.createConstructionSite(spawn.pos.x - 1, spawn.pos.y, STRUCTURE_CONTAINER)
            this.logger.log('buildCode', buildCode)
        }
    }
}
