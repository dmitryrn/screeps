// we should have energy available

// there is a upper limit of storages capacity, when it is reached, we stop build new storages
// we build new storages until upper limit is reached

export interface IEnergyStoragePolicy {
    shouldBuildMoreContainers(room: Room): boolean
}

export const newEnergyStoragePolicy = (): IEnergyStoragePolicy => new EnergyStoragePolicy()

class EnergyStoragePolicy implements IEnergyStoragePolicy {
    shouldBuildMoreContainers(room: Room): boolean {
        // todo: this only checks for containers, it doesn't check type in any way
        const containersInRoom = room.find(FIND_STRUCTURES, {
            filter: str => str.structureType === STRUCTURE_CONTAINER
        })

        if (!containersInRoom.length) {
            return true
        }

        return false
    }
}
