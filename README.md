# cenário

A arquitetura opera em duas zonas de confiança principais: a rede local do centro de distribuição (onde residem os equipamentos físicos) e a infraestrutura corporativa. A VPN atua como a ponte exclusiva entre esses dois mundos.

Onde a VPN se encaixa e quem depende dela
A VPN cria um túnel criptografado direto entre a borda da rede local do centro de distribuição e o data center corporativo (ou nuvem).

Gateway Industrial: Depende da conexão site-to-site via VPN para conseguir alcançar o broker de mensagens e os serviços corporativos.

Dashboards Web: Gestores e engenheiros rodam clientes VPN em seus computadores corporativos para acessar o painel administrativo.

APIs Internas: Dependem da VPN de forma passiva; elas confiam que o tráfego recebido só pôde chegar até ali porque passou pelos gateways de segurança da rede privada.

Fluxo de Protocolos
Comunicação Sensor - Gateway (CoAP):
Sensores de vibração e temperatura possuem bateria e processamento limitados. O CoAP roda sobre UDP, eliminando a necessidade de estabelecer handshakes complexos. Ele envia pacotes muito pequenos e eficientes dentro da rede local da empresa.

Comunicação Gateway - Serviços Internos (MQTT):
O gateway industrial age como um concentrador. Uma vez que o dado é recebido, ele precisa chegar aos servidores da matriz de forma contínua. O MQTT é usado aqui através do túnel da VPN. Se a internet oscilar, a qualidade de serviço (QoS) do MQTT garante que o gateway armazene a leitura e entregue assim que o túnel VPN estabilizar.

Coordenação entre Serviços Internos (MCP):
No backend, os dados precisam ser analisados e ações precisam ser coordenadas. O MCP  é utilizado para a orquestração padronizada entre microsserviços e ferramentas de análise, permitindo que um serviço solicite contexto ou execute ferramentas de forma universal dentro da rede interna.

Comunicação Dashboards (HTTP):
A interface consumida por engenheiros roda no navegador. O dashboard realiza requisições HTTP  para as APIs internas. Como o usuário já está na VPN, o HTTP é seguro e amplamente compatível com qualquer stack web moderna.

Justificativa Técnica: MQTT para Telemetria Contínua
Para o trânsito pesado de dados entre o chão de fábrica e os sistemas corporativos, o MQTT é a solução definitiva.

Por que é o mais adequado? 
Em um ambiente logístico, você tem centenas de máquinas enviando vibração a cada segundo. O padrão Publish/Subscribe do MQTT desacopla quem gera a informação de quem a consome . O gateway apenas "publica" o dado em um tópico, sem se importar com quantas APIs internas o estão escutando.
