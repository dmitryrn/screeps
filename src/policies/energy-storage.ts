// we should have energy available

// there is a upper limit of storages capacity, when it is reached, we stop build new storages
// we build new storages until upper limit is reached

export interface IEnergyStoragePolicy {
    shouldBuildMoreStorages(): boolean
}

export const newEnergyStoragePolicy = (): IEnergyStoragePolicy => new EnergyStoragePolicy()

class EnergyStoragePolicy implements IEnergyStoragePolicy {
    shouldBuildMoreStorages(): boolean {
        return true
    }
}
