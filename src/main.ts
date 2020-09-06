import {createCreepManager} from './creeps-manager'
import {newHarvesterManager} from './harvester-manager'

const l = console.log

export const loop = () => {
	const creepsManager = createCreepManager()

	const harvesterManager = newHarvesterManager(creepsManager)

	harvesterManager.deployHarvester()
	harvesterManager.managerHarvesters()

	l("total screeps:", Object.keys(Game.creeps).length);
};
