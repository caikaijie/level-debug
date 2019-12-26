const levelDebug = require('./dist').levelDebug
const withLevel = require('./dist').withLevel
const Level = require('./dist').Level

const log = levelDebug('module:function')

console.log('enable("*")')
require('debug').enable('*')

log.debug('...') // module:function:debug ... +0ms
log.info('...') // module:function:info ... +0ms
log.warn('...') // module:function:warn ... +0ms
log.error('...') // module:function:error ... +0ms
log.fatal('...') // module:function:fatal ... +0ms

console.log('enable(withLevel("module:function", Level.WARN))')
require('debug').enable(withLevel('module:function', Level.WARN))

log.debug('...') //
log.info('...') //
log.warn('...') // module:function:warn ... +0ms
log.error('...') // module:function:error ... +0ms
log.fatal('...') // module:function:fatal ... +0ms
