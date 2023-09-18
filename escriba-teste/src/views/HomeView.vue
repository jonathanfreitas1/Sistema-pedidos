<template>
  <div>
    <v-col cols="12">
      <v-alert :type="tipoAlert" v-if="notificacao">
        {{textoAlert}}
      </v-alert>
    </v-col>
    <tabelaDePessoas />
  </div>
</template>

<script>
import tabelaDePessoas from '../components/tabelaDePessoas.vue';
import { mapState } from 'vuex';
  export default {
    
    components: { tabelaDePessoas },

    computed: mapState([
      'erro'
    ]),

    data() {
      return {
        notificacao: false,
        textoAlert: '',
        tipoAlert: '',
      }
    },
    watch: {
      erro() {
        if (this.erro != null) {
          this.notificacao = true;
          this.tipoAlert = 'error';
          this.textoAlert = this.erro;
          setTimeout(() => {
            this.notificacao = false;
          }, 10000);
        }
      }
    },
    created() {
      this.$store.dispatch('carregarClientes')
    }
  }
</script>
