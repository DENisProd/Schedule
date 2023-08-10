import {useEffect, useState} from "react";
import {
    addTodo,
    toggleTodo,
    deleteTodo,
    addPhoto,
    TASK_STATUSES,
    getTodosFromLocalStorage, INITIALIZE_TODOS, searchTodo, clearSearch, searchTodoByTag
} from '../../store/todoReducer';
import {useDispatch, useSelector} from "react-redux";

import styles from './tasks.module.scss'
import cn from 'classnames'
import {TasksTags} from "./TasksHeader/TasksTags";
import {TaskSearch} from "./TasksHeader/TaskSearch";
import {TasksBottom} from "./TasksBottom/TasksBottom";
import {TaskTile} from "./TaskTile";

// const tags = [
//     "ДЗ",
//     "Деканат",
//     "Практика",
//     "Курсовая",
//     "Важно"
// ]

export const Tasks = () => {

    const [tags, setTags] = useState([])
    const [selectedFile, setSelectedFile] = useState(null)
    const [isSearchVisible, setIsSearchVisible] = useState(false)
    const [searchText, setSearchText] = useState('')

    const dispatch = useDispatch()
    const todos = useSelector(state => state.todo.todos)
    const searchResult = useSelector(state => state.todo.searchResult)
    const [currentTag, setCurrentTag] = useState('')

    useEffect(() => {
        const storedTodos = getTodosFromLocalStorage();

        if (storedTodos !== null && storedTodos.length > 0) {
            // Используем тип действия INITIALIZE_TODOS для передачи сохраненных данных
            dispatch({type: INITIALIZE_TODOS, payload: storedTodos});

            search()
        }
    }, [dispatch]);

    useEffect(() => {
        let _tags = [];
        if (todos) {
            todos.forEach(todo => {
                todo.tags.forEach(_tag => {
                    const formattedTag = _tag.charAt(0).toUpperCase() + _tag.slice(1);
                    if (!_tags.includes(formattedTag)) {
                        _tags.push(formattedTag);
                    }
                });
            });
        }
        setTags(_tags);
        if (currentTag) {
            searchByTag(currentTag);
        } else {
            search();
        }
    }, [todos]);


    const search = () => {
        if (searchText.trim() === '') {
            dispatch(clearSearch()); // Вызываем clearSearch, если поле поиска пустое
        } else {
            dispatch(searchTodo(searchText));
        }
    }

    const searchByTag = (tag) => {
        if (tag.trim() === '' || tag.trim() === 'Все') {
            dispatch(clearSearch()); // Вызываем clearSearch, если поле поиска пустое
        } else {
            dispatch(searchTodoByTag(tag));
        }
        setCurrentTag(tag)
    }

    return (
        <>
            <div className={styles.app}>
                <div className={styles.header}>
                    <h2>Мои задачи</h2>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"
                         onClick={() => setIsSearchVisible(!isSearchVisible)}>
                        <path
                            d="M12.9706 13.072L17 17M15.2269 7.95238C15.2269 11.7921 12.0421 14.9048 8.11343 14.9048C4.18479 14.9048 1 11.7921 1 7.95238C1 4.11268 4.18479 1 8.11343 1C12.0421 1 15.2269 4.11268 15.2269 7.95238Z"
                            stroke="#9C9D9F" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                </div>
                {isSearchVisible && <TaskSearch setParentText={setSearchText} enter={search}/>}
                <TasksTags tagsList={tags} setSelectedTag={searchByTag}/>

                <div className={styles.todo_list}>
                    <>
                        {searchResult ?
                            <>
                                {searchResult.length > 0 ?
                                    <>
                                        {searchResult.map((todo) => <TaskTile todo={todo}/>)}
                                    </>
                                    :
                                    <h5 style={{textAlign: 'center', marginTop: '4rem'}}>
                                        Задач с заданной меткой не существует
                                    </h5>
                                }

                            </>
                            :
                            <>
                                {todos.map((todo) => <TaskTile todo={todo}/>)}
                            </>
                        }
                    </>


                </div>

                <TasksBottom tagsList={tags}/>
            </div>
        </>
    )
}