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