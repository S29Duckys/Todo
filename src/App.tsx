import { LucideReceiptIndianRupee } from "lucide-react";
import { useState } from "react";

type Priority = "Urgente" | "Moyenne" | "Basse";

type Todo = {
  id: number;

  text: string;

  priority: Priority;
};


function App() {
  const [input, setInput] = useState<string>("")
  const [priority, setPriority] = useState<Priority>("Moyenne")
  const [todos, settodos] = useState<Todo[]>([])

  function addTodo(){
    if (input.trim() == ""){
      return 
    }

    const newTodo : Todo = {
      id: Date.now(),
      text: input.trim(),
      priority: priority,
    }

    const newTodos = [newTodo, ...todos]
    settodos(newTodos)
    setInput("")
    setPriority("Moyenne")
  }

  return (
    <div className="flex justify-center">
      <div className="w-2/3 flex flex-col gap-4 my-15 bg-base-300 p-5 rounded-2xl">
        <div className="flex gap-4">
          <input type="text" className="input w-full" placeholder="task..." value={input} onChange={(e) => setInput(e.target.value)}/>

          <select className="w-full" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
            <option value="Urgent">Urgent</option>

            <option value="Moyenne">Moyenne</option>

            <option value="Bass">Bass</option>
          </select>
          <button className="btn btn-primary" onClick={addTodo}>add</button>
        </div>
      </div>
    </div>
  );
}

export default App;
