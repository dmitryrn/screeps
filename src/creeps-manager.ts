import * as model from './model'

export interface ICreepsManager {
    // Check if creep with specified body parts can be spawned
    canSpawnCreep(room: Room, body: BodyPartConstant[]): boolean

    // Spawn creep with specified body parts and memory
    spawnCreep(room: Room, body: BodyPartConstant[], memory?: CreepMemory): boolean

    // Get all creeps by type (internal type)
    getCreepsByType(room: Room, creepType: model.NCreep.creepTypeInternal): Creep[]

    // Suicide creep filtered by predicate
    suicide(predicate: (creep: Creep) => boolean): void
}

export const createCreepManager = () => new CreepsManager()

class CreepsManager implements ICreepsManager {
    private getUniqueCreepName(): string {
        let max = 0
        Object.values(Game.creeps)
            .filter(creep => creep.my)
            .forEach(creep => {
                const creepNameInt = parseInt(creep.name)
                if (Number.isInteger(creepNameInt) && creepNameInt > max) {
                    max = creepNameInt
                }
            })
        return (max + 1).toString()
    }

    canSpawnCreep(room: Room, body: BodyPartConstant[]): boolean {
        const spawnsInRoom = room.find(FIND_STRUCTURES, {
            filter: str => str.structureType === STRUCTURE_SPAWN
        })

        return spawnsInRoom.some(spawn => {
            if (spawn.structureType !== STRUCTURE_SPAWN) {
                // impossible hopefully, just for TS
                return false
            }

            const code = spawn.spawnCreep(body, this.getUniqueCreepName(), {
                dryRun: true,
            })
            return code === OK
        })
    }

    spawnCreep(room: Room, body: BodyPartConstant[], memory?: CreepMemory): boolean {
        for (const spawn of room.find(FIND_MY_SPAWNS)) {
            const code = spawn.spawnCreep(body, this.getUniqueCreepName(), {
                memory,
            })
            if (code === OK) {
                return true
            }
        }
        return false
    }

    getCreepsByType(room: Room, creepType: model.NCreep.creepTypeInternal): Creep[] {
        return room.find(FIND_CREEPS, {
            filter: cr => cr.my
        })
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
}
