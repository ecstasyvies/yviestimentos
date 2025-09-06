'use strict';

export class GerenciadorTabela {
  constructor(elementos, state) {
    this.elementos = elementos;
    this.state = state;
    this.configurarEventListeners();
  }
  
  configurarEventListeners() {
    // Adicionar listener para o botão de exportação quando ele for criado
    document.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'botao-exportar-csv') {
        this.exportarParaCSV();
      }
    });
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
  
  gerarNomeArquivo() {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    const hora = String(agora.getHours()).padStart(2, '0');
    const minuto = String(agora.getMinutes()).padStart(2, '0');
    
    return `investimento_${ano}${mes}${dia}_${hora}${minuto}.csv`;
  }
  
  formatarValorParaCSV(valor) {
    // Remove o "R$ " e converte para formato numérico com ponto decimal
    return valor.replace('R$ ', '').replace(',', '.');
  }
  
  exportarParaCSV() {
    if (!this.state.dadosTabelaCompleta || this.state.dadosTabelaCompleta.length === 0) {
      console.warn('Nenhum dado disponível para exportação');
      return;
    }
    
    try {
      // Cabeçalhos do CSV
      const cabecalhos = [
        'Mês/Período',
        'Juros no Período (R$)',
        'Total Investido (R$)',
        'Total de Juros (R$)',
        'Montante Final (R$)'
      ];
      
      // Converter dados para formato CSV
      const linhasCSV = this.state.dadosTabelaCompleta.map(item => [
        item.periodo,
        this.formatarValorParaCSV(`R$ ${item.jurosPeriodo.toFixed(2)}`),
        this.formatarValorParaCSV(`R$ ${item.totalInvestido.toFixed(2)}`),
        this.formatarValorParaCSV(`R$ ${item.totalJuros.toFixed(2)}`),
        this.formatarValorParaCSV(`R$ ${item.montante.toFixed(2)}`)
      ]);
      
      // Combinar cabeçalhos e dados
      const dadosCompletos = [cabecalhos, ...linhasCSV];
      
      // Converter para string CSV com codificação UTF-8 BOM para compatibilidade com Excel
      const csvContent = dadosCompletos
        .map(linha => linha.map(campo => `"${campo}"`).join(','))
        .join('\n');
      
      // Adicionar BOM para compatibilidade com Excel
      const bom = '\uFEFF';
      const csvComBOM = bom + csvContent;
      
      // Criar blob e fazer download
      const blob = new Blob([csvComBOM], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', this.gerarNomeArquivo());
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        console.error('Download não suportado neste navegador');
      }
      
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
    }
  }
}