export const validador = {
  erros: new Map(),
  timeouts: new Map(),
  
  redimensionarGrafico() {
    if (window.gerenciadorGrafico) {
      window.gerenciadorGrafico.redimensionar();
    }
  },
  
  // --- Gerenciamento de erros ---
  adicionarErro(campo, mensagem) {
    this.erros.set(campo.id, mensagem);
    this.atualizarFeedback(campo);
  },
  
  removerErro(campo) {
    this.erros.delete(campo.id);
    this.atualizarFeedback(campo);
  },
  
  atualizarFeedback(campo) {
    const feedbackId = `feedback-${campo.id}`;
    let feedbackEl = document.getElementById(feedbackId);
    
    if (!feedbackEl) {
      feedbackEl = document.createElement('div');
      feedbackEl.id = feedbackId;
      feedbackEl.className = 'campo-feedback';
      feedbackEl.setAttribute('aria-live', 'polite');
      campo.parentNode.appendChild(feedbackEl);
    }
    
    const mensagem = this.erros.get(campo.id);
    if (mensagem) {
      campo.setAttribute('aria-invalid', 'true');
      feedbackEl.textContent = mensagem;
      feedbackEl.classList.add('erro');
    } else {
      campo.removeAttribute('aria-invalid');
      feedbackEl.textContent = '';
      feedbackEl.classList.remove('erro');
    }
    
    // Redimensiona o gráfico sempre que o feedback muda
    this.redimensionarGrafico();
  },
  
  // --- Validação de campo ---
  validarCampo(campo, validador, opcoesExtras = {}) {
    const {
      requerido = true,
        mensagemRequerido = 'Este campo é obrigatório',
        validacaoInstantanea = false
    } = opcoesExtras;
    
    if (this.timeouts.has(campo.id)) {
      clearTimeout(this.timeouts.get(campo.id));
    }
    
    const executarValidacao = () => {
      if (requerido && (!campo.value || campo.value.trim() === '')) {
        this.adicionarErro(campo, mensagemRequerido);
        return false;
      }
      
      if (!requerido && (!campo.value || campo.value.trim() === '')) {
        this.removerErro(campo);
        return true;
      }
      
      const resultado = validador(campo.value);
      if (resultado.valido) {
        this.removerErro(campo);
        return true;
      } else {
        this.adicionarErro(campo, resultado.mensagem);
        return false;
      }
    };
    
    if (validacaoInstantanea) {
      return executarValidacao();
    }
    
    this.timeouts.set(campo.id, setTimeout(executarValidacao, 300));
  }
};