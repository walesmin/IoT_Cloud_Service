import RPi.GPIO as GPIO
import paho.mqtt.client as mqtt

GPIO.setwarnings(False)

# GPIO 핀 번호 설정
RELAY_PIN = 18

# MQTT 브로커 정보
mqtt_broker = '192.168.137.191'
mqtt_topic = 'relay'

def setup():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(RELAY_PIN, GPIO.OUT)
    GPIO.output(RELAY_PIN, GPIO.LOW)

def on_connect(client, userdata, flags, rc):
    print('Connected to MQTT broker')
    client.subscribe(mqtt_topic)

def on_message(client, userdata, msg):
    payload = msg.payload.decode()
    if payload == 'on':
        GPIO.output(RELAY_PIN, GPIO.HIGH)
        print('Relay turned on')
    elif payload == 'off':
        GPIO.output(RELAY_PIN, GPIO.LOW)
        print('Relay turned off')

def main():
    setup()

    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(mqtt_broker, 1883, 60)

    client.loop_forever()

if __name__ == '__main__':
    main()
