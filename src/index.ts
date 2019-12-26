import debug from 'debug'

export enum Level {
    DEBUG = 10,
    INFO = 20,
    WARN = 30,
    ERROR = 40,
    FATAL = 50,
}

const levelStrings: [Level, string][] = [
    [Level.DEBUG, 'debug'],
    [Level.INFO, 'info'],
    [Level.WARN, 'warn'],
    [Level.ERROR, 'error'],
    [Level.FATAL, 'fatal'],
]

const levelMap: { [_: number]: string } = levelStrings.reduce(
    (m: object, c) => ({ ...m, [c[0]]: c[1] }),
    {}
)

const enabledMap: { [_: number]: string[] } = levelStrings.reduce(
    (m: object, c, i, arr) => {
        return {
            ...m,
            [c[0]]: arr.slice(i).map(ls => ls[1]),
        }
    },
    {}
)

export function levelString(l: Level): string {
    return levelMap[l]
}

export function withLevel(namespaces: string, l: Level | undefined): string {
    return namespaces
        .split(/[\s,]+/)
        .reduce((results: string[], namespace) => {
            if (namespace.length === 0) {
                return results
            }
            if (namespace[0] !== '-') {
                if (l === undefined) {
                    return results.concat(namespace)
                }

                if (
                    l === Level.DEBUG &&
                    namespace[namespace.length - 1] === '*'
                ) {
                    return results.concat(namespace)
                }

                return results.concat(
                    enabledMap[l].map(d => `${namespace}:${d}`)
                )
            } else {
                if (namespace[namespace.length - 1] === '*') {
                    return results.concat(namespace)
                }

                return results.concat(
                    enabledMap[Level.DEBUG].map(d => `${namespace}:${d}`)
                )
            }
        }, [])
        .join(',')
}

export interface Debugger extends debug.Debugger {
    debug: debug.Debugger
    info: debug.Debugger
    warn: debug.Debugger
    error: debug.Debugger
    fatal: debug.Debugger
}

export function levelDebug(namespaces: string): Debugger {
    const d = debug(namespaces) as Debugger

    d.debug = d.extend(levelStrings[0][1])
    d.info = d.extend(levelStrings[1][1])
    d.warn = d.extend(levelStrings[2][1])
    d.error = d.extend(levelStrings[3][1])
    d.fatal = d.extend(levelStrings[4][1])

    return d
}
