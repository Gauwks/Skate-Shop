# Skate Shop CRUD - Guia de Uso

Bem-vindo ao **Skate Shop**, um sistema elegante e refinado de gerenciamento para sua loja de skate. Este guia apresenta as principais funcionalidades e como utilizá-las.

---

## 🚀 Começando

### Autenticação

1. Acesse a aplicação pela URL fornecida
2. Clique em **"Entrar com Manus"** na página inicial
3. Autentique-se com suas credenciais Manus
4. Após o login, você será redirecionado para o **Dashboard**

---

## 📊 Dashboard

O Dashboard é sua página inicial após o login, exibindo um **resumo de desempenho** do seu negócio:

### Métricas Principais

- **Total de Produtos**: Número total de produtos cadastrados no sistema
- **Total de Vendas**: Quantidade de pedidos realizados
- **Receita Acumulada**: Faturamento total em reais

### Ações Rápidas

- **Gerenciar Produtos**: Acesso direto à página de produtos
- **Registrar Venda**: Acesso direto à página de vendas

### Navegação

Use a barra de navegação no topo para acessar as três seções principais:
- Dashboard (página inicial)
- Produtos (gerenciamento)
- Vendas (registro e histórico)

---

## 📦 Gerenciamento de Produtos

A página **Produtos** permite gerenciar completamente seu catálogo de skates e acessórios.

### Visualizando Produtos

A tabela exibe todos os produtos cadastrados com as seguintes informações:
- **Nome**: Nome do produto
- **Marca**: Marca/fabricante
- **Categoria**: Tipo de produto (shape, truck, roda, rolamento, lixa ou completo)
- **Preço**: Valor em reais
- **Estoque**: Quantidade disponível
- **Descrição**: Detalhes adicionais

### Filtragem e Ordenação

**Busca por Nome**
- Digite o nome do produto no campo de busca
- Os resultados são atualizados em tempo real

**Filtro por Categoria**
- Selecione uma categoria na lista suspensa:
  - **Shape**: Pranchas de skate
  - **Truck**: Eixos
  - **Roda**: Rodas
  - **Rolamento**: Rolamentos
  - **Lixa**: Lixas de grip
  - **Completo**: Skates completos

**Ordenação**
- **Por Nome (A-Z)**: Ordem alfabética crescente
- **Por Nome (Z-A)**: Ordem alfabética decrescente
- **Por Preço (Menor)**: Menor preço primeiro
- **Por Preço (Maior)**: Maior preço primeiro

### Criando um Novo Produto

1. Clique no botão **"Novo Produto"** (ícone + no topo)
2. Preencha o formulário com os seguintes campos:
   - **Nome** (obrigatório): Nome do produto
   - **Marca** (obrigatório): Marca/fabricante
   - **Categoria** (obrigatório): Selecione uma categoria
   - **Preço** (obrigatório): Valor em reais (deve ser positivo)
   - **Estoque** (obrigatório): Quantidade inicial (não pode ser negativo)
   - **Descrição** (opcional): Detalhes adicionais
3. Clique em **"Salvar"** para criar o produto
4. Uma mensagem de confirmação aparecerá

### Editando um Produto

1. Clique no ícone de **edição** (lápis) na linha do produto
2. Modifique os campos desejados no formulário
3. Clique em **"Salvar"** para atualizar
4. Uma mensagem de confirmação aparecerá

### Deletando um Produto

1. Clique no ícone de **exclusão** (lixeira) na linha do produto
2. Uma caixa de diálogo de confirmação aparecerá
3. Clique em **"Confirmar"** para deletar permanentemente
4. O produto será removido do sistema

**Nota**: A exclusão é permanente e não pode ser desfeita. Certifique-se de que deseja remover o produto.

---

## 🛒 Registro de Vendas

A página **Vendas** permite registrar novas vendas e visualizar o histórico de transações.

### Registrando uma Nova Venda

1. Na seção **"Registrar Venda"**, preencha os campos:
   - **Produto** (obrigatório): Selecione um produto da lista
   - **Quantidade** (obrigatório): Número de unidades vendidas (deve ser positivo)
   - **Cliente** (obrigatório): Nome do cliente
2. O **Valor Total** é calculado automaticamente (preço × quantidade)
3. Clique em **"Registrar Venda"** para confirmar
4. Uma mensagem de confirmação aparecerá

**Validações**:
- O produto deve existir no catálogo
- A quantidade deve ser maior que zero
- O estoque do produto será reduzido automaticamente
- Se o estoque for insuficiente, a venda será rejeitada

### Visualizando Histórico de Vendas

A tabela **"Histórico de Vendas"** exibe todas as transações realizadas:
- **Data**: Data e hora da venda
- **Produto**: Nome do produto vendido
- **Quantidade**: Unidades vendidas
- **Cliente**: Nome do cliente
- **Valor Total**: Total da transação em reais

As vendas são listadas em ordem cronológica (mais recentes primeiro).

---

## 💡 Dicas e Boas Práticas

### Gerenciamento de Estoque

- Revise regularmente o **Dashboard** para monitorar o estoque total
- Quando o estoque de um produto ficar baixo, considere fazer um novo pedido
- Use a busca para encontrar rapidamente produtos com estoque reduzido

### Organização de Produtos

- Use categorias consistentemente para facilitar a busca
- Mantenha nomes de produtos claros e descritivos
- Adicione descrições detalhadas para produtos especiais

### Registro de Vendas

- Sempre registre as vendas no sistema para manter o histórico atualizado
- Use nomes de clientes consistentes para melhor rastreamento
- Verifique o estoque antes de confirmar vendas em grande volume

### Análise de Desempenho

- Consulte o Dashboard regularmente para acompanhar:
  - Crescimento no número de vendas
  - Evolução da receita
  - Proporção de produtos vendidos

---

## ⚙️ Configurações Técnicas

### Requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexão com a internet
- Conta Manus para autenticação

### Suporte

Para problemas técnicos ou dúvidas, entre em contato com o suporte técnico.

---

## 📋 Resumo das Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| **Dashboard** | Visualização de métricas e resumo de desempenho |
| **Cadastro de Produtos** | Criar novos produtos com validação completa |
| **Edição de Produtos** | Modificar informações de produtos existentes |
| **Exclusão de Produtos** | Remover produtos com confirmação |
| **Busca e Filtro** | Encontrar produtos por nome ou categoria |
| **Ordenação** | Organizar produtos por nome ou preço |
| **Registro de Vendas** | Registrar transações com cálculo automático |
| **Histórico de Vendas** | Visualizar todas as transações realizadas |
| **Controle de Estoque** | Redução automática de estoque em vendas |

---

**Versão**: 1.0.0  
**Última atualização**: Maio de 2026
