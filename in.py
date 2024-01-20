import time
import random
import ssl
from datetime import datetime
from paho.mqtt import client as mqtt_client

# 브로커 연결 정보
broker = 't22e6d86.emqx.cloud'
port = 1883
topic1 = 'water_level/topic1'
topic2 = 'water_level/topic2'
topic3 = 'water_level/topic3'
client_id = f'python-mqtt-{random.randint(0, 1000)}'
username = 'min'
password = 'water'

def connect_mqtt():
    try:
        def on_connect(client, userdata, flags, rc):
            if rc == 0:
                print("Connected to MQTT Broker!")
            else:
                print("Failed to connect, return code {}\n".format(rc))
        client = mqtt_client.Client(client_id)
        client.username_pw_set(username, password)

        client.on_connect = on_connect
        client.connect(broker, port)
    except Exception as e:
        print(f"Connection failed: {e}")
    return client

def subscribe(client: mqtt_client):
    def on_message(client, userdata, msg):
        now = datetime.now()
        timestamp = now.strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
        print(f"[{timestamp}] Received `{msg.payload.decode()}` from `{msg.topic}` topic")
        if(float(msg.payload.decode())>=5):
            print("The door is closing.")

    client.subscribe(topic1)
    client.subscribe(topic2)
    client.subscribe(topic3)
    client.on_message = on_message

def run():
    client = connect_mqtt()
    subscribe(client)
    client.loop_forever()

if __name__ == '__main__':
    run()