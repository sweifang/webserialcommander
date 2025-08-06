$(document).ready(async function () {
    // --- DOM Elements ---
    const connectDisconnectBtn = $('#connect-disconnect-btn');
    const portSelect = $('#port-select');
    const refreshBtn = $('#refresh-btn');
    const baudRateSelect = $('#baud-rate-select');
    const connectionStatus = $('#connection-status');
    const terminal = $('#terminal');
    const setBrightnessBtn = $('#set-brightness-btn');
    const brightnessValue = $('#brightness-value');
    const lightSwitch = $('#light-switch');
    const lightSwitchValue = $('#light-switch-value');
    const blinkSpeedSlider = $('#blink-speed-slider');
    const blinkSpeedValue = $('#blink-speed-value');

    // --- State Variables ---
    let port;
    let writer;
    let reader;
    let sequence = 1;
    // --- Google Chart State ---
    let googleChart;
    let googleChartData;
    let googleChartOptions;


    // --- Check for Web Serial API support ---
    if (!("serial" in navigator)) {
        alert("Web Serial API not supported in this browser.");
        return;
    }

    // --- Connection Management ---
    async function initialPortSetup() {
        const ports = await navigator.serial.getPorts();
        populatePortList(ports);
        if (ports.length > 0) {
            portSelect.val(ports.length - 1).change();
        } else {
            refreshBtn.addClass('btn-glow');
        }
    }

    function populatePortList(ports) {
        portSelect.empty();
        if (ports.length === 0) {
            portSelect.append('<option selected>點右側更新鈕配對連接埠</option>');
            return;
        }
        ports.forEach((port, i) => {
            const portInfo = port.getInfo();
            const details = [];
            if (portInfo.usbVendorId) details.push(`USB VID:${portInfo.usbVendorId}`);
            if (portInfo.usbProductId) details.push(`PID:${portInfo.usbProductId}`);
            let portLabel = `Port ${i}`;
            if (details.length > 0) portLabel += `: ${details.join(' ')}`;
            portSelect.append(`<option value="${i}">${portLabel}</option>`);
        });
    }

    refreshBtn.on('click', async () => {
        try {
            await navigator.serial.requestPort();
            const ports = await navigator.serial.getPorts();
            populatePortList(ports);
            if (ports.length > 0) {
                portSelect.val(ports.length - 1).change();
                refreshBtn.removeClass('btn-glow');
            }
        } catch (err) {
            console.error("Error requesting port:", err);
        }
    });

    connectDisconnectBtn.on('click', async () => {
        if (port) {
            // Disconnect
            try {
                await reader.cancel();
                await writer.close();
                await port.close();
                port = null;
                writer = null;
                reader = null;
                connectionStatus.removeClass('on');
                connectDisconnectBtn.find('i').removeClass('fa-solid fa-plug-circle-xmark').addClass('fa-plug');
                portSelect.prop('disabled', false);
                baudRateSelect.prop('disabled', false);
            } catch (err) {
                console.error("Error disconnecting:", err);
            }
        } else {
            // Connect
            try {
                const selectedPortIndex = portSelect.val();
                if (selectedPortIndex === null || selectedPortIndex === "點右側更新鈕配對連接埠") {
                    alert("Please select a port.");
                    return;
                }
                const ports = await navigator.serial.getPorts();
                port = ports[selectedPortIndex];
                const baudRate = parseInt(baudRateSelect.val(), 10);
                await port.open({ baudRate });

                writer = port.writable.getWriter();
                reader = port.readable.getReader();

                connectionStatus.addClass('on');
                connectDisconnectBtn.find('i').removeClass('fa-plug').addClass('fa-solid fa-plug-circle-xmark');
                portSelect.prop('disabled', true);
                baudRateSelect.prop('disabled', true);

                readLoop();
            } catch (err) {
                console.error("Error connecting:", err);
                port = null;
            }
        }
    });

    // --- Data Handling ---
    async function readLoop() {
        const decoder = new TextDecoder();
        let buffer = '';
        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    reader.releaseLock();
                    break;
                }
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Keep the last, possibly incomplete, line

                lines.forEach(line => {
                    if (line.trim() === '') return;
                    // Always append to terminal first
                    terminal.append(line + '\n');

                    try {
                        const jsonData = JSON.parse(line);
                        if (jsonData.name && jsonData.value !== undefined) {
                            // If it's chart data, also update the chart
                            updateChart(jsonData.name, jsonData.value);
                        }
                    } catch (e) {
                        // Not JSON, so it has already been handled by the terminal append above
                    }
                });
                terminal.scrollTop(terminal[0].scrollHeight);
            }
        } catch (error) {
            console.error("Read error:", error);
        }
    }

    async function sendSerialData(jsonData) {
        if (writer) {
            const dataString = JSON.stringify(jsonData);
            const encoder = new TextEncoder();
            await writer.write(encoder.encode(dataString + '\n'));
            console.log(`Sent: ${dataString}`);
        } else {
            console.log("Not connected.");
        }
    }

    // --- Charting ---
    function initChart() {
        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawStaticChart);
    }

    function drawStaticChart() {
        googleChartData = new google.visualization.DataTable();
        googleChartData.addColumn('number', 'X');
        googleChartData.addColumn('number', 'Live Data'); // Set a default legend label
        // Start with an empty chart

        googleChartOptions = {
            width: 560, height: 220,
            backgroundColor: '#3a3b40',
            titleTextStyle: { color: '#fff', fontSize: 14 },
            hAxis: { textStyle: { color: '#fff' }, gridlines: { color: 'transparent' }, baselineColor: '#888' },
            vAxis: { textStyle: { color: '#fff' }, gridlines: { color: '#444' }, baselineColor: '#888' },
            legend: { position: 'top', textStyle: { color: '#fff', fontSize: 14 }, alignment: 'center' },
            chartArea: { width: '80%', height: '70%' }
        };

        googleChart = new google.visualization.LineChart(document.getElementById('chart'));
        googleChart.draw(googleChartData, googleChartOptions);
        console.log("Live Google Chart initialized successfully.");
    }

    function updateChart(name, value) {
        if (!googleChart || !googleChartData) return;

        // Update the legend by changing the column label
        googleChartData.setColumnLabel(1, name);

        // Add new data point
        googleChartData.addRow([sequence++, parseFloat(value)]);

        // Remove old data point if we have more than 5
        if (googleChartData.getNumberOfRows() > 5) {
            googleChartData.removeRow(0);
        }

        // Redraw the chart
        googleChart.draw(googleChartData, googleChartOptions);
    }

    // --- UI Event Listeners ---
    setBrightnessBtn.on('click', () => {
        const value = brightnessValue.val();
        sendSerialData({ widget: 'button', value: value });
    });

    lightSwitch.on('change', function() {
        const value = this.checked ? 'ON' : 'OFF';
        lightSwitchValue.text(value);
        /* if (this.checked) {
            lightSwitchValue.removeClass('bg-secondary').addClass('bg-success');
        } else {
            lightSwitchValue.removeClass('bg-success').addClass('bg-secondary');
        } */
        sendSerialData({ widget: 'switch', value: value });
    });

    blinkSpeedSlider.on('input', function() {
        const value = $(this).val();
        blinkSpeedValue.text(value);
        sendSerialData({ widget: 'slider', value: value });
    });

    // --- Initial Setup ---
    await initialPortSetup();
    initChart();
});
