'use strict';

export class FormatadorMoeda {
  constructor(input, opcoes = {}) {
    if (!input) throw new Error('Input inválido');
    this.input = input;
    this.opcoes = {
      requerido: true,
      mensagemRequerido: 'Este campo é obrigatório',
      ...opcoes
    };
    
    this.valorAnterior = '';
    this.posicaoAnterior = 0;
    
    this.configurarEventos();
  }
  
  normalizarNumero(valor) {
    if (!valor) return '';
    let numero = valor.replace(/[^\d,]/g, '');
    if (!/\d/.test(numero)) return '';
    return numero.replace(',', '.');
  }
  
  formatarValor(valor, posicaoCursor) {
    if (!valor) return { valor: '', cursor: 0 };
    
    let numeroLimpo = valor.replace(/[^\d,]/g, '');
    let partes = numeroLimpo.split(',');
    let parteInteira = partes[0].replace(/^0+/, '') || '0';
    let parteDecimal = partes[1] ? partes[1].slice(0, 2) : '';
    
    const inteiroFormatado = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const valorFinal = parteDecimal ? `${inteiroFormatado},${parteDecimal}` : inteiroFormatado;
    
    let novaPosicao = posicaoCursor;
    let pontosAntes = (valor.slice(0, posicaoCursor).match(/\./g) || []).length;
    let pontosDepois = (valorFinal.slice(0, novaPosicao).match(/\./g) || []).length;
    novaPosicao += pontosDepois - pontosAntes;
    
    return { valor: valorFinal, cursor: Math.max(0, Math.min(novaPosicao, valorFinal.length)) };
  }
  
  atualizarDataset(valor) {
    const numero = parseFloat(this.normalizarNumero(valor));
    this.input.dataset.value = !isNaN(numero) ? numero.toString() : '';
  }
  
  handleInput = (e) => {
    const posicaoCursor = e.target.selectionStart || 0;
    const valorAtual = e.target.value;
    if (valorAtual === this.valorAnterior) return;
    
    const { valor: valorFormatado, cursor: novaPosicao } = this.formatarValor(valorAtual, posicaoCursor);
    e.target.value = valorFormatado;
    e.target.setSelectionRange(novaPosicao, novaPosicao);
    
    this.valorAnterior = valorFormatado;
    this.posicaoAnterior = novaPosicao;
    
    this.atualizarDataset(valorFormatado);
    
    const evento = new CustomEvent('validacao', {
      detail: {
        valor: valorFormatado,
        numero: parseFloat(this.normalizarNumero(valorFormatado)) || null
      }
    });
    this.input.dispatchEvent(evento);
  }
  
  handleBlur = (e) => {
    const valor = e.target.value;
    const numero = parseFloat(this.normalizarNumero(valor));
    if (!isNaN(numero)) {
      e.target.value = numero.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      this.valorAnterior = e.target.value;
    }
  }
  
  handleFocus = (e) => {
    const valor = e.target.value.replace(/[^\d,]/g, '');
    e.target.value = valor;
    requestAnimationFrame(() => {
      const pos = Math.min(this.posicaoAnterior, valor.length);
      e.target.selectionStart = e.target.selectionEnd = pos;
    });
  }
  
  handlePaste = (e) => {
    e.preventDefault();
    const texto = (e.clipboardData || window.clipboardData).getData('text');
    const numeroLimpo = texto.replace(/[^\d,]/g, '');
    if (numeroLimpo) {
      const posicaoInicial = e.target.selectionStart || 0;
      const valorAtual = e.target.value;
      const novoValor = valorAtual.slice(0, posicaoInicial) + numeroLimpo + valorAtual.slice(e.target.selectionEnd || 0);
      e.target.value = novoValor;
      this.handleInput({ target: e.target });
    }
  }
  
  configurarEventos() {
    this.input.addEventListener('input', this.handleInput);
    this.input.addEventListener('blur', this.handleBlur);
    this.input.addEventListener('focus', this.handleFocus);
    this.input.addEventListener('paste', this.handlePaste);
  }
  
  destruir() {
    this.input.removeEventListener('input', this.handleInput);
    this.input.removeEventListener('blur', this.handleBlur);
    this.input.removeEventListener('focus', this.handleFocus);
    this.input.removeEventListener('paste', this.handlePaste);
  }
}