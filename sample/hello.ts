import * as fs from 'fs';

export class HelloClass {
  /**
   * comment 1
   * @deprecated
   */
  depHelloMethod() {
    fs.writeFileSync('/tmp/somewhere', 'something');
  }

  /**
   * comment 2
   */
  helloMethod() {
    fs.writeFileSync('/tmp/somewhere', 'something');
  }

  val: string;

  /** @deprecated */
  deprecatedVal: number;
}

/**
 * deprecated class comment
 * @deprecated
 */
export class DeprecatedClass {
  /**
   * comment 2
   */
  helloMethod() {
    fs.writeFileSync('/tmp/somewhere', 'something');
  }

  val: string;
}

export interface HelloInterface {
  readonly prop: string;

  /** @deprecated */
  readonly depProp: number;
}

/**
 * @deprecated
 */
export interface DeprecatedInterface {
  readonly prop: string;
}

export interface InheritDepInterface extends DeprecatedInterface {
  readonly key: string;
}

export class InheritDepClass extends DeprecatedClass {
  anotherMethod() {
    fs.writeFileSync('/tmp/somewhere', 'something');
  }
}

/** @deprecated */
export const deprecatedConst = 'deprecated';

export const regularConst = 50;