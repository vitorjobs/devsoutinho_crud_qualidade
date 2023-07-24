import fs from "fs"
import { v4 as uuid } from "uuid"

const DB_FILE_PATH = "./core.db"

// MODELAGEM DE INTERFACE
interface Todo {
    id: string,
    content: string,
    date: string,
    done: boolean
}

// CRIAR ENTRADA NO ARQUIVO DE BANCO
function create(content: string): Todo {
    const todo: Todo = {
        id: uuid(),
        date: new Date().toISOString(),
        content: content,
        done: false
    }

    const todos: Array<Todo> = [
        ...read(),
        todo,
    ]

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos,
        dogs: [],
    }, null, 2))

    return todo
}

// LER ENTRADA NO ARQUIVO DE BANCO
// Salva o content no sistema
function read(): Array<Todo> {
    const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8")
    const db = JSON.parse(dbString || "{}")

    if (!db.todos) {
        return []
    }
    return db.todos
}


function update(id: string, partialTodo: Partial<Todo>): Todo{  

    let updateTodo
    const todos = read()
    todos.forEach((currentTodo) =>{
        const isToUpdate = currentTodo.id === id
        if(isToUpdate){
            updateTodo = Object.assign(currentTodo, partialTodo)
        }
    })
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos,
        dogs: [],
    }, null, 2))

    if(!updateTodo){
        throw new Error("Please privide another ID!")
    }

    return updateTodo
}

function updateContentById(id: string, content: string): Todo {
    return update(id, {
        content,
    })
}

// LIMPAR BANCO
function CLEAR_DB() {
    fs.writeFileSync(DB_FILE_PATH, "")
}

// SIMULAR ENTRADA DE DADOS NO CREATE E READ
CLEAR_DB()
create("Primeira TODO")
create("Segunda TODO")
const terceiraTodo = create("Segunda TODO")
update(terceiraTodo.id, {
    content: "Segunda TODO com novo content"
})
updateContentById(terceiraTodo.id, "Atualizada")
console.log(read())