export type RowMap<V = any> = Record<string, V>;
export type RowArray<V = any> = V[];
export type Row<V = any> = RowMap<V> | RowArray<V>;
export interface RowValidationResult<R extends Row> {
    row: R | null;
    isValid: boolean;
    reason?: string;
}
export type RowValidatorCallback<R extends Row> = (error: Error | null, result?: RowValidationResult<R>) => void;
export type RowTransformCallback<R extends Row> = (error?: Error | null, row?: R) => void;
export type SyncRowTransform<I extends Row, O extends Row> = (row: I) => O;
export type AsyncRowTransform<I extends Row, O extends Row> = (row: I, cb: RowTransformCallback<O>) => void;
export type RowTransformFunction<I extends Row, O extends Row> = SyncRowTransform<I, O> | AsyncRowTransform<I, O>;
export declare const isSyncTransform: <I extends Row<any>, O extends Row<any>>(transform: RowTransformFunction<I, O>) => transform is SyncRowTransform<I, O>;
export type RowValidateCallback = (error?: Error | null, isValid?: boolean, reason?: string) => void;
export type SyncRowValidate<R extends Row> = (row: R) => boolean;
export type AsyncRowValidate<R extends Row> = (row: R, cb: RowValidateCallback) => void;
export type RowValidate<R extends Row> = AsyncRowValidate<R> | SyncRowValidate<R>;
export declare const isSyncValidate: <R extends Row<any>>(validate: RowValidate<R>) => validate is SyncRowValidate<R>;
export type HeaderArray = (string | undefined | null)[];
export type HeaderTransformFunction = (headers: HeaderArray) => HeaderArray;
