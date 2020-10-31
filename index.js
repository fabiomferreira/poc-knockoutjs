const formatter = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'});

function extraiNumeros(string) {
    const numeros = string.match(/\d+/g); 
    return numeros ? numeros.join('') / 100 : 0;
} 

function somaReducer(a, b) {
  return a + b;
}

function AppViewModel() {
  this.descricao = ko.observable('');
  this.valor = ko.observable('');
  this.tipo = ko.observable('despesa');

  this.despesas = ko.observableArray();
  this.receitas = ko.observableArray();

  this.handleValor = function () {
    const valor = this.valor();
    if(!valor) return;
    const numero = extraiNumeros(valor);
    const dinheiro = formatter.format(numero);

    this.valor(dinheiro)
  }
  this.salva = function () {
    const descricao = this.descricao();
    const valor = this.valor();
    if(!descricao || !valor || parseFloat(extraiNumeros(valor)) === 0) {
      alert('Verifique os campos obrigatórios.');
      return;
    }
    if(this.tipo() === 'despesa') {
      this.despesas.push({descricao, valor});
    } else {
      this.receitas.push({descricao, valor});
    }
    this.descricao('');
    this.valor('');
    alert('Salvo com sucesso!');
  }

  this.saldo = ko.computed(() => {
    const despesas = this.despesas.slice();
    const receitas = this.receitas.slice();
    const totalDespesas = despesas.length ? despesas.map(d => extraiNumeros(d.valor)).reduce(somaReducer) : 0;
    const totalReceitas = receitas.length ?  receitas.map(d => extraiNumeros(d.valor)).reduce(somaReducer) : 0;

    console.log(totalDespesas, totalReceitas)

    return formatter.format(totalReceitas - totalDespesas);
  })
}

ko.applyBindings(new AppViewModel());