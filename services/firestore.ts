import {addDoc, collection, doc, getDocs, getFirestore, setDoc} from "@firebase/firestore";
import {TodoProps} from "../types/todo";
import {app} from "./firebase";

/**
 * Firestore 🔥
 * ===============================
 */
export const firestoreGetTodos = async (setTodos: (todos: TodoProps[]) => void) => {
    const db = getFirestore(app);

    const querySnapshot = await getDocs(collection(db, "todos"));

    let data: TodoProps[] = [];

    querySnapshot.forEach((doc) => {
        data.push({id: doc.id, ...doc.data()} as TodoProps)
    });

    setTodos(data);
}

export const firestoreAddTodo = async (name: string, addTodo: (todo: TodoProps) => void) => {
    const db = getFirestore(app);

    try {
        let data = {
            name: name,
            done: false,
        };

        const docRef = await addDoc(collection(db, 'todos'), data);
        addTodo({id: docRef.id, ...data});

        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const firestoreUpdateTodo = async (todo: TodoProps, updateTodo: (todo: TodoProps) => void) => {
    const db = getFirestore(app);

    try {
        let todoData = {
            name: todo.name,
            done: todo.done,
        };

        let docRef = await doc(db, 'todos', todo.id);

        setDoc(docRef, todoData);

        updateTodo({
            id: todo.id,
            ...todoData
        });
    } catch (e) {
        console.error("Error updating document: ", e);
    }
}