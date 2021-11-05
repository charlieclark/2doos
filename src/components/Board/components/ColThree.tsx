import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { Breadcrumbs, Card, Checkbox, Link, Paper } from "@mui/material";
import { TIMELINE_GROUPS } from "data/example";
import { useGlobalDataContext } from "hooks/useGlobalData";
import { get, partition } from "lodash";
import {
  ActiveDrag,
  appendPrefix,
  DD_TYPES,
  removePrefix,
  TG_ALL,
  TodoGroup,
} from "types";
import { todoTreeIsFolder } from "utils/selectors";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { useGlobalStateContext } from "hooks/useGlobalState";
import useCurrentTodo from "hooks/useCurrentTodo";
import ColumnInner from "utils/components/ColumnInner";
import styles from "./ColThree.module.scss";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

export const TodoCellInner = ({
  id,
  listeners,
}: {
  id: string;
  listeners?: any;
}) => {
  const { todoDict, editTodo } = useGlobalDataContext();
  const { updateCurrentTodo } = useCurrentTodo();
  const todo = todoDict[id];
  return (
    <Card
      className={styles.card}
      onClick={() => {
        updateCurrentTodo(id);
      }}
    >
      <div className={styles.breadCrumbs}>
        {[...todo.parents].reverse().map((todoParent) => (
          <>
            <div className={styles.carrat}>›</div>
            <div
              className={styles.link}
              onClick={(e) => {
                e.stopPropagation();
                updateCurrentTodo(todoParent);
              }}
            >
              {todoDict[todoParent].name}
            </div>
          </>
        ))}
      </div>
      <div className={styles.middle}>
        <div className={styles.iconWrapper} {...listeners}>
          <DragIndicatorIcon />
        </div>

        <div className={styles.name}>{todo.name}</div>
        <div className={styles.iconWrapper}>
          <Checkbox
            onClick={(e) => {
              e.stopPropagation();
              editTodo(id, { status: "done" });
            }}
          />
        </div>
      </div>
    </Card>
  );
};

const TodoCell = ({ id, disabled }: { id: string; disabled?: boolean }) => {
  const todoId = removePrefix(id, DD_TYPES.todoTimeline);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      data: { type: DD_TYPES.todoTimeline, id: todoId },
      disabled,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TodoCellInner id={todoId} listeners={listeners} />
    </div>
  );
};

const TodoGroupHolderInner = ({
  items,
  id,
}: {
  items: string[];
  id: string;
}) => {
  const { activeDrag } = useGlobalStateContext();
  const { todoGroupsTree } = useGlobalDataContext();

  const isDroppableDisabled =
    activeDrag &&
    activeDrag.type === DD_TYPES.todoTimeline &&
    todoGroupsTree[id].includes(activeDrag.id);

  const { setNodeRef } = useDroppable({
    id: appendPrefix(id, DD_TYPES.todoTimelineGroup),
    disabled: isDroppableDisabled,

    data: {
      type: DD_TYPES.todoTimelineGroup,
      id,
    },
  });

  return (
    <div ref={setNodeRef}>
      {items.length ? (
        items.map((todoId) => <TodoCell key={todoId} id={todoId} />)
      ) : (
        <Paper elevation={0} className={styles.emptyState}>
          Drag a task
        </Paper>
      )}
    </div>
  );
};

const TodoGroupHolder = ({
  todoGroup: { id, name },
}: {
  todoGroup: TodoGroup;
}) => {
  const { todoGroupsTree, todoDict } = useGlobalDataContext();

  const items = todoGroupsTree[id]
    .filter((todoId) => todoDict[todoId].status !== "done")
    .map((todoId) => appendPrefix(todoId, DD_TYPES.todoTimeline));

  const inner = (
    <div>
      <SortableContext
        id={id}
        items={items}
        strategy={verticalListSortingStrategy}
      >
        <TodoGroupHolderInner items={items} id={id} />
      </SortableContext>
    </div>
  );

  if (id === TG_ALL) {
    return inner;
  }

  return (
    <Card className={styles.groupHolder}>
      <div className={styles.groupTitle}>{name}</div>
      {inner}
    </Card>
  );
};

const ColThree = ({ className }: { className: string }) => {
  const { todoGroups } = useGlobalDataContext();

  return (
    <ColumnInner className={className}>
      {Object.values(todoGroups).map((todoGroup) => (
        <TodoGroupHolder key={todoGroup.id} todoGroup={todoGroup} />
      ))}
    </ColumnInner>
  );
};

export default ColThree;
