"""
Sensor (Python - CoAP local)
O sensor, restrito em processamento, envia seu estado periodicamente usando 
bibliotecas assíncronas simples.
"""

import asyncio
from aiocoap import Context, Message, POST

async def enviar_telemetria_sensor():
    # Inicializa o cliente CoAP
    contexto = await Context.create_client_context()
    
    # Dado simulado do sensor da esteira (JSON leve)
    payload = b'{"id": "est_A", "temp": 68.5, "vib": 2.1}'
    
    # Dispara a mensagem via UDP para o Gateway Industrial local
    mensagem = Message(code=POST, payload=payload, uri="coap://192.168.1.50/telemetria")
    
    try:
        resposta = await contexto.request(mensagem).response
        print(f"Gateway confirmou: {resposta.code}")
    except Exception as e:
        print(f"Erro na rede local: {e}")

asyncio.run(enviar_telemetria_sensor())