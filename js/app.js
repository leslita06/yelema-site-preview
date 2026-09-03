
const menu=document.getElementById('menu'),burger=document.getElementById('burger');
burger.addEventListener('click',()=>{menu.classList.toggle('open');burger.classList.toggle('open');burger.setAttribute('aria-expanded',menu.classList.contains('open'));});
function topRoute(id){return id.startsWith('expert-')?'experts':id;}
function route(){
 let id=(location.hash.replace('#','')||'accueil');
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
 document.querySelectorAll('a[href="#contact"],[data-demo]').forEach(function(a){
   var t=(a.textContent||'').toLowerCase();
   if(t.indexOf('démo')>=0||t.indexOf('demo')>=0||a.hasAttribute('data-demo'))
     a.addEventListener('click',ouvrir);
 });
 m.querySelectorAll('[data-close]').forEach(function(b){b.addEventListener('click',fermer);});
 document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&!m.hidden) fermer(); });
 document.getElementById('ylmform').addEventListener('submit',function(e){
   e.preventDefault();
   var d=new FormData(this), l=[];
   d.forEach(function(v,k){ l.push(k+' : '+v); });
   var corps=encodeURIComponent("Demande de démonstration\n\n"+l.join("\n"));
   window.location.href='mailto:contact@yelema.ai?subject='
     +encodeURIComponent('Demande de démonstration, '+(d.get('societe')||''))
     +'&body='+corps;
 });
})();
