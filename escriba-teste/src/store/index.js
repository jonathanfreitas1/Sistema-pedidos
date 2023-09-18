import Vue from 'vue'
import Vuex from 'vuex'
import { apiPeodutos, apiPessoas, apiPedidos } from '../plugins/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    clientes: [],
    cliente: '',
    produtos: [],
    produtosSelecionados: [],
    produtosFinal: [],
    erro: null,
    produtoRepetido: null,
  },
  getters: {
  },
  mutations: {
    carregarClientes(state, clientes) {
      state.clientes = clientes;
    },

    carregarCliente(state, cliente) {
      state.cliente = cliente
    },

    carregarProdutos(state, produtos) {
      state.produtos = produtos;
    },

    selecionarProduto(state,produto) {
        state.produtosSelecionados.push(produto);
    },

    async selecionarProdutosFinal(state, produto) {
      state.produtosFinal.push(produto);
    },

    cancelarPedido(state) {
      state.produtosSelecionados = [];
    },

    async finalizarPedido(state) {
      var total = state.produtosFinal.reduce(function(acumulador, item){
        return acumulador + item.subtotal
      }, 0)
      await apiPedidos({
        method: "post",
        data: {
          id: state.cliente.id,
          itens: state.produtosFinal,
          valorTotal: total
        }
      })
      .then(() => {
        this.$router.go();
      })
      .catch(() => {
        state.erro = 'Cliente já tem pedido ou erro na requisição!'
      })
    },

    removerProduto(state, id) {
      var aux = state.produtosSelecionados.filter(item => id != item.id);
      state.produtosSelecionados = aux;
    },

    limparErro(state) {
      state.erro = null;
    },

    carregarErro(state) {
      state.erro = "Não foi possivel carregar dados"
    }
  },
  actions: {
    async carregarClientes() {
      await apiPessoas.get()
      .then(res => {
        this.commit('carregarClientes', res.data);
      })
      .catch(() => {
        this.commit('carregarErro');
      })
    },

    async carregarCliente({ commit }, id) {
      await apiPessoas.get(`/${id}`)
      .then(res => {
        commit('carregarCliente', res.data);
      })
      .catch(() => {
        this.commit('carregarErro');
      })
    },

    async carregarProdutos() {
      await apiPeodutos.get()
      .then(res => {
        this.commit('carregarProdutos', res.data);
      })
      .catch(() => {
        this.commit('carregarErro');
      })
    },

    selecionarProduto({ commit }, produto) {
      commit('selecionarProduto', produto);
    },

    selecionarProdutosFinal({ commit }, produto) {
      commit('selecionarProdutosFinal', produto);
    },

    cancelarPedido() {
      this.commit('cancelarPedido');
    },
    finalizarPedido() {
      this.commit('finalizarPedido');
    },

    removerProduto({commit}, id) {
      commit('removerProduto', id);
    },

    limparErro() {
      this.commit('limparErro');
    }

  },
  modules: {
  }
})
