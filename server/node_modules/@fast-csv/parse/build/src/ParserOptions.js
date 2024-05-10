"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserOptions = void 0;
const lodash_escaperegexp_1 = __importDefault(require("lodash.escaperegexp"));
const lodash_isnil_1 = __importDefault(require("lodash.isnil"));
class ParserOptions {
    escapedDelimiter;
    objectMode = true;
    delimiter = ',';
    ignoreEmpty = false;
    quote = '"';
    escape = null;
    escapeChar = this.quote;
    comment = null;
    supportsComments = false;
    ltrim = false;
    rtrim = false;
    trim = false;
    headers = null;
    renameHeaders = false;
    strictColumnHandling = false;
    discardUnmappedColumns = false;
    carriageReturn = '\r';
    NEXT_TOKEN_REGEXP;
    encoding = 'utf8';
    limitRows = false;
    maxRows = 0;
    skipLines = 0;
    skipRows = 0;
    constructor(opts) {
        Object.assign(this, opts || {});
        if (this.delimiter.length > 1) {
            throw new Error('delimiter option must be one character long');
        }
        this.escapedDelimiter = (0, lodash_escaperegexp_1.default)(this.delimiter);
        this.escapeChar = this.escape ?? this.quote;
        this.supportsComments = !(0, lodash_isnil_1.default)(this.comment);
        this.NEXT_TOKEN_REGEXP = new RegExp(`([^\\s]|\\r\\n|\\n|\\r|${this.escapedDelimiter})`);
        if (this.maxRows > 0) {
            this.limitRows = true;
        }
    }
}
exports.ParserOptions = ParserOptions;
//# sourceMappingURL=ParserOptions.js.map