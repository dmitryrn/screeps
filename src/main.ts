import {createCreepManager} from './creeps-manager'
import {newHarvesterManager} from './harvester-manager'
import {newUpgrader} from './upgrader'

const l = console.log

export const loop = () => {
	const creepsManager = createCreepManager()

	const harvesterManager = newHarvesterManager(creepsManager)

	Object.values(Game.rooms).forEach(room => {
		const upgrader = newUpgrader(creepsManager, room)

		upgrader.manage()
	})

	harvesterManager.deployHarvester()
	harvesterManager.managerHarvesters()

	l("total screeps:", Object.keys(Game.creeps).length);
};
