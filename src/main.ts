import {createCreepManager} from './creeps-manager'
import {newHarvesterManager} from './harvester-manager'
import {newUpgrader} from './upgrader'
import {newEnergyStoragePolicy} from './policies/energy-storage'
import {newStorageBuilder} from './storage-builder'

export const loop = () => {
	const creepsManager = createCreepManager()
	const harvesterManager = newHarvesterManager(creepsManager)

	Object.values(Game.rooms).forEach(room => {
		const upgrader = newUpgrader(creepsManager, room)
		upgrader.manage()
	})

	harvesterManager.deployHarvester()
	harvesterManager.managerHarvesters()

	// energy storage
	const energyStoragePolicy = newEnergyStoragePolicy()
	const storageBuilder = newStorageBuilder(energyStoragePolicy)
	storageBuilder.manage()
	//
	
	console.log("total screeps:", Object.keys(Game.creeps).length);
};
