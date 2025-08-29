(function() {
  function inicializarTesteAutomatico() {
    document.readyState === 'loading' ?
      document.addEventListener('DOMContentLoaded', executarTeste) :
      executarTeste();
  }
  
  function executarTeste() {
    const form = document.getElementById('form-calculo');
    const valorInicial = document.getElementById('valor-inicial');
    const valorMensal = document.getElementById('valor-mensal');
    const taxaJuros = document.getElementById('taxa-juros');
    const periodo = document.getElementById('periodo');
    
    if (!form || !valorInicial || !valorMensal || !taxaJuros || !periodo) return;
    
    setTimeout(() => {
      valorInicial.value = '500,00';
      valorMensal.value = '50,00';
      taxaJuros.value = '5';
      periodo.value = '5';
      
      [valorInicial, valorMensal, taxaJuros, periodo].forEach(el =>
        el.dispatchEvent(new Event('input', { bubbles: true }))
      );
      
      setTimeout(() => {
        if (form.checkValidity())
          form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }, 200);
    }, 200);
  }
  
  inicializarTesteAutomatico();
})();