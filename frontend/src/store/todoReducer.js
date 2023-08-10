// Action Types
export const ADD_TODO = 'ADD_TODO'
export const TOGGLE_TODO = 'TOGGLE_TODO'
export const DELETE_TODO = 'DELETE_TODO'
export const ADD_PHOTO = 'ADD_PHOTO'
export const INITIALIZE_TODOS = 'INITIALIZE_TODOS'
export const SEARCH_TODO = 'SEARCH_TODO'
export const SEARCH_TODO_BY_TAG = 'SEARCH_TODO_BY_TAG'
export const SET_ORIGINAL_TODOS = 'SET_ORIGINAL_TODOS'
export const CLEAR_SEARCH = 'CLEAR_SEARCH'

// Action Creators
export const addTodo = (text) => ({
    type: ADD_TODO,
    payload: text,
});

export const toggleTodo = (id) => ({
    type: TOGGLE_TODO,
    payload: id,
});

export const deleteTodo = (id) => ({
    type: DELETE_TODO,
    payload: id,
});

export const addPhoto = (id, photo) => ({
    type: ADD_PHOTO,
    payload: { id, photo },
});
export const searchTodo = (searchText) => ({
    type: SEARCH_TODO,
    payload: searchText,
});

export const searchTodoByTag = (searchText) => ({
    type: SEARCH_TODO_BY_TAG,
    payload: searchText,
});

export const clearSearch = () => ({
    type: CLEAR_SEARCH,
});

const initialState = {
    todos: [],
    searchResult: []
};

export const TASK_STATUSES = {
    TO_DO: 'TO_DO',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED'
}

const todoReducer = (state = initialState, action) => {
    let newState;

    switch (action.type) {
        case ADD_TODO:
            newState = {
                ...state,
                todos: [
                    ...state.todos,
                    {
                        id: Date.now(),
                        text: action.payload?.text,
                        description: action.payload?.description || '',
                        status: action.payload?.status || TASK_STATUSES.TO_DO,
                        created: Date.now(),
                        images: [],
                        userName: 'admin',
                        date: action.payload?.date,
                        start: action.payload?.start,
                        end: action.payload?.end,
                        tags: action.payload?.tags || [],
                        photo: action.payload?.photo,
                        acceptedUsers: ['admin'],
                        groups: ['ВИБ31']
                    },
                ]
            };
            saveTodosToLocalStorage(newState.todos);
            return newState;

        case TOGGLE_TODO:
            newState = {
                ...state,
                todos: state.todos.map((todo) =>
                    todo.id === action.payload.id
                        ? { ...todo, status: action.payload.status }
                        : todo
                )
            };
            saveTodosToLocalStorage(newState.todos);
            return newState;

        case DELETE_TODO:
            newState = {
                ...state,
                todos: state.todos.filter((todo) => todo.id !== action.payload)
            };
            saveTodosToLocalStorage(newState.todos);
            return newState;

        case ADD_PHOTO:
            newState = {
                ...state,
                todos: state.todos.map((todo) =>
                    todo.id === action.payload.id
                        ? { ...todo, photo: action.payload.photo }
                        : todo
                )
            };
            saveTodosToLocalStorage(newState.todos);
            return newState;

        case INITIALIZE_TODOS:
            return { ...state, todos: action.payload };

        case SET_ORIGINAL_TODOS:
            return { ...state, originalTodos: action.payload };

        case SEARCH_TODO:
            const searchText = action.payload.toLowerCase();

            if (searchText.trim() === '') {
                // If the search text is empty, return the original todos
                return { ...state, searchResult: null };
            } else {
                // Perform the search if the search text is not empty
                const searchResult = state.todos.filter(
                    (todo) =>
                        todo.text.toLowerCase().includes(searchText) ||
                        todo.description.toLowerCase().includes(searchText)
                );

                return { ...state, searchResult };
            }

        case SEARCH_TODO_BY_TAG:
            const searchTag = action.payload.toLowerCase();

            if (searchTag.trim() === '' || searchTag.trim() === 'Все') {
                // If the search text is empty, return the original todos
                return { ...state, searchResult: null };
            } else {
                // Perform the search if the search text is not empty
                const searchResult = state.todos.filter(
                    (todo) =>
                        todo.tags.some((tag) => tag.toLowerCase().includes(searchTag)) // Check if any tag includes the search tag
                );

                return { ...state, searchResult };
            }

        case CLEAR_SEARCH:
            return { ...state, searchResult: null };

        default:
            return state;
    }
};

export default todoReducer;

export const getTodosFromLocalStorage = () => {
    try {
        const serializedTodos = localStorage.getItem('todos');
        return serializedTodos ? JSON.parse(serializedTodos) : null;
    } catch (error) {
        // Обработка ошибки, если не удалось извлечь данные
        console.error('Error getting todos from localStorage:', error);
        return null;
    }
};

export const saveTodosToLocalStorage = (todos) => {
    try {
        const serializedTodos = JSON.stringify(todos);
        localStorage.setItem('todos', serializedTodos);
    } catch (error) {
        // Обработка ошибки, если не удалось сохранить данные
        console.error('Error saving todos to localStorage:', error);
    }
};
