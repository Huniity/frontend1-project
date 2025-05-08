import { createTodo } from "../lib/mock_api.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#todo_form");

    const showToast = (icon, title) => {
        const Toast = Swal.mixin({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 2000,
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
                showToast("success", "Todo created successfully!");
                form.reset();
                setTimeout(function(){
                    window.location.href = "./index.html";
                 }, 2000); // Redirect to the task list page
            } catch (error) {
                console.error("Error creating todo:", error);
                showToast("error", "Failed to create todo. Please try again.");
            }
        });
    }
});