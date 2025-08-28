'use strict';

export class GerenciadorGrafico {
  constructor(canvas, tooltip) {
    this.canvas = canvas;
    this.tooltip = tooltip;
    this.chart = null;
    this.dadosCompletos = [];
    this.timeoutId = null;
  }
  
  inicializarCanvas() {
    if (this.chart) {
      this.chart.destroy();
    }
    
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  mostrarTooltip(context, fonte = "mouse") {
    const { chart, tooltip } = context;
    
    if (!chart?.canvas || tooltip?.opacity === 0 || !tooltip?.dataPoints?.length) {
      this.esconderTooltip();
      return;
    }
    
    const dataPoint = tooltip.dataPoints[0];
    const index = dataPoint.dataIndex;
    const ponto = this.dadosCompletos[index];
    
    if (!ponto) {
      this.esconderTooltip();
      return;
    }
    
    this.tooltip.style.visibility = "visible";
    this.tooltip.style.display = "block";
    
    this.tooltip.innerHTML = `
      <div class="tooltip-header" role="heading" aria-level="3">
        Mês ${ponto.periodo}
      </div>
      <div class="tooltip-content" role="list">
        <div role="listitem">
          <span>Montante</span>
          <strong aria-label="Montante: R$ ${ponto.montante.toFixed(2)}">
            R$ ${ponto.montante.toFixed(2)}
          </strong>
        </div>
        <div role="listitem">
          <span>Juros</span>
          <strong aria-label="Juros: R$ ${ponto.jurosPeriodo.toFixed(2)}">
            R$ ${ponto.jurosPeriodo.toFixed(2)}
          </strong>
        </div>
      </div>
    `;
    
    this.tooltip.setAttribute("aria-hidden", "false");
    
    const position = chart.canvas.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    
    this.tooltip.style.left = (position.left + scrollX + tooltip.caretX) + 'px';
    this.tooltip.style.top = (position.top + scrollY + tooltip.caretY) + 'px';
    this.tooltip.classList.add("active");
    
    if (fonte === "touch") {
      if (this.timeoutId) clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => this.esconderTooltip(), 3000);
    }
  }
  
  esconderTooltip() {
    if (!this.tooltip) return;
    
    this.tooltip.setAttribute("aria-hidden", "true");
    this.tooltip.classList.remove("active");
    
    this.tooltip.style.visibility = "hidden";
    this.tooltip.style.display = "none";
    this.tooltip.innerHTML = '';
  }
  
  configurarInteratividade() {
    this.timeoutId = null;
  }
  
  desenharGrafico(dados) {
    this.inicializarCanvas();
    if (dados.length === 0) return;
    
    this.dadosCompletos = dados;
    
    const ctx = this.canvas.getContext('2d');
    const isMobile = window.innerWidth <= 767;
    
    const config = {
      type: 'line',
      data: {
        labels: dados.map(item => `Mês ${item.periodo}`),
        datasets: [{
          label: 'Evolução do Investimento',
          data: dados.map(item => item.montante),
          borderColor: '#ff7f7f',
          backgroundColor: 'rgba(255, 127, 127, 0.1)',
          pointBackgroundColor: '#ff4c4c',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#ff4c4c',
          pointHoverBorderColor: '#fff',
          pointRadius: isMobile ? 4 : 3,
          pointHoverRadius: isMobile ? 6 : 5,
          borderWidth: 2,
          fill: true,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 30,
            right: 20,
            bottom: 10,
            left: 20
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false,
            external: (context) => {
              this.mostrarTooltip(context, "mouse");
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(252, 252, 252, 0.2)',
              drawBorder: false
            },
            ticks: {
              color: '#fcfcfc',
              maxRotation: 0,
              callback: function(value, index) {
                const totalLabels = this.chart.data.labels.length;
                const step = Math.ceil(totalLabels / 6);
                return index % step === 0 ? this.getLabelForValue(value) : '';
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(252, 252, 252, 0.2)',
              drawBorder: false
            },
            ticks: {
              color: '#fcfcfc',
              callback: function(value) {
                return 'R$ ' + value.toFixed(2).replace('.', ',');
              }
            }
          }
        },
        interaction: {
          mode: 'index',
          intersect: false
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    };
    
    this.chart = new Chart(ctx, config);
  }
  
  redimensionar() {
    if (this.chart) {
      this.chart.resize();
    }
  }
  
  destruir() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    
    this.esconderTooltip();
    this.dadosCompletos = [];
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}