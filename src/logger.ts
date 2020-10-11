export const newLogger = (namespace: string): ILogger => new Logger(namespace)

export interface ILogger {
    log(...strings: any[]): void
}

class Logger implements ILogger {
    constructor(private namespace: string) {}

    log(...strings: any[]) {
        console.log(`[${this.namespace}]: ${strings.join(' ')}`)
    }
}
