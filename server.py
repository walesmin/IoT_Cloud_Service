from flask import Flask, render_template, request
import paho.mqtt.client as mqtt

app = Flask(__name__)
mqtt_broker = '192.168.137.191'
mqtt_topic = 'relay'

def publish_message(status):
    mqtt_client = mqtt.Client()
    mqtt_client.connect(mqtt_broker, 1883)
    mqtt_client.publish(mqtt_topic, status)
    mqtt_client.disconnect()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/control', methods=['POST'])
def control():
    action = request.form.get('action')
    if action == 'on':
        publish_message('on')
    elif action == 'off':
        publish_message('off')
    return 'Success'

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=8080)
