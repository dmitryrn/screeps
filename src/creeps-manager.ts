import * as model from './model'

export interface ICreepsManager {
    // Check if creep with specified body parts can be spawned
    canSpawnCreep(body: BodyPartConstant[]): boolean

    // Spawn creep with specified body parts and memory
    spawnCreep(body: BodyPartConstant[], memory?: CreepMemory): boolean

    // Get all creeps by type (internal type)
    getCreepsByType(creepType: model.NCreep.creepTypeInternal): Creep[]

    // Suicide creep filtered by predicate
    suicide(predicate: (creep: Creep) => boolean): void

    upgradeController(creep: Creep, controller: StructureController): ScreepsReturnCode
}

export const createCreepManager = () => new CreepsManager()

class CreepsManager implements ICreepsManager {
    private getUniqueCreepName(): string {
        let max = 0
        Object.values(Game.creeps)
        .filter(creep => creep.my)
        .forEach(creep => {
            creep.memory
            const creepNameInt = parseInt(creep.name)
            if (Number.isInteger(creepNameInt) && creepNameInt > max) {
                max = creepNameInt
            }
        })
        return (max + 1).toString()
    }

    canSpawnCreep(body: BodyPartConstant[]) {
        return Object.values(Game.spawns).some(spawn => {
            const code = spawn.spawnCreep(body, this.getUniqueCreepName(), {
                dryRun: true,
            })
            return code == OK
        })
    }

    spawnCreep(body: BodyPartConstant[], memory?: CreepMemory) {
        let code;
        Object.values(Game.spawns).forEach(spawn => {
            code = spawn.spawnCreep(body, this.getUniqueCreepName(), {
                memory,
            })
        })
        return code === OK
    }

    getCreepsByType(creepType: model.NCreep.creepTypeInternal): Creep[] {
        return Object.values(Game.creeps)
        .filter(creep => creep.my)
        .filter(creep => (creep.memory as any)[model.NCreep.typeFieldName] === creepType)
    }

    suicide(predicate: (creep: Creep) => boolean) {
        Object.values(Game.creeps)
        .filter(creep => creep.my)
        .filter(predicate)
        .forEach(creep => {
            const name = creep.name, typeInternal = (creep.memory as any).type
            const code = creep.suicide()
            console.log('tried to kill creep, name:', name, 'type:', typeInternal, 'code:', code)
        })
    }

    upgradeController(creep: Creep, controller: StructureController): ScreepsReturnCode {
        return creep.upgradeController(controller)
    }
}
