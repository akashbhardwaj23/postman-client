import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config';

let orm: MikroORM;

export async function getOrm() {
  if (!orm || !orm.isConnected()) {
    // initialize the micro orm
    orm = await MikroORM.init(config); 
  }
  return orm;
}