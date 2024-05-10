"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderTransformer = void 0;
const lodash_isundefined_1 = __importDefault(require("lodash.isundefined"));
const lodash_isfunction_1 = __importDefault(require("lodash.isfunction"));
const lodash_uniq_1 = __importDefault(require("lodash.uniq"));
const lodash_groupby_1 = __importDefault(require("lodash.groupby"));
class HeaderTransformer {
    parserOptions;
    headers = null;
    receivedHeaders = false;
    shouldUseFirstRow = false;
    processedFirstRow = false;
    headersLength = 0;
    headersTransform;
    constructor(parserOptions) {
        this.parserOptions = parserOptions;
        if (parserOptions.headers === true) {
            this.shouldUseFirstRow = true;
        }
        else if (Array.isArray(parserOptions.headers)) {
            this.setHeaders(parserOptions.headers);
        }
        else if ((0, lodash_isfunction_1.default)(parserOptions.headers)) {
            this.headersTransform = parserOptions.headers;
        }
    }
    transform(row, cb) {
        if (!this.shouldMapRow(row)) {
            return cb(null, { row: null, isValid: true });
        }
        return cb(null, this.processRow(row));
    }
    shouldMapRow(row) {
        const { parserOptions } = this;
        if (!this.headersTransform && parserOptions.renameHeaders && !this.processedFirstRow) {
            if (!this.receivedHeaders) {
                throw new Error('Error renaming headers: new headers must be provided in an array');
            }
            this.processedFirstRow = true;
            return false;
        }
        if (!this.receivedHeaders && Array.isArray(row)) {
            if (this.headersTransform) {
                this.setHeaders(this.headersTransform(row));
            }
            else if (this.shouldUseFirstRow) {
                this.setHeaders(row);
            }
            else {
                // dont do anything with the headers if we didnt receive a transform or shouldnt use the first row.
                return true;
            }
            return false;
        }
        return true;
    }
    processRow(row) {
        if (!this.headers) {
            return { row: row, isValid: true };
        }
        const { parserOptions } = this;
        if (!parserOptions.discardUnmappedColumns && row.length > this.headersLength) {
            if (!parserOptions.strictColumnHandling) {
                throw new Error(`Unexpected Error: column header mismatch expected: ${this.headersLength} columns got: ${row.length}`);
            }
            return {
                row: row,
                isValid: false,
                reason: `Column header mismatch expected: ${this.headersLength} columns got: ${row.length}`,
            };
        }
        if (parserOptions.strictColumnHandling && row.length < this.headersLength) {
            return {
                row: row,
                isValid: false,
                reason: `Column header mismatch expected: ${this.headersLength} columns got: ${row.length}`,
            };
        }
        return { row: this.mapHeaders(row), isValid: true };
    }
    mapHeaders(row) {
        const rowMap = {};
        const { headers, headersLength } = this;
        for (let i = 0; i < headersLength; i += 1) {
            const header = headers[i];
            if (!(0, lodash_isundefined_1.default)(header)) {
                const val = row[i];
                // eslint-disable-next-line no-param-reassign
                if ((0, lodash_isundefined_1.default)(val)) {
                    rowMap[header] = '';
                }
                else {
                    rowMap[header] = val;
                }
            }
        }
        return rowMap;
    }
    setHeaders(headers) {
        const filteredHeaders = headers.filter((h) => {
            return !!h;
        });
        if ((0, lodash_uniq_1.default)(filteredHeaders).length !== filteredHeaders.length) {
            const grouped = (0, lodash_groupby_1.default)(filteredHeaders);
            const duplicates = Object.keys(grouped).filter((dup) => {
                return grouped[dup].length > 1;
            });
            throw new Error(`Duplicate headers found ${JSON.stringify(duplicates)}`);
        }
        this.headers = headers;
        this.receivedHeaders = true;
        this.headersLength = this.headers?.length || 0;
    }
}
exports.HeaderTransformer = HeaderTransformer;
//# sourceMappingURL=HeaderTransformer.js.map