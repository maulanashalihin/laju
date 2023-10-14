import {v4} from 'uuid';

export function generateUUID() : string {
  return v4();
}