#include <WiFi.h>
#include <HTTPClient.h>

// Define Pins
#define MOISTURE_PIN 34

// Network Credentials
const char* ssid = "CMF by Nothing Phone 1_6917";
const char* password = "12349876";

// Backend URL
const char* backend_url = "http://172.31.98.143:5000/sensor-data"; 

void setup() {
  Serial.begin(115200);
  
  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi!");
}

void loop() {
  // Read Data
  int moisture_raw = analogRead(MOISTURE_PIN);

  // Convert raw moisture analog to percentage mapped roughly for soil sensors
  float moisture_percent = map(moisture_raw, 3000, 1200, 0, 100);
  // Constrain just in case analog read flips out of mapped bounds
  if (moisture_percent < 0) moisture_percent = 0;
  if (moisture_percent > 100) moisture_percent = 100;

  // Since we removed DHT, we will hardcode temp as a normal average baseline
  float temp = 1450.0;

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(backend_url);
    http.addHeader("Content-Type", "application/json");

    // Construct JSON payload
    String json = "{";
    json += "\"temperature\":" + String(temp) + ",";
    json += "\"moisture\":" + String(moisture_percent);
    json += "}";

    // Send POST
    int httpResponseCode = http.POST(json);
    
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println(response);
    }
    
    http.end();
  } else {
    Serial.println("WiFi Disconnected. Attempting to reconnect...");
    WiFi.begin(ssid, password);
  }

  // Delay before next ping (5 seconds)
  delay(5000);
}
