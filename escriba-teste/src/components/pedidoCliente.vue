<template>
    <div class="mx-5">
        <div v-if="this.pedido">
            <h1>{{ this.pedido }}</h1>
        </div>
        <div v-else>
            <template>
                <v-simple-table>
                    <template v-slot:default>
                    <thead>
                        <tr>
                        <th class="text-left">
                            Produto
                        </th>
                        <th class="text-left">
                            Quantidade
                        </th>
                        <th class="text-left">
                            Valor unidade
                        </th>
                        <th class="text-left">
                            Valor total
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                        v-for="item in pedidosDoCliente"
                        :key="item.name"
                        >
                        <td>{{ item.descricao }}</td>
                        <td>{{ item.quantidade }}</td>
                        <td>{{ item.valor }}</td>
                        <td>{{ item.subtotal }}</td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
            </template>
            <v-alert :type="tipoAlert" v-if="notificacao">
                {{textoAlert}}
            </v-alert>
            <v-btn
              outlined
              rounded
              text
              @click="excluirPedido"
            >
              Excluir pedido
            </v-btn>
        </div>
    </div>
</template>

<script>
import { apiPedidos } from '@/plugins/api';
  export default {

    data: () => ({ 
        pedido: '',
        pedidosDoCliente: '',
        pedidoDoCliente: '',
        idDoPedido: '',
        visualizarPedidos: false,
        notificacao: false,
        textoAlert: '',
        tipoAlert: '',
    }),

    created() {
        this.carregarPedido();
    },

    methods: {
        async carregarPedido() {
            const { id } = this.$route.params;
            await apiPedidos.get(`/${id}`)
            .then(res => {
                this.pedidosDoCliente = res.data.itens    
                this.idDoPedido = res.data.id
            })
            .catch(() => {
                this.pedido = "Cliente não tem pedido"
            })
        },

        async excluirPedido() {
            await apiPedidos.delete(`/${this.idDoPedido}`)
            .then(() => {
                this.carregarPedido();
            })
            .catch(() => {
                this.notificacao = true;
                this.tipoAlert = 'error';
                this.textoAlert = 'Não foi possivel excluir pedido!';
                setTimeout(() => {
                    this.notificacao = false;
                }, 5000);
            })
        }
    }
  }
</script>