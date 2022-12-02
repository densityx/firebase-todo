'use client';

import {v4 as uuidv4} from 'uuid';
import {KeyboardEvent, useEffect, useState} from "react";
import {getDatabase, set, ref, onValue, get, child, push, update} from "firebase/database";
import {getFirestore, collection, addDoc, getDocs } from "@firebase/firestore";

import { app } from '../firebase';

const Button = ({name, className, handleClick}: { name: string, className?: string, handleClick: () => void }) => (
    <button
        className={`rounded-xl px-4 py-3 bg-blue-400 hover:bg-blue-500 font-semibold text-white transition-colors duration-300 ease-in-out ${className}`}
        onClick={handleClick}
    >
        {name}
    </button>
);

const Paper = ({children}: { children: any }) => (
    <div className={'mt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-gray-800 dark:text-gray-100'}>
        {children}
    </div>
)

const TodoItem = ({children, handleClick}: { children: any, handleClick: () => void }) => (
    <div
        className={'bg-gray-50 dark:bg-gray-800 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm transition ease-in-out duration-400  hover:cursor-pointer select-none text-gray-800 dark:text-gray-100 w-full'}
        onClick={handleClick}
    >
        {children}
    </div>
);

const Card = ({className, children}: { className: string, children: any }) => (
    <div className={`p-8 rounded-xl shadow-sm bg-white dark:bg-gray-900 ${className}`}>
        {children}
    </div>
)

interface TodoProps {
    id: string;
    name: string;
    done: boolean;
}

/**
 *add new todos
 *
 * @param todoId
 * @param todoName
 * @param todoDone
 */
const addNewTodo = ({ todoId, todoName, todoDone }: { todoId: string, todoName: string, todoDone: boolean}) => {
    const db = getDatabase(app);

    const todoData = {
        id: todoId,
        done: todoDone,
        name: todoName,
    };

    set(ref(db, 'todos/' + todoId), todoData)
};

const updateTodo = ({ todoId, todoName, todoDone }: { todoId: string, todoName: string, todoDone: boolean}) => {
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
const retrieveAndListenTodos = (setTodos:(todos: []) => void) => {
    const db = getDatabase(app);
    const todos = ref(db, 'todos/');

    onValue(todos, (snapshot) => {
        if (snapshot.exists()) {
            setTodos(snapshot.val());
        }  else {
            console.log("No data available");
        }
    });
};

/**
 * retrieve todos once
 *
 * @param setTodos
 */
const retrieveTodosOnce = (setTodos:(todos: []) => void) => {
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

/**
 * Firestore 🔥
 * ===============================
 */
const firestoreAddNewTodo = async ({ todoName, todoDone }: { todoName: string, todoDone: boolean}) => {
    const db = getFirestore(app);

    try {
        const docRef = await addDoc(collection(db, 'todos'), {
            name: todoName,
            done: todoDone,
        })

        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

const firestoreGetTodos = async () => {
    const db = getFirestore(app);

    const querySnapshot = await getDocs(collection(db, "todos"));

    querySnapshot.forEach((doc) => {
        console.log(`firestore: ${doc.id} => ${doc.data().name}`, doc);
    });
}

export default function Page() {
    const [editMode, setEditMode] = useState<TodoProps | null>(null);
    const [todo, setTodo] = useState<string>('');
    const [todos, setTodos] = useState<TodoProps[]>([]);

    useEffect(() => {
        // retrieveTodosOnce((todos) => setTodos(todos));

        console.log('firestore get todos');
        firestoreGetTodos();
    }, []);

    const handleSetTodo = (todo: TodoProps): void => {
        let newTodos = [...todos].map(currentTodo => {
            if (currentTodo.id === todo.id) {
                currentTodo.done = !currentTodo.done;
            }

            return currentTodo;
        });

        setTodos(newTodos);
        setTodo('');
        setEditMode(null);
    }

    const handleAddNewOrEditTodo = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.keyCode === 13 && e.target.value.length) {
            setTodo('');

            if (editMode === null) {
                let newTodo: TodoProps = {
                    id: uuidv4(),
                    name: e.target.value,
                    done: false,
                };

                addNewTodo({
                    todoId: uuidv4(),
                    todoName: e.target.value,
                    todoDone: false
                })

                setTodos([...todos, newTodo]);
            } else {
                setTodos(() => {
                    return [...todos].map(currentTodo => {
                        if (currentTodo.id === editMode?.id) {
                            currentTodo.name = e.target.value
                        }

                        return currentTodo;
                    });
                });

                setEditMode(null)
            }
        }
    }

    const handleClearCompletedTodo = (): void => {
        let newTodos = todos.filter(todo => !todo.done);

        setTodos(() => newTodos)
    }

    const handleEditTodo = (todo: TodoProps): void => {
        setEditMode(todo);

        setTodo(todo.name);
    }

    const handleMarkAll = (): void => {
        setTodos(() => [...todos].map(todo => {
            todo.done = true;
            return todo;
        }));
    }

    return (
        <div className={'bg-gray-100 h-screen dark:bg-gray-800'}>
            <div className={'max-w-xl mx-auto py-12'}>
                <Card className={'p-8 rounded-xl shadow-sm bg-white dark:bg-gray-900'}>
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            My Awesome Todo
                        </h2>

                        {todos.filter(todo => !todo.done).length ? (
                            <Button name={'Mark All Complete'} handleClick={handleMarkAll}/>
                        ) : null}
                    </div>

                    {todos.filter(todo => !todo.done).length ? (
                        <div className={'mt-4 space-y-4'}>
                            {todos.filter(todo => !todo.done).map((todo) => (
                                <div className={'flex items-center relative group'} key={todo.id}>
                                    <TodoItem handleClick={() => handleSetTodo(todo)}>
                                        <div>
                                            <input
                                                type="checkbox"
                                                className={'mr-3'}
                                                checked={todo?.done}
                                                onChange={() => {
                                                }}
                                            />
                                            {todo.name}
                                        </div>
                                    </TodoItem>

                                    <span
                                        className={`group-hover:flex items-center justify-center absolute px-3 py-1 right-0 font-semibold text-sm text-red-700 bg-red-200 hover:bg-red-300 rounded-full hover:cursor-pointer mr-4 ${editMode?.id === todo.id ? 'flex' : 'hidden'}`}
                                        onClick={() => handleEditTodo(todo)}
                                    >
                                        {editMode?.id === todo.id ? 'Editing' : 'Edit'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Paper>
                            There are currently no active todo
                        </Paper>
                    )}

                    <div className={'mt-4'}>
                        <input
                            type="text"
                            placeholder={'Enter your new todo here'}
                            className={'w-full block w-full rounded-md bg-blue-50 border-transparent focus:border-blue-400 focus:bg-white focus:ring-0'}
                            value={todo}
                            onChange={(e) => setTodo(e.target.value)}
                            onKeyDown={handleAddNewOrEditTodo}
                        />
                    </div>
                </Card>

                <Card className={'p-8 rounded-xl shadow-sm bg-white dark:bg-gray-900 mt-8'}>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        Completed Todos
                    </h2>

                    {todos.filter(todo => todo.done).length ? (
                        <>
                            <div className={'mt-4 space-y-4'}>
                                {todos.filter(todo => todo.done).map((todo) => (
                                    <TodoItem key={todo.id} handleClick={() => handleSetTodo(todo)}>
                                        <input
                                            type="checkbox"
                                            className={'mr-3'}
                                            checked={todo?.done}
                                            onChange={() => {
                                            }}
                                        />

                                        <del>{todo.name}</del>
                                    </TodoItem>
                                ))}
                            </div>

                            <div className={'mt-4'}>
                                <Button
                                    className={'w-full'}
                                    name={'Clear completed Todo'}
                                    handleClick={handleClearCompletedTodo}
                                />
                            </div>
                        </>
                    ) : (
                        <Paper>
                            There are currently no done todo
                        </Paper>
                    )}
                </Card>
            </div>
        </div>
    )
}