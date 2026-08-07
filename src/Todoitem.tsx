import { Check, Trash2 } from "lucide-react";
import type { Todo } from "./types";

type Props = {
  todo: Todo;
  onDelete: () => void;
  onToggle: () => void;
};

const TodoItem = ({ todo, onDelete, onToggle }: Props) => {
  return (
    <div className="task-row group flex items-center gap-3 rounded-xl px-2 py-2.5 sm:gap-4 sm:px-3 sm:py-3">
      <label className="relative grid size-6 shrink-0 cursor-pointer place-items-center">
        <input
          type="checkbox"
          className="peer size-6 cursor-pointer appearance-none rounded-lg border border-base-300 bg-base-100/60 transition-colors duration-200 checked:border-primary checked:bg-primary hover:border-primary/70"
          checked={todo.completed}
          onChange={onToggle}
          aria-label={`Mark "${todo.text}" as ${todo.completed ? "not done" : "done"}`}
        />
        <Check
          strokeWidth={3.5}
          className="pointer-events-none absolute size-4 scale-50 text-primary-content opacity-0 transition-all duration-200 peer-checked:scale-100 peer-checked:opacity-100"
        />
      </label>

      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
        <span
          data-done={todo.completed}
          className={`task-label relative min-w-0 break-words text-sm font-semibold leading-snug sm:text-base ${
            todo.completed ? "text-base-content/40" : "text-base-content"
          }`}
        >
          {todo.text}
        </span>

        <span
          className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition-opacity duration-200 ${
            todo.completed ? "opacity-40" : ""
          } ${
            todo.priority === "Urgent"
              ? "bg-error/15 text-error"
              : todo.priority === "Medium"
                ? "bg-warning/15 text-warning"
                : "bg-success/15 text-success"
          }`}
        >
          <span className="size-1.5 rounded-full bg-current" />
          {todo.priority}
        </span>
      </div>

      <button
        onClick={onDelete}
        aria-label={`Delete "${todo.text}"`}
        className="task-action grid size-11 shrink-0 cursor-pointer place-items-center rounded-xl text-base-content/40 transition-colors duration-200 hover:bg-error/15 hover:text-error active:scale-95"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
};

export default TodoItem;
