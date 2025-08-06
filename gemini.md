# Functional Requirement Document
## for WebSerialCommander
### 1. Description
**Web Serial Commander** is a web-based, cross-platform application that provides a customizable UI to control and communicate with various devices through a serial port.

### 2. Prerequisite
* The application will be developed using HTML, CSS, and JavaScript.
* HTML, CSS, and JavaScript will be organized into individual files.
* Bootstrap 5 will be used for responsive layouts.
* jQuery will be used for interactive components.
* The Web Serial API will be used to handle serial communication.

### 3. Visual Styling
This section outlines the visual styling guidelines for the application's modern, dark-themed UI. The design must prioritize clarity, accessibility, and a polished, professional aesthetic featuring soft, tactile elements. The following guidelines must be adhered to.

#### 3.1 Layout & Structure
- **Grid-based layout** with ample spacing between components.
- Balanced use of horizontal and vertical alignments.
- Clearly separated panels or card sections for logical grouping.

#### 3.2 Background & Containers
- **Background color:** Deep charcoal gray (`#23242b` or similar).
- **Card/container backgrounds:** Slightly lighter gray, maintaining a sense of layering.
- **Subtle inner shadows** to differentiate input fields and cards from the background.

#### 3.3 Input Fields, Dropdowns & Controls
- **Background:** Slightly lighter gray than the main background, maintaining contrast.
- **Borders:** Thin (1-2px), high-contrast borders in blue (`#256eff`) or dark gray for focus states; subtle gray when idle.
- **Rounded corners:** High radius (8-12px) for a pill or soft rectangular look.
- **Focus effect:** Bright blue glow or border (outer or inner shadow).
- **Placeholder text:** Light gray or muted white.
- **Entered text:** Bright white for strong visibility.
- **Dropdown menus:** Elevated with shadow, dark background, strong hover highlights (subtle blue/gray).

#### 3.4 Steppers & Switches
- **Stepper buttons:** Rounded squares, filled with a gray background and high-contrast numbers; a blue border or glow on focus.
- **Toggles/switches:** Pill-shaped with a thumb. The active state is vivid blue, and the inactive state is gray. Smooth transitions for state changes.

#### 3.5 Checkboxes & Radio Buttons
- **Checkboxes:** Square with a high border radius, filled with blue when checked.
- **Radio buttons:** Circular, with a blue fill on selection; unfilled states are gray.

#### 3.6 Buttons
- **Primary action (e.g., “Confirm”):**
    - **Background:** Vivid, saturated blue (`#256eff`).
    - **Text:** Bright white.
    - **Rounded corners:** 10-14px for approachability.
    - **Shadow:** Soft, slight drop shadow for elevation.
    - **Hover/Active:** Slightly brighter or darker blue, with a glow effect.
- **Secondary buttons:** Dark background, white text, with a border on focus.

#### 3.7 Tags & Chips
- **Backgrounds:** Green or orange for color-coded tags. Subtle textural differences to differentiate types.
- **Text:** White or highly contrasting.
- **Icons for removal:** Light gray/white, simple “X”, with rounded chip corners.

#### 3.8 Typography

| Element          | Font Style         | Color        | Weight         |
| ---------------- | ------------------ | ------------ | -------------- |
| Labels           | Sans-serif, 15-16px| Muted gray   | Regular        |
| Input text       | Sans-serif, 16px   | Bright white | Medium         |
| Placeholder text | Sans-serif, 16px, italic | Light gray   | Regular        |
| Button text      | Sans-serif, 16px   | White        | Medium/Semibold|
| Tag/Chip text    | Sans-serif, 14px   | White        | Medium         |

- **Font:** Modern geometric sans-serif (e.g., Inter, SF Pro, Roboto).

#### 3.9 Effects
- **Shadows:** Subtle elevation on dropdowns, cards, and focused fields (soft, diffuse black).
- **Glows:** Blue glow for focus states on inputs and buttons, visually indicating active elements.
- **Transitions:** Smooth (150–250ms) ease-in-out for interactive feedback.

#### 3.10 Iconography & Profile Elements
- **User profile:** Circular avatar with a subtle shadow.
- **Icons:** Simple, flat, monochromatic (gray/white).

#### 3.11 Additional UI Details
- **Slider:** Modern, minimal rail with a blue active section.
- **Night/Day Switch:** Clearly indicates “Dark” or “Light” mode with an icon and contrasting fill.
- **Consistency:** All corners should be highly rounded, color contrasts optimized for accessibility, with strong focus indicators and uniform spacing.

### 4. UI Elements
#### 4.1 Connection Settings Area
- Title: "連線設定"
- A full-width container located at the top of the screen. The following UI elements must be placed within this container in the order specified below.

##### 4.1.1 Connect/Disconnect Switch
- No text label.
- A round button, featuring an icon (e.g., a plug), will allow the user to toggle between 'connect' and 'disconnect' states. The button must display a distinct focus effect to indicate the current connection state.

##### 4.1.2 Port Menu
- Label: "連接埠"
- Default option: "請選擇連接埠"
- A drop-down menu for selecting the COM port. The menu options will be populated with the names of available COM ports as automatically detected and provided by the operating system.

##### 4.1.3 Refresh Button
- No text label.
- A button with a refresh icon will trigger a re-scan of available COM ports. After the scan, the Port Menu (Section 4.1.2) must be updated with the new list of ports.

##### 4.1.4 Baud Rate Menu
- Label: "通訊速率"
- Default option: "115200"
- A drop-down menu for the user to configure the baud rate. The available options are "9600", "38400", "57600", and "115200".

##### 4.1.5 Connection Status Indicator
- No text label.
- A round, circular element will simulate an LED to indicate the connection status. By default, the indicator is off. After toggling the connect switch (Section 4.1.1), the indicator will turn on if a connection is successfully established.

#### 4.2 Custom Function Area
- Title: "控制介面"
- A full-width parent container to place various types of UI widgets, including buttons, switches, and sliders. Each UI widget contains a "label", "current value", and "control element", which are described in detail below.

##### 4.2.1 Label
The text label for the UI widget, for example, "亮度".

##### 4.2.2 Current Value
A text label with a border to display the current set value, which can be either a number (e.g., "255") or text (e.g., "ON").

##### 4.2.3 Control Element
Depending on the type of UI widget, the appropriate control (e.g., button, switch, or slider) will be rendered.

### 4.3 Chart Area
- Title: "即時圖表"
- Emebed the latest versions of Vega-Lite for creating charts and gauges in this area.
- The charts and gauges are updated based on the incoming data from the connected serial port.
- The incoming data is sent periodically and is of the following JSON format:
  { "name":"dataName", "value":dataValue}
  for example: {"name":"RPM","value":833}
- dataName and dataValue are parsed for the following types of chart and gauge.
#### 4.3.1 Line chart
- Chart title: dataName
- Chart size: 560 x 220px
- X-axis: sequentail numbers starting from 1 (i.e. 1, 2, 3, 4, ...)
- Y-axis: dataValue
- The chart shall be updated dynamically (i.e. rolling X-axis) with the latest 5 data points
- The range of Y-axis shall be adjusted dynamically according to the latest 5 data points

#### 4.4 Monitor Area
- Title: "回傳接收"
- A full-width parent container to place various types of UI widgets, including charts, gauges, and a text terminal.

##### 4.4.1 Text Terminal
- No text label.
- A text area to display received data as ASCII characters.

##### 4.4.2 Chart
- To be defined.

##### 4.4.3 Gauge
- To be defined.

### 5. Next Steps

  
















