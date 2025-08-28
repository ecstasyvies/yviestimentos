export class FormatadorPorcentagem {
  constructor(input, opcoes = {}) {
    if (!input) throw new Error('Input inválido');
    this.input = input;
    this.opcoes = {
      requerido: true,
      mensagemRequerido: 'Este campo é obrigatório',
      minimo: 0,
      maximo: 100,
      incrementoPadrao: 0.1,
      incrementoCtrl: 0.5,
      incrementoShift: 1,
      ...opcoes
    };
    
    this.valorAnterior = '';
    this.posicaoAnterior = 0;
    
    this.configurarEventos();
  }
  
  normalizarNumero(valor) {
    if (!valor) return '';
    let numero = valor.replace(/[^\d,.-]/g, '').replace('%', '');
    if (!/\d/.test(numero)) return '';
    return numero.replace(',', '.');
  }
  
  formatarValor(valor, posicaoCursor) {
    const numeroLimpo = valor.replace(/[^\d,]/g, '');
    let novaPosicao = posicaoCursor + (numeroLimpo.length - valor.length);
    novaPosicao = Math.max(0, Math.min(novaPosicao, numeroLimpo.length));
    return { valor: numeroLimpo, cursor: novaPosicao };
  }
  
  formatarCompleto(valor) {
    if (!valor) return '';
    const numero = parseFloat(this.normalizarNumero(valor));
    if (isNaN(numero)) return '';
    const valorLimitado = Math.min(Math.max(numero, this.opcoes.minimo), this.opcoes.maximo);
    return valorLimitado.toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }) + '%';
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
    
    const numero = parseFloat(this.normalizarNumero(valorFormatado));
    if (!isNaN(numero)) {
      const valorLimitado = Math.min(Math.max(numero, this.opcoes.minimo), this.opcoes.maximo);
      this.input.dataset.value = valorLimitado.toString();
    } else {
      this.input.dataset.value = '';
    }
    
    const evento = new CustomEvent('validacao', {
      detail: { valor: valorFormatado, numero: !isNaN(numero) ? numero : null }
    });
    this.input.dispatchEvent(evento);
  }
  
  handleBlur = (e) => {
    const valor = e.target.value;
    e.target.value = this.formatarCompleto(valor);
    this.valorAnterior = e.target.value;
  }
  
  handleFocus = (e) => {
    const valor = e.target.value.replace('%', '');
    e.target.value = valor;
    requestAnimationFrame(() => {
      const pos = Math.min(this.posicaoAnterior, valor.length);
      e.target.selectionStart = e.target.selectionEnd = pos;
    });
  }
  
  handleKeydown = (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const valorAtual = parseFloat(this.input.dataset.value || '0');
      let incremento = this.opcoes.incrementoPadrao;
      if (e.shiftKey) incremento = this.opcoes.incrementoShift;
      else if (e.ctrlKey) incremento = this.opcoes.incrementoCtrl;
      
      const novoValor = Math.min(Math.max(valorAtual + (e.key === 'ArrowUp' ? incremento : -incremento), this.opcoes.minimo), this.opcoes.maximo);
      this.input.value = novoValor.toString();
      this.input.dispatchEvent(new Event('input'));
    }
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
      this.handleInput({ target: e.target, type: 'input' });
    }
  }
  
  configurarEventos() {
    this.input.addEventListener('input', this.handleInput);
    this.input.addEventListener('blur', this.handleBlur);
    this.input.addEventListener('focus', this.handleFocus);
    this.input.addEventListener('keydown', this.handleKeydown);
    this.input.addEventListener('paste', this.handlePaste);
  }
  
  destruir() {
    this.input.removeEventListener('input', this.handleInput);
    this.input.removeEventListener('blur', this.handleBlur);
    this.input.removeEventListener('focus', this.handleFocus);
    this.input.removeEventListener('keydown', this.handleKeydown);
    this.input.removeEventListener('paste', this.handlePaste);
  }
}