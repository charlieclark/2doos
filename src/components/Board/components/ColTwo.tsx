import { Card, Stack } from "@mui/material";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import useCurrentTodo from "hooks/useCurrentTodo";
import { useGlobalDataContext } from "hooks/useGlobalData";
import { partition } from "lodash";
import { TodoTree, TodoTypes } from "types";
import { todoTreeIsFolder } from "utils/selectors";
import { DragOverlay } from "@dnd-kit/core";
import { useGlobalStateContext } from "hooks/useGlobalState";
import { CSS } from "@dnd-kit/utilities";
import TextEditor from "utils/components/TextEditor";

export const TodoCellInner = ({
  id,
  listeners,
}: {
  id: string;
  listeners?: any;
}) => {
  const { todoDict, editTodo } = useGlobalDataContext();
  const todo = todoDict[id];
  const { name, status } = todo;
  const { updateCurrentTodo } = useCurrentTodo();

  return (
    <Card onClick={() => updateCurrentTodo(id)}>
      <div
        {...listeners}
        style={{ width: 10, height: 10, background: "red" }}
      ></div>
      <TextEditor
        value={name}
        onChange={(newName) => editTodo(id, { name: newName })}
      />
      {!todoTreeIsFolder(todo) && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            editTodo(id, { status: status === "done" ? undefined : "done" });
          }}
        >
          {status === "done" ? "uncomplete" : "complete"}
        </div>
      )}
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

const TodoStack = ({ todos, id }: { todos: TodoTree[]; id: string }) => {
  return (
    <>
      <div>{id}</div>
      <SortableContext
        id={id}
        items={todos}
        strategy={verticalListSortingStrategy}
      >
        <Stack spacing={1}>
          {todos.map(({ id: todoId }) => (
            <TodoCell key={todoId} id={todoId} />
          ))}
        </Stack>
      </SortableContext>
    </>
  );
};

const ColTwo = () => {
  const {
    todoTree: { name, children, id },
  } = useCurrentTodo();
  const { addTodo, editTodo } = useGlobalDataContext();
  const [folders, todos] = partition(children, todoTreeIsFolder);
  const [done, notDone] = partition(todos, (a) => a.status === "done");

  return (
    <>
      <TextEditor
        value={name}
        onChange={(newName) => editTodo(id, { name: newName })}
      />
      <TodoStack id={TodoTypes.folder} todos={folders} />
      <div onClick={() => addTodo(id)}>Add todo</div>
      <TodoStack id={`${TodoTypes.todo}-notDone`} todos={notDone} />
      <TodoStack id={`${TodoTypes.todo}-done`} todos={done} />
    </>
  );
};

export default ColTwo;
