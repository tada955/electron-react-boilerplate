import Database from 'better-sqlite3';
// import {JSONFilePreset } from 'lowdb/node';
import path from 'path';
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
import Entity from '../../../renderer/dataClasses/Entity';
import EntityAttribute from '../../../renderer/dataClasses/EntityAttribute';
import HCCM_Model, {addEntity, addEntityAttribute} from '../../../renderer/dataClasses/HCCMModel';

export async function initialiseDB() {
  const defaultModel = new HCCM_Model();
  const defaultEntity = new Entity(3, 'Entity Test 2');
  // defaultEntity.entity_attributes = [1,2];
  addEntity(defaultModel, defaultEntity);
  addEntity(defaultModel, new Entity(4, 'Entity Test 3'));

  const attr1 = new EntityAttribute(1, 'Test Name 1', 'Test Val 1', 3);
  const attr2 = new EntityAttribute(2, 'Test Name 2', 'Test Val 2', 3);
  addEntityAttribute(defaultModel, attr1);
  addEntityAttribute(defaultModel, attr2);

  const db_path = path.join(__dirname, '../../../../', 'release/app', 'db.json')
  const db = await writeFile(db_path, JSON.stringify(defaultModel));
  return defaultModel;
}

export async function saveModel(savePath: string, mod: HCCM_Model) {
  // const db_path = path.join(__dirname, '../../', 'release/app', 'db.json')
  const db = await writeFile(savePath, JSON.stringify(mod));
}

export async function openModel(openPath: string) {
  // const db_path = path.join(__dirname, '../../', 'release/app', 'db.json')
  const db = await readFile(openPath);
  const mod = JSON.parse(db);
  // console.log('Opening a file');
  // console.log(mod);
  return mod;
}
