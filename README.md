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

Comparativo Rápido

| Protocolo | Comportamento no Cenário | Avaliação para Telemetria|  
| MQTT | Assíncrono, Pub/Sub, TCP leve, retenção de mensagens. | Excelente. Resiliente a quedas da VPN. | 
| HTTP | Síncrono, Request/Response, cabeçalhos pesados. | Ruim. Consome muita banda e não escala bem para fluxo contínuo de sensores. | 
| CoAP | UDP, focado em baixo consumo e redes restritas.Inadequado via WAN. | Excelente localmente, mas perde confiabilidade de entrega crítica via túnel longo de VPN. |
| MCP | Orquestração de contexto e execução de ferramentas. | Inadequado para telemetria. Ideal apenas para a camada de inteligência e regras de negócio.| 

Benefícios Diretos do MQTT  
- Segurança: Suporta TLS embarcado, adicionando uma segunda camada de criptografia além da VPN.
- Desempenho: O cabeçalho de um pacote MQTT tem apenas 2 bytes, economizando largura de banda da rede corporativa.
- Escalabilidade: Adicionar um novo dashboard para ler os sensores exige zero alteração no gateway; basta assinar o tópico MQTT existente.
- Manutenção: Os tópicos organizam logicamente o sistema (ex: logistica/esteiras/temp).

 ### Controle de Acesso via VPN
 Bloqueio por Desenho de Rede
 As APIs não podem ser acessadas de fora da VPN porque elas não existem na internet pública. Elas não possuem um IP público roteável. O servidor onde estão hospedadas responde apenas a IPs da sub-rede privada. 
 
 O que acontece em uma tentativa externa?
 Se um serviço de nuvem de terceiros, sem estar na VPN, tentar bater no IP da sua API (mesmo que descubra o IP interno), a requisição sofrerá um Timeout ou Destination Host Unreachable. O roteador da operadora de internet simplesmente descarta o pacote na Camada 3 do modelo OSI, pois IPs privados não trafegam na internet pública.
 
 Aumento Holístico da Segurança
 A VPN consolida a superfície de ataque. Em vez de proteger dezenas de rotas e portas de APIs diferentes na web contra injeção de SQL ou ataques de negação de serviço (DDoS), a empresa defende um único "portão" fortemente blindado: o concentrador VPN, geralmente protegido por autenticação multifator (MFA) e certificados digitais emitidos individualmente por dispositivo.