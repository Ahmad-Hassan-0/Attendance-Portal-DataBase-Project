"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnFormatter = void 0;
class ColumnFormatter {
    format;
    constructor(parserOptions) {
        if (parserOptions.trim) {
            this.format = (col) => {
                return col.trim();
            };
        }
        else if (parserOptions.ltrim) {
            this.format = (col) => {
                return col.trimLeft();
            };
        }
        else if (parserOptions.rtrim) {
            this.format = (col) => {
                return col.trimRight();
            };
        }
        else {
            this.format = (col) => {
                return col;
            };
        }
    }
}
exports.ColumnFormatter = ColumnFormatter;
//# sourceMappingURL=ColumnFormatter.js.map