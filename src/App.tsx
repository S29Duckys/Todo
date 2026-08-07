import { useEffect, useState } from "react";
import TodoItem from "./Todoitem";
import { Construction } from "lucide-react";

type Priority = "Urgent" | "Medium" | "Low";

type Todo = {
  id: number;

  text: string;

  priority: Priority;
};

const legacyPriorities: Record<string, Priority> = {
  Urgente: "Urgent",
  Moyenne: "Medium",
  Basse: "Low",
};

function App() {
  const [input, setInput] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const savedTodo = localStorage.getItem("todos");
  const initialTodo: Todo[] = savedTodo
    ? JSON.parse(savedTodo).map((todo: Todo) => ({
        ...todo,
        priority: legacyPriorities[todo.priority] ?? todo.priority,
      }))
    : [];
  const [todos, settodos] = useState<Todo[]>(initialTodo);
  const [filter, setfilter] = useState<Priority | "All">("All")

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function addTodo() {
    if (input.trim() == "") {
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      priority: priority,
    };

    const newTodos = [newTodo, ...todos];
    settodos(newTodos);
    setInput("");
    setPriority("Medium");

    console.log(newTodo);
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

  function deletTodo(id: number){
    const newTodo = todos.filter((todo) => todo.id !== id)
    settodos(newTodo)
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
        <div className="space-y-2 flex-1 h-fit">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
            <button className={`btn btn-sm sm:btn-md btn-soft ${filter === "All" ? "btn-primary" : ""}`} onClick={() => setfilter("All")}>All ({totalCount})</button>
            <button className={`btn btn-sm sm:btn-md btn-soft ${filter === "Urgent" ? "btn-primary" : ""}`} onClick={() => setfilter("Urgent")}>Urgent ({urgentCount})</button>
            <button className={`btn btn-sm sm:btn-md btn-soft ${filter === "Medium" ? "btn-primary" : ""}`} onClick={() => setfilter("Medium")}>Medium ({mediumCount})</button>
            <button className={`btn btn-sm sm:btn-md btn-soft ${filter === "Low" ? "btn-primary" : ""}`} onClick={() => setfilter("Low")}>Low ({lowCount})</button>
          </div>
          {filterTodos.length > 0 ? (
            <ul className="divide-y divide-primary/20">
              {filterTodos.map((todo) => (
                <li key={todo.id}>
                  <TodoItem todo={todo} onDelete={() => deletTodo(todo.id)}/>
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
