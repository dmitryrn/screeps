import {ILogger, newLogger} from './logger'
import { IEnergyStoragePolicy } from './policies/energy-storage'

export interface IStorageBuilder {
    manage(): void
}

export const newStorageBuilder = (energyStoragePolicy: IEnergyStoragePolicy): IStorageBuilder => new StorageBuilder(energyStoragePolicy)

class StorageBuilder implements IStorageBuilder {
    private logger: ILogger

    constructor(private energyStoragePolicy: IEnergyStoragePolicy) {
        this.logger = newLogger('storage-builder')
    }

    manage() {
        if (this.energyStoragePolicy.shouldBuildMoreStorages()) {
            // building storage
        }
    }
}
