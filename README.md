# FrontEnd Challenge Angular - Todo List

Este é um projeto fullstack criado como parte de um desafio de desenvolvimento. A aplicação é composta por um frontend desenvolvido em Angular que se comunica com três microserviços de backend, cada um responsável por diferentes aspectos do gerenciamento de tarefas, permitindo operações CRUD (Criar, Ler, Atualizar, Excluir).

## Estrutura do Projeto

- **Frontend:** Angular 18.2.6

## Funcionalidades

A aplicação permite:
1. **Incluir**: Adicionar novas tarefas ao sistema.
2. **Alterar**: Atualizar as informações de uma tarefas existente.
3. **Excluir**: Remover tarefas cadastradas.
4. **Ler**: Exibir  as tarefas cadastradas.

## Instalação

Siga as etapas abaixo para configurar e rodar a aplicação localmente:

1. Clone o repositório:
    ```bash
    git clone <git@github.com:GeovanaAugusta/fullstack-challenge-todo-angular.git>
    cd fullstack-challenge-todo-angular
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Execute o servidor de desenvolvimento Angular:
    ```bash
    npm start
    ```

   O frontend estará acessível em `http://localhost:4200`.

4. Certifique-se de que os microserviços de backend estão rodando nas seguintes portas:

- **Serviço de Tarefas**: `http://localhost:8000`
- **Serviço de Usuários**: `http://localhost:8001`
- **Serviço de Notificações**: `http://localhost:8002`

O frontend se comunicará com o backend através de um proxy configurado em `proxy.conf.json`.

## Arquivo de Proxy

A comunicação entre o frontend e o backend é realizada via proxy. O arquivo `proxy.conf.json` está configurado como abaixo:

```json
[
  {
    "context": [
      "/api/tasks"
    ],
    "target": "http://18.230.82.81:8081/api",
    "secure": false,
    "changeOrigin": true,
    "pathRewrite": {
      "^/api/tasks": "/tasks"
    }
  },
  {
    "context": [
      "/api/users"
    ],
    "target": "http://18.229.131.117:8080/api",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true,
    "pathRewrite": {
      "^/api/users": "/users"
    }
  }
]
