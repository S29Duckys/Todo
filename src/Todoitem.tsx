import { Trash } from "lucide-react";

type Priority = "Urgent" | "Medium" | "Low";

type Todo = {
  id: number;

  text: string;

  priority: Priority;
};

type Props = {
  todo: Todo;
  onDelete: () => void;
};

const TodoItem = ({ todo, onDelete }: Props) => {
  return (
    <div className="p-2 sm:p-3">
      <div className="flex justify-between items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <input
            type="checkbox"
            className="checkbox checkbox-sm sm:checkbox-md checkbox-primary rounded-md shrink-0"
          />
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0 text-sm sm:text-md font-bold">
            <span className="break-words min-w-0">{todo.text}</span>
            <span
              className={`badge badge-sm badge-soft shrink-0 ${
                todo.priority === "Urgent"
                  ? "badge-error"
                  : todo.priority === "Medium"
                    ? "badge-warning"
                    : "badge-success"
              }`}
            >
              {todo.priority}
            </span>
          </span>
        </div>
        <button
          onClick={onDelete}
          className="btn btn-sm btn-error btn-soft shrink-0"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
