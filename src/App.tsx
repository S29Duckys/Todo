import { useEffect, useState } from "react";
import TodoItem from "./Todoitem";
import { ClipboardList, ListTodo, Plus, TriangleAlert } from "lucide-react";
import { supabase } from "./lib/supabase";
import type { Priority, Todo } from "./types";

function App() {
  const [input, setInput] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [todos, settodos] = useState<Todo[]>([]);
  const [filter, setfilter] = useState<Priority | "All">("All")
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function loadTodos() {
      const { data, error } = await supabase
        .from("todos")
        .select("id, text, priority, completed")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        settodos(data);
      }

      setLoading(false);
    }

    loadTodos();
  }, []);

  async function addTodo() {
    if (input.trim() == "") {
      return;
    }

    const { data, error } = await supabase
      .from("todos")
      .insert({ text: input.trim(), priority: priority })
      .select("id, text, priority, completed")
      .single();

    if (error) {
      setError(error.message);
      return;
    }

    settodos([data, ...todos]);
    setInput("");
    setPriority("Medium");
    setError("");
  }

  let filterTodos: Todo[] = []

  if(filter === "All"){
    filterTodos = todos
  }else{
    filterTodos = todos.filter((todo) => todo.priority === filter)
  }

  filterTodos = [...filterTodos].sort(
    (a, b) => Number(a.completed) - Number(b.completed)
  )

  const urgentCount = todos.filter((t) => t.priority === "Urgent").length
  const mediumCount = todos.filter((t) => t.priority === "Medium").length
  const lowCount = todos.filter((t) => t.priority === "Low").length

  const totalCount = todos.length

  async function toggleTodo(id: string){
    const todo = todos.find((todo) => todo.id === id)

    if (!todo) {
      return
    }

    const completed = !todo.completed

    settodos(todos.map((t) => (t.id === id ? { ...t, completed } : t)))

    const { error } = await supabase
      .from("todos")
      .update({ completed })
      .eq("id", id);

    if (error) {
      settodos(todos)
      setError(error.message)
      return
    }

    setError("")
  }

  async function deletTodo(id: string){
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    settodos(todos.filter((todo) => todo.id !== id))
    setError("")
  }

  return (
    <div className="min-h-dvh px-4 py-8 sm:px-6 sm:py-14">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <header className="animate-fade flex items-center gap-3.5">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary ring-1 ring-inset ring-primary/25">
            <ListTodo className="size-5.5" />
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Tasks
            </h1>
            <p className="text-sm text-base-content/50">
              {totalCount === 0
                ? "Nothing on your plate yet"
                : `${totalCount} task${totalCount > 1 ? "s" : ""} in your list`}
            </p>
          </div>
        </header>

        <section className="panel animate-rise rounded-2xl p-3 sm:p-4">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <input
              type="text"
              aria-label="New task"
              className="h-12 w-full min-w-0 rounded-xl border border-base-300/70 bg-base-100/50 px-4 text-base font-medium text-base-content transition-colors duration-200 outline-none placeholder:text-base-content/35 hover:border-base-300 focus:border-primary sm:flex-1"
              placeholder="What needs to be done?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTodo();
              }}
            />

            <div className="flex gap-2.5">
              <select
                aria-label="Priority"
                className="h-12 flex-1 cursor-pointer rounded-xl border border-base-300/70 bg-base-100/50 px-3 text-sm font-semibold text-base-content transition-colors duration-200 outline-none hover:border-base-300 focus:border-primary sm:flex-none"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value="Urgent">Urgent</option>

                <option value="Medium">Medium</option>

                <option value="Low">Low</option>
              </select>
              <button
                aria-label="Add task"
                className="inline-flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-content transition-[background-color,transform] duration-200 hover:bg-primary/85 active:scale-[0.97]"
                onClick={addTodo}
              >
                <Plus className="size-4.5" strokeWidth={2.75} />
                <span>Add</span>
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="animate-pop flex items-start gap-3 rounded-xl border border-error/25 bg-error/10 p-3.5 text-sm text-error"
          >
            <TriangleAlert className="mt-0.5 size-4.5 shrink-0" />
            <span className="min-w-0 break-words font-medium">{error}</span>
          </div>
        )}

        <section className="flex flex-col gap-4">
          <div
            role="tablist"
            aria-label="Filter by priority"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          >
            <button role="tab" aria-selected={filter === "All"} className={`inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-semibold transition-all duration-200 ${filter === "All" ? "bg-primary text-primary-content" : "bg-base-200/70 text-base-content/60 hover:bg-base-300/70 hover:text-base-content"}`} onClick={() => setfilter("All")}>All<span className={`rounded-full px-1.5 py-0.5 text-xs tabular-nums ${filter === "All" ? "bg-primary-content/15" : "bg-base-content/10"}`}>{totalCount}</span></button>
            <button role="tab" aria-selected={filter === "Urgent"} className={`inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-semibold transition-all duration-200 ${filter === "Urgent" ? "bg-primary text-primary-content" : "bg-base-200/70 text-base-content/60 hover:bg-base-300/70 hover:text-base-content"}`} onClick={() => setfilter("Urgent")}>Urgent<span className={`rounded-full px-1.5 py-0.5 text-xs tabular-nums ${filter === "Urgent" ? "bg-primary-content/15" : "bg-base-content/10"}`}>{urgentCount}</span></button>
            <button role="tab" aria-selected={filter === "Medium"} className={`inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-semibold transition-all duration-200 ${filter === "Medium" ? "bg-primary text-primary-content" : "bg-base-200/70 text-base-content/60 hover:bg-base-300/70 hover:text-base-content"}`} onClick={() => setfilter("Medium")}>Medium<span className={`rounded-full px-1.5 py-0.5 text-xs tabular-nums ${filter === "Medium" ? "bg-primary-content/15" : "bg-base-content/10"}`}>{mediumCount}</span></button>
            <button role="tab" aria-selected={filter === "Low"} className={`inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-semibold transition-all duration-200 ${filter === "Low" ? "bg-primary text-primary-content" : "bg-base-200/70 text-base-content/60 hover:bg-base-300/70 hover:text-base-content"}`} onClick={() => setfilter("Low")}>Low<span className={`rounded-full px-1.5 py-0.5 text-xs tabular-nums ${filter === "Low" ? "bg-primary-content/15" : "bg-base-content/10"}`}>{lowCount}</span></button>
          </div>

          <div className="panel min-h-[16rem] rounded-2xl p-2 sm:p-3">
            {loading ? (
              <ul aria-busy="true" aria-label="Loading tasks" className="stagger">
                <li className="animate-fade flex items-center gap-4 px-2 py-3 sm:px-3">
                  <span className="size-6 shrink-0 animate-pulse rounded-lg bg-base-300/70" />
                  <span className="h-4 flex-1 animate-pulse rounded-full bg-base-300/70" />
                  <span className="h-6 w-20 shrink-0 animate-pulse rounded-full bg-base-300/50" />
                </li>
                <li className="animate-fade flex items-center gap-4 px-2 py-3 sm:px-3">
                  <span className="size-6 shrink-0 animate-pulse rounded-lg bg-base-300/70" />
                  <span className="h-4 flex-1 animate-pulse rounded-full bg-base-300/50" />
                  <span className="h-6 w-16 shrink-0 animate-pulse rounded-full bg-base-300/40" />
                </li>
                <li className="animate-fade flex items-center gap-4 px-2 py-3 sm:px-3">
                  <span className="size-6 shrink-0 animate-pulse rounded-lg bg-base-300/70" />
                  <span className="h-4 flex-1 animate-pulse rounded-full bg-base-300/40" />
                  <span className="h-6 w-24 shrink-0 animate-pulse rounded-full bg-base-300/30" />
                </li>
              </ul>
            ) : filterTodos.length > 0 ? (
              <ul className="divide-y divide-base-300/40">
                {filterTodos.map((todo) => (
                  <li key={todo.id} className="animate-rise">
                    <TodoItem
                      todo={todo}
                      onDelete={() => deletTodo(todo.id)}
                      onToggle={() => toggleTodo(todo.id)}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="animate-pop flex min-h-[15rem] flex-col items-center justify-center gap-4 px-6 py-10 text-center">
                <span className="grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                  <ClipboardList className="size-7" strokeWidth={1.75} />
                </span>
                <div className="flex flex-col gap-1">
                  <p className="text-base font-bold">
                    {filter === "All" ? "No tasks yet" : `Nothing marked ${filter}`}
                  </p>
                  <p className="max-w-xs text-sm text-base-content/50">
                    {filter === "All"
                      ? "Add your first task using the field above."
                      : "Switch back to All to see the rest of your list."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
