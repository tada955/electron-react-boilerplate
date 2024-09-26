import { useState, useId, useCallback, useRef, useEffect} from 'react';
import { ReactFlow, useNodesState, useEdgesState, addEdge, Background, useStore } from '@xyflow/react';
 
import EntityAttributeItem from '../EntityAttributeItem';
import Entity from '../../dataClasses/Entity';
import EntityAttribute from '../../dataClasses/EntityAttribute';
import ActivityDiagram from '../ActivityDiagram';
import EntityDiagramNodeContextMenu from '../EntityDiagramNodeContextMenu';
import Activity from '../../dataClasses/Activity';
import { addEntityAttribute, removeEntityAttribute } from '../../dataClasses/HCCMModel';

import '@xyflow/react/dist/style.css';
import styles from './EntityEditor.module.css';
import '../ActivityNode/ActivityNode.module.css';

export default function EntityEditor({
  ref_mod,
  app_model,
  setAppModel,
  ent,
  onChange,
  selectedObj,
  setSelectedObj,
  rfInstance,
  setRfInstance
}: {
  ref_mod: any;
  app_model: any;
  setAppModel: any;
  ent?: Entity;
  onChange: (id: number, event) => void;
  selectedObj?: any;
  setSelectedObj: any;
  rfInstance: any;
  setRfInstance: any;
}) {

  if (ent) {
    const entityInputName = useId();

    const [entity_attr_list, setEntityAttrs] = useState<EntityAttribute[]>(
      app_model.entity_attributes.filter((ea) => ea.entity_id === ent.id)
    );

    const handleChange = (event) => {
      onChange(ent.id, event);
    };

    function onEntAttrDelete(entAttr: EntityAttribute) {
      const new_mod = removeEntityAttribute(app_model, entAttr);
      setAppModel(new_mod);
      ref_mod.current = new_mod;
      setEntityAttrs(new_mod.entity_attributes);
    }

    function onAddEntAttr() {
      const numEntAttrs = app_model.entity_attributes.length
      var nextId = 0;
      if (numEntAttrs === 0) {
        nextId = 1;
      } else {
        nextId = app_model.entity_attributes[numEntAttrs - 1].id + 1
      }
      const newEntAttr = new EntityAttribute(nextId, "New Attribute Name", "New Attribute Value", ent.id);
      const new_mod = addEntityAttribute(app_model, newEntAttr);
      setAppModel(new_mod);
      ref_mod.current = new_mod;
      setEntityAttrs([...new_mod.entity_attributes]);
    }

    return (
      <div className={styles['entity-editor-container']}>
        <div>
          <label htmlFor={entityInputName}>Name: </label>
          <input id={entityInputName} name="entityName" value={ent.name} onChange={handleChange}></input>
        </div>
        <div className={styles['attribute-header-container']} >
          <div className={styles['attribute-header-label']}>Entity Attributes</div>
          <button className="button" onClick={onAddEntAttr}>
            +
          </button>
        </div>
        <div className={styles['attribute-container']}>
          {app_model.entity_attributes.filter((ea) => ea.entity_id === ent.id).map((entAttr) => (
            <EntityAttributeItem
              key={entAttr.id}
              ref_mod={ref_mod}
              app_model={app_model}
              setAppModel={setAppModel}
              entAttr={entAttr}
              onDelete={onEntAttrDelete}
            />
          ))}
        </div>
        <div style={{ width: '100vw', height: '75%' }}>
          <ActivityDiagram
            ref_mod={ref_mod}
            app_model={app_model}
            setAppModel={setAppModel}
            ent={ent}
            selectedObj={selectedObj}
            setSelectedObj={setSelectedObj}
            rfInstance={rfInstance}
            setRfInstance={setRfInstance}
          />
          {/* <ReactFlow ref={ref} nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
            onPaneContextMenu={onPaneContextMenu} onNodeContextMenu={onNodeContextMenu} onPaneClick={onPaneClick} nodeTypes={nodeTypes} connectionMode={"loose"}>
            <Background />
            {paneMenu && <EntityDiagramPaneContextMenu onClick={onPaneClick} {...paneMenu} />}
            {nodeMenu && <EntityDiagramNodeContextMenu onClick={onPaneClick} {...nodeMenu} />}
          </ReactFlow> */}
        </div>
      </div>
    );
  }

  return (
    <div className={styles['entity-editor-container']}>
      Please select an entity.
    </div>
  );

}