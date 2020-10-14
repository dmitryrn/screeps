import type { ILogger } from '../logger';
import type {UpgradeStrategy} from './controller-upgrader'

export class StrategySpawner implements UpgradeStrategy {
    execute(logger: ILogger, room: Room, creeps: Creep[]) {
        
    }
}