document.addEventListener("DOMContentLoaded", () => {
    const calendarWidget = document.getElementById("calendar-widget");
    const currentMonthEl = document.getElementById("current-month");
    const calendarDatesEl = document.getElementById("calendar-dates");
    const prevMonthBtn = document.getElementById("prev-month");
    const nextMonthBtn = document.getElementById("next-month");

    let currentDate = new Date();

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();


        currentMonthEl.textContent = currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });


        calendarDatesEl.innerHTML = "";


        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();


        for (let i = 0; i < firstDay; i++) {
            const emptySlot = document.createElement("div");
            calendarDatesEl.appendChild(emptySlot);
        }


        for (let date = 1; date <= lastDate; date++) {
            const dateEl = document.createElement("div");
            dateEl.className = "date";
            dateEl.textContent = date;


            const today = new Date();
            if (
                date === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
            ) {
                dateEl.classList.add("selected");
            }


            dateEl.addEventListener("click", () => {
                document.querySelectorAll(".date").forEach((el) =>
                    el.classList.remove("selected")
                );
                dateEl.classList.add("selected");
                const selectedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;


document.getElementById("calendar-widget").value = selectedDate;

const event = new Event("change");
document.getElementById("calendar-widget").dispatchEvent(event);

            });

            calendarDatesEl.appendChild(dateEl);
        }
    };


    prevMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });


    nextMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();
});
