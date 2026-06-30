/*
 * API HTTP Interna 
O backend corporativo consome e expõe dados, blindado 
*/

const express = require('express');
const app = express();

// Middleware de verificação de ambiente fechado
app.use((req, res, next) => {
    // Valida se a requisição originou de um IP válido da VPN corporativa
    if (!req.ip.startsWith('10.8.')) {
        return res.status(403).json({ erro: "Acesso Negado: Dispositivo fora da VPN." });
    }
    next();
});

// Rota consumida pelo Dashboard dos gestores
app.get('/api/v1/dashboard/status', (req, res) => {
    res.json({ status: "Operacional", alertas: ["Nenhum erro de vibração detectado"] });
});

// A API realiza o binding ('escuta') estritamente no IP interno, nunca no 0.0.0.0
app.listen(8080, '10.8.0.15', () => {
    console.log('🛡️ API restrita rodando apenas na sub-rede privada.');
});