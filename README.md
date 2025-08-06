# Web Serial Commander
Web Serial Commander is an example of web-based, cross-platform application which provides UI to control and monitor target devices over serial (i.e. UART) communication.
[screenshot](https://raw.githubusercontent.com/sweifang/webserialcommander/refs/heads/main/assets/WebSerialCommander.JPG)

### 1. How to use
Download the repository to your device with web browser (e.g. PC or laptop). Launch the application by opening `index.html`.

### 2. Connect device via serial port
- Connect the target device and computer with USB cable. A COM port shall be identified by the computer.
- Click the `Refresh` button, select the COM port of the target device. Click `Connect` to authorize the application's access to the COM port.
- The authorized COM port should be listed in the drop-down menu with USB device's PID and VID. Select the COM port and baud rate, and click the `connect` button to establish serial connection.
- If the connection is successfully established, the status LED indicator shall turn green.

### 3. UI widgets
- UI widgets such as button, switch and slider can be customized to control the traget device with JSON string.
- Examples of the outgoing JSON string are as follows,
  { "widget": "button", "value": "128" }
  { "widget": "switch", "value": "ON" }
  { "widget": "slider", "value": "8" }
- In the firmware of the target device, the above JSON string is parsed and trigger the actions of target device (e.g. turning on a LED)accordingly.

### 4. Chart/Gauge
- Various types of Charts/Gauges are rendered based on the incoming data received from the serial port.
- The incoming data is in JSON format.
- Examples of the incoming JSON string are as follows,
  { "name": "RPM", "value": "512"}
  { "name": "Temperature", "value": "512"}

### 5. Serial monitor
- A text panel to display the incoming data received from the serial port in ASCII characters.
