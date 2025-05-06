const apiURL = "https://67f56836913986b16fa476aa.mockapi.io/api/";

export const getTodo = async () => {
    const response = await fetch(apiURL + "todos");
    const data = await response.json();
    return data
};
export const getTodoById = async (id) => {
    const response = await fetch(`${apiURL}todos/${id}`);
    return await response.json();
};
export const createTodo = async (postData) => {
    const response = await fetch(apiURL + "todos", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    });
    return await response.json();
};

export const editTodo = async (id, updatedData) => {
    const response = await fetch(apiURL + `todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
    });
    return await response.json();
};

export const deleteTodo = async (id) => {
    const response = await fetch(apiURL + `todos/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return await response.json();
};