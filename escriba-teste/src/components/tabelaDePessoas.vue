<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div>
  <div>
    <h1 class="font-weight-bold ma-5">
      Lista de cliente
    </h1>
  </div>
  <v-card class="ma-5">
    <v-card-title>
      <v-text-field
        v-model="buscar"
        append-icon="mdi-magnify"
        label="Buscar"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="clientes"
      :items-per-page="5"
      :search="buscar"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>Clientes</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                Cadastrar
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Cadastrar novo cliente</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                    >
                      <v-text-field
                        v-model="nomeCliente"
                        label="Nome"
                        :rules="[v => !!v || 'Campo obrigatorio!']"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                    >
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
                    </v-col>
                    <v-col
                      cols="12"
                    >
                      <v-text-field
                        v-model="cpf"
                        label="CPF"
                        :rules="cpfRules"
                        v-mask="'###.###.###-##'"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-alert :type="tipoAlert" v-if="notificacao">
                        {{textoAlert}}
                      </v-alert>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="fechar"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  color="success"
                  text
                  :disabled=invalido
                  @click="salvar"
                >
                  Salvar
                </v-btn>
              </v-card-actions> 
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDeletar" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Deseja realmente excluir o cliente?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="cancelarExclusaoCliente">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deletarCliente">Excluir</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          class="mr-2"
          color="primary"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          color="red"
          @click="confirmarExclusaoCliente(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import * as moment from 'moment';
import { validate } from 'gerador-validador-cpf'
import { apiPessoas } from '@/plugins/api';

export default {
  computed: mapState([
    'clientes'
  ]),
  
  data() {
    return {
      buscar: '',
      data: '',
      dataHoje: moment().locale('br').format('L'),
      dialog: false,
      dialogDeletar: false,
      cliente: null,
      menu: false,
      notificacao: false,
      invalido: true,
      textoAlert: '',
      tipoAlert: '',
      nomeCliente: '',
      dataNascimento: '',
      cpf: '',
      headers: [
        {
          text: 'Cliente',
          align: 'start',
          sortable: false,
          value: 'nome',
        },
        { text: 'Data de nascimento', value: 'dataNascimento', sortable: false, },
        { text: 'CPF', value: 'cpf', sortable: false, },
        { text: 'ações', value: 'actions', sortable: false}
      ],
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

  watch: { 
    nomeCliente() {
      if (this.nomeCliente != '') {
        var patternData = /^(((0[1-9]|[12][0-9]|3[01])([-./])(0[13578]|10|12)([-./])(\d{4}))|(([0][1-9]|[12][0-9]|30)([-./])(0[469]|11)([-./])(\d{4}))|((0[1-9]|1[0-9]|2[0-8])([-./])(02)([-./])(\d{4}))|((29)(\.|-|\/)(02)([-./])([02468][048]00))|((29)([-./])(02)([-./])([13579][26]00))|((29)([-./])(02)([-./])([0-9][0-9][0][48]))|((29)([-./])(02)([-./])([0-9][0-9][2468][048]))|((29)([-./])(02)([-./])([0-9][0-9][13579][26])))$/;
        if (patternData.test(this.dataNascimento) && this.dataNascimento < this.dataHoje) { 
          if (validate(this.cpf)) {
            this.invalido = false;
          } else {
            this.invalido = true;
          }
        } else {
          this.invalido = true;
        }
      } else {
        this.invalido = true;
      }
    },
    data() {
      this.dataNascimento = this.formatarData(this.data);
      var patternData = /^(((0[1-9]|[12][0-9]|3[01])([-./])(0[13578]|10|12)([-./])(\d{4}))|(([0][1-9]|[12][0-9]|30)([-./])(0[469]|11)([-./])(\d{4}))|((0[1-9]|1[0-9]|2[0-8])([-./])(02)([-./])(\d{4}))|((29)(\.|-|\/)(02)([-./])([02468][048]00))|((29)([-./])(02)([-./])([13579][26]00))|((29)([-./])(02)([-./])([0-9][0-9][0][48]))|((29)([-./])(02)([-./])([0-9][0-9][2468][048]))|((29)([-./])(02)([-./])([0-9][0-9][13579][26])))$/;
      if (patternData.test(this.dataNascimento)) {
        if (this.dataNascimento < this.dataHoje) {
          this.notificacao = false;
          if (validate(this.cpf)) {
            if (this.nomeCliente != '') {
              this.invalido = false;
            } else {
              this.invalido = true;
            }
          } else {
            this.invalido = true;
          }
        } else {
          this.invalido = true;
          this.notificacao = true;
          this.tipoAlert = 'error';
          this.textoAlert = 'Data não pode ser maior que hoje!';
        }
      } else {
        this.invalido = true;
      }
    },
    cpf() {
      if (validate(this.cpf)) {
        this.notificacao = false;
        var patternData = /^(((0[1-9]|[12][0-9]|3[01])([-./])(0[13578]|10|12)([-./])(\d{4}))|(([0][1-9]|[12][0-9]|30)([-./])(0[469]|11)([-./])(\d{4}))|((0[1-9]|1[0-9]|2[0-8])([-./])(02)([-./])(\d{4}))|((29)(\.|-|\/)(02)([-./])([02468][048]00))|((29)([-./])(02)([-./])([13579][26]00))|((29)([-./])(02)([-./])([0-9][0-9][0][48]))|((29)([-./])(02)([-./])([0-9][0-9][2468][048]))|((29)([-./])(02)([-./])([0-9][0-9][13579][26])))$/;
        if (patternData.test(this.dataNascimento) && this.dataNascimento < this.dataHoje) {
          if (this.nomeCliente != '') {
            this.invalido = false;
          } else {
            this.invalido = true;
          }
        } else {
          this.invalido = true;
        }
      } else {
        this.invalido = true;
        this.notificacao = true;
        this.tipoAlert = 'error';
        this.textoAlert = 'CPF invalido!';
      }
    }
  },

  methods: {
    editItem(item) {
      this.$router.push(`/cliente/${item.id}`);
    },
    confirmarExclusaoCliente(item) {
      this.cliente = item;
      this.dialogDeletar = true;
    },
    cancelarExclusaoCliente() {
      this.dialogDeletar = false;
    },
    async deletarCliente() {
      await apiPessoas({
        method: 'delete',
        url: `/${this.cliente.id}`,
      }).then(() => {
        this.$store.dispatch('carregarClientes')
        this.dialogDeletar = false;
      })
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

    fechar () {
      this.dialog = false
    },

    async salvar() {
      await apiPessoas({
        method: "post",
        data: {
          nome: this.nomeCliente,
          dataNascimento: this.data,
          cpf: this.cpf
        }
      })
      this.$store.dispatch('carregarClientes')
      this.dialog = false
    },
  }
  }
</script>