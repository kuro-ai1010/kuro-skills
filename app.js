
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function replay(el){ el.classList.remove('go'); void el.offsetWidth; el.classList.add('go'); }
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting && !e.target.classList.contains('go')){ e.target.classList.add('go'); } });
  },{threshold:.2});
  document.querySelectorAll('[data-anim]').forEach(function(el){ io.observe(el); });

  var hero = document.getElementById('heroStage');
  if(hero && !reduce){ setInterval(function(){ replay(hero); }, 11000); }

  document.querySelectorAll('[data-replay]').forEach(function(b){
    b.addEventListener('click', function(){
      var t = b.getAttribute('data-replay');
      var el = t === 'parent' ? b.closest('[data-anim]') : document.querySelector(t);
      if(el) replay(el);
    });
  });

  var root = document.documentElement;
  try{ var saved = localStorage.getItem('skills-theme'); if(saved){ root.setAttribute('data-theme', saved); } }catch(e){}
  var tg = document.getElementById('theme');
  if(tg){ tg.addEventListener('click', function(){
    var cur = root.getAttribute('data-theme');
    if(!cur){ cur = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'; }
    var next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try{ localStorage.setItem('skills-theme', next); }catch(e){}
  }); }

  var P = {
    proj:{root:'&lt;プロジェクト&gt;/.claude/skills/', ttl:'プロジェクト用', txt:'特定の仕事だけで使う置き場所。試しやすく、片付けも簡単です。', full:'&lt;対象プロジェクト&gt;/.claude/skills/'},
    mac:{root:'~/.claude/skills/', ttl:'個人用 Mac・Linux・WSL', txt:'どのプロジェクトでも使える置き場所。WSLの「~」は通常 /home/ユーザー名 で、Windows側のC:\\Usersとは別のホームです。', full:'~/.claude/skills/'},
    win:{root:'C:\\Users\\ユーザー名\\.claude\\skills\\', ttl:'個人用 Windows', txt:'Windowsネイティブで、どのプロジェクトでも使う置き場所。CLAUDE_CONFIG_DIRなどで設定場所を変えている場合は、既存の設定を先に確認しましょう。', full:'%USERPROFILE%\\.claude\\skills\\'}
  };
  var pt = document.getElementById('ptree');
  function drawPath(k){
    var d = P[k];
    pt.innerHTML = '<span class="h">' + d.root + '</span>\n' +
      ' ├─ product-marketing/\n │   └─ SKILL.md\n' +
      ' ├─ copywriting/\n │   └─ SKILL.md\n' +
      ' ├─ frontend-design/   <span class="h">← ここに置く</span>\n │   ├─ SKILL.md\n │   └─ LICENSE.txt\n' +
      ' └─ …ほかのSkillも同じ形で';
    document.getElementById('pttl').textContent = d.ttl;
    document.getElementById('ptxt').textContent = d.txt;
    document.getElementById('pfull').innerHTML = d.full;
  }
  if(pt){
    drawPath('proj');
    document.querySelectorAll('.tab').forEach(function(t){
      t.addEventListener('click', function(){
        document.querySelectorAll('.tab').forEach(function(x){ x.setAttribute('aria-selected','false'); });
        t.setAttribute('aria-selected','true'); drawPath(t.getAttribute('data-p'));
      });
    });
  }

  document.querySelectorAll('.cp').forEach(function(b){
    b.addEventListener('click', function(){
      var txt = b.parentNode.querySelector('p').textContent;
      function done(){ var o = b.textContent; b.textContent = 'コピーしました'; setTimeout(function(){ b.textContent = o; }, 1600); }
      function fallback(){
        var ta = document.createElement('textarea'); ta.value = txt; ta.style.position='fixed'; ta.style.opacity='0';
        document.body.appendChild(ta); ta.select();
        try{ document.execCommand('copy'); done(); }catch(e){ b.textContent = '長押しで選択してコピー'; }
        document.body.removeChild(ta);
      }
      try{
        if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(done, fallback); }
        else { fallback(); }
      }catch(e){ fallback(); }
    });
  });
})();
