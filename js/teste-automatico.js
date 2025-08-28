export function inicializarTesteAutomatico() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', executarTeste);
  } else {
    executarTeste();
  }
}

function executarTeste() {
  const form = document.getElementById('form-calculo');
  const valorInicial = document.getElementById('valor-inicial');
  const valorMensal = document.getElementById('valor-mensal');
  const taxaJuros = document.getElementById('taxa-juros');
  const periodo = document.getElementById('periodo');
  
  if (!form || !valorInicial || !valorMensal || !taxaJuros || !periodo) {
    console.warn('Elementos do formulário não encontrados.');
    return;
  }
  
  valorInicial.value = '500,00';
  valorMensal.value = '50,00';
  taxaJuros.value = '5';
  periodo.value = '10';
  
  [valorInicial, valorMensal, taxaJuros, periodo].forEach(el =>
    el.dispatchEvent(new Event('input', { bubbles: true }))
  );
  
  requestAnimationFrame(() => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
}

inicializarTesteAutomatico();