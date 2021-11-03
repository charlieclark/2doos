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
import { Card } from "@mui/material";
import { TIMELINE_GROUPS } from "data/example";
import { useGlobalDataContext } from "hooks/useGlobalData";
import { get, partition } from "lodash";
import { TG_ALL, TodoGroup } from "types";
import { todoTreeIsFolder } from "utils/selectors";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { useGlobalStateContext } from "hooks/useGlobalState";

const TodoCellInner = ({ id, listeners }: { id: string; listeners?: any }) => {
  const { todoDict } = useGlobalDataContext();
  const todo = todoDict[id];
  return (
    <Card>
      <div
        {...listeners}
        style={{ width: 10, height: 10, background: "red" }}
      ></div>
      <div>{todo.name}</div>
    </Card>
  );
};

const TodoCell = ({ id }: { id: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TodoCellInner id={id} listeners={listeners} />
    </div>
  );
};

const TodoGroupHolder = ({
  todoGroup: { id, name },
  activeSortId,
}: {
  todoGroup: TodoGroup;
  activeSortId?: string;
}) => {
  const { todoGroupsTree } = useGlobalDataContext();
  const { setNodeRef } = useDroppable({
    id,
    disabled: !!activeSortId && todoGroupsTree[id].includes(activeSortId),
  });
  const items = todoGroupsTree[id];
  return (
    <div
      style={{
        minHeight: 200,
        background: "#eee",
        marginBottom: 20,
        maxHeight: 300,
        overflow: "auto",
      }}
    >
      <div>{name}</div>
      <SortableContext
        id={id}
        items={items}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef}>
          {items.map((todoId) => (
            <TodoCell key={todoId} id={todoId} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

const ColThree = () => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [activeSortId, setActiveSortId] = useState<string>();

  const { todoGroups, todoGroupsTree, reorderGroupTodos, editTodo } =
    useGlobalDataContext();

  const containerIdPath = "data.current.sortable.containerId";

  const moveTodoGroup = (todoId: string, groupId: string) => {
    editTodo(todoId, {
      timelineGroup: groupId === TG_ALL ? undefined : groupId,
      orderIndex: todoGroupsTree[groupId].length,
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => {
        setActiveSortId(active.id);
      }}
      onDragEnd={({ active, over }) => {
        if (over) {
          reorderGroupTodos(get(active, containerIdPath), active.id, over.id);
        }
        setActiveSortId(undefined);
      }}
      onDragOver={({ active, over }) => {
        console.log(active.id, over && over.id);
        if (!over) {
          return;
        }
        if (get(active, containerIdPath) === get(over, containerIdPath)) {
          return;
        } else if (get(over, containerIdPath)) {
          moveTodoGroup(active.id, get(over, containerIdPath));
        } else {
          moveTodoGroup(active.id, over.id);
        }
      }}
    >
      {Object.values(todoGroups).map((todoGroup) => (
        <TodoGroupHolder
          activeSortId={activeSortId}
          key={todoGroup.id}
          todoGroup={todoGroup}
        />
      ))}
      <DragOverlay>
        {activeSortId ? <TodoCellInner id={activeSortId} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default ColThree;
