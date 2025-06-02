# Aplicação E-commerce para Testes de QA

Esta aplicação foi desenvolvida especificamente para prática de testes de QA, oferecendo um ambiente realista de e-commerce com funcionalidades completas e desafios de teste intencionais.

## Funcionalidades Principais

### 1. Funcionalidades de E-commerce
- Página de listagem de produtos com múltiplos itens
- Páginas de detalhes de produtos
- Carrinho de compras com adição/remoção/atualização de quantidade
- Formulário de checkout com validação
- Página de confirmação de pedido
- Sistema de cadastro e login de usuários
- Perfil de usuário com informações pessoais e endereço
- Histórico de pedidos
- Recuperação de senha

### 2. Recursos para Testes de QA
- **Modo de Bugs (Bug Mode)**: Um interruptor que introduz vários bugs em toda a aplicação
- **Simulador de API**: Controle de atrasos, falhas e erros de rede para testar a resiliência da aplicação
- **Seletores de Teste Mistos**: Alguns elementos têm IDs específicos para teste ou IDs regulares, enquanto outros não, para praticar diferentes estratégias de seleção
- **Validação de Formulário**: Os formulários possuem validação que pode ser testada
- **Design Responsivo**: A aplicação é responsiva e pode ser testada em diferentes tamanhos de tela
- **Autenticação de Usuário**: Fluxos de login, registro, perfil e recuperação de senha para testar
- **Banco de Dados SQLite**: Armazenamento persistente de usuários para testes reais de autenticação

### 3. Desafios de Teste Intencionais
Quando o Modo de Bugs está ativado:
- Alguns produtos podem ser adicionados ao carrinho duas vezes
- A validação do formulário pode ser ignorada
- Os cálculos de impostos podem estar incorretos
- Alguns elementos da interface mudam de aparência ou comportamento
- Botões de adicionar ao carrinho podem falhar silenciosamente
- O texto de confirmação do pedido pode mudar
- Login e registro podem falhar aleatoriamente
- Campos de formulário podem ser enviados vazios

Com o Simulador de API ativado:
- Requisições podem ser atrasadas para testar indicadores de carregamento
- Requisições podem falhar aleatoriamente para testar tratamento de erros
- Diferentes códigos de erro (404, 500) podem ser simulados

### 4. Ganchos para Testes
- Atributos `data-testid` em elementos-chave para fácil seleção em testes
- IDs regulares em alguns elementos (mas não todos) para praticar diferentes estratégias de seleção
- Estrutura consistente para praticar seletores CSS
- Banco de dados SQLite para testes de integração reais
- Simulador de API para testar cenários de rede

## Credenciais de Teste

Para facilitar os testes, você pode usar as seguintes credenciais pré-configuradas:

- **Email**: user@example.com
- **Senha**: password123

Ou você pode criar sua própria conta através da página de registro. Todos os usuários são armazenados em um banco de dados SQLite local.

## Como Usar para Prática de Testes de QA

1. **Testes Básicos**: Pratique escrever casos de teste para o fluxo normal (com o Modo de Bugs desativado)
2. **Detecção de Bugs**: Ative o Modo de Bugs e escreva testes que possam detectar os bugs introduzidos
3. **Testes de Regressão**: Crie uma suíte de testes que funcione com e sem o Modo de Bugs
4. **Testes de Acessibilidade**: Verifique se a aplicação atende aos padrões de acessibilidade
5. **Testes de Desempenho**: Meça tempos de carregamento e métricas de desempenho
6. **Testes de Autenticação**: Verifique os fluxos de login, registro, perfil de usuário e recuperação de senha
7. **Testes de Banco de Dados**: Teste a persistência e integridade dos dados de usuário
8. **Testes de Resiliência**: Use o Simulador de API para testar como a aplicação lida com falhas de rede

## Simulador de API

A aplicação inclui um Simulador de API que permite controlar o comportamento das requisições de rede:

- **Atraso**: Configure o tempo de resposta das requisições (0-5000ms)
- **Taxa de Falha**: Defina a probabilidade de uma requisição falhar (0-100%)
- **Taxa de 404**: Defina a probabilidade de uma requisição retornar 404 (0-100%)
- **Taxa de 500**: Defina a probabilidade de uma requisição retornar 500 (0-100%)

O simulador pode ser acessado através do botão flutuante no canto inferior direito da tela.

## Integração com Frameworks de Teste

Esta aplicação é perfeita para praticar com frameworks de teste como:

1. **Playwright**: Para testes end-to-end
2. **Cypress**: Para testes de componentes e E2E
3. **Jest**: Para testes unitários de componentes e funções

## Estrutura do Banco de Dados

A aplicação utiliza SQLite para armazenar dados de usuários com as seguintes tabelas:

### Tabela `users`
- `id`: Identificador único do usuário
- `name`: Nome completo do usuário
- `email`: Email do usuário (único)
- `password`: Senha do usuário (hash)
- `created_at`: Data de criação da conta

### Tabela `user_addresses`
- `id`: Identificador único do endereço
- `user_id`: ID do usuário (referência à tabela users)
- `street`: Rua e número
- `city`: Cidade
- `state`: Estado
- `zip_code`: CEP
- `updated_at`: Data da última atualização

### Tabela `password_reset_tokens`
- `id`: Identificador único do token
- `user_id`: ID do usuário (referência à tabela users)
- `token`: Token de redefinição de senha
- `expires_at`: Data de expiração do token
- `created_at`: Data de criação do token

## Próximos Passos

Você pode estender esta aplicação para prática de QA mais avançada:

1. Implementando mais fluxos de autenticação (autenticação de dois fatores, etc.)
2. Adicionando validação de formulário mais complexa
3. Criando um documento de plano de teste para a aplicação
4. Implementando testes automatizados com Playwright ou Cypress

## Tecnologias Utilizadas

- Next.js (App Router)
- React
- Tailwind CSS
- Context API para gerenciamento de estado
- SQLite para persistência de dados
- better-sqlite3 para interação com o banco de dados
- bcryptjs para hash de senhas

## Como Executar o Projeto

1. Clone o repositório
2. Instale as dependências com `npm install`
3. Execute o servidor de desenvolvimento com `npm run dev`
4. Acesse `http://localhost:3000` no seu navegador

O banco de dados SQLite será criado automaticamente na primeira execução.
