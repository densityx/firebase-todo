import {child, get, getDatabase, onValue, push, ref, set, update} from "firebase/database";
import {app} from "./firebase";

/**
 * Realtime Database
 * ===============================
 */

/**
 *add new todos
 *
 * @param todoId
 * @param todoName
 * @param todoDone
 */
const addNewTodo = ({todoId, todoName, todoDone}: { todoId: string, todoName: string, todoDone: boolean }) => {
    const db = getDatabase(app);

    const todoData = {
        id: todoId,
        done: todoDone,
        name: todoName,
    };

    set(ref(db, 'todos/' + todoId), todoData)
};

const updateTodo = ({todoId, todoName, todoDone}: { todoId: string, todoName: string, todoDone: boolean }) => {
    const db = getDatabase(app);

    const todoData = {
        id: todoId,
        done: todoDone,
        name: todoName,
    };

    const newTodoKey = push(child(ref(db), 'todos')).key;

    const updates: any = {};
    updates['/todos/' + newTodoKey] = todoData;

    update(ref(db), updates)
        .then(() => {
            console.log('todo saved successfully')
        })
        .catch((error) => {
            console.log('something went error when trying to save todo')
        })
};

/**
 * retrieve and listen todos
 *
 * @param setTodos
 */
const retrieveAndListenTodos = (setTodos: (todos: []) => void) => {
    const db = getDatabase(app);
    const todos = ref(db, 'todos/');

    onValue(todos, (snapshot) => {
        if (snapshot.exists()) {
            setTodos(snapshot.val());
        } else {
            console.log("No data available");
        }
    });
};

/**
 * retrieve todos once
 *
 * @param setTodos
 */
const retrieveTodosOnce = (setTodos: (todos: []) => void) => {
    const dbRef = ref(getDatabase(app));

    get(child(dbRef, 'todos/'))
        .then((snapshot) => {
            if (snapshot.exists()) {
                setTodos(snapshot.val());
                console.log(snapshot.val());
            } else {
                console.log('no data available');
            }
        })
        .catch((error) => {
            console.log('error', error);
        })
}
