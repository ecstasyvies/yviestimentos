'use strict';

export const formatador = {
  moeda(valor, formatoCompleto = true) {
    if (typeof valor !== 'number' || isNaN(valor)) return '';
    
    const opcoes = {
      style: formatoCompleto ? 'currency' : 'decimal',
      currency: 'BRL',
      minimumFractionDigits: formatoCompleto ? 2 : 0,
      maximumFractionDigits: 2
    };
    
    return valor.toLocaleString('pt-BR', opcoes);
  },
  
  porcentagem(valor) {
    if (typeof valor !== 'number' || isNaN(valor)) return '';
    return valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + '%';
  },
  
  normalizarNumero(valor) {
    if (!valor) return '';
    const apenasNumerosEDecimais = valor.replace(/[^\d,.-]/g, '');
    if (!/\d/.test(apenasNumerosEDecimais)) return '';
    
    const partes = apenasNumerosEDecimais.split(/[,.]/);
    if (partes.length > 2) {
      const inteiros = partes.slice(0, -1).join('');
      const decimais = partes[partes.length - 1];
      return inteiros + '.' + decimais;
    }
    
    return apenasNumerosEDecimais.replace(',', '.');
  },
  
  formatarEntradaMoeda(valor, posicaoCursor) {
    const numeroLimpo = this.normalizarNumero(valor);
    if (!numeroLimpo) return { valor: '', cursor: 0 };
    
    let [parteInteira, parteDecimal = ''] = numeroLimpo.split('.');
    parteInteira = parteInteira.replace(/^0+/, '') || '0';
    parteDecimal = parteDecimal.slice(0, 2);
    
    const valorNumerico = parseFloat(parteInteira + '.' + (parteDecimal.padEnd(2, '0')));
    const valorFormatado = this.moeda(valorNumerico, false).replace(/\s/g, '');
    
    let novaPosicao = posicaoCursor;
    const diferencaTamanho = valorFormatado.length - valor.length;
    novaPosicao += diferencaTamanho;
    
    return {
      valor: valorFormatado,
      cursor: Math.max(0, Math.min(novaPosicao, valorFormatado.length))
    };
  }
};