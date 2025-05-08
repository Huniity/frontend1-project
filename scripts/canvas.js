document.addEventListener("DOMContentLoaded", () => {
    const testCanvas = document.getElementById("canva_circle");
    const testCtx = testCanvas.getContext("2d");


    testCtx.beginPath();
    testCtx.arc(128, 12, 12, 0, Math.PI * 2);
    testCtx.fillStyle = "black";
    testCtx.fill();

    testCtx.beginPath();
    testCtx.arc(158, 12, 12, 0, Math.PI * 2);
    testCtx.fillStyle = "black";
    testCtx.fill();

    testCtx.beginPath();
    testCtx.arc(188, 12, 12, 0, Math.PI * 2);
    testCtx.fillStyle = "black";
    testCtx.fill();

    testCtx.beginPath();
    testCtx.arc(128, 12, 10, 0, Math.PI * 2);
    testCtx.fillStyle = "#fb4242";
    testCtx.fill();

    testCtx.beginPath();
    testCtx.arc(158, 12, 10, 0, Math.PI * 2);
    testCtx.fillStyle = "#fabf14";
    testCtx.fill();

    testCtx.beginPath();
    testCtx.arc(188, 12, 10, 0, Math.PI * 2);
    testCtx.fillStyle = "#54dd36";
    testCtx.fill();
});