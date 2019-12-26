"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var debug_1 = __importDefault(require("debug"));
var Level;
(function (Level) {
    Level[Level["DEBUG"] = 10] = "DEBUG";
    Level[Level["INFO"] = 20] = "INFO";
    Level[Level["WARN"] = 30] = "WARN";
    Level[Level["ERROR"] = 40] = "ERROR";
    Level[Level["FATAL"] = 50] = "FATAL";
})(Level = exports.Level || (exports.Level = {}));
var levelStrings = [
    [Level.DEBUG, 'debug'],
    [Level.INFO, 'info'],
    [Level.WARN, 'warn'],
    [Level.ERROR, 'error'],
    [Level.FATAL, 'fatal'],
];
var levelMap = levelStrings.reduce(function (m, c) {
    var _a;
    return (__assign(__assign({}, m), (_a = {}, _a[c[0]] = c[1], _a)));
}, {});
var enabledMap = levelStrings.reduce(function (m, c, i, arr) {
    var _a;
    return __assign(__assign({}, m), (_a = {}, _a[c[0]] = arr.slice(i).map(function (ls) { return ls[1]; }), _a));
}, {});
function levelString(l) {
    return levelMap[l];
}
exports.levelString = levelString;
function withLevel(namespaces, l) {
    return namespaces
        .split(/[\s,]+/)
        .reduce(function (results, namespace) {
        if (namespace.length === 0) {
            return results;
        }
        if (namespace[0] !== '-') {
            if (l === undefined) {
                return results.concat(namespace);
            }
            if (l === Level.DEBUG &&
                namespace[namespace.length - 1] === '*') {
                return results.concat(namespace);
            }
            return results.concat(enabledMap[l].map(function (d) { return namespace + ":" + d; }));
        }
        else {
            if (namespace[namespace.length - 1] === '*') {
                return results.concat(namespace);
            }
            return results.concat(enabledMap[Level.DEBUG].map(function (d) { return namespace + ":" + d; }));
        }
    }, [])
        .join(',');
}
exports.withLevel = withLevel;
function levelDebug(namespaces) {
    var d = debug_1.default(namespaces);
    d.debug = d.extend(levelStrings[0][1]);
    d.info = d.extend(levelStrings[1][1]);
    d.warn = d.extend(levelStrings[2][1]);
    d.error = d.extend(levelStrings[3][1]);
    d.fatal = d.extend(levelStrings[4][1]);
    return d;
}
exports.levelDebug = levelDebug;
