/* ===================== FORJA · motor completo ===================== */
const KEY='forja_v8';
function today(){return new Date().toISOString().slice(0,10);}
const DAYS=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const MOT=["Hoy no se negocia. Se entrena.","Más denso que la última vez.","Disciplina cuando la motivación duerme.","Cada bloque cuenta. Cada minuto pesa.","No tienes que estar de humor. Solo aparecer.","La grasa odia la constancia.","Suda hoy, brilla mañana.","No rompas la cadena.","Fuerte de mente, fuerte de cuerpo."];

/* ----- Modelo de ejercicios con variantes (biblioteca de sustituciones) ----- */
const SUBS={
  'Press banca':['Press inclinado','Press banca mancuernas','Floor press KB','Flexiones lastradas','Press en máquina'],
  'Press inclinado':['Press banca','Press inclinado mancuernas','Push press KB','Flexiones declinadas','Press inclinado máquina'],
  'Press militar':['Press banca','Push press KB','Press militar mancuernas','Pike push-up','Press hombro máquina'],
  'Dominadas lastradas':['Remo barra','Jalón al pecho','Dominadas asistidas','Gorilla row KB','Remo invertido'],
  'Remo barra':['Pendlay row','Remo mancuerna','Gorilla row KB','Jalón al pecho','Remo en máquina'],
  'Pendlay row':['Remo barra','Remo mancuerna','Gorilla row KB','Dominadas','Remo en máquina'],
  'Sentadilla':['Sentadilla frontal','Trap bar deadlift','Goblet squat KB','Prensa','Búlgara mancuernas'],
  'Sentadilla frontal':['Sentadilla','Goblet squat KB','Prensa','Zancada','Hack squat'],
  'Trap bar deadlift':['Sentadilla','Peso muerto','KB swing pesado','Prensa','Hip thrust'],
  'Press inclinado mancuernas':['Press inclinado','Aperturas inclinadas','Press banca mancuernas','Flexiones declinadas'],
  'Aperturas / cruce poleas':['Aperturas mancuerna','Press inclinado mancuernas','Pec deck','Flexiones'],
  'Elevaciones laterales':['Elevaciones con banda','Elevación lateral en polea','Press Arnold','Face pull'],
  'Tríceps cuerda':['Fondos en banco','Press francés','Extensión tríceps mancuerna','Patada tríceps'],
  'Remo gorila KB':['Remo mancuerna','Remo barra','Remo en máquina','Remo con banda'],
  'Curl bíceps barra':['Curl mancuerna','Curl martillo','Curl banda','Curl predicador'],
  'Face pull':['Face pull banda','Pájaros','Remo al cuello','Band pull-apart'],
  'Peso muerto rumano':['PM rumano mancuernas','Buenos días','Hip thrust','Curl femoral'],
  'Zancada KB':['Zancada mancuernas','Búlgara','Prensa','Sentadilla goblet'],
  'Curl femoral':['Curl femoral sentado','Peso muerto rumano','Puente glúteo','Nórdico'],
  'Gemelo de pie':['Gemelo sentado','Gemelo en prensa','Saltos a la comba','Gemelo a una pierna']
};
/* ----- Rotación del ejercicio principal por día (cada ciclo cambia) ----- */
const MAIN_ROT={Lunes:['Press banca','Press inclinado','Press militar'],Miércoles:['Dominadas lastradas','Remo barra','Pendlay row'],Sábado:['Sentadilla','Sentadilla frontal','Trap bar deadlift']};

/* ----- Bibliotecas de bloques 3 y 4 (densidad y finishers dinámicos) ----- */
const DENSITY=[
  {fmt:'EMOM',label:'EMOM 8 min',desc:'Cada minuto, al empezar, haz 10 KB swings. El tiempo que sobre hasta el siguiente minuto, descansas. 8 minutos = 8 rondas.',sec:480,timer:'emom',q:'EMOM kettlebell swings workout'},
  {fmt:'AMRAP',label:'AMRAP 8 min',desc:'Máximas rondas en 8 min de: 5 goblet squat + 7 push press + 9 swings. Sin parar, cuenta tus rondas.',sec:480,timer:'down',q:'AMRAP kettlebell workout'},
  {fmt:'Ladder',label:'Escalera',desc:'Thrusters en escalera: 1 rep, luego 2, 3, 4, 5 y bajas 4, 3, 2, 1. Sin prisa pero sin pausa.',sec:420,timer:'down',q:'kettlebell thruster ladder workout'},
  {fmt:'For Time',label:'Por tiempo',desc:'100 KB swings lo más rápido posible (parte en series si hace falta). Apunta el tiempo total para batirlo.',sec:600,timer:'up',q:'100 kettlebell swings for time'},
  {fmt:'Density',label:'Density Challenge',desc:'Máximo clean & press posible en 5 min con buena técnica. Anota las reps y supera tu marca la próxima vez.',sec:300,timer:'down',q:'kettlebell clean and press tutorial'}
];
const FINISHER=[
  {label:'Complejo Forja',desc:'Sin soltar la KB: clean + front squat + push press + swing, 5 reps de cada = 1 ronda. Haz 3 rondas.',sec:300,timer:'down',q:'kettlebell complex workout'},
  {label:'Quemador escalera',desc:'KB swings bajando 10→1 (10,9,8...1) y goblet squat subiendo 1→10. Alterna. Encadenado.',sec:300,timer:'up',q:'kettlebell swing goblet squat ladder'},
  {label:'Farmer + burpee',desc:'40 metros de farmer walk (carga pesada en cada mano) + 10 burpees = 1 ronda. Haz 3 rondas.',sec:300,timer:'down',q:'farmer walk burpee finisher'},
  {label:'Tabata swings',desc:'8 rondas de: 20 segundos de KB swings a tope + 10 segundos de descanso. Total 4 minutos. La app marca cada intervalo.',sec:240,timer:'tabata',q:'tabata kettlebell swings'},
  {label:'Sprint metabólico',desc:'5 series de: 30 segundos fuerte + 30 segundos suave. En cinta, bici de aire o boxeo de sombra.',sec:300,timer:'down',q:'30 second sprint intervals workout'}
];

function load(){
  try{
    let raw=null;
    if(typeof localStorage!=='undefined'){raw=localStorage.getItem(KEY);}
    if(raw){DB=Object.assign(DB,JSON.parse(raw));}
    else if(typeof window!=='undefined'&&window.storage&&window.storage.get){
      window.storage.get(KEY).then(r=>{if(r&&r.value){DB=Object.assign(DB,JSON.parse(r.value));seed();renderAll();}}).catch(()=>{});
    }
  }catch(e){}
  seed();renderAll();
}
function save(){
  try{
    const data=JSON.stringify(DB);
    if(typeof localStorage!=='undefined'){localStorage.setItem(KEY,data);}
    if(typeof window!=='undefined'&&window.storage&&window.storage.set){window.storage.set(KEY,data).catch(()=>{});}
  }catch(e){
    try{toast('⚠️ No se pudo guardar (¿memoria llena de fotos?)');}catch(_){}
  }
}

let DB={
  profile:{weight:118,height:183,age:35,bench:75,squat:120,dead:150},
  routines:[],sessions:[],session:null,
  habits:[],habitLog:{},mindLog:{},extraLog:{},
  cycle:{weeks:6,start:'2026-06-08',rotIndex:0},
  body:[],bodyCfg:{everyWeeks:2},
  scores:[], medals:{}, formatPR:{},
  athlete:null, mode:'gym', settings:{fontScale:1,wakeLock:false}, exNotes:{},
  goalWeight:105, lastBackup:null,
  foodLog:{}, foodGoals:null, cheatLog:{}, customFoods:[],
  foodSetup:false, foodActivity:1.5, foodDeficit:450, foodProtPerKg:1.8, shopList:[]
};
const DEF_HAB=[{id:'h1',ic:'💧',name:'3 L de agua'},{id:'h2',ic:'🌞',name:'Luz natural 10 min'},{id:'h3',ic:'🧠',name:'Ritual de mañana'},{id:'h4',ic:'🥩',name:'Proteína en cada comida'},{id:'h5',ic:'📵',name:'Pausa de pantalla cada hora'},{id:'h6',ic:'😴',name:'Dormir 7-8 h'}];
const MIND=[{t:'0-2',d:'Respira: 6 respiraciones, inhala 4s / exhala 6s. Suelta hombros y mandíbula.',sec:120},{t:'2-5',d:'Columna: gato-camello x8, rotaciones de tronco x8/lado, círculos de cadera x8.',sec:180},{t:'5-8',d:'Activa: 20 sentadillas + 15 elevaciones de talón + 10 círculos de brazos.',sec:180},{t:'8-11',d:'Tren alto: aperturas de pecho, cuello suave, muñecas (por el teclado) x10.',sec:180},{t:'11-14',d:'Foco: ¿cuál es LA tarea importante de hoy? Visualízate haciéndola.',sec:180},{t:'14-15',d:'Intención: di en voz alta tu objetivo del día y un hábito que cumplirás.',sec:60}];

/* ===== rutinas con 4 bloques ===== */
function buildRoutines(rotIdx){
  const pick=(arr)=>arr[rotIdx%arr.length];
  return [
    {id:'r1',name:'PUSH',day:'Lunes',blocks:[
      {type:'fuerza',label:'Bloque 1 · Fuerza',exercises:[{name:pick(MAIN_ROT.Lunes),sets:4,reps:'3-5',rest:150,rpe:8,kg:DB.profile.bench}]},
      {type:'hipertrofia',label:'Bloque 2 · Hipertrofia densa',superset:true,rest:30,exercises:[{name:'Press inclinado mancuernas',sets:3,reps:'10-12',kg:24},{name:'Aperturas / cruce poleas',sets:3,reps:'12-15',kg:12},{name:'Elevaciones laterales',sets:3,reps:'15',kg:10}]},
      {type:'densidad',label:'Bloque 3 · Densidad',density:true,exercises:[{name:'Push press KB',sets:1,reps:'AMRAP',kg:20}]},
      {type:'finisher',label:'Bloque 4 · Finisher',finisher:true,exercises:[{name:'Finisher dinámico',sets:1,reps:'5 min',kg:0}]}
    ]},
    {id:'r2',name:'PULL',day:'Miércoles',blocks:[
      {type:'fuerza',label:'Bloque 1 · Fuerza',exercises:[{name:pick(MAIN_ROT.Miércoles),sets:4,reps:'4-6',rest:150,rpe:8,kg:0}]},
      {type:'hipertrofia',label:'Bloque 2 · Hipertrofia densa',superset:true,rest:30,exercises:[{name:'Remo gorila KB',sets:3,reps:'10-12',kg:26},{name:'Curl bíceps barra',sets:3,reps:'12',kg:30},{name:'Face pull',sets:3,reps:'15-20',kg:25}]},
      {type:'densidad',label:'Bloque 3 · Densidad',density:true,exercises:[{name:'KB swings',sets:1,reps:'EMOM',kg:24}]},
      {type:'finisher',label:'Bloque 4 · Finisher',finisher:true,exercises:[{name:'Finisher dinámico',sets:1,reps:'5 min',kg:0}]}
    ]},
    {id:'r3',name:'LEGS',day:'Sábado',blocks:[
      {type:'fuerza',label:'Bloque 1 · Fuerza',exercises:[{name:pick(MAIN_ROT.Sábado),sets:4,reps:'3-5',rest:180,rpe:8,kg:DB.profile.squat}]},
      {type:'hipertrofia',label:'Bloque 2 · Hipertrofia densa',superset:true,rest:30,exercises:[{name:'Peso muerto rumano',sets:3,reps:'8-10',kg:90},{name:'Zancada KB',sets:3,reps:'10/pierna',kg:20},{name:'Curl femoral',sets:3,reps:'12-15',kg:45}]},
      {type:'densidad',label:'Bloque 3 · Densidad',density:true,exercises:[{name:'Goblet squat KB',sets:1,reps:'Ladder',kg:24}]},
      {type:'finisher',label:'Bloque 4 · Finisher',finisher:true,exercises:[{name:'Finisher dinámico',sets:1,reps:'5 min',kg:0}]}
    ]}
  ];
}
function seed(){
  if(DB.habits.length===0)DB.habits=JSON.parse(JSON.stringify(DEF_HAB));
  if(DB.routines.length===0)DB.routines=buildRoutines(DB.cycle.rotIndex||0);
}

/* ===== RUTINAS DE VIAJE (sin gimnasio) ===== */
/* Material: peso corporal, comba, bandas elásticas (10kg c/u) + barra modulable, espacio para correr */
const TRAVEL_VID={
  'Press banca con bandas (barra)':'wsCJgGmpHWk',
  'Remo con banda':'xQrKtybGD7w',
  'Press hombro con banda':'oKw3i0K8eAk',
  'Sentadilla con banda':'YaXPRqUwItQ',
  'Peso muerto rumano banda':'2SHsk9AzdjA',
  'Curl banda + press banda':'xQrKtybGD7w',
  'Comba EMOM':'dqrU2-xlouY','Comba AMRAP':'dqrU2-xlouY',
  'Flexiones (pies elevados)':'4dF1DOWzf20','Flexiones':'4dF1DOWzf20',
  'Sentadilla búlgara (banda/mochila)':'2C-uNgKwPLE',
  'Intervalos carrera':'',
};
function travelRoutines(){
  return [
    {id:'t1',name:'TORSO VIAJE',day:'Lunes',travel:true,blocks:[
      {type:'fuerza',label:'Bloque 1 · Fuerza (banda+barra)',exercises:[{name:'Press banca con bandas (barra)',sets:4,reps:'10-15',rest:120,rpe:8,kg:0,note:'Barra modulable + 2 bandas. Tensión constante.'}]},
      {type:'hipertrofia',label:'Bloque 2 · Hipertrofia',superset:true,rest:30,exercises:[{name:'Flexiones (pies elevados)',sets:3,reps:'12-20',kg:0},{name:'Remo con banda',sets:3,reps:'15',kg:0},{name:'Press hombro con banda',sets:3,reps:'15',kg:0}]},
      {type:'densidad',label:'Bloque 3 · Densidad (comba)',density:true,exercises:[{name:'Comba EMOM',sets:1,reps:'EMOM',kg:0}]},
      {type:'finisher',label:'Bloque 4 · Finisher',finisher:true,exercises:[{name:'Finisher',sets:1,reps:'5 min',kg:0}]}
    ]},
    {id:'t2',name:'PIERNA VIAJE',day:'Miércoles',travel:true,blocks:[
      {type:'fuerza',label:'Bloque 1 · Fuerza',exercises:[{name:'Sentadilla búlgara (banda/mochila)',sets:4,reps:'10-12/pierna',rest:120,rpe:8,kg:0,note:'Lastra con mochila si tienes.'}]},
      {type:'hipertrofia',label:'Bloque 2 · Hipertrofia',superset:true,rest:30,exercises:[{name:'Sentadilla con banda',sets:3,reps:'20',kg:0},{name:'Peso muerto rumano banda',sets:3,reps:'15',kg:0},{name:'Puente glúteo',sets:3,reps:'20',kg:0}]},
      {type:'densidad',label:'Bloque 3 · Densidad (comba)',density:true,exercises:[{name:'Comba AMRAP',sets:1,reps:'AMRAP',kg:0}]},
      {type:'finisher',label:'Bloque 4 · Finisher',finisher:true,exercises:[{name:'Finisher',sets:1,reps:'5 min',kg:0}]}
    ]},
    {id:'t3',name:'FULL BODY + CARRERA',day:'Sábado',travel:true,blocks:[
      {type:'fuerza',label:'Bloque 1 · Fuerza',exercises:[{name:'Dominadas (o remo banda en puerta)',sets:4,reps:'máx',rest:120,rpe:8,kg:0}]},
      {type:'hipertrofia',label:'Bloque 2 · Circuito',superset:true,rest:30,exercises:[{name:'Flexiones',sets:3,reps:'15-20',kg:0},{name:'Sentadilla salto',sets:3,reps:'15',kg:0},{name:'Curl banda + press banda',sets:3,reps:'15',kg:0}]},
      {type:'densidad',label:'Bloque 3 · Carrera',density:true,exercises:[{name:'Intervalos carrera',sets:1,reps:'For Time',kg:0}]},
      {type:'finisher',label:'Bloque 4 · Finisher',finisher:true,exercises:[{name:'Finisher',sets:1,reps:'5 min',kg:0}]}
    ]}
  ];
}
/* ===== BOXEO DE VERANO GUIADO (rounds + vídeos drills) ===== */
const BOX_SESSION={
  id:'box1',name:'BOXEO · Técnica',rounds:[
    {n:1,label:'Calentamiento + comba',min:3,desc:'Comba o saltos + movilidad de hombro y cadera. Sube pulso.',vid:'dqrU2-xlouY'},
    {n:2,label:'Sombra · postura y guardia',min:3,desc:'Guardia alta, peso equilibrado. Jab-jab, mueve los pies. Frente al espejo si puedes.',vid:'MVUnw0GcZ1o'},
    {n:3,label:'Drills · combinaciones 1-2',min:3,desc:'Jab (1) + cross (2). Rota cadera en el cross, vuelve a guardia rápido.',vid:'6NxPPA9Rpi4'},
    {n:4,label:'Sombra · combate imaginario',min:3,desc:'Simula un rival: ataca, esquiva (bobbing), responde. Mantén ritmo.',vid:'MVUnw0GcZ1o'},
    {n:5,label:'Finisher · ráfagas',min:3,desc:'Ráfagas de 10s a tope / 20s suave. Vacía el tanque.',vid:'dqrU2-xlouY'}
  ],restSec:60,workSec:180
};

/* ===== navegación ===== */
function nav(v,el){document.querySelectorAll('.view').forEach(x=>x.classList.remove('on'));document.getElementById('v-'+v).classList.add('on');document.querySelectorAll('nav button').forEach(b=>b.classList.remove('on'));el.classList.add('on');window.scrollTo(0,0);if(v==='home')renderDashboard();if(v==='mind'){renderVideoCats();renderHabits();}if(v==='body')renderBody();if(v==='food')renderFood();if(v==='train'){renderCycle();renderTodayReady();renderExtra();}}
function navBtn(i){return document.querySelectorAll('nav button')[i];}
function trainTab(t,el){['hoy','prog','retos','rutinas'].forEach(x=>document.getElementById('train-'+x).style.display='none');document.getElementById('train-'+t).style.display='block';el.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('on'));el.classList.add('on');if(t==='prog'){renderProgSelect();renderDensityChart();renderPR();renderHistory();}if(t==='retos'){renderMedals();renderFormatPR();}if(t==='rutinas'){renderRoutines();renderRotation();}if(t==='hoy'){renderCycle();renderTodayReady();renderExtra();}}
function mindTab(t,el){['video','ritual','habits'].forEach(x=>document.getElementById('mind-'+x).style.display='none');document.getElementById('mind-'+t).style.display='block';el.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('on'));el.classList.add('on');if(t==='habits'){renderHabits();renderHabitStreak();}else if(t==='ritual'){renderMindSteps();renderMindTimer();}else{renderVideoCats();}}
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2400);}
function closeModal(){document.getElementById('modalBg').classList.remove('on');}
function openModal(h){document.getElementById('modalBox').innerHTML='<button class="close" onclick="closeModal()">×</button>'+h;document.getElementById('modalBg').classList.add('on');}
function beep(n=1){
  try{const c=new(window.AudioContext||window.webkitAudioContext)();
    for(let i=0;i<n;i++){const t0=c.currentTime+i*0.32;
      const o=c.createOscillator(),g=c.createGain();o.type='square';o.connect(g);g.connect(c.destination);
      o.frequency.setValueAtTime(660,t0);o.frequency.setValueAtTime(990,t0+0.12);
      g.gain.setValueAtTime(0.0001,t0);g.gain.exponentialRampToValueAtTime(0.4,t0+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t0+0.28);
      o.start(t0);o.stop(t0+0.3);
    }setTimeout(()=>c.close(),n*340+200);
  }catch(e){}
  try{if(navigator.vibrate)navigator.vibrate(n>1?[120,80,120,80,200]:[200]);}catch(e){}
}
function fd(ds){const d=new Date(ds+'T00:00');return d.toLocaleDateString('es-ES',{weekday:'short',day:'numeric',month:'short'});}
function daysBetween(a,b){return Math.floor((new Date(b)-new Date(a))/864e5);}
function weekDates(){const a=[];const d=new Date();const dow=(d.getDay()+6)%7;d.setDate(d.getDate()-dow);for(let i=0;i<7;i++){a.push(d.toISOString().slice(0,10));d.setDate(d.getDate()+1);}return a;}

/* ===================== DASHBOARD ===================== */
function strengthEstimate(){return Math.round((DB.profile.bench||0)+(DB.profile.squat||0)+(DB.profile.dead||0));}
function renderDashboard(){
  document.getElementById('motivate').textContent='“'+MOT[new Date().getDate()%MOT.length]+'”';
  const lastBody=DB.body[0];
  document.getElementById('dWeight').textContent=lastBody&&lastBody.peso?lastBody.peso:DB.profile.weight;
  document.getElementById('dWaist').textContent=lastBody&&lastBody.cintura?lastBody.cintura:'—';
  document.getElementById('dStrength').textContent=strengthEstimate();
  let streak=0;let d=new Date();const sd=new Set(DB.sessions.map(s=>s.date));for(;;){const ds=d.toISOString().slice(0,10);if(sd.has(ds)){streak++;d.setDate(d.getDate()-1);}else if(ds===today()){d.setDate(d.getDate()-1);}else break;}
  document.getElementById('dStreak').textContent=streak;
  const wk=weekDates();
  document.getElementById('dWorkouts').textContent=DB.sessions.filter(s=>wk.includes(s.date)).length;
  document.getElementById('dBox').textContent=wk.filter(ds=>DB.extraLog[ds]&&DB.extraLog[ds].box).length;
  document.getElementById('dRun').textContent=wk.filter(ds=>DB.extraLog[ds]&&DB.extraLog[ds].run).length;
  // density score (último)
  const lastSess=DB.sessions.find(s=>s.density!=null);
  const dn=document.getElementById('densityNum');const dr=document.getElementById('densityRing');
  if(lastSess){dn.textContent=lastSess.density;const avg=avgDensity();const col=lastSess.density>=avg?'var(--acc2)':'var(--gold)';dr.style.background=`conic-gradient(${col} ${Math.min(100,lastSess.density/Math.max(avg*1.3,1)*100)*3.6}deg, var(--bg3) 0)`;document.getElementById('densityTrend').textContent=avg?`media ${avg}`:'';}
  else{dn.textContent='—';dr.style.background='var(--bg3)';document.getElementById('densityTrend').textContent='entrena para activar';}
  // fat loss
  const fl=fatLossScore();const fn=document.getElementById('fatNum');const fr=document.getElementById('fatRing');
  if(fl!=null){fn.textContent=fl;const col=fl>=66?'var(--ok)':fl>=40?'var(--gold)':'var(--bad)';fr.style.background=`conic-gradient(${col} ${fl*3.6}deg, var(--bg3) 0)`;document.getElementById('fatMsg').textContent=fl>=66?'vas bien':fl>=40?'aceptable':'aprieta';}
  else{fn.textContent='—';fr.style.background='var(--bg3)';document.getElementById('fatMsg').textContent='mide y entrena';}
  renderWeekChallenge();renderWeeklySummary();renderGoalProgress();renderFoodDash();renderBackupReminder();renderCalendar();renderExtraHistory();renderTodayDash();renderWeekView();
}
function renderFoodDash(){const el=document.getElementById('foodDash');if(!el)return;const g=foodGoals();const t=dayTotals();const items=dayFood();const kpct=Math.min(100,Math.round(t.kcal/g.kcal*100));const ppct=Math.min(100,Math.round(t.p/g.prot*100));el.innerHTML=`<div class="stat-grid c2"><div class="stat"><div class="v acc">${Math.round(t.kcal)}</div><div class="l">/ ${g.kcal} kcal</div></div><div class="stat"><div class="v acc2">${Math.round(t.p)}</div><div class="l">/ ${g.prot}g prot</div></div></div><div class="bar" style="margin-top:8px"><i style="width:${ppct}%;background:var(--acc2)"></i></div><p class="mini" style="margin-top:6px">${items.length?items.length+' alimentos registrados hoy':'Aún sin registrar. Toca Comida para empezar.'}${DB.cheatLog[today()]?' · 🍔 trampa':''}</p>`;
}
function renderExtraHistory(){const el=document.getElementById('extraHistory');if(!el)return;let html='';for(let i=29;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const ds=d.toISOString().slice(0,10);const e=DB.extraLog[ds]||{};const sess=DB.sessions.some(s=>s.date===ds);let bg='var(--bg3)',bd='var(--line)';if(e.box){bg='rgba(255,193,50,.3)';bd='var(--gold)';}else if(sess){bg='rgba(255,64,21,.25)';bd='var(--acc)';}else if(e.run){bg='rgba(156,107,255,.25)';bd='var(--viol)';}html+=`<span class="streak-dot" style="background:${bg};border-color:${bd}" title="${ds}${e.box?' 🥊':''}${e.run?' 🏃':''}${sess?' 💪':''}"></span>`;}
  const wk=weekDates();const totBox=Object.keys(DB.extraLog).filter(d=>DB.extraLog[d].box).length;const totRun=Object.keys(DB.extraLog).filter(d=>DB.extraLog[d].run).length;
  el.innerHTML=html+`<p class="mini" style="margin-top:8px">🥊 Boxeo (oro) · 💪 Entreno (naranja) · 🏃 Carrera (violeta). Total: ${totBox} boxeos, ${totRun} carreras registradas.</p>`;
}
function renderTodayDash(){const td=DAYS[(new Date().getDay()+6)%7];const r=DB.routines.find(x=>x.day===td);const el=document.getElementById('todayBox');document.getElementById('todayTitle').textContent='📅 '+td;
  if(r)el.innerHTML=`<div class="day-row"><div class="dd">💪</div><div class="di"><b>${r.name}</b><div class="mini">4 bloques · ~50 min</div></div><button class="btn-sm btn-acc2" onclick="nav('train',navBtn(1));startFlow('${r.id}')">Entrenar</button></div>`;
  else el.innerHTML=`<p class="mini">Hoy (${td}) descanso o extra (boxeo/carrera). Recuperar también suma al Fat Loss Score.</p>`;}
function renderWeekView(){const plan={'Lunes':'💪 PUSH','Martes':'🏃 Cardio/boxeo','Miércoles':'💪 PULL','Jueves':'🏃 Cardio suave','Viernes':'😴 Descanso','Sábado':'💪 LEGS','Domingo':'😴 Descanso'};document.getElementById('weekView').innerHTML=DAYS.map(d=>`<div class="day-row"><div class="dd">${d.slice(0,3)}</div><div class="di">${plan[d]}</div></div>`).join('');}

/* ===================== SCORES ===================== */
function sessionVolume(s){let v=0;(s.blocks||[]).forEach(b=>b.exercises.forEach(e=>(e.sets||[]).forEach(st=>v+=(+st.kg||0)*(+st.reps||0))));return v;}
function avgDensity(){const ds=DB.sessions.filter(s=>s.density!=null).slice(0,4);if(!ds.length)return 0;return Math.round(ds.reduce((a,s)=>a+s.density,0)/ds.length);}
function computeDensity(s){const vol=sessionVolume(s);const min=Math.max(s.duration||1,1);const restFactor=s.restFactor||1;return Math.round((vol/min)*restFactor);}
function fatLossScore(){
  // semanal 0-100: peso 30, cintura 25, adherencia 20, boxeo 10, carrera 10, hábitos 5
  if(DB.body.length<1&&DB.sessions.length<1)return null;
  let score=0;
  // peso: tendencia últimas 2 mediciones
  if(DB.body.length>=2){const a=DB.body[1].peso,b=DB.body[0].peso;if(a&&b){const diff=b-a;score+=diff<-0.2?30:diff<=0.2?20:8;}else score+=15;}else score+=15;
  // cintura
  if(DB.body.length>=2){const a=DB.body[1].cintura,b=DB.body[0].cintura;if(a&&b){const diff=b-a;score+=diff<-0.3?25:diff<=0.3?16:6;}else score+=12;}else score+=12;
  // adherencia entrenos (semana): objetivo 3
  const wk=weekDates();const w=DB.sessions.filter(s=>wk.includes(s.date)).length;score+=Math.min(20,Math.round(w/3*20));
  // boxeo
  const box=wk.filter(ds=>DB.extraLog[ds]&&DB.extraLog[ds].box).length;score+=Math.min(10,box*5);
  // carrera
  const run=wk.filter(ds=>DB.extraLog[ds]&&DB.extraLog[ds].run).length;score+=Math.min(10,run*5);
  // habitos
  let hd=0,hc=0;wk.forEach(ds=>{const l=DB.habitLog[ds];if(l){hc++;hd+=DB.habits.filter(h=>l[h.id]).length/DB.habits.length;}});score+=Math.round((hc?hd/hc:0)*5);
  return Math.min(100,Math.round(score));
}

/* ===================== RETO SEMANAL / GAMIFICACIÓN ===================== */
const CHALLENGES=[
  '100 KB swings por tiempo: supera tu marca anterior.',
  'Sube el Density Score de cada sesión respecto a la semana pasada.',
  'Completa los 4 bloques sin saltarte el finisher 3 días.',
  'Añade 2,5 kg al ejercicio principal de fuerza.',
  'Cierra la semana con 3 entrenos + 2 boxeos.',
  'Mantén la cadena de hábitos los 7 días.',
  'Aguanta los descansos cortos del Bloque 2 (sin pasarte de 30s).'
];
function weekNumber(){const d=new Date();const o=new Date(d.getFullYear(),0,1);return Math.ceil(((d-o)/864e5+o.getDay()+1)/7);}
function renderWeekChallenge(){document.getElementById('weekChallenge').innerHTML=`<div class="challenge"><h4>🎯 Esta semana</h4><p style="font-size:14px;margin-top:4px">${CHALLENGES[weekNumber()%CHALLENGES.length]}</p></div>`;}
const MEDALS=[
  {id:'m1',n:'Primer entreno',ic:'🥉',test:()=>DB.sessions.length>=1},
  {id:'m2',n:'10 entrenos',ic:'🥈',test:()=>DB.sessions.length>=10},
  {id:'m3',n:'25 entrenos',ic:'🥇',test:()=>DB.sessions.length>=25},
  {id:'m4',n:'Sentadilla 130',ic:'🦵',test:()=>maxKg('Sentadilla')>=130},
  {id:'m5',n:'Banca 80',ic:'🏋️',test:()=>maxKg('Press banca')>=80},
  {id:'m6',n:'Density 300',ic:'⚡',test:()=>DB.sessions.some(s=>s.density>=300)},
  {id:'m7',n:'Racha 7 días',ic:'🔥',test:()=>habitChainBest()>=7},
  {id:'m8',n:'Primera medición',ic:'📏',test:()=>DB.body.length>=1},
  {id:'m9',n:'Fat Loss 70',ic:'🎯',test:()=>(fatLossScore()||0)>=70}
];
function maxKg(name){let m=0;DB.sessions.forEach(s=>(s.blocks||[]).forEach(b=>b.exercises.forEach(e=>{if(e.name===name)(e.sets||[]).forEach(st=>{if(+st.kg>m)m=+st.kg;});})));return m;}
function habitChainBest(){let best=0,cur=0;for(let i=29;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const ds=d.toISOString().slice(0,10);const l=DB.habitLog[ds]||{};const r=DB.habits.length?DB.habits.filter(h=>l[h.id]).length/DB.habits.length:0;if(r>=0.6){cur++;best=Math.max(best,cur);}else cur=0;}return best;}
function renderMedals(){document.getElementById('medalList').innerHTML=MEDALS.map(m=>{const got=m.test();return `<span class="medal ${got?'got':''}">${m.ic} ${m.n}</span>`;}).join('');}
function renderFormatPR(){const keys=Object.keys(DB.formatPR);document.getElementById('formatPR').innerHTML=keys.length?keys.map(k=>`<div class="sub-opt"><span>${k}</span><b style="color:var(--gold)">${DB.formatPR[k]}</b></div>`).join(''):'<p class="empty">Completa bloques de densidad para registrar marcas (swings por tiempo, AMRAP, etc.)</p>';}

/* ===================== CICLO + ROTACIÓN ===================== */
function cycleWeek(){return Math.floor(daysBetween(DB.cycle.start,today())/7);}
function renderCycle(){
  const w=cycleWeek(),total=DB.cycle.weeks;const cur=Math.max(1,Math.min(w+1,total));const started=new Date(today())>=new Date(DB.cycle.start);
  document.getElementById('cycleInfo').innerHTML=started?`<div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-family:Anton;font-size:21px">Semana ${cur} <span class="mini" style="font-family:Barlow">de ${total}</span></span><span class="mini">ciclo ${(DB.cycle.rotIndex||0)+1}</span></div>`:`<div style="font-family:Anton;font-size:18px">Empieza ${fd(DB.cycle.start)}</div><p class="mini">Hasta entonces puedes entrenar libre.</p>`;
  let bar='';for(let i=0;i<total;i++)bar+=`<i class="${i<w?'done':i===w&&started?'now':''}"></i>`;document.getElementById('cycleBar').innerHTML=bar;
  const al=document.getElementById('cycleAlert');
  if(started&&w>=total)al.innerHTML=`<div class="note gold"><b>🔔 Ciclo completado.</b> Toca rotar ejercicios y ajustar.<br><button class="btn btn-gold" style="margin-top:10px" onclick="reviewCycle()">Ver ajustes y rotar</button></div>`;
  else if(started){const left=total-cur;al.innerHTML=`<p class="mini" style="margin-top:8px">Quedan ${left} ${left===1?'semana':'semanas'}. Al terminar: rotación automática de ejercicio principal + ajustes.</p>`;}
  else al.innerHTML='';
}
function openCycle(){openModal(`<h3>Ajustar ciclo</h3><label>Duración (semanas)</label><input id="cyW" type="number" value="${DB.cycle.weeks}"><label style="margin-top:8px">Inicio</label><input id="cyS" type="date" value="${DB.cycle.start}"><button class="btn" style="margin-top:14px" onclick="saveCycle()">Guardar</button><button class="btn2" style="margin-top:8px" onclick="restartCycle(false)">🔄 Reiniciar a hoy (sin rotar)</button>`);}
function saveCycle(){DB.cycle.weeks=Math.max(1,+document.getElementById('cyW').value||6);DB.cycle.start=document.getElementById('cyS').value||today();save();closeModal();renderCycle();toast('Ciclo actualizado');}
function restartCycle(rotate){DB.cycle.start=today();if(rotate){DB.cycle.rotIndex=(DB.cycle.rotIndex||0)+1;DB.routines=buildRoutines(DB.cycle.rotIndex);}save();closeModal();renderCycle();renderRoutines&&renderRoutines();toast(rotate?'🔄 Nuevo ciclo · ejercicios rotados':'🔄 Ciclo reiniciado');}
function reviewCycle(){
  const tips=[];
  DB.routines.forEach(r=>{const main=r.blocks[0].exercises[0];const h=exerciseHistory(main.name);
    if(h.length<2){tips.push({n:main.name,t:'Pocos datos. Mantén carga y registra más.'});return;}
    const f=h[0].topKg,l=h[h.length-1].topKg,lr=h[h.length-1].topReps;
    if(l>f)tips.push({n:main.name,t:`+${(l-f).toFixed(1)} kg. Sube 2,5-5% y vuelve al rango bajo de reps.`});
    else if(l===f&&lr>0)tips.push({n:main.name,t:`Estancado. Si llegas al tope a RPE≤8, sube 2,5 kg; si no, busca +1 rep/serie.`});
    else tips.push({n:main.name,t:'Sin progreso. Semana de descarga (-40%) y vuelve fuerte.'});
  });
  const fl=fatLossScore();let global=fl!=null&&fl<40?'Fat Loss bajo: sube cardio/finisher y revisa nutrición, no bajes la fuerza.':'Buen avance: mantén el plan y sube cargas donde toque.';
  openModal(`<h3>🔧 Revisión de ciclo</h3><p class="mini" style="margin-bottom:10px">Análisis de ${DB.cycle.weeks} semanas. Al aceptar, el ejercicio principal de cada día rota a la siguiente variante.</p>${tips.map(t=>`<div class="ex-block"><div class="nm" style="font-family:Anton;font-size:14px">${t.n}</div><div class="mini" style="margin-top:4px;color:var(--txt)">${t.t}</div></div>`).join('')}<div class="note gold">${global}</div><button class="btn btn-gold" style="margin-top:14px" onclick="restartCycle(true)">🔄 Rotar ejercicios y empezar ciclo</button>`);
}
function renderRotation(){const idx=(DB.cycle.rotIndex||0);document.getElementById('rotationInfo').innerHTML=Object.entries(MAIN_ROT).map(([d,arr])=>`<div class="sub-opt"><span>${d}</span><b>${arr[idx%arr.length]}</b></div>`).join('')+`<p class="mini" style="margin-top:8px">Cada 6 semanas (fin de ciclo) el principal rota a la siguiente variante. Vas por el ciclo ${idx+1}.</p>`;}

/* ===================== MODO ATLETA + FLUJO SESIÓN ===================== */
function renderTodayReady(){const td=DAYS[(new Date().getDay()+6)%7];const r=DB.routines.find(x=>x.day===td);const el=document.getElementById('todayReady');document.getElementById('readyTitle').textContent='📅 '+td;
  if(DB.session){el.innerHTML='<p class="mini">Sesión en curso abajo 👇</p>';return;}
  if(r)el.innerHTML=`<div class="day-row"><div class="dd">💪</div><div class="di"><b>${r.name}</b><div class="mini">4 bloques · Fuerza · Hipertrofia · Densidad · Finisher</div></div><button class="btn-sm btn-acc2" onclick="startFlow('${r.id}')">Empezar</button></div><button class="btn2" style="margin-top:8px" onclick="startWarmup('${r.id}')">🔥 Calentamiento guiado primero</button>`;
  else el.innerHTML=`<p class="mini">Hoy (${td}) sin rutina. Descanso o empieza una manual:</p><div style="margin-top:8px">${DB.routines.map(x=>`<button class="btn-sm btn2" style="margin:2px" onclick="startFlow('${x.id}')">${x.name}</button>`).join('')}</div>`;
}
function startFlow(rid){window._pendingRid=rid;openModal(`<h3>Modo Atleta</h3><p class="mini" style="margin-bottom:6px">¿Cómo llegas hoy? La sesión se ajusta a tu estado.</p><div class="athlete-opt"><button class="fresco" onclick="pickAthlete('fresco')"><span class="e">🔋</span>Fresco</button><button class="normal" onclick="pickAthlete('normal')"><span class="e">⚡</span>Normal</button><button class="fatigado" onclick="pickAthlete('fatigado')"><span class="e">🪫</span>Fatigado</button></div><p class="mini" style="margin-top:10px">Fresco: +volumen e intensidad · Normal: plan estándar · Fatigado: menos volumen, más descanso, finisher suave.</p>`);}
function pickAthlete(state){DB.athlete=state;closeModal();startSession(window._pendingRid,state);}
function lastSessionFor(rid){return DB.sessions.find(s=>s.routineId===rid);}
function adjustForAthlete(blocks,state){
  return blocks.map(b=>{const nb=JSON.parse(JSON.stringify(b));
    nb.exercises=nb.exercises.map(e=>{let sets=e.sets;let rest=e.rest;
      if(state==='fresco'&&(b.type==='hipertrofia'))sets=sets+1;
      if(state==='fatigado'&&(b.type==='hipertrofia'))sets=Math.max(2,sets-1);
      if(state==='fatigado'&&rest)rest=rest+20;
      return Object.assign({},e,{sets,rest});});
    return nb;});
}
function pickDensity(){return DENSITY[DB.sessions.length%DENSITY.length];}
function pickFinisher(state){const idx=DB.sessions.length%FINISHER.length;let f=FINISHER[idx];if(state==='fatigado')return {label:f.label+' (suave)',desc:f.desc+' Reduce 1 ronda.',sec:Math.round(f.sec*0.7),timer:f.timer};return f;}
function startSession(rid,state){const r=DB.routines.find(x=>x.id===rid);if(!r)return;const last=lastSessionFor(rid);
  let blocks=adjustForAthlete(r.blocks,state);
  const dens=pickDensity();const fin=pickFinisher(state);
  blocks=blocks.map(b=>{
    if(b.density){b._meta=dens;b.exercises[0].name=dens.label+' · '+dens.exercises?.[0]?.name;b.exercises=[{name:dens.fmt+' · KB',sets:1,reps:dens.fmt,kg:b.exercises[0].kg||20}];}
    if(b.finisher){b._meta=fin;b.exercises=[{name:fin.label,sets:1,reps:'5 min',kg:0}];}
    b.exercises=b.exercises.map(e=>{
      let prev=null;if(last){(last.blocks||[]).forEach(lb=>{const le=lb.exercises.find(x=>x.name===e.name);if(le)prev=le.sets;});}
      const baseKg=prev&&prev[0]?prev[0].kg:(e.kg||'');
      return Object.assign({},e,{prev,sets:Array.from({length:e.sets},(_,i)=>({kg:prev&&prev[i]?prev[i].kg:baseKg,reps:'',done:false,rpe:''}))});
    });
    return b;
  });
  DB.session={routineId:rid,name:r.name,date:today(),athlete:state,startTs:Date.now(),restAccum:0,restTarget:0,blocks};
  save();resetT();document.getElementById('sessionCard').style.display='block';renderSessionHead();renderSessionBody();renderTimerHero();renderTodayReady();document.getElementById('sessionCard').scrollIntoView({behavior:'smooth'});if(DB.settings&&DB.settings.wakeLock)requestWake();
}
function renderSessionHead(){const s=DB.session;const eIc={fresco:'🔋',normal:'⚡',fatigado:'🪫'}[s.athlete]||'';document.getElementById('sessionHead').innerHTML=`<h3>💪 ${s.name} <span class="tag">${eIc} ${s.athlete||''}</span></h3>`;}
function renderSessionBody(){const s=DB.session;if(!s)return;let html='';
  s.blocks.forEach((b,bi)=>{
    html+=`<div class="block-title">${b.label}${b.superset?' <span class="bt-tag">superserie · 30s</span>':''}${b._meta?` <span class="bt-tag">${b._meta.label}</span>`:''}</div>`;
    if(b._meta){
      const vidBtn=b._meta.q?`<button class="btn-sm btn2" style="margin-top:8px" onclick="showFormatVideo('${b._meta.q.replace(/'/g,"")}','${b._meta.label.replace(/'/g,"")}')">🎬 Ver cómo se hace</button>`:'';
      html+=`<div class="note ${b.finisher?'gold':''}"><b>${b._meta.label}</b><br>${b._meta.desc}<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px"><button class="btn-sm ${b.finisher?'btn-gold':'btn-acc2'}" onclick="startBlockTimer(${bi})">▶ Cronómetro</button>${vidBtn}</div></div><div id="blockTimer_${bi}"></div>`;
      if(b.density){html+=`<div class="ex-block" style="margin-top:8px"><div class="mini">Apunta tu resultado (reps/rondas/tiempo) para batir tu marca:</div><input id="dens_${bi}" placeholder="ej. 8 rondas / 4:30" value="${b.result||''}" oninput="DB.session.blocks[${bi}].result=this.value;save()" style="margin-top:6px"></div>`;}
      return;
    }
    b.exercises.forEach((ex,ei)=>{
      let prevTxt=ex.prev?`<div class="prev">↺ ${ex.prev.map(p=>`${p.kg||0}×${p.reps||0}`).join(', ')}</div>`:'';
      const showRpe=b.type==='fuerza';
      let sug=showRpe?rpeSuggestion(ex.name):null;
      let sugTxt=sug?`<div class="prev" style="color:var(--gold)">🎯 Sugerencia: ${sug}</div>`:'';
      const noteVal=DB.exNotes&&DB.exNotes[ex.name]||'';
      const noteTxt=`<input value="${noteVal.replace(/"/g,'&quot;')}" placeholder="📝 nota (agarre, molestia...)" oninput="setExNote('${ex.name.replace(/'/g,"")}',this.value)" style="font-size:12px;padding:7px 10px;margin-top:6px;background:var(--bg)">`;
      const vid=TRAVEL_VID[ex.name];
      const vidBtn=vid?`<button class="btn-sm btn2" style="margin-top:6px" onclick="showExVideo('${vid}','${ex.name.replace(/'/g,"")}')">🎬 Ver técnica</button>`:'';
      html+=`<div class="ex-block ${b.superset?'super':''}"><div class="ex-head"><span class="nm" onclick="swapExercise(${bi},${ei})" style="cursor:pointer">${ex.name} ${SUBS[ex.name]?'<span style="color:var(--acc2);font-size:13px">⇄</span>':''}</span><span style="display:flex;gap:4px;align-items:center"><button class="btn-sm btn2" style="padding:4px 8px" onclick="moveEx(${bi},${ei},-1)">↑</button><button class="btn-sm btn2" style="padding:4px 8px" onclick="moveEx(${bi},${ei},1)">↓</button></span></div><div class="mini" style="margin:-4px 0 6px">${ex.reps} ${b.type==='fuerza'?'· RPE '+(ex.rpe||8):''} ${ex.rest?'· ⏸'+ex.rest+'s':''}</div>${prevTxt}${sugTxt}<div class="set-head"><span>#</span><span>Kg</span><span>Reps</span><span>${showRpe?'RPE':''}</span><span>✓</span></div>${ex.sets.map((st,j)=>`<div class="set-row"><span class="n">${j+1}</span><input type="number" inputmode="decimal" value="${st.kg}" placeholder="kg" oninput="setVal(${bi},${ei},${j},'kg',this.value)"><input type="number" inputmode="numeric" value="${st.reps}" placeholder="reps" oninput="setVal(${bi},${ei},${j},'reps',this.value)"><input type="number" inputmode="numeric" value="${st.rpe||''}" placeholder="${showRpe?'rpe':'-'}" ${showRpe?'':'disabled style=opacity:.3'} oninput="setVal(${bi},${ei},${j},'rpe',this.value)" style="grid-column:span 1"><button class="ok ${st.done?'on':''}" onclick="toggleSet(${bi},${ei},${j})">✓</button></div>`).join('')}${vidBtn}${noteTxt}<button class="btn-sm btn2" style="margin-top:6px" onclick="addSet(${bi},${ei})">+ serie</button></div>`;
    });
  });
  document.getElementById('sessionBody').innerHTML=html;
}
function setVal(bi,ei,j,f,v){DB.session.blocks[bi].exercises[ei].sets[j][f]=v;save();}
function setExNote(name,v){DB.exNotes=DB.exNotes||{};if(v.trim())DB.exNotes[name]=v;else delete DB.exNotes[name];save();}
function rpeSuggestion(name){
  // busca la última sesión con datos de fuerza (kg+rpe) de este ejercicio
  for(const s of DB.sessions){let found=null;(s.blocks||[]).forEach(b=>{if(b.type==='fuerza'){const e=b.exercises.find(x=>x.name===name);if(e)found=e;}});
    if(found){let topKg=0,rpe=0;(found.sets||[]).forEach(st=>{const k=+st.kg||0;if(k>=topKg){topKg=k;rpe=+st.rpe||0;}});
      if(topKg>0&&rpe>0){
        if(rpe<=6)return `sube a ~${Math.round(topKg*1.05/1.25)*1.25} kg (la última fue fácil, RPE ${rpe})`;
        if(rpe<=8)return `repite ~${topKg} kg o +2,5 (RPE ${rpe})`;
        return `mantén o baja un poco (${topKg} kg fue RPE ${rpe})`;
      }
      if(topKg>0)return `última vez ${topKg} kg · anota el RPE hoy para mejores sugerencias`;
    }
  }
  return null;
}
function addSet(bi,ei){const ss=DB.session.blocks[bi].exercises[ei].sets;ss.push({kg:ss.length?ss[ss.length-1].kg:'',reps:'',done:false,rpe:''});renderSessionBody();}
function moveEx(bi,ei,dir){const arr=DB.session.blocks[bi].exercises;const ni=ei+dir;if(ni<0||ni>=arr.length)return;const t=arr[ei];arr[ei]=arr[ni];arr[ni]=t;save();renderSessionBody();}
function toggleSet(bi,ei,j){const st=DB.session.blocks[bi].exercises[ei].sets[j];st.done=!st.done;if(st.done){const ex=DB.session.blocks[bi].exercises[ei];if(ex.rest){restT(adjRest(ex.rest));}else if(DB.session.blocks[bi].superset){restT(30);}beep(1);}save();renderSessionBody();}
function adjRest(r){return DB.session&&DB.session.athlete==='fatigado'?r+20:r;}
function finishSession(){const s=DB.session;if(!s)return;
  // recopilar
  let any=false;const blocks=s.blocks.map(b=>({type:b.type,label:b.label,result:b.result||null,meta:b._meta?b._meta.label:null,exercises:b.exercises.map(e=>{const sets=(e.sets||[]).filter(x=>x.kg||x.reps);if(sets.length)any=true;return {name:e.name,reps:e.reps,sets};}).filter(e=>e.sets.length||e.name)}));
  if(!any&&!s.blocks.some(b=>b.result)){toast('Anota algo antes de guardar');return;}
  const dur=Math.max(1,Math.round((Date.now()-s.startTs)/60000));
  const restFactor=s.restTarget>0?Math.max(0.8,Math.min(1.2,1+(1-(s.restAccum/s.restTarget)))):1;
  const rec={id:'s'+Date.now(),routineId:s.routineId,name:s.name,date:today(),athlete:s.athlete,duration:dur,restFactor:Math.round(restFactor*100)/100,blocks};
  rec.density=computeDensity(rec);
  // PR de fuerza
  const pr={};DB.sessions.forEach(x=>(x.blocks||[]).forEach(b=>b.exercises.forEach(e=>e.sets.forEach(st=>{const k=+st.kg||0;if(k>0&&(!pr[e.name]||k>pr[e.name]))pr[e.name]=k;}))));
  let np=[];blocks.forEach(b=>b.exercises.forEach(e=>e.sets.forEach(st=>{const k=+st.kg||0;if(k>0&&k>(pr[e.name]||0)&&!np.includes(e.name))np.push(e.name);})));
  // formato PR (densidad)
  blocks.forEach(b=>{if(b.result&&b.meta){const key=b.meta;if(!DB.formatPR[key]||b.result>DB.formatPR[key])DB.formatPR[key]=b.result;}});
  // actualizar profile fuerza si supera
  ['Press banca','Sentadilla','Trap bar deadlift'].forEach(n=>{const m=Math.max(maxKg(n),(function(){let mm=0;blocks.forEach(b=>b.exercises.forEach(e=>{if(e.name===n)e.sets.forEach(st=>{if(+st.kg>mm)mm=+st.kg;});}));return mm;})());if(n==='Press banca'&&m>DB.profile.bench)DB.profile.bench=m;if(n==='Sentadilla'&&m>DB.profile.squat)DB.profile.squat=m;});
  DB.sessions.unshift(rec);DB.session=null;resetT();save();releaseWake();
  document.getElementById('sessionCard').style.display='none';renderTodayReady();renderCycle();renderDashboard();
  toast(np.length?`🏆 ¡RÉCORD en ${np[0]}! · Density ${rec.density}`:`💪 Guardado · Density ${rec.density}`);
}
function cancelSession(){DB.session=null;resetT();save();releaseWake();document.getElementById('sessionCard').style.display='none';renderTodayReady();}

/* ===== timers (con barra flotante siempre visible) ===== */
let T={running:false,phase:'idle',sec:0,id:null,elapsed:0,label:''};
function renderTimerHero(){renderFloatTimer();const el=document.getElementById('timerHero');if(!DB.session){if(el)el.innerHTML='';return;}const elapsed=DB.session?Math.floor((Date.now()-DB.session.startTs)/60000):0;if(el)el.innerHTML=`<div class="timer-hero"><div class="phase">⏱ SESIÓN · ${elapsed} min de ~50</div><div class="sub" style="margin-top:4px">El cronómetro de descanso y de cada bloque aparece abajo, siempre visible 👇</div></div>`;}
function renderFloatTimer(){const ft=document.getElementById('floatTimer');if(!ft)return;if(T.phase==='idle'||!T.running&&T.sec===0){ft.classList.remove('on');ft.innerHTML='';return;}const m=Math.floor(T.sec/60),s=T.sec%60;ft.className='on'+(T.phase==='rest'?' rest':'');ft.innerHTML=`<div class="ft-inner"><div class="ft-clock" style="color:${T.phase==='rest'?'var(--acc2)':'var(--acc)'}">${m}:${String(s).padStart(2,'0')}</div><div class="ft-label">${T.phase==='rest'?'descanso':T.label||'en marcha'}</div>${T.running?`<button onclick="pauseT()">⏸</button>`:`<button onclick="resumeT()">▶</button>`}<button onclick="stopT()">✕</button></div>`;}
function tickRest(){T.sec--;if(T.sec<=0){beep(2);stopT();return;}renderFloatTimer();}
function restT(sec){if(DB.session){DB.session.restTarget+=sec;}T.phase='rest';T.sec=sec;T.label='descanso';T.running=true;if(T.id)clearInterval(T.id);T.id=setInterval(()=>{if(DB.session)DB.session.restAccum++;tickRest();},1000);renderFloatTimer();}
function startBlockTimer(bi){const meta=DB.session.blocks[bi]._meta;if(!meta)return;T.phase='format';T.label=meta.label;T.running=true;if(T.id)clearInterval(T.id);
  if(meta.timer==='up'){T.sec=0;T.id=setInterval(()=>{T.sec++;renderFloatTimer();renderBlockTimerInline(bi);},1000);}
  else{T.sec=meta.sec;T.id=setInterval(()=>{T.sec--;if(T.sec<=0){beep(3);stopT();renderBlockTimerInline(bi);return;}renderFloatTimer();renderBlockTimerInline(bi);},1000);}
  renderFloatTimer();renderBlockTimerInline(bi);}
function renderBlockTimerInline(bi){const el=document.getElementById('blockTimer_'+bi);if(!el)return;if(T.phase!=='format'){el.innerHTML='';return;}const m=Math.floor(T.sec/60),s=T.sec%60;el.innerHTML=`<div class="timer-hero go" style="margin-top:8px"><div class="phase">🔥 EN MARCHA</div><div class="clock">${m}:${String(s).padStart(2,'0')}</div><div class="timer-ctrl">${T.running?`<button class="btn2" onclick="pauseT()">Pausa</button>`:`<button class="btn-acc2" onclick="resumeT()">Seguir</button>`}<button class="btn2" onclick="stopT()">Parar</button></div></div>`;}
function pauseT(){T.running=false;clearInterval(T.id);renderFloatTimer();}
function resumeT(){if(T.phase==='idle')return;T.running=true;if(T.id)clearInterval(T.id);if(T.phase==='format'&&T.sec===0){T.id=setInterval(()=>{T.sec++;renderFloatTimer();},1000);}else{T.id=setInterval(()=>{if(T.phase==='rest'){if(DB.session)DB.session.restAccum++;tickRest();}else{T.sec--;if(T.sec<=0){beep(3);stopT();return;}renderFloatTimer();}},1000);}renderFloatTimer();}
function stopT(){clearInterval(T.id);T={running:false,phase:'idle',sec:0,id:null,elapsed:0,label:''};renderFloatTimer();document.querySelectorAll('[id^="blockTimer_"]').forEach(e=>e.innerHTML='');}
function resetT(){clearInterval(T.id);T={running:false,phase:'idle',sec:0,id:null,elapsed:0,label:''};const ft=document.getElementById('floatTimer');if(ft){ft.classList.remove('on');ft.innerHTML='';}}
function showFormatVideo(q,name){openModal(`<h3>🎬 ${name}</h3><p class="mini" style="margin-bottom:10px">Vídeos de cómo se hace este formato. Toca uno para verlo (necesita internet).</p><div id="fvResults"><p class="mini">Buscando…</p></div><a href="https://www.youtube.com/results?search_query=${encodeURIComponent(q)}" target="_blank" style="display:block;margin-top:10px"><button class="btn2" style="width:100%">🔎 Ver más en YouTube</button></a>`);loadFormatVideo(q);}
function loadFormatVideo(q){const map={'EMOM kettlebell swings workout':'YSxHifyI6s8','AMRAP kettlebell workout':'YSxHifyI6s8','kettlebell thruster ladder workout':'YSxHifyI6s8','100 kettlebell swings for time':'sSESeQAir2M','kettlebell clean and press tutorial':'axaCQqM0R1k','kettlebell complex workout':'axaCQqM0R1k','kettlebell swing goblet squat ladder':'sSESeQAir2M','farmer walk burpee finisher':'8GpQ66AAKU0','tabata kettlebell swings':'YSxHifyI6s8','30 second sprint intervals workout':'8GpQ66AAKU0'};const id=map[q]||'YSxHifyI6s8';const el=document.getElementById('fvResults');if(el)el.innerHTML=`<div class="video-wrap"><iframe src="https://www.youtube.com/embed/${id}?rel=0&playsinline=1" title="${q}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;}

/* ===================== PROGRESO ===================== */
function allExerciseNames(){const s=new Set();DB.routines.forEach(r=>r.blocks.forEach(b=>b.exercises.forEach(e=>s.add(e.name))));DB.sessions.forEach(x=>(x.blocks||[]).forEach(b=>b.exercises.forEach(e=>s.add(e.name))));return[...s];}
function exerciseHistory(name){const out=[];[...DB.sessions].reverse().forEach(s=>{let found=null;(s.blocks||[]).forEach(b=>{const e=b.exercises.find(x=>x.name===name);if(e)found=e;});if(found){let top=0,tr=0;(found.sets||[]).forEach(st=>{const k=+st.kg||0;if(k>=top){top=k;tr=+st.reps||0;}});out.push({date:s.date,topKg:top,topReps:tr});}});return out;}
function renderProgSelect(){const sel=document.getElementById('progSelect');sel.innerHTML=allExerciseNames().map(n=>`<option>${n}</option>`).join('');renderProgChart();}
function renderProgChart(){const name=document.getElementById('progSelect').value;const h=exerciseHistory(name);const el=document.getElementById('progChart'),st=document.getElementById('progStats');if(!h.length){el.innerHTML='<p class="empty">Sin datos. Entrena este ejercicio.</p>';st.innerHTML='';return;}const max=Math.max(...h.map(x=>x.topKg),1);el.innerHTML=`<div class="chart">${h.slice(-10).map(x=>`<div class="b" style="height:${x.topKg/max*100}%"><em>${x.topKg}</em><span>${x.date.slice(5)}</span></div>`).join('')}</div><div style="height:22px"></div>`;const f=h[0].topKg,l=h[h.length-1].topKg,d=(l-f).toFixed(1);st.innerHTML=`<div class="stat-grid"><div class="stat"><div class="v acc2">${l}</div><div class="l">último kg</div></div><div class="stat"><div class="v gold">${max}</div><div class="l">máximo</div></div><div class="stat"><div class="v" style="${d<0?'color:var(--bad)':'color:var(--acc)'}">${d>=0?'+':''}${d}</div><div class="l">desde inicio</div></div></div>`;}
function renderDensityChart(){const ds=[...DB.sessions].filter(s=>s.density!=null).reverse().slice(-12);const el=document.getElementById('densityChart');if(!ds.length){el.innerHTML='<p class="empty">Completa sesiones para ver tu Density Score.</p>';return;}const max=Math.max(...ds.map(s=>s.density),1);el.innerHTML=`<div class="chart">${ds.map(s=>`<div class="b" style="height:${s.density/max*100}%"><em>${s.density}</em><span>${s.date.slice(5)}</span></div>`).join('')}</div><div style="height:22px"></div>`;}
function renderPR(){const pr={};DB.sessions.forEach(s=>(s.blocks||[]).forEach(b=>b.exercises.forEach(e=>e.sets.forEach(st=>{const k=+st.kg||0;if(k>0&&(!pr[e.name]||k>pr[e.name].kg))pr[e.name]={kg:k,reps:st.reps};}))));const arr=Object.entries(pr).sort((a,b)=>b[1].kg-a[1].kg);document.getElementById('prList').innerHTML=arr.length?`<table style="width:100%;border-collapse:collapse;font-size:13px">${arr.map(([n,p])=>`<tr><td style="padding:6px;border-top:1px solid var(--line)">${n}</td><td style="padding:6px;border-top:1px solid var(--line);text-align:right"><b style="color:var(--gold)">${p.kg}kg</b></td><td style="padding:6px;border-top:1px solid var(--line);text-align:right;color:var(--dim)">${p.reps} reps</td></tr>`).join('')}</table>`:'<p class="empty">Sin récords aún.</p>';}
function renderHistory(){const el=document.getElementById('historyList');el.innerHTML=DB.sessions.length?DB.sessions.slice(0,20).map(s=>`<div class="log-item"><div class="d">${fd(s.date)} · ${s.duration||'?'} min · ⚡${s.density||'—'}</div><div class="t">${s.name} <span class="mini" style="font-family:Barlow">${s.athlete||''}</span></div><details><summary style="cursor:pointer;color:var(--acc2);font-size:12px">ver bloques</summary>${(s.blocks||[]).map(b=>`<div style="margin-top:4px;font-size:13px"><b style="font-family:Anton">${b.label||b.type}</b>${b.result?` · ${b.result}`:''}<br>${b.exercises.map(e=>`${e.name}: ${(e.sets||[]).map(st=>`${st.kg||0}×${st.reps||0}`).join(', ')}`).join('<br>')}</div>`).join('')}</details><button class="btn-sm btn2" style="margin-top:8px" onclick="delSession('${s.id}')">Eliminar</button></div>`).join(''):'<p class="empty">Sin sesiones aún.</p>';}
function delSession(id){DB.sessions=DB.sessions.filter(s=>s.id!==id);save();renderHistory();renderPR();renderProgChart();renderDensityChart();renderDashboard();}

/* ===================== RUTINAS (visual, con sustituciones) ===================== */
function renderRoutines(){const el=document.getElementById('routineList');if(!el)return;
  const isT=DB.mode==='travel';
  let head=`<div class="row" style="margin-bottom:12px"><button class="btn-sm ${!isT?'btn-acc2':'btn2'}" style="flex:1" onclick="setMode('gym')">🏋️ Gym</button><button class="btn-sm ${isT?'btn-acc2':'btn2'}" style="flex:1" onclick="setMode('travel')">✈️ Viaje</button></div>`;
  if(isT)head+=`<div class="note" style="margin-bottom:10px">Modo viaje: rutinas sin gimnasio con peso corporal, comba, bandas + barra y carrera. Ideal para vacaciones.</div>`;
  const list=DB.routines.map(r=>`<div class="ex-block"><div class="ex-head"><span class="nm">${r.name} <span class="split-tag">${r.day}</span></span><span><button class="btn-sm btn2" onclick="editRoutine('${r.id}')">✎</button> <button class="btn-sm btn2" onclick="changeDay('${r.id}')">📅</button> <button class="btn-sm btn2" onclick="startFlow('${r.id}')">▶</button></span></div>${r.blocks.map(b=>`<div class="mini" style="margin-top:4px"><b style="color:var(--acc)">${b.label.replace('Bloque','B').replace(' · ',': ')}</b> ${b.exercises.map(e=>e.name+(SUBS[e.name]?` <span style="color:var(--acc2);cursor:pointer" onclick="showSubs('${e.name.replace(/'/g,"")}')">⇄</span>`:'')).join(' · ')}</div>`).join('')}</div>`).join('');
  const box=`<div class="ex-block" style="border-color:var(--gold);margin-top:6px"><div class="ex-head"><span class="nm">🥊 BOXEO TÉCNICA <span class="split-tag" style="color:var(--gold)">guiado</span></span><button class="btn-sm btn-gold" onclick="startBoxSession()">▶ Empezar</button></div><div class="mini" style="margin-top:4px">5 rounds de 3 min con descanso de 1 min. Sombra, drills 1-2, combate imaginario y ráfagas, con vídeo y campana en cada round. Como tener un entrenador.</div></div>`;
  el.innerHTML=head+list+box;
}
function setMode(m){if(DB.mode===m){renderRoutines();return;}
  // guardar las rutinas actuales en su cajón antes de cambiar
  if(DB.mode==='travel')DB.travelRoutinesSaved=DB.routines;else DB.gymRoutinesSaved=DB.routines;
  DB.mode=m;
  if(m==='travel')DB.routines=DB.travelRoutinesSaved&&DB.travelRoutinesSaved.length?DB.travelRoutinesSaved:travelRoutines();
  else DB.routines=DB.gymRoutinesSaved&&DB.gymRoutinesSaved.length?DB.gymRoutinesSaved:buildRoutines(DB.cycle.rotIndex||0);
  save();renderRoutines();renderTodayReady();renderDashboard();toast(m==='travel'?'✈️ Modo viaje activado':'🏋️ Modo gym activado');}
function changeDay(rid){const r=DB.routines.find(x=>x.id===rid);if(!r)return;openModal(`<h3>Cambiar día de ${r.name}</h3><p class="mini" style="margin-bottom:10px">Elige el día que mejor te encaje. Si coincide con otra rutina, podrás tenerlas el mismo día sin problema.</p><label>Día</label><select id="cdDay">${DAYS.map(d=>`<option ${d===r.day?'selected':''}>${d}</option>`).join('')}</select><button class="btn" style="margin-top:14px" onclick="saveDay('${rid}')">Guardar</button>`);}
function saveDay(rid){const r=DB.routines.find(x=>x.id===rid);if(!r)return;r.day=document.getElementById('cdDay').value;save();closeModal();renderRoutines();renderTodayReady();renderDashboard();toast('📅 Día actualizado');}
function editRoutine(rid){const r=DB.routines.find(x=>x.id===rid);if(!r)return;window._editRid=rid;renderRoutineEditor();}
function renderRoutineEditor(){const r=DB.routines.find(x=>x.id===window._editRid);if(!r)return;
  let html=`<h3>✎ Editar ${r.name}</h3><label>Nombre</label><input id="erName" value="${r.name.replace(/"/g,'&quot;')}" oninput="saveRoutineName()">`;
  r.blocks.forEach((b,bi)=>{
    html+=`<div class="ex-block" style="margin-top:10px"><b style="font-family:Anton;color:var(--acc)">${b.label}</b>`;
    b.exercises.forEach((e,ei)=>{
      html+=`<div style="margin-top:8px;padding:8px;background:var(--bg);border-radius:8px"><input value="${e.name.replace(/"/g,'&quot;')}" oninput="editExField(${bi},${ei},'name',this.value)" style="font-size:13px;margin-bottom:5px" placeholder="Ejercicio"><div class="row"><div><label>Series</label><input type="number" value="${e.sets}" oninput="editExField(${bi},${ei},'sets',this.value)"></div><div><label>Reps</label><input value="${e.reps||''}" oninput="editExField(${bi},${ei},'reps',this.value)"></div><div><label>Kg</label><input type="number" value="${e.kg||0}" oninput="editExField(${bi},${ei},'kg',this.value)"></div></div><div class="row" style="margin-top:5px"><div><label>Desc (s)</label><input type="number" value="${e.rest||0}" oninput="editExField(${bi},${ei},'rest',this.value)"></div><div style="flex:0 0 auto;display:flex;align-items:flex-end"><button class="btn-sm btn2" onclick="delEx(${bi},${ei})" style="color:var(--bad)">🗑 quitar</button></div></div></div>`;
    });
    html+=`<button class="btn-sm btn2" style="margin-top:8px" onclick="addEx(${bi})">+ ejercicio a este bloque</button></div>`;
  });
  html+=`<button class="btn" style="margin-top:14px" onclick="closeModal();renderRoutines()">✓ Hecho</button>`;
  openModal(html);
}
function editExField(bi,ei,f,v){const r=DB.routines.find(x=>x.id===window._editRid);if(!r)return;const e=r.blocks[bi].exercises[ei];if(f==='sets'||f==='kg'||f==='rest')e[f]=+v||0;else e[f]=v;save();}
function addEx(bi){const r=DB.routines.find(x=>x.id===window._editRid);if(!r)return;r.blocks[bi].exercises.push({name:'Nuevo ejercicio',sets:3,reps:'10-12',kg:0,rest:60});save();renderRoutineEditor();}
function delEx(bi,ei){const r=DB.routines.find(x=>x.id===window._editRid);if(!r)return;r.blocks[bi].exercises.splice(ei,1);save();renderRoutineEditor();}
function saveRoutineName(){const r=DB.routines.find(x=>x.id===window._editRid);if(r){const v=document.getElementById('erName').value;if(v)r.name=v;save();}}
function showSubs(name){const subs=SUBS[name];if(!subs){toast('Sin sustituciones para este');return;}openModal(`<h3>⇄ Sustituciones</h3><p class="mini" style="margin-bottom:10px">Alternativas para <b>${name}</b> si el material está ocupado, hay molestia, o quieres variar:</p>${subs.map(s=>`<div class="sub-opt"><span>${s}</span><span class="mini">${s.includes('KB')?'kettlebell':s.includes('mancuerna')?'mancuerna':s.includes('máquina')?'máquina':'equivalente'}</span></div>`).join('')}<p class="mini" style="margin-top:8px">Durante la sesión, toca el nombre del ejercicio para cambiarlo en caliente.</p>`);}
function swapExercise(bi,ei){const ex=DB.session.blocks[bi].exercises[ei];const subs=SUBS[ex.name]||[];
  openModal(`<h3>⇄ Cambiar ejercicio</h3><p class="mini" style="margin-bottom:10px">¿Máquina ocupada o molestia? Cambia <b>${ex.name}</b> por una alternativa. Tus series ya anotadas se conservan.</p>${subs.length?subs.map(s=>`<div class="sub-opt" style="cursor:pointer" onclick="doSwap(${bi},${ei},'${s.replace(/'/g,"")}')"><span>${s}</span><span class="vgo" style="color:var(--acc2)">→</span></div>`).join(''):'<p class="empty">Sin alternativas predefinidas.</p>'}<hr><label>O escribe otro</label><input id="swapCustom" placeholder="Nombre del ejercicio"><button class="btn" style="margin-top:10px" onclick="doSwapCustom(${bi},${ei})">Cambiar</button>`);}
function doSwap(bi,ei,name){DB.session.blocks[bi].exercises[ei].name=name;save();closeModal();renderSessionBody();toast('⇄ Cambiado a '+name);}
function doSwapCustom(bi,ei){const v=document.getElementById('swapCustom').value.trim();if(!v){toast('Escribe un nombre');return;}doSwap(bi,ei,v);}

/* ===================== BOXEO GUIADO (rounds + vídeo + campana) ===================== */
let BX={round:0,phase:'idle',sec:0,id:null,running:false};
function startBoxSession(){BX={round:0,phase:'work',sec:BOX_SESSION.workSec,id:null,running:false};renderBoxSession();document.getElementById('boxSessionCard')&&document.getElementById('boxSessionCard').scrollIntoView({behavior:'smooth'});}
function showExVideo(id,name){openModal(`<h3>🎬 ${name}</h3><div class="video-wrap"><iframe src="https://www.youtube.com/embed/${id}?rel=0&playsinline=1" title="técnica" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><p class="mini" style="margin-top:10px">Vídeo de referencia para la técnica. Necesita conexión a internet.</p>`);}
function renderBoxSession(){
  let card=document.getElementById('boxSessionCard');
  if(!card){card=document.createElement('div');card.id='boxSessionCard';card.className='card';document.getElementById('train-rutinas').appendChild(card);}
  const r=BOX_SESSION.rounds[BX.round];const m=Math.floor(BX.sec/60),s=BX.sec%60;
  const isRest=BX.phase==='rest';
  card.innerHTML=`<h3>🥊 ${BOX_SESSION.name} <span class="tag gold">round ${BX.round+1}/${BOX_SESSION.rounds.length}</span></h3>
    <div class="timer-hero ${isRest?'rest':'go'}"><div class="phase">${isRest?'😮‍💨 DESCANSO':'🥊 '+r.label}</div><div class="clock">${m}:${String(s).padStart(2,'0')}</div><div class="sub">${isRest?'Recupera y respira':r.desc}</div>
    <div class="timer-ctrl">${BX.running?`<button class="btn2" onclick="bxPause()">Pausa</button>`:`<button class="btn-gold" onclick="bxStart()">${BX.sec<BOX_SESSION.workSec&&BX.round===0&&BX.phase==='work'?'Iniciar':'Seguir'}</button>`}<button class="btn2" onclick="bxSkip()">Sig ▶</button><button class="btn2" onclick="bxStop()">Salir</button></div></div>
    ${!isRest?`<div class="video-wrap"><iframe src="https://www.youtube.com/embed/${r.vid}?rel=0&playsinline=1" title="drill" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`:''}
    <div class="mini" style="margin-top:8px">Rounds: ${BOX_SESSION.rounds.map((x,i)=>`<span class="pill" style="${i===BX.round?'border-color:var(--gold);color:var(--gold)':''}">${i+1}. ${x.label.split('·')[0].trim()}</span>`).join('')}</div>`;
}
function bxTick(){BX.sec--;if(BX.sec<=0){beep(3);if(BX.phase==='work'){if(BX.round<BOX_SESSION.rounds.length-1){BX.phase='rest';BX.sec=BOX_SESSION.restSec;}else{bxFinish();return;}}else{BX.round++;BX.phase='work';BX.sec=BOX_SESSION.workSec;}}renderBoxSession();}
function bxStart(){BX.running=true;if(BX.id)clearInterval(BX.id);BX.id=setInterval(bxTick,1000);renderBoxSession();}
function bxPause(){BX.running=false;clearInterval(BX.id);renderBoxSession();}
function bxSkip(){beep(1);if(BX.phase==='work'){if(BX.round<BOX_SESSION.rounds.length-1){BX.phase='rest';BX.sec=BOX_SESSION.restSec;}else{bxFinish();return;}}else{BX.round++;BX.phase='work';BX.sec=BOX_SESSION.workSec;}renderBoxSession();}
function bxStop(){clearInterval(BX.id);BX={round:0,phase:'idle',sec:0,id:null,running:false};const c=document.getElementById('boxSessionCard');if(c)c.remove();}
function bxFinish(){clearInterval(BX.id);const d=today();DB.extraLog[d]=DB.extraLog[d]||{};DB.extraLog[d].box=true;save();renderExtra&&renderExtra();renderDashboard();const c=document.getElementById('boxSessionCard');if(c)c.remove();BX={round:0,phase:'idle',sec:0,id:null,running:false};toast('🥊 ¡Sesión de boxeo completa! Registrada.');}

/* ===================== CONTROL CORPORAL ===================== */
const MEAS=[{k:'peso',l:'Peso',u:'kg',down:true},{k:'cintura',l:'Cintura',u:'cm',down:true},{k:'cuello',l:'Cuello',u:'cm',down:true},{k:'cadera',l:'Cadera',u:'cm',down:true},{k:'pecho',l:'Pecho',u:'cm',down:false},{k:'brazo',l:'Brazo',u:'cm',down:false},{k:'muslo',l:'Muslo',u:'cm',down:false}];
function renderBody(){renderBodyAlert();renderBodyLatest();renderBodySelect();renderBodyPhotos();renderBodyHistory();}
function renderBodyAlert(){const el=document.getElementById('bodyAlert');const last=DB.body[0];if(!last){el.innerHTML='<div class="note">Aún sin mediciones. Haz la primera hoy para fijar tu punto de partida.</div>';return;}const d=daysBetween(last.date,today());const left=DB.bodyCfg.everyWeeks*7-d;if(left<=0)el.innerHTML=`<div class="note gold">🔔 Toca medición. ${d} días desde la última (${fd(last.date)}).</div>`;else el.innerHTML=`<p class="mini">Última: ${fd(last.date)}. Próxima en ${left} ${left===1?'día':'días'}.</p>`;}
function prevWith(idx,k){for(let i=idx+1;i<DB.body.length;i++){if(DB.body[i][k]!=null&&DB.body[i][k]!=='')return DB.body[i][k];}return null;}
function renderBodyLatest(){const el=document.getElementById('bodyLatest');const last=DB.body[0];if(!last){el.innerHTML='';return;}el.innerHTML='<div style="margin-top:10px">'+MEAS.filter(m=>last[m.k]!=null&&last[m.k]!=='').map(m=>{let dl='';const pv=prevWith(0,m.k);if(pv!=null){const diff=(last[m.k]-pv).toFixed(1);const good=m.down?diff<0:diff>0;dl=` <span class="delta" style="${good?'color:var(--ok)':diff==0?'color:var(--dim)':'color:var(--gold)'}">${diff>=0?'+':''}${diff}</span>`;}return `<span class="meas-tag">${m.l}: <b>${last[m.k]}${m.u}</b>${dl}</span>`;}).join('')+'</div>';}
function openMeasure(){const last=DB.body[0]||{};openModal(`<h3>Medición de hoy</h3><p class="mini" style="margin-bottom:10px">Teclea solo lo que midas hoy. El número gris es tu última medición (referencia). Lo que dejes vacío no se guarda y conserva su histórico.</p><div class="meas-grid">${MEAS.map(m=>`<div><label>${m.l} (${m.u})</label><input id="bm_${m.k}" type="number" inputmode="decimal" value="" placeholder="${last[m.k]!=null&&last[m.k]!==''?last[m.k]:m.u}"></div>`).join('')}</div><hr><label>Foto (opcional)</label><input id="bm_photo" type="file" accept="image/*" capture="environment" onchange="previewPhoto(this)"><img id="bm_preview" class="body-photo" style="display:none"><label style="margin-top:8px">Nota</label><input id="bm_note" placeholder="Cómo te ves/sientes"><button class="btn" style="margin-top:14px" onclick="saveMeasure()">Guardar medición</button>`);}
let _photoData='';
function previewPhoto(inp){const f=inp.files[0];if(!f)return;const rd=new FileReader();rd.onload=e=>{const img=new Image();img.onload=()=>{const cv=document.createElement('canvas');const mx=900;let w=img.width,h=img.height;if(w>h&&w>mx){h=h*mx/w;w=mx;}else if(h>mx){w=w*mx/h;h=mx;}cv.width=w;cv.height=h;cv.getContext('2d').drawImage(img,0,0,w,h);_photoData=cv.toDataURL('image/jpeg',0.7);const p=document.getElementById('bm_preview');p.src=_photoData;p.style.display='block';};img.src=e.target.result;};rd.readAsDataURL(f);}
function saveMeasure(){const exIdx=DB.body.findIndex(b=>b.date===today());const base=exIdx>=0?Object.assign({},DB.body[exIdx]):{date:today()};let entered=0;MEAS.forEach(m=>{const v=document.getElementById('bm_'+m.k).value;if(v!==''){base[m.k]=+v;entered++;}});const note=document.getElementById('bm_note').value;if(note)base.note=note;if(_photoData)base.photo=_photoData;if(entered===0&&!_photoData&&!note){toast('Teclea al menos un dato');return;}if(exIdx>=0)DB.body[exIdx]=base;else DB.body.unshift(base);DB.body.sort((a,b)=>b.date.localeCompare(a.date));if(base.peso)DB.profile.weight=base.peso;_photoData='';save();closeModal();renderBody();renderDashboard();toast('📏 Medición guardada');}
function renderBodySelect(){const sel=document.getElementById('bodySelect');sel.innerHTML=MEAS.map(m=>`<option value="${m.k}">${m.l} (${m.u})</option>`).join('');renderBodyChart();}
function renderBodyChart(){const k=document.getElementById('bodySelect').value;const m=MEAS.find(x=>x.k===k);const pts=[...DB.body].reverse().filter(b=>b[k]!=null&&b[k]!=='');const el=document.getElementById('bodyChart'),dl=document.getElementById('bodyDelta');if(pts.length<1){el.innerHTML='<p class="empty">Sin datos de esta métrica.</p>';dl.innerHTML='';return;}const vals=pts.map(p=>p[k]);const max=Math.max(...vals),min=Math.min(...vals);const range=max-min||1;el.innerHTML=`<div class="chart">${pts.slice(-10).map(p=>{const hp=20+((p[k]-min)/range)*80;return `<div class="b" style="height:${hp}%"><em>${p[k]}</em><span>${p.date.slice(5)}</span></div>`;}).join('')}</div><div style="height:22px"></div>`;const f=vals[0],l=vals[vals.length-1],diff=(l-f).toFixed(1);const good=m.down?diff<0:diff>0;dl.innerHTML=`<div class="stat-grid"><div class="stat"><div class="v acc2">${l}${m.u}</div><div class="l">actual</div></div><div class="stat"><div class="v">${f}${m.u}</div><div class="l">inicio</div></div><div class="stat"><div class="v" style="${good?'color:var(--ok)':diff==0?'':'color:var(--gold)'}">${diff>=0?'+':''}${diff}</div><div class="l">cambio</div></div></div>`;}
function renderBodyPhotos(){const ph=DB.body.filter(b=>b.photo);const el=document.getElementById('bodyPhotos');if(!ph.length){el.innerHTML='<p class="empty">Sin fotos. Añade una al medir para comparar.</p>';return;}if(ph.length===1){el.innerHTML=`<div style="text-align:center"><div class="mini">${fd(ph[0].date)}</div><img class="body-photo" src="${ph[0].photo}"></div>`;return;}el.innerHTML=`<div class="photo-pair"><div><div class="mini">Primera · ${fd(ph[ph.length-1].date)}</div><img src="${ph[ph.length-1].photo}"></div><div><div class="mini">Última · ${fd(ph[0].date)}</div><img src="${ph[0].photo}"></div></div>`;}
function renderBodyHistory(){const el=document.getElementById('bodyHistory');if(!DB.body.length){el.innerHTML='<p class="empty">Sin mediciones.</p>';return;}el.innerHTML=DB.body.map((b,i)=>`<div class="log-item"><div style="display:flex;justify-content:space-between"><span class="t" style="font-size:14px">${fd(b.date)}</span><button class="btn-sm btn2" onclick="delMeasure(${i})">🗑</button></div><div style="margin-top:4px">${MEAS.filter(m=>b[m.k]!=null&&b[m.k]!=='').map(m=>`<span class="meas-tag">${m.l}: <b>${b[m.k]}${m.u}</b></span>`).join('')}</div>${b.note?`<div class="mini" style="margin-top:4px">📝 ${b.note}</div>`:''}</div>`).join('');}
function delMeasure(i){DB.body.splice(i,1);save();renderBody();renderDashboard();}

/* ===================== EXTRA (boxeo/carrera tic) ===================== */
function renderExtra(){const d=today();const e=DB.extraLog[d]||{};const bx=document.getElementById('boxTic'),rn=document.getElementById('runTic');if(bx){bx.classList.toggle('done',!!e.box);document.getElementById('boxTicTxt').textContent=e.box?`✓ Boxeo${e.boxMin?' · '+e.boxMin+' min':''}`:'Hice boxeo hoy';}if(rn){rn.classList.toggle('done',!!e.run);document.getElementById('runTicTxt').textContent=e.run?`✓ Carrera${e.runMin?' · '+e.runMin+' min':''}`:'Hice carrera hoy';}}
function toggleExtra(k){const d=today();DB.extraLog[d]=DB.extraLog[d]||{};
  if(DB.extraLog[d][k]){DB.extraLog[d][k]=false;delete DB.extraLog[d][k+'Min'];delete DB.extraLog[d][k+'Int'];save();renderExtra();renderDashboard();toast('Quitado');return;}
  const isBox=k==='box';
  openModal(`<h3>${isBox?'🥊 Boxeo':'🏃 Carrera'} de hoy</h3><p class="mini" style="margin-bottom:10px">Opcional: añade duración e intensidad para afinar tu Fat Loss Score. O guarda directo.</p><div class="row"><div><label>Minutos</label><input id="exMin" type="number" inputmode="numeric" placeholder="${isBox?'30':'45'}"></div><div><label>Intensidad</label><select id="exInt"><option>Suave</option><option selected>Media</option><option>Alta</option></select></div></div><button class="btn" style="margin-top:14px" onclick="confirmExtra('${k}')">Guardar</button>`);}
function confirmExtra(k){const d=today();DB.extraLog[d]=DB.extraLog[d]||{};DB.extraLog[d][k]=true;const min=+document.getElementById('exMin').value;const int=document.getElementById('exInt').value;if(min)DB.extraLog[d][k+'Min']=min;DB.extraLog[d][k+'Int']=int;save();closeModal();renderExtra();renderDashboard();toast((k==='box'?'🥊 Boxeo':'🏃 Carrera')+' registrado');}

/* ===================== COMIDA / NUTRICIÓN ===================== */
/* Base de alimentos por RACIÓN. kcal y proteína (p) aproximados por ración típica. cat=categoría. */
const FOOD_BANK=[
  // PROTEÍNAS
  {n:'Pollo a la plancha',ic:'🍗',r:'1 pechuga (150g)',kcal:248,p:46,cat:'Proteína'},
  {n:'Pavo plancha',ic:'🍖',r:'1 filete (150g)',kcal:150,p:30,cat:'Proteína'},
  {n:'Ternera magra',ic:'🥩',r:'1 filete (150g)',kcal:250,p:36,cat:'Proteína'},
  {n:'Cerdo (lomo)',ic:'🥩',r:'1 filete (150g)',kcal:215,p:34,cat:'Proteína'},
  {n:'Conejo',ic:'🍖',r:'1 ración (150g)',kcal:200,p:33,cat:'Proteína'},
  {n:'Huevos',ic:'🥚',r:'2 unidades',kcal:144,p:13,cat:'Proteína'},
  {n:'Claras de huevo',ic:'🥚',r:'1 vaso (6)',kcal:102,p:21,cat:'Proteína'},
  {n:'Salmón',ic:'🐟',r:'1 filete (150g)',kcal:280,p:40,cat:'Proteína'},
  {n:'Merluza',ic:'🐟',r:'1 filete (150g)',kcal:135,p:31,cat:'Proteína'},
  {n:'Lubina/dorada',ic:'🐟',r:'1 pieza',kcal:200,p:35,cat:'Proteína'},
  {n:'Atún natural',ic:'🐟',r:'1 lata',kcal:116,p:26,cat:'Proteína'},
  {n:'Atún en aceite',ic:'🐟',r:'1 lata escurrida',kcal:190,p:25,cat:'Proteína'},
  {n:'Gambas/langostinos',ic:'🦐',r:'1 ración (150g)',kcal:150,p:30,cat:'Proteína'},
  {n:'Mejillones',ic:'🦪',r:'1 ración',kcal:170,p:24,cat:'Proteína'},
  {n:'Sepia/calamar',ic:'🦑',r:'1 ración (150g)',kcal:140,p:25,cat:'Proteína'},
  {n:'Jamón serrano',ic:'🥓',r:'3 lonchas',kcal:120,p:18,cat:'Proteína'},
  {n:'Jamón cocido/pavo',ic:'🥪',r:'3 lonchas',kcal:90,p:15,cat:'Proteína'},
  {n:'Lomo embuchado',ic:'🥓',r:'4 lonchas',kcal:110,p:18,cat:'Proteína'},
  {n:'Tofu',ic:'🧈',r:'1 ración (150g)',kcal:175,p:17,cat:'Proteína'},
  // LÁCTEOS
  {n:'Yogur proteico',ic:'🥛',r:'1 unidad',kcal:90,p:15,cat:'Lácteos'},
  {n:'Yogur natural',ic:'🥛',r:'1 unidad',kcal:60,p:5,cat:'Lácteos'},
  {n:'Queso fresco batido',ic:'🥛',r:'1 tarrina',kcal:120,p:18,cat:'Lácteos'},
  {n:'Requesón/cottage',ic:'🧀',r:'1 ración (150g)',kcal:130,p:18,cat:'Lácteos'},
  {n:'Queso curado',ic:'🧀',r:'2 lonchas',kcal:160,p:10,cat:'Lácteos'},
  {n:'Leche',ic:'🥛',r:'1 vaso',kcal:120,p:8,cat:'Lácteos'},
  {n:'Batido de proteína',ic:'🥤',r:'1 cazo',kcal:120,p:24,cat:'Lácteos'},
  // CARBOHIDRATOS
  {n:'Arroz cocido',ic:'🍚',r:'1 plato',kcal:200,p:4,cat:'Carbohidrato'},
  {n:'Pasta cocida',ic:'🍝',r:'1 plato',kcal:220,p:8,cat:'Carbohidrato'},
  {n:'Patata cocida/asada',ic:'🥔',r:'1 mediana',kcal:130,p:3,cat:'Carbohidrato'},
  {n:'Pan integral',ic:'🍞',r:'2 rebanadas',kcal:160,p:6,cat:'Carbohidrato'},
  {n:'Pan blanco',ic:'🍞',r:'2 rebanadas',kcal:180,p:5,cat:'Carbohidrato'},
  {n:'Avena',ic:'🥣',r:'1 taza (40g)',kcal:150,p:5,cat:'Carbohidrato'},
  {n:'Legumbres cocidas',ic:'🫘',r:'1 plato',kcal:230,p:15,cat:'Carbohidrato'},
  {n:'Quinoa cocida',ic:'🥣',r:'1 plato',kcal:220,p:8,cat:'Carbohidrato'},
  {n:'Cuscús',ic:'🍚',r:'1 plato',kcal:200,p:6,cat:'Carbohidrato'},
  {n:'Tortitas de maíz/arroz',ic:'🥯',r:'3 unidades',kcal:90,p:2,cat:'Carbohidrato'},
  // VERDURAS
  {n:'Ensalada variada',ic:'🥗',r:'1 bol',kcal:60,p:2,cat:'Verdura'},
  {n:'Verdura salteada',ic:'🥦',r:'1 plato',kcal:80,p:4,cat:'Verdura'},
  {n:'Brócoli',ic:'🥦',r:'1 plato',kcal:55,p:4,cat:'Verdura'},
  {n:'Espárragos',ic:'🌿',r:'1 manojo',kcal:40,p:3,cat:'Verdura'},
  {n:'Pisto/verduras al horno',ic:'🍆',r:'1 plato',kcal:120,p:3,cat:'Verdura'},
  {n:'Gazpacho',ic:'🍅',r:'1 vaso',kcal:90,p:2,cat:'Verdura'},
  {n:'Crema de verduras',ic:'🥣',r:'1 plato',kcal:110,p:4,cat:'Verdura'},
  {n:'Champiñones plancha',ic:'🍄',r:'1 plato',kcal:50,p:4,cat:'Verdura'},
  // GRASAS
  {n:'Aceite de oliva',ic:'🫒',r:'1 cucharada',kcal:120,p:0,cat:'Grasa'},
  {n:'Aguacate',ic:'🥑',r:'1/2 unidad',kcal:160,p:2,cat:'Grasa'},
  {n:'Almendras/nueces',ic:'🥜',r:'1 puñado',kcal:160,p:6,cat:'Grasa'},
  {n:'Aceitunas',ic:'🫒',r:'1 puñado',kcal:80,p:1,cat:'Grasa'},
  {n:'Crema de cacahuete',ic:'🥜',r:'1 cucharada',kcal:100,p:4,cat:'Grasa'},
  // FRUTA
  {n:'Fruta (manzana/pera...)',ic:'🍎',r:'1 pieza',kcal:80,p:1,cat:'Fruta'},
  {n:'Plátano',ic:'🍌',r:'1 unidad',kcal:105,p:1,cat:'Fruta'},
  {n:'Frutos rojos',ic:'🫐',r:'1 bol',kcal:60,p:1,cat:'Fruta'},
  {n:'Naranja',ic:'🍊',r:'1 unidad',kcal:62,p:1,cat:'Fruta'},
  {n:'Melón/sandía',ic:'🍉',r:'1 tajada',kcal:50,p:1,cat:'Fruta'},
  {n:'Uvas',ic:'🍇',r:'1 puñado',kcal:70,p:1,cat:'Fruta'},
  // DESAYUNO/DULCE
  {n:'Tostada con tomate y aceite',ic:'🍞',r:'1 tostada',kcal:150,p:4,cat:'Desayuno'},
  {n:'Café con leche',ic:'☕',r:'1 taza',kcal:60,p:4,cat:'Desayuno'},
  {n:'Miel/mermelada',ic:'🍯',r:'1 cucharada',kcal:60,p:0,cat:'Desayuno'},
  {n:'Chocolate negro',ic:'🍫',r:'2 onzas',kcal:110,p:2,cat:'Capricho'},
  {n:'Galletas',ic:'🍪',r:'3 unidades',kcal:150,p:2,cat:'Capricho'},
  {n:'Tortita/crepe',ic:'🥞',r:'1 unidad',kcal:130,p:4,cat:'Capricho'},
  // CAPRICHOS (se come de todo)
  {n:'Pizza',ic:'🍕',r:'2 porciones',kcal:570,p:24,cat:'Capricho'},
  {n:'Hamburguesa',ic:'🍔',r:'1 unidad',kcal:550,p:30,cat:'Capricho'},
  {n:'Patatas fritas',ic:'🍟',r:'1 ración',kcal:380,p:5,cat:'Capricho'},
  {n:'Cerveza',ic:'🍺',r:'1 caña',kcal:90,p:1,cat:'Capricho'},
  {n:'Copa de vino',ic:'🍷',r:'1 copa',kcal:120,p:0,cat:'Capricho'},
  {n:'Helado',ic:'🍨',r:'1 bola',kcal:140,p:3,cat:'Capricho'},
  {n:'Bocadillo de calamares',ic:'🥖',r:'1 unidad',kcal:480,p:22,cat:'Capricho'},
  {n:'Croquetas',ic:'🍤',r:'4 unidades',kcal:280,p:10,cat:'Capricho'},
  {n:'Tortilla de patata',ic:'🍳',r:'1 porción',kcal:250,p:9,cat:'Capricho'},
  {n:'Paella',ic:'🥘',r:'1 plato',kcal:420,p:18,cat:'Capricho'},
  {n:'Refresco',ic:'🥤',r:'1 lata',kcal:140,p:0,cat:'Capricho'}
];
const FOOD_CATS=['Proteína','Carbohidrato','Verdura','Lácteos','Grasa','Fruta','Desayuno','Capricho'];
let _foodCat='Proteína';
function foodKey(){return today();}
function calcFoodGoals(){
  const p=DB.profile;const w=(DB.body[0]&&DB.body[0].peso)||p.weight;
  const act=DB.foodActivity||1.5;const defc=DB.foodDeficit||450;
  const tmb=10*w+6.25*p.height-5*p.age+5;
  const kcal=Math.round(tmb*act-defc);
  const prot=Math.round(w*(DB.foodProtPerKg||1.8));
  return {kcal,prot};
}
function foodGoals(){return DB.foodGoals||calcFoodGoals();}
function foodTab(t,el){['hoy','menus','desayunos','recetas','compra'].forEach(x=>{const e=document.getElementById('food-'+x);if(e)e.style.display='none';});document.getElementById('food-'+t).style.display='block';el.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('on'));el.classList.add('on');if(t==='hoy'){renderFoodTarget();renderFoodBank();renderFoodLog();renderCheat();renderFoodTip();}if(t==='menus')renderMenus();if(t==='desayunos')renderQuick();if(t==='recetas')renderRecipes();if(t==='compra')renderShopping();}
function renderFood(){if(!DB.foodSetup){renderFoodSetup();return;}renderFoodTarget();renderFoodBank();renderFoodLog();renderCheat();renderFoodTip();}
/* ----- onboarding 4 toques ----- */
function renderFoodSetup(){const el=document.getElementById('foodTarget');if(!el)return;el.innerHTML=`<div class="note">Vamos a configurar tu nutrición en unos toques. Calcularé tus calorías y proteína para perder grasa sin perder músculo.</div><button class="btn" style="margin-top:10px" onclick="openFoodSetup()">⚙️ Configurar mi nutrición</button>`;}
function openFoodSetup(){openModal(`<h3>⚙️ Configura tu nutrición</h3><p class="mini" style="margin-bottom:10px">Base científica: déficit moderado + proteína alta + fuerza. Comes de todo, sin prohibiciones.</p>
  <label>¿Cuánto te mueves al día (fuera de entrenar)?</label><select id="fsAct"><option value="1.375">Poco (trabajo sentado)</option><option value="1.5" selected>Moderado (algo de movimiento)</option><option value="1.65">Activo (mucho de pie/andando)</option></select>
  <label style="margin-top:8px">Ritmo de pérdida</label><select id="fsDef"><option value="300">Suave (~0,3 kg/sem)</option><option value="450" selected>Moderado (~0,5 kg/sem)</option><option value="600">Rápido (~0,7 kg/sem)</option></select>
  <label style="margin-top:8px">Proteína (g por kg de peso)</label><select id="fsProt"><option value="1.6">1,6 (suficiente)</option><option value="1.8" selected>1,8 (recomendado)</option><option value="2.2">2,2 (máximo)</option></select>
  <div class="note" style="margin-top:10px">Un déficit moderado es lo más sostenible: evita fatiga, pérdida de músculo y efecto rebote.</div>
  <button class="btn" style="margin-top:14px" onclick="saveFoodSetup()">Calcular mi objetivo</button>`);}
function saveFoodSetup(){DB.foodActivity=+document.getElementById('fsAct').value;DB.foodDeficit=+document.getElementById('fsDef').value;DB.foodProtPerKg=+document.getElementById('fsProt').value;DB.foodGoals=null;DB.foodSetup=true;save();closeModal();renderFood();const g=foodGoals();toast(`🎯 Objetivo: ${g.kcal} kcal · ${g.prot}g proteína`);}
function dayFood(){return DB.foodLog[foodKey()]||[];}
function dayTotals(){const items=dayFood();return items.reduce((a,i)=>({kcal:a.kcal+i.kcal*i.q,p:a.p+i.p*i.q}),{kcal:0,p:0});}
function renderFoodTarget(){const el=document.getElementById('foodTarget');if(!el)return;if(!DB.foodSetup){renderFoodSetup();return;}const g=foodGoals();const t=dayTotals();
  const kpct=Math.min(100,Math.round(t.kcal/g.kcal*100));const ppct=Math.min(100,Math.round(t.p/g.prot*100));
  const kleft=Math.max(0,g.kcal-Math.round(t.kcal));
  el.innerHTML=`<div class="stat-grid c2"><div class="stat"><div class="v acc">${Math.round(t.kcal)}</div><div class="l">de ${g.kcal} kcal</div></div><div class="stat"><div class="v acc2">${Math.round(t.p)}</div><div class="l">de ${g.prot}g proteína</div></div></div>
  <div class="bar" style="margin-top:10px"><i style="width:${kpct}%;background:var(--acc)"></i></div><div class="mini" style="margin-top:3px">Calorías ${kpct}% · te quedan ${kleft} kcal</div>
  <div class="bar" style="margin-top:8px"><i style="width:${ppct}%;background:var(--acc2)"></i></div><div class="mini" style="margin-top:3px">Proteína ${ppct}% ${t.p<g.prot*0.7?'· prioriza proteína':''}</div>
  <button class="btn2" style="margin-top:10px" onclick="openFoodSetup()">Ajustar objetivo</button>`;}
function renderFoodBank(){const el=document.getElementById('foodBank');if(!el)return;
  const cats=`<div class="tabs" style="margin-bottom:10px">${FOOD_CATS.map(c=>`<button class="${c===_foodCat?'on':''}" onclick="setFoodCat('${c}')">${c}</button>`).join('')}</div>`;
  const all=allFoods();const list=all.map((f,i)=>({f,i})).filter(o=>o.f.cat===_foodCat);
  el.innerHTML=cats+list.map(o=>`<div class="sub-opt" style="cursor:pointer" onclick="addFood(${o.i})"><span>${o.f.ic||'🍽️'} ${o.f.n} <span class="mini">· ${o.f.r} · ${o.f.kcal}kcal P${o.f.p}</span></span><span class="vgo" style="color:var(--acc2)">+</span></div>`).join('');}
function setFoodCat(c){_foodCat=c;renderFoodBank();}
function allFoods(){return FOOD_BANK.concat(DB.customFoods||[]);}
function addFood(i){const f=allFoods()[i];const meal=document.getElementById('foodMeal').value;const k=foodKey();DB.foodLog[k]=DB.foodLog[k]||[];const ex=DB.foodLog[k].find(x=>x.n===f.n&&x.meal===meal);if(ex)ex.q++;else DB.foodLog[k].push({n:f.n,ic:f.ic,r:f.r,kcal:f.kcal,p:f.p,meal,q:1});save();renderFoodTarget();renderFoodLog();renderDashboard();toast('🍽️ +1 '+f.n);}
function openCustomFood(){openModal(`<h3>+ Alimento propio</h3><label>Nombre</label><input id="cfN" placeholder="Ej. Tortilla de patata"><label style="margin-top:8px">Ración (descripción)</label><input id="cfR" placeholder="1 porción"><div class="row" style="margin-top:8px"><div><label>kcal</label><input id="cfK" type="number"></div><div><label>Proteína g</label><input id="cfP" type="number"></div></div><label style="display:flex;align-items:center;gap:8px;margin-top:10px;text-transform:none;font-size:14px"><input type="checkbox" id="cfSave" checked style="width:18px;height:18px"> Guardar en mi lista</label><button class="btn" style="margin-top:14px" onclick="saveCustomFood()">Añadir</button>`);}
function saveCustomFood(){const f={n:document.getElementById('cfN').value||'Alimento',ic:'🍽️',r:document.getElementById('cfR').value||'1 ración',kcal:+document.getElementById('cfK').value||0,p:+document.getElementById('cfP').value||0,cat:_foodCat};if(document.getElementById('cfSave').checked){DB.customFoods=DB.customFoods||[];DB.customFoods.push(f);}const meal=document.getElementById('foodMeal').value;const k=foodKey();DB.foodLog[k]=DB.foodLog[k]||[];DB.foodLog[k].push({...f,meal,q:1});save();closeModal();renderFood();renderDashboard();toast('🍽️ Añadido');}
function renderFoodLog(){const el=document.getElementById('foodLog');if(!el)return;const items=dayFood();if(!items.length){el.innerHTML='<p class="empty">Aún no has registrado nada hoy.</p>';return;}const meals=['Desayuno','Comida','Merienda','Cena','Snack'];el.innerHTML=meals.filter(m=>items.some(i=>i.meal===m)).map(m=>{const its=items.map((it,idx)=>({...it,idx})).filter(i=>i.meal===m);const sub=its.reduce((a,i)=>a+i.kcal*i.q,0);return `<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between"><b style="font-family:Anton">${m}</b><span class="mini">${Math.round(sub)} kcal</span></div>${its.map(i=>`<div class="sub-opt"><span>${i.ic||'🍽️'} ${i.n}${i.q>1?' ×'+i.q:''} <span class="mini">· ${i.r}</span></span><span style="display:flex;gap:8px;align-items:center"><span class="mini">${Math.round(i.kcal*i.q)}kcal</span><button class="btn-sm btn2" onclick="decFood(${i.idx})" style="padding:4px 9px">−</button></span></div>`).join('')}</div>`;}).join('');}
function decFood(idx){const k=foodKey();const it=DB.foodLog[k][idx];if(!it)return;it.q--;if(it.q<=0)DB.foodLog[k].splice(idx,1);save();renderFoodTarget();renderFoodLog();renderDashboard();}
/* ----- consejos rotativos ----- */
const FOOD_TIPS=[
  'Prioriza proteína en cada comida: protege el músculo mientras pierdes grasa.',
  'Llena medio plato de verdura en comida y cena: sacia con pocas calorías.',
  'Bebe agua antes de comer: ayuda a controlar el hambre.',
  'No hay alimentos prohibidos. Lo que cuenta es el conjunto de la semana.',
  'Un déficit moderado es más sostenible que pasar hambre. Sin prisa.',
  'La báscula sube y baja por agua. Mira la tendencia de 2-3 semanas, no el día.',
  'Cambia un hábito por semana, no todos de golpe. Se consolida mejor.',
  'Proteína en el desayuno (huevos, yogur, fiambre) y llegarás con menos hambre a la comida.',
  'Si vas a un evento, come algo de proteína antes: llegarás menos voraz.',
  'El alcohol suma calorías rápido. Disfrútalo con cabeza los findes.'
];
function renderFoodTip(){const el=document.getElementById('foodTip');if(!el)return;el.innerHTML=`<div class="note">💡 ${FOOD_TIPS[new Date().getDate()%FOOD_TIPS.length]}</div>`;}
/* ----- comida trampa ----- */
function renderCheat(){const el=document.getElementById('cheatInfo');if(!el)return;const wk=weekDates();const n=wk.filter(d=>DB.cheatLog[d]).length;const todayC=DB.cheatLog[today()];el.innerHTML=`${todayC?'<div class="note gold">🍔 Comida trampa registrada hoy. Disfrútala, mañana a seguir.</div>':''}<p class="mini" style="margin-top:6px">Esta semana: ${n} ${n===1?'comida trampa':'comidas trampa'}. ${n>=3?'⚠️ Van bastantes; 1-2 por semana encaja mejor.':'Bien encajado: 1-2/semana es perfecto.'}</p><p class="mini" style="margin-top:6px">Truco: el día de trampa, mantén la proteína alta y disfruta el capricho sin culpa. Una comida no decide nada; la semana entera sí.</p>`;}
function logCheat(){const d=today();DB.cheatLog[d]=!DB.cheatLog[d];save();renderCheat();renderDashboard();toast(DB.cheatLog[d]?'🍔 Comida trampa registrada. Sin culpa.':'Quitada');}

/* ===== MENÚS semanales (2 semanas rotativas, mediterráneo) ===== */
const WEEK_MENUS=[
 {sem:'Semana A',dias:[
  {d:'Lunes',meals:[['Desayuno','Tostadas con tomate, aceite y pavo + café',300,18],['Comida','Pollo a la plancha + arroz + ensalada',590,66],['Merienda','Yogur proteico + puñado de almendras',250,21],['Cena','Merluza al horno + verduras salteadas',230,35]]},
  {d:'Martes',meals:[['Desayuno','Avena con leche, plátano y canela',350,14],['Comida','Lentejas con verduras + un huevo',520,28],['Merienda','Queso batido + fruta',200,19],['Cena','Tortilla francesa (3 huevos) + ensalada',290,22]]},
  {d:'Miércoles',meals:[['Desayuno','Yogur proteico + frutos rojos + nueces',310,21],['Comida','Salmón + patata cocida + espárragos',520,46],['Merienda','Tostada integral + aguacate',310,8],['Cena','Pollo al horno + pisto',380,42]]},
  {d:'Jueves',meals:[['Desayuno','Tostadas con tomate y aceite + café con leche',270,9],['Comida','Ternera magra + arroz + ensalada',560,55],['Merienda','Batido de proteína + plátano',225,25],['Cena','Sepia a la plancha + ensalada',250,28]]},
  {d:'Viernes',meals:[['Desayuno','Huevos revueltos + pan integral',304,19],['Comida','Paella (ración moderada) + ensalada',480,26],['Merienda','Yogur proteico + fruta',170,16],['Cena','Crema de verduras + gambas',300,32]]},
  {d:'Sábado',meals:[['Desayuno','Tortitas de avena con miel + café',380,16],['Comida','Libre / social: disfruta con cabeza',700,30],['Merienda','Fruta + almendras',240,7],['Cena','Pollo plancha + verduras al horno',380,42]]},
  {d:'Domingo',meals:[['Desayuno','Yogur proteico + avena + fruta',330,20],['Comida','Conejo al horno + patatas + ensalada',560,40],['Merienda','Tostada + pavo',200,15],['Cena','Crema de calabacín + tortilla francesa',320,20]]}
 ]},
 {sem:'Semana B',dias:[
  {d:'Lunes',meals:[['Desayuno','Yogur proteico + frutos rojos + avena',330,20],['Comida','Pollo al curry suave + arroz + verdura',590,55],['Merienda','Queso batido + almendras',280,24],['Cena','Merluza + ensalada grande',250,33]]},
  {d:'Martes',meals:[['Desayuno','Tostada con aguacate y huevo',320,15],['Comida','Garbanzos con espinacas + un huevo',520,24],['Merienda','Yogur proteico + fruta',170,16],['Cena','Lubina al horno + verduras',330,38]]},
  {d:'Miércoles',meals:[['Desayuno','Avena con leche, manzana y canela',340,13],['Comida','Pavo plancha + quinoa + ensalada',520,48],['Merienda','Batido de proteína',120,24],['Cena','Revuelto de gambas y espárragos',280,30]]},
  {d:'Jueves',meals:[['Desayuno','Tostadas con tomate, aceite y jamón',330,20],['Comida','Salmón + patata + ensalada',550,46],['Merienda','Fruta + nueces',200,5],['Cena','Pollo plancha + pisto',380,42]]},
  {d:'Viernes',meals:[['Desayuno','Tortitas de avena + plátano',360,15],['Comida','Arroz con sepia y verduras',490,30],['Merienda','Yogur proteico + almendras',250,21],['Cena','Tortilla de champiñones + ensalada',290,20]]},
  {d:'Sábado',meals:[['Desayuno','Huevos + pan + café',304,19],['Comida','Libre / social: disfruta con cabeza',700,30],['Merienda','Fruta',80,1],['Cena','Crema de verduras + merluza',300,33]]},
  {d:'Domingo',meals:[['Desayuno','Yogur proteico + avena + frutos rojos',330,21],['Comida','Ternera + patata asada + ensalada',580,52],['Merienda','Tostada + pavo',200,15],['Cena','Gazpacho + tortilla francesa',290,16]]}
 ]}
];
let _menuSem=0;
function renderMenus(){const el=document.getElementById('menuList');if(!el)return;const m=WEEK_MENUS[_menuSem];
  const sw=`<div class="tabs" style="margin-bottom:10px">${WEEK_MENUS.map((x,i)=>`<button class="${i===_menuSem?'on':''}" onclick="setMenuSem(${i})">${x.sem}</button>`).join('')}</div>`;
  el.innerHTML=sw+m.dias.map((dia,di)=>{const tk=dia.meals.reduce((a,x)=>a+x[2],0),tp=dia.meals.reduce((a,x)=>a+x[3],0);return `<div class="ex-block"><div class="ex-head"><span class="nm">${dia.d}</span><span class="mini">${tk} kcal · P${tp}</span></div>${dia.meals.map(x=>`<div class="mini" style="margin-top:3px"><b style="color:var(--acc)">${x[0]}:</b> ${x[1]}</div>`).join('')}<button class="btn-sm btn-acc2" style="margin-top:8px" onclick="loadDayMenu(${_menuSem},${di})">Registrar este día</button></div>`;}).join('');}
function setMenuSem(i){_menuSem=i;renderMenus();}
function loadDayMenu(si,di){const dia=WEEK_MENUS[si].dias[di];const k=foodKey();DB.foodLog[k]=DB.foodLog[k]||[];dia.meals.forEach(x=>{DB.foodLog[k].push({n:x[1],ic:'🍽️',r:'1 menú',kcal:x[2],p:x[3],meal:x[0],q:1});});save();renderDashboard();toast('📅 '+dia.d+' registrado');foodTab('hoy',document.querySelector('#v-food .tabs button'));}

/* ===== DESAYUNOS y MERIENDAS ===== */
const QUICK={
 Desayunos:[
  {n:'Tostadas con tomate, aceite y jamón',kcal:330,p:20},
  {n:'Huevos revueltos + pan integral',kcal:304,p:19},
  {n:'Avena con leche, plátano y canela',kcal:350,p:14},
  {n:'Yogur proteico + frutos rojos + nueces',kcal:310,p:21},
  {n:'Tortitas de avena con miel',kcal:360,p:15},
  {n:'Tostada con aguacate y huevo',kcal:320,p:15},
  {n:'Batido: leche, avena, plátano y proteína',kcal:380,p:32},
  {n:'Requesón con miel y nueces',kcal:300,p:22},
  {n:'Café con leche + tostada con pavo',kcal:260,p:16},
  {n:'Bol de yogur, fruta y granola',kcal:340,p:16}
 ],
 Meriendas:[
  {n:'Yogur proteico + puñado de almendras',kcal:250,p:21},
  {n:'Queso batido + fruta',kcal:200,p:19},
  {n:'Batido de proteína + plátano',kcal:225,p:25},
  {n:'Tostada integral + aguacate',kcal:310,p:8},
  {n:'Fruta + puñado de nueces',kcal:200,p:5},
  {n:'Tortitas de arroz + pavo',kcal:180,p:15},
  {n:'Requesón con frutos rojos',kcal:170,p:18},
  {n:'Onzas de chocolate negro + nueces',kcal:220,p:6},
  {n:'Zanahoria/pepino + hummus',kcal:180,p:6},
  {n:'Café + tostada con tomate y aceite',kcal:210,p:5}
 ]
};
function renderQuick(){const el=document.getElementById('quickList');if(!el)return;el.innerHTML=Object.entries(QUICK).map(([cat,arr])=>`<div style="margin-bottom:14px"><b style="font-family:Anton;font-size:15px;color:var(--acc)">${cat}</b>${arr.map((q,i)=>`<div class="sub-opt" style="cursor:pointer" onclick="logQuick('${cat}',${i})"><span>${q.n} <span class="mini">· ${q.kcal}kcal P${q.p}</span></span><span class="vgo" style="color:var(--acc2)">+</span></div>`).join('')}</div>`).join('');}
function logQuick(cat,i){const q=QUICK[cat][i];const meal=cat==='Desayunos'?'Desayuno':'Merienda';const k=foodKey();DB.foodLog[k]=DB.foodLog[k]||[];DB.foodLog[k].push({n:q.n,ic:cat==='Desayunos'?'🥣':'🍎',r:'1 ración',kcal:q.kcal,p:q.p,meal,q:1});save();renderDashboard();toast('🍽️ '+q.n+' añadido');}

/* ===== RECETAS familiares (para 4) ===== */
const RECIPES=[
  {n:'Pollo a la plancha con verduras',tipo:'Comida',kcal:430,p:52,ing:['600g pollo','2 calabacines','2 pimientos','1 cebolla','aceite de oliva'],pasos:'Saltea la verdura con poco aceite y haz el pollo a la plancha. Niños: añade arroz o patata.'},
  {n:'Merluza al horno con brócoli',tipo:'Cena',kcal:340,p:44,ing:['4 lomos merluza','1 brócoli','limón','ajo','aceite'],pasos:'Horno 190° 15 min, brócoli al vapor. Niños: con patata cocida.'},
  {n:'Salmón con espárragos',tipo:'Cena',kcal:480,p:42,ing:['4 lomos salmón','2 manojos espárragos','limón','aceite'],pasos:'Salmón a la plancha 4 min por lado. Niños: con arroz.'},
  {n:'Ternera con arroz y verduras',tipo:'Comida',kcal:520,p:55,ing:['500g ternera magra','arroz','pimientos','cebolla','aceite'],pasos:'Saltea la ternera con verduras. Tu ración con poco arroz, niños con más.'},
  {n:'Lentejas con verduras',tipo:'Comida',kcal:450,p:24,ing:['400g lentejas','2 zanahorias','1 cebolla','1 pimiento','pimentón'],pasos:'Guiso tradicional de lentejas con verduras. Plato completo para toda la familia.'},
  {n:'Paella de marisco',tipo:'Comida',kcal:480,p:28,ing:['arroz','gambas','mejillones','sepia','caldo','azafrán','pimiento'],pasos:'Sofríe, añade arroz y caldo. Tu ración moderada + mucha ensalada. Niños: ración normal.'},
  {n:'Tortilla de patata',tipo:'Cena',kcal:300,p:12,ing:['6 huevos','4 patatas','1 cebolla','aceite'],pasos:'Clásica tortilla. Acompaña con ensalada grande para tu ración.'},
  {n:'Pavo al horno con verduras',tipo:'Comida',kcal:400,p:50,ing:['600g pavo','calabacín','berenjena','cebolla','pimiento'],pasos:'Todo al horno con poco aceite. Niños: con patatas panaderas.'},
  {n:'Garbanzos con espinacas',tipo:'Comida',kcal:430,p:20,ing:['400g garbanzos cocidos','espinacas','ajo','pimentón','un huevo'],pasos:'Potaje rápido. Añade un huevo duro para subir proteína.'},
  {n:'Sepia con verduras y arroz',tipo:'Comida',kcal:460,p:32,ing:['600g sepia','arroz','pimientos','cebolla','ajo'],pasos:'Sepia a la plancha o guisada con verduras y arroz. Niños: más arroz.'}
];
function renderRecipes(){const el=document.getElementById('recipeList');if(!el)return;el.innerHTML=RECIPES.map((r,i)=>`<div class="ex-block"><div class="ex-head"><span class="nm">${r.n}</span><span class="mini">${r.tipo} · ${r.kcal}kcal P${r.p}</span></div><div style="margin-top:6px">${r.ing.map(x=>`<span class="pill">${x}</span>`).join('')}</div><p class="mini" style="margin-top:8px">${r.pasos}</p><div class="row" style="margin-top:8px"><button class="btn-sm btn-acc2" onclick="logRecipe(${i})">+ comer mi ración</button><button class="btn-sm btn2" onclick="addRecipeToShop(${i})">🛒 a la compra</button></div></div>`).join('');}
function logRecipe(i){const r=RECIPES[i];const k=foodKey();DB.foodLog[k]=DB.foodLog[k]||[];DB.foodLog[k].push({n:r.n,ic:'🍽️',r:'1 ración',kcal:r.kcal,p:r.p,meal:r.tipo,q:1});save();renderDashboard();toast('🍽️ '+r.n+' añadido');}

/* ===== LISTA DE LA COMPRA ===== */
const SHOP_SECTION={'pollo':'Carnicería','pavo':'Carnicería','ternera':'Carnicería','conejo':'Carnicería','cerdo':'Carnicería','jamón':'Charcutería','merluza':'Pescadería','salmón':'Pescadería','lubina':'Pescadería','gambas':'Pescadería','mejillones':'Pescadería','sepia':'Pescadería','atún':'Conservas','huevo':'Huevos y lácteos','yogur':'Huevos y lácteos','queso':'Huevos y lácteos','leche':'Huevos y lácteos','requesón':'Huevos y lácteos','arroz':'Despensa','pasta':'Despensa','patata':'Verdulería','lenteja':'Despensa','garbanzo':'Despensa','quinoa':'Despensa','pan':'Panadería','avena':'Despensa','calabacín':'Verdulería','pimiento':'Verdulería','cebolla':'Verdulería','brócoli':'Verdulería','espárrago':'Verdulería','berenjena':'Verdulería','zanahoria':'Verdulería','espinaca':'Verdulería','tomate':'Verdulería','aguacate':'Verdulería','limón':'Verdulería','fruta':'Frutería','plátano':'Frutería','almendra':'Frutos secos','nueces':'Frutos secos','aceite':'Despensa','ajo':'Verdulería','azafrán':'Especias','pimentón':'Especias','caldo':'Despensa','miel':'Despensa','canela':'Especias','hummus':'Despensa'};
function shopSection(ing){const l=ing.toLowerCase();for(const k in SHOP_SECTION){if(l.includes(k))return SHOP_SECTION[k];}return 'Otros';}
function addRecipeToShop(i){const r=RECIPES[i];DB.shopList=DB.shopList||[];r.ing.forEach(ing=>{if(!DB.shopList.find(x=>x.n===ing))DB.shopList.push({n:ing,sec:shopSection(ing),done:false});});save();toast('🛒 Añadido a la compra');}
function renderShopping(){const el=document.getElementById('shopView');if(!el)return;const list=DB.shopList||[];if(!list.length){el.innerHTML='<p class="empty">Tu lista está vacía. Añade ingredientes desde Recetas (🛒) o uno a uno abajo.</p>'+shopAddBox();return;}
  const bySec={};list.forEach((it,idx)=>{(bySec[it.sec]=bySec[it.sec]||[]).push({...it,idx});});
  el.innerHTML=Object.keys(bySec).sort().map(sec=>`<div style="margin-bottom:12px"><b style="font-family:Anton;font-size:14px;color:var(--acc)">${sec}</b>${bySec[sec].map(it=>`<div class="sub-opt" style="${it.done?'opacity:.5':''}"><span onclick="toggleShop(${it.idx})" style="cursor:pointer">${it.done?'✅':'⬜'} ${it.n}</span><button class="btn-sm btn2" onclick="delShop(${it.idx})" style="padding:4px 9px;color:var(--bad)">✕</button></div>`).join('')}</div>`).join('')+shopAddBox()+`<button class="btn2" style="margin-top:10px" onclick="clearShopDone()">Quitar comprados</button> <button class="btn2" style="margin-top:10px" onclick="clearShopAll()">Vaciar lista</button>`;}
function shopAddBox(){return `<div class="row" style="margin-top:10px"><input id="shopNew" placeholder="Añadir producto"><button class="btn2 btn-sm" onclick="addShopItem()">+</button></div>`;}
function addShopItem(){const v=document.getElementById('shopNew').value.trim();if(!v)return;DB.shopList=DB.shopList||[];DB.shopList.push({n:v,sec:shopSection(v),done:false});save();renderShopping();}
function toggleShop(i){DB.shopList[i].done=!DB.shopList[i].done;save();renderShopping();}
function delShop(i){DB.shopList.splice(i,1);save();renderShopping();}
function clearShopDone(){DB.shopList=(DB.shopList||[]).filter(x=>!x.done);save();renderShopping();toast('Comprados quitados');}
function clearShopAll(){if(confirm('¿Vaciar toda la lista de la compra?')){DB.shopList=[];save();renderShopping();}}

/* ===================== MENTE · VÍDEOS GUIADOS ===================== */
const VIDEO_LIB=[
  {cat:'Movilidad',ic:'🤸',sub:'Despierta el cuerpo · 10 min',vids:[
    {id:'aLboTQ9sp4w',t:'Movilidad 10 min para la mañana',dur:'10 min'},
    {id:'N8iG4-VvJ-s',t:'Movilidad todo el cuerpo',dur:'10 min'},
    {id:'l9XvauKO0VA',t:'Movilidad mañana, siéntete al 100%',dur:'15 min'},
    {id:'DPUDZ4yQz3c',t:'Movilidad para corredores',dur:'10 min'}]},
  {cat:'Yoga',ic:'🧘',sub:'Fluir y activar · 10 min',vids:[
    {id:'vV-Y8euGt6U',t:'Yoga por la mañana para despertar',dur:'10 min'},
    {id:'C01BuowiCQw',t:'Yoga 10 min para la mañana',dur:'10 min'},
    {id:'qTj9vti6Dw0',t:'Yoga en casa principiantes',dur:'10 min'},
    {id:'KoTp4C0zSTg',t:'Yoga estira todo el cuerpo',dur:'10 min'}]},
  {cat:'Estiramientos',ic:'🙆',sub:'Suelta tensión · 10 min',vids:[
    {id:'ZUa-FT1SQrg',t:'Estiramientos mañana cuerpo entero',dur:'10 min'},
    {id:'3TwVkiu2tgs',t:'Estiramiento de isquiotibiales',dur:'10 min'},
    {id:'ZHSPmo5SNVk',t:'Movilidad para sentadilla',dur:'10 min'}]},
  {cat:'Respiración y foco',ic:'🌬️',sub:'Calma y energía · 5 min',vids:[
    {id:'gm5VrUKd4zk',t:'Meditación de la mañana (5 min)',dur:'5 min'},
    {id:'FAk0K00j1ps',t:'Meditación energía positiva',dur:'5 min'},
    {id:'hqJZR4d80Do',t:'Respiración Wim Hof guiada (ritmo lento)',dur:'11 min'},
    {id:'eC4pBdtN_bo',t:'Meditación al despertar',dur:'5 min'}]}
];
function dailyVidIndex(arr){return new Date().getDate()%arr.length;}
function renderVideoCats(){
  const el=document.getElementById('videoCats');if(!el)return;
  const done=DB.mindLog[today()];
  let html=done?`<div class="note viol" style="margin-bottom:10px">✓ Hoy ya has hecho tu activación. Puedes repetir cuando quieras.</div>`:'';
  html+=VIDEO_LIB.map((c,ci)=>{
    const sug=ci===(new Date().getDate()%VIDEO_LIB.length);
    return `<div class="vid-cat ${sug?'sug':''}" onclick="openVideoCat(${ci})"><div class="ve">${c.ic}</div><div class="vmeta"><b>${c.cat}</b><div class="vd">${c.sub}${sug?' · sugerido hoy':''}</div></div><div class="vgo">▶</div></div>`;
  }).join('');
  el.innerHTML=html;
}
function openVideoCat(ci){
  const c=VIDEO_LIB[ci];const idx=dailyVidIndex(c.vids);const v=c.vids[idx];
  playVideo(v.id,c.cat+' · '+v.t);
  // lista del resto para elegir otro
  const rest=c.vids.map((x,i)=>`<div class="vid-list-item" onclick="playVideo('${x.id}','${(c.cat+' · '+x.t).replace(/'/g,'')}')"><div class="vn">${x.t}</div><div class="vt">${x.dur}</div></div>`).join('');
  document.getElementById('videoPlayerCard').insertAdjacentHTML('beforeend','');
  window._restHtml={ci,rest};
  renderVideoRest();
}
function renderVideoRest(){
  if(!window._restHtml)return;const c=VIDEO_LIB[window._restHtml.ci];
  let host=document.getElementById('videoRest');
  if(!host){host=document.createElement('div');host.id='videoRest';document.getElementById('videoPlayerCard').appendChild(host);}
  host.innerHTML=`<div class="mini" style="margin-top:12px;text-transform:uppercase;letter-spacing:.04em">Más de ${c.cat}</div>${window._restHtml.rest}`;
}
function playVideo(id,title){
  const card=document.getElementById('videoPlayerCard');card.style.display='block';
  document.getElementById('vpTitle').textContent='▶ '+title;
  document.getElementById('videoPlayer').innerHTML=`<div class="video-wrap"><iframe src="https://www.youtube.com/embed/${id}?rel=0&playsinline=1" title="YouTube" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
  document.getElementById('vpStatus').textContent=DB.mindLog[today()]?'✓ Ritual marcado hoy':'Cuando termines, marca el ritual como completado.';
  card.scrollIntoView({behavior:'smooth'});
}

/* ===================== MENTE ===================== */
let MT={running:false,sec:0,idx:0,id:null,total:0};
function renderMindTimer(){const el=document.getElementById('mindTimer');if(!el)return;const cur=MIND[MT.idx];const m=Math.floor(MT.sec/60),s=MT.sec%60;el.innerHTML=`<div class="timer-hero mind"><div class="phase">PASO ${MT.idx+1}/${MIND.length} · min ${cur.t}</div><div class="clock">${m}:${String(s).padStart(2,'0')}</div><div class="sub">${MT.running?'Sigue la guía':'Pulsa iniciar'}</div><div class="timer-ctrl">${MT.running?`<button class="btn2" onclick="mtPause()">Pausa</button>`:`<button class="btn-viol" onclick="mtStart()">${MT.total?'Sigue':'Iniciar'}</button>`}<button class="btn2" onclick="mtNext()">Sig ▶</button><button class="btn2" onclick="mtReset()">Reset</button></div></div>`;}
function mtStart(){MT.running=true;if(MT.sec===0)MT.sec=MIND[MT.idx].sec;if(MT.id)clearInterval(MT.id);MT.id=setInterval(()=>{MT.sec--;MT.total++;if(MT.sec<=0){beep(2);if(MT.idx<MIND.length-1){MT.idx++;MT.sec=MIND[MT.idx].sec;}else{mtPause();completeMind();}}renderMindTimer();renderMindSteps();},1000);renderMindTimer();renderMindSteps();}
function mtPause(){MT.running=false;clearInterval(MT.id);renderMindTimer();}
function mtNext(){if(MT.idx<MIND.length-1){MT.idx++;MT.sec=MIND[MT.idx].sec;}else MT.sec=0;renderMindTimer();renderMindSteps();}
function mtReset(){clearInterval(MT.id);MT={running:false,sec:0,idx:0,id:null,total:0};renderMindTimer();renderMindSteps();}
function renderMindSteps(){const el=document.getElementById('mindSteps');if(!el)return;el.innerHTML=MIND.map((s,i)=>`<div class="mind-step ${i===MT.idx?'active':''}"><div class="ms-t">${s.t}'</div><div class="ms-d">${s.d}</div></div>`).join('');}
function completeMind(){DB.mindLog[today()]=true;const d=today();DB.habitLog[d]=DB.habitLog[d]||{};DB.habitLog[d]['h3']=true;save();const st=document.getElementById('vpStatus');if(st)st.textContent='✓ Ritual marcado hoy. Buen arranque.';renderVideoCats();toast('🧠 Ritual hecho. A por el día.');}
function renderHabits(){const el=document.getElementById('habitList');if(!el)return;const log=DB.habitLog[today()]||{};el.innerHTML=DB.habits.map(h=>`<div class="habit ${log[h.id]?'done':''}" onclick="toggleHabit('${h.id}')"><div class="hi">${h.ic}</div><div class="ht">${h.name}</div><div class="hck">✓</div></div>`).join('');const ee=document.getElementById('habitEdit');if(ee)ee.innerHTML=DB.habits.map(h=>`<div class="set-row" style="grid-template-columns:28px 1fr 28px"><span>${h.ic}</span><input value="${h.name}" oninput="updHabit('${h.id}',this.value)"><button class="del" style="background:none;color:var(--bad)" onclick="delHabit('${h.id}')">✕</button></div>`).join('')+`<button class="btn-sm btn2" style="margin-top:6px" onclick="addHabit()">+ hábito</button>`;}
function toggleHabit(id){const d=today();DB.habitLog[d]=DB.habitLog[d]||{};DB.habitLog[d][id]=!DB.habitLog[d][id];save();renderHabits();}
function updHabit(id,v){const h=DB.habits.find(x=>x.id===id);if(h)h.name=v;save();}
function delHabit(id){DB.habits=DB.habits.filter(h=>h.id!==id);save();renderHabits();}
function addHabit(){DB.habits.push({id:'h'+Date.now(),ic:'⭐',name:'Nuevo hábito'});save();renderHabits();}
function renderHabitStreak(){const el=document.getElementById('habitStreak');if(!el)return;let html='',pf=0;for(let i=29;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const ds=d.toISOString().slice(0,10);const log=DB.habitLog[ds]||{};const done=DB.habits.filter(h=>log[h.id]).length;const r=DB.habits.length?done/DB.habits.length:0;if(r>=0.6)pf++;html+=`<span class="streak-dot ${r>=0.6?'on':''}" style="opacity:${r>=0.6?1:(ds in DB.habitLog?0.3+r*0.7:0.12)}" title="${ds}"></span>`;}el.innerHTML=html;document.getElementById('habitStreakTxt').textContent=`${pf}/30 días con la mayoría cumplida.`;}

/* ===================== AJUSTES · RESPALDO · UTILIDADES ===================== */
function openSettings(){
  const fs=DB.settings&&DB.settings.fontScale||1;
  openModal(`<h3>⚙️ Ajustes</h3>
  <div class="ex-block"><b style="font-family:Anton">💾 Respaldo de datos</b><p class="mini" style="margin:6px 0 10px">Guarda una copia de todo (entrenos, medidas, fotos, hábitos). Impórtala si cambias de móvil o limpias el navegador.</p><div class="row"><button class="btn-acc2" style="flex:1" onclick="exportData()">⬇ Exportar</button><button class="btn2" style="flex:1" onclick="document.getElementById('importFile').click()">⬆ Importar</button></div></div>
  <div class="ex-block"><b style="font-family:Anton">🔤 Tamaño de letra</b><div class="row" style="margin-top:8px"><button class="btn2" onclick="setFont(0.9)">A−</button><button class="btn2" onclick="setFont(1)">A</button><button class="btn2" onclick="setFont(1.15)">A+</button><button class="btn2" onclick="setFont(1.3)">A++</button></div><p class="mini" style="margin-top:6px">Actual: ${Math.round(fs*100)}%</p></div>
  <div class="ex-block"><b style="font-family:Anton">🧮 Calculadora de discos</b><p class="mini" style="margin:6px 0 8px">Qué discos poner por lado para un peso objetivo.</p><button class="btn2" onclick="openPlates()">Abrir calculadora</button></div>
  <div class="ex-block"><b style="font-family:Anton">⏱️ Cronómetro de intervalos</b><p class="mini" style="margin:6px 0 8px">Para carrera y cardio: trabajo/descanso × rondas (HIIT, sprints).</p><button class="btn2" onclick="openIntervals()">Abrir cronómetro</button></div>
  <div class="ex-block"><b style="font-family:Anton">📱 Pantalla activa</b><p class="mini" style="margin:6px 0 8px">Evita que el móvil se apague durante la sesión.</p><label style="display:flex;align-items:center;gap:8px;text-transform:none;font-size:14px"><input type="checkbox" id="wlChk" ${DB.settings&&DB.settings.wakeLock?'checked':''} onchange="toggleWakeSetting(this.checked)" style="width:20px;height:20px"> Mantener pantalla encendida</label></div>
  <div class="ex-block"><b style="font-family:Anton">⚠️ Datos</b><p class="mini" style="margin:6px 0 8px">Tus datos viven solo en este teléfono. Exporta de vez en cuando como copia de seguridad.</p></div>`);
}
function exportData(){try{DB.lastBackup=today();const data=JSON.stringify(DB);const blob=new Blob([data],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='forja-backup-'+today()+'.json';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);save();toast('💾 Copia exportada');renderBackupReminder();}catch(e){toast('Error al exportar');}}
function renderBackupReminder(){const el=document.getElementById('backupReminder');if(!el)return;const days=DB.lastBackup?daysBetween(DB.lastBackup,today()):999;if(!DB.lastBackup){el.innerHTML=`<div class="note gold">💾 Aún no has hecho copia de seguridad. Tus datos viven solo en este móvil. <button class="btn-sm btn-gold" style="margin-top:8px;display:block" onclick="exportData()">Exportar ahora</button></div>`;}else if(days>=10){el.innerHTML=`<div class="note gold">💾 Hace ${days} días de tu última copia. Conviene exportar de nuevo. <button class="btn-sm btn-gold" style="margin-top:8px;display:block" onclick="exportData()">Exportar ahora</button></div>`;}else{el.innerHTML=`<p class="mini">💾 Última copia: hace ${days} ${days===1?'día':'días'}. Bien protegido.</p>`;}}
function importData(inp){const f=inp.files[0];if(!f)return;const rd=new FileReader();rd.onload=e=>{try{const obj=JSON.parse(e.target.result);if(!obj||typeof obj!=='object'||!('routines'in obj)){toast('Archivo no válido');return;}if(confirm('Esto reemplazará TODOS tus datos actuales por los del archivo. ¿Continuar?')){DB=Object.assign(DB,obj);save();closeModal();renderAll();toast('✅ Datos restaurados');}}catch(err){toast('No se pudo leer el archivo');}};rd.readAsText(f);inp.value='';}
function setFont(s){DB.settings=DB.settings||{};DB.settings.fontScale=s;applyFont();save();openSettings();}
function applyFont(){const s=DB.settings&&DB.settings.fontScale||1;document.documentElement.style.fontSize=(16*s)+'px';}
function openPlates(){openModal(`<h3>🧮 Discos por lado</h3><label>Peso objetivo (kg)</label><input id="plTarget" type="number" inputmode="decimal" placeholder="100" oninput="calcPlates()"><label style="margin-top:8px">Peso de la barra (kg)</label><input id="plBar" type="number" inputmode="decimal" value="20" oninput="calcPlates()"><div id="plResult" style="margin-top:14px"></div><p class="mini" style="margin-top:10px">Discos disponibles considerados: 25, 20, 15, 10, 5, 2.5, 1.25 kg.</p>`);}
function calcPlates(){const t=+document.getElementById('plTarget').value,bar=+document.getElementById('plBar').value||20;const el=document.getElementById('plResult');if(!t||t<bar){el.innerHTML='<p class="mini">Introduce un peso mayor que la barra.</p>';return;}let perSide=(t-bar)/2;const plates=[25,20,15,10,5,2.5,1.25];const used=[];let rem=perSide;plates.forEach(p=>{while(rem>=p-0.001){used.push(p);rem=Math.round((rem-p)*1000)/1000;}});const ok=rem<0.01;el.innerHTML=`<div class="stat" style="margin-bottom:10px"><div class="v acc2">${perSide.toFixed(2)} kg</div><div class="l">por lado</div></div>${used.length?'<div>'+used.map(p=>`<span class="pill" style="border-color:var(--acc);color:var(--acc);font-weight:700">${p}</span>`).join(''):'<p class="mini">Solo la barra.</p>'}</div>${!ok?`<p class="mini" style="color:var(--gold);margin-top:8px">⚠️ No exacto: faltan ${rem.toFixed(2)} kg/lado con discos estándar.</p>`:''}`;}
/* wake lock */
let _wakeLock=null;
async function requestWake(){try{if('wakeLock'in navigator){_wakeLock=await navigator.wakeLock.request('screen');}}catch(e){}}
function releaseWake(){try{if(_wakeLock){_wakeLock.release();_wakeLock=null;}}catch(e){}}
function toggleWakeSetting(on){DB.settings=DB.settings||{};DB.settings.wakeLock=on;save();if(on)requestWake();else releaseWake();}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&DB.settings&&DB.settings.wakeLock&&DB.session)requestWake();});

/* ===================== RESUMEN SEMANAL ===================== */
function renderWeeklySummary(){
  const el=document.getElementById('weeklySummary');if(!el)return;
  const wk=weekDates();const sess=DB.sessions.filter(s=>wk.includes(s.date));
  const box=wk.filter(d=>DB.extraLog[d]&&DB.extraLog[d].box).length;
  const run=wk.filter(d=>DB.extraLog[d]&&DB.extraLog[d].run).length;
  // mejores marcas de la semana
  const prs=[];sess.forEach(s=>(s.blocks||[]).forEach(b=>b.exercises.forEach(e=>{let mx=0;(e.sets||[]).forEach(st=>{if(+st.kg>mx)mx=+st.kg;});if(mx>0)prs.push({n:e.name,kg:mx});})));
  const top=Object.values(prs.reduce((a,p)=>{if(!a[p.n]||p.kg>a[p.n].kg)a[p.n]=p;return a;},{})).sort((a,b)=>b.kg-a.kg).slice(0,3);
  const fl=fatLossScore();
  el.innerHTML=`<div class="stat-grid"><div class="stat"><div class="v acc2">${sess.length}</div><div class="l">entrenos</div></div><div class="stat"><div class="v gold">${box}</div><div class="l">boxeos</div></div><div class="stat"><div class="v viol">${run}</div><div class="l">carreras</div></div></div>${fl!=null?`<div class="note" style="margin-top:10px">Fat Loss de la semana: <b>${fl}/100</b></div>`:''}${top.length?`<div style="margin-top:10px"><div class="mini" style="text-transform:uppercase">Mejores marcas</div>${top.map(t=>`<span class="pill" style="border-color:var(--gold);color:var(--gold)">${t.n} ${t.kg}kg</span>`).join('')}</div>`:'<p class="mini" style="margin-top:10px">Entrena esta semana para ver tus marcas aquí.</p>'}`;
}

/* ===================== PESO OBJETIVO Y PREVISIÓN ===================== */
function bodyWeightSeries(){return [...DB.body].filter(b=>b.peso).sort((a,b)=>a.date.localeCompare(b.date)).map(b=>({date:b.date,w:b.peso}));}
function renderGoalProgress(){
  const el=document.getElementById('goalProgress');if(!el)return;
  const series=bodyWeightSeries();
  const start=series.length?series[0].w:DB.profile.weight;
  const cur=series.length?series[series.length-1].w:DB.profile.weight;
  const goal=DB.goalWeight||105;
  const totalToLose=start-goal;
  const lost=start-cur;
  const pct=totalToLose>0?Math.max(0,Math.min(100,Math.round(lost/totalToLose*100))):0;
  let eta='';
  if(series.length>=2){
    const first=series[0],last=series[series.length-1];
    const days=Math.max(1,daysBetween(first.date,last.date));
    const rate=(first.w-last.w)/days; // kg/día perdidos
    if(rate>0.005){const remain=cur-goal;const daysLeft=Math.round(remain/rate);if(remain>0){const d=new Date();d.setDate(d.getDate()+daysLeft);eta=`A tu ritmo actual (${(rate*7).toFixed(2)} kg/sem), llegarías sobre <b>${d.toLocaleDateString('es-ES',{month:'long',year:'numeric'})}</b>.`;}else eta='¡Ya estás en tu objetivo o por debajo! 🎯';}
    else if(rate<=0&&cur>goal)eta='El peso no baja últimamente. Revisa nutrición y sube cardio/finishers.';
  }else eta='Registra tu peso 2+ veces en Cuerpo para estimar cuándo llegarás.';
  const col=pct>=66?'var(--ok)':pct>=33?'var(--gold)':'var(--acc)';
  el.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-family:Anton;font-size:22px">${cur} kg</span><span class="mini">meta ${goal} kg</span></div>
    <div class="bar" style="margin-top:8px"><i style="width:${pct}%;background:${col}"></i></div>
    <div style="display:flex;justify-content:space-between;margin-top:4px"><span class="mini">inicio ${start} kg</span><span class="mini">${pct}% del camino</span></div>
    ${eta?`<div class="note" style="margin-top:10px">${eta}</div>`:''}
    <button class="btn2" style="margin-top:10px" onclick="openGoalWeight()">Ajustar meta</button>`;
}
function openGoalWeight(){openModal(`<h3>🎯 Peso objetivo</h3><p class="mini" style="margin-bottom:10px">Tu meta de peso. La app calcula el progreso y estima cuándo llegarás según tu ritmo real.</p><label>Meta (kg)</label><input id="gwInput" type="number" inputmode="decimal" value="${DB.goalWeight||105}"><button class="btn" style="margin-top:14px" onclick="saveGoalWeight()">Guardar</button>`);}
function saveGoalWeight(){const v=+document.getElementById('gwInput').value;if(v>0)DB.goalWeight=v;save();closeModal();renderGoalProgress();toast('🎯 Meta actualizada');}

/* ===================== CALENTAMIENTO GUIADO ===================== */
const WARMUPS={
  PUSH:[{d:'Movilidad de hombros: círculos grandes 10 adelante + 10 atrás',sec:40},{d:'Rotaciones de muñeca y codo x10',sec:30},{d:'Band pull-apart o aperturas x15',sec:40},{d:'Flexiones lentas x10 (activación)',sec:40},{d:'Series de aproximación: barra vacía + 50% del peso',sec:60}],
  PULL:[{d:'Movilidad de hombro y dorsal: colgarse 20s + círculos',sec:40},{d:'Band pull-apart x15',sec:30},{d:'Gato-camello x8 + rotación torácica x8/lado',sec:40},{d:'Remos ligeros con banda x15',sec:40},{d:'Aproximación: dominadas asistidas o jalón ligero x8',sec:60}],
  LEGS:[{d:'Movilidad de cadera y tobillo: sentadilla profunda asistida 30s',sec:40},{d:'Círculos de cadera x8/lado + balanceos de pierna x10',sec:40},{d:'Sentadilla peso corporal x15',sec:40},{d:'Zancadas x8/pierna',sec:40},{d:'Aproximación: barra vacía + 50% sentadilla',sec:60}]
};
let WU={running:false,sec:0,idx:0,id:null,steps:[],name:''};
function startWarmup(rid){const r=DB.routines.find(x=>x.id===rid);if(!r)return;const key=r.name.includes('PUSH')||r.name.includes('TORSO')?'PUSH':r.name.includes('PULL')?'PULL':r.name.includes('LEGS')||r.name.includes('PIERNA')||r.name.includes('FULL')?'LEGS':'PUSH';WU={running:false,sec:WARMUPS[key][0].sec,idx:0,id:null,steps:WARMUPS[key],name:r.name};renderWarmup();}
function renderWarmup(){let card=document.getElementById('warmupCard');if(!card){card=document.createElement('div');card.id='warmupCard';card.className='card';card.style.borderColor='var(--acc2)';document.getElementById('readyCard').after(card);}const s=WU.steps[WU.idx];const m=Math.floor(WU.sec/60),sec=WU.sec%60;card.innerHTML=`<h3>🔥 Calentamiento · ${WU.name} <span class="tag c2">${WU.idx+1}/${WU.steps.length}</span></h3><div class="timer-hero go"><div class="phase">PREPARACIÓN</div><div class="clock">${m}:${String(sec).padStart(2,'0')}</div><div class="sub">${s.d}</div><div class="timer-ctrl">${WU.running?`<button class="btn2" onclick="wuPause()">Pausa</button>`:`<button class="btn-acc2" onclick="wuStart()">Iniciar</button>`}<button class="btn2" onclick="wuNext()">Sig ▶</button><button class="btn2" onclick="wuClose()">Cerrar</button></div></div><div class="mini">${WU.steps.map((x,i)=>`<span class="pill" style="${i===WU.idx?'border-color:var(--acc2);color:var(--acc2)':''}">${i+1}</span>`).join('')}</div>`;card.scrollIntoView({behavior:'smooth'});}
function wuStart(){WU.running=true;if(WU.id)clearInterval(WU.id);WU.id=setInterval(()=>{WU.sec--;if(WU.sec<=0){beep(1);if(WU.idx<WU.steps.length-1){WU.idx++;WU.sec=WU.steps[WU.idx].sec;}else{wuDone();return;}}renderWarmup();},1000);renderWarmup();}
function wuPause(){WU.running=false;clearInterval(WU.id);renderWarmup();}
function wuNext(){if(WU.idx<WU.steps.length-1){WU.idx++;WU.sec=WU.steps[WU.idx].sec;renderWarmup();}else wuDone();}
function wuDone(){clearInterval(WU.id);beep(2);wuClose();toast('🔥 Calentado. ¡A entrenar!');}
function wuClose(){clearInterval(WU.id);const c=document.getElementById('warmupCard');if(c)c.remove();WU={running:false,sec:0,idx:0,id:null,steps:[],name:''};}

/* ===================== CRONÓMETRO DE INTERVALOS ===================== */
let IV={running:false,sec:0,phase:'work',round:1,id:null,cfg:null};
function openIntervals(){openModal(`<h3>⏱️ Cronómetro de intervalos</h3><p class="mini" style="margin-bottom:10px">Para carrera, sprints o cardio. Define trabajo, descanso y rondas.</p><div class="row"><div><label>Trabajo (s)</label><input id="ivWork" type="number" value="30"></div><div><label>Descanso (s)</label><input id="ivRest" type="number" value="30"></div><div><label>Rondas</label><input id="ivRounds" type="number" value="8"></div></div><button class="btn" style="margin-top:14px" onclick="startIntervals()">Empezar</button><div id="ivLive" style="margin-top:14px"></div>`);}
function startIntervals(){IV={running:true,sec:+document.getElementById('ivWork').value||30,phase:'work',round:1,id:null,cfg:{work:+document.getElementById('ivWork').value||30,rest:+document.getElementById('ivRest').value||30,rounds:+document.getElementById('ivRounds').value||8}};if(IV.id)clearInterval(IV.id);IV.id=setInterval(ivTick,1000);renderIntervals();}
function ivTick(){IV.sec--;if(IV.sec<=0){beep(2);if(IV.phase==='work'){IV.phase='rest';IV.sec=IV.cfg.rest;}else{if(IV.round>=IV.cfg.rounds){ivDone();return;}IV.round++;IV.phase='work';IV.sec=IV.cfg.work;}}renderIntervals();}
function renderIntervals(){const el=document.getElementById('ivLive');if(!el)return;const m=Math.floor(IV.sec/60),s=IV.sec%60;el.innerHTML=`<div class="timer-hero ${IV.phase==='rest'?'rest':'go'}"><div class="phase">${IV.phase==='work'?'🔥 FUERTE':'😮‍💨 SUAVE'} · ronda ${IV.round}/${IV.cfg.rounds}</div><div class="clock">${m}:${String(s).padStart(2,'0')}</div><div class="timer-ctrl">${IV.running?`<button class="btn2" onclick="ivPause()">Pausa</button>`:`<button class="btn-acc2" onclick="ivResume()">Seguir</button>`}<button class="btn2" onclick="ivStop()">Parar</button></div></div>`;}
function ivPause(){IV.running=false;clearInterval(IV.id);renderIntervals();}
function ivResume(){IV.running=true;if(IV.id)clearInterval(IV.id);IV.id=setInterval(ivTick,1000);renderIntervals();}
function ivStop(){clearInterval(IV.id);IV.running=false;const el=document.getElementById('ivLive');if(el)el.innerHTML='<p class="mini">Parado.</p>';}
function ivDone(){clearInterval(IV.id);IV.running=false;beep(3);const el=document.getElementById('ivLive');if(el)el.innerHTML='<div class="note">✅ ¡Intervalos completados!</div>';const d=today();DB.extraLog[d]=DB.extraLog[d]||{};DB.extraLog[d].run=true;save();renderExtra&&renderExtra();}

/* ===================== CALENDARIO MENSUAL ===================== */
function renderCalendar(){const el=document.getElementById('calendarView');if(!el)return;const now=new Date();const y=now.getFullYear(),mo=now.getMonth();const first=new Date(y,mo,1);const startDow=(first.getDay()+6)%7;const daysIn=new Date(y,mo+1,0).getDate();let html=`<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center">${['L','M','X','J','V','S','D'].map(d=>`<div class="mini" style="font-weight:700">${d}</div>`).join('')}`;for(let i=0;i<startDow;i++)html+='<div></div>';for(let d=1;d<=daysIn;d++){const ds=`${y}-${String(mo+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;const sess=DB.sessions.some(s=>s.date===ds);const e=DB.extraLog[ds]||{};const meas=DB.body.some(b=>b.date===ds);let dots='';if(sess)dots+='<span style="color:var(--acc)">●</span>';if(e.box)dots+='<span style="color:var(--gold)">●</span>';if(e.run)dots+='<span style="color:var(--viol)">●</span>';if(meas)dots+='<span style="color:var(--acc2)">●</span>';const isToday=ds===today();html+=`<div style="aspect-ratio:1;border-radius:8px;border:1px solid ${isToday?'var(--acc)':'var(--line)'};background:var(--bg3);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2px"><span class="mini" style="${isToday?'color:var(--acc);font-weight:700':''}">${d}</span><span style="font-size:7px;line-height:1">${dots||'&nbsp;'}</span></div>`;}html+='</div>';html+=`<p class="mini" style="margin-top:10px"><span style="color:var(--acc)">●</span> entreno · <span style="color:var(--gold)">●</span> boxeo · <span style="color:var(--viol)">●</span> carrera · <span style="color:var(--acc2)">●</span> medición</p>`;el.innerHTML=html;}

/* ===================== INIT ===================== */
function renderAll(){applyFont();document.getElementById('hdrDate').textContent=new Date().toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'});renderDashboard();renderCycle();renderTodayReady();renderExtra();if(DB.session){document.getElementById('sessionCard').style.display='block';renderSessionHead();renderSessionBody();renderTimerHero();if(DB.settings&&DB.settings.wakeLock)requestWake();}}
if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(()=>{});});}
load();
