document.addEventListener("DOMContentLoaded", () => {
    const datetimeContainer = document.getElementById("datetime_title");
    
    const d = new Date();
    document.getElementById("copyright_year").innerHTML = d.getFullYear();
    const updateDateTime = () => {
        const now = new Date();

        // Format the date and time
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const seconds = now.getSeconds().toString().padStart(2, "0");
        const day = now.getDate().toString().padStart(2, "0");
        const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
        const year = now.getFullYear();
        const gmt = now.toTimeString().split(" ")[1]; // Extract GMT offset

        // Update the container with the formatted date and time
        datetimeContainer.innerHTML = `
            <p>${day}/${month}/${year} | ${hours}:${minutes}:${seconds} - ${gmt}</p>
        `;
    };

    // Update the date and time every second
    setInterval(updateDateTime, 1000);

    // Initialize the date and time immediately
    updateDateTime();
});