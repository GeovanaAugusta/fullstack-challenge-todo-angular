# FrontEnd Challenge Angular - Todo List

Este é um projeto fullstack criado como parte de um desafio de desenvolvimento. A aplicação envolve um frontend desenvolvido em Angular que se comunica com um backend Java (Spring Boot) para realizar operações CRUD (Criar, Ler, Atualizar, Excluir).

## Estrutura do Projeto

- **Frontend:** Angular 18.2.6

## Funcionalidades

A aplicação permite:
1. **Incluir**: Adicionar novas tarefas ao sistema.
2. **Alterar**: Atualizar as informações de uma tarefas existente.
3. **Excluir**: Remover tarefas cadastradas.
4. **Pesquisar**: Buscar por tarefas já cadastradas.

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

4. Certifique-se de que o backend Java está rodando na porta 8000. O frontend se comunicará com o backend através de um proxy configurado em `proxy.conf.json`.

## Arquivo de Proxy

A comunicação entre o frontend e o backend é realizada via proxy. O arquivo `proxy.conf.json` está configurado como abaixo:

```json
{
    "/api/": {
      "target": "http://localhost:8000",
      "secure": false,
      "changeOrigin": true,
      "logLevel": "debug"
    }
}
