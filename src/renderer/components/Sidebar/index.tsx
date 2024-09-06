import Logo from '../Logo';
import EntityItem from '../EntityItem';
import Entity from '../../dataClasses/Entity';

import styles from './Sidebar.module.css';

export type EntityListItem = {
  ent: Entity;
  selected: boolean;
};

export default function Sidebar({
  entity_items,
  onAddButton,
  onSelection,
  onDelete,
}: {
  entity_items: EntityListItem[];
  onAddButton: () => void;
  onSelection: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className={styles.sidenav}>

    <div className={styles['header-container']} >
          <div className={styles['header-label']}>Entities</div>
          <button className="button" onClick={onAddButton}>
            +
          </button>
    </div>

      {entity_items.map((entItem) => (
        <EntityItem
          key={entItem.ent.id}
          ent={entItem.ent}
          selected={entItem.selected}
          onSelection={onSelection}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}