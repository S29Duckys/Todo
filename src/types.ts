export type Priority = "Urgent" | "Medium" | "Low";

export type Todo = {
  id: string;

  text: string;

  priority: Priority;

  completed: boolean;
};
