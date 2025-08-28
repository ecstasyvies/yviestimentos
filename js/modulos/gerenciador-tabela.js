export class GerenciadorTabela {
  constructor(elementos, state) {
    this.elementos = elementos;
    this.state = state;
  }
  
  formatarLinha(item) {
    return `
      <tr>
        <td data-label="Mês/Período">${item.periodo}</td>
        <td data-label="Juros no Período (R$)">R$ ${item.jurosPeriodo.toFixed(2)}</td>
        <td data-label="Total Investido (R$)">R$ ${item.totalInvestido.toFixed(2)}</td>
        <td data-label="Total de Juros (R$)">R$ ${item.totalJuros.toFixed(2)}</td>
        <td data-label="Montante Final (R$)">R$ ${item.montante.toFixed(2)}</td>
      </tr>
    `;
  }
  
  atualizarTabela() {
    this.elementos.tabelaBody.innerHTML = this.state.dadosTabelaCompleta
      .map(this.formatarLinha)
      .join('');
    
    const totalLinhas = this.state.dadosTabelaCompleta.length;
    const descricao = `Tabela mostrando evolução do investimento com ${totalLinhas} ${
      totalLinhas === 1 ? 'período' : 'períodos'
    }`;
    
    if (this.elementos.tabela) {
      this.elementos.tabela.setAttribute('aria-label', descricao);
    }
  }
}