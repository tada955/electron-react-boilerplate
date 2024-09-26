import { useState } from 'react';

import styles from './LogicStatementItem.module.css';
import LogicStatement from '../../dataClasses/LogicStatement';

export default function LogicStatementItem({
  ref_mod,
  app_model,
  setAppModel,
  entAttr,
  onDelete
}: {
  ref_mod: any;
  app_model: any;
  setAppModel: any;
  logStat: LogicStatement;
  onDelete: (logStat: LogicStatement) => void;
}) {
  const [statVal, setAttrVal] = useState<string>(logStat.value);

  const handleValChange = (event) => {
    const new_mod = app_model;
    new_mod.entity_attributes = new_mod.entity_attributes.map((ea) => {
      if (ea.id === logStat.id) {
        const newItem = ea;
        newItem.value = event.target.value;
        return newItem;
      } else {
        return ea;
      }
    });
    setAppModel(new_mod);
    ref_mod.curent = new_mod;
    setAttrVal(event.target.value)
  }

  function handleDelete() {
    onDelete(logStat)
  }

  return (
    <div className={`${styles.container}`} id={`${logStat.id}`}>
      <li><input type="text" value="Foo"></input>
          <input id={`entityAttributeValInput_${logStat.id}`} name="entityValName" value={attrVal} onChange={handleValChange}></input>
          <button className={styles['entity-cancel']} onClick={handleDelete}>
            &times;
          </button>
      </li>
    </div>
  );
}