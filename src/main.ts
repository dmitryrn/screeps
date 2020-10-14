import {createCreepManager} from './creeps-manager'
import {newHarvesterManager} from './harvester-manager'
import {newUpgrader} from './controller-upgrader/controller-upgrader'
import {newEnergyStoragePolicy} from './policies/energy-storage'
import {newStorageBuilder} from './storage-builder'
import {newBuilderManager} from './builder-manager'
import { newLogger } from './logger'

export const loop = () => {
	const logger = newLogger('main')

	const creepsManager = createCreepManager()

	Object.values(Game.rooms).forEach(room => {
		// harvesting
		const harvesterManager = newHarvesterManager(room, creepsManager)
		harvesterManager.manage()

		// upgrading controller
		const upgrader = newUpgrader(creepsManager, room)
		upgrader.manage()

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
