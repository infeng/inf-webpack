import stripJsonComments from 'strip-json-comments';
import { readFileSync, existsSync } from 'fs';
import assert from 'assert';

export function getRcConfig(rcFile) {
  assert(existsSync(rcFile), `can not find ${rcFile}`);

  return require(rcFile);
}