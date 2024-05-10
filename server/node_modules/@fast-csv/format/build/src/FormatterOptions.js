"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatterOptions = void 0;
class FormatterOptions {
    objectMode = true;
    delimiter = ',';
    rowDelimiter = '\n';
    quote = '"';
    escape = this.quote;
    quoteColumns = false;
    quoteHeaders = this.quoteColumns;
    headers = null;
    includeEndRowDelimiter = false;
    transform;
    shouldWriteHeaders;
    writeBOM = false;
    escapedQuote;
    BOM = '\ufeff';
    alwaysWriteHeaders = false;
    constructor(opts = {}) {
        Object.assign(this, opts || {});
        if (typeof opts?.quoteHeaders === 'undefined') {
            this.quoteHeaders = this.quoteColumns;
        }
        if (opts?.quote === true) {
            this.quote = '"';
        }
        else if (opts?.quote === false) {
            this.quote = '';
        }
        if (typeof opts?.escape !== 'string') {
            this.escape = this.quote;
        }
        this.shouldWriteHeaders = !!this.headers && (opts.writeHeaders ?? true);
        this.headers = Array.isArray(this.headers) ? this.headers : null;
        this.escapedQuote = `${this.escape}${this.quote}`;
    }
}
exports.FormatterOptions = FormatterOptions;
//# sourceMappingURL=FormatterOptions.js.map