function AppViewModel() {
  this.descricao = ko.observable('');
  this.valor = ko.observable('');
  this.salva = function () {
    console.log(this.descricao());
  }
}

ko.applyBindings(new AppViewModel());