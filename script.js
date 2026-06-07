/* ═══════════════════════════════════════════════════
   Decorcom Interiores — Catálogo de Rodapés
   script.js  |  Curitiba · PR
═══════════════════════════════════════════════════ */

'use strict';


/* ─────────────────────────────────────
   LIGHTBOX
───────────────────────────────────── */
var lbSourceCard = null;
function openLb(cardEl, src, title, sub) {
  document.getElementById('lb-img').src = src;
  document.getElementById('lb-title').textContent = 'Rodapé ' + title;
  document.getElementById('lb-sub').textContent = sub;
  lbSourceCard = cardEl || null;
  var orcBtn = cardEl && cardEl.querySelector && cardEl.querySelector('.card-orcamento');
  var lbBtn = document.getElementById('lb-btn');
  if (orcBtn && lbBtn) {
    lbBtn.dataset.link = orcBtn.dataset.link || '';
    lbBtn.dataset.preco = orcBtn.dataset.preco || '';
  }
  document.getElementById('lb').classList.add('open');
}
function closeLb() {
  document.getElementById('lb').classList.remove('open');
}
// Nav scroll highlight
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 80) cur = s.id; });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });
});



(function(){
  var cards = document.querySelectorAll('.dif-card');
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry, i){
      if(entry.isIntersecting){
        setTimeout(function(){ entry.target.classList.add('visible'); }, Array.from(cards).indexOf(entry.target) * 120);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  cards.forEach(function(c){ observer.observe(c); });
})();



function filtrarMarca(pill) {
  const filtro = pill.dataset.filter;
  const pills = document.querySelectorAll('.hero-brand-pill');
  const blocos = document.querySelectorAll('.marca-block');

  pills.forEach(p => p.classList.remove('ativo'));
  pill.classList.add('ativo');

  if (filtro === 'todos') {
    blocos.forEach(b => { b.style.display = ''; });
    return;
  }

  blocos.forEach(b => {
    b.style.display = b.dataset.marca === filtro ? '' : 'none';
  });

  const primeira = document.querySelector(`.marca-block[data-marca="${filtro}"]`);
  if (primeira) {
    setTimeout(() => primeira.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }
}

// Navegação por altura: scroll + aba ativa
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav a');

  // Atualiza aba ativa no scroll
  const sections = document.querySelectorAll('.section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(s => observer.observe(s));

  // Clique: scroll suave + aba ativa imediata
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      navLinks.forEach(a => a.classList.remove('active'));
      this.classList.add('active');
      const offset = document.querySelector('.nav-wrap').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
});




/* ─────────────────────────────────────
   ESTADO GLOBAL
───────────────────────────────────── */
var isUrgente = false;

/* ─────────────────────────────────────
   URGENTE / MAPA
───────────────────────────────────── */
function setUrgente() {
  isUrgente = !isUrgente;
  var toggle = document.getElementById('urgenteToggle');
  var label = document.getElementById('urgenteLabel');
  if (toggle) toggle.classList.toggle('ativo', isUrgente);
  if (label) label.classList.toggle('ativo', isUrgente);
}

function abrirMapa(e) {
  e.preventDefault();
  var endereco = encodeURIComponent('Rua Nunes Machado 69 Centro Curitiba PR');
  if (confirm('Abrir no Google Maps ou Waze?\nOK = Google Maps | Cancelar = Waze')) {
    window.open('https://maps.google.com/?q=' + endereco, '_blank');
  } else {
    window.open('https://waze.com/ul?q=' + endereco, '_blank');
  }
}

/* ─────────────────────────────────────
   SALVAR ORÇAMENTO EM PDF
───────────────────────────────────── */
function salvarOrcamentoPDF() {
  var btn = document.querySelector('.btn-salvar-orc');
  if (btn) { btn.textContent = '⏳ Gerando...'; btn.disabled = true; }

  var d = new Date();
  var dataStr = d.toLocaleDateString('pt-BR');
  var nomeArquivo = 'orcamento-decorcom-' + dataStr.replace(/\//g,'-') + '.pdf';

  var JsPDF = window.jspdf ? window.jspdf.jsPDF : (window.jsPDF || (typeof jsPDF !== 'undefined' ? jsPDF : null));
  if (!JsPDF) { alert('Biblioteca PDF não carregou. Recarregue a página.'); if(btn){btn.textContent='💾 Salvar Orçamento';btn.disabled=false;} return; }

  // Renderiza o banner hero em canvas — mesma imagem, mesmo crop, sem travar
  var heroEl = document.getElementById('orcHeroHeader');
  var heroW  = heroEl ? heroEl.offsetWidth  : 800;
  var heroH  = heroEl ? heroEl.offsetHeight : 200;
  var SC     = 2; // resolução 2x
  var bannerCanvas = document.createElement('canvas');
  bannerCanvas.width  = heroW * SC;
  bannerCanvas.height = heroH * SC;
  var bCtx = bannerCanvas.getContext('2d');

  function renderizarBanner(bannerImg) {
    // 1. Fundo escuro
    bCtx.fillStyle = '#1a1a1a';
    bCtx.fillRect(0, 0, bannerCanvas.width, bannerCanvas.height);

    // 2. Imagem com center/cover
    if (bannerImg) {
      var iw = bannerImg.naturalWidth, ih = bannerImg.naturalHeight;
      var scale = Math.max(bannerCanvas.width / iw, bannerCanvas.height / ih);
      var dw = iw * scale, dh = ih * scale;
      var dx = (bannerCanvas.width  - dw) / 2;
      var dy = (bannerCanvas.height - dh) / 2;
      bCtx.drawImage(bannerImg, dx, dy, dw, dh);
    }

    // 3. Overlay escuro 65%
    bCtx.fillStyle = 'rgba(0,0,0,0.65)';
    bCtx.fillRect(0, 0, bannerCanvas.width, bannerCanvas.height);

    // 4. Logo
    var logoEl = document.querySelector('.orc-hero-logo');
    if (logoEl && logoEl.complete && logoEl.naturalWidth) {
      var lhPx = 48 * SC;
      var lwPx = lhPx * (logoEl.naturalWidth / logoEl.naturalHeight);
      bCtx.drawImage(logoEl, 20 * SC, 20 * SC, lwPx, lhPx);
    }

    // 5. Data
    bCtx.fillStyle = 'rgba(255,255,255,0.6)';
    bCtx.font = (9.5 * SC) + 'px system-ui,sans-serif';
    bCtx.textAlign = 'left';
    bCtx.fillText(dataStr, 20 * SC, (heroH - 18) * SC);

    // 6. Ícones SVG + contatos à direita
    var links = heroEl ? heroEl.querySelectorAll('.orc-hero-link') : [];
    var rx = (heroW - 22) * SC;
    var lineH = 20 * SC;
    var startY = 28 * SC;
    bCtx.font = (11 * SC) + 'px system-ui,sans-serif';
    bCtx.textAlign = 'right';

    function desenharLinhaComIcone(linkEl, yPos, cb) {
      var svgEl  = linkEl.querySelector('svg');
      var texto  = linkEl.textContent.trim();
      // texto à direita
      bCtx.fillStyle = 'rgba(255,255,255,0.88)';
      bCtx.fillText(texto, rx, yPos);
      var textoW = bCtx.measureText(texto).width;
      if (!svgEl) { cb(); return; }
      // serializa o SVG e carrega como imagem
      try {
        var sz = 14 * SC;
        // garante viewBox no svg serializado
        var clone = svgEl.cloneNode(true);
        clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        if (!clone.getAttribute('width'))  clone.setAttribute('width',  '24');
        if (!clone.getAttribute('height')) clone.setAttribute('height', '24');
        var svgStr = new XMLSerializer().serializeToString(clone);
        var svgBlob = new Blob([svgStr], {type: 'image/svg+xml;charset=utf-8'});
        var url = URL.createObjectURL(svgBlob);
        var ico = new Image();
        ico.onload = function() {
          var ix = rx - textoW - 8 * SC - sz;
          bCtx.drawImage(ico, ix, yPos - sz * 0.8, sz, sz);
          URL.revokeObjectURL(url);
          cb();
        };
        ico.onerror = function() { URL.revokeObjectURL(url); cb(); };
        ico.src = url;
      } catch(e) { cb(); }
    }

    function desenharTodosLinks(i) {
      if (i >= links.length) {
        gerarPDF(bannerCanvas.toDataURL('image/jpeg', 0.92), bannerCanvas.width, bannerCanvas.height);
        return;
      }
      desenharLinhaComIcone(links[i], startY + i * lineH, function() {
        desenharTodosLinks(i + 1);
      });
    }
    desenharTodosLinks(0);
  }

  var bgImg = new Image();
  bgImg.onload  = function() { renderizarBanner(bgImg); };
  bgImg.onerror = function() { renderizarBanner(null); };
  bgImg.src = 'img/banner-hero.jpg';

  function gerarPDF(bannerData, bannerNatW, bannerNatH) {
    var doc = new JsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    var PW = 210;
    var M  = 25;   // margens laterais
    var MT = 10;   // margem superior
    var CW = PW - M * 2;
    var y  = MT;

    // ── HERO BANNER — captura pixel-perfect do modal ──
    var heroH = bannerNatW > 0 ? (CW * bannerNatH / bannerNatW) : 42;
    if (bannerData) {
      doc.addImage(bannerData, 'JPEG', M, y, CW, heroH, undefined, 'FAST');
    } else {
      doc.setFillColor(26, 26, 26);
      doc.rect(M, y, CW, heroH, 'F');
    }
    y = y + heroH + 5;

    // ── ORÇAMENTO DECORCOM ────────────────────────────
    var mapaLinhas = [];
    var mapaEl = document.getElementById('orcMapa');
    if (mapaEl) {
      mapaEl.querySelectorAll('.orc-mapa-linha').forEach(function(row) {
        var desc = row.querySelector('.desc') ? row.querySelector('.desc').textContent.trim() : '';
        var val  = row.querySelector('.val')  ? row.querySelector('.val').textContent.trim()  : '';
        mapaLinhas.push({desc: desc, val: val});
      });
    }

    var boxH = 10 + mapaLinhas.length * 7 + 16;
    doc.setFillColor(247, 246, 243);
    doc.roundedRect(M, y, CW, boxH, 3, 3, 'F');

    doc.setFontSize(8);
    doc.setTextColor(50, 127, 164);
    doc.setFont(undefined, 'bold');
    doc.text('ORCAMENTO DECORCOM', PW / 2, y + 7, { align: 'center' });
    doc.setFont(undefined, 'normal');

    var ly = y + 13;
    doc.setFontSize(8.5);
    mapaLinhas.forEach(function(l) {
      doc.setTextColor(60, 60, 60);
      doc.text(l.desc, M + 4, ly);
      doc.text(l.val, M + CW - 4, ly, { align: 'right' });
      doc.setDrawColor(220, 218, 214);
      doc.setLineWidth(0.3);
      doc.line(M + 4, ly + 1.5, M + CW - 4, ly + 1.5);
      ly += 7;
    });

    // linha separadora total
    doc.setDrawColor(208, 232, 219);
    doc.setLineWidth(0.6);
    doc.line(M + 4, ly + 1, M + CW - 4, ly + 1);
    ly += 6;
    doc.setFontSize(10);
    doc.setTextColor(49, 101, 78);
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL PIX', M + 4, ly + 4);
    doc.text(fmt(orcDados.subtotal), M + CW - 4, ly + 4, { align: 'right' });
    doc.setFont(undefined, 'normal');
    y = ly + 14;

    // ── FORMAS DE PAGAMENTO ───────────────────────────
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(224, 221, 214);
    doc.setLineWidth(0.3);
    doc.roundedRect(M, y, CW, 32, 3, 3, 'FD');

    doc.setFontSize(7);
    doc.setTextColor(140, 140, 140);
    doc.setFont(undefined, 'bold');
    doc.text('FORMAS DE PAGAMENTO', M + 5, y + 6);
    doc.setFont(undefined, 'normal');

    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.setFont(undefined, 'bold');
    doc.text('PIX (a vista)', M + 5, y + 14);
    doc.text(fmt(orcDados.subtotal), M + CW - 5, y + 14, { align: 'right' });
    doc.setFont(undefined, 'normal');

    doc.setFontSize(8.5);
    doc.setTextColor(50, 127, 164);
    doc.text('Credito 5x via link', M + 5, y + 22);
    doc.text(fmt(orcDados.parcela5x) + '/mes', M + CW - 5, y + 22, { align: 'right' });
    doc.text('Credito 10x presencial (loja)', M + 5, y + 29);
    doc.text(fmt(orcDados.parcela10x) + '/mes', M + CW - 5, y + 29, { align: 'right' });
    y += 37;

    // ── PRAZO DE ENTREGA ──────────────────────────────
    doc.setFillColor(232, 245, 233);
    doc.roundedRect(M, y, CW, 16, 2, 2, 'F');
    doc.setDrawColor(49, 101, 78);
    doc.setLineWidth(0.8);
    doc.line(M, y, M, y + 16);

    doc.setFontSize(8);
    doc.setTextColor(46, 125, 50);
    doc.setFont(undefined, 'bold');
    doc.text('Prazo de entrega:', M + 5, y + 7);
    doc.setFont(undefined, 'normal');
    doc.text('3 horas a 2 dias uteis — Curitiba e regiao metropolitana.', M + 38, y + 7);
    doc.setFontSize(7.5);
    doc.text('Precisa hoje? Entre em contato para prioridade na entrega.', M + 5, y + 13);
    y += 21;

    // ── RODAPÉ ────────────────────────────────────────
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(M, y, M + CW, y);
    doc.setFontSize(7);
    doc.setTextColor(170, 170, 170);
    doc.text('Valido por tempo indeterminado  |  Decorcom Interiores  |  (41) 3319-8635  |  @decorcominteriores', PW / 2, y + 5, { align: 'center' });

    doc.save(nomeArquivo);

    if (btn) { btn.textContent = '✅ PDF salvo!'; btn.disabled = false; }
    setTimeout(function(){ if(btn) btn.textContent = '💾 Salvar Orçamento'; }, 3000);

    // Salva no Supabase
    var clienteNome     = (document.getElementById('confNome') && document.getElementById('confNome').value.trim()) || '';
    var clienteEndereco = (document.getElementById('confEndereco') && document.getElementById('confEndereco').value.trim()) || '';
    var clienteTelefone = (document.getElementById('confTelefone') && document.getElementById('confTelefone').value.trim()) || '';
    fetch(SUPABASE_URL + '/rest/v1/orcamentos', {
      method: 'POST',
      headers: {'Content-Type':'application/json','apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY},
      body: JSON.stringify({
        produto_nome: orcProduto.nome + ' - ' + orcProduto.detalhe,
        produto_preco: orcDados.precoPorMetro,
        metragem: orcDados.metragem,
        metragem_com_sobra: orcDados.total,
        quantidade_barras: orcDados.qtdBarras,
        valor_total: orcDados.subtotal,
        com_instalacao: comInstalacao,
        cliente_nome: clienteNome,
        cliente_bairro: clienteEndereco,
        cliente_telefone: clienteTelefone,
        status: 'orcamento_salvo'
      })
    }).catch(function(e){ console.log('supabase:', e); });
  }
}

/* ─────────────────────────────────────
   CONFIGURAÇÃO SUPABASE
───────────────────────────────────── */
var SUPABASE_URL = 'https://htcckwppfuivnqokyagj.supabase.co';
var SUPABASE_KEY = 'sb_publishable_yn7UJtNMRp-UDP2SC91GWA_bWYkdnK1';
var orcProduto = {};
var comInstalacao = false;
var valorRemocao = 0;
var temEscada = false;
var qtdAndares = 1;
var PRECO_ESCADA = 520.00;
var orcDados = {};
var silBrancoAtivo = true;
var silPu40Ativo = true;
var remocaoAtivo = true;
var silBrancoDisponivel = true; // false para produtos Preto e Cinza

// Preço instalação por altura
/* ─────────────────────────────────────
   TABELA DE PREÇOS
───────────────────────────────────── */
var precoInstalacao = {
  '3': 11.99, '5': 11.99, '7': 11.99, '10': 11.99, '12': 11.99,
  '15': 13.99, '20': 18.99, 'sobrepor': 13.99
};
var MIN_MAO_DE_OBRA = 350.00;

function getAlturaPrecoInst(detalhe) {
  var m = detalhe.match(/^(\d+)cm/i);
  if (m) { return precoInstalacao[m[1]] || 11.99; }
  if (/sobrepor/i.test(detalhe)) { return precoInstalacao['sobrepor']; }
  return 11.99;
}

function calcularValorInst(metrosComprar, precoInst) {
  var valorCalculado = metrosComprar * precoInst;
  return Math.max(valorCalculado, MIN_MAO_DE_OBRA);
}

/* ─────────────────────────────────────
   UTILITÁRIOS
───────────────────────────────────── */
function mascaraCpf(input) {
  var v = input.value.replace(/\D/g,'').substring(0,11);
  v = v.replace(/(\d{3})(\d)/,'$1.$2');
  v = v.replace(/(\d{3})(\d)/,'$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/,'$1-$2');
  input.value = v;
}

function fmt(n) {
  var parts = n.toFixed(2).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return 'R$ ' + parts[0] + ',' + parts[1];
}
function fmtN(n) {
  var parts = n.toFixed(2).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts[0] + ',' + parts[1];
}

/* ─────────────────────────────────────
   MODAL DE ORÇAMENTO
───────────────────────────────────── */
/* ─────────────────────────────────────
   TOGGLE SILICONES
───────────────────────────────────── */
function toggleSilicone(tipo) {
  if (tipo === 'branco') silBrancoAtivo = !silBrancoAtivo;
  else silPu40Ativo = !silPu40Ativo;
  recalcularMapa();
}

function toggleRemocao() {
  remocaoAtivo = !remocaoAtivo;
  recalcularMapa();
}

function recalcularMapa() {
  var d = orcDados;
  var valSilBranco = silBrancoAtivo ? d.valSilBranco : 0;
  var valSilPu40   = silPu40Ativo   ? d.valSilPu40   : 0;
  var valRem       = remocaoAtivo   ? d.valorRem     : 0;
  var subtotal = d.valorProdutos + d.valorInst + valRem + valSilBranco + valSilPu40 + d.valorEscada + d.entrega;
  var parcela5x  = (subtotal * 1.11) / 5;
  var parcela10x = (subtotal * 1.11) / 10;
  orcDados.subtotal   = subtotal;
  orcDados.parcela5x  = parcela5x;
  orcDados.parcela10x = parcela10x;

  // Re-renderiza linhas de silicone
  var linhas = document.getElementById('orcMapa');
  if (!linhas) return;

  // Atualiza linha de remoção
  var remEl = linhas.querySelector('[data-rem]');
  if (remEl) remEl.outerHTML = renderLinhaRemocao(d.metrosComprar, d.descRem, d.valorRem);

  // Atualiza só as linhas de silicone (por data-sil)
  var silBrancoEl = linhas.querySelector('[data-sil="branco"]');
  var silPu40El   = linhas.querySelector('[data-sil="pu40"]');
  if (silBrancoEl) silBrancoEl.outerHTML = renderLinhaSiliconeTagged('branco', d.qtdSilBranco, d.valSilBranco);
  // após substituição, busca novamente para pu40
  var silPu40ElNew = linhas.querySelector('[data-sil="pu40"]');
  if (silPu40ElNew) silPu40ElNew.outerHTML = renderLinhaSiliconeTagged('pu40', d.qtdSilPu40, d.valSilPu40);

  // Atualiza total no mapa
  var totalEl = linhas.querySelector('.orc-mapa-total span:last-child');
  if (totalEl) totalEl.textContent = fmt(subtotal);

  // Atualiza formas de pagamento
  var pags = document.getElementById('orcPagamentos');
  if (pags) {
    pags.innerHTML = ''
      + '<div class="orc-pag-title">Formas de Pagamento</div>'
      + '<div class="orc-pag-linha orc-pag-pix"><span>PIX (à vista)</span><span>' + fmt(subtotal) + '</span></div>'
      + '<div class="orc-pag-linha orc-pag-cred"><span>Crédito 5x via link</span><span>' + fmt(parcela5x) + '/mês</span></div>'
      + '<div class="orc-pag-linha orc-pag-cred"><span>Crédito 10x presencial (loja)</span><span>' + fmt(parcela10x) + '/mês</span></div>';
  }
}

function renderLinhaRemocao(metros, desc, val) {
  var label = fmtN(metros) + 'm ' + desc + ' R$' + fmtN(valorRemocao) + '/m';
  if (remocaoAtivo) {
    return '<div class="orc-mapa-linha" data-rem="1">'
      + '<span class="desc">' + label + '</span>'
      + '<span class="orc-sil-actions">'
      + '<span class="val">' + fmt(val) + '</span>'
      + '<button class="orc-sil-btn orc-sil-del" onclick="toggleRemocao()" title="Remover">🗑</button>'
      + '</span></div>';
  } else {
    return '<div class="orc-mapa-linha orc-mapa-linha-removida" data-rem="1">'
      + '<span class="desc orc-sil-removido">' + label + ' <em>(removido)</em></span>'
      + '<span class="orc-sil-actions">'
      + '<button class="orc-sil-btn orc-sil-add" onclick="toggleRemocao()" title="Restaurar">↩</button>'
      + '</span></div>';
  }
}

// Versão com data-sil attribute para poder localizar e substituir no DOM
function renderLinhaSiliconeTagged(tipo, qtd, val) {
  if (tipo === 'branco' && !silBrancoDisponivel) return '';
  var ativo = tipo === 'branco' ? silBrancoAtivo : silPu40Ativo;
  var label = tipo === 'branco'
    ? qtd + 'x Silicone Branco R$19,99'
    : qtd + 'x Silicone PU40 (Cola) R$21,99';

  // Com instalação: sem opção de remover — silicones são obrigatórios
  if (comInstalacao) {
    return '<div class="orc-mapa-linha" data-sil="' + tipo + '">'
      + '<span class="desc">' + label + '</span>'
      + '<span class="val">' + fmt(val) + '</span>'
      + '</div>';
  }

  if (ativo) {
    return '<div class="orc-mapa-linha" data-sil="' + tipo + '">'
      + '<span class="desc">' + label + '</span>'
      + '<span class="orc-sil-actions">'
      + '<span class="val">' + fmt(val) + '</span>'
      + '<button class="orc-sil-btn orc-sil-del" onclick="toggleSilicone(\'' + tipo + '\')" title="Remover">🗑</button>'
      + '</span></div>';
  } else {
    return '<div class="orc-mapa-linha orc-mapa-linha-removida" data-sil="' + tipo + '">'
      + '<span class="desc orc-sil-removido">' + label + ' <em>(removido)</em></span>'
      + '<span class="orc-sil-actions">'
      + '<button class="orc-sil-btn orc-sil-add" onclick="toggleSilicone(\'' + tipo + '\')" title="Restaurar">↩</button>'
      + '</span></div>';
  }
}

function abrirOrcamento(btn) {
  if (btn.id === 'lb-btn') closeLb();
  var card = (btn.id === 'lb-btn' && lbSourceCard) ? lbSourceCard : btn.closest('.card');
  var nome = 'Rodapé ' + (card.querySelector('.card-cor') ? card.querySelector('.card-cor').textContent : '');
  var detalhe = card.querySelector('.card-detalhe') ? card.querySelector('.card-detalhe').textContent : '';
  var preco = btn.getAttribute('data-preco');
  var alt = card.querySelector('img') ? card.querySelector('img').alt : '';
  silBrancoDisponivel = !/preto|cinza/i.test(nome);
  silBrancoAtivo = silBrancoDisponivel;
  silPu40Ativo = true;
  remocaoAtivo = true;
  orcProduto = {nome: nome, detalhe: detalhe, preco: preco, alt: alt};
  document.getElementById('orcProdutoNome').textContent = nome;
  document.getElementById('orcProdutoDetalhe').textContent = detalhe;
  document.getElementById('orcMetragem').value = '';
  document.getElementById('orcCalc').classList.remove('show');
  document.getElementById('orcStep1').style.display = 'flex';
  document.getElementById('orcStep2').style.display = 'none';
  document.getElementById('orcSuccess').style.display = 'none';
  document.getElementById('btnSemInst').classList.remove('ativo');
  document.getElementById('btnComInst').classList.remove('ativo');
  document.getElementById('btnRemNao').classList.add('ativo');
  document.getElementById('btnRemMdf').classList.remove('ativo');
  document.getElementById('btnRemCer').classList.remove('ativo');
  document.getElementById('orcHeaderTitle').textContent = 'Solicitar Orçamento';
  document.getElementById('orcHeaderSub').textContent = 'Calcule sua necessidade';
  comInstalacao = false;
  valorRemocao = 0;
  temEscada = false;
  document.getElementById('blocoEscada').style.display = 'none';
  document.getElementById('blocoRemocao').style.display = 'none';
  qtdAndares = 1;
  var escadaToggle = document.getElementById('escadaToggle');
  var escadaLabel = document.getElementById('escadaLabel');
  var escadaAndares = document.getElementById('escadaAndares');
  if (escadaToggle) escadaToggle.classList.remove('ativo');
  if (escadaLabel) escadaLabel.classList.remove('ativo');
  if (escadaAndares) { escadaAndares.style.display = 'none'; }
  if (document.getElementById('andoresVal')) document.getElementById('andoresVal').textContent = '1';
  /* ─────────────────────────────────────
   EVENTOS GLOBAIS
───────────────────────────────────── */
document.getElementById('orcOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function fecharOrcamento() {
  document.getElementById('orcOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function setInstalacao(val) {
  comInstalacao = val;
  document.getElementById('btnSemInst').classList.toggle('ativo', !val);
  document.getElementById('btnComInst').classList.toggle('ativo', val);
  var display = val ? 'block' : 'none';
  document.getElementById('blocoEscada').style.display = display;
  document.getElementById('blocoRemocao').style.display = display;
  if (!val) {
    temEscada = false;
    qtdAndares = 1;
    var escadaToggle = document.getElementById('escadaToggle');
    var escadaLabel = document.getElementById('escadaLabel');
    if (escadaToggle) escadaToggle.classList.remove('ativo');
    if (escadaLabel) escadaLabel.classList.remove('ativo');
    document.getElementById('escadaAndares').style.display = 'none';
    document.getElementById('andoresVal').textContent = '1';
    setRemocao(0);
  }
}

function toggleEscada() {
  temEscada = !temEscada;
  var toggle = document.getElementById('escadaToggle');
  var label = document.getElementById('escadaLabel');
  var andares = document.getElementById('escadaAndares');
  if (toggle) toggle.classList.toggle('ativo', temEscada);
  if (label) label.classList.toggle('ativo', temEscada);
  if (andares) andares.style.display = temEscada ? 'flex' : 'none';
}

function ajustarAndares(delta) {
  qtdAndares = Math.max(1, Math.min(10, qtdAndares + delta));
  document.getElementById('andoresVal').textContent = qtdAndares;
}

function setRemocao(val) {
  valorRemocao = val;
  document.getElementById('btnRemNao').classList.toggle('ativo', val === 0);
  document.getElementById('btnRemMdf').classList.toggle('ativo', val === 3.50);
  document.getElementById('btnRemCer').classList.toggle('ativo', val === 5.50);
}

/* ─────────────────────────────────────
   CÁLCULO DO ORÇAMENTO
───────────────────────────────────── */
function calcularOrcamento() {
  var med = parseFloat(document.getElementById('orcMetragem').value);
  if (!med || med <= 0) { document.getElementById('orcCalc').classList.remove('show'); return; }
  var sobra = med * 0.10;
  var total = med + sobra;
  var barraSize = 2.40;
  var qtdBarras = Math.ceil(total / barraSize);
  var metrosComprar = qtdBarras * barraSize;
  var precoStr = orcProduto.preco.replace('R$','').replace('o metro','').replace(',','.').trim();
  var precoPorMetro = parseFloat(precoStr);
  var valorProdutos = metrosComprar * precoPorMetro;
  document.getElementById('calcMed').textContent = med.toFixed(2) + 'm';
  document.getElementById('calcSobra').textContent = sobra.toFixed(2) + 'm';
  document.getElementById('calcTotal').textContent = total.toFixed(2) + 'm';
  document.getElementById('calcBarra').textContent = barraSize.toFixed(2) + 'm';
  document.getElementById('calcQtd').textContent = qtdBarras + ' barras (' + metrosComprar.toFixed(2) + 'm)';
  document.getElementById('calcValor').textContent = fmt(valorProdutos);
  document.getElementById('orcCalc').classList.add('show');
}

/* ─────────────────────────────────────
   ETAPA 2 — REVISÃO
───────────────────────────────────── */
function visualizarOrcamento() {
  var metragem = parseFloat(document.getElementById('orcMetragem').value);
  var nome = document.getElementById('orcNome').value.trim();
  var endereco = document.getElementById('orcEndereco').value.trim();
  var telefone = document.getElementById('orcTelefone').value.trim();
  if (!metragem || !nome || !endereco || !telefone) { alert('Por favor, preencha todos os campos!'); return; }

  var sobra = metragem * 0.10;
  var total = metragem + sobra;
  var qtdBarras = Math.ceil(total / 2.40);
  var metrosComprar = qtdBarras * 2.40;
  var precoStr = orcProduto.preco.replace('R$','').replace('o metro','').replace(',','.').trim();
  var precoPorMetro = parseFloat(precoStr);
  var valorProdutos = metrosComprar * precoPorMetro;

  var qtdSilBranco = silBrancoDisponivel ? Math.ceil(metrosComprar / 20) : 0;
  var qtdSilPu40 = Math.ceil(metrosComprar / 15);
  var valSilBranco = qtdSilBranco * 19.99;
  var valSilPu40 = qtdSilPu40 * 21.99;

  var precoInst = getAlturaPrecoInst(orcProduto.detalhe);
  var valorInst = comInstalacao ? calcularValorInst(metrosComprar, precoInst) : 0;
  var instMinimo = comInstalacao && (metrosComprar * precoInst) < MIN_MAO_DE_OBRA;

  var valorRem = valorRemocao > 0 ? metrosComprar * valorRemocao : 0;
  var descRem = valorRemocao === 3.50 ? 'Remoção Rodapé MDF' : 'Remoção Rodapé Cerâmica';

  var valorEscada = temEscada ? qtdAndares * PRECO_ESCADA : 0;

  var entrega = 55.00;

  var subtotal = valorProdutos + valorInst + valorRem + valSilBranco + valSilPu40 + valorEscada + entrega;
  var totalCredito = subtotal * 1.11;
  var parcela5x = totalCredito / 5;
  var parcela10x = totalCredito / 10;

  orcDados = {
    metragem: metragem, total: total, qtdBarras: qtdBarras, metrosComprar: metrosComprar,
    precoPorMetro: precoPorMetro, valorProdutos: valorProdutos,
    valorInst: valorInst, precoInst: precoInst,
    valorRem: valorRem, descRem: descRem,
    valorEscada: valorEscada, qtdAndaresSalvo: temEscada ? qtdAndares : 0,
    qtdSilBranco: qtdSilBranco, valSilBranco: valSilBranco,
    qtdSilPu40: qtdSilPu40, valSilPu40: valSilPu40,
    entrega: entrega, subtotal: subtotal,
    parcela5x: parcela5x, parcela10x: parcela10x,
    nome: nome, endereco: endereco, telefone: telefone
  };

  var linhas = '';
  linhas += '<div class="orc-mapa-title">Orçamento Decorcom</div>';
  linhas += '<div class="orc-mapa-linha"><span class="desc">' + fmtN(metrosComprar) + 'm ' + orcProduto.nome + ' ' + orcProduto.detalhe + '</span><span class="val">' + fmt(valorProdutos) + '</span></div>';
  if (comInstalacao) {
    var descInst = instMinimo
      ? 'Mão de Obra — taxa mínima'
      : fmtN(metrosComprar) + 'm Mão de Obra R$' + fmtN(precoInst) + '/m';
    linhas += '<div class="orc-mapa-linha"><span class="desc">' + descInst + '</span><span class="val">' + fmt(valorInst) + '</span></div>';
  }
  if (valorRemocao > 0) {
    linhas += renderLinhaRemocao(metrosComprar, descRem, valorRem);
  }
  if (temEscada && valorEscada > 0) {
    linhas += '<div class="orc-mapa-linha"><span class="desc">' + qtdAndares + 'x Mão de obra escada R$520,00</span><span class="val">' + fmt(valorEscada) + '</span></div>';
  }
  linhas += renderLinhaSiliconeTagged('branco', qtdSilBranco, valSilBranco);
  linhas += renderLinhaSiliconeTagged('pu40', qtdSilPu40, valSilPu40);
  linhas += '<div class="orc-mapa-linha"><span class="desc">Entrega</span><span class="val">' + fmt(entrega) + '</span></div>';
  linhas += '<div class="orc-mapa-total"><span>TOTAL PIX</span><span>' + fmt(subtotal) + '</span></div>';
  document.getElementById('orcMapa').innerHTML = linhas;

  // Formas de pagamento
  var pags = '';
  pags += '<div class="orc-pag-title">Formas de Pagamento</div>';
  pags += '<div class="orc-pag-linha orc-pag-pix"><span>PIX (à vista)</span><span>' + fmt(subtotal) + '</span></div>';
  pags += '<div class="orc-pag-linha orc-pag-cred"><span>Crédito 5x via link</span><span>' + fmt(parcela5x) + '/mês</span></div>';
  pags += '<div class="orc-pag-linha orc-pag-cred"><span>Crédito 10x presencial (loja)</span><span>' + fmt(parcela10x) + '/mês</span></div>';
  document.getElementById('orcPagamentos').innerHTML = pags;

  document.getElementById('confNome').value = nome;
  document.getElementById('confEndereco').value = endereco;
  document.getElementById('confTelefone').value = telefone;
  document.getElementById('confCpf').value = '';

  var urgenteRow = document.getElementById('orcUrgenteRow');
  if (urgenteRow) urgenteRow.style.display = 'flex';
  var prazoSub = document.getElementById('prazSubtexto');
  if (prazoSub) {
    var textoUrgente = comInstalacao
      ? 'Tem pressa? Use o botão <strong style="color:#e63946;">URGENTE</strong> abaixo para prioridade na entrega, e instalação.'
      : 'Tem pressa? Use o botão <strong style="color:#e63946;">URGENTE</strong> abaixo para prioridade na entrega.';
    prazoSub.innerHTML = textoUrgente;
  }

  document.getElementById('orcStep1').style.display = 'none';
  document.getElementById('orcStep2').style.display = 'flex';
  document.getElementById('orcHeaderTitle').textContent = 'Revisão do Orçamento';
  // data no hero
  var d = new Date();
  var dataStr = d.toLocaleDateString('pt-BR', {day:'2-digit',month:'2-digit',year:'numeric'});
  document.getElementById('orcHeroDate').textContent = dataStr;
  document.getElementById('orcHeaderSub').textContent = 'Confirme seus dados';
  document.querySelector('.orc-card').scrollTop = 0;
}

function voltarStep1() {
  document.getElementById('orcStep1').style.display = 'flex';
  document.getElementById('orcStep2').style.display = 'none';
  document.getElementById('orcHeaderTitle').textContent = 'Solicitar Orçamento';
  document.getElementById('orcHeaderSub').textContent = 'Calcule sua necessidade';
}

/* ═══════════════════════════════════════════════════════
   SISTEMA DE CONTRATOS
═══════════════════════════════════════════════════════ */

// Regras de tempo de instalação — rodapés
var REGRAS_INST = [
  { max: 57.60,    dias: 1 },
  { max: 76.80,    dias: 2 },
  { max: 100.80,   dias: 3 },
  { max: 132.00,   dias: 4 },
  { max: Infinity, dias: 5 }
];

var dataInstalacaoSelecionada = null;
var diasInstalacaoNecessarios = 1;
var numeroContratoGerado = null;
var _mesCalendario = null; // mês sendo exibido no calendário

function calcDiasInstalacao(metros) {
  for (var i = 0; i < REGRAS_INST.length; i++) {
    if (metros <= REGRAS_INST[i].max) return REGRAS_INST[i].dias;
  }
  return 5;
}

function proximoDiaUtil(data) {
  var d = new Date(data);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return d;
}

function addDiasUteis(dataInicio, dias) {
  var d = new Date(dataInicio);
  var adicionados = 0;
  while (adicionados < dias - 1) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) adicionados++;
  }
  return d;
}

function fmtDataBR(d) {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
function fmtDataCurta(d) {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

// ── Busca próximo número de contrato no Supabase ──────
function buscarProximoNumeroContrato(cb) {
  fetch(SUPABASE_URL + '/rest/v1/contratos?select=numero_contrato&order=numero_contrato.desc&limit=1', {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    var proximo = (data && data.length > 0 && data[0].numero_contrato) ? data[0].numero_contrato + 1 : 5402;
    cb(proximo);
  })
  .catch(function() { cb(5402); });
}

// ── Ponto de entrada ao clicar "Comprar e Gerar Contrato" ──
function iniciarContrato() {
  var nome = document.getElementById('confNome').value.trim();
  var cpf  = document.getElementById('confCpf').value.trim();
  var end  = document.getElementById('confEndereco').value.trim();
  var tel  = document.getElementById('confTelefone').value.trim();
  if (!nome || !cpf || !end || !tel) { alert('Por favor, preencha todos os campos!'); return; }

  if (comInstalacao) {
    diasInstalacaoNecessarios = calcDiasInstalacao(orcDados.metrosComprar);
    document.getElementById('calDiasLabel').textContent = diasInstalacaoNecessarios + (diasInstalacaoNecessarios === 1 ? ' dia' : ' dias');
    dataInstalacaoSelecionada = null;
    document.getElementById('calSelecaoInfo').style.display = 'none';
    document.getElementById('btnConfirmarContrato').disabled = true;
    _mesCalendario = null;
    renderizarCalendario();
    document.getElementById('orcStep2').style.display = 'none';
    document.getElementById('orcStep3').style.display = 'flex';
  } else {
    // Sem instalação: busca número e vai direto para revisão
    var btn = document.getElementById('orcBtnComprar');
    btn.disabled = true;
    btn.textContent = 'Aguarde...';
    buscarProximoNumeroContrato(function(num) {
      numeroContratoGerado = num;
      btn.disabled = false;
      btn.textContent = 'Comprar e Gerar Contrato';
      irParaRevisaoContrato();
    });
  }
}

function voltarStep2() {
  document.getElementById('orcStep3').style.display = 'none';
  document.getElementById('orcStep2').style.display = 'flex';
}

// ── Calendário ────────────────────────────────────────
function renderizarCalendario() {
  var hoje = new Date();
  hoje.setHours(0,0,0,0);

  // Data mínima: D+2 dias úteis
  var minData = new Date(hoje);
  minData.setDate(minData.getDate() + 2);
  minData = proximoDiaUtil(minData);

  // Mês exibido
  if (!_mesCalendario) _mesCalendario = new Date(minData.getFullYear(), minData.getMonth(), 1);
  var mes = _mesCalendario;

  var nomeMes = mes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  nomeMes = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);

  var ultimoDia = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();

  // Calcula o offset do primeiro dia útil (segunda=0 ... sexta=4)
  var primeiroDiaMes = new Date(mes.getFullYear(), mes.getMonth(), 1);

  var html = '<div class="cal-mes-header">' + nomeMes + '</div>';
  html += '<div class="cal-grid">';
  ['Seg','Ter','Qua','Qui','Sex'].forEach(function(d) {
    html += '<div class="cal-dia-label">' + d + '</div>';
  });

  // Offset: quantos dias úteis já passaram antes do primeiro dia do mês
  // dow: 0=dom,1=seg..5=sex,6=sab
  var firstDow = primeiroDiaMes.getDay(); // 0-6
  // Mapeia para coluna (Seg=0..Sex=4), sábado e domingo = fora do grid
  var colOffset = (firstDow === 0) ? 4 : (firstDow === 6) ? 5 : firstDow - 1;
  // Adiciona células vazias antes do primeiro dia útil
  if (colOffset > 0 && colOffset < 5) {
    for (var o = 0; o < colOffset; o++) html += '<div class="cal-dia cal-dia-vazio"></div>';
  }

  for (var d = 1; d <= ultimoDia; d++) {
    var data = new Date(mes.getFullYear(), mes.getMonth(), d);
    var dow = data.getDay();
    if (dow === 0 || dow === 6) continue; // pula fim de semana
    var passado = data < minData;
    var dataStr = data.toISOString().split('T')[0];
    if (passado) {
      html += '<div class="cal-dia cal-dia-inativo">' + d + '</div>';
    } else {
      var selecionado = dataInstalacaoSelecionada && dataStr === dataInstalacaoSelecionada.toISOString().split('T')[0];
      html += '<div class="cal-dia cal-dia-ativo' + (selecionado ? ' cal-dia-selecionado' : '') + '" onclick="selecionarDataInst(\'' + dataStr + '\')" data-data="' + dataStr + '">' + d + '</div>';
    }
  }
  html += '</div>';

  // Navegação meses
  var mesAnterior = new Date(mes.getFullYear(), mes.getMonth() - 1, 1);
  var proximoMes  = new Date(mes.getFullYear(), mes.getMonth() + 1, 1);
  var podeAnterior = mesAnterior >= new Date(minData.getFullYear(), minData.getMonth(), 1);
  html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">'
       + (podeAnterior ? '<button class="cal-nav-btn" onclick="navCalendario(-1)">‹</button>' : '<span style="width:28px"></span>')
       + html.replace('<div class="cal-mes-header">' + nomeMes + '</div>', '<span style="font-size:13px;font-weight:600;color:#31654e;">' + nomeMes + '</span>')
       + '<button class="cal-nav-btn" onclick="navCalendario(1)">›</button>'
       + '</div>'
       + html.replace('<div class="cal-mes-header">' + nomeMes + '</div>', '');

  // Remonta sem duplicar o header
  var cal = document.getElementById('orcCalendario');
  cal.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">'
    + (podeAnterior ? '<button class="cal-nav-btn" onclick="navCalendario(-1)">‹</button>' : '<span style="width:28px"></span>')
    + '<span style="font-size:13px;font-weight:600;color:#31654e;text-transform:capitalize;">' + nomeMes + '</span>'
    + '<button class="cal-nav-btn" onclick="navCalendario(1)">›</button>'
    + '</div>'
    + '<div class="cal-grid">'
    + ['Seg','Ter','Qua','Qui','Sex'].map(function(d){ return '<div class="cal-dia-label">'+d+'</div>'; }).join('')
    + (function(){
        var cells = '';
        var fw = primeiroDiaMes.getDay();
        var off = (fw === 0) ? 4 : (fw === 6) ? 5 : fw - 1;
        for (var o = 0; o < off && off < 5; o++) cells += '<div class="cal-dia cal-dia-vazio"></div>';
        for (var d = 1; d <= ultimoDia; d++) {
          var dt = new Date(mes.getFullYear(), mes.getMonth(), d);
          var dw = dt.getDay();
          if (dw === 0 || dw === 6) continue;
          var past = dt < minData;
          var ds = dt.toISOString().split('T')[0];
          var sel = dataInstalacaoSelecionada && ds === dataInstalacaoSelecionada.toISOString().split('T')[0];
          if (past) cells += '<div class="cal-dia cal-dia-inativo">'+d+'</div>';
          else cells += '<div class="cal-dia cal-dia-ativo'+(sel?' cal-dia-selecionado':'')+'" onclick="selecionarDataInst(\''+ds+'\')" data-data="'+ds+'">'+d+'</div>';
        }
        return cells;
      })()
    + '</div>';
}

function navCalendario(dir) {
  if (!_mesCalendario) _mesCalendario = new Date();
  _mesCalendario = new Date(_mesCalendario.getFullYear(), _mesCalendario.getMonth() + dir, 1);
  renderizarCalendario();
}

function selecionarDataInst(dataStr) {
  dataInstalacaoSelecionada = new Date(dataStr + 'T12:00:00');
  renderizarCalendario(); // re-render para marcar selecionado

  var dataFim = addDiasUteis(dataInstalacaoSelecionada, diasInstalacaoNecessarios);
  var rangeStr = diasInstalacaoNecessarios === 1
    ? fmtDataCurta(dataInstalacaoSelecionada) + ' (1 dia)'
    : fmtDataCurta(dataInstalacaoSelecionada) + ' a ' + fmtDataCurta(dataFim) + ' (' + diasInstalacaoNecessarios + ' dias)';

  document.getElementById('calDataRange').textContent = rangeStr;
  document.getElementById('calSelecaoInfo').style.display = 'flex';
  document.getElementById('btnConfirmarContrato').disabled = false;
}

// ── Confirmar data (Step 3) → vai para Step 4 ────────
function confirmarEGerarContrato() {
  var btn = document.getElementById('btnConfirmarContrato');
  btn.disabled = true;
  btn.textContent = 'Aguarde...';
  buscarProximoNumeroContrato(function(num) {
    numeroContratoGerado = num;
    btn.disabled = false;
    btn.textContent = 'Continuar →';
    irParaRevisaoContrato();
  });
}

// ── Monta e exibe Step 4 ─────────────────────────────
var _dadosContrato = null;

function irParaRevisaoContrato() {
  var nome     = document.getElementById('confNome').value.trim();
  var cpf      = document.getElementById('confCpf').value.trim();
  var endereco = document.getElementById('confEndereco').value.trim();
  var telefone = document.getElementById('confTelefone').value.trim();

  var dataEntregaTexto, dataInstTexto, dataInstFimTexto;
  if (comInstalacao) {
    dataEntregaTexto = isUrgente
      ? 'Urgente — vamos agilizar, entraremos em contato combinando.'
      : 'Vamos agilizar, entraremos em contato combinando.';
    if (dataInstalacaoSelecionada) {
      var dataFim = addDiasUteis(dataInstalacaoSelecionada, diasInstalacaoNecessarios);
      dataInstTexto    = fmtDataBR(dataInstalacaoSelecionada);
      dataInstFimTexto = diasInstalacaoNecessarios > 1 ? fmtDataBR(dataFim) : '';
    }
  } else {
    dataEntregaTexto = isUrgente
      ? 'Urgente — vamos agilizar, entraremos em contato combinando.'
      : '3h a 2 dias úteis — entraremos em contato combinando.';
    dataInstTexto = null; dataInstFimTexto = null;
  }

  _dadosContrato = {
    numeroContrato: numeroContratoGerado,
    nome: nome, cpf: cpf, endereco: endereco, telefone: telefone,
    dataEntregaTexto: dataEntregaTexto,
    dataInstTexto: dataInstTexto,
    dataInstFimTexto: dataInstFimTexto,
    diasInstalacao: diasInstalacaoNecessarios
  };

  // Número do contrato
  document.getElementById('prevNumContrato').textContent = numeroContratoGerado;

  // Resumo financeiro (clona o mapa do orçamento)
  var mapaEl = document.getElementById('orcMapa');
  var resumo = document.getElementById('prevResumo');
  resumo.innerHTML = mapaEl ? mapaEl.innerHTML : '';

  // Datas
  var datasEl = document.getElementById('prevDatas');
  var urgClass = isUrgente ? ' urgente' : '';
  var datasHtml = '<div class="orc-contrato-data-box' + urgClass + '">'
    + '<div class="orc-contrato-data-label">Entrega</div>'
    + '<div class="orc-contrato-data-val">' + dataEntregaTexto + '</div></div>';
  if (dataInstTexto) {
    var instRange = dataInstTexto + (dataInstFimTexto ? ' a ' + dataInstFimTexto : '');
    datasHtml += '<div class="orc-contrato-data-box">'
      + '<div class="orc-contrato-data-label">Instalação (prazo médio)</div>'
      + '<div class="orc-contrato-data-val">' + instRange + '</div></div>';
  }
  datasEl.innerHTML = datasHtml;

  // Reset aceite
  document.getElementById('checkAceite').checked = false;
  document.getElementById('btnIrPagamento').disabled = true;

  // Troca de step
  document.getElementById('orcStep2').style.display = 'none';
  document.getElementById('orcStep3').style.display = 'none';
  document.getElementById('orcStep4').style.display = 'flex';
}

function toggleClausulas(btn) {
  var lista = document.getElementById('orcClausulas');
  var aberto = lista.style.display !== 'none';
  lista.style.display = aberto ? 'none' : 'block';
  btn.textContent = aberto
    ? '📋 Ver cláusulas e termos do contrato ▼'
    : '📋 Ocultar cláusulas ▲';
}

function toggleBtnPagamento() {
  var checked = document.getElementById('checkAceite').checked;
  document.getElementById('btnIrPagamento').disabled = !checked;
}

function voltarParaCalendario() {
  document.getElementById('orcStep4').style.display = 'none';
  if (comInstalacao) {
    document.getElementById('orcStep3').style.display = 'flex';
  } else {
    document.getElementById('orcStep2').style.display = 'flex';
  }
}

function voltarStep4() {
  document.getElementById('orcStep5').style.display = 'none';
  document.getElementById('orcStep4').style.display = 'flex';
}

// ── Step 5: tela de pagamento ─────────────────────────
function irParaPagamento() {
  document.getElementById('pagNumContrato').textContent = numeroContratoGerado;
  document.getElementById('pagTotalValor').textContent  = fmt(orcDados.subtotal);
  document.getElementById('pagValorPix').textContent    = fmt(orcDados.subtotal);
  document.getElementById('pagValorCredito').textContent = fmt(orcDados.parcela5x) + '/mês (5x)';
  // Reset seleção
  document.getElementById('pixDetalhes').style.display     = 'none';
  document.getElementById('creditoDetalhes').style.display = 'none';
  document.getElementById('opcaoPix').classList.remove('ativo');
  document.getElementById('opcaoCredito').classList.remove('ativo');
  document.getElementById('radioPix').classList.remove('ativo');
  document.getElementById('radioCredito').classList.remove('ativo');

  document.getElementById('orcStep4').style.display = 'none';
  document.getElementById('orcStep5').style.display = 'flex';
}

function selecionarPagamento(tipo) {
  var isPix = tipo === 'pix';
  document.getElementById('opcaoPix').classList.toggle('ativo', isPix);
  document.getElementById('opcaoCredito').classList.toggle('ativo', !isPix);
  document.getElementById('radioPix').classList.toggle('ativo', isPix);
  document.getElementById('radioCredito').classList.toggle('ativo', !isPix);
  document.getElementById('pixDetalhes').style.display     = isPix ? 'flex'  : 'none';
  document.getElementById('creditoDetalhes').style.display = isPix ? 'none' : 'flex';
}

// ── Finalizar: gera PDF + salva + WhatsApp ────────────
function finalizarContrato(e) {
  if (e) e.stopPropagation();
  var btnFin = document.querySelector('.orc-btn-pix');
  if (btnFin) { btnFin.disabled = true; btnFin.textContent = 'Gerando contrato...'; }

  var dados = _dadosContrato;
  gerarContratoPDF(dados, function() {
    salvarContrato(dados);

    var urgMsg = isUrgente ? '\n🚨 ENTREGA URGENTE' : '';
    var linhas = [
      '📋 CONTRATO Nº ' + dados.numeroContrato + ' — DECORCOM' + urgMsg, '',
      'PRODUTO: ' + orcProduto.nome + ' ' + orcProduto.detalhe,
      fmtN(orcDados.metrosComprar) + 'm = ' + orcDados.qtdBarras + ' barras',
      'Valor produto: ' + fmt(orcDados.valorProdutos)
    ];
    if (comInstalacao) linhas.push('Mão de obra: ' + fmt(orcDados.valorInst));
    if (orcDados.qtdAndaresSalvo > 0) linhas.push('Escada (' + orcDados.qtdAndaresSalvo + ' andares): ' + fmt(orcDados.valorEscada));
    if (remocaoAtivo && orcDados.valorRem > 0) linhas.push(orcDados.descRem + ': ' + fmt(orcDados.valorRem));
    if (silBrancoAtivo && orcDados.qtdSilBranco > 0) linhas.push(orcDados.qtdSilBranco + 'x Silicone Branco: ' + fmt(orcDados.valSilBranco));
    if (silPu40Ativo && orcDados.qtdSilPu40 > 0) linhas.push(orcDados.qtdSilPu40 + 'x Silicone PU40: ' + fmt(orcDados.valSilPu40));
    linhas.push('Entrega: ' + fmt(orcDados.entrega));
    linhas.push('TOTAL PIX: ' + fmt(orcDados.subtotal));
    linhas.push('');
    linhas.push('ENTREGA: ' + dados.dataEntregaTexto);
    if (dados.dataInstTexto) linhas.push('INSTALAÇÃO: ' + dados.dataInstTexto + (dados.dataInstFimTexto ? ' a ' + dados.dataInstFimTexto : ''));
    linhas.push('');
    linhas.push('--- Comprovante PIX ---');
    linhas.push('Por favor, envie o comprovante do PIX para confirmarmos seu pedido.');
    linhas.push('Chave: 34.935.151/0001-53 (CNPJ Decorcom)');

    var msg = encodeURIComponent(linhas.join('\n'));

    document.getElementById('orcStep5').style.display = 'none';
    document.getElementById('orcSuccess').style.display = 'block';

    setTimeout(function() {
      fecharOrcamento();
      window.open('https://wa.me/554133198635?text=' + msg, '_blank');
    }, 1500);
  });
}

// ── Salva contrato no Supabase ────────────────────────
function salvarContrato(dados) {
  var d = new Date();
  fetch(SUPABASE_URL + '/rest/v1/contratos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY },
    body: JSON.stringify({
      numero_contrato:       dados.numeroContrato,
      ano:                   d.getFullYear(),
      mes:                   d.getMonth() + 1,
      cliente_nome:          dados.nome,
      cliente_cpf:           dados.cpf,
      cliente_endereco:      dados.endereco,
      cliente_telefone:      dados.telefone,
      produto_nome:          orcProduto.nome,
      produto_detalhe:       orcProduto.detalhe,
      metragem:              orcDados.metragem,
      metragem_total:        orcDados.metrosComprar,
      qtd_barras:            orcDados.qtdBarras,
      preco_metro:           orcDados.precoPorMetro,
      valor_produtos:        orcDados.valorProdutos,
      com_instalacao:        comInstalacao,
      valor_instalacao:      comInstalacao ? orcDados.valorInst : 0,
      valor_remocao:         (remocaoAtivo && orcDados.valorRem) ? orcDados.valorRem : 0,
      valor_silicone_branco: (silBrancoAtivo && orcDados.valSilBranco) ? orcDados.valSilBranco : 0,
      valor_silicone_pu40:   (silPu40Ativo && orcDados.valSilPu40) ? orcDados.valSilPu40 : 0,
      valor_entrega:         orcDados.entrega,
      valor_total:           orcDados.subtotal,
      data_entrega_texto:    dados.dataEntregaTexto,
      data_instalacao:       dados.dataInstTexto || null,
      data_instalacao_fim:   dados.dataInstFimTexto || null,
      dias_instalacao:       dados.diasInstalacao,
      is_urgente:            isUrgente,
      status:                'pendente_pagamento'
    })
  }).catch(function(e) { console.log('erro contrato supabase:', e); });
}

/* ─────────────────────────────────────
   PDF DO CONTRATO — 2 PÁGINAS
───────────────────────────────────── */
function gerarContratoPDF(dados, onDone) {
  var JsPDF = window.jspdf ? window.jspdf.jsPDF : (window.jsPDF || (typeof jsPDF !== 'undefined' ? jsPDF : null));
  if (!JsPDF) { alert('Biblioteca PDF não carregou. Recarregue a página.'); return; }

  var dataStr = new Date().toLocaleDateString('pt-BR');
  var nomeArq = 'contrato-decorcom-' + dados.numeroContrato + '.pdf';

  // Carrega imagens em paralelo
  var bgImg  = new Image();
  var sigImg = new Image();
  var bgOk = false, sigOk = false;

  function tryGerar() {
    if (!bgOk || !sigOk) return;
    renderBannerContrato(bgImg.naturalWidth ? bgImg : null, sigImg.naturalWidth ? sigImg : null);
  }

  bgImg.onload  = bgImg.onerror  = function() { bgOk  = true; tryGerar(); };
  sigImg.onload = sigImg.onerror = function() { sigOk = true; tryGerar(); };
  bgImg.crossOrigin  = 'anonymous';
  sigImg.crossOrigin = 'anonymous';
  bgImg.src  = 'img/banner-hero.jpg';
  sigImg.src = 'img/assinatura-henrique.jpeg';

  function renderBannerContrato(bgImg, sigImg) {
    var heroEl = document.getElementById('orcHeroHeader');
    var heroW  = heroEl ? heroEl.offsetWidth  : 760;
    var heroH  = heroEl ? heroEl.offsetHeight : 160;
    var SC = 2;
    var cvs = document.createElement('canvas');
    cvs.width  = heroW * SC;
    cvs.height = heroH * SC;
    var ctx = cvs.getContext('2d');

    // fundo
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    if (bgImg) {
      var iw = bgImg.naturalWidth, ih = bgImg.naturalHeight;
      var sc = Math.max(cvs.width / iw, cvs.height / ih);
      ctx.drawImage(bgImg, (cvs.width - iw*sc)/2, (cvs.height - ih*sc)/2, iw*sc, ih*sc);
    }
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    // logo
    var logoEl = document.querySelector('.orc-hero-logo');
    if (logoEl && logoEl.complete && logoEl.naturalWidth) {
      var lh = 44 * SC, lw = lh * (logoEl.naturalWidth / logoEl.naturalHeight);
      ctx.drawImage(logoEl, 20*SC, 18*SC, lw, lh);
    }
    // CNPJ
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = (8*SC) + 'px system-ui,sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('CNPJ: 34.935.151/0001-53', 20*SC, (heroH - 26)*SC);
    // data
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.font = (9*SC) + 'px system-ui,sans-serif';
    ctx.fillText(dataStr, 20*SC, (heroH - 15)*SC);

    // links direita (whatsapp, instagram, endereço)
    var links = heroEl ? heroEl.querySelectorAll('.orc-hero-link') : [];
    var rx = (heroW - 20) * SC;
    ctx.font = (10.5*SC) + 'px system-ui,sans-serif';
    ctx.textAlign = 'right';

    function desenharLink(i, cb) {
      if (i >= links.length) { cb(); return; }
      var linkEl = links[i];
      var svgEl  = linkEl.querySelector('svg');
      var texto  = linkEl.textContent.trim();
      var yPos   = 26*SC + i * 19*SC;
      ctx.fillStyle = 'rgba(255,255,255,0.88)';
      ctx.fillText(texto, rx, yPos);
      var tw = ctx.measureText(texto).width;
      if (!svgEl) { desenharLink(i+1, cb); return; }
      try {
        var sz = 13*SC;
        var clone = svgEl.cloneNode(true);
        clone.setAttribute('xmlns','http://www.w3.org/2000/svg');
        if (!clone.getAttribute('width'))  clone.setAttribute('width','24');
        if (!clone.getAttribute('height')) clone.setAttribute('height','24');
        var url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], {type:'image/svg+xml'}));
        var ico = new Image();
        ico.onload = function() {
          ctx.drawImage(ico, rx - tw - 7*SC - sz, yPos - sz*0.8, sz, sz);
          URL.revokeObjectURL(url);
          desenharLink(i+1, cb);
        };
        ico.onerror = function() { URL.revokeObjectURL(url); desenharLink(i+1, cb); };
        ico.src = url;
      } catch(e) { desenharLink(i+1, cb); }
    }

    desenharLink(0, function() {
      construirPDF(cvs.toDataURL('image/jpeg', 0.92), cvs.width, cvs.height, sigImg);
    });
  }

  function construirPDF(bannerData, bannerW, bannerH, sigImg) {
    var doc = new JsPDF({ unit:'mm', format:'a4', orientation:'portrait' });
    var PW = 210, PH = 297, M = 14, CW = PW - M*2;

    // helper: adiciona banner no topo de cada página
    function addBanner(y) {
      var bH = bannerW > 0 ? (CW * bannerH / bannerW) : 38;
      if (bannerData) doc.addImage(bannerData, 'JPEG', M, y, CW, bH, undefined, 'FAST');
      else { doc.setFillColor(26,26,26); doc.rect(M, y, CW, bH, 'F'); }
      return y + bH + 4;
    }

    // helper: bloco cliente
    function addCliente(y) {
      doc.setFontSize(8.5); doc.setTextColor(40,40,40);
      var lh = 5.5;
      doc.setFont(undefined,'bold'); doc.text('CLIENTE', M, y);
      doc.setFont(undefined,'normal'); doc.text(dados.nome, M + 20, y);
      doc.setFont(undefined,'bold'); doc.text('CPF/CNPJ:', PW - M - 60, y);
      doc.setFont(undefined,'normal'); doc.text(dados.cpf, PW - M - 35, y);
      y += lh;
      doc.setFont(undefined,'bold'); doc.text('FONE', M, y);
      doc.setFont(undefined,'normal'); doc.text(dados.telefone, M + 20, y);
      y += lh;
      doc.setFont(undefined,'bold'); doc.text('END', M, y);
      doc.setFont(undefined,'normal');
      var endLines = doc.splitTextToSize(dados.endereco, CW - 25);
      doc.text(endLines, M + 20, y);
      doc.setFont(undefined,'bold'); doc.text('DATA', PW - M - 30, y);
      doc.setFont(undefined,'normal'); doc.text(dataStr, PW - M - 15, y);
      y += lh * endLines.length + 3;
      // linha separadora
      doc.setDrawColor(220,220,220); doc.setLineWidth(0.3);
      doc.line(M, y, PW - M, y);
      return y + 4;
    }

    // helper: barra do contrato
    function addBarraContrato(y) {
      doc.setFillColor(30, 58, 100);
      doc.rect(M, y, CW, 9, 'F');
      doc.setFontSize(10); doc.setTextColor(255,255,255);
      doc.setFont(undefined,'bold');
      doc.text('CONTRATO', PW/2 - 12, y + 6.5);
      doc.text(String(dados.numeroContrato), PW/2 + 14, y + 6.5);
      doc.setFont(undefined,'normal'); doc.setTextColor(40,40,40);
      return y + 13;
    }

    // helper: assinaturas
    function addAssinaturas(y, doc) {
      var colL = M + 10, colR = PW/2 + 10;
      var lW = 65;
      // linhas
      doc.setDrawColor(60,60,60); doc.setLineWidth(0.4);
      doc.line(colL, y, colL + lW, y);
      doc.line(colR, y, colR + lW, y);
      // assinatura henrique (imagem)
      if (sigImg && sigImg.naturalWidth) {
        var sH = 14, sW = sH * (sigImg.naturalWidth / sigImg.naturalHeight);
        try { doc.addImage(sigImg, 'JPEG', colR + (lW - sW)/2, y - sH - 2, sW, sH); }
        catch(e){}
      }
      y += 4;
      doc.setFontSize(8); doc.setTextColor(30,30,30);
      // cliente
      doc.setFont(undefined,'bold'); doc.text(dados.nome, colL, y); doc.setFont(undefined,'normal');
      doc.text('CPF/CNPJ: ' + dados.cpf, colL, y + 4.5);
      doc.setTextColor(100,100,100); doc.text('Cliente', colL, y + 9); doc.setTextColor(30,30,30);
      // vendedor
      doc.setFont(undefined,'bold'); doc.text('Henrique Santos', colR, y); doc.setFont(undefined,'normal');
      doc.text('CPF 067.389.469-02', colR, y + 4.5);
      doc.setTextColor(100,100,100); doc.text('Vendedor', colR, y + 9); doc.setTextColor(30,30,30);
      return y + 16;
    }

    // helper: rodapé
    function addRodape(y) {
      doc.setFontSize(8); doc.setTextColor(50,127,164);
      doc.textWithLink('www.decorcom.com.br', PW/2, y, { url:'https://www.decorcom.com.br', align:'center' });
      return y + 5;
    }

    /* ═══ PÁGINA 1 ═══ */
    var y = 8;
    y = addBanner(y);
    y = addCliente(y);
    y = addBarraContrato(y);

    // ── Tabela de itens ──────────────────────────────
    var cols = { qnt: M, prod: M+18, uni: PW-M-32, tot: PW-M };
    // header tabela
    doc.setFillColor(240,240,238);
    doc.rect(M, y, CW, 7, 'F');
    doc.setFontSize(8); doc.setFont(undefined,'bold'); doc.setTextColor(80,80,80);
    doc.text('QNT',    cols.qnt+2, y+5);
    doc.text('Produto', cols.prod, y+5);
    doc.text('Vlr Uni.', cols.uni, y+5, {align:'right'});
    doc.text('Total',    cols.tot, y+5, {align:'right'});
    y += 8;
    doc.setFont(undefined,'normal'); doc.setTextColor(40,40,40);

    function addItemTabela(qnt, desc, vlrUni, total) {
      doc.setFontSize(8);
      doc.text(String(qnt), cols.qnt+2, y);
      var descLines = doc.splitTextToSize(desc, cols.uni - cols.prod - 4);
      doc.text(descLines, cols.prod, y);
      doc.text(fmt(vlrUni), cols.uni, y, {align:'right'});
      doc.text(fmt(total),  cols.tot, y, {align:'right'});
      doc.setDrawColor(230,228,224); doc.setLineWidth(0.2);
      doc.line(M, y+1.5, PW-M, y+1.5);
      y += Math.max(descLines.length * 5, 6);
    }

    var qtd = orcDados.qtdBarras;
    var metros = orcDados.metrosComprar;
    addItemTabela(fmtN(metros)+'m', orcProduto.nome + ' ' + orcProduto.detalhe, orcDados.precoPorMetro, orcDados.valorProdutos);
    if (comInstalacao) {
      var instMin = (metros * orcDados.precoInst) < MIN_MAO_DE_OBRA;
      addItemTabela(fmtN(metros)+'m', 'Mão de Obra' + (instMin?' (taxa mínima)':'') + ' R$'+fmtN(orcDados.precoInst)+'/m', orcDados.precoInst, orcDados.valorInst);
    }
    if (orcDados.qtdAndaresSalvo > 0) {
      addItemTabela(orcDados.qtdAndaresSalvo+'x', 'Mão de obra escada R$520,00', 520, orcDados.valorEscada);
    }
    if (remocaoAtivo && orcDados.valorRem > 0) {
      addItemTabela(fmtN(metros)+'m', orcDados.descRem + ' R$'+fmtN(valorRemocao)+'/m', valorRemocao, orcDados.valorRem);
    }
    if (silBrancoAtivo && orcDados.qtdSilBranco > 0) {
      addItemTabela(orcDados.qtdSilBranco+'x', 'Silicone Selante Branco Acabamento R$19,99', 19.99, orcDados.valSilBranco);
    }
    if (silPu40Ativo && orcDados.qtdSilPu40 > 0) {
      addItemTabela(orcDados.qtdSilPu40+'x', 'Silicone PU40 Fixação R$21,99', 21.99, orcDados.valSilPu40);
    }
    addItemTabela('1', 'Entrega', orcDados.entrega, orcDados.entrega);

    // TOTAL
    y += 2;
    doc.setDrawColor(180,220,195); doc.setLineWidth(0.6);
    doc.line(M, y, PW-M, y); y += 5;
    doc.setFontSize(10); doc.setFont(undefined,'bold');
    doc.setTextColor(49,101,78);
    doc.text('TOTAL', cols.uni - 5, y, {align:'right'});
    doc.text(fmt(orcDados.subtotal), cols.tot, y, {align:'right'});
    doc.setFont(undefined,'normal'); doc.setTextColor(40,40,40);
    y += 7;

    // ── Pagamento parcelado ──────────────────────────
    doc.setFillColor(245,245,243);
    doc.rect(M, y, CW, 7, 'F');
    doc.setFontSize(8); doc.setFont(undefined,'bold');
    doc.text('PAGAMENTO PARCELADO:', M+3, y+5);
    doc.setFont(undefined,'normal');
    doc.text(fmt(orcDados.subtotal * 1.11), M+52, y+5);
    doc.text('1 a 10x no crédito Visa/Master', M+76, y+5);
    y += 10;

    // ── Pagamento PIX ────────────────────────────────
    doc.setFillColor(49,101,78);
    doc.rect(M, y, CW, 6, 'F');
    doc.setFontSize(8.5); doc.setFont(undefined,'bold'); doc.setTextColor(255,255,255);
    doc.text('PAGAMENTO PIX', PW/2, y+4.5, {align:'center'});
    y += 7;
    doc.setFillColor(235,248,240); doc.rect(M, y, CW, 14, 'F');
    doc.setFontSize(7.5); doc.setFont(undefined,'normal'); doc.setTextColor(30,30,30);
    doc.text('Decorcom Comercio de Moveis Planejados  |  NOSSO ÚNICO PIX É O CNPJ: 34.935.151/0001-53', PW/2, y+5, {align:'center'});
    doc.text('Banco Santander  Ag:1273  CC:13.003.034-7', PW/2, y+9, {align:'center'});
    doc.setFontSize(10); doc.setFont(undefined,'bold'); doc.setTextColor(49,101,78);
    doc.text(fmt(orcDados.subtotal), PW/2, y+14, {align:'center'});
    doc.setFont(undefined,'normal'); doc.setTextColor(40,40,40);
    y += 18;

    // ── Datas entrega / instalação ───────────────────
    doc.setFontSize(9); doc.setFont(undefined,'bold');
    doc.text('ENTREGA:', M, y);
    doc.setFont(undefined,'normal'); doc.setFontSize(8);
    var entregaLines = doc.splitTextToSize(dados.dataEntregaTexto, (comInstalacao ? CW/2 - 5 : CW - 22));
    doc.text(entregaLines, M + 22, y);
    if (dados.dataInstTexto) {
      doc.setFontSize(9); doc.setFont(undefined,'bold');
      doc.text('INSTALAÇÃO:', PW/2 + 2, y);
      doc.setFont(undefined,'normal'); doc.setFontSize(8);
      var instLine = dados.dataInstTexto + (dados.dataInstFimTexto ? ' a ' + dados.dataInstFimTexto : '');
      doc.text(instLine, PW/2 + 30, y);
    }
    y += Math.max(entregaLines.length * 5, 7);

    if (comInstalacao) {
      doc.setFontSize(7); doc.setTextColor(120,120,120);
      var obsText = '*O tempo de instalação varia conforme a acessibilidade, configuração da planta do imóvel, condição de habitação, necessidade de remoção ou correção de alguma imperfeição do imóvel.';
      var obsLines = doc.splitTextToSize(obsText, CW);
      doc.text(obsLines, M, y); doc.setTextColor(40,40,40);
      y += obsLines.length * 3.8 + 3;
    }

    y += 6;
    y = addAssinaturas(y, doc);
    y += 3;
    addRodape(y);

    /* ═══ PÁGINA 2 — CLÁUSULAS ═══ */
    doc.addPage();
    y = 8;
    y = addBanner(y);
    y = addCliente(y);
    y = addBarraContrato(y);

    // título
    doc.setFontSize(9); doc.setFont(undefined,'bold'); doc.setTextColor(30,30,30);
    doc.text('•IMPORTANTE•', PW/2, y, {align:'center'});
    y += 6;

    var clausulas = [
      'Não realocamos objetos, deixe tudo o mais livre possível, recolha mobilias, eletros, loucas, etc. Não é nossa responsabilidade.',
      'Não nos responsabilizamos caso terceiros danifiquem qualquer produto adquirido, durante ou após instalação.',
      'A fórmula de quebra de instalação é aproximada, e muda de acordo com a arquitetura e forma de instalação. Material extra é cobrado a parte. A quantia de compra é uma sugestão.',
      'Manta não corrigem contrapiso, em caso de desnivelamento, deve ser providenciado correção, ou aceitar o resultado final.',
      'Não nos responsabilizamos por canos, dutos, tubulações, fiações etc danificados durante instalação sem devida orientação de planta arquitetônica correta.',
      'Custos por reparos em caso de umidade não evidente, são de responsabilidade do cliente, tanto isolamento da umidade, quanto conserto e substituição do produto danificado.',
      'Não executamos instalação em ambientes com poeira ou detritos de reforma. Ambiente nessas condições comprometem o acabamento. Será feito reagendamento com valor de R$250,00. Conforme disponibilidade na lista de obras Decorcom.',
      'Não fazemos instalação com prestadores simultâneos, e não é nossa responsabilidade caso terceiro danifique o produto.',
      'O cliente pode mudar data de instalação 24 horas antes, sem custo, fora deste prazo é cobrado R$250,00 para retorno da equipe.',
      'Cortes de porta são imprevisíveis em todos os casos, identificada a necessidade durante instalação, será cobrado R$45,00 uni. Adaptações necessárias por marcenaria, cerâmicas, granitos, etc, serão cobradas a parte conforme sua complexidade.',
      'O Cliente esta ciente que troca de datas de entrega e instalação são feitas conforme lista de agendamento, correndo o risco de não ter disponibilidade de alguma data de seu desejo.',
      'Nenhuma fábrica presta garantia do piso, ou instalação caso instalado sem acessório de transição. Insistindo sem perfil, todo reparo ou assistência terá custo conforme sua situação iniciando em R$350,00.',
      'Os valores do contrato se referem a aquisição ou instalação dos produtos listados. Sua residência ou comercio pode exigir acabamentos adverso a medição para conclusão de instalação, produto extra será cobrado a parte.',
      'O cliente deve prestar acesso facilitado a garagens, elevadores, etc na entrega. Em caso de escadas, ou acesso complexo, deve informar e conferir se o valor de entrega tem alteração.',
      'Recolhemos e descartamos os entulhos da instalação, ou remoções de piso anterior, apenas se listado na Pag. 01.',
      'O cliente deve permitir vistoria após instalação, de segunda a sexta, nos horários entre 8:30 e 17:30.',
      'Filmamos e fotografamos todos os trabalhos para garantir que não haja reclamações posteriores de riscos ou danificações.',
      'O cliente esta ciente que nenhum rodapé em mdf revestido com poliestireno resiste a água, ou umidade. Contato continuo com umidade, ou água, deforma o material, e gera mofo. Isso anula sua garantia.'
    ];

    doc.setFont(undefined,'normal'); doc.setFontSize(7.5); doc.setTextColor(35,35,35);
    clausulas.forEach(function(c) {
      var lines = doc.splitTextToSize('● ' + c, CW);
      if (y + lines.length * 4.2 > PH - 60) y = PH - 60; // proteção de overflow
      doc.text(lines, M, y);
      y += lines.length * 4.2 + 1.5;
    });

    y += 8;
    y = addAssinaturas(y, doc);
    y += 3;
    addRodape(y);

    doc.save(nomeArq);
    if (onDone) onDone();
  }
}

// Botão de navegação do calendário
document.addEventListener('DOMContentLoaded', function() {
  var style = document.createElement('style');
  style.textContent = '.cal-nav-btn{background:#f0f0ee;border:none;border-radius:6px;width:28px;height:28px;font-size:16px;cursor:pointer;color:#31654e;font-weight:700;line-height:1;display:flex;align-items:center;justify-content:center;} .cal-nav-btn:hover{background:#d4ece0;}';
  document.head.appendChild(style);
});

document.getElementById('orcOverlay').addEventListener('click', function(e) {
  if (e.target === this) fecharOrcamento();
});
