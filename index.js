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
  self.tipo = ko.observable('despesa');

  self.despesas = ko.observableArray();
  self.receitas = ko.observableArray();

  self.handleValor = function () {
    const valor = this.valor();
    if(!valor) return;
    const numero = extraiNumeros(valor);
    const dinheiro = formatter.format(numero);

    this.valor(dinheiro)
  }
  self.salva = function () {
    const descricao = this.descricao();
    const valor = this.valor();
    const tipo = this.tipo();
    if(!descricao || !valor || parseFloat(extraiNumeros(valor)) === 0) {
      alert('Verifique os campos obrigatórios.');
      return;
    }
    if(tipo === 'despesa') {
      this.despesas.push({descricao, valor, tipo});
    } else {
      this.receitas.push({descricao, valor, tipo});
    }
    this.descricao('');
    this.valor('');
    alert('Salvo com sucesso!');
  }

  self.saldo = ko.computed(() => {
    const despesas = self.despesas.slice();
    const receitas = self.receitas.slice();
    const totalDespesas = despesas.length ? despesas.map(d => extraiNumeros(d.valor)).reduce(somaReducer) : 0;
    const totalReceitas = receitas.length ?  receitas.map(d => extraiNumeros(d.valor)).reduce(somaReducer) : 0;

    return formatter.format(totalReceitas - totalDespesas);
  })

  self.remover = function(registro) {
    if(!confirm("Tem certeza que deseja excluir esse registro?")) return;
    if(registro.tipo === 'despesa') {
      self.despesas.remove(registro);
    } else {
      self.receitas.remove(registro);
    }
  }

  self.editar = function(registro) {
    if(!confirm("Tem certeza que deseja editar esse registro?")) return;
    if(registro.tipo === 'despesa') {
      self.despesas.remove(registro);
    } else {
      self.receitas.remove(registro);
    }
    self.descricao(registro.descricao);
    self.valor(registro.valor);
    self.tipo(registro.tipo);
  }
}

ko.applyBindings(new AppViewModel());