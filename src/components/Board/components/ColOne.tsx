import { DragOverlay, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import useCurrentTodo from "hooks/useCurrentTodo";
import { useGlobalDataContext } from "hooks/useGlobalData";
import { TodoTree } from "types";
import { doesTodoContainTodo, todoTreeIsFolder } from "utils/selectors";
import { CSS } from "@dnd-kit/utilities";
import { useGlobalStateContext } from "hooks/useGlobalState";
import { Card } from "@mui/material";

const Folder = ({ todoTree }: { todoTree: TodoTree }) => {
  const { id, name, children } = todoTree;
  const { todoId, updateCurrentTodo } = useCurrentTodo();
  const isActive = doesTodoContainTodo(todoTree, todoId);
  const { activeDragTodoId } = useGlobalStateContext();

  const isDraggingProject = activeDragTodoId?.startsWith("project");

  const { setNodeRef } = useDroppable({
    disabled: isDraggingProject,
    id: `col-one-folder-${id}`,
    data: {
      folderId: id,
    },
  });

  return (
    <div
      style={{ paddingLeft: 10 }}
      onClick={(e) => {
        e.stopPropagation();
        updateCurrentTodo(id);
      }}
    >
      <div style={{ padding: 20 }} ref={setNodeRef}>
        {name + (isActive ? "-active" : "")}
      </div>
      {!isDraggingProject &&
        children
          .filter(todoTreeIsFolder)
          .map((todoTreeChild) => (
            <Folder key={todoTreeChild.id} todoTree={todoTreeChild} />
          ))}
    </div>
  );
};

export const ProjectInner = ({
  id,
  listeners,
}: {
  id: string;
  listeners?: any;
}) => {
  const { todoDict } = useGlobalDataContext();
  const todoId = id.replace("project-", "");

  return (
    <Card>
      <div
        {...listeners}
        style={{ width: 10, height: 10, background: "red" }}
      ></div>
      <Folder todoTree={todoDict[todoId]} />
    </Card>
  );
};

const Project = ({ id }: { id: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ProjectInner id={id} listeners={listeners} />
    </div>
  );
};

const ColOne = () => {
  const { todoTreeArray, addTodo } = useGlobalDataContext();

  const projects = todoTreeArray.map(({ id }) => ({
    id: `project-${id}`,
  }));

  return (
    <>
      <div
        onClick={() => {
          addTodo(undefined, { name: "New Project" });
        }}
      >
        Add project
      </div>
      <SortableContext
        id={"reorder-projects"}
        items={projects}
        strategy={verticalListSortingStrategy}
      >
        {projects.map(({ id }) => (
          <Project key={id} id={id} />
        ))}
      </SortableContext>
    </>
  );
};

export default ColOne;
