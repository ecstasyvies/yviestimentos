import { formatador } from './modulos/formatador.js';
import { FormatadorMoeda } from './modulos/formatador-moeda.js';
import { FormatadorPorcentagem } from './modulos/formatador-porcentagem.js';
import { validador } from './modulos/validador.js';
import { utilitarios } from './modulos/utilitarios.js';
import { GerenciadorGrafico } from './modulos/gerenciador-grafico.js';
import { GerenciadorTabela } from './modulos/gerenciador-tabela.js';
import { estado } from './modulos/estado.js';
import { calculadora } from './modulos/calculadora.js';

document.addEventListener('DOMContentLoaded', function() {
  const elementos = {
    campoValorInicial: document.getElementById('valor-inicial'),
    campoValorMensal: document.getElementById('valor-mensal'),
    campoTaxaJuros: document.getElementById('taxa-juros'),
    campoPeriodo: document.getElementById('periodo'),
    formCalculo: document.getElementById('form-calculo'),
    tabelaBody: document.querySelector('#tabela-investimento tbody'),
    canvas: document.getElementById('grafico-investimento'),
    graficoTooltip: document.createElement('div'),
    graficoContainer: document.createElement('div')
  };
  
  elementos.graficoTooltip.className = 'grafico-tooltip';
  document.body.appendChild(elementos.graficoTooltip);
  
  elementos.graficoContainer.className = 'grafico-container';
  elementos.canvas.parentNode.insertBefore(elementos.graficoContainer, elementos.canvas);
  elementos.graficoContainer.appendChild(elementos.canvas);
  
  const gerenciadorGrafico = new GerenciadorGrafico(elementos.canvas, elementos.graficoTooltip);
  const gerenciadorTabela = new GerenciadorTabela(elementos, estado);
  
  window.gerenciadorGrafico = gerenciadorGrafico;
  
  configurarCampos();
  
  configurarEventListeners();
  
  gerenciadorGrafico.configurarInteratividade();
  
  function configurarCampos() {
    const validarMoeda = (valor) => {
      const numero = parseFloat(formatador.normalizarNumero(valor));
      return {
        valido: !isNaN(numero) && numero >= 0,
        mensagem: 'Digite um valor válido maior ou igual a zero'
      };
    };
    
    const validarPorcentagem = (valor) => {
      const numero = parseFloat(formatador.normalizarNumero(valor));
      return {
        valido: !isNaN(numero) && numero >= 0 && numero <= 100,
        mensagem: 'Digite uma porcentagem entre 0 e 100'
      };
    };
    
    const configurarCampoMonetario = (input) => {
      const isValorInicial = input.id === 'valor-inicial';
      
      if (input._formatador) input._formatador.destruir();
      
      const formatadorCampo = new FormatadorMoeda(input, {
        requerido: isValorInicial,
        mensagemRequerido: isValorInicial ?
          'Informe o valor inicial do investimento' : 'O valor do aporte mensal é opcional'
      });
      
      input._formatador = formatadorCampo;
      
      input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.preventDefault();
          const valor = parseFloat(input.dataset.value || '0');
          const incremento = e.shiftKey ? 100 : e.ctrlKey ? 10 : 1;
          const novoValor = Math.max(0, e.key === 'ArrowUp' ? valor + incremento : valor - incremento);
          input.value = novoValor.toString();
          input.dispatchEvent(new Event('input'));
        }
      });
    };
    
    const configurarCampoPorcentagem = (input) => {
      if (input._formatador) input._formatador.destruir();
      
      const formatadorCampo = new FormatadorPorcentagem(input, {
        requerido: true,
        mensagemRequerido: 'Informe a taxa de juros',
        minimo: 0,
        maximo: 100,
        incrementoPadrao: 0.1,
        incrementoCtrl: 0.5,
        incrementoShift: 1.0
      });
      
      input._formatador = formatadorCampo;
      
      input.addEventListener('validacao', (e) => {
        const { numero } = e.detail;
        
        validador.validarCampo(input, () => ({
          valido: numero !== null && numero >= 0 && numero <= 100,
          mensagem: numero === null ? 'Digite uma taxa válida' : numero < 0 ? 'A taxa não pode ser negativa' : numero > 100 ? 'A taxa não pode ser maior que 100%' : ''
        }), { requerido: true, validacaoInstantanea: true });
        
        const tipoTaxa = document.getElementById('tipo-taxa').value;
        const valorFormatado = numero !== null ? `${numero.toFixed(2)}% ${tipoTaxa}` : 'taxa inválida';
        input.setAttribute('aria-label', `Taxa de juros: ${valorFormatado}`);
      });
      
      document.getElementById('tipo-taxa').addEventListener('change', () => {
        const valor = input.dataset.value;
        if (valor) {
          const numero = parseFloat(valor);
          const tipoTaxa = document.getElementById('tipo-taxa').value;
          input.setAttribute('aria-label', `Taxa de juros: ${numero.toFixed(2)}% ${tipoTaxa}`);
        }
      });
    };
    
    configurarCampoMonetario(elementos.campoValorInicial);
    configurarCampoMonetario(elementos.campoValorMensal);
    configurarCampoPorcentagem(elementos.campoTaxaJuros);
    
    elementos.campoPeriodo.addEventListener('input', () => {
      validador.validarCampo(elementos.campoPeriodo, (valor) => {
        const num = parseInt(valor);
        return {
          valido: !isNaN(num) && num >= 1 && num <= 600,
          mensagem: 'O período deve ser um número entre 1 e 600 ' +
            (document.getElementById('tipo-periodo').value === 'anos' ? 'anos' : 'meses')
        };
      }, { requerido: true, mensagemRequerido: 'Informe o período do investimento', validacaoInstantanea: true });
    });
    
    document.getElementById('tipo-periodo').addEventListener('change', () => {
      if (elementos.campoPeriodo.value) elementos.campoPeriodo.dispatchEvent(new Event('input'));
    });
  }
  
  function configurarEventListeners() {
    elementos.formCalculo.addEventListener('submit', handleSubmit);
    elementos.formCalculo.addEventListener('reset', handleReset);
    
    window.addEventListener('resize', utilitarios.debounce(() => {
      utilitarios.redimensionarGrafico();
    }, 250));
  }
  
  function handleSubmit(e) {
    e.preventDefault();
    if (!this.checkValidity()) return this.reportValidity();
    
    const valorInicialBruto = elementos.campoValorInicial.value;
    const taxaJurosBruto = elementos.campoTaxaJuros.value;
    const periodoBruto = elementos.campoPeriodo.value;
    
    const valorInicialInput = formatador.normalizarNumero(valorInicialBruto);
    const taxaJurosInput = formatador.normalizarNumero(taxaJurosBruto);
    const periodoInput = periodoBruto;
    
    if (!valorInicialInput || !taxaJurosInput || !periodoInput) {
      utilitarios.exibirMensagemErro('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    const valorNumerico = parseFloat(valorInicialInput);
    const taxaNumerico = parseFloat(taxaJurosInput) / 100;
    const periodoNumerico = parseInt(periodoInput);
    
    utilitarios.mostrarLoading(true);
    
    setTimeout(() => {
      try {
        const valorInicial = valorNumerico;
        const aporteMensal = parseFloat(formatador.normalizarNumero(elementos.campoValorMensal.value)) || 0;
        const tipoTaxa = document.getElementById('tipo-taxa').value;
        const periodo = periodoNumerico;
        const tipoPeriodo = document.getElementById('tipo-periodo').value;
        
        estado.dadosTabelaCompleta = calculadora.calcularRetorno({
          valorInicial,
          aporteMensal,
          taxaJuros: taxaNumerico,
          tipoTaxa,
          periodo,
          tipoPeriodo
        });
        
        if (tipoPeriodo === 'anos' ? periodo > 2 : periodo > 24) {
          estado.dadosTabelaCompleta = calculadora.agruparResultados(estado.dadosTabelaCompleta);
        }
        
        const montanteFinal = estado.dadosTabelaCompleta[estado.dadosTabelaCompleta.length - 1];
        
        const secaoResultados = document.querySelector('.resultados');
        secaoResultados.classList.remove('hidden');
        document.getElementById('resultado-final').innerHTML = `
          <p><strong>Montante Final:</strong> ${formatador.moeda(montanteFinal.montante)}</p>
          <p><strong>Total Investido:</strong> ${formatador.moeda(montanteFinal.totalInvestido)}</p>
          <p><strong>Total de Juros:</strong> ${formatador.moeda(montanteFinal.totalJuros)}</p>
        `;
        
        estado.pagina = 0;
        gerenciadorTabela.atualizarTabela();
        gerenciadorGrafico.desenharGrafico(estado.dadosTabelaCompleta);
        
        secaoResultados.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (error) {
        console.error(error);
        utilitarios.exibirMensagemErro('Ocorreu um erro ao calcular. Verifique os valores e tente novamente.');
      } finally {
        utilitarios.mostrarLoading(false);
      }
    }, 100);
  }
  
  function handleReset() {
    estado.reset();
    
    const secaoResultados = document.querySelector('.resultados');
    document.getElementById('resultado-final').innerHTML = '';
    elementos.tabelaBody.innerHTML = '';
    
    if (gerenciadorGrafico && gerenciadorGrafico.chart) {
      gerenciadorGrafico.destruir();
    }
    const ctx = elementos.canvas.getContext('2d');
    ctx.clearRect(0, 0, elementos.canvas.width, elementos.canvas.height);
    
    requestAnimationFrame(() => {
      secaoResultados.classList.add('hidden');
      window.scrollTo(window.scrollX, window.scrollY);
    });
  }
});