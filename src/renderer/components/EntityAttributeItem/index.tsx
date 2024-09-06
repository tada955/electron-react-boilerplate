import { useState } from 'react';

import styles from './EntityAttributeItem.module.css';
import EntityAttribute from '../../dataClasses/EntityAttribute';

export default function EntityAttributeItem({
  app_model,
  setAppModel,
  entAttr,
  onDelete
}: {
  app_model: any;
  setAppModel: any;
  entAttr: EntityAttribute;
  onDelete: (entAttr: EntityAttribute) => void;
}) {
  const [attrName, setAttrName] = useState<string>(entAttr.name);
  const [attrVal, setAttrVal] = useState<string>(entAttr.value);

  const handleNameChange = (event) => {
    const new_mod = app_model;
    new_mod.entity_attributes = new_mod.entity_attributes.map((ea) => {
      if (ea.id === entAttr.id) {
        const newItem = ea;
        newItem.name = event.target.value;
        return newItem;
      } else {
        return ea;
      }
    });
    setAppModel(new_mod);
    setAttrName(event.target.value)
  }

  const handleValChange = (event) => {
    const new_mod = app_model;
    new_mod.entity_attributes = new_mod.entity_attributes.map((ea) => {
      if (ea.id === entAttr.id) {
        const newItem = ea;
        newItem.value = event.target.value;
        return newItem;
      } else {
        return ea;
      }
    });
    setAppModel(new_mod);
    setAttrVal(event.target.value)
  }

  function handleDelete() {
    onDelete(entAttr)
  }

  return (
    <div
      className={`${styles.container}`}
      id={`${entAttr.id}`}
    >
          <input id={`entityAttributeNameInput_${entAttr.id}`} name="entityAttributeName" value={attrName} onChange={handleNameChange}></input>
          <input id={`entityAttributeValInput_${entAttr.id}`} name="entityValName" value={attrVal} onChange={handleValChange}></input>
          <button className={styles['entity-cancel']} onClick={handleDelete}>
            &times;
          </button>
    </div>
  );
}