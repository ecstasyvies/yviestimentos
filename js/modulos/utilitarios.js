export const utilitarios = {
  debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  },
  
  redimensionarGrafico() {
    if (window.gerenciadorGrafico) {
      window.gerenciadorGrafico.redimensionar();
    }
  },
  
  exibirMensagemErro(mensagem) {
    const mensagemErro = document.getElementById('mensagem-erro');
    const textoErro = document.getElementById('mensagem-texto');
    const backdrop = document.getElementById('mensagem-erro-backdrop');
    
    textoErro.textContent = mensagem;
    mensagemErro.classList.add('show');
    backdrop.style.display = 'block';
    backdrop.classList.add('show');
    
    setTimeout(() => {
      mensagemErro.classList.remove('show');
      mensagemErro.classList.add('hide');
      backdrop.classList.remove('show');
      backdrop.classList.add('hide');
      setTimeout(() => {
        backdrop.style.display = 'none';
      }, 500);
    }, 3000);
  },
  
  mostrarLoading(mostrar) {
    if (mostrar) {
      const div = document.createElement('div');
      div.id = 'loading';
      div.className = 'loading';
      div.innerHTML = '<div class="loading-spinner"></div>';
      document.body.appendChild(div);
    } else {
      const loading = document.getElementById('loading');
      if (loading) loading.remove();
    }
  },
  
  anunciarParaLeitoresDetela(mensagem) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.classList.add('sr-only');
    announcement.textContent = mensagem;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }
};