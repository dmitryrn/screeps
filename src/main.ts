import {createCreepManager} from './creeps-manager'
import {newHarvesterManager} from './harvester-manager'
import {newControllerUpgrader} from './controller-upgrader/controller-upgrader'
import {newEnergyStoragePolicy} from './policies/energy-storage'
import {newStorageBuilder} from './storage-builder'
import {newBuilderManager} from './builder-manager'
import {newLogger} from './logger'
import * as model from "./model";

export const loop = () => {
    console.log("-----------------", Math.ceil(Math.random()*100))
	const logger = newLogger('main')

	const creepsManager = createCreepManager()

	Object.values(Game.rooms).forEach(room => {
		// harvesting
		const harvesterManager = newHarvesterManager(room, creepsManager)
		harvesterManager.manage()

        if (creepsManager.getCreepsByType(room, model.NCreep.HARVESTER).length === 0) {
            logger.log("not gonna run any work till harvester creep spawned")
            return
        }

		// upgrading controller
		const controllerUpgrader = newControllerUpgrader(creepsManager, room)
		controllerUpgrader.manage()

		// building
		const builderManager = newBuilderManager(room, creepsManager)
		builderManager.manage()

		// energy storage
		const energyStoragePolicy = newEnergyStoragePolicy()
		const storageBuilder = newStorageBuilder(room, energyStoragePolicy)
		storageBuilder.manage()
	})

	logger.log('total screeps', Object.keys(Game.creeps).length);
};
