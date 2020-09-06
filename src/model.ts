export namespace NCreep {
    // identifiers used in memory of creep
    export const HARVESTER = 'HARVESTER'
    export type creepTypeInternal = typeof HARVESTER

    export const harvesterBodyParts: BodyPartConstant[] = ['move', 'work', 'carry']
    
    // e.g. Memory{ 'type': 'HARVESTER' }
    export const typeFieldName = 'type'
}
