/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { ParserOptionsArgs } from './ParserOptions';
import { CsvParserStream } from './CsvParserStream';
import { Row } from './types';
export * from './types';
export { CsvParserStream } from './CsvParserStream';
export { ParserOptions, ParserOptionsArgs } from './ParserOptions';
export declare const parse: <I extends Row, O extends Row>(args?: ParserOptionsArgs) => CsvParserStream<I, O>;
export declare const parseStream: <I extends Row, O extends Row>(stream: NodeJS.ReadableStream, options?: ParserOptionsArgs) => CsvParserStream<I, O>;
export declare const parseFile: <I extends Row, O extends Row>(location: string, options?: ParserOptionsArgs) => CsvParserStream<I, O>;
export declare const parseString: <I extends Row, O extends Row>(string: string, options?: ParserOptionsArgs) => CsvParserStream<I, O>;
