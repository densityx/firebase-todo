'use client';

import {KeyboardEvent, useEffect, useState} from "react";
import {TodoProps} from "../../types/todo";
import {firestoreAddTodo, firestoreGetTodos, firestoreUpdateTodo} from "../../services/firestore";
import Button from "./Button";
import Paper from "./Paper";
import Card from "./Card";
import TodoItem from "./TodoItem";

export default function Page() {
    const [editMode, setEditMode] = useState<TodoProps | null>(null);
    const [todo, setTodo] = useState<string>('');
    const [todos, setTodos] = useState<TodoProps[]>([]);

    useEffect(() => {
        firestoreGetTodos((todos: TodoProps[]) => setTodos(todos))
            .then(res => console.log('done getting todos'))
    }, []);

    const handleSetTodo = (todo: TodoProps): void => {
        firestoreUpdateTodo({
            ...todo,
            done: !todo.done,
        }, (todo) => {
            setTodos(() => {
                return [...todos].map((currentTodo: TodoProps) => {
                    if (currentTodo.id === todo.id) {
                        currentTodo = todo;
                    }

                    return currentTodo;
                });
            });
        })

        setTodo('');
        setEditMode(null);
    }

    const handleAddNewOrEditTodo = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.keyCode === 13 && e.target.value.length) {
            setTodo('');

            if (editMode === null) {
                firestoreAddTodo(e.target.value, (todo: TodoProps) => setTodos([...todos, todo]));
            } else {
                firestoreUpdateTodo({
                    ...editMode,
                    name: e.target.value,
                }, (todo) => {
                    setTodos(() => {
                        return [...todos].map((currentTodo: TodoProps) => {
                            if (currentTodo.id === todo.id) {
                                currentTodo = todo;
                            }

                            return currentTodo;
                        });
                    });
                })

                setEditMode(null)
            }
        }
    }

    const handleClearCompletedTodo = (): void => {
        let newTodos = todos.filter((todo: TodoProps) => !todo.done);

        setTodos(() => newTodos)
    }

    const handleEditTodo = (todo: TodoProps): void => {
        setEditMode(todo);

        setTodo(todo.name);
    }

    const handleMarkAll = (): void => {
        setTodos(() => [...todos].map((todo: TodoProps) => {
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

                        {todos.filter((todo: TodoProps) => !todo.done).length ? (
                            <Button name={'Mark All Complete'} handleClick={handleMarkAll}/>
                        ) : null}
                    </div>

                    {todos.filter((todo: TodoProps) => !todo.done).length ? (
                        <div className={'mt-4 space-y-4'}>
                            {todos.filter((todo: TodoProps) => !todo.done).map((todo) => (
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

                    {todos.filter((todo: TodoProps) => todo.done).length ? (
                        <>
                            <div className={'mt-4 space-y-4'}>
                                {todos.filter((todo: TodoProps) => todo.done).map((todo) => (
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