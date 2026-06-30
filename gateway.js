/*
Gateway Industrial (MQTT pela VPN)
O gateway atua como ponte. Recebeu dados locais e publica via VPN para o servidor corporativo.
*/

const mqtt = require('mqtt');

// O IP 10.8.0.1 é a interface da VPN no data center da matriz
const brokerCorporativo = mqtt.connect('mqtt://10.8.0.1:1883');

brokerCorporativo.on('connect', () => {
    console.log('🔗 Gateway autenticado na VPN e conectado ao Broker MQTT');
    
    // Simula o dado que acabou de chegar do CoAP
    const telemetria = { maquina: "Esteira_A", temp: 68.5, vib: 2.1 };
    
    // QoS 1 assegura que a mensagem será entregue pelo menos uma vez,
    // mesmo se a VPN falhar momentaneamente.
    brokerCorporativo.publish(
        'logistica/chao-de-fabrica/sensores', 
        JSON.stringify(telemetria), 
        { qos: 1 }
    );
});