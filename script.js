

let x0_slider = document.getElementById("x0Slider");
let x0 = x0_slider.value; // initial value
let x0ValueSpan = document.getElementById("x0Value");
x0ValueSpan.innerText = x0;
x0_slider.addEventListener("input", function () {
    x0 = x0_slider.value; // update variable with slider value
    x0ValueSpan.innerText = x0; // update label with slider value
});
var r = 3.5; // Startwert für r
var n = 100; // Anzahl der Iterationen


const chartContainer = document.getElementById('logisticDiagrammDiv');
const resizeHandle = document.getElementById('resize-handle');
let isResizing = false;
resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
});

document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    chartContainer.style.backgroundColor = "gray"
    chartContainer.style.width = e.pageX - chartContainer.offsetLeft + 'px';
    chartContainer.style.height = e.pageY - chartContainer.offsetTop + 'px';
});

document.addEventListener('mouseup', (e) => {
    isResizing = false;
    chartContainer.style.backgroundColor = "white"
});


let fullDivBifurcation = document.getElementById("bifurcationDiagrammDiv");
let officialHiddenBifurcation = true;

let chartmax = 30;
let chartmin = 0;
const chartContainer2 = document.getElementById('bifurcationDiv');
const resizeHandle2 = document.getElementById('resize-handle2');
let bifurcationChart = document.getElementById('bifurcationChart');
let isResizing2 = false;
resizeHandle2.addEventListener('mousedown', (e) => {
    isResizing2 = true;
});

document.addEventListener('mousemove', (e) => {
    if (!isResizing2) return;
    chartContainer2.style.backgroundColor = "gray"
    chartContainer2.style.width = e.pageX - chartContainer2.offsetLeft + 'px';
    chartContainer2.style.height = e.pageY - chartContainer2.offsetTop + 'px';
});

document.addEventListener('mouseup', (e) => {
    isResizing2 = false;
    chartContainer2.style.backgroundColor = "white";
});



var ctx = document.getElementById('myChart').getContext('2d');

var chart;
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'x_n',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                fill: false
            }]
        },
        options: {
            animation: {
                duration: 0.2 // Animationsdauer auf 0 setzen
            },
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Logistische Gleichung'
                }
            },
            scales: {
                x: {
                    display: true,
                    min: chartmin,
                    max: chartmax,
                    title: {
                        display: true,
                        text: 'n'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'x_n'
                    },
                    min: 0, // setzen Sie die minimale Skalenposition auf 0
                    max: 1.3 // setzen Sie die maximale Skalenposition auf 1.3
                }
            }
        }
    });
makeChart();
function makeChart() {
    chart.options.scales.x.min = chartmin;
    chart.options.scales.x.max = chartmax;
}

function updateChart() {
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    var x = x0;
    for (var i = 0; i < n; i++) {
        chart.data.labels.push(i);
        chart.data.datasets[0].data.push(x);
        x = r * x * (1 - x);
    }


    var rMin = 0;
    var rMax = parseFloat(document.getElementById('rSlider').value);
    //var rStep = parseFloat(document.getElementById('rStep').value);
    if (x0 > 0 && x0 < 1 && !officialHiddenBifurcation) {
        fullDivBifurcation.style.display = "block";
        drawLogisticMapBifurcationDiagram(0, rMax, "bifurcationChart");
    } else {
        fullDivBifurcation.style.display = "none";
    }

    chart.update();
}

function animateChart() {
    var rSlider = document.getElementById('rSlider');
    var rValue = document.getElementById('rValue');
    r = rSlider.value;
    rValue.innerHTML = rSlider.value;
    updateChart();
    requestAnimationFrame(animateChart);
}

animateChart();










function drawLogisticMapBifurcationDiagram(startR, endR, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");

    //const width = 500; // increase width to 1200
    //const height = 300; // increase height to 800
    //canvas.width = height/2;
    height = canvas.height;
    width = canvas.width;
    //width = canvas.width;
    function logisticMap(r, p, n) {
        for (let i = 0; i < n; i++) {
            p = r * p * (1 - p);
        }
        return p;
    }

    // Initialize the pixel buffer
    const imageData = ctx.createImageData(width, height);
    const pixelBuffer = new Uint8ClampedArray(imageData.data.buffer);

    // Iterate over r values and calculate the bifurcation points
    for (let r = startR; r <= endR; r += 0.01) {
        let p = 0.5;
        for (let i = 0; i < 1000; i++) {
            p = logisticMap(r, p, 1);
            if (i > 500) {
                const xPixel = Math.floor((r - startR) / (endR - startR) * width);
                const yPixel = Math.floor((1 - p) * height);
                const pixelIndex = (yPixel * width + xPixel) * 4;
                pixelBuffer[pixelIndex] = 0; // Set the color of the pixel
                pixelBuffer[pixelIndex + 1] = 0;
                pixelBuffer[pixelIndex + 2] = 0;
                pixelBuffer[pixelIndex + 3] = 255; // Set the alpha value of the pixel
            }
        }
    }

    // Draw the pixel buffer to the canvas
    ctx.putImageData(imageData, 0, 0);

    // Draw the x-axis
    const xAxisY = Math.floor((1 - 0) * height);
    ctx.beginPath();
    ctx.moveTo(0, xAxisY);
    ctx.lineTo(width, xAxisY);
    ctx.stroke();

    // Draw the y-axis
    const yAxisX = Math.floor((0 - startR) / (endR - startR) * width);
    ctx.beginPath();
    ctx.moveTo(yAxisX, 0);
    ctx.lineTo(yAxisX, height);
    ctx.stroke();

    // Add tick marks and labels to the y-axis
    ctx.font = "12px Arial";
    ctx.fillStyle = "#000";
    ctx.textAlign = "right";
    for (let y = 0.1; y <= 1; y += 0.1) {
        const yPixel = Math.floor((1 - y) * height);
        const tickLength = 3;
        const tickXStart = 6;
        const tickYStart = yPixel;
        const tickXEnd = yAxisX;
        const tickYEnd = yPixel;
        ctx.beginPath();
        ctx.moveTo(tickXStart, tickYStart);
        ctx.lineTo(tickXEnd, tickYEnd);
        ctx.stroke();
        ctx.font = "12px Arial";
        ctx.fillText("P", 20, 10);
        ctx.font = "10px Arial";
        ctx.fillText("0.2", 24, 123);
        ctx.fillText("0.6", 24, 63);
        //ctx.fillText(y.toFixed(1), labelX, labelY);
    }
    // Add tick marks and labels to the x-axis
    ctx.textAlign = "center";
    for (let x = 0; x <= endR - startR; x += 0.2) {
        const xPixel = Math.floor((x / (endR - startR)) * width);
        const tickLength = 5;
        const tickXStart = xPixel;
        const tickYStart = xAxisY - tickLength;
        const tickXEnd = xPixel;
        const tickYEnd = xAxisY;
        const labelX = xPixel;
        const labelY = xAxisY + 15;
        ctx.beginPath();
        ctx.moveTo(tickXStart, tickYStart);
        ctx.lineTo(tickXEnd, tickYEnd);
        ctx.stroke();

        //ctx.fillText("0.2", 24,123);
        //ctx.fillText((x + startR).toFixed(1), labelX, labelY);
    }

    // Add tick marks and labels to the x-axis
    ctx.textAlign = "center";


    /*
    // Add tick marks and labels to the y-axis
    ctx.textAlign = "right";
    for (let y = 0.1; y <= 1; y += 0.1) {
        const yPixel = Math.floor((1 - y) * height);
        const xStartPixel = Math.floor(0.97 * width);
        const xEndPixel = Math.floor(1.03 * width);

        const yValue = y.toFixed(1);
        ctx.fillText(`${yValue}`, xStartPixel - 300, yPixel + 0);
    }*/
}






document.addEventListener("keydown", function (event) {
    if (event.key === "s") {
        if (window.getComputedStyle(fullDivBifurcation).getPropertyValue("display") === "none") {
            fullDivBifurcation.style.display = "block";
            officialHiddenBifurcation = false; // ...
        } else {
            fullDivBifurcation.style.display = "none";
            officialHiddenBifurcation = true;
        }
    } else if (event.key === "m") {
        if (chartmax === 30) {
            chartmin = 100 - 35;
            chartmax = 100;
        } else {
            chartmin = 0;
            chartmax = 30;
        }
        makeChart();
    }
});
