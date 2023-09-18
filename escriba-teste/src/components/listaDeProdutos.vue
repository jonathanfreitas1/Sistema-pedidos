<template>
    <div class="ma-5">
        <div v-if="!esconderBotoes">
            <v-btn
                v-if="!this.visualizarProdutos"
                class=""
                depressed
                color="primary"
                @click="fazerPedido"
            >
                Fazer pedido
            </v-btn>
            <v-btn
                v-if="this.visualizarProdutos"
                class="mr-5"
                depressed
                color="primary"
                @click="cancelarPedido"
            >
                Cancelar pedido
            </v-btn>
            <v-btn
                v-if="this.visualizarProdutos"
                class=""
                depressed
                color="primary"
                @click="informarQuantiade"
            >
                Informar quantidade
            </v-btn>
        </div>
        <div v-if="this.visualizarProdutos">
            <div>
                <h1 class="font-weight-bold my-5">
                    Produtos
                </h1>
            </div>
            <v-row>
                <v-col
                    cols="12" md="4"
                    v-for="item in this.produtos"
                    :key="item.id"
                >
                    <cardProdutos :produto="item"/>
                </v-col>
            </v-row>
        </div>

        <div v-if="finalizar">
            <h1>Finalizar pedido</h1>
            <v-alert class="" :type="tipoAlert" v-if="notificacao">
                {{textoAlert}}
            </v-alert>
            <v-row>
                <v-col 
                    cols="12" md="3" class=""
                    v-for="item in produtosSelecionados" 
                    :key="item.id"
                >
                    <finalizarCompra :produto="item"/>
                </v-col>
            </v-row>
        </div>
        <v-btn
            v-if="esconderBotoes"
            class="mt-5"
            depressed
            color="primary"
            @click="salvarPedido"
        >
            Finalizar
        </v-btn>  
    </div>
</template>

<script>
import { mapState } from 'vuex';
import cardProdutos from './cardProduto.vue'
import finalizarCompra from './finalizarCompra.vue'

  export default {
    props: ['produto'],

    computed: mapState([
      'produtos',
      'produtosSelecionados',
      'produtosFinal',
      'erro'

    ]),

    components: { cardProdutos, finalizarCompra },

    data: () => ({ 
        visualizarProdutos: false,
        finalizar: false,
        esconderBotoes: false,
        produtosParaFinalizar: [],
        notificacao: false,
        textoAlert: '',
        tipoAlert: '',
    }),

    watch: {
      erro() {
        if (this.erro) {
          this.notificacao = true;
          this.tipoAlert = 'error';
          this.textoAlert = this.erro;
          this.$store.dispatch('limparErro');
          setTimeout(() => {
            this.notificacao = false;
            this.$router.go();
          }, 5000);
        }
      }
    },

    created() {
        this.$store.dispatch('carregarProdutos');
    },

    methods: {
        fazerPedido() {
            this.visualizarProdutos = true;
        },
        cancelarPedido() {
            this.visualizarProdutos = false;
            this.esconderBotoes = false;
            this.$store.dispatch('cancelarPedido');
            
        },
        informarQuantiade() {
            this.finalizar = true;
            this.esconderBotoes = true;
            this.visualizarProdutos = false;
        },
        salvarPedido() {
            this.$store.dispatch('finalizarPedido');
            this.esconderBotoes = false;
        }
    }
  }
</script>