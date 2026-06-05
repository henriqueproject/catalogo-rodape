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

// Preço instalação por altura
/* ─────────────────────────────────────
   TABELA DE PREÇOS
───────────────────────────────────── */
var precoInstalacao = {
  '3': 11.99, '5': 11.99, '7': 11.99, '10': 11.99, '12': 11.99,
  '15': 17.99, '20': 21.99, 'sobrepor': 16.99
};

function getAlturaPrecoInst(detalhe) {
  var m = detalhe.match(/^(\d+)cm/i);
  if (m) { return precoInstalacao[m[1]] || 11.99; }
  if (/sobrepor/i.test(detalhe)) { return precoInstalacao['sobrepor']; }
  return 11.99;
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

function recalcularMapa() {
  var d = orcDados;
  var valSilBranco = silBrancoAtivo ? d.valSilBranco : 0;
  var valSilPu40   = silPu40Ativo   ? d.valSilPu40   : 0;
  var subtotal = d.valorProdutos + d.valorInst + d.valorRem + valSilBranco + valSilPu40 + d.valorEscada + d.entrega;
  var parcela5x  = (subtotal * 1.11) / 5;
  var parcela10x = (subtotal * 1.11) / 10;
  orcDados.subtotal   = subtotal;
  orcDados.parcela5x  = parcela5x;
  orcDados.parcela10x = parcela10x;

  // Re-renderiza linhas de silicone
  var linhas = document.getElementById('orcMapa');
  if (!linhas) return;

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

// Versão com data-sil attribute para poder localizar e substituir no DOM
function renderLinhaSiliconeTagged(tipo, qtd, val) {
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
  silBrancoAtivo = true;
  silPu40Ativo = true;
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
  document.getElementById('orcHeaderTitle').textContent = 'Solicitar Orcamento';
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

  var qtdSilBranco = Math.ceil(metrosComprar / 20);
  var qtdSilPu40 = Math.ceil(metrosComprar / 15);
  var valSilBranco = qtdSilBranco * 19.99;
  var valSilPu40 = qtdSilPu40 * 21.99;

  var precoInst = getAlturaPrecoInst(orcProduto.detalhe);
  var valorInst = comInstalacao ? metrosComprar * precoInst : 0;

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
    linhas += '<div class="orc-mapa-linha"><span class="desc">' + fmtN(metrosComprar) + 'm Mão de Obra R$' + fmtN(precoInst) + '/m</span><span class="val">' + fmt(valorInst) + '</span></div>';
  }
  if (valorRemocao > 0) {
    linhas += '<div class="orc-mapa-linha"><span class="desc">' + fmtN(metrosComprar) + 'm ' + descRem + ' R$' + fmtN(valorRemocao) + '/m</span><span class="val">' + fmt(valorRem) + '</span></div>';
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

  // URGENTE só aparece para "Só o produto" (sem instalação)
  var urgenteRow = document.getElementById('orcUrgenteRow');
  if (urgenteRow) urgenteRow.style.display = comInstalacao ? 'none' : 'flex';

  document.getElementById('orcStep1').style.display = 'none';
  document.getElementById('orcStep2').style.display = 'flex';
  document.getElementById('orcHeaderTitle').textContent = 'Revisao do Orcamento';
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
  document.getElementById('orcHeaderTitle').textContent = 'Solicitar Orcamento';
  document.getElementById('orcHeaderSub').textContent = 'Calcule sua necessidade';
}

/* ─────────────────────────────────────
   GERAR CONTRATO / WHATSAPP
───────────────────────────────────── */
function gerarContrato() {
  var nome = document.getElementById('confNome').value.trim();
  var cpf = document.getElementById('confCpf').value.trim();
  var endereco = document.getElementById('confEndereco').value.trim();
  var telefone = document.getElementById('confTelefone').value.trim();
  if (!nome || !cpf || !endereco || !telefone) { alert('Por favor, preencha todos os campos!'); return; }

  var btn = document.getElementById('orcBtnComprar');
  btn.disabled = true;
  btn.textContent = 'Gerando...';

  fetch(SUPABASE_URL + '/rest/v1/orcamentos', {
    method: 'POST',
    headers: {'Content-Type':'application/json','apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY},
    body: JSON.stringify({
      produto_alt: orcProduto.alt,
      produto_nome: orcProduto.nome + ' - ' + orcProduto.detalhe,
      produto_preco: orcDados.precoPorMetro,
      metragem: orcDados.metragem,
      metragem_com_sobra: orcDados.total,
      quantidade_barras: orcDados.qtdBarras,
      cliente_nome: nome,
      cliente_bairro: endereco,
      cliente_telefone: telefone,
      com_instalacao: comInstalacao,
      valor_total: orcDados.subtotal
    })
  }).catch(function(e){ console.log('erro:', e); });

  var inst = comInstalacao ? 'COM instalacao' : 'SEM instalacao';
  var urgMsg = isUrgente ? '\n🚨 ENTREGA URGENTE — Prioridade no mesmo dia' : '';
  var linhasMsg = [
    'CONTRATO DECORCOM' + urgMsg,
    '',
    'PRODUTO: ' + orcProduto.nome + ' - ' + orcProduto.detalhe,
    fmtN(orcDados.metrosComprar) + 'm = ' + orcDados.qtdBarras + ' barras',
    'Valor produto: ' + fmt(orcDados.valorProdutos)
  ];
  if (comInstalacao) linhasMsg.push('Mao de obra: ' + fmt(orcDados.valorInst));
  if (orcDados.qtdAndaresSalvo > 0) linhasMsg.push('Mao de obra escada (' + orcDados.qtdAndaresSalvo + ' andares): ' + fmt(orcDados.valorEscada));
  if (valorRemocao > 0) linhasMsg.push(orcDados.descRem + ': ' + fmt(orcDados.valorRem));
  linhasMsg.push(orcDados.qtdSilBranco + 'x Silicone Branco: ' + fmt(orcDados.valSilBranco));
  linhasMsg.push(orcDados.qtdSilPu40 + 'x Silicone PU40: ' + fmt(orcDados.valSilPu40));
  linhasMsg.push('Entrega: ' + fmt(orcDados.entrega));
  linhasMsg.push('TOTAL PIX: ' + fmt(orcDados.subtotal));
  linhasMsg.push('Credito 5x: ' + fmt(orcDados.parcela5x) + '/mes (via link)');
  linhasMsg.push('Credito 10x: ' + fmt(orcDados.parcela10x) + '/mes (presencial)');
  linhasMsg.push('');
  linhasMsg.push('DADOS DO CLIENTE');
  linhasMsg.push('Nome: ' + nome);
  linhasMsg.push('CPF: ' + cpf);
  linhasMsg.push('Endereco: ' + endereco);
  linhasMsg.push('Telefone: ' + telefone);

  var msg = encodeURIComponent(linhasMsg.join('\n'));

  document.getElementById('orcStep2').style.display = 'none';
  document.getElementById('orcSuccess').style.display = 'block';

  setTimeout(function() {
    fecharOrcamento();
    window.open('https://wa.me/554133198635?text=' + msg, '_blank');
    btn.disabled = false;
    btn.textContent = 'Comprar e Gerar Contrato';
  }, 1500);
}

document.getElementById('orcOverlay').addEventListener('click', function(e) {
  if (e.target === this) fecharOrcamento();
});
