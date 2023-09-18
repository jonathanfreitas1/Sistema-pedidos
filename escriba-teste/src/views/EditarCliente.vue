<template>
  <div>
    <template>
      <div>
        <h1 class="font-weight-bold ma-5">
          Editar cliente
        </h1>
      </div>
      <v-card class="ma-5">
        <v-form
          class="pa-5"
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            v-model="nome"
            :rules="[v => !!v || 'Campo obrigatorio!']"
            label="Nome"
            required
          ></v-text-field>

          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dataNascimento"
                label="Data de nascimento"
                v-mask="'##/##/####'"
                :rules="dataRules"
                v-bind="attrs"
                v-on="on"
                @blur="data = parseDate(dataNascimento)"
                maxlength="500"
              ></v-text-field>
            </template>
              <v-date-picker
                v-model="data"
                locale="pt-BR"
                no-title
                @input="menu = false"
              ></v-date-picker>
            </v-menu>

          <v-text-field
            v-model="cpf"
            label="CPF"
            :rules="cpfRules"
            v-mask="'###.###.###-##'"
          ></v-text-field>

          <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="editarCliente"
          >
            Salvar
          </v-btn>
        </v-form>
      </v-card>
      <v-col cols="12">
        <v-alert :type="tipoAlert" v-if="notificacao">
          {{textoAlert}}
        </v-alert>
      </v-col>
    </template>
    <pedidoCliente/>
    <listaDeProdutos/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import * as moment from 'moment';
import { validate } from 'gerador-validador-cpf'
import listaDeProdutos from '../components/listaDeProdutos.vue';
import pedidoCliente from '../components/pedidoCliente.vue';
import { apiPessoas } from '@/plugins/api';


  export default {
    
    components: { listaDeProdutos, pedidoCliente },

    data() {
      return {
        valid: true,
        menu: false,
        nome: '',
        dataNascimento: '',
        data: '',
        cpf: '',
        notificacao: false,
        textoAlert: '',
        visualizarPedidos: false,
        dataRules: [
          (v) => !!v || 'Campo obrigatorio!',
          (v) => moment(v, 'DD/MM/YYYY', true).isValid() || 'Data inválida!',
        ],
        cpfRules: [
          v => !!v || 'Campo obrigatorio!',
          v => v.length >= 14 || 'CPF tem 14 caracteres',
        ]
      }
    },

    computed: mapState([
      'cliente',
    ]),
  
    created() {
      const { id } = this.$route.params;
      this.$store.dispatch('carregarCliente', id);
    },

    watch: {
      data() {
        this.dataNascimento = this.formatarData(this.data);
      },
      cliente() {
        this.carregarDadosDoCliente();
      },
    },

    methods: {
      carregarDadosDoCliente() {
        if (this.cliente) {
          this.nome = this.cliente.nome;
          this.dataNascimento = this.formatarData(this.cliente.dataNascimento);
          this.data = this.cliente.dataNascimento;
          this.cpf = this.cliente.cpf;
        }
      },
      async editarCliente() {
        var patternData = /^(((0[1-9]|[12][0-9]|3[01])([-./])(0[13578]|10|12)([-./])(\d{4}))|(([0][1-9]|[12][0-9]|30)([-./])(0[469]|11)([-./])(\d{4}))|((0[1-9]|1[0-9]|2[0-8])([-./])(02)([-./])(\d{4}))|((29)(\.|-|\/)(02)([-./])([02468][048]00))|((29)([-./])(02)([-./])([13579][26]00))|((29)([-./])(02)([-./])([0-9][0-9][0][48]))|((29)([-./])(02)([-./])([0-9][0-9][2468][048]))|((29)([-./])(02)([-./])([0-9][0-9][13579][26])))$/;
        const dataHoje = moment().locale('br').format('L');
        if (this.nome == '') {
          this.notificacao = true;
          this.tipoAlert = 'error';
          this.textoAlert = 'Nome não pode ser vazio!';
          setTimeout(() => {
            this.notificacao = false;
          }, 5000);
        } else if (!patternData.test(this.dataNascimento)) {
          this.notificacao = true;
          this.tipoAlert = 'error';
          this.textoAlert = 'Data invalida!';
          setTimeout(() => {
            this.notificacao = false;
          }, 5000);
        } else if (this.dataNascimento > dataHoje) {
          this.notificacao = true;
          this.tipoAlert = 'error';
          this.textoAlert = 'Data não pode ser maior que hoje!';
          setTimeout(() => {
            this.notificacao = false;
          }, 5000);
        } else if (!validate(this.cpf)) {
          this.notificacao = true;
          this.tipoAlert = 'error';
          this.textoAlert = 'CPF invalido!';
          setTimeout(() => {
            this.notificacao = false;
          }, 5000);
        } else {
          const { id } = this.$route.params;
          await apiPessoas({
            method: "put",
            url: `/${id}`,
            data: {
              nome: this.nome,
              dataNascimento: this.data,
              cpf: this.cpf
            }
          })
          .then(() => {
            this.notificacao = true;
            this.tipoAlert = 'success';
            this.textoAlert = 'Salvo com sucesso!';
            setTimeout(() => {
              this.notificacao = false;
            }, 5000);
          })
          .catch(() => {
            this.notificacao = true;
            this.tipoAlert = 'error';
            this.textoAlert = 'Não foi possivel editar cliente!';
            setTimeout(() => {
              this.notificacao = false;
            }, 5000);
          })
        }
      },

      formatarData(date) {
        if (date) {
          const [year, month, day] = date.split('-');
          return `${day}/${month}/${year}`;
        }
        return null;
      },

      parseDate(date) {
        if (date) {
          const [day, month, year] = date.split('/');
          return `${year}-${month}-${day}`;
        }
        return null;
      },
    }
  }
</script>
