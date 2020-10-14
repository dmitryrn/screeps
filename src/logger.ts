export const newLogger = (namespace: string): ILogger => new Logger(namespace)

export interface ILogger {
    log(...strings: any[]): void
    warn(...strings: any[]): void
}

class Logger implements ILogger {
    constructor(private namespace: string) {}

    log(...strings: any[]) {
        console.log(`[${this.namespace}]: ${strings.join(' ')}`)
    }

    warn(...strings: any[]) {
        console.warn(`!!! [${this.namespace}]: ${strings.join(' ')}`)
    }
}
