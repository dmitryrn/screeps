export namespace NCreep {
    // identifiers used in memory of creep
    export const HARVESTER = 'HARVESTER'
    export const UPGRADER = 'UPGRADER'
    export const BUILDER = 'BUILDER'
    export type creepTypeInternal
        = typeof HARVESTER
        | typeof UPGRADER
        | typeof BUILDER

    export const harvesterOrBuilderBodyParts: BodyPartConstant[] = ['move', 'work', 'carry']
    
    // e.g. Memory{ 'type': 'HARVESTER' }
    export const typeFieldName = 'type'
}
