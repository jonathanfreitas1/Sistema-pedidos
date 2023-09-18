# escriba-teste

# Resumo do sistema
Este projeto se trata de uma aplicação web desenvolvida de forma genérica para a realização de pedidos de quaisquer produtos, servindo de base para qualquer ramo ou área que trabalhe com esse tipo de solução. Nesse sistema, o usuário pode gerenciar clientes, gerenciar produtos e realizar pedidos.

# Construído com
- Vue.JS
- Vuetify
- Vueex
- Vuerouter
- Axius

# Pré-requisitos
- Node.JS
- VueCLI

## Instalação

O foco do projeto não incluía a criação de uma api, então foi disponibilizado uma serviço Rest, o qual foi utilizado para recuperar dados e construir o projeto.
Para rodar o serviço Rest, é necessário instalar o json-server com o seguinte comando:

npm install -g json-server

Apos a instalação, dê o comando abaixo para habilitar o serviço Rest:

json-server --watch data.json

Para iniciar a aplicação web front-and, é preciso instalar as dependências com o seguinte comando:

npm install

E logo em seguida o comando abaixo: 

npm run serve

Por fim, o serviço irá rodar na porta 8080 (http://localhost:8080/)

# Contato
Jonathan Freitas - freitasjonathan3@gmail.com

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
