import type { ILogger } from '../logger';
import type {UpgradeStrategy} from './controller-upgrader'

export class StrategySources implements UpgradeStrategy {
    execute(logger: ILogger, room: Room, creeps: Creep[]) {
        for (const creep of creeps) {
            const isCreepEmpty = creep.store.getFreeCapacity() === creep.store.getCapacity()
            const isCreepFull = creep.store.getFreeCapacity() === 0

            const closestSource = creep.pos.findClosestByRange(FIND_SOURCES)
            if (!closestSource) {
                continue
            }

            const closestController = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: object => object.structureType === STRUCTURE_CONTROLLER
            })
            if (!closestController) {
                continue
            }

            if (isCreepEmpty && !creep.pos.isNearTo(closestSource)) {
                creep.moveTo(closestSource)
            } else if (!isCreepFull && creep.pos.isNearTo(closestSource)) {
                creep.harvest(closestSource)
            } else if (isCreepFull && !creep.pos.isNearTo(closestController)) {
                creep.moveTo(closestController)
            } else if (!isCreepEmpty && creep.pos.isNearTo(closestController)) {
                creep.transfer(closestController, RESOURCE_ENERGY)
            }
        }
    }
}
