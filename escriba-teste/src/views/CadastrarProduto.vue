<template>
  <div>
  <v-form
    class="ma-5"
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-text-field
      v-model="nome"
      :rules="nameRules"
      label="Name"
      required
    ></v-text-field>

    <v-text-field
      v-model="valor"
      :rules="nameRules"
      label="Valor do produto"
      required
    ></v-text-field>

    <v-btn
      :disabled="!valid"
      color="success"
      class="mr-4"
      @click="validate"
    >
      Cadastrar
    </v-btn>
  </v-form>
  <v-alert :type="tipoAlert" v-if="notificacao">
    {{textoAlert}}
  </v-alert>
  </div>
</template>

<script>
import { apiPeodutos } from '@/plugins/api';

  export default {
    data: () => ({
      valid: true,
      nome: '',
      valor: '',
      notificacao: false,
      textoAlert: '',
      tipoAlert: '',
      nameRules: [
        v => !!v || 'Campo obrigatorio!',
      ],
    }),

    methods: {
      async validate () {
        if (this.$refs.form.validate()) {
          this.somenteNumeros();
          if (!this.valor) {
            this.notificacao = true;
            this.tipoAlert = 'error';
            this.textoAlert = 'Digite numeros no campo valor!';
            setTimeout(() => {
              this.notificacao = false;
            }, 5000);
          } else {
            await apiPeodutos({
              method: "post",
              data: {
                descricao: this.nome,
                valoUnitario: this.valor,
              }
            })
            .then(() => {
              this.notificacao = true;
              this.tipoAlert = 'success';
              this.textoAlert = 'Produto cadastrado!';
              setTimeout(() => {
                this.notificacao = false;
                this.$router.go();
              }, 5000);
            })
            .catch(() => {
              this.notificacao = true;
              this.tipoAlert = 'error';
              this.textoAlert = 'Erro ao cadastrar novo produto!';
              setTimeout(() => {
                this.notificacao = false;
              }, 5000);
            })
          }
        }
      },

      somenteNumeros() {
        var er = /[^0-9.]/;
        er.lastIndex = 0;
        if (er.test(this.valor)) {
          this.valor = "";
        }
      }
    },
  }
</script>
