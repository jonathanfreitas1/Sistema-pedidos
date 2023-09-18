<template>
    <v-card
      class="mx-auto"
      max-width="344"
      outlined
    >
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="text-h5 mb-1">
            {{ this.produto.descricao }}
          </v-list-item-title>
          <v-list-item-subtitle>Valor: R${{ this.produto.valoUnitario }}</v-list-item-subtitle>
        </v-list-item-content>
  
      </v-list-item>
  
      <v-card-actions>
        <v-btn
          outlined
          rounded
          text
          v-if="!produtoSelecionado()"
          @click="adicionarProduto"
        >
          Comprar
        </v-btn>
        <v-btn
          outlined
          rounded
          text
          v-if="!produtoSelecionado()"
          @click="excluirProduto"
        >
          Excluir produto
        </v-btn>
        <v-btn
          outlined
          rounded
          text
          v-else
          @click="removerProduto"
        >
          Remover item
        </v-btn>
      </v-card-actions>
    </v-card>
</template>

<script>
import { apiPeodutos } from '@/plugins/api';
import { mapState } from 'vuex';
  export default {
    props: ['produto'],

    computed: mapState([
      'produtosSelecionados'
    ]),

    data: () => ({ 
        
    }),

    methods: {
        adicionarProduto() {
          this.$store.dispatch('selecionarProduto', this.produto);
        },
        removerProduto() {
            this.$store.dispatch('removerProduto', this.produto.id)
        },
        produtoSelecionado() {
            return this.produtosSelecionados.find(item => item.id == this.produto.id)
        },
        async excluirProduto() {
          await apiPeodutos({
          method: "delete",
          url: (`/${this.produto.id}`),
        })
        .then(() => {
          this.$router.go();
        })
        .catch(() => {
          console.log('erro')
        })
        }
    }
  }
</script>