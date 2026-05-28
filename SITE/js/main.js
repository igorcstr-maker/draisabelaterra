/* ============================================================
   DRA. ISABELA TERRA — main.js
   WhatsApp: +55 (35) 9735-7489 → 553597357489
   ============================================================ */

'use strict';

/* ── CONFIGURAÇÃO ── */
const WA_NUMBER = '553597357489';

/**
 * buildWaURL(message, source)
 * Constrói URL do WhatsApp com mensagem pré-preenchida e rastreamento UTM.
 * Estrutura da mensagem compatível com chatbots/agentes (via prefixo de origem).
 *
 * Para integrar um agente/bot: basta ler os parâmetros da URL recebida no
 * WhatsApp Business API e parsear a linha "_Origem:..." no final da mensagem.
 */
function buildWaURL(message, source) {
  const params   = new URLSearchParams(window.location.search);
  const utmSrc   = params.get('utm_source')   || source   || 'site-organico';
  const utmMed   = params.get('utm_medium')   || 'site';
  const utmCamp  = params.get('utm_campaign') || 'site-isabela-terra';

  /* Mensagem estruturada — fácil de parsear por agentes/automações */
  const full = `${message}\n\n_Origem: ${utmSrc} | ${utmMed} | ${utmCamp}_`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(full)}`;
}

/* ── INICIALIZAR LINKS WHATSAPP ── */
function initWaLinks() {
  document.querySelectorAll('[data-wa]').forEach(el => {
    const msg = el.dataset.msg || 'Olá! Gostaria de informações sobre a clínica da Dra. Isabela Terra.';
    const src = el.dataset.src || 'site';

    el.href   = buildWaURL(msg, src);
    el.target = '_blank';
    el.rel    = 'noopener noreferrer';

    /* Recalcula no clique para capturar UTMs dinâmicos de campanhas */
    el.addEventListener('click', function () {
      this.href = buildWaURL(msg, src);
    });
  });
}

/* ── NAVEGAÇÃO ── */
const nav       = document.getElementById('nav');
const toggle    = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

function closeMenu() {
  navLinks.classList.remove('aberto');
  toggle.classList.remove('aberto');
  toggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function initNav() {
  /* scroll: adiciona/remove .scrolled */
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  }, { passive: true });

  /* hamburger */
  toggle.addEventListener('click', () => {
    const aberto = navLinks.classList.contains('aberto');
    navLinks.classList.toggle('aberto');
    toggle.classList.toggle('aberto');
    toggle.setAttribute('aria-expanded', String(!aberto));
    document.body.style.overflow = aberto ? '' : 'hidden';
  });

  /* fechar ao clicar em link */
  navLinks.querySelectorAll('a, [data-wa]').forEach(el => {
    el.addEventListener('click', closeMenu);
  });

  /* fechar ao clicar fora */
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) closeMenu();
  });

  /* fechar com ESC */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ── LINK ATIVO NA NAV ── */
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__link');
  let current = '';

  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });

  links.forEach(l => {
    l.classList.toggle('ativo', l.getAttribute('href') === `#${current}`);
  });
}

/* ── VOLTAR AO TOPO ── */
function initTopoBtn() {
  const btn = document.getElementById('topoBtn');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visivel', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── ANIMAÇÕES DE ENTRADA (Intersection Observer) ── */
function initFadeUp() {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length || !('IntersectionObserver' in window)) {
    /* fallback: mostra tudo imediatamente */
    els.forEach(el => el.classList.add('visivel'));
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visivel');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
}

/* ── SMOOTH SCROLL ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH  = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
      const top   = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initWaLinks();
  initNav();
  initTopoBtn();
  initFadeUp();
  initSmoothScroll();
});
