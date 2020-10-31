const formatter = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'});
function AppViewModel() {
  this.descricao = ko.observable('');
  this.valor = ko.observable('');

  this.despesas = ko.observableArray()
  this.handleValor = function () {
    const valor = this.valor();
    if(!valor) return;
    const numeros = valor.match(/\d+/g); 
    const numero = numeros ? numeros.join('') / 100 : 0;
    const dinheiro = formatter.format(numero);

    this.valor(dinheiro)
  }
  this.salva = function () {
    this.despesas.push({descricao: this.descricao(), valor: this.valor()});
    console.log(this.descricao(), this.valor());
  }
}

ko.applyBindings(new AppViewModel());