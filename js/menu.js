import { utilitarios } from './modulos/utilitarios.js';

document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menu-toggle');
  const menuLateral = document.getElementById('menu-lateral');
  const menuBackdrop = document.getElementById('menu-backdrop');
  const submenuTriggers = document.querySelectorAll('.submenu-trigger');
  
  let lastFocusedElement = null;
  const focusableElements = 'a[href], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  
  function trapFocus(e) {
    if (!menuLateral.contains(e.target) && menuLateral.classList.contains('mostrar')) {
      const focusableContent = menuLateral.querySelectorAll(focusableElements);
      const firstFocusable = focusableContent[0];
      const lastFocusable = focusableContent[focusableContent.length - 1];
      
      if (e.shiftKey && e.key === 'Tab') {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else if (e.key === 'Tab') {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  }
  
  function toggleMenu() {
    const estaAberto = !menuLateral.classList.contains('mostrar');
    
    menuLateral.classList.toggle('mostrar', estaAberto);
    menuToggle.classList.toggle('active', estaAberto);
    menuToggle.setAttribute('aria-expanded', estaAberto);
    menuLateral.setAttribute('aria-hidden', !estaAberto);
    
    if (estaAberto) {
      lastFocusedElement = document.activeElement;
      menuBackdrop.classList.remove('hidden');
      setTimeout(() => menuBackdrop.classList.add('show'), 10);
      document.body.style.overflow = 'hidden';
      
      const firstFocusable = menuLateral.querySelector(focusableElements);
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
      }
      
      document.addEventListener('keydown', trapFocus);
    } else {
      menuBackdrop.classList.remove('show');
      menuBackdrop.classList.add('hidden');
      document.body.style.overflow = '';
      
      document.removeEventListener('keydown', trapFocus);
      
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    }
    
    utilitarios.anunciarParaLeitoresDetela(estaAberto ? 'Menu lateral aberto' : 'Menu lateral fechado');
  }
  
  submenuTriggers.forEach(trigger => {
    const submenu = trigger.nextElementSibling;
    const submenuLinks = submenu.querySelectorAll('a');
    
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    submenu.setAttribute('role', 'menu');
    submenuLinks.forEach(link => link.setAttribute('role', 'menuitem'));
    
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      const novoEstado = !isExpanded;
      
      submenuTriggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherTrigger.nextElementSibling.classList.remove('expandido');
        }
      });
      
      this.setAttribute('aria-expanded', novoEstado);
      submenu.classList.toggle('expandido', novoEstado);
      
      utilitarios.anunciarParaLeitoresDetela(novoEstado ? 'Submenu aberto' : 'Submenu fechado');
    });
    
    trigger.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      } else if (e.key === 'ArrowDown' && this.getAttribute('aria-expanded') === 'true') {
        e.preventDefault();
        submenuLinks[0]?.focus();
      }
    });
    
    submenuLinks.forEach((link, index) => {
      link.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (index === 0) {
            trigger.focus();
          } else {
            submenuLinks[index - 1].focus();
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (index < submenuLinks.length - 1) {
            submenuLinks[index + 1].focus();
          }
        } else if (e.key === 'Escape') {
          e.preventDefault();
          trigger.setAttribute('aria-expanded', 'false');
          submenu.classList.remove('expandido');
          trigger.focus();
        }
      });
    });
  });
  
  menuToggle.addEventListener('click', toggleMenu);
  menuBackdrop.addEventListener('click', toggleMenu);
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menuLateral.classList.contains('mostrar')) {
      toggleMenu();
    }
  });
  
  window.addEventListener('resize', utilitarios.debounce(function() {
    if (window.innerWidth > 767) {
      document.querySelectorAll('.submenu').forEach(submenu => {
        submenu.style.maxHeight = '';
      });
      document.querySelectorAll('.submenu-trigger').forEach(trigger => {
        trigger.setAttribute('aria-expanded', 'false');
      });
      
      if (menuLateral.classList.contains('mostrar')) {
        toggleMenu();
      }
    }
  }, 250));
  
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  menuToggle.setAttribute('aria-controls', 'menu-lateral');
  menuLateral.setAttribute('aria-label', 'Menu de navegação');
});