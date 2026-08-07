import { useEffect, useState } from "react";
import TodoItem from "./Todoitem";
import { Construction } from "lucide-react";

type Priority = "Urgente" | "Moyenne" | "Basse";

type Todo = {
  id: number;

  text: string;

  priority: Priority;
};

function App() {
  const [input, setInput] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("Moyenne");
  const savedTodo = localStorage.getItem("todos");
  const initialTodo = savedTodo ? JSON.parse(savedTodo) : [];
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
    setPriority("Moyenne");

    console.log(newTodo);
  }

  let filterTodos: Todo[] = []

  if(filter === "All"){
    filterTodos = todos
  }else{
    filterTodos = todos.filter((todo) => todo.priority === filter)
  }

  const urgentCount = todos.filter((t) => t.priority === "Urgente").length
  const mediumCount = todos.filter((t) => t.priority === "Moyenne").length
  const lowCount = todos.filter((t) => t.priority === "Basse").length

  const totalCount = todos.length

  function deletTodo(id: number){
    const newTodo = todos.filter((todo) => todo.id !== id)
    settodos(newTodo)
  }

  return (
    <div className="flex justify-center">
      <div className="w-2/3 flex flex-col gap-4 my-15 bg-base-300 p-5 rounded-2xl">
        <div className="flex gap-4">
          <input
            type="text"
            className="input w-full"
            placeholder="task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <select
            className="w-full"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="Urgente">Urgente</option>

            <option value="Moyenne">Moyenne</option>

            <option value="Basse">Basse</option>
          </select>
          <button className="btn btn-primary" onClick={addTodo}>
            add
          </button>
        </div>
        <div className="space-y-2 flex-1 h-fit">
          <div className="flex flex-wrap gap-4">
            <button className={`btn btn-soft ${filter === "All" ? "btm-primary" : ""}`} onClick={() => setfilter("All")}>All ({totalCount})</button>
            <button className={`btn btn-soft ${filter === "Urgente" ? "btm-primary" : ""}`} onClick={() => setfilter("Urgente")}>Urgent ({urgentCount})</button>
            <button className={`btn btn-soft ${filter === "Moyenne" ? "btm-primary" : ""}`} onClick={() => setfilter("Moyenne")}>Medium ({mediumCount})</button>
            <button className={`btn btn-soft ${filter === "Basse" ? "btm-primary" : ""}`} onClick={() => setfilter("Basse")}>Low ({lowCount})</button>
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
            <div className="flex justify-center items-center flex-col p-5">
              <div>
                <Construction strokeWidth={1} className="w-40 h-40 test-primary"/>
                <p className="texte-sm">Aucune tache pour ce filtre</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
