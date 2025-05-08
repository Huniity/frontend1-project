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
            const searchText = document.getElementById("search-input").value.toLowerCase();
            const selectedDate = document.getElementById("calendar-widget").value;


            const filtered = todos.filter(todo => {
                const matchesSearch = todo.title.toLowerCase().includes(searchText) || todo.desc.toLowerCase().includes(searchText);
                const matchesDate = selectedDate ? new Date(todo.due_date).toISOString().split('T')[0] === selectedDate : true;
                return matchesSearch && matchesDate;
            });

            todoList.innerHTML = "";
            renderDashboard(todos);

            filtered.forEach((todo) => {
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
                            <p><strong>Due:</strong> ${formatDate(todo.due_date)}</p>
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
        } catch (error) {
            console.error("Error rendering todos:", error);
        }
    };
    // Contar tarefas e fazer render em %
    const renderDashboard = (todos) => {
        const recapContainer = document.getElementById("category-recap");
        recapContainer.innerHTML = "";

        const categoryMap = {};

        const totalTasks = todos.length;
        const completedTasks = todos.filter(t => t.is_done).length;
        const categories = [...new Set(todos.map(t => t.category))].length;
    
        animateCounter("total-tasks", totalTasks);
        animateCounter("completed-tasks", completedTasks);
        animateCounter("total-categories", categories);
    

        todos.forEach(todo => {
            if (!categoryMap[todo.category]) {
                categoryMap[todo.category] = { total: 0, done: 0 };
            }
            categoryMap[todo.category].total++;
            if (todo.is_done) categoryMap[todo.category].done++;
        });

        Object.entries(categoryMap).forEach(([category, stats]) => {
            const percent = Math.round((stats.done / stats.total) * 100);
            const card = document.createElement("div");
            card.className = "recap-card";
            card.innerHTML = `
                <h4>${category}</h4>
                <p>${percent}% Completed</p>
            `;
            recapContainer.appendChild(card);
        });
    };

    document.getElementById("search-input").addEventListener("input", renderTodos);
    document.getElementById("calendar-widget").addEventListener("change", renderTodos);
    document.getElementById("resetButton").addEventListener("click", () => {
        document.getElementById("search-input").value = "";
        document.getElementById("calendar-widget").value = "";
        renderTodos();
    });

    closeModalBtn.addEventListener("click", () => {
        editModal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === editModal) {
            editModal.style.display = "none";
        }
    });

    const handleDeleteTodo = async (e) => {
        const todoId = e.target.dataset.id;

        const isConfirmed = await showConfirmation(
            "Wanna Delete this task?",
            "Deleting is permanent. Are you Sure?",
            "Yes, delete it!",
            "No, keep it"
        );

        if (isConfirmed) {
            try {
                await deleteTodo(todoId);
                renderTodos();
                showToast("success", "Todo deleted successfully!");
            } catch (error) {
                console.error("Error deleting todo:", error);
                showToast("error", "Failed to delete todo.");
            }
        } else {
            showToast("info", "Todo deletion canceled.");
        }
    };

    if (form) {
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
                showToast("success", "Todo created successfully!");
            } catch (error) {
                console.error("Error creating todo:", error);
                showToast("error", "Failed to create todo.");
            }
        });
    }

    const handleEditTodo = async (e) => {
        const todoId = e.target.dataset.id;

        try {
            const todo = await getTodoById(todoId);

            editTitleInput.value = todo.title;
            editDescInput.value = todo.desc;
            editCategoryInput.value = todo.category;
            editPriorityInput.value = todo.priority;
            editDueDateInput.value = todo.due_date;

            editModal.style.display = "block";

            editForm.onsubmit = async (event) => {
                event.preventDefault();

                const updatedTodo = {
                    ...todo,
                    title: editTitleInput.value,
                    desc: editDescInput.value,
                    category: editCategoryInput.value,
                    priority: editPriorityInput.value,
                    due_date: editDueDateInput.value,
                };

                try {
                    await editTodo(todoId, updatedTodo);
                    editModal.style.display = "none";
                    renderTodos();
                    showToast("success", "Todo updated successfully!");
                } catch (error) {
                    console.error("Error updating todo:", error);
                    showToast("error", "Failed to update todo.");
                }
            };
        } catch (error) {
            console.error("Error fetching todo for editing:", error);
        }
    };

    const handleDoneTodo = async (e) => {
        const todoId = e.target.dataset.id;

        try {
            const todo = await getTodoById(todoId);

            const updatedTodo = {
                ...todo,
                is_done: !todo.is_done,
            };

            await editTodo(todoId, updatedTodo);
            renderTodos();

            if (updatedTodo.is_done) {
                showToast("success", "Task marked as completed!");
            } else {
                showToast("info", "Task marked as pending.");
            }
        } catch (error) {
            console.error("Error updating todo status:", error);
            showToast("error", "Failed to update task status.");
        }
    };

    todoList.addEventListener("click", (e) => {
        const target = e.target;

        if (target.classList.contains("done_btn")) {
            handleDoneTodo(e);
        }

        if (target.classList.contains("edit_btn")) {
            handleEditTodo(e);
        }

        if (target.classList.contains("delete_btn")) {
            handleDeleteTodo(e);
        }
    });

    renderTodos();
});
function animateCounter(id, target) {
    const el = document.getElementById(id);
    let count = 0;
    const increment = target / 60; // smooth speed

    const update = () => {
        count += increment;
        if (count < target) {
            el.textContent = Math.ceil(count);
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    };

    requestAnimationFrame(update);
}

const showToast = (icon, title) => {
    const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        },
    });

    Toast.fire({
        icon: icon,
        title: title,
        background: "#b0b0b0",
        color: "#000000",
        width: "500px",
    });
};

const showConfirmation = async (title, text, confirmButtonText = "Yes", cancelButtonText = "No") => {
    const result = await Swal.fire({
        title: title,
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        background: "#b0b0b0",
        color: "#000000",
    });

    return result.isConfirmed; // Returns true if the user clicks "Yes"
};