<template>
    <div v-if="produto">
      <template>
        <v-card class="d-flex flex-column align-center">
            <v-list-item-content>
              <v-list-item-title class="text-h5">
                {{ this.produto.descricao }}
              </v-list-item-title>
            </v-list-item-content>

          <v-card-actions>
            <v-btn
              outlined
              rounded
              text
              :disabled="this.desabilitar"
              @click="subtrair"
            >
              -
            </v-btn>
            <h1 class="mx-5">{{ this.quantidade }}</h1>
            <v-btn
              outlined
              rounded
              text
              :disabled="this.desabilitar"
              @click="somar"
            >
              +
            </v-btn>
          </v-card-actions>
          <v-card-actions>
            <v-btn
              outlined
              :disabled="this.desabilitar"
              rounded
              text
              @click="finalizarPedido"
            >
              Fechar item
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </div>
</template>

<script>
  export default {
    props: ['produto'],


    data: () => ({ 
        quantidade: 1,
        desabilitar: false,
    }),

    

    methods: {
      somar() {
        this.quantidade++
      },
      subtrair() {
        if (this.quantidade > 0) {
          this.quantidade--
        }
      },

      async finalizarPedido() {
        const valorTotal = this.produto.valoUnitario * this.quantidade;
        const pedidoFinal = this.produto;
        pedidoFinal['subtotal'] = valorTotal;
        pedidoFinal['quantidade'] = this.quantidade;
        pedidoFinal['valor'] = this.produto.valoUnitario;
        this.$store.dispatch('selecionarProdutosFinal', pedidoFinal);
        this.desabilitar = true
      },
    }
  }
</script>