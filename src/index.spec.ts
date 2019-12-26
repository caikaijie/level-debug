import debug from 'debug'
import { withLevel, Level, Debugger, levelDebug } from '.'
import util from 'util'

let msg: string[] = []
debug.log = (...args): void => {
    const [f, ...others] = args
    msg.push(util.format(f, ...others))
}

describe('withLevel', () => {
    test.each([
        ['*', Level.DEBUG, '*'],
        ['*', Level.INFO, '*:info,*:warn,*:error,*:fatal'],
        ['*', Level.WARN, '*:warn,*:error,*:fatal'],
        ['*', Level.ERROR, '*:error,*:fatal'],
        ['*', Level.FATAL, '*:fatal'],
    ] as [string, Level, string][])(
        'rebuilds the namespaces for "%s": case %#',
        (input, l, output) => {
            expect(withLevel(input, l)).toBe(output)
        }
    )

    test.each([
        ['-*', Level.DEBUG, '-*'],
        ['-*', Level.INFO, '-*'],
        ['-*', Level.WARN, '-*'],
        ['-*', Level.ERROR, '-*'],
        ['-*', Level.FATAL, '-*'],
    ] as [string, Level, string][])(
        `remains the namespaces for "%s": case %#`,
        (input, l, output) => {
            expect(withLevel(input, l)).toBe(output)
        }
    )

    test.each([
        ['-ns*', Level.DEBUG, '-ns*'],
        ['-ns*', Level.INFO, '-ns*'],
        ['-ns*', Level.WARN, '-ns*'],
        ['-ns*', Level.ERROR, '-ns*'],
        ['-ns*', Level.FATAL, '-ns*'],
    ] as [string, Level, string][])(
        `remains the namespaces for "%s": case %#`,
        (input, l, output) => {
            expect(withLevel(input, l)).toBe(output)
        }
    )

    test.each([
        [
            '-*ns',
            undefined,
            '-*ns:debug,-*ns:info,-*ns:warn,-*ns:error,-*ns:fatal',
        ],
        [
            '-*ns',
            Level.DEBUG,
            '-*ns:debug,-*ns:info,-*ns:warn,-*ns:error,-*ns:fatal',
        ],
        [
            '-*ns',
            Level.INFO,
            '-*ns:debug,-*ns:info,-*ns:warn,-*ns:error,-*ns:fatal',
        ],
        [
            '-*ns',
            Level.WARN,
            '-*ns:debug,-*ns:info,-*ns:warn,-*ns:error,-*ns:fatal',
        ],
        [
            '-*ns',
            Level.ERROR,
            '-*ns:debug,-*ns:info,-*ns:warn,-*ns:error,-*ns:fatal',
        ],
        [
            '-*ns',
            Level.FATAL,
            '-*ns:debug,-*ns:info,-*ns:warn,-*ns:error,-*ns:fatal',
        ],
    ] as [string, Level | undefined, string][])(
        `rebuilds the namespaces for "%s": case %#`,
        (input, l, output) => {
            expect(withLevel(input, l)).toBe(output)
        }
    )

    test.each([
        [
            'ns,-ns',
            Level.DEBUG,
            'ns:debug,ns:info,ns:warn,ns:error,ns:fatal,-ns:debug,-ns:info,-ns:warn,-ns:error,-ns:fatal',
        ],
        [
            'ns,-ns',
            Level.INFO,
            'ns:info,ns:warn,ns:error,ns:fatal,-ns:debug,-ns:info,-ns:warn,-ns:error,-ns:fatal',
        ],
        [
            'ns,-ns',
            Level.WARN,
            'ns:warn,ns:error,ns:fatal,-ns:debug,-ns:info,-ns:warn,-ns:error,-ns:fatal',
        ],
        [
            'ns,-ns',
            Level.ERROR,
            'ns:error,ns:fatal,-ns:debug,-ns:info,-ns:warn,-ns:error,-ns:fatal',
        ],
        [
            'ns,-ns',
            Level.FATAL,
            'ns:fatal,-ns:debug,-ns:info,-ns:warn,-ns:error,-ns:fatal',
        ],
    ] as [string, Level, string][])(
        `rebuilds the namespaces, case %#`,
        (input, l, output) => {
            expect(withLevel(input, l)).toBe(output)
        }
    )
})

describe('levelDebug', () => {
    it('outpus the level prefix', () => {
        msg = [] // Reset msg.

        const d = levelDebug('ns')

        debug.enable('*')
        d.debug('.')
        d.info('.')
        d.warn('.')
        d.error('.')
        d.fatal('.')
        debug.disable()
        expect(msg[0]).toMatch(/ns:debug/)
        expect(msg[1]).toMatch(/ns:info/)
        expect(msg[2]).toMatch(/ns:warn/)
        expect(msg[3]).toMatch(/ns:error/)
        expect(msg[4]).toMatch(/ns:fatal/)
    })
})

describe('e2e tests', () => {
    it('outputs messages equal to and greater than the level', () => {
        function printLogs(): void {
            const ns1 = levelDebug('ns1')
            const ns2 = levelDebug('ns2')
            function _doPrint(d: Debugger): void {
                d.debug('xxx')
                d.info('xxx')
                d.warn('xxx')
                d.error('xxx')
                d.fatal('xxx')
            }
            _doPrint(ns1)
            _doPrint(ns2)
        }

        // Reset msg.
        msg = []
        debug.enable(withLevel('*,-ns1', Level.WARN))
        printLogs()
        expect(msg[0]).toMatch(/ns2:warn.*xxx/)
        expect(msg[1]).toMatch(/ns2:error.*xxx/)
        expect(msg[2]).toMatch(/ns2:fatal.*xxx/)
        debug.disable()

        // Reset msg.
        msg = []
        debug.enable(withLevel('ns1', Level.WARN))
        console.log('ns___', withLevel('ns1', Level.WARN))
        printLogs()
        expect(msg[0]).toMatch(/ns1:warn.*xxx/)
        expect(msg[1]).toMatch(/ns1:error.*xxx/)
        expect(msg[2]).toMatch(/ns1:fatal.*xxx/)
        debug.disable()
    })
})
