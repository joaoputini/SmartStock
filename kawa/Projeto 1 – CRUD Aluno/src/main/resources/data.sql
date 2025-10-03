-- Remover o script antigo de Alunos para evitar conflitos
-- DELETE FROM aluno;

-- =================================================================
-- 1. Povoamento de Tabelas Base (sem chaves estrangeiras)
-- =================================================================

-- PAPEIS (Níveis de Acesso)
INSERT INTO PAPEIS (id, nome, descricao) VALUES
(1, 'Administrador', 'Acesso total ao sistema, incluindo configurações e gerenciamento de usuários.'),
(2, 'Gestor de Estoque', 'Acesso a funcionalidades de gerenciamento de produtos, estoque e relatórios.'),
(3, 'Operador', 'Acesso limitado a registro de entradas e saídas de produtos.');

-- CATEGORIAS de Produtos
INSERT INTO CATEGORIAS (id, nome, descricao) VALUES
(1, 'Componentes Eletrônicos', 'Resistores, capacitores, circuitos integrados, etc.'),
(2, 'Hardware', 'Placas-mãe, processadores, memórias RAM.'),
(3, 'Periféricos', 'Teclados, mouses, monitores.'),
(4, 'Cabos e Conectores', 'Cabos de força, cabos HDMI, conectores USB.');

-- FORNECEDORES
INSERT INTO FORNECEDORES (id, nome, cnpj, contato_email, contato_telefone) VALUES
(1, 'CompMaster Distribuidora', '11.222.333/0001-44', 'vendas@compmaster.com', '11-3030-4040'),
(2, 'Eletronic Parts Inc.', '55.666.777/0001-88', 'contact@eletronicparts.com', '19-3344-5566'),
(3, 'CableX Soluções', '99.888.777/0001-22', 'suporte@cablex.com.br', '21-98765-4321');

-- LOCALIZACOES no Armazém
INSERT INTO LOCALIZACOES (id, codigo, descricao) VALUES
(1, 'A01-P01', 'Corredor A, Prateleira 01'),
(2, 'A01-P02', 'Corredor A, Prateleira 02'),
(3, 'B01-P01', 'Corredor B, Prateleira 01'),
(4, 'C01-P01', 'Corredor C, Prateleira 01 (Itens pequenos)');

-- =================================================================
-- 2. Povoamento de Tabelas com Chaves Estrangeiras
-- =================================================================

-- USUARIOS (Associados a Papéis)
-- Senhas estão em texto puro para teste. Em produção, use hash (ex: BCrypt).
INSERT INTO USUARIOS (id, nome, email, senha_hash, id_papel, data_criacao, ativo) VALUES
(1, 'Admin Geral', 'admin@smartstock.com', 'admin123', 1, CURRENT_TIMESTAMP, true),
(2, 'Carlos Gerente', 'carlos.gestor@smartstock.com', 'gestor123', 2, CURRENT_TIMESTAMP, true),
(3, 'Ana Operadora', 'ana.operador@smartstock.com', 'operador123', 3, CURRENT_TIMESTAMP, true),
(4, 'Usuario Inativo', 'inativo@smartstock.com', 'senha123', 3, CURRENT_TIMESTAMP, false);

-- PRODUTOS (Associados a Categorias e Fornecedores)
INSERT INTO PRODUTOS (id, sku, nome, descricao, id_categoria, id_fornecedor, ponto_ressuprimento, unidade_medida) VALUES
(1, 'CPU-I5-12400F', 'Processador Intel Core i5-12400F', 'Processador de 12ª geração, 6 núcleos, 12 threads.', 2, 1, 10.00, 'pç'),
(2, 'MEM-DDR4-8GB-3200', 'Memória RAM 8GB DDR4 3200MHz', 'Módulo de memória para desktops.', 2, 1, 20.00, 'pç'),
(3, 'SSD-NVME-1TB-GEN4', 'SSD NVMe 1TB Gen4', 'Unidade de estado sólido de alta velocidade.', 2, 2, 15.00, 'pç'),
(4, 'RES-1K-OHM-1/4W', 'Resistor 1k Ohm 1/4W', 'Resistor de filme de carbono para circuitos eletrônicos.', 1, 2, 500.00, 'pç'),
(5, 'CAB-HDMI-2M', 'Cabo HDMI 2.0 4K 2 metros', 'Cabo para transmissão de áudio e vídeo de alta definição.', 4, 3, 50.00, 'pç');

-- =================================================================
-- 3. Povoamento de Tabelas de Relacionamento e Histórico
-- =================================================================

-- ESTOQUE (Posição atual dos produtos nas localizações)
INSERT INTO ESTOQUE (id, id_produto, id_localizacao, quantidade, data_ultima_atualizacao) VALUES
(1, 1, 1, 25.00, CURRENT_TIMESTAMP), -- Processador no Corredor A, Prateleira 1
(2, 2, 1, 80.00, CURRENT_TIMESTAMP), -- Memória RAM no Corredor A, Prateleira 1
(3, 3, 2, 40.00, CURRENT_TIMESTAMP), -- SSD no Corredor A, Prateleira 2
(4, 4, 4, 1500.00, CURRENT_TIMESTAMP), -- Resistor no Corredor C, Prateleira 1
(5, 5, 3, 120.00, CURRENT_TIMESTAMP); -- Cabo HDMI no Corredor B, Prateleira 1

-- MOVIMENTACOES (Histórico de entradas e saídas)
INSERT INTO MOVIMENTACOES (id, id_produto, tipo, quantidade, data_hora, id_usuario) VALUES
-- Entradas
(1, 1, 'ENTRADA', 30.00, '2025-09-18 09:00:00', 2), -- Carlos (Gestor) deu entrada em 30 CPUs
(2, 2, 'ENTRADA', 100.00, '2025-09-18 09:15:00', 2),
(3, 5, 'ENTRADA', 150.00, '2025-09-19 10:00:00', 3), -- Ana (Operadora) deu entrada em 150 cabos
-- Saídas
(4, 1, 'SAIDA', 5.00, '2025-09-19 14:30:00', 3),  -- Ana (Operadora) deu saída em 5 CPUs
(5, 2, 'SAIDA', 20.00, '2025-09-19 15:00:00', 3),
(6, 5, 'SAIDA', 30.00, '2025-09-20 11:00:00', 3);

-- =================================================================
-- 4. Povoamento de Tabelas de Notificação e Auditoria
-- =================================================================

-- ALERTAS (Um produto está abaixo do ponto de ressuprimento)
INSERT INTO ALERTAS (id, id_produto, tipo, mensagem, status, data_criacao) VALUES
(1, 3, 'ESTOQUE_BAIXO', 'Estoque do produto SSD NVMe 1TB Gen4 (40 un.) está próximo do ponto de ressuprimento (15 un.).', 'NOVO', CURRENT_TIMESTAMP);

-- LOGS_SISTEMA (Registros de auditoria)
INSERT INTO LOGS_SISTEMA (id, id_usuario, acao, detalhes, timestamp) VALUES
(1, 1, 'LOGIN', 'Usuário admin@smartstock.com realizou login com sucesso. IP: 192.168.1.100', '2025-09-20 08:00:00'),
(2, 2, 'CREATE_PRODUCT', 'Usuário carlos.gestor@smartstock.com cadastrou o produto CPU-I5-12400F.', '2025-09-18 08:45:00'),
(3, 3, 'UPDATE_STOCK', 'Usuário ana.operador@smartstock.com registrou saída de 5 unidades do produto ID 1.', '2025-09-19 14:30:00');