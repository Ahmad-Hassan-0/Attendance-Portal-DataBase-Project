"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSyncValidate = exports.isSyncTransform = void 0;
const isSyncTransform = (transform) => {
    return transform.length === 1;
};
exports.isSyncTransform = isSyncTransform;
const isSyncValidate = (validate) => {
    return validate.length === 1;
};
exports.isSyncValidate = isSyncValidate;
//# sourceMappingURL=types.js.map