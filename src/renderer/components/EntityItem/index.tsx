import styles from './EntityItem.module.css';
import Entity from '../../dataClasses/Entity';

export type EntityListItem = {
  ent: Entity;
  selected: boolean;
  onSelection: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function EntityItem({
  ent,
  selected,
  onSelection,
  onDelete,
}: EntityListItem) {


  function handleSelection() {
    onSelection(ent.id);
  }

  function handleDelete() {
    onDelete(ent.id);
  }

  return (
    <div
      className={`${styles.container} ${selected ? styles['entity-selected'] : ''}`}
      id={`${ent.id}`}
    >
          <div className={styles['entity-label']} onClick={handleSelection}>{ent.name}</div>
          <button className={styles['entity-cancel']} onClick={handleDelete}>
            &times;
          </button>
    </div>
  );
}