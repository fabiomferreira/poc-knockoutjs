let request;
if (!window.indexedDB) {
  console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
} else {
  request = window.indexedDB.open("ControleFinanceiro", 3)
}

const formatter = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'});

function extraiNumeros(string) {
    const numeros = string.match(/\d+/g); 
    return numeros ? numeros.join('') / 100 : 0;
} 

function somaReducer(a, b) {
  return a + b;
}

function AppViewModel() {
  const self = this;

  self.descricao = ko.observable('');
  self.valor = ko.observable('');
  self.valor.subscribe(handleValor);
  self.tipo = ko.observable('despesa');
  self.alerta = {
    tipo: ko.observable(''),
    mensagem: ko.observable('')
  }
  self.modal = {
    mensagem: ko.observable(''),
    callback: () => {},
  }

  self.despesas = ko.observableArray();
  self.receitas = ko.observableArray();

  function handleValor(valor) {
    if(!valor) return;
    const numero = extraiNumeros(valor);
    const dinheiro = formatter.format(numero);

    self.valor(dinheiro)
  }

  self.salva = function () {
    const descricao = this.descricao();
    const valor = this.valor();
    const tipo = this.tipo();
    if(!descricao || !valor || parseFloat(extraiNumeros(valor)) === 0) {
      self.alerta.mensagem('Verifique os campos.');
      self.alerta.tipo('alert-danger');
      return;
    }
    if(tipo === 'despesa') {
      this.despesas.push({descricao, valor, tipo});
    } else {
      this.receitas.push({descricao, valor, tipo});
    }
    this.descricao('');
    this.valor('');
    self.alerta.mensagem('Salvo com sucesso!');
    self.alerta.tipo('alert-success');
  }

  self.saldo = ko.computed(() => {
    const despesas = self.despesas.slice();
    const receitas = self.receitas.slice();
    const totalDespesas = despesas.length ? despesas.map(d => extraiNumeros(d.valor)).reduce(somaReducer) : 0;
    const totalReceitas = receitas.length ?  receitas.map(d => extraiNumeros(d.valor)).reduce(somaReducer) : 0;

    return formatter.format(totalReceitas - totalDespesas);
  })

  self.remover = function(registro) {
    self.modal.mensagem('Você tem certeza que deseja remover esse registro?');
    self.modal.callback = () => {
      if(registro.tipo === 'despesa') {
        self.despesas.remove(registro);
      } else {
        self.receitas.remove(registro);
      }
      self.alerta.tipo('alert-success');
      self.alerta.mensagem('Registro removido com sucesso!');
    };
  }

  self.editar = function(registro) {
    self.modal.mensagem('Você tem certeza que deseja editar esse registro?');
    self.modal.callback = () => {
      if(registro.tipo === 'despesa') {
        self.despesas.remove(registro);
      } else {
        self.receitas.remove(registro);
      }
      self.descricao(registro.descricao);
      self.valor(registro.valor);
      self.tipo(registro.tipo);
    };
  }
}

ko.components.register('tabela-registros', {
  viewModel: function(params) {
      this.items = params.value;
      this.remover = params.remover;
      this.editar = params.editar;
  },
  template:
    `<table class="table">
      <thead class="thead-dark">
        <tr>
          <th scope="col">Descrição</th>
          <th scope="col">Valor</th>
          <th scole="col"></th>
        </tr>
        </tr>
      </thead>
      <tbody data-bind="foreach: items">
        <tr>
          <td data-bind="text: descricao"></td>
          <td data-bind="text: valor"></td>
          <td align="right">
            <button data-bind="click: $parent.remover" type="button" class="btn btn-danger" data-toggle="modal"
              data-target="#modalConfirmacao">
              <i class="fas fa-trash"></i>
            </button>
            <button data-bind="click: $parent.editar" type="button" class="btn btn-primary" data-toggle="modal"
              data-target="#modalConfirmacao">
              <i class="fas fa-edit"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>`
});

ko.applyBindings(new AppViewModel());