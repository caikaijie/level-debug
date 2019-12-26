import debug from 'debug';
export declare enum Level {
    DEBUG = 10,
    INFO = 20,
    WARN = 30,
    ERROR = 40,
    FATAL = 50
}
export declare function levelString(l: Level): string;
export declare function withLevel(namespaces: string, l: Level | undefined): string;
export interface Debugger extends debug.Debugger {
    debug: debug.Debugger;
    info: debug.Debugger;
    warn: debug.Debugger;
    error: debug.Debugger;
    fatal: debug.Debugger;
}
export declare function levelDebug(namespaces: string): Debugger;
