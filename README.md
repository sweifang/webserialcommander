# Web Serial Commander
Web Serial Commander is a web-based, cross-platform application that provides a UI to control and monitor target devices over serial (i.e., UART) communication.
<img src="https://raw.githubusercontent.com/sweifang/webserialcommander/refs/heads/main/assets/WebSerialCommander.JPG?raw=true" alt="add_participant" width="500">

### 1. How to use
Download the repository to your device with a web browser (e.g., PC or laptop). Launch the application by opening `index.html`.

### 2. Connect device via serial port
- Connect the target device and computer with a USB cable. A COM port should be identified by the computer.
- Click the `Refresh` button, select the COM port of the target device. Click `Connect` to authorize the application's access to the COM port.
- The authorized COM port should be listed in the drop-down menu with the USB device's PID and VID. Select the COM port and baud rate, and click the `Connect` button to establish a serial connection.
- If the connection is successfully established, the status LED indicator will turn green.

### 3. UI widgets
- UI widgets such as a button, switch, and slider can be customized to control the target device with a JSON string.
- Examples of outgoing JSON strings are as follows:
  { "widget": "button", "value": "128" }
  { "widget": "switch", "value": "ON" }
  { "widget": "slider", "value": "8" }
- In the target device's firmware, the JSON string is parsed and triggers actions on the target device (e.g., turning on an LED) accordingly.

### 4. Chart/Gauge
- Various types of charts and gauges are rendered based on the incoming data received from the serial port.
- The incoming data is in JSON format.
- Examples of incoming JSON strings are as follows:
  { "name": "RPM", "value": "512"}
  { "name": "Temperature", "value": "512"}

### 5. Serial monitor
- A text panel to display the incoming data received from the serial port in ASCII characters.

### 6. How to test
- Connect an Arduino dev board to the computer via a USB cable.
- Upload the firmware in `./arduino/JSON_over_Serial` to the Arduino dev board to simulate the `target device`.
- Connect the Arduino dev board using Web Serial Commander (as described in section 2).
- By closing the switch connected to the dev board, it will send a JSON string with a random value over the serial port every second.
- If a JSON string (i.e., a command) is received from the serial port, it will be parsed and printed to the serial port, and the printed message will appear in the Web Serial Commander's serial monitor.