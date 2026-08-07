import { useEffect, useState } from "react";
import TodoItem from "./Todoitem";
import { Construction } from "lucide-react";
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
    <div className="min-h-screen flex justify-start sm:justify-center px-3 py-6 sm:px-6 sm:py-10">
      <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl flex flex-col gap-4 bg-base-300 p-4 sm:p-5 md:p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <input
            type="text"
            className="input w-full sm:flex-1 sm:min-w-0"
            placeholder="Task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTodo();
            }}
          />

          <select
            className="select w-full sm:w-auto sm:shrink-0"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="Urgent">Urgent</option>

            <option value="Medium">Medium</option>

            <option value="Low">Low</option>
          </select>
          <button
            className="btn btn-primary w-full sm:w-auto sm:shrink-0"
            onClick={addTodo}
          >
            Add
          </button>
        </div>
        {error && (
          <div className="alert alert-error text-sm">
            <span className="break-words">{error}</span>
          </div>
        )}
        <div className="space-y-2 flex-1 h-fit">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
            <button className={`btn btn-sm sm:btn-md btn-soft ${filter === "All" ? "btn-primary" : ""}`} onClick={() => setfilter("All")}>All ({totalCount})</button>
            <button className={`btn btn-sm sm:btn-md btn-soft ${filter === "Urgent" ? "btn-primary" : ""}`} onClick={() => setfilter("Urgent")}>Urgent ({urgentCount})</button>
            <button className={`btn btn-sm sm:btn-md btn-soft ${filter === "Medium" ? "btn-primary" : ""}`} onClick={() => setfilter("Medium")}>Medium ({mediumCount})</button>
            <button className={`btn btn-sm sm:btn-md btn-soft ${filter === "Low" ? "btn-primary" : ""}`} onClick={() => setfilter("Low")}>Low ({lowCount})</button>
          </div>
          {loading ? (
            <div className="flex justify-center items-center p-4 sm:p-5">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : filterTodos.length > 0 ? (
            <ul className="divide-y divide-primary/20">
              {filterTodos.map((todo) => (
                <li key={todo.id}>
                  <TodoItem
                    todo={todo}
                    onDelete={() => deletTodo(todo.id)}
                    onToggle={() => toggleTodo(todo.id)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex justify-center items-center flex-col p-4 sm:p-5">
              <div className="flex flex-col items-center text-center">
                <Construction strokeWidth={1} className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 text-primary"/>
                <p className="text-sm">No task for this filter</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
