"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeToPath = exports.writeToString = exports.writeToBuffer = exports.writeToStream = exports.write = exports.format = exports.FormatterOptions = exports.CsvFormatterStream = void 0;
const util_1 = require("util");
const stream_1 = require("stream");
const fs = __importStar(require("fs"));
const FormatterOptions_1 = require("./FormatterOptions");
const CsvFormatterStream_1 = require("./CsvFormatterStream");
__exportStar(require("./types"), exports);
var CsvFormatterStream_2 = require("./CsvFormatterStream");
Object.defineProperty(exports, "CsvFormatterStream", { enumerable: true, get: function () { return CsvFormatterStream_2.CsvFormatterStream; } });
var FormatterOptions_2 = require("./FormatterOptions");
Object.defineProperty(exports, "FormatterOptions", { enumerable: true, get: function () { return FormatterOptions_2.FormatterOptions; } });
const format = (options) => {
    return new CsvFormatterStream_1.CsvFormatterStream(new FormatterOptions_1.FormatterOptions(options));
};
exports.format = format;
const write = (rows, options) => {
    const csvStream = (0, exports.format)(options);
    const promiseWrite = (0, util_1.promisify)((row, cb) => {
        csvStream.write(row, undefined, cb);
    });
    rows.reduce((prev, row) => {
        return prev.then(() => {
            return promiseWrite(row);
        });
    }, Promise.resolve())
        .then(() => {
        csvStream.end();
    })
        .catch((err) => {
        csvStream.emit('error', err);
    });
    return csvStream;
};
exports.write = write;
const writeToStream = (ws, rows, options) => {
    return (0, exports.write)(rows, options).pipe(ws);
};
exports.writeToStream = writeToStream;
const writeToBuffer = (rows, opts = {}) => {
    const buffers = [];
    const ws = new stream_1.Writable({
        write(data, enc, writeCb) {
            buffers.push(data);
            writeCb();
        },
    });
    return new Promise((res, rej) => {
        ws.on('error', rej).on('finish', () => {
            return res(Buffer.concat(buffers));
        });
        (0, exports.write)(rows, opts).pipe(ws);
    });
};
exports.writeToBuffer = writeToBuffer;
const writeToString = (rows, options) => {
    return (0, exports.writeToBuffer)(rows, options).then((buffer) => {
        return buffer.toString();
    });
};
exports.writeToString = writeToString;
const writeToPath = (path, rows, options) => {
    const stream = fs.createWriteStream(path, { encoding: 'utf8' });
    return (0, exports.write)(rows, options).pipe(stream);
};
exports.writeToPath = writeToPath;
//# sourceMappingURL=index.js.map