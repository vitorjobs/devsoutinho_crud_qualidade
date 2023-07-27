import fs from "fs";
import { v4 as uuid } from "uuid";

const DB_FILE_PATH = "./core.db";

type UUID = string;

// MODELAGEM DE INTERFACE
interface Todo {
  id: UUID;
  content: string;
  date: string;
  done: boolean;
}

// CRIAR ENTRADA NO ARQUIVO DE BANCO
function create(content: string): Todo {
  const todo: Todo = {
    id: uuid(),
    date: new Date().toISOString(),
    content: content,
    done: false,
  };

  const todos: Array<Todo> = [...read(), todo];

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos,
        dogs: [],
      },
      null,
      2
    )
  );

  return todo;
}

// LER ENTRADA NO ARQUIVO DE BANCO
// Salva o content no sistema
export function read(): Array<Todo> {
  const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
  const db = JSON.parse(dbString || "{}");

  if (!db.todos) {
    return [];
  }
  return db.todos;
}

function update(id: string, partialTodo: Partial<Todo>): Todo {
  let updateTodo;
  const todos = read();
  todos.forEach((currentTodo) => {
    const isToUpdate = currentTodo.id === id;
    if (isToUpdate) {
      updateTodo = Object.assign(currentTodo, partialTodo);
    }
  });
  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos,
        dogs: [],
      },
      null,
      2
    )
  );

  if (!updateTodo) {
    throw new Error("Please privide another ID!");
  }

  return updateTodo;
}

function updateContentById(id: string, content: string): Todo {
  return update(id, {
    content,
  });
}

function deleteById(id: string) {
  const todos = read();

  const todosWithoutOne = todos.filter((todo) => {
    if (id === todo.id) {
      return false;
    }
    return true;
  });

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos: todosWithoutOne,
        dogs: [],
      },
      null,
      2
    )
  );
}

// LIMPAR BANCO
function CLEAR_DB() {
  fs.writeFileSync(DB_FILE_PATH, "");
}

// // SIMULAR ENTRADA DE DADOS NO CREATE E READ
// CLEAR_DB();
// create("Primeira TODO");
// const secontTodo = create("Primeira TODO");
// deleteById(secontTodo.id);
// const thirdTodo = create("Segunda TODO");
// // update(thirdTodo.id, {
// //     content: "Segunda TODO com novo content"
// // })
// updateContentById(thirdTodo.id, "Atualizada");
// const todos = read();
// console.log(read());
// console.log(todos);
// console.log(todos.length);
