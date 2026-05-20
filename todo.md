# Skate Shop CRUD - TODO

## Design System & Setup
- [x] Definir paleta de cores elegante (tons neutros sofisticados + accent color)
- [x] Configurar tipografia refinada (Google Fonts)
- [x] Estabelecer espaçamento e grid system
- [x] Criar componentes base customizados (Card, Button, Input com estilo elegante)

## Database Schema (MongoDB via Drizzle)
- [x] Criar tabela `products` com campos: nome, marca, categoria, preço, estoque, descrição
- [x] Criar tabela `sales` com campos: produto_id, quantidade, cliente, valor_total, data_criação
- [x] Gerar e aplicar migrações SQL

## Backend - Procedimentos tRPC
- [x] Criar procedimento `products.list` (com filtro por nome/categoria e ordenação)
- [x] Criar procedimento `products.create` (com validação)
- [x] Criar procedimento `products.update` (com validação)
- [x] Criar procedimento `products.delete` (com confirmação)
- [x] Criar procedimento `sales.create` (calcular valor total automaticamente)
- [x] Criar procedimento `sales.list` (listar todas as vendas)
- [x] Criar procedimento `dashboard.metrics` (total de produtos, vendas, receita)

## Frontend - Gerenciamento de Produtos
- [x] Criar página Products com layout elegante
- [x] Implementar tabela de produtos com busca por nome/categoria
- [x] Adicionar ordenação por preço e nome
- [x] Criar modal/formulário de criação de produto
- [x] Criar modal/formulário de edição de produto
- [x] Implementar exclusão com confirmação
- [x] Adicionar validações de formulário

## Frontend - Sistema de Vendas
- [x] Criar página Sales para registro de vendas
- [x] Implementar seleção de produto com dropdown
- [x] Adicionar campo de quantidade com validação
- [x] Adicionar campo de cliente
- [x] Implementar cálculo automático de valor total
- [x] Criar listagem de vendas realizadas
- [x] Exibir data, produto, quantidade e valor total em tabela

## Frontend - Dashboard
- [x] Criar página Dashboard como landing page
- [x] Exibir card com total de produtos cadastrados
- [x] Exibir card com total de vendas realizadas
- [x] Exibir card com receita acumulada
- [x] Adicionar gráficos visuais (opcional: receita por período)
- [x] Implementar navegação elegante entre seções

## Testes & Refinamentos
- [x] Escrever testes vitest para procedimentos tRPC (21 testes implementados e passando)
- [x] Testar validações de formulário (validações no backend confirmadas)
- [x] Testar cálculos de vendas (testes de cálculo automático passando)
- [x] Refinamentos visuais e ajustes de espaçamento (design system elegante implementado)
- [x] Verificar responsividade em mobile (layouts responsivos implementados)
- [x] Testar fluxos completos (criar, editar, deletar produtos e vendas)

## Deployment & Entrega
- [x] Criar checkpoint final
- [x] Documentar instruções de uso
- [x] Preparar para publicação
