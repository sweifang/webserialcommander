/*------------------------------------------------------
AVR: Arduino Uno/Nano/Pro Mini or LGT8F328P dev board

Description:
A switch is connected between D2 and GND. When the switch
is closed, data in JSON format will be sent over serial port
to the web-based application "Web Serial Commander" which 
will parse the data and plot them into a line chart

When button-press, switch-toggle or slider-change event 
was triggered on Web Serial Commander, the command in JSON
format will be sent over serial port to this device. The
JSON command will then be parsed and printed to serial port,
which can again been received by Web Serial Commander's
terminal.
------------------------------------------------------*/

#include <ArduinoJson.h>
#define SW_PIN 2
unsigned long prevTime;

void setup() {
  Serial.begin(115200);
  //Serial.println("hello");
  pinMode(SW_PIN, INPUT_PULLUP);
  randomSeed(millis()+(analogRead(A5))); //亂數種子
  prevTime = millis();
}

void loop() {  
  JsonDocument doc; 

  if (digitalRead(SW_PIN) == LOW && (millis()-prevTime > 1000))
  {
    JsonDocument data; 
    data["name"] = "RPM";
    data["value"] = random(500,1000);
    serializeJson(data, Serial);
    Serial.println();
    prevTime = millis();
  } 

  if (Serial.available())
  {
    
    String input = Serial.readStringUntil('\n');
    DeserializationError error = deserializeJson(doc, input);
    // Check if the deserialization was successful.
    if (error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.c_str());
      return;
    }
    const char* widgetName = doc["widget"];
    byte widgetValue = doc["value"];
    Serial.print(widgetName);
    Serial.print(":");
    Serial.println(widgetValue);
  }

}
