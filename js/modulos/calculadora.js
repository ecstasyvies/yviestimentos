export const calculadora = {
  calcularRetorno({
    valorInicial,
    aporteMensal = 0,
    taxaJuros,
    tipoTaxa,
    periodo,
    tipoPeriodo
  }) {
    if (valorInicial < 0 || aporteMensal < 0 || taxaJuros < 0 || periodo < 1) {
      throw new Error('Valores inválidos para o cálculo');
    }
    
    if (valorInicial > Number.MAX_SAFE_INTEGER || aporteMensal > Number.MAX_SAFE_INTEGER) {
      throw new Error('Valor muito grande para cálculo preciso');
    }
    
    const totalPeriodos = tipoPeriodo === 'anos' ? periodo * 12 : periodo;
    
    const taxaPeriodo = tipoTaxa === 'anual' ?
      Math.exp(Math.log(1 + taxaJuros) / 12) - 1 :
      taxaJuros;
    
    let montante = valorInicial;
    let totalInvestido = valorInicial;
    let totalJuros = 0;
    const resultados = [];
    
    for (let mes = 1; mes <= totalPeriodos; mes++) {
      const jurosPeriodo = montante * taxaPeriodo;
      totalJuros += jurosPeriodo;
      montante += jurosPeriodo + aporteMensal;
      totalInvestido += aporteMensal;
      
      resultados.push({
        periodo: mes,
        jurosPeriodo,
        totalInvestido,
        totalJuros,
        montante
      });
    }
    
    return resultados;
  },
  
  agruparResultados(resultados) {
    if (resultados.length <= 24) return resultados;
    
    return resultados.filter((_, index) =>
      (index + 1) % 12 === 0 || index === resultados.length - 1
    );
  }
};