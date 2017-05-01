'use strict';
let mqtt = require('mqtt');
let md5 = require('md5');
// let async = require('async');
let unique = require('getmac');
let mqttClient;
let mqtt_server = 'iot.awges.com';
let mac = 'undefined';
let connected = false;
let pass_secure = '';
let portMQTT = 8080;

unique.getMac(function(err, mac_addr) {
  if (err)
    throw err;
  mac = mac_addr;
  pass_secure = md5(md5(mac).slice(25, 31) + 'homestark' + md5(mac).slice(19, 25));

  mqttClient = mqtt.connect('mqtt://' + mqtt_server, {
    clientId: mac,
    username: 'rpi_' + mac,
    password: pass_secure,
    port: portMQTT
  });

  mqttClient.on('connect', function() {
    console.log('Conectado ao broker MQTT!');
    mqttClient.subscribe('#');
    mqttClient.publish('/' + mac + '/info', 'Publicador de sniffer no initial state ok!');
    connected = true;
  });

  mqttClient.on('message', function(topic, message) {
    console.log('[MQTT] Tópico:' + topic + '\n[MQTT] Mensagem:' + message);
  });
});
