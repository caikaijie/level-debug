# level-debug

I don't think you need this library. ~~Make it easier to debug with logging levels.~~

## Usage

Example:

```js
import { levelDebug, withLevel, Level } from 'level-debug'

const log = levelDebug('module:function')

require('debug').enable('*')
log.debug('...') // module:function:debug ... +0ms
log.info('...') // module:function:info ... +0ms
log.warn('...') // module:function:warn ... +0ms
log.error('...') // module:function:error ... +0ms
log.fatal('...') // module:function:fatal ... +0ms

require('debug').enable(withLevel('module:function', Level.WARN))
log.debug('...') //
log.info('...') //
log.warn('...') // module:function:warn ... +0ms
log.error('...') // module:function:error ... +0ms
log.fatal('...') // module:function:fatal ... +0ms
```

`withLevel` expands namespaces with level:

| Namespaces | withLevel | Output                                                 |
| ---------- | --------- | ------------------------------------------------------ |
| `*`        | `WARN`    | `*:warn,*:error,*:fatal`                               |
| `ns`       | `WARN`    | `ns:warn,ns:error,ns:fatal`                            |
| `-*`       | Not used  | `-*`                                                   |
| `-ns*`     | Not used  | `-ns*`                                                 |
| `-*ns`     | Not used  | `-*ns:debug,-*ns:info,-*ns:warn,-*ns:error,-*ns:fatal` |
