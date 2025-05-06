import { createTodo, getTodo, editTodo, deleteTodo, getTodoById } from "../lib/mock_api.js";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
};

document.addEventListener("DOMContentLoaded", async () => {
    const todoList = document.querySelector("#todo_list");
    const form = document.querySelector("#todo_form");

    const editModal = document.getElementById("editModal");
    const closeModalBtn = document.querySelector(".close-btn");
    const editForm = document.getElementById("edit_form");
    const editTitleInput = document.getElementById("edit-title");
    const editDescInput = document.getElementById("edit-desc");
    const editCategoryInput = document.getElementById("edit-category");
    const editPriorityInput = document.getElementById("edit-priority");
    const editDueDateInput = document.getElementById("edit-due-date");

    const renderTodos = async () => {
        try {
            const todos = await getTodo();
            todoList.innerHTML = "";
            todos.forEach((todo) => {
                const card = document.createElement("div");
                card.className = "todo_card";
                card.innerHTML = `
                    <div class="card">
                        <div class="card-header">
                            <h3>${todo.title}</h3>
                            <span class="category">${todo.category}</span>
                        </div>
                        <hr>
                        <div class="card-body">
                            <p>${todo.desc}</p>
                            <p><strong>Priority:</strong> ${todo.priority}</p>
                            <p><strong>Created:</strong> ${formatDate(todo.createdAt)}</p>
                            <p><strong>Status:</strong> ${todo.is_done ? "Completed" : "Pending"}</p>
                        </div>
                        <div class="card-footer">
                            <button class="done_btn ${todo.is_done ? 'completed' : 'pending'}" data-id="${todo.id}">${todo.is_done ? "Complete" : "Pending"}</button>
                            <button class="edit_btn" data-id="${todo.id}">Edit</button>
                            <button class="delete_btn" data-id="${todo.id}">Delete</button>
                        </div>
                    </div>
                `;
                todoList.appendChild(card);
            });

            document.querySelectorAll(".done_btn").forEach((button) => {
                button.addEventListener("click", handleDoneTodo);
            });

            document.querySelectorAll(".edit_btn").forEach((button) => {
                button.addEventListener("click", handleEditTodo);
            });

            document.querySelectorAll(".delete_btn").forEach((button) => {
                button.addEventListener("click", handleDeleteTodo);
            });
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };
    const handleDoneTodo = async (e) => {
        const todoId = e.target.dataset.id;
        const todo = await getTodoById(todoId);
        const updatedData = {
            ...todo,
            is_done: !todo.is_done,
        };
        try {
            await editTodo(todoId, updatedData);
            renderTodos();
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    }
    const handleEditTodo = async (e) => {
        const todoId = e.target.dataset.id; // Get the ID of the todo to edit
        const todo = await getTodoById(todoId); // Fetch the specific todo

        // Populate the modal form with the todo's current data
        editTitleInput.value = todo.title;
        editDescInput.value = todo.desc;
        editCategoryInput.value = todo.category;
        editPriorityInput.value = todo.priority;
        editDueDateInput.value = todo.due_date;

        // Show the modal
        editModal.style.display = "block";

        // Update the form submission to handle editing
        editForm.onsubmit = async (e) => {
            e.preventDefault();

            const updatedData = {
                title: editTitleInput.value,
                desc: editDescInput.value,
                category: editCategoryInput.value,
                priority: editPriorityInput.value,
                due_date: editDueDateInput.value,
            };

            try {
                await editTodo(todoId, updatedData); // Call the API to update the todo
                editModal.style.display = "none"; // Close the modal
                renderTodos(); // Re-render the todos
            } catch (error) {
                console.error("Error editing todo:", error);
            }
        };
    };

    // Close the modal when the close button is clicked
    closeModalBtn.addEventListener("click", () => {
        editModal.style.display = "none";
    });

    // Close the modal when clicking outside the modal content
    window.addEventListener("click", (e) => {
        if (e.target === editModal) {
            editModal.style.display = "none";
        }
    });

    const handleDeleteTodo = async (e) => {
        const todoId = e.target.dataset.id;

        if (confirm("Are you sure you want to delete this todo?")) {
            try {
                await deleteTodo(todoId);
                renderTodos();
            } catch (error) {
                console.error("Error deleting todo:", error);
            }
        }
    };

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const postData = {
            id: Date.now().toString(),
            title: document.getElementById("todo-title").value,
            desc: document.getElementById("todo-match").value,
            category: document.getElementById("todo-category").value,
            priority: document.getElementById("todo-priority").value,
            is_done: false,
            createdAt: new Date().toISOString(),
            due_date: document.getElementById("todo-due").value,
        };

        try {
            await createTodo(postData);
            form.reset();
            renderTodos();
        } catch (error) {
            console.error("Error creating todo:", error);
        }
    });

    renderTodos();
});