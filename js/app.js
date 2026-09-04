
/* Point de collecte des formulaires (Apps Script). Tant qu'il est vide, les
   formulaires retombent sur un e-mail : rien ne casse, rien ne se perd. */
var YL_COLLECTE="";
function ylEnvoyer(charge){
  if(!YL_COLLECTE) return false;
  charge.Page=location.pathname.split('/').pop()||'index.html';
  try{
    fetch(YL_COLLECTE,{method:'POST',mode:'no-cors',
      headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify(charge)});
    return true;
  }catch(e){ return false; }
}

const menu=document.getElementById('menu'),burger=document.getElementById('burger');
burger.addEventListener('click',()=>{menu.classList.toggle('open');burger.classList.toggle('open');burger.setAttribute('aria-expanded',menu.classList.contains('open'));});
function topRoute(id){return id.startsWith('expert-')?'experts':id;}
function route(){
 let id=(location.hash.replace('#','')||'accueil');
 /* #demo ouvre le formulaire par-dessus la page contact, depuis n'importe quelle page. */
 if(id==='demo') id='contact';
 if(!document.getElementById('view-'+id)) id='accueil';
 document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
 document.getElementById('view-'+id).classList.add('active');
 let t=topRoute(id);
 document.querySelectorAll('.menu a').forEach(a=>a.classList.toggle('on',a.dataset.route===t));
 menu.classList.remove('open');
 burger.classList.remove('open');
 burger.setAttribute('aria-expanded','false');
 window.scrollTo({top:0,behavior:'auto'});
}
document.addEventListener('click',function(e){
 const a=e.target.closest('a[href^="#"]');
 if(!a) return;
 const target=a.getAttribute('href').slice(1);
 if(!target) return;
 e.preventDefault();
 e.stopPropagation();
 if(location.hash==='#'+target){route();}else{location.hash=target;}
});
window.addEventListener('hashchange',route);route();


(function(){
 var m=document.getElementById('ylmodal');
 if(!m) return;
 var dernier=null;
 function ouvrir(e){ if(e) e.preventDefault(); dernier=document.activeElement;
   m.hidden=false; document.body.style.overflow='hidden';
   var p=m.querySelector('input'); if(p) p.focus(); }
 function fermer(){ m.hidden=true; document.body.style.overflow='';
   if(dernier&&dernier.focus) dernier.focus(); }
 document.querySelectorAll('a[href="#demo"],[data-demo]').forEach(function(a){
   a.addEventListener('click',ouvrir);
 });
 /* Arrivee directe sur #demo (lien depuis une page autonome ou lien partage). */
 function surHash(){ if(location.hash==='#demo'&&m.hidden) ouvrir(); }
 window.addEventListener('hashchange',surHash); surHash();
 m.querySelectorAll('[data-close]').forEach(function(b){b.addEventListener('click',fermer);});
 document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&!m.hidden) fermer(); });
 document.getElementById('ylmform').addEventListener('submit',function(e){
   e.preventDefault();
   var d=new FormData(this), l=[], f=this;
   d.forEach(function(v,k){ if(String(v).trim()) l.push(k+' : '+v); });
   if(ylEnvoyer({_form:'demo',
       'Société':d.get('societe')||'', 'Nom':d.get('nom')||'',
       'Email':d.get('email')||'', 'Téléphone':d.get('tel')||'',
       'Métier':d.get('metier')||'', 'Métier (autre)':d.get('metier_autre')||'',
       'Effectif':d.get('effectif')||'', 'Message':d.get('message')||''})){
     var z=document.getElementById('ylm-ok');
     if(z){ z.hidden=false; }
     f.reset(); return;
   }
   var corps=encodeURIComponent("Demande de démonstration\n\n"+l.join("\n"));
   window.location.href='mailto:contact@yelema.ai?subject='
     +encodeURIComponent('Demande de démonstration, '+(d.get('societe')||''))
     +'&body='+corps;
 });
})();

/* Le metier « Autre » ouvre un champ libre, et sa reponse part avec le reste :
   sans lui, le formulaire perdait le seul metier qu'on ne propose pas encore. */
(function(){
 var s=document.querySelector('#ylmform select[name=metier]'),
     b=document.getElementById('yl-mautre');
 if(!s||!b) return;
 var i=b.querySelector('input');
 s.addEventListener('change',function(){
   var ouvert=(s.value==='Autre');
   b.hidden=!ouvert; i.required=ouvert;
   if(ouvert){i.focus();}else{i.value='';}
 });
})();

/* La lettre d'information n'etait branchee sur rien : le formulaire rechargeait
   la page et l'adresse etait perdue. Elle part maintenant par courriel. */
(function(){
 var f=document.getElementById('yl-news'); if(!f) return;
 var msg=document.getElementById('yl-news-msg');
 f.addEventListener('submit',function(e){
   e.preventDefault();
   var c=f.querySelector('input[name=email]'), v=(c.value||'').trim();
   if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)){
     if(msg) msg.textContent='Il manque une adresse valide.'; c.focus(); return; }
   if(ylEnvoyer({_form:'nouveautes',Email:v,Source:'pied de page'})){
     if(msg) msg.textContent='Merci, vous êtes inscrit aux nouveautés.';
     f.reset(); return;
   }
   if(msg) msg.textContent='Merci, votre inscription part par e-mail.';
   window.location.href='mailto:contact@yelema.ai?subject='
     +encodeURIComponent('Inscription aux nouveautés Yelema')
     +'&body='+encodeURIComponent('Merci de m\'inscrire aux nouveautés Yelema.\n\nAdresse : '+v);
   f.reset();
 });
})();
