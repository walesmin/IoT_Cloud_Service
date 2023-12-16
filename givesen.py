import paho.mqtt.client as mqtt_client
import random
import time

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT Broker!")
    else:
        print("Failed to connect, return code %d\n", rc)

def on_publish(client, userdata, mid):
    print(f"Message published: {mid}")

broker_address = "192.168.137.45"
port = 1883
client = mqtt_client.Client("waterSensorPublisher")


client.on_connect = on_connect
client.on_publish = on_publish

client.connect(broker_address, port)
client.loop_start()

time.sleep(2)

while True:
    for i in range(1, 4):
        water_level = round(random.uniform(0, 10), 2)
        result = client.publish(f"water_level/topic{i}", water_level)
        status = result[0]
        if status == 0:
            print(f"Send `{water_level}` to topic `water_level/topic{i}`")
        else:
            print(f"Failed to send message to topic `water_level/topic{i}`")
    time.sleep(1)

client.loop_stop()
