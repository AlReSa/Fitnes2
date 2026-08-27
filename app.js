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
  'Gemelo de pie':['Gemelo sentado','Gemelo en prensa','Saltos a la comba','Gemelo a una pierna'],
  'Press militar de pie':['Press militar sentado','Push press','Press mancuernas de pie','Press Arnold'],
  'Farmer walk':['Farmer con mancuernas','Farmer con kettlebells','Paseo del granjero en trap bar','Carry en rack'],
  'Farmer walk pesado':['Farmer mancuernas pesado','Yoke walk','Trap bar carry','Zercher carry'],
  'Zercher carry o arrastre':['Zercher carry','Arrastre de trineo','Farmer walk','Peso muerto con pausa'],
  'Sentadilla frontal':['Sentadilla goblet','Sentadilla trasera','Zercher squat','Prensa'],
  'Remo pendlay':['Remo con barra','Remo mancuerna','Remo en máquina','Remo gorila KB'],
  'Press banca tempo 3-1-1':['Press banca','Press mancuernas','Flexiones lastradas','Press inclinado'],
  'Fondos lastrados':['Fondos','Press cerrado','Fondos en máquina','Flexiones diamante'],
  'Dominadas lastradas':['Dominadas','Jalón al pecho','Dominadas asistidas','Remo invertido'],
  'Zancada caminando':['Zancada estática','Búlgara','Prensa a una pierna','Step-up'],
  'Peso muerto rumano tempo':['Peso muerto rumano','Buenos días','Curl femoral','Hip thrust'],
  'Dominadas':['Dominadas con goma','Jalón al pecho','Remo invertido','Dominadas negativas'],
  'Fondos':['Fondos con goma','Fondos en banco','Press cerrado','Flexiones diamante']
};
/* ----- Rotación del ejercicio principal por día (cada ciclo cambia) ----- */
const MAIN_ROT={Lunes:['Press banca','Press inclinado','Press militar'],Miércoles:['Dominadas lastradas','Remo barra','Pendlay row'],Sábado:['Sentadilla','Sentadilla frontal','Trap bar deadlift']};

/* ----- Bibliotecas de bloques 3 y 4 (densidad y finishers dinámicos) ----- */
const DENSITY=[
  {fmt:'EMOM',label:'EMOM 8 min',desc:'Cada minuto, al empezar, haz 10 KB swings. El tiempo que sobre hasta el siguiente minuto, descansas. 8 minutos = 8 rondas.',sec:480,timer:'emom',proto:{kind:'emom',rounds:8,minSec:60,workName:'10 swings'},q:'EMOM kettlebell swings workout'},
  {fmt:'AMRAP',label:'AMRAP 8 min',desc:'Máximas rondas en 8 min de: 5 goblet squat + 7 push press + 9 swings. Sin parar, cuenta tus rondas.',sec:480,timer:'down',proto:{kind:'amrap',totalSec:480},q:'AMRAP kettlebell workout'},
  {fmt:'Ladder',label:'Escalera',desc:'Thrusters en escalera: 1 rep, luego 2, 3, 4, 5 y bajas 4, 3, 2, 1. Sin prisa pero sin pausa.',sec:420,timer:'down',proto:{kind:'timer',totalSec:420,direction:'down'},q:'kettlebell thruster ladder workout'},
  {fmt:'For Time',label:'Por tiempo',desc:'100 KB swings lo más rápido posible (parte en series si hace falta). Apunta el tiempo total para batirlo.',sec:600,timer:'up',proto:{kind:'timer',totalSec:600,direction:'up'},q:'100 kettlebell swings for time'},
  {fmt:'Density',label:'Density Challenge',desc:'Máximo clean & press posible en 5 min con buena técnica. Anota las reps y supera tu marca la próxima vez.',sec:300,timer:'down',proto:{kind:'timer',totalSec:300,direction:'down'},q:'kettlebell clean and press tutorial'}
];
const FINISHER=[
  {label:'Complejo Forja',desc:'Sin soltar la KB: clean + front squat + push press + swing, 5 reps de cada = 1 ronda. Haz 3 rondas.',sec:300,timer:'down',proto:{kind:'timer',totalSec:300,direction:'down'},q:'kettlebell complex workout'},
  {label:'Quemador escalera',desc:'KB swings bajando 10→1 (10,9,8...1) y goblet squat subiendo 1→10. Alterna. Encadenado.',sec:300,timer:'up',proto:{kind:'timer',totalSec:300,direction:'up'},q:'kettlebell swing goblet squat ladder'},
  {label:'Farmer + burpee',desc:'40 metros de farmer walk (carga pesada en cada mano) + 10 burpees = 1 ronda. Haz 3 rondas.',sec:300,timer:'down',proto:{kind:'timer',totalSec:300,direction:'down'},q:'farmer walk burpee finisher'},
  {label:'Tabata swings',desc:'8 rondas de: 20 segundos de KB swings a tope + 10 segundos de descanso. Total 4 minutos. La app te va a marcar cada cambio.',sec:240,timer:'tabata',proto:{kind:'intervals',work:20,rest:10,rounds:8,workName:'KB swings a tope',restName:'Descanso'},q:'tabata kettlebell swings'},
  {label:'Sprint metabólico',desc:'5 series de: 30 segundos fuerte + 30 segundos suave. En cinta, bici de aire o boxeo de sombra.',sec:300,timer:'down',proto:{kind:'intervals',work:30,rest:30,rounds:5,workName:'FUERTE',restName:'SUAVE'},q:'30 second sprint intervals workout'},
  {label:'Carry strongman',desc:'Farmer walk pesado: 4 recorridos de 40 m con 90s de descanso. Distancia larga = tiempo bajo tensión alto (40-70s), ideal para espalda, core y agarre.',sec:360,timer:'down',proto:{kind:'intervals',work:60,rest:90,rounds:4,workName:'Farmer walk',restName:'Descanso'},q:'farmer carry strongman technique'},
  {label:'Complejo de barra TUT',desc:'Sin soltar la barra: peso muerto + remo + power clean + press + sentadilla, 6 reps de cada, controlado. 3-4 rondas. Cada ronda dura 40-70s bajo tensión.',sec:360,timer:'down',proto:{kind:'timer',totalSec:360,direction:'down'},q:'barbell complex workout'}
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
  if(!DB.tourDone)setTimeout(()=>showTour(0),400);
}
let SAVE_OK=true;
function save(){
  try{
    const data=JSON.stringify(DB);
    if(typeof localStorage!=='undefined'){localStorage.setItem(KEY,data);}
    if(typeof window!=='undefined'&&window.storage&&window.storage.set){window.storage.set(KEY,data).catch(()=>{});}
    SAVE_OK=true;
  }catch(e){
    SAVE_OK=false;
    try{toast('⚠️ No se pudo guardar: memoria del navegador llena. Exporta una copia y borra fotos antiguas.');}catch(_){}
    try{renderSaveBanner&&renderSaveBanner();}catch(_){}
  }
}
/* Tamaño de datos y aviso proactivo antes de que el navegador falle (~5 MB) */
function storageInfo(){
  let bytes=0;try{bytes=new Blob([JSON.stringify(DB)]).size;}catch(e){try{bytes=JSON.stringify(DB).length;}catch(_){bytes=0;}}
  const kb=Math.round(bytes/1024);const mb=+(bytes/1048576).toFixed(2);const pct=Math.min(100,Math.round(bytes/5242880*100));
  const photos=(DB.body||[]).filter(b=>b.photo).length;
  return {kb,mb,pct,photos};
}
function renderSaveBanner(){
  const el=document.getElementById('dataBanner');if(!el)return;
  const s=storageInfo();
  if(!SAVE_OK){el.innerHTML=`<div class="note" style="border-color:var(--bad);background:rgba(255,80,80,.1);margin-bottom:12px"><b style="color:var(--bad)">⚠️ El último guardado falló</b><div class="mini" style="margin-top:4px">La memoria del navegador está llena (${s.mb} MB). Tus cambios recientes NO se han guardado. Exporta una copia ya y borra fotos antiguas para liberar espacio.</div><button class="btn-sm btn-gold" style="margin-top:8px" onclick="exportData()">💾 Exportar copia ahora</button></div>`;return;}
  if(s.pct>=80){el.innerHTML=`<div class="note gold" style="margin-bottom:12px">📦 Almacenamiento al <b>${s.pct}%</b> (${s.mb} MB${s.photos?`, ${s.photos} fotos`:''}). Cerca del límite del navegador. Exporta una copia y valora borrar fotos antiguas para no perder datos.</div>`;return;}
  el.innerHTML='';
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
  goals:[], checkins:{},
  running:{setup:false,target:'10K',daysWeek:2,history:[],currentPlan:null,activeSession:null},
  spin:{history:[]}, coreLog:[], diet:{log:{}},
  pain:{}, tourDone:false
};
const DEF_HAB=[{id:'h1',ic:'💧',name:'3 L de agua'},{id:'h2',ic:'🌞',name:'Luz natural 10 min'},{id:'h3',ic:'🧠',name:'Ritual de mañana'},{id:'h4',ic:'🥩',name:'Proteína en cada comida'},{id:'h5',ic:'📵',name:'Pausa de pantalla cada hora'},{id:'h6',ic:'😴',name:'Dormir 7-8 h'}];
const MIND=[{t:'0-2',d:'Respira: 6 respiraciones, inhala 4s / exhala 6s. Suelta hombros y mandíbula.',sec:120},{t:'2-5',d:'Columna: gato-camello x8, rotaciones de tronco x8/lado, círculos de cadera x8.',sec:180},{t:'5-8',d:'Activa: 20 sentadillas + 15 elevaciones de talón + 10 círculos de brazos.',sec:180},{t:'8-11',d:'Tren alto: aperturas de pecho, cuello suave, muñecas (por el teclado) x10.',sec:180},{t:'11-14',d:'Foco: ¿cuál es LA tarea importante de hoy? Visualízate haciéndola.',sec:180},{t:'14-15',d:'Intención: di en voz alta tu objetivo del día y un hábito que cumplirás.',sec:60}];

/* ===== rutinas con 4 bloques ===== */
function buildRoutines(rotIdx){
  const pick=(arr)=>arr[rotIdx%arr.length];
  return [
    {id:'r1',name:'PULL',day:'Lunes',blocks:[
      {type:'fuerza',label:'💪 Bloque 1 · FUERZA',exercises:[{name:pick(MAIN_ROT.Miércoles),sets:4,reps:'4-6',rest:150,rpe:8,kg:0}]},
      {type:'hipertrofia',label:'🎯 Bloque 2 · ACCESORIOS',superset:true,rest:30,exercises:[{name:'Remo gorila KB',sets:3,reps:'10-12',kg:26},{name:'Curl bíceps barra',sets:3,reps:'12',kg:30},{name:'Face pull',sets:3,reps:'15-20',kg:25}]},
      {type:'densidad',label:'⚡ Bloque 3 · DENSIDAD',density:true,exercises:[{name:'KB swings',sets:1,reps:'EMOM',kg:24}]},
      {type:'finisher',label:'🔥 Bloque 4 · FINISHER',finisher:true,exercises:[{name:'Finisher dinámico',sets:1,reps:'5 min',kg:0}]}
    ]},
    {id:'r2',name:'PUSH',day:'Miércoles',blocks:[
      {type:'fuerza',label:'💪 Bloque 1 · FUERZA',exercises:[{name:pick(MAIN_ROT.Lunes),sets:4,reps:'3-5',rest:150,rpe:8,kg:DB.profile.bench}]},
      {type:'hipertrofia',label:'🎯 Bloque 2 · ACCESORIOS',superset:true,rest:30,exercises:[{name:'Press inclinado mancuernas',sets:3,reps:'10-12',kg:24},{name:'Aperturas / cruce poleas',sets:3,reps:'12-15',kg:12},{name:'Elevaciones laterales',sets:3,reps:'15',kg:10}]},
      {type:'densidad',label:'⚡ Bloque 3 · DENSIDAD',density:true,exercises:[{name:'Push press KB',sets:1,reps:'AMRAP',kg:20}]},
      {type:'finisher',label:'🔥 Bloque 4 · FINISHER',finisher:true,exercises:[{name:'Finisher dinámico',sets:1,reps:'5 min',kg:0}]}
    ]},
    {id:'r3',name:'LEGS',day:'Sábado',blocks:[
      {type:'fuerza',label:'💪 Bloque 1 · FUERZA',exercises:[{name:pick(MAIN_ROT.Sábado),sets:4,reps:'3-5',rest:180,rpe:8,kg:DB.profile.squat}]},
      {type:'hipertrofia',label:'🎯 Bloque 2 · ACCESORIOS',superset:true,rest:30,exercises:[{name:'Peso muerto rumano',sets:3,reps:'8-10',kg:90},{name:'Zancada KB',sets:3,reps:'10/pierna',kg:20},{name:'Curl femoral',sets:3,reps:'12-15',kg:45}]},
      {type:'densidad',label:'⚡ Bloque 3 · DENSIDAD',density:true,exercises:[{name:'Goblet squat KB',sets:1,reps:'Ladder',kg:24}]},
      {type:'finisher',label:'🔥 Bloque 4 · FINISHER',finisher:true,exercises:[{name:'Finisher dinámico',sets:1,reps:'5 min',kg:0}]}
    ]}
  ];
}
function migrateRoutineLabels(){
  // renombrar etiquetas sin borrar rutinas ya guardadas del usuario
  if(!DB.routines)return;
  const NEW={fuerza:'💪 Bloque 1 · FUERZA',hipertrofia:'🎯 Bloque 2 · ACCESORIOS',densidad:'⚡ Bloque 3 · DENSIDAD',finisher:'🔥 Bloque 4 · FINISHER'};
  DB.routines.forEach(r=>(r.blocks||[]).forEach(b=>{if(NEW[b.type])b.label=NEW[b.type];}));
}
function seed(){
  if(DB.habits.length===0)DB.habits=JSON.parse(JSON.stringify(DEF_HAB));
  if(DB.routines.length===0)DB.routines=buildRoutines(DB.cycle.rotIndex||0);
  migrateRoutineLabels();
}

/* ===== RUTINAS DE VIAJE (sin gimnasio) ===== */
/* Material: peso corporal, comba, bandas elásticas (10kg c/u) + barra modulable, espacio para correr */
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
function nav(v,el){document.querySelectorAll('.view').forEach(x=>x.classList.remove('on'));document.getElementById('v-'+v).classList.add('on');document.querySelectorAll('nav button').forEach(b=>b.classList.remove('on'));el.classList.add('on');window.scrollTo(0,0);if(v==='home')renderDashboard();if(v==='mind'){renderMorning();renderVideoCats();renderHabits();}if(v==='body')renderBody();if(v==='run'){renderSpinView();renderSpinLive();}if(v==='train'){renderCycle();renderTodayReady();renderExtra();}if(v==='food')renderFood();}
function navBtn(i){return document.querySelectorAll('nav button')[i];}
function trainTab(t,el){['hoy','prog','retos','rutinas'].forEach(x=>{const e=document.getElementById('train-'+x);if(e)e.style.display='none';});document.getElementById('train-'+t).style.display='block';el.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('on'));el.classList.add('on');if(t==='prog'){renderDeload();renderStagnation();renderProgSelect();renderVolume();renderE1RM();renderPredictions();renderCycleCompare();renderDensityChart();renderPR();renderHistory();}if(t==='retos'){renderGoals();renderMedals();renderFormatPR();}if(t==='rutinas'){renderRoutines();renderRotation();}if(t==='hoy'){renderCycle();renderTodayReady();renderExtra();}}
function mindTab(t,el){['morning','video','checkin','ritual','habits'].forEach(x=>{const e=document.getElementById('mind-'+x);if(e)e.style.display='none';});document.getElementById('mind-'+t).style.display='block';el.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('on'));el.classList.add('on');if(t==='habits'){renderHabits();renderHabitStreak();renderHealthScore();}else if(t==='ritual'){renderMindSteps();renderMindTimer();}else if(t==='checkin'){renderCheckin();renderCheckinTrend();}else if(t==='morning'){renderMorning();}else{renderVideoCats();}}
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2400);}
function closeModal(){document.getElementById('modalBg').classList.remove('on');}
function openModal(h){document.getElementById('modalBox').innerHTML='<button class="close" onclick="closeModal()">×</button>'+h;document.getElementById('modalBg').classList.add('on');}
let _actx=null;
function initAudio(){
  try{
    if(!_actx)_actx=new(window.AudioContext||window.webkitAudioContext)();
    if(_actx.state==='suspended')_actx.resume();
    // "toque" silencioso para desbloquear en iOS
    const o=_actx.createOscillator(),g=_actx.createGain();g.gain.value=0;o.connect(g);g.connect(_actx.destination);o.start();o.stop(_actx.currentTime+0.01);
  }catch(e){}
}
function beep(n=1,strong){
  try{
    if(!_actx)_actx=new(window.AudioContext||window.webkitAudioContext)();
    if(_actx.state==='suspended')_actx.resume();
    const c=_actx;
    for(let i=0;i<n;i++){const t0=c.currentTime+i*0.34;
      const o=c.createOscillator(),g=c.createGain();o.type='square';o.connect(g);g.connect(c.destination);
      const f=strong?880:660;
      o.frequency.setValueAtTime(f,t0);o.frequency.setValueAtTime(f*1.5,t0+0.12);
      g.gain.setValueAtTime(0.0001,t0);g.gain.exponentialRampToValueAtTime(strong?0.7:0.45,t0+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t0+0.3);
      o.start(t0);o.stop(t0+0.32);
    }
  }catch(e){}
  try{if(navigator.vibrate)navigator.vibrate(n>1?[150,80,150,80,250]:[220]);}catch(e){}
}
function fd(ds){const d=new Date(ds+'T00:00');return d.toLocaleDateString('es-ES',{weekday:'short',day:'numeric',month:'short'});}
function daysBetween(a,b){return Math.floor((new Date(b)-new Date(a))/864e5);}
function weekDates(){const a=[];const d=new Date();const dow=(d.getDay()+6)%7;d.setDate(d.getDate()-dow);for(let i=0;i<7;i++){a.push(d.toISOString().slice(0,10));d.setDate(d.getDate()+1);}return a;}

/* ===================== COACH SEMANAL ===================== */
/* Motor por reglas: compara esta semana vs anterior y da conclusiones + acciones.
   Lee entrenos, peso, cintura, boxeo, carrera, hábitos. Sin IA, todo offline. */
function weekRange(offset){const a=[];const d=new Date();const dow=(d.getDay()+6)%7;d.setDate(d.getDate()-dow-7*offset);for(let i=0;i<7;i++){a.push(d.toISOString().slice(0,10));d.setDate(d.getDate()+1);}return a;}
function weekStats(offset){
  const days=weekRange(offset);
  const sess=DB.sessions.filter(s=>days.includes(s.date));
  const box=days.filter(d=>DB.extraLog[d]&&DB.extraLog[d].box).length;
  const run=days.filter(d=>DB.extraLog[d]&&DB.extraLog[d].run).length;
  // peso/cintura: última medición dentro de la semana
  const bodyIn=DB.body.filter(b=>days.includes(b.date)).sort((a,b)=>a.date.localeCompare(b.date));
  const weight=bodyIn.length?bodyIn[bodyIn.length-1].peso:null;
  const waist=bodyIn.filter(b=>b.cintura).length?bodyIn.filter(b=>b.cintura).pop().cintura:null;
  // density score medio
  const dens=sess.filter(s=>s.density).map(s=>s.density);
  // hábitos: % de checks logrados esa semana
  let habTot=0,habDone=0;days.forEach(d=>{const log=DB.habitLog[d];if(log){DB.habits.forEach(h=>{habTot++;if(log[h.id])habDone++;});}});
  const adher=habTot?Math.round(habDone/habTot*100):null;
  // mejores marcas (top peso por ejercicio)
  const lifts={};sess.forEach(s=>(s.blocks||[]).forEach(b=>{if(b.type==='fuerza')b.exercises.forEach(e=>{let mx=0;(e.sets||[]).forEach(st=>{if(+st.kg>mx)mx=+st.kg;});if(mx>0&&(!lifts[e.name]||mx>lifts[e.name]))lifts[e.name]=mx;});}));
  return {days,sessN:sess.length,box,run,weight,waist,adher,lifts};
}
function generateCoach(){
  const cur=weekStats(0),prev=weekStats(1);
  const lines=[];const actions=[];
  // entrenos
  const target=DB.mode==='fullbody'?2:(DB.routines.length||3);
  if(cur.sessN>=target)lines.push(`Completaste ${cur.sessN} de ${target} entrenamientos. Gran constancia.`);
  else if(cur.sessN>0)lines.push(`Hiciste ${cur.sessN} de ${target} entrenamientos planificados.`);
  else lines.push(`Esta semana no registraste entrenamientos de fuerza.`);
  // cardio
  if(cur.box+cur.run>0)lines.push(`Sumaste ${cur.box} ${cur.box===1?'sesión':'sesiones'} de boxeo y ${cur.run} ${cur.run===1?'carrera':'carreras'}.`);
  // peso
  if(cur.weight&&prev.weight){const d=+(cur.weight-prev.weight).toFixed(1);if(d<0)lines.push(`Tu peso bajó ${Math.abs(d)} kg respecto a la semana pasada. Vas en la dirección correcta.`);else if(d>0)lines.push(`Tu peso subió ${d} kg. Puede ser agua o comida; mira la tendencia de varias semanas, no un dato.`);else lines.push(`Tu peso se mantuvo estable.`);}
  else if(cur.weight)lines.push(`Peso actual: ${cur.weight} kg. Registra cada semana para ver la tendencia.`);
  else actions.push(`Pésate y mide cintura este domingo para que pueda analizar tu progreso.`);
  // cintura
  if(cur.waist&&prev.waist){const d=+(cur.waist-prev.waist).toFixed(1);if(d<0)lines.push(`Perdiste ${Math.abs(d)} cm de cintura: señal clara de pérdida de grasa.`);else if(d>0)lines.push(`La cintura subió ${d} cm; ojo con la semana.`);}
  // fuerza: comparar lifts
  let mejora=[],estable=[];
  for(const k in cur.lifts){if(prev.lifts[k]){if(cur.lifts[k]>prev.lifts[k])mejora.push(k);else if(cur.lifts[k]===prev.lifts[k])estable.push(k);}}
  if(mejora.length)lines.push(`Mejoraste cargas en: ${mejora.join(', ')}.`);
  if(estable.length)lines.push(`Se mantienen estables: ${estable.join(', ')}.`);
  // adherencia hábitos
  if(cur.adher!=null)lines.push(`Adherencia a hábitos: ${cur.adher}%. ${cur.adher>=85?'Excelente.':cur.adher>=60?'Bien, con margen de mejora.':'Hay que apretar aquí.'}`);
  // ===== ACCIONES para la semana que viene =====
  if(cur.sessN<target)actions.push(`Prioriza cerrar tus ${target} entrenos: bloquéalos en el calendario como citas.`);
  if(mejora.length)actions.push(`En ${mejora[0]} subiste: la próxima semana intenta +2,5 kg manteniendo la técnica.`);
  if(estable.length&&!mejora.length)actions.push(`Llevas estable en ${estable[0]}. Prueba bajar 1-2 reps y subir algo de peso, o mejora el descanso.`);
  if(cur.weight&&prev.weight&&cur.weight>=prev.weight&&cur.waist&&prev.waist&&cur.waist>=prev.waist)actions.push(`El peso y la cintura no bajan. Revisa la comida con sentido común y añade una caminata o carrera extra.`);
  if(cur.box+cur.run===0)actions.push(`Mete al menos 1 sesión de cardio (boxeo o carrera) para acelerar la pérdida de grasa.`);
  if(cur.adher!=null&&cur.adher<60)actions.push(`Elige solo 1-2 hábitos clave y céntrate en no fallar dos días seguidos.`);
  const pains=currentPain();if(pains.length)actions.unshift(`Tienes molestia en ${pains.join(', ')}: baja volumen o cambia ejercicios que carguen esa zona hasta que mejore.`);
  const df=dietFeedback();if(df)actions.unshift('🥗 '+df);
  // foco pérdida de grasa: tendencia de peso y cintura como prioridad
  if(cur.weight&&prev.weight&&cur.weight<prev.weight)lines.unshift(`🎯 Vas perdiendo peso: es tu objetivo principal. Lo demás es secundario.`);
  if(!actions.length)actions.push(`Mantén exactamente lo que haces: está funcionando. Sigue así.`);
  return {lines,actions,cur,prev};
}
function renderCoach(){
  const el=document.getElementById('coachCard');if(!el)return;
  // ¿hay datos suficientes? al menos algún entreno o medición
  const anyData=DB.sessions.length>0||DB.body.length>0;
  if(!anyData){el.innerHTML='';return;}
  const c=generateCoach();
  const wkNum=getWeekNumber();
  el.innerHTML=`<div class="card" style="border-color:var(--acc2)"><h3>🧭 Coach Semanal <span class="tag c2">semana ${wkNum}</span></h3>
    <div style="margin-top:6px">${c.lines.map(l=>`<div style="display:flex;gap:8px;margin-bottom:6px"><span style="color:var(--acc2)">›</span><span style="font-size:14px;line-height:1.4">${l}</span></div>`).join('')}</div>
    <hr><b style="font-family:Anton;color:var(--gold)">🎯 Para la próxima semana</b>
    <div style="margin-top:6px">${c.actions.map(a=>`<div style="display:flex;gap:8px;margin-bottom:6px"><span style="color:var(--gold)">▸</span><span style="font-size:14px;line-height:1.4">${a}</span></div>`).join('')}</div>
    <p class="mini" style="margin-top:10px">Informe generado automáticamente con tus datos. Cuanto más registres (peso, cintura, hábitos, entrenos), más afinado será.</p></div>`;
}
function getWeekNumber(){const d=new Date();const start=new Date(d.getFullYear(),0,1);return Math.ceil(((d-start)/864e5+start.getDay()+1)/7);}

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
  renderSaveBanner();renderWeekChallenge();renderWeeklySummary();renderTodayHero();renderCoach();renderRecovery();renderInsights();renderDietCard();renderGoalProgress();renderBackupReminder();renderCalendar();renderExtraHistory();renderTodayDash();renderWeekView();applyCollapsed();
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
function sessionVolume(s){let v=0;(s.blocks||[]).forEach(b=>b.exercises.forEach(e=>(e.sets||[]).forEach(st=>v+=Math.max(0,+st.kg||0)*(+st.reps||0))));return v;}
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
  if(r){const hasLast=!!lastSessionFor(r.id);
    el.innerHTML=`<div class="mini" style="margin-bottom:8px;letter-spacing:1px">CICLO DE HOY · 🔥 calienta → 💪 entrena → 🧘 recupera</div>
    <div class="day-row"><div class="dd">🔥</div><div class="di"><b>1 · Preparación</b><div class="mini">Calienta 5-8 min antes de cargar</div></div><span style="display:flex;gap:4px"><button class="btn-sm btn2" onclick="startWarmup('${r.id}')">▶ Guiado</button><button class="btn-sm btn2" onclick="warmupVideo('${r.id}')">🎬</button></span></div>
    <div class="day-row" style="margin-top:6px"><div class="dd">💪</div><div class="di"><b>2 · ${r.name}</b><div class="mini">4 bloques · Fuerza · Hipertrofia · Densidad · Finisher</div></div><button class="btn-sm btn-acc2" onclick="startFlow('${r.id}')">Empezar</button></div>
    ${hasLast?`<div class="row" style="margin-top:6px"><button class="btn2" style="flex:1" onclick="repeatLast('${r.id}')">↺ Repetir última</button><button class="btn2" style="flex:1" onclick="repeatProgress('${r.id}')">↺⬆ Repetir y subir</button></div>`:''}
    <div class="day-row" style="border-top:1px solid var(--line);margin-top:8px;padding-top:10px"><div class="dd">🧘</div><div class="di"><b>3 · Recuperación</b><div class="mini">Estirar + abdominales al terminar</div></div><button class="btn-sm btn2" onclick="openRecoveryMenu()">Abrir</button></div>`;}
  else el.innerHTML=`<p class="mini">Hoy (${td}) sin rutina fija. Descanso o empieza una manual:</p><div style="margin-top:8px">${DB.routines.map(x=>`<button class="btn-sm btn2" style="margin:2px" onclick="startFlow('${x.id}')">${x.name}</button>`).join('')}</div><div class="row" style="margin-top:8px"><button class="btn2" style="flex:1" onclick="openRecoveryMenu()">🧘 Estirar / abdominales</button></div>`;
}
function startFlow(rid){window._pendingRid=rid;openModal(`<h3>Modo Atleta</h3><p class="mini" style="margin-bottom:6px">¿Cómo llegas hoy? La sesión se ajusta a tu estado.</p><div class="athlete-opt"><button class="fresco" onclick="pickAthlete('fresco')"><span class="e">🔋</span>Fresco</button><button class="normal" onclick="pickAthlete('normal')"><span class="e">⚡</span>Normal</button><button class="fatigado" onclick="pickAthlete('fatigado')"><span class="e">🪫</span>Fatigado</button></div><p class="mini" style="margin-top:10px">Fresco: +volumen e intensidad · Normal: plan estándar · Fatigado: menos volumen, más descanso, finisher suave.</p>`);}
function pickAthlete(state){DB.athlete=state;closeModal();startSession(window._pendingRid,state);}
function repeatLast(rid){startSession(rid,'normal');toast('↺ Sesión cargada con tus marcas anteriores. A superarlas.');}
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
      // buscar en TODO el histórico, no solo la última sesión de esta rutina.
      // así si moviste un accesorio de PUSH a otro día, sigue recordándolo.
      let prev=null;
      for(const s of DB.sessions){for(const lb of (s.blocks||[])){const le=lb.exercises.find(x=>x.name===e.name);if(le&&le.sets&&le.sets.length){prev=le.sets;break;}}if(prev)break;}
      const baseKg=prev&&prev[0]?prev[0].kg:(e.kg||'');
      return Object.assign({},e,{prev,sets:Array.from({length:e.sets},(_,i)=>{
        const p=prev&&prev[i];
        return {kg:p?p.kg:baseKg,reps:p?p.reps||'':'',done:false,rpe:p?p.rpe||'':''};
      })});
    });
    return b;
  });
  DB.session={routineId:rid,name:r.name,date:today(),athlete:state,startTs:Date.now(),restAccum:0,restTarget:0,blocks};
  save();resetT();document.getElementById('sessionCard').style.display='block';renderSessionHead();renderSessionBody();renderTimerHero();renderTodayReady();document.getElementById('sessionCard').scrollIntoView({behavior:'smooth'});if(DB.settings&&DB.settings.wakeLock)requestWake();
}
function renderSessionHead(){const s=DB.session;const eIc={fresco:'🔋',normal:'⚡',fatigado:'🪫'}[s.athlete]||'';
  const vol=sessionVolume(s);const last=lastSessionFor(s.routineId);const lastVol=last?sessionVolume(last):0;
  let volTxt='';
  if(vol>0){const diff=lastVol>0?Math.round((vol/lastVol-1)*100):null;volTxt=`<div class="mini" style="margin-top:4px">📦 Volumen: <b style="color:var(--acc2)">${vol.toLocaleString('es-ES')} kg</b>${diff!=null?` · ${diff>=0?'+':''}${diff}% vs última (${lastVol.toLocaleString('es-ES')} kg)`:''}</div>`;}
  document.getElementById('sessionHead').innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center"><h3>💪 ${s.name} <span class="tag">${eIc} ${s.athlete||''}</span></h3><button class="btn-sm btn2" onclick="openPlates()" style="padding:6px 10px">🧮 discos</button></div>${volTxt}`;}
function renderSessionBody(){const s=DB.session;if(!s)return;let html='';
  const BLOCK_SUB={fuerza:'Ejercicios principales · sobrecarga progresiva',hipertrofia:'Accesorios y aislamiento',densidad:'Cardio-fuerza · un ejercicio a tope',finisher:'Cierre metabólico'};
  s.blocks.forEach((b,bi)=>{
    const sub=BLOCK_SUB[b.type]||'';
    html+=`<div class="block-head b-${b.type}">${b.label}${sub?`<span class="sub">${sub}${b.superset?' · superserie descanso 30s':''}</span>`:''}</div>`;
    if(b._meta){
      const vidBtn=b._meta.q?`<button class="btn-sm btn2" style="margin-top:8px" onclick="showFormatVideo('${b._meta.q.replace(/'/g,"")}','${b._meta.label.replace(/'/g,"")}')">🎬 Ver cómo se hace</button>`:'';
      html+=`<div class="note ${b.finisher?'gold':''}"><b>${b._meta.label}</b><br>${b._meta.desc}<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px"><button class="btn-sm ${b.finisher?'btn-gold':'btn-acc2'}" onclick="chooseProtocol(${bi})">▶ Cronómetro guiado</button>${vidBtn}</div></div><div id="blockTimer_${bi}"></div>`;
      if(b.density){html+=`<div class="ex-block" style="margin-top:8px"><div class="mini">Apunta tu resultado (reps/rondas/tiempo) para batir tu marca:</div><input id="dens_${bi}" placeholder="ej. 8 rondas / 4:30" value="${b.result||''}" oninput="DB.session.blocks[${bi}].result=this.value;save()" style="margin-top:6px"></div>`;}
      return;
    }
    b.exercises.forEach((ex,ei)=>{
      let prevTxt=ex.prev?`<div class="prev">↺ ${ex.prev.map(p=>`${p.kg||0}×${p.reps||0}`).join(', ')}</div>`:'';
      const showRpe=b.type==='fuerza';
      let sug=progressionTip(ex.name);
      let sugTxt=sug?`<div class="prev" style="color:${sug.level==='pain'?'var(--bad)':'var(--gold)'}">${sug.icon} ${sug.level==='pain'?sug.txt:'Sugerencia: '+sug.txt}</div>`:'';
      const noteVal=DB.exNotes&&DB.exNotes[ex.name]||'';
      const noteTxt=`<input value="${noteVal.replace(/"/g,'&quot;')}" placeholder="📝 nota (agarre, molestia...)" oninput="setExNote('${ex.name.replace(/'/g,"")}',this.value)" style="font-size:12px;padding:7px 10px;margin-top:6px;background:var(--bg)">`;
      const isIso=/plancha|isom|hang|wall ?sit|puente|hollow|dead ?hang|estátic/i.test(ex.name);
      const tempoPreset=ex.tempo||(/tempo/i.test(ex.name)?'3-1-1':null);
      const tempoBtn=isIso
        ? `<button class="btn-sm btn2" style="margin-top:6px" onclick="openIso('${ex.name.replace(/'/g,"")}')">🧊 Isométrico</button>`
        : `<button class="btn-sm btn2" style="margin-top:6px" onclick="openTempo('${ex.name.replace(/'/g,"")}','${tempoPreset||''}')">⏱️ Tempo</button>`;
      const vidBtn=`<button class="btn-sm btn2" style="margin-top:6px" onclick="showExVideo('${ex.name.replace(/'/g,"")}')">🎬 Técnica</button> ${tempoBtn}`;
      const bw=/dominada|fondo|flexi|muscle.?up/i.test(ex.name);
      const bwHint=bw?`<div class="mini" style="margin:-2px 0 6px;color:var(--acc2)">💡 ¿Con goma? Apunta la ayuda en negativo: -15 = la goma te quita ~15 kg. Progresar = menos goma o más reps.</div>`:'';
      html+=`<div class="ex-block ${b.superset?'super':''}"><div class="ex-head"><span class="nm" onclick="exerciseMenu(${bi},${ei})" style="cursor:pointer">${ex.name} ${SUBS[ex.name]?'<span style="color:var(--acc2);font-size:13px">⇄</span>':''} <span style="color:var(--dim);font-size:12px">📊</span></span><span style="display:flex;gap:4px;align-items:center"><button class="btn-sm btn2" style="padding:4px 8px" onclick="moveEx(${bi},${ei},-1)">↑</button><button class="btn-sm btn2" style="padding:4px 8px" onclick="moveEx(${bi},${ei},1)">↓</button></span></div><div class="mini" style="margin:-4px 0 6px">${ex.reps} ${b.type==='fuerza'?'· RPE '+(ex.rpe||8):''} ${ex.rest?'· ⏸'+ex.rest+'s':''}</div>${bwHint}${prevTxt}${sugTxt}<div class="set-head"><span>#</span><span>Kg</span><span>Reps</span><span>${showRpe?'RPE':''}</span><span>✓</span></div>${ex.sets.map((st,j)=>{
        const pv=ex.prev&&ex.prev[j]?ex.prev[j]:null;
        const beat=pv&&(+st.reps||0)>0&&(((+st.kg||0)>0&&(+st.kg)*(+st.reps)>(+pv.kg||0)*(+pv.reps||0))||((+pv.kg||0)<0&&(+st.kg||0)>(+pv.kg)&&(+st.reps)>=(+pv.reps||0)));
        const goal=pv&&(+pv.kg||+pv.reps)?`<span class="mini" style="display:block;font-size:9px;color:${beat?'var(--ok)':'var(--dim)'}">${beat?'✔':'↑'}${pv.kg||0}×${pv.reps||0}</span>`:'';
        return `<div class="set-row"><span class="n" style="${beat?'color:var(--ok)':''}">${j+1}${goal}</span><input type="number" inputmode="decimal" value="${st.kg}" placeholder="${pv&&pv.kg?pv.kg:'kg'}" oninput="setVal(${bi},${ei},${j},'kg',this.value)" ${beat?'style="border-color:var(--ok)"':''}><input type="number" inputmode="numeric" value="${st.reps}" placeholder="${pv&&pv.reps?pv.reps:'reps'}" oninput="setVal(${bi},${ei},${j},'reps',this.value)" ${beat?'style="border-color:var(--ok)"':''}><input type="number" inputmode="numeric" value="${st.rpe||''}" placeholder="${showRpe?'rpe':'-'}" ${showRpe?'':'disabled style=opacity:.3'} oninput="setVal(${bi},${ei},${j},'rpe',this.value)" style="grid-column:span 1"><button class="ok ${st.done?'on':''}" onclick="toggleSet(${bi},${ei},${j})">✓</button></div>`;}).join('')}${vidBtn}${noteTxt}<button class="btn-sm btn2" style="margin-top:6px" onclick="addSet(${bi},${ei})">+ serie</button></div>`;
    });
  });
  document.getElementById('sessionBody').innerHTML=html;
}
function setVal(bi,ei,j,f,v){DB.session.blocks[bi].exercises[ei].sets[j][f]=v;save();renderSessionHead();}
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
/* ===== AUTORREGULACIÓN: analiza notas + RPE + histórico y ajusta peso/reps ===== */
function noteSentiment(t){t=(t||'').toLowerCase();
  if(/duele|dolor|molest|pincha|lesion|lesión|cargad|tir[oó]n|incómod|incomod|fatal|fastidi|pinchazo/.test(t))return 'pain';
  if(/pesad|dif[ií]cil|no pude|no llego|no llegu|fall|flojo|cuesta|duro|dura/.test(t))return 'hard';
  if(/bien|f[aá]cil|sobrad|genial|fuerte|c[oó]modo|top|perfecto/.test(t))return 'good';
  return null;
}
function lastExData(name){
  for(const s of DB.sessions){for(const b of (s.blocks||[])){const e=(b.exercises||[]).find(x=>x.name===name);
    if(e&&e.sets&&e.sets.length){let topKg=0,rpe=0,minReps=Infinity,allReps=true;
      e.sets.forEach(st=>{const k=+st.kg||0,rp=+st.reps||0;if(k>=topKg){topKg=k;if(+st.rpe)rpe=+st.rpe;}if(rp>0)minReps=Math.min(minReps,rp);else allReps=false;});
      return {topKg,rpe,minReps:isFinite(minReps)?minReps:0,allReps,type:b.type};}}}
  return null;
}
function progressionTip(name){
  const sent=noteSentiment(DB.exNotes&&DB.exNotes[name]);
  if(sent==='pain')return {level:'pain',icon:'⚠️',txt:'Molestia anotada. Baja el peso ~15% y cuida la técnica; si sigue doliendo, cámbialo (toca el nombre → ⇄).'};
  const d=lastExData(name);
  if(!d)return sent==='hard'?{level:'tip',icon:'🎯',txt:'La última fue dura: repite el mismo peso y busca 1 rep más.'}:null;
  if(d.topKg>0&&d.rpe>0){
    let base;
    if(d.rpe<=6)base=`fácil la última (RPE ${d.rpe}): sube a ~${Math.round(d.topKg*1.05/1.25)*1.25} kg`;
    else if(d.rpe<=8)base=`RPE ${d.rpe}: repite ~${d.topKg} kg o +2,5`;
    else base=`RPE ${d.rpe}: mantén ${d.topKg} kg y afina la técnica`;
    if(sent==='hard')base=`fue dura: mantén ${d.topKg} kg hasta que salga limpia`;
    return {level:'tip',icon:'🎯',txt:base};
  }
  if(d.topKg>0){
    if(d.allReps&&d.minReps>=12)return {level:'tip',icon:'🎯',txt:`hiciste ${d.minReps}+ reps en todas: sube +2,5 kg y vuelve a 8-10 reps`};
    return {level:'tip',icon:'🎯',txt:`última: ${d.topKg} kg. Suma 1-2 reps en cada serie respecto a la anterior`};
  }
  if(d.minReps>0)return {level:'tip',icon:'🎯',txt:`última: ${d.minReps} reps. Intenta 1-2 más por serie`};
  return null;
}
function toggleSet(bi,ei,j){const ex=DB.session.blocks[bi].exercises[ei];const st=ex.sets[j];st.done=!st.done;
  if(st.done){
    // autocompletar: si no tecleaste nada, asume que repetiste lo de la última vez
    const pv=ex.prev&&ex.prev[j]?ex.prev[j]:null;
    if(!st.kg&&pv&&pv.kg)st.kg=pv.kg;
    if(!st.reps&&pv&&pv.reps)st.reps=pv.reps;
    if(ex.rest){restT(adjRest(ex.rest));}else if(DB.session.blocks[bi].superset){restT(30);}
    beep(1);
  }
  save();renderSessionBody();renderSessionHead();}
function adjRest(r){return DB.session&&DB.session.athlete==='fatigado'?r+20:r;}
function finishSession(){const s=DB.session;if(!s)return;
  // validar que haya algo
  const any=s.blocks.some(b=>b.exercises.some(e=>(e.sets||[]).some(x=>x.kg||x.reps)))||s.blocks.some(b=>b.result);
  if(!any){toast('Anota algo antes de guardar');return;}
  openModal(`<h3>✓ Cerrar sesión</h3><p class="mini" style="margin-bottom:10px">Antes de guardar: ¿cómo ha ido? Esto ayuda al Coach y a tu Recovery Score.</p>
  <label>Sensación general</label><div class="row" style="margin-bottom:8px"><button class="btn-sm btn2" onclick="setSessFeel(this,'mala')">😣 Dura</button><button class="btn-sm btn2" onclick="setSessFeel(this,'normal')">😐 Normal</button><button class="btn-sm btn2" onclick="setSessFeel(this,'buena')">💪 Genial</button></div>
  <label>Nota (opcional)</label><input id="sessNote" placeholder="Ej. hombro algo cargado, gran día...">
  <button class="btn btn-acc2" style="margin-top:14px" onclick="doFinishSession()">Guardar sesión</button>`);
}
let _sessFeel='normal';
function setSessFeel(btn,v){_sessFeel=v;btn.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('btn-acc2'));btn.parentElement.querySelectorAll('button').forEach(b=>b.classList.add('btn2'));btn.classList.remove('btn2');btn.classList.add('btn-acc2');}
function doFinishSession(){const s=DB.session;if(!s)return;
  const note=document.getElementById('sessNote')?document.getElementById('sessNote').value:'';
  let any=false;const blocks=s.blocks.map(b=>({type:b.type,label:b.label,result:b.result||null,meta:b._meta?b._meta.label:null,exercises:b.exercises.map(e=>{const sets=(e.sets||[]).filter(x=>x.kg||x.reps);if(sets.length)any=true;return {name:e.name,reps:e.reps,sets};}).filter(e=>e.sets.length||e.name)}));
  const dur=Math.max(1,Math.round((Date.now()-s.startTs)/60000));
  const restFactor=s.restTarget>0?Math.max(0.8,Math.min(1.2,1+(1-(s.restAccum/s.restTarget)))):1;
  const rec={id:'s'+Date.now(),routineId:s.routineId,name:s.name,date:today(),athlete:s.athlete,duration:dur,restFactor:Math.round(restFactor*100)/100,feel:_sessFeel,note:note||'',blocks};
  rec.density=computeDensity(rec);
  const pr={};DB.sessions.forEach(x=>(x.blocks||[]).forEach(b=>b.exercises.forEach(e=>e.sets.forEach(st=>{const k=+st.kg||0;if(k>0&&(!pr[e.name]||k>pr[e.name]))pr[e.name]=k;}))));
  let np=[];blocks.forEach(b=>b.exercises.forEach(e=>e.sets.forEach(st=>{const k=+st.kg||0;if(k>0&&k>(pr[e.name]||0)&&!np.includes(e.name))np.push(e.name);})));
  blocks.forEach(b=>{if(b.result&&b.meta){const key=b.meta;if(!DB.formatPR[key]||b.result>DB.formatPR[key])DB.formatPR[key]=b.result;}});
  ['Press banca','Sentadilla','Trap bar deadlift'].forEach(n=>{const m=Math.max(maxKg(n),(function(){let mm=0;blocks.forEach(b=>b.exercises.forEach(e=>{if(e.name===n)e.sets.forEach(st=>{if(+st.kg>mm)mm=+st.kg;});}));return mm;})());if(n==='Press banca'&&m>DB.profile.bench)DB.profile.bench=m;if(n==='Sentadilla'&&m>DB.profile.squat)DB.profile.squat=m;});
  const lastPrev=DB.sessions.find(x=>x.routineId===rec.routineId);
  DB.sessions.unshift(rec);DB.session=null;resetT();save();releaseWake();_sessFeel='normal';
  closeModal();document.getElementById('sessionCard').style.display='none';renderTodayReady();renderCycle();renderDashboard();
  const volNow=sessionVolume(rec);const volPrev=lastPrev?sessionVolume(lastPrev):0;
  const volMsg=volPrev>0&&volNow>0?` · Vol ${volNow>volPrev?'+':''}${Math.round((volNow/volPrev-1)*100)}%`:'';
  toast(np.length?`🏆 ¡RÉCORD en ${np[0]}!${volMsg}`:`💪 Guardado${volMsg}`);
  offerRecovery(rec.name);
}
function offerRecovery(sessionName){
  const plan=recoveryPlanFor(sessionName);
  const stMin=Math.round(plan.stretches.reduce((a,p)=>a+p.sec,0)/60);
  const coreMin=Math.round(CORE_SEQ.reduce((a,p)=>a+p.sec,0)/60);
  openModal(`<h3>✅ Sesión completada</h3><p class="mini" style="margin-bottom:12px">Buena sesión. Para recuperar bien, esto es lo que tu cuerpo necesita hoy según lo que has trabajado:</p>
  <div class="ex-block" style="border-color:var(--acc2)"><b>🧘 Estiramientos · ${stMin} min</b><div class="mini" style="margin-top:4px">${plan.lower?'Tren inferior: cuádriceps, isquios, glúteo, cadera, gemelo.':'Tren superior: pecho, dorsal, tríceps, hombro, cuello.'}</div><button class="btn-acc2" style="width:100%;margin-top:8px" onclick="startStretch(${plan.lower})">▶ Empezar estiramientos</button></div>
  ${plan.core?`<div class="ex-block" style="border-color:var(--viol)"><b>🔥 Core · ${coreMin} min</b><div class="mini" style="margin-top:4px">Hoy toca: no cargaste el core directamente y tienes margen esta semana.</div><button class="btn2" style="width:100%;margin-top:8px" onclick="startCore()">▶ Empezar core</button></div>`:`<div class="note" style="border-color:var(--dim)">🔥 Core no necesario hoy${plan.lower?': las piernas ya han cargado bastante el core.':'.'}</div>`}
  <button class="btn2" style="margin-top:10px;width:100%" onclick="closeModal()">Ahora no</button>`);
}
function startStretch(lower){closeModal();const seq=(lower?ST_LOWER:ST_UPPER).map(p=>({...p}));runSequence('Estiramientos',seq,()=>renderDashboard());}
function startCore(){closeModal();runSequence('Core',CORE_SEQ.map(p=>({...p})),()=>{coreDoneToday();renderDashboard();});}
function cancelSession(){DB.session=null;resetT();save();releaseWake();document.getElementById('sessionCard').style.display='none';renderTodayReady();}

/* ===== timers (con barra flotante siempre visible) ===== */
let T={running:false,phase:'idle',sec:0,id:null,elapsed:0,label:''};
function renderTimerHero(){renderFloatTimer();const el=document.getElementById('timerHero');if(!DB.session){if(el)el.innerHTML='';return;}const elapsed=DB.session?Math.floor((Date.now()-DB.session.startTs)/60000):0;if(el)el.innerHTML=`<div class="timer-hero"><div class="phase">⏱ SESIÓN · ${elapsed} min de ~50</div><div class="sub" style="margin-top:4px">El cronómetro de descanso y de cada bloque aparece abajo, siempre visible 👇</div></div>`;}
function renderFloatTimer(){const ft=document.getElementById('floatTimer');if(!ft)return;if(T.phase==='idle'||!T.running&&T.sec===0){ft.classList.remove('on');ft.innerHTML='';return;}const m=Math.floor(T.sec/60),s=T.sec%60;ft.className='on'+(T.phase==='rest'?' rest':'');ft.innerHTML=`<div class="ft-inner"><div class="ft-clock" style="color:${T.phase==='rest'?'var(--acc2)':'var(--acc)'}">${m}:${String(s).padStart(2,'0')}</div><div class="ft-label">${T.phase==='rest'?'descanso':T.label||'en marcha'}</div>${T.running?`<button onclick="pauseT()">⏸</button>`:`<button onclick="resumeT()">▶</button>`}<button onclick="stopT()">✕</button></div>`;}
function tickRest(){T.sec--;if(T.sec<=0){beep(2);stopT();return;}renderFloatTimer();}
function restT(sec){if(DB.session){DB.session.restTarget+=sec;}T.phase='rest';T.sec=sec;T.label='descanso';T.running=true;if(T.id)clearInterval(T.id);T.id=setInterval(()=>{if(DB.session)DB.session.restAccum++;tickRest();},1000);renderFloatTimer();}
function speak(txt){try{if(!DB.settings||DB.settings.voice===false)return;const u=new SpeechSynthesisUtterance(txt);u.lang='es-ES';u.rate=1.05;u.volume=1;speechSynthesis.cancel();speechSynthesis.speak(u);}catch(e){}}

/* Selector de protocolo: el usuario elige cómo quiere que la app le guíe.
   Presets de intervalos habituales + los del propio ejercicio. */
const INTERVAL_PRESETS=[
  {id:'30-10-8',lbl:'Tabata 20/10 ×8',work:20,rest:10,rounds:8},
  {id:'30-30',lbl:'30/30 ×10',work:30,rest:30,rounds:10},
  {id:'40-20',lbl:'40/20 ×8',work:40,rest:20,rounds:8},
  {id:'45-15',lbl:'45/15 ×8',work:45,rest:15,rounds:8},
  {id:'30-10',lbl:'30/10 ×10',work:30,rest:10,rounds:10},
  {id:'60-30',lbl:'60/30 ×6',work:60,rest:30,rounds:6},
  {id:'emom',lbl:'EMOM ×10',kind:'emom',minSec:60,rounds:10},
  {id:'amrap5',lbl:'AMRAP 5 min',kind:'amrap',totalSec:300},
  {id:'amrap8',lbl:'AMRAP 8 min',kind:'amrap',totalSec:480}
];
function chooseProtocol(bi){
  initAudio();
  const meta=DB.session.blocks[bi]._meta;if(!meta)return;
  const own=meta.proto;
  let ownBtn='';
  if(own){const lbl=own.kind==='intervals'?`${own.work}/${own.rest} ×${own.rounds}`:own.kind==='emom'?`EMOM ×${own.rounds}`:own.kind==='amrap'?`AMRAP ${Math.round(own.totalSec/60)}min`:'Como viene';ownBtn=`<button class="btn btn-gold" style="width:100%;margin-bottom:10px" onclick="startBlockTimerCustom(${bi},null)">▶ Usar el del ejercicio (${lbl})</button>`;}
  openModal(`<h3>⏱️ ${meta.label}</h3><p class="mini" style="margin-bottom:10px">Elige cómo quieres que la app te guíe. Te avisará en cada cambio con sonido, vibración y voz.</p>${ownBtn}<div style="font-size:12px;color:var(--dim);margin-bottom:6px">O elige un formato:</div><div style="display:flex;flex-direction:column;gap:6px">${INTERVAL_PRESETS.map((p,i)=>`<button class="btn2" onclick="startBlockTimerCustom(${bi},${i})">${p.lbl}</button>`).join('')}</div>`);
}
function startBlockTimerCustom(bi,presetIdx){
  closeModal();
  const meta=DB.session.blocks[bi]._meta;if(!meta)return;
  if(presetIdx!==null){
    const p=INTERVAL_PRESETS[presetIdx];
    if(p.kind==='emom')meta._activeProto={kind:'emom',minSec:p.minSec,rounds:p.rounds,workName:'Trabajo'};
    else if(p.kind==='amrap')meta._activeProto={kind:'amrap',totalSec:p.totalSec};
    else meta._activeProto={kind:'intervals',work:p.work,rest:p.rest,rounds:p.rounds,workName:'A TOPE',restName:'Descanso'};
  }else{meta._activeProto=meta.proto;}
  startBlockTimer(bi);
}

/* Motor de protocolos: entiende tabata, EMOM, AMRAP, intervalos y timer plano.
   Cambio de fase con sonido fuerte + vibración + voz + barra visual. */
function startBlockTimer(bi){
  initAudio();
  const meta=DB.session.blocks[bi]._meta;if(!meta)return;
  const p=meta._activeProto||meta.proto||{kind:'timer',totalSec:meta.sec||300,direction:meta.timer==='up'?'up':'down'};
  T.phase='format';T.label=meta.label;T.running=true;if(T.id)clearInterval(T.id);
  T._proto=p;T._round=1;T._sub='work';T._bi=bi;
  if(p.kind==='intervals'){T.sec=p.work;T._phaseSec=p.work;speak(`Empieza. Ronda 1. ${p.workName||'Trabajo'}`);}
  else if(p.kind==='emom'){T.sec=p.minSec;T._phaseSec=p.minSec;speak(`Empieza. ${p.workName||''}. Minuto 1`);}
  else if(p.kind==='amrap'){T.sec=p.totalSec;T._phaseSec=p.totalSec;speak('AMRAP. Empieza');}
  else{T.sec=p.direction==='up'?0:p.totalSec;T._phaseSec=p.totalSec;speak('Empieza');}
  T.id=setInterval(()=>tickBlock(),1000);
  beep(2);renderFloatTimer();renderBlockTimerInline(bi);
}
function tickBlock(){
  const p=T._proto;
  if(p.kind==='intervals'){
    T.sec--;
    if(T.sec===3||T.sec===2||T.sec===1){beep(1);try{if(navigator.vibrate)navigator.vibrate(60);}catch(e){}}
    if(T.sec<=0){
      beep(3,true);try{if(navigator.vibrate)navigator.vibrate([200,60,200]);}catch(e){}
      if(T._sub==='work'){
        if(T._round>=p.rounds){finishBlock('¡Tabata completado!');return;}
        T._sub='rest';T.sec=p.rest;T._phaseSec=p.rest;speak(p.restName||'Descanso');
      }else{
        T._round++;T._sub='work';T.sec=p.work;T._phaseSec=p.work;
        if(T._round===p.rounds)speak(`Última ronda. ${p.workName||'Trabajo'}`);
        else speak(`Ronda ${T._round}. ${p.workName||'Trabajo'}`);
      }
    }
  }else if(p.kind==='emom'){
    T.sec--;
    if(T.sec===3||T.sec===2||T.sec===1){beep(1);try{if(navigator.vibrate)navigator.vibrate(60);}catch(e){}}
    if(T.sec<=0){
      beep(3,true);try{if(navigator.vibrate)navigator.vibrate([200,60,200]);}catch(e){}
      if(T._round>=p.rounds){finishBlock('¡EMOM completado!');return;}
      T._round++;T.sec=p.minSec;T._phaseSec=p.minSec;
      if(T._round===p.rounds)speak(`Última ronda. ${p.workName||''}`);
      else speak(`Minuto ${T._round}. ${p.workName||''}`);
    }
  }else if(p.kind==='amrap'){
    T.sec--;
    if(T.sec===60)speak('Un minuto');
    if(T.sec===10)speak('Diez segundos');
    if(T.sec===3||T.sec===2||T.sec===1)beep(1);
    if(T.sec<=0){beep(3);finishBlock('¡Tiempo!');return;}
  }else{ // timer
    if(p.direction==='up'){T.sec++;}
    else{T.sec--;if(T.sec===60)speak('Un minuto');if(T.sec<=0){beep(3);finishBlock('¡Tiempo!');return;}}
  }
  renderFloatTimer();renderBlockTimerInline(T._bi);
}
function finishBlock(msg){clearInterval(T.id);T.running=false;speak(msg);try{if(navigator.vibrate)navigator.vibrate([300,80,300,80,300]);}catch(e){}toast('✅ '+msg);renderBlockTimerInline(T._bi);T.phase='idle';T.sec=0;renderFloatTimer();}
function renderBlockTimerInline(bi){
  const el=document.getElementById('blockTimer_'+bi);if(!el)return;
  if(T.phase!=='format'){el.innerHTML='';return;}
  const p=T._proto||{};const m=Math.floor(T.sec/60),s=T.sec%60;
  const isRest=T._sub==='rest';const color=isRest?'var(--acc2)':(p.kind==='intervals'||p.kind==='emom'?'var(--gold)':'var(--acc)');
  const bgClass=isRest?'rest':'go';
  // barra de progreso
  const total=T._phaseSec||1;const pct=Math.max(0,Math.min(100,Math.round((total-T.sec)/total*100*(isRest||p.direction!=='up'?1:1))));
  let head='',roundInfo='';
  if(p.kind==='intervals'){head=isRest?`😮‍💨 ${p.restName||'DESCANSO'}`:`🔥 ${p.workName||'TRABAJO'}`;roundInfo=`Ronda ${T._round}/${p.rounds}${T._round===p.rounds&&!isRest?' · ÚLTIMA':''}`;}
  else if(p.kind==='emom'){head=`⏱ EMOM · ${p.workName||''}`;roundInfo=`Minuto ${T._round}/${p.rounds}`;}
  else if(p.kind==='amrap'){head='🔥 AMRAP · máximas rondas';roundInfo='cuenta atrás';}
  else{head=p.direction==='up'?'🔥 POR TIEMPO':'🔥 EN MARCHA';roundInfo='';}
  el.innerHTML=`<div class="timer-hero ${bgClass}" style="margin-top:8px"><div class="phase">${head}</div><div class="clock" style="color:${color}">${m}:${String(s).padStart(2,'0')}</div>${roundInfo?`<div class="sub" style="color:${color}">${roundInfo}</div>`:''}<div style="height:6px;background:var(--bg3);border-radius:4px;margin:8px 12px 0"><div style="height:100%;background:${color};border-radius:4px;width:${pct}%;transition:width .3s"></div></div><div class="timer-ctrl">${T.running?`<button class="btn2" onclick="pauseT()">Pausa</button>`:`<button class="btn-acc2" onclick="resumeT()">Seguir</button>`}<button class="btn2" onclick="stopT()">Parar</button></div></div>`;
}
function pauseT(){T.running=false;clearInterval(T.id);renderFloatTimer();}
function resumeT(){if(T.phase==='idle')return;T.running=true;if(T.id)clearInterval(T.id);
  if(T.phase==='format'&&T._proto){T.id=setInterval(()=>tickBlock(),1000);}
  else if(T.phase==='format'&&T.sec===0){T.id=setInterval(()=>{T.sec++;renderFloatTimer();},1000);}
  else{T.id=setInterval(()=>{if(T.phase==='rest'){if(DB.session)DB.session.restAccum++;tickRest();}else{T.sec--;if(T.sec<=0){beep(3);stopT();return;}renderFloatTimer();}},1000);}
  renderFloatTimer();if(T.phase==='format'&&T._proto)renderBlockTimerInline(T._bi);}
function stopT(){clearInterval(T.id);try{speechSynthesis.cancel();}catch(e){}T={running:false,phase:'idle',sec:0,id:null,elapsed:0,label:''};renderFloatTimer();document.querySelectorAll('[id^="blockTimer_"]').forEach(e=>e.innerHTML='');}
function resetT(){clearInterval(T.id);T={running:false,phase:'idle',sec:0,id:null,elapsed:0,label:''};const ft=document.getElementById('floatTimer');if(ft){ft.classList.remove('on');ft.innerHTML='';}}
function showFormatVideo(q,name){openModal(`<h3>🎬 ${name}</h3><p class="mini" style="margin-bottom:12px">Te llevo a la búsqueda exacta en YouTube para ver cómo se hace este formato, con varios vídeos correctos para elegir.</p><a href="https://www.youtube.com/results?search_query=${encodeURIComponent(q)}" target="_blank" style="display:block"><button class="btn btn-acc2" style="width:100%">▶ Ver cómo se hace</button></a><p class="mini" style="margin-top:10px">Necesita conexión a internet.</p>`);}

/* ===================== PROGRESO ===================== */
function allExerciseNames(){const s=new Set();DB.routines.forEach(r=>r.blocks.forEach(b=>b.exercises.forEach(e=>s.add(e.name))));DB.sessions.forEach(x=>(x.blocks||[]).forEach(b=>b.exercises.forEach(e=>s.add(e.name))));return[...s];}
function exerciseHistory(name){const out=[];[...DB.sessions].reverse().forEach(s=>{let found=null;(s.blocks||[]).forEach(b=>{const e=b.exercises.find(x=>x.name===name);if(e)found=e;});if(found){let top=0,tr=0;(found.sets||[]).forEach(st=>{const k=+st.kg||0;if(k>=top){top=k;tr=+st.reps||0;}});out.push({date:s.date,topKg:top,topReps:tr});}});return out;}
function renderProgSelect(){const sel=document.getElementById('progSelect');sel.innerHTML=allExerciseNames().map(n=>`<option>${n}</option>`).join('');renderProgChart();}
function renderProgChart(){const name=document.getElementById('progSelect').value;const h=exerciseHistory(name);const el=document.getElementById('progChart'),st=document.getElementById('progStats');if(!h.length){el.innerHTML='<p class="empty">Sin datos. Entrena este ejercicio.</p>';st.innerHTML='';return;}const max=Math.max(...h.map(x=>x.topKg),1);el.innerHTML=`<div class="chart">${h.slice(-10).map(x=>`<div class="b" style="height:${x.topKg/max*100}%"><em>${x.topKg}</em><span>${x.date.slice(5)}</span></div>`).join('')}</div><div style="height:22px"></div>`;const f=h[0].topKg,l=h[h.length-1].topKg,d=(l-f).toFixed(1);st.innerHTML=`<div class="stat-grid"><div class="stat"><div class="v acc2">${l}</div><div class="l">último kg</div></div><div class="stat"><div class="v gold">${max}</div><div class="l">máximo</div></div><div class="stat"><div class="v" style="${d<0?'color:var(--bad)':'color:var(--acc)'}">${d>=0?'+':''}${d}</div><div class="l">desde inicio</div></div></div>`;}
function renderDensityChart(){const ds=[...DB.sessions].filter(s=>s.density!=null).reverse().slice(-12);const el=document.getElementById('densityChart');if(!ds.length){el.innerHTML='<p class="empty">Completa sesiones para ver tu Density Score.</p>';return;}const max=Math.max(...ds.map(s=>s.density),1);el.innerHTML=`<div class="chart">${ds.map(s=>`<div class="b" style="height:${s.density/max*100}%"><em>${s.density}</em><span>${s.date.slice(5)}</span></div>`).join('')}</div><div style="height:22px"></div>`;}
function renderPR(){const pr={};DB.sessions.forEach(s=>(s.blocks||[]).forEach(b=>b.exercises.forEach(e=>e.sets.forEach(st=>{const k=+st.kg||0;if(k>0&&(!pr[e.name]||k>pr[e.name].kg))pr[e.name]={kg:k,reps:st.reps};}))));const arr=Object.entries(pr).sort((a,b)=>b[1].kg-a[1].kg);document.getElementById('prList').innerHTML=(arr.length?`<table style="width:100%;border-collapse:collapse;font-size:13px">${arr.map(([n,p])=>`<tr><td style="padding:6px;border-top:1px solid var(--line)">${n}</td><td style="padding:6px;border-top:1px solid var(--line);text-align:right"><b style="color:var(--gold)">${p.kg}kg</b></td><td style="padding:6px;border-top:1px solid var(--line);text-align:right;color:var(--dim)">${p.reps} reps</td></tr>`).join('')}</table>`+(arr[0]?`<button class="btn2" style="margin-top:10px;width:100%" onclick="shareAchievement('${arr[0][1].kg} kg en ${arr[0][0].replace(/'/g,'')}','Mi récord personal')">📸 Compartir mi mejor récord</button>`:''):'<p class="empty">Sin récords aún.</p>');}
function renderHistory(){const el=document.getElementById('historyList');el.innerHTML=DB.sessions.length?DB.sessions.slice(0,20).map(s=>`<div class="log-item"><div class="d">${fd(s.date)} · ${s.duration||'?'} min · ⚡${s.density||'—'}</div><div class="t">${s.name} <span class="mini" style="font-family:Barlow">${s.athlete||''}</span></div><details><summary style="cursor:pointer;color:var(--acc2);font-size:12px">ver bloques</summary>${(s.blocks||[]).map(b=>`<div style="margin-top:4px;font-size:13px"><b style="font-family:Anton">${b.label||b.type}</b>${b.result?` · ${b.result}`:''}<br>${b.exercises.map(e=>`${e.name}: ${(e.sets||[]).map(st=>`${st.kg||0}×${st.reps||0}`).join(', ')}`).join('<br>')}</div>`).join('')}</details><button class="btn-sm btn2" style="margin-top:8px" onclick="delSession('${s.id}')">Eliminar</button></div>`).join(''):'<p class="empty">Sin sesiones aún.</p>';}
function delSession(id){DB.sessions=DB.sessions.filter(s=>s.id!==id);save();renderHistory();renderPR();renderProgChart();renderDensityChart();renderDashboard();}

/* ===================== RUTINAS FULL BODY (perder grasa + tonificar, 2 días/semana) ===================== */
/* Enfoque: todo el cuerpo cada sesión, rangos 8-15 reps, descansos cortos, densidad.
   El peso importa menos que hacerlas bien y no fallar los 2 días. Tú eliges los días. */
function fullBodyRoutines(){
  return [
    {id:'fb1',name:'FULL BODY A',day:'',fullbody:true,blocks:[
      {type:'fuerza',label:'💪 Bloque 1 · BÁSICOS',exercises:[
        {name:'Sentadilla goblet',sets:3,reps:'10-12',rest:75,rpe:7,kg:24,note:'Dominante de rodilla. Baja controlado.'},
        {name:'Press banca',sets:3,reps:'8-12',rest:75,rpe:7,kg:DB.profile.bench||60,note:'Empuje horizontal.'},
        {name:'Remo con barra',sets:3,reps:'10-12',rest:75,rpe:7,kg:50,note:'Tirón horizontal. Aprieta escápulas.'}
      ]},
      {type:'hipertrofia',label:'🎯 Bloque 2 · TONIFICAR',superset:true,rest:45,exercises:[
        {name:'Peso muerto rumano',sets:3,reps:'12-15',kg:60,note:'Bisagra de cadera, femoral y glúteo.'},
        {name:'Press militar mancuernas',sets:3,reps:'12-15',kg:14,note:'Empuje vertical.'},
        {name:'Elevaciones laterales',sets:3,reps:'15-20',kg:8,note:'Hombro, estética.'}
      ]},
      {type:'finisher',label:'🔥 Bloque 3 · QUEMA',finisher:true,exercises:[{name:'Finisher metabólico',sets:1,reps:'6-8 min',kg:0}]}
    ]},
    {id:'fb2',name:'FULL BODY B',day:'',fullbody:true,blocks:[
      {type:'fuerza',label:'💪 Bloque 1 · BÁSICOS',exercises:[
        {name:'Peso muerto',sets:3,reps:'8-10',rest:90,rpe:7,kg:DB.profile.dead||90,note:'Bisagra pesada. Técnica primero.'},
        {name:'Dominadas',sets:3,reps:'6-10',rest:75,rpe:7,kg:0,note:'Tirón vertical. Con goma si hace falta (apunta ayuda en negativo).'},
        {name:'Zancada con mancuernas',sets:3,reps:'10-12/pierna',rest:75,rpe:7,kg:14,note:'Unilateral, glúteo y equilibrio.'}
      ]},
      {type:'hipertrofia',label:'🎯 Bloque 2 · TONIFICAR',superset:true,rest:45,exercises:[
        {name:'Press inclinado mancuernas',sets:3,reps:'12-15',kg:18,note:'Pecho alto.'},
        {name:'Curl bíceps',sets:3,reps:'12-15',kg:12,note:'Brazo, estética.'},
        {name:'Plancha',sets:3,reps:'30-45s',kg:0,note:'Core anti-extensión.'}
      ]},
      {type:'finisher',label:'🔥 Bloque 3 · QUEMA',finisher:true,exercises:[{name:'Finisher metabólico',sets:1,reps:'6-8 min',kg:0}]}
    ]}
  ];
}

/* ===================== RUTINAS STRONGMAN (adaptadas a tu nivel) ===================== */
/* Conceptos: full-body, compuestos primero, carries, TUT 40-70s, sobrecarga progresiva.
   Adaptado a definición y material de gym normal + kettlebells. NADA de dopaje ni prácticas extremas. */
function strongRoutines(){
  return [
    {id:'s1',name:'STRONGMAN A · Empuje+Acarreo',day:'Lunes',strong:true,blocks:[
      {type:'fuerza',label:'Bloque 1 · Fuerza compuesta',exercises:[{name:'Press militar de pie',sets:4,reps:'6-8',rest:150,rpe:8,kg:40,note:'Compuesto primero. 65-75% aprox. Técnica estricta.'}]},
      {type:'hipertrofia',label:'Bloque 2 · Hipertrofia TUT (40-70s)',superset:true,rest:60,exercises:[{name:'Press banca tempo 3-1-1',sets:3,reps:'8-10',kg:60,note:'Baja en 3s: alarga el tiempo bajo tensión.'},{name:'Fondos lastrados',sets:3,reps:'8-12',kg:0}]},
      {type:'densidad',label:'Bloque 3 · Carry (agarre+core)',density:true,exercises:[{name:'Farmer walk',sets:1,reps:'4x40m',kg:0}]},
      {type:'finisher',label:'Bloque 4 · Finisher strongman',finisher:true,exercises:[{name:'Finisher',sets:1,reps:'5 min',kg:0}]}
    ]},
    {id:'s2',name:'STRONGMAN B · Tracción+Espalda',day:'Miércoles',strong:true,blocks:[
      {type:'fuerza',label:'Bloque 1 · Fuerza compuesta',exercises:[{name:'Peso muerto',sets:4,reps:'5-6',rest:180,rpe:8,kg:150,note:'Rey del posterior. Progresa 2,5kg cuando cierres las 4 series.'}]},
      {type:'hipertrofia',label:'Bloque 2 · Hipertrofia TUT',superset:true,rest:60,exercises:[{name:'Remo pendlay',sets:4,reps:'8-10',kg:70,note:'Explosivo arriba, controlado abajo.'},{name:'Dominadas lastradas',sets:3,reps:'6-10',kg:0}]},
      {type:'densidad',label:'Bloque 3 · Arrastre/Zercher',density:true,exercises:[{name:'Zercher carry o arrastre',sets:1,reps:'4x30m',kg:0}]},
      {type:'finisher',label:'Bloque 4 · Finisher',finisher:true,exercises:[{name:'Finisher',sets:1,reps:'5 min',kg:0}]}
    ]},
    {id:'s3',name:'STRONGMAN C · Pierna+Full',day:'Sábado',strong:true,blocks:[
      {type:'fuerza',label:'Bloque 1 · Fuerza compuesta',exercises:[{name:'Sentadilla frontal',sets:4,reps:'6-8',rest:150,rpe:8,kg:90,note:'Más torso erguido, brutal para core y cuádriceps.'}]},
      {type:'hipertrofia',label:'Bloque 2 · Hipertrofia TUT',superset:true,rest:60,exercises:[{name:'Zancada caminando',sets:3,reps:'10-12/pierna',kg:20},{name:'Peso muerto rumano tempo',sets:3,reps:'10-12',kg:70,note:'3s en la bajada.'}]},
      {type:'densidad',label:'Bloque 3 · Yoke/Farmer pesado',density:true,exercises:[{name:'Farmer walk pesado',sets:1,reps:'3x30m',kg:0}]},
      {type:'finisher',label:'Bloque 4 · Finisher',finisher:true,exercises:[{name:'Finisher',sets:1,reps:'5 min',kg:0}]}
    ]}
  ];
}

/* ===================== RUTINAS (visual, con sustituciones) ===================== */
function renderRoutines(){const el=document.getElementById('routineList');if(!el)return;
  const isT=DB.mode==='travel',isS=DB.mode==='strong';
  const isFB=DB.mode==='fullbody';
  let head=`<div class="row" style="margin-bottom:8px"><button class="btn-sm ${isFB?'btn-acc2':'btn2'}" style="flex:1" onclick="setMode('fullbody')">🎯 Full Body</button><button class="btn-sm ${DB.mode==='gym'?'btn-acc2':'btn2'}" style="flex:1" onclick="setMode('gym')">🏋️ PPL</button><button class="btn-sm ${isS?'btn-acc2':'btn2'}" style="flex:1" onclick="setMode('strong')">🪨 Strong</button><button class="btn-sm ${isT?'btn-acc2':'btn2'}" style="flex:1" onclick="setMode('travel')">✈️ Viaje</button></div>`;
  if(isFB)head+=`<div class="note" style="margin-bottom:10px;border-color:var(--acc2)">🎯 <b>Full Body — 2 días/semana.</b> Todo el cuerpo en cada sesión, rangos de 8-15 reps y descansos cortos para perder grasa manteniendo músculo. <b>Tú eliges los días</b> según tu semana. El peso no es lo importante: hazlas bien y no falles los 2 días. Alterna A y B.</div>`;
  if(isT)head+=`<div class="note" style="margin-bottom:10px">Modo viaje: rutinas sin gimnasio con peso corporal, comba, bandas + barra y carrera. Ideal para vacaciones.</div>`;
  if(isS)head+=`<div class="note" style="margin-bottom:10px">Modo strongman adaptado a tu nivel: compuestos pesados primero, hipertrofia con tiempo bajo tensión (baja lento) y acarreos (farmer walk, zercher). Full-body, gran gasto y músculo funcional.</div>`;
  const list=DB.routines.map(r=>`<div class="ex-block"><div class="ex-head"><span class="nm">${r.name} <span class="split-tag">${r.day||'📅 tú eliges'}</span></span><span><button class="btn-sm btn2" onclick="editRoutine('${r.id}')">✎</button> <button class="btn-sm btn2" onclick="changeDay('${r.id}')">📅</button> <button class="btn-sm btn2" onclick="startFlow('${r.id}')">▶</button></span></div>${r.blocks.map(b=>`<div class="mini" style="margin-top:4px"><b style="color:var(--acc)">${b.label.replace('Bloque','B').replace(' · ',': ')}</b> ${b.exercises.map(e=>e.name+(SUBS[e.name]?` <span style="color:var(--acc2);cursor:pointer" onclick="showSubs('${e.name.replace(/'/g,"")}')">⇄</span>`:'')).join(' · ')}</div>`).join('')}</div>`).join('');
  const box=`<div class="ex-block" style="border-color:var(--gold);margin-top:6px"><div class="ex-head"><span class="nm">🥊 BOXEO TÉCNICA <span class="split-tag" style="color:var(--gold)">guiado</span></span><button class="btn-sm btn-gold" onclick="startBoxSession()">▶ Empezar</button></div><div class="mini" style="margin-top:4px">5 rounds de 3 min con descanso de 1 min. Sombra, drills 1-2, combate imaginario y ráfagas, con vídeo y campana en cada round. Como tener un entrenador.</div></div>`;
  const reset=`<button class="btn2" style="margin-top:10px;width:100%;font-size:12px" onclick="resetRoutines()">🔄 Restaurar rutinas base de este modo</button><p class="mini" style="margin-top:4px;text-align:center">No borra tu historial de sesiones, solo repone las rutinas por defecto (útil si el orden se descuadró).</p>`;
  el.innerHTML=head+list+box+reset;
}
function resetRoutines(){
  if(!confirm('¿Reponer las rutinas base de este modo? Tu historial de entrenos NO se toca, solo se regeneran las plantillas de rutina.'))return;
  if(DB.mode==='travel')DB.routines=travelRoutines();
  else if(DB.mode==='fullbody')DB.routines=fullBodyRoutines();
  else if(DB.mode==='strong'){DB.routines=strongRoutines();DB.strongRoutinesSaved=DB.routines;}
  else{DB.routines=buildRoutines(DB.cycle.rotIndex||0);DB.gymRoutinesSaved=DB.routines;}
  save();renderRoutines();renderTodayReady();toast('🔄 Rutinas base restauradas');
}
function setMode(m){if(DB.mode==='strong')DB.strongRoutinesSaved=DB.routines;if(DB.mode===m){renderRoutines();return;}
  // guardar las rutinas actuales en su cajón antes de cambiar
  if(DB.mode==='travel')DB.travelRoutinesSaved=DB.routines;else if(DB.mode==='strong')DB.strongRoutinesSaved=DB.routines;else if(DB.mode==='fullbody')DB.fbRoutinesSaved=DB.routines;else DB.gymRoutinesSaved=DB.routines;
  DB.mode=m;
  if(m==='travel')DB.routines=DB.travelRoutinesSaved&&DB.travelRoutinesSaved.length?DB.travelRoutinesSaved:travelRoutines();
  else if(m==='strong')DB.routines=DB.strongRoutinesSaved&&DB.strongRoutinesSaved.length?DB.strongRoutinesSaved:strongRoutines();
  else if(m==='fullbody')DB.routines=DB.fbRoutinesSaved&&DB.fbRoutinesSaved.length?DB.fbRoutinesSaved:fullBodyRoutines();
  else DB.routines=DB.gymRoutinesSaved&&DB.gymRoutinesSaved.length?DB.gymRoutinesSaved:buildRoutines(DB.cycle.rotIndex||0);
  save();renderRoutines();renderTodayReady();renderDashboard();toast(m==='travel'?'✈️ Modo viaje':m==='strong'?'🪨 Modo strongman':m==='fullbody'?'🎯 Full Body activado':'🏋️ Modo gym clásico');}
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
function showExVideo(name){const q=encodeURIComponent(name+' técnica ejercicio');openModal(`<h3>🎬 ${name}</h3><p class="mini" style="margin-bottom:12px">Te llevo a la búsqueda exacta en YouTube: verás varios vídeos correctos de este movimiento y eliges el que más te guste.</p><a href="https://www.youtube.com/results?search_query=${q}" target="_blank" style="display:block"><button class="btn btn-acc2" style="width:100%">▶ Ver vídeos de ${name}</button></a><p class="mini" style="margin-top:10px">Necesita conexión a internet.</p>`);}
function renderBoxSession(){
  let card=document.getElementById('boxSessionCard');
  if(!card){card=document.createElement('div');card.id='boxSessionCard';card.className='card';document.getElementById('train-rutinas').appendChild(card);}
  const r=BOX_SESSION.rounds[BX.round];const m=Math.floor(BX.sec/60),s=BX.sec%60;
  const isRest=BX.phase==='rest';
  card.innerHTML=`<h3>🥊 ${BOX_SESSION.name} <span class="tag gold">round ${BX.round+1}/${BOX_SESSION.rounds.length}</span></h3>
    <div class="timer-hero ${isRest?'rest':'go'}"><div class="phase">${isRest?'😮‍💨 DESCANSO':'🥊 '+r.label}</div><div class="clock">${m}:${String(s).padStart(2,'0')}</div><div class="sub">${isRest?'Recupera y respira':r.desc}</div>
    <div class="timer-ctrl">${BX.running?`<button class="btn2" onclick="bxPause()">Pausa</button>`:`<button class="btn-gold" onclick="bxStart()">${BX.sec<BOX_SESSION.workSec&&BX.round===0&&BX.phase==='work'?'Iniciar':'Seguir'}</button>`}<button class="btn2" onclick="bxSkip()">Sig ▶</button><button class="btn2" onclick="bxStop()">Salir</button></div></div>
    ${!isRest?`<div class="video-wrap"><iframe src="https://www.youtube.com/embed/${r.vid}?rel=0&playsinline=1" title="drill" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><a href="https://www.youtube.com/results?search_query=${encodeURIComponent('boxeo '+r.label)}" target="_blank" class="mini" style="display:block;margin-top:4px;color:var(--acc2)">¿El vídeo no corresponde? Buscar otros →</a>`:''}
    <div class="mini" style="margin-top:8px">Rounds: ${BOX_SESSION.rounds.map((x,i)=>`<span class="pill" style="${i===BX.round?'border-color:var(--gold);color:var(--gold)':''}">${i+1}. ${x.label.split('·')[0].trim()}</span>`).join('')}</div>`;
}
function bxTick(){BX.sec--;if(BX.sec<=0){beep(3);if(BX.phase==='work'){if(BX.round<BOX_SESSION.rounds.length-1){BX.phase='rest';BX.sec=BOX_SESSION.restSec;}else{bxFinish();return;}}else{BX.round++;BX.phase='work';BX.sec=BOX_SESSION.workSec;}}renderBoxSession();}
function bxStart(){BX.running=true;if(BX.id)clearInterval(BX.id);BX.id=setInterval(bxTick,1000);renderBoxSession();}
function bxPause(){BX.running=false;clearInterval(BX.id);renderBoxSession();}
function bxSkip(){beep(1);if(BX.phase==='work'){if(BX.round<BOX_SESSION.rounds.length-1){BX.phase='rest';BX.sec=BOX_SESSION.restSec;}else{bxFinish();return;}}else{BX.round++;BX.phase='work';BX.sec=BOX_SESSION.workSec;}renderBoxSession();}
function bxStop(){clearInterval(BX.id);BX={round:0,phase:'idle',sec:0,id:null,running:false};const c=document.getElementById('boxSessionCard');if(c)c.remove();}
function bxFinish(){clearInterval(BX.id);const d=today();DB.extraLog[d]=DB.extraLog[d]||{};DB.extraLog[d].box=true;save();renderExtra&&renderExtra();renderDashboard();const c=document.getElementById('boxSessionCard');if(c)c.remove();BX={round:0,phase:'idle',sec:0,id:null,running:false};toast('🥊 ¡Sesión de boxeo completa! Registrada.');}

/* ===================== RECOVERY · DELOAD · ESTANCAMIENTO · CICLOS ===================== */
/* Recovery Score diario: combina carga reciente (entreno/boxeo/carrera) y check-in (sueño/estrés/energía) */
function recoveryScore(){
  const d=today();
  // carga: cuántas actividades intensas en los últimos 3 días, ponderadas por intensidad
  let load=0;for(let i=0;i<3;i++){const dd=new Date();dd.setDate(dd.getDate()-i);const ds=dd.toISOString().slice(0,10);
    if(DB.sessions.some(s=>s.date===ds))load+=2;
    const e=DB.extraLog[ds]||{};if(e.box)load+=1.5;if(e.run&&!e.spin)load+=1.5;
    // spinning/remo/cinta: carga real según intensidad de la sesión guardada
    const spins=(DB.spin.history||[]).filter(h=>h.date===ds);spins.forEach(s=>{load+=Math.max(0.4,(s.load||s.min*0.6)/15);});
  }
  const c=DB.checkins[d]||{};
  let score=100;
  score-=Math.min(45,load*7);
  if(c.sleep)score+=(c.sleep-2.5)*8;
  if(c.stress)score-=(c.stress-2)*8;
  if(c.energy)score+=(c.energy-2.5)*6;
  const last=DB.sessions[0];if(last&&last.date>=new Date(Date.now()-2*864e5).toISOString().slice(0,10)){if(last.feel==='mala')score-=10;if(last.feel==='buena')score+=5;}
  return Math.max(5,Math.min(100,Math.round(score)));
}
function recoveryAdvice(s){if(s>=75)return{txt:'Recuperado. Buen día para entrenar fuerte.',col:'var(--ok)'};if(s>=50)return{txt:'Recuperación media. Entrena, pero escucha al cuerpo.',col:'var(--gold)'};return{txt:'Recuperación baja. Considera bajar volumen, quitar el finisher o descansar.',col:'var(--acc)'};}
function renderRecovery(){const el=document.getElementById('recoveryView');if(!el)return;const s=recoveryScore();const a=recoveryAdvice(s);el.innerHTML=`<div style="display:flex;align-items:center;gap:14px"><div style="font-family:Anton;font-size:40px;color:${a.col}">${s}<span class="mini" style="font-size:13px">/100</span></div><div style="flex:1;font-size:13px">${a.txt}</div></div><div class="bar" style="margin-top:8px"><i style="width:${s}%;background:${a.col}"></i></div><p class="mini" style="margin-top:8px">Combina tu carga reciente (entrenos, boxeo, carrera) con tu check-in (sueño, estrés, energía). Rellena el Check-in en Mente para afinarlo.</p>`;}

/* Estancamiento: detecta ejercicios sin mejora en ~3 semanas */
function detectStagnation(){
  const out=[];const names=[...new Set(DB.sessions.flatMap(s=>(s.blocks||[]).filter(b=>b.type==='fuerza').flatMap(b=>b.exercises.map(e=>e.name))))];
  names.forEach(n=>{
    // mejores e1RM por fecha
    const hist=[];DB.sessions.slice().reverse().forEach(s=>{let mx=0;(s.blocks||[]).forEach(b=>b.exercises.forEach(e=>{if(e.name===n)(e.sets||[]).forEach(st=>{const v=e1RM(+st.kg,+st.reps);if(v>mx)mx=v;});}));if(mx>0)hist.push({date:s.date,v:mx});});
    if(hist.length>=3){const last3=hist.slice(-3);const improved=last3[2].v>last3[0].v;if(!improved)out.push({name:n,val:last3[2].v});}
  });
  return out;
}
function renderStagnation(){const el=document.getElementById('stagnationView');if(!el)return;const st=detectStagnation();if(!st.length){el.innerHTML='<p class="empty">Sin estancamientos detectados. Si llevas 3+ sesiones sin mejorar en algún ejercicio, aparecerá aquí con una propuesta.</p>';return;}el.innerHTML=st.map(s=>`<div class="ex-block"><div class="ex-head"><span class="nm">⚠️ ${s.name}</span><span class="mini">~${s.val}kg estable</span></div><p class="mini" style="margin-top:4px">Llevas 3 sesiones sin progresar. Prueba una de estas: bajar a 5-6 reps subiendo algo de peso, cambiar a una variante 2 semanas (p. ej. mancuerna o tempo lento), o asegurar descanso de 2-3 min en las series pesadas.</p></div>`).join('');}

/* Deload: si estás en la última semana del ciclo, sugiere semana ligera */
function renderDeload(){const el=document.getElementById('deloadView');if(!el)return;const w=cycleWeek()+1,total=DB.cycle.weeks;if(w>=total){el.innerHTML=`<div class="note gold">🪶 Estás en la semana ${w} de ${total}: toca <b>descarga</b>. Reduce series un 30-40% y baja un poco el peso esta semana. Recuperar fatiga ahora es lo que te permite seguir progresando. La próxima semana arrancas ciclo nuevo con fuerzas.</div>`;}else{el.innerHTML=`<p class="mini">Semana ${w} de ${total} del ciclo. La semana de descarga llegará en la semana ${total}.</p>`;}}

/* Comparativa de ciclos: resume el ciclo actual vs anterior */
function cycleSessionsFor(rotIndex){return DB.sessions.filter(s=>s._cycle===rotIndex);}
function renderCycleCompare(){const el=document.getElementById('cycleCompareView');if(!el)return;
  // agrupar sesiones por bloques de 'weeks' desde el inicio
  if(DB.sessions.length<3){el.innerHTML='<p class="empty">Completa más sesiones para comparar ciclos.</p>';return;}
  const wk=DB.cycle.weeks;const start=new Date(DB.cycle.start);
  function stats(sessList){if(!sessList.length)return null;const vol=sessList.reduce((a,s)=>a+(s.blocks||[]).reduce((x,b)=>x+b.exercises.reduce((y,e)=>y+(e.sets||[]).length,0),0),0);const dens=Math.round(sessList.filter(s=>s.density).reduce((a,s)=>a+s.density,0)/Math.max(1,sessList.filter(s=>s.density).length));return {n:sessList.length,vol,dens};}
  // ciclo actual: sesiones desde start; anterior: las 'wk' semanas previas
  const now=new Date();const curSess=DB.sessions.filter(s=>new Date(s.date)>=start);
  const prevStart=new Date(start);prevStart.setDate(prevStart.getDate()-wk*7);
  const prevSess=DB.sessions.filter(s=>new Date(s.date)>=prevStart&&new Date(s.date)<start);
  const cur=stats(curSess),prev=stats(prevSess);
  if(!cur){el.innerHTML='<p class="empty">Sin sesiones en el ciclo actual todavía.</p>';return;}
  el.innerHTML=`<div class="stat-grid"><div class="stat"><div class="v acc2">${cur.n}</div><div class="l">sesiones</div></div><div class="stat"><div class="v acc">${cur.vol}</div><div class="l">series totales</div></div><div class="stat"><div class="v gold">${cur.dens||'—'}</div><div class="l">density medio</div></div></div>${prev?`<p class="mini" style="margin-top:8px">Ciclo anterior: ${prev.n} sesiones, ${prev.vol} series, density ${prev.dens||'—'}. ${cur.vol>prev.vol?'📈 Has subido volumen.':cur.vol<prev.vol?'📉 Menos volumen que el ciclo pasado.':'Volumen estable.'}</p>`:'<p class="mini" style="margin-top:8px">Aún no hay ciclo anterior completo para comparar. Al cerrar este, verás la comparativa.</p>'}`;
}

/* ===================== VOLUMEN MUSCULAR · e1RM · OBJETIVOS ===================== */
/* mapa ejercicio -> grupo muscular (por palabra clave) */
const MUSCLE_MAP=[
  [/sentadilla|squat|prensa|zancada|búlgara|pierna|gemelo|cuádriceps|leg/i,'Pierna'],
  [/peso muerto|deadlift|femoral|glúteo|hip thrust|puente|rumano/i,'Posterior'],
  [/press banca|pecho|flexion|aperturas|pec|chest|press inclinado/i,'Pecho'],
  [/dominada|jalón|remo|espalda|pull|gorila|face pull|encogimiento dorsal/i,'Espalda'],
  [/press militar|hombro|elevaci|arnold|shoulder|press hombro/i,'Hombro'],
  [/curl|bíceps|biceps/i,'Bíceps'],
  [/tríceps|triceps|fondos|press francés|extensión/i,'Tríceps'],
  [/swing|clean|snatch|kettlebell|kb |thruster|burpee|core|plancha|abdom/i,'Full/Core']
];
function muscleOf(name){for(const[re,g]of MUSCLE_MAP){if(re.test(name))return g;}return 'Otros';}
function e1RM(kg,reps){if(!kg||!reps)return 0;if(reps==1)return kg;return Math.round(kg*(1+reps/30));} // Epley
function bestE1RM(name){let best=0;DB.sessions.forEach(s=>(s.blocks||[]).forEach(b=>b.exercises.forEach(e=>{if(e.name===name)(e.sets||[]).forEach(st=>{const v=e1RM(+st.kg,+st.reps);if(v>best)best=v;});})));return best;}
function weekVolume(offset){
  const days=weekRange(offset||0);const vol={};
  DB.sessions.filter(s=>days.includes(s.date)).forEach(s=>(s.blocks||[]).forEach(b=>b.exercises.forEach(e=>{const g=muscleOf(e.name);const sets=(e.sets||[]).filter(st=>st.done||st.kg||st.reps).length;vol[g]=(vol[g]||0)+sets;})));
  return vol;
}
function renderVolume(){
  const el=document.getElementById('volumeView');if(!el)return;
  const vol=weekVolume(0);const groups=Object.keys(vol);
  if(!groups.length){el.innerHTML='<p class="empty">Entrena esta semana para ver tu volumen por músculo.</p>';return;}
  const max=Math.max(...Object.values(vol));
  const order=['Pierna','Posterior','Pecho','Espalda','Hombro','Bíceps','Tríceps','Full/Core','Otros'];
  const bars=order.filter(g=>vol[g]).map(g=>{const v=vol[g];const pct=Math.round(v/max*100);return `<div style="margin-bottom:8px"><div style="display:flex;justify-content:space-between"><span style="font-size:13px">${g}</span><span class="mini">${v} series</span></div><div class="bar"><i style="width:${pct}%;background:${v>=12?'var(--ok)':v>=6?'var(--acc)':'var(--gold)'}"></i></div></div>`;}).join('');
  el.innerHTML=bodyMapSVG(vol,max)+bars+`<p class="mini" style="margin-top:8px">Series efectivas de esta semana por grupo. Orientativo: 10-20 series semanales por grupo grande suele ir bien.</p>`;
}
function bodyMapSVG(vol,max){
  const c=g=>{const v=vol[g]||0;if(!v)return '#23262e';const t=v/max;return t>=0.66?'#ff4015':t>=0.33?'#ffc132':'#15e0c0';};
  // colores combinados para zonas compuestas
  const pecho=c('Pecho'),espalda=c('Espalda'),hombro=c('Hombro'),brazo=vol['Bíceps']||vol['Tríceps']?c(vol['Bíceps']>=vol['Tríceps']?'Bíceps':'Tríceps'):'#23262e',pierna=c('Pierna'),post=c('Posterior'),core=c('Full/Core');
  return `<div style="display:flex;justify-content:center;margin-bottom:12px"><svg width="150" height="240" viewBox="0 0 150 240">
    <circle cx="75" cy="22" r="16" fill="#23262e" stroke="#333" stroke-width="1"/>
    <rect x="60" y="40" width="30" height="10" rx="4" fill="${hombro}"/>
    <rect x="44" y="46" width="14" height="12" rx="6" fill="${hombro}"/><rect x="92" y="46" width="14" height="12" rx="6" fill="${hombro}"/>
    <path d="M58 50 H92 V78 H58 Z" fill="${pecho}"/>
    <path d="M58 50 H92 V78 H58 Z" fill="${espalda}" opacity="0.0"/>
    <rect x="60" y="79" width="30" height="26" rx="4" fill="${core}"/>
    <rect x="40" y="58" width="14" height="44" rx="7" fill="${brazo}"/><rect x="96" y="58" width="14" height="44" rx="7" fill="${brazo}"/>
    <rect x="58" y="107" width="15" height="55" rx="6" fill="${pierna}"/><rect x="77" y="107" width="15" height="55" rx="6" fill="${pierna}"/>
    <rect x="58" y="162" width="15" height="50" rx="6" fill="${post}"/><rect x="77" y="162" width="15" height="50" rx="6" fill="${post}"/>
    <text x="75" y="234" text-anchor="middle" fill="#8a8f99" font-size="9" font-family="Barlow">rojo=mucho · amarillo=medio · turquesa=poco</text>
  </svg></div>`;
}
function renderE1RM(){
  const el=document.getElementById('e1rmView');if(!el)return;
  const names=[...new Set(DB.sessions.flatMap(s=>(s.blocks||[]).filter(b=>b.type==='fuerza').flatMap(b=>b.exercises.map(e=>e.name))))];
  if(!names.length){el.innerHTML='<p class="empty">Registra entrenos de fuerza para estimar tu 1RM.</p>';return;}
  const rows=names.map(n=>({n,e:bestE1RM(n)})).filter(r=>r.e>0).sort((a,b)=>b.e-a.e);
  el.innerHTML=rows.map(r=>`<div class="sub-opt"><span>${r.n}</span><span style="font-family:Anton;color:var(--acc2)">${r.e} kg</span></div>`).join('')+`<p class="mini" style="margin-top:8px">Fuerza estimada (1RM) calculada con tus series reales (fórmula de Epley). Sube aunque no hagas un 1RM máximo.</p>`;
}
/* objetivos */
function renderGoals(){
  const el=document.getElementById('goalsView');if(!el)return;
  DB.goals=DB.goals||[];
  if(!DB.goals.length){el.innerHTML='<p class="empty">Sin objetivos aún. Añade el primero (ej. sentadilla 140 kg, 10 dominadas, bajar a 105 kg).</p>';}
  else el.innerHTML=DB.goals.map((g,i)=>{const prog=goalProgress(g);return `<div class="ex-block"><div class="ex-head"><span class="nm">${g.icon||'🎯'} ${g.name}</span><button class="btn-sm btn2" onclick="delGoal(${i})" style="padding:4px 9px;color:var(--bad)">✕</button></div><div class="bar" style="margin-top:6px"><i style="width:${prog.pct}%;background:${prog.pct>=100?'var(--ok)':'var(--acc)'}"></i></div><div class="mini" style="margin-top:4px">${prog.txt}${prog.pct>=100?' · ¡Conseguido! 🎉':''}</div></div>`;}).join('');
  el.innerHTML+=`<button class="btn2" style="margin-top:8px" onclick="openGoalAdd()">+ Nuevo objetivo</button>`;
}
function goalProgress(g){
  let cur=0;
  if(g.type==='lift'){cur=bestE1RM(g.exercise)||maxLift(g.exercise);}
  else if(g.type==='weight'){const w=DB.body.find(b=>b.peso);cur=w?w.peso:DB.profile.weight;}
  else if(g.type==='reps'){cur=g.current||0;}
  else if(g.type==='waist'){const c=DB.body.find(b=>b.cintura);cur=c?c.cintura:0;}
  let pct,txt;
  if(g.type==='weight'||g.type==='waist'){const start=g.start||cur;const total=start-g.target;const done=start-cur;pct=total>0?Math.max(0,Math.min(100,Math.round(done/total*100))):0;txt=`${cur} → meta ${g.target}`;}
  else{pct=g.target>0?Math.min(100,Math.round(cur/g.target*100)):0;txt=`${cur} / ${g.target}`;}
  return {pct,txt};
}
function maxLift(name){let mx=0;DB.sessions.forEach(s=>(s.blocks||[]).forEach(b=>b.exercises.forEach(e=>{if(e.name===name)(e.sets||[]).forEach(st=>{if(+st.kg>mx)mx=+st.kg;});})));return mx;}
function openGoalAdd(){
  openModal(`<h3>🎯 Nuevo objetivo</h3>
  <label>Tipo</label><select id="glType" onchange="goalTypeFields()"><option value="lift">Fuerza en un ejercicio</option><option value="weight">Bajar de peso</option><option value="waist">Reducir cintura</option><option value="reps">Repeticiones (ej. dominadas)</option></select>
  <div id="glFields"></div>
  <button class="btn" style="margin-top:14px" onclick="saveGoal()">Crear objetivo</button>`);
  goalTypeFields();
}
function goalTypeFields(){const t=document.getElementById('glType').value;const el=document.getElementById('glFields');const exNames=[...new Set(DB.sessions.flatMap(s=>(s.blocks||[]).flatMap(b=>b.exercises.map(e=>e.name))))];
  if(t==='lift')el.innerHTML=`<label style="margin-top:8px">Ejercicio</label><input id="glEx" list="glExList" placeholder="Sentadilla"><datalist id="glExList">${exNames.map(n=>`<option>${n}</option>`).join('')}</datalist><label style="margin-top:8px">Peso objetivo (kg)</label><input id="glTarget" type="number" placeholder="140">`;
  else if(t==='reps')el.innerHTML=`<label style="margin-top:8px">Nombre</label><input id="glName" placeholder="Dominadas seguidas"><label style="margin-top:8px">Reps objetivo</label><input id="glTarget" type="number" placeholder="10"><label style="margin-top:8px">Reps actuales</label><input id="glCur" type="number" placeholder="3">`;
  else el.innerHTML=`<label style="margin-top:8px">${t==='weight'?'Peso':'Cintura'} objetivo (${t==='weight'?'kg':'cm'})</label><input id="glTarget" type="number" placeholder="${t==='weight'?'105':'90'}">`;
}
function saveGoal(){const t=document.getElementById('glType').value;const target=+document.getElementById('glTarget').value;if(!target){toast('Pon un valor objetivo');return;}
  let g={type:t,target};
  if(t==='lift'){g.exercise=document.getElementById('glEx').value||'Ejercicio';g.name=`${g.exercise} ${target} kg`;g.icon='🏋️';}
  else if(t==='reps'){g.name=document.getElementById('glName').value||'Reps';g.current=+document.getElementById('glCur').value||0;g.icon='🔢';}
  else if(t==='weight'){const w=DB.body.find(b=>b.peso);g.start=w?w.peso:DB.profile.weight;g.name=`Bajar a ${target} kg`;g.icon='⚖️';}
  else if(t==='waist'){const c=DB.body.find(b=>b.cintura);g.start=c?c.cintura:100;g.name=`Cintura a ${target} cm`;g.icon='📏';}
  DB.goals=DB.goals||[];DB.goals.push(g);save();closeModal();renderGoals();toast('🎯 Objetivo creado');}
function delGoal(i){DB.goals.splice(i,1);save();renderGoals();}
function updGoalReps(){/* para objetivos de reps, permitir actualizar */}

function renderBody(){renderBodyAlert();renderBodyLatest();renderWeightTrend();renderBodyComp();renderMeasHighlight();renderBodySelect();renderBodyPhotos();renderBodyHistory();}
function renderWeightTrend(){
  const el=document.getElementById('weightTrend');if(!el)return;
  const series=[...DB.body].filter(b=>b.peso).sort((a,b)=>a.date.localeCompare(b.date));
  if(series.length<2){el.innerHTML='<p class="empty">Registra el peso al menos 2 veces para ver la tendencia.</p>';return;}
  // media móvil simple sobre los puntos disponibles (suaviza ruido)
  const sm=series.map((p,i)=>{const w=series.slice(Math.max(0,i-2),i+1);return w.reduce((a,x)=>a+x.peso,0)/w.length;});
  const last=series.slice(-10),lastSm=sm.slice(-10);
  const vals=last.map(p=>p.peso).concat(lastSm);const max=Math.max(...vals),min=Math.min(...vals),range=max-min||1;
  el.innerHTML=`<div class="chart">${last.map((p,i)=>{const real=20+((p.peso-min)/range)*80;const smv=20+((lastSm[i]-min)/range)*80;return `<div class="b" style="height:${real}%;opacity:.45"><em>${p.peso}</em><span>${p.date.slice(5)}</span></div>`;}).join('')}</div><div style="height:22px"></div><p class="mini">Barras = peso real. La media móvil suaviza el ruido del día a día: bajó de <b>${sm[0].toFixed(1)}</b> a <b>${sm[sm.length-1].toFixed(1)} kg</b>. Fíjate en la tendencia, no en un día suelto.</p>`;
}
function renderBodyComp(){
  const el=document.getElementById('bodyComp');if(!el)return;
  const last=DB.body[0];
  if(!last||!last.cintura||!last.cuello||!last.peso){el.innerHTML='<p class="empty">Registra peso, cintura y cuello para estimar tu composición corporal.</p>';return;}
  // fórmula US Navy (hombre): %grasa = 86.010*log10(cintura-cuello) - 70.041*log10(altura) + 36.76  (en cm)
  const h=DB.profile.height;const c=last.cintura,n=last.cuello;
  if(c-n<=0){el.innerHTML='<p class="empty">La cintura debe ser mayor que el cuello para estimar.</p>';return;}
  const bf=86.010*Math.log10(c-n)-70.041*Math.log10(h)+36.76;
  const fatKg=last.peso*bf/100, leanKg=last.peso-fatKg;
  // tendencia vs medición anterior con datos
  let trend='';const prev=DB.body.slice(1).find(b=>b.cintura&&b.cuello&&b.peso);
  if(prev){const pbf=86.010*Math.log10(prev.cintura-prev.cuello)-70.041*Math.log10(h)+36.76;const d=(bf-pbf).toFixed(1);trend=`<div class="mini" style="margin-top:6px">${d<0?'↓ Has bajado '+Math.abs(d)+' puntos de grasa estimada':d>0?'↑ Subió '+d+' puntos':'Estable'} desde la medición anterior.</div>`;}
  el.innerHTML=`<div class="stat-grid c2"><div class="stat"><div class="v acc">${bf.toFixed(1)}%</div><div class="l">grasa estimada</div></div><div class="stat"><div class="v acc2">${leanKg.toFixed(1)}</div><div class="l">masa magra kg</div></div></div>${trend}<p class="mini" style="margin-top:8px">Estimación con fórmula US Navy (cintura, cuello, altura). No es exacta como un DEXA, pero sirve muy bien para seguir la tendencia.</p>`;
}
function renderMeasHighlight(){
  const el=document.getElementById('measHighlight');if(!el)return;
  const wins=[];
  MEAS.forEach(m=>{const series=[...DB.body].filter(b=>b[m.k]!=null&&b[m.k]!=='').sort((a,b)=>a.date.localeCompare(b.date));if(series.length>=2){const d=+(series[series.length-1][m.k]-series[0][m.k]).toFixed(1);const good=m.down?d<0:d>0;if(good&&Math.abs(d)>=1)wins.push(`Has ${m.down?'perdido':'ganado'} ${Math.abs(d)} ${m.u} de ${m.l.toLowerCase()} desde que empezaste.`);}});
  if(!wins.length){el.innerHTML='<p class="empty">Sigue registrando: aquí aparecerán tus logros de medidas.</p>';return;}
  el.innerHTML=wins.map(w=>`<div class="note" style="margin-bottom:6px">🎉 ${w}</div>`).join('');
}

/* ===================== CONTROL CORPORAL ===================== */
const MEAS=[{k:'peso',l:'Peso',u:'kg',down:true},{k:'cintura',l:'Cintura',u:'cm',down:true},{k:'cuello',l:'Cuello',u:'cm',down:true},{k:'cadera',l:'Cadera',u:'cm',down:true},{k:'pecho',l:'Pecho',u:'cm',down:false},{k:'brazo',l:'Brazo',u:'cm',down:false},{k:'muslo',l:'Muslo',u:'cm',down:false}];
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
function renderExtra(){const d=today();const e=DB.extraLog[d]||{};const bx=document.getElementById('boxTic'),rn=document.getElementById('runTic');if(bx){bx.classList.toggle('done',!!e.box);document.getElementById('boxTicTxt').textContent=e.box?`✓ Boxeo${e.boxMin?' · '+e.boxMin+' min':''}`:'Hice boxeo hoy';}if(rn){rn.classList.toggle('done',!!e.run);document.getElementById('runTicTxt').textContent=e.run?`✓ Carrera${e.runKm?' · '+e.runKm+' km':''}${e.runMin?' · '+e.runMin+' min':''}${e.runKm&&e.runMin?' · '+(e.runMin/e.runKm).toFixed(1)+' min/km':''}`:'Hice carrera hoy';}}
function toggleExtra(k){const d=today();DB.extraLog[d]=DB.extraLog[d]||{};
  if(DB.extraLog[d][k]){DB.extraLog[d][k]=false;delete DB.extraLog[d][k+'Min'];delete DB.extraLog[d][k+'Int'];delete DB.extraLog[d][k+'Km'];save();renderExtra();renderDashboard();toast('Quitado');return;}
  const isBox=k==='box';
  openModal(`<h3>${isBox?'🥊 Boxeo':'🏃 Carrera'} de hoy</h3><p class="mini" style="margin-bottom:10px">${isBox?'Opcional: duración e intensidad.':'Apunta los kilómetros y minutos: la app calcula tu ritmo y guarda tu histórico.'}</p><div class="row">${isBox?'':'<div><label>Km</label><input id="exKm" type="number" inputmode="decimal" step="0.1" placeholder="8"></div>'}<div><label>Minutos</label><input id="exMin" type="number" inputmode="numeric" placeholder="${isBox?'30':'45'}"></div><div><label>Intensidad</label><select id="exInt"><option>Suave</option><option selected>Media</option><option>Alta</option></select></div></div><button class="btn" style="margin-top:14px" onclick="confirmExtra('${k}')">Guardar</button>`);}
function confirmExtra(k){const d=today();DB.extraLog[d]=DB.extraLog[d]||{};DB.extraLog[d][k]=true;const min=+document.getElementById('exMin').value;const int=document.getElementById('exInt').value;const kmEl=document.getElementById('exKm');const km=kmEl?+kmEl.value:0;if(min)DB.extraLog[d][k+'Min']=min;if(km)DB.extraLog[d][k+'Km']=km;DB.extraLog[d][k+'Int']=int;save();closeModal();renderExtra();renderDashboard();
  const pace=km&&min?` · ${(min/km).toFixed(1)} min/km`:'';
  toast((k==='box'?'🥊 Boxeo':'🏃 Carrera')+' registrado'+(km?` · ${km} km${pace}`:''));}

/* ===================== SISTEMA DE CARRERA (RUNNING) ===================== */
/* Plan inteligente 5K/10K adaptado a Recovery Score y a los días de gym.
   Tipos: rodaje, series, tempo, fartlek, cuestas, técnica, tirada larga, recuperación.
   Integra con gym y boxeo: reparte carga y evita acumular fatiga en la misma semana. */

const RUN_TYPES={
  rodaje:{ic:'🏃',lbl:'Rodaje suave (Z2)',desc:'Ritmo cómodo, podrías hablar. Base aeróbica: quema grasa y prepara la recuperación.',color:'var(--acc2)',fatigue:2},
  tecnica:{ic:'🦵',lbl:'Técnica de carrera',desc:'Skipping alto y bajo, talones al glúteo, saltos, progresivos. Mejora la economía de carrera.',color:'var(--acc2)',fatigue:1},
  recuperacion:{ic:'🌿',lbl:'Recuperación activa',desc:'Trote muy suave o marcha. Descarga sin quedarte parado.',color:'var(--ok)',fatigue:1},
  series:{ic:'⚡',lbl:'Series',desc:'Repeticiones cortas rápidas con descanso: mejora VO2máx y velocidad.',color:'var(--acc)',fatigue:5},
  tempo:{ic:'🔥',lbl:'Tempo',desc:'Ritmo cómodo pero exigente sostenido. Sube el umbral: correrás rápido más tiempo sin ahogarte.',color:'var(--acc)',fatigue:4},
  fartlek:{ic:'🌊',lbl:'Fartlek',desc:'Cambios de ritmo libres: 1 min fuerte + 2 min suave, varias veces. Divertido y muy efectivo.',color:'var(--acc)',fatigue:3},
  cuestas:{ic:'⛰️',lbl:'Cuestas',desc:'Repeticiones cortas subiendo una pendiente. Fuerza específica de piernas para correr.',color:'var(--gold)',fatigue:5},
  larga:{ic:'🛣️',lbl:'Tirada larga',desc:'La sesión más larga de la semana a ritmo cómodo. Construye resistencia.',color:'var(--viol)',fatigue:4},
  gps:{ic:'📍',lbl:'Carrera libre (GPS)',desc:'Carrera medida por GPS.',color:'var(--acc)',fatigue:3}
};

/* Plantillas de sesión por tipo. distancia se ajusta según el objetivo del usuario. */
function runTemplate(type,km){
  const t=RUN_TYPES[type];
  const base={type,ic:t.ic,label:t.lbl,desc:t.desc,color:t.color,fatigue:t.fatigue};
  if(type==='rodaje')return{...base,km,segments:[{lbl:'Rodaje continuo',km,pace:'cómodo'}]};
  if(type==='recuperacion')return{...base,km:Math.max(3,km-2),segments:[{lbl:'Trote muy suave',km:Math.max(3,km-2),pace:'muy suave'}]};
  if(type==='tecnica')return{...base,km:Math.max(3,Math.round(km*0.6)),segments:[
    {lbl:'Calentamiento trote',km:1,pace:'suave'},
    {lbl:'Skipping alto ×4 series de 20m',km:0,pace:'técnica'},
    {lbl:'Talones al glúteo ×4×20m',km:0,pace:'técnica'},
    {lbl:'Saltos alternos ×4×20m',km:0,pace:'técnica'},
    {lbl:'Progresivos ×4×60m',km:0,pace:'crescendo'},
    {lbl:'Vuelta a la calma',km:1,pace:'suave'}
  ]};
  if(type==='series'){const n=km<=5?6:8;return{...base,km:Math.max(4,Math.round(km*0.7)),segments:[
    {lbl:'Calentamiento',km:1.5,pace:'suave'},
    {lbl:`${n} × 400 m fuerte`,km:n*0.4,pace:'fuerte',interval:{work:105,rest:90,rounds:n}},
    {lbl:'Vuelta a la calma',km:1,pace:'suave'}
  ]};}
  if(type==='tempo')return{...base,km,segments:[
    {lbl:'Calentamiento',km:1.5,pace:'suave'},
    {lbl:'Tempo continuo',km:Math.max(2,km-3),pace:'exigente sostenido'},
    {lbl:'Vuelta a la calma',km:1.5,pace:'suave'}
  ]};
  if(type==='fartlek')return{...base,km,segments:[
    {lbl:'Calentamiento',km:1,pace:'suave'},
    {lbl:'6 × (1 min fuerte + 2 min suave)',km:Math.max(3,km-2),pace:'variable',interval:{work:60,rest:120,rounds:6}},
    {lbl:'Vuelta a la calma',km:1,pace:'suave'}
  ]};
  if(type==='cuestas'){const n=6;return{...base,km:Math.max(4,Math.round(km*0.7)),segments:[
    {lbl:'Calentamiento en llano',km:1.5,pace:'suave'},
    {lbl:`${n} × cuesta 45 s + bajada trote`,km:n*0.25,pace:'fuerte cuesta arriba',interval:{work:45,rest:90,rounds:n}},
    {lbl:'Vuelta a la calma',km:1,pace:'suave'}
  ]};}
  if(type==='larga')return{...base,km:Math.round(km*1.3),segments:[{lbl:'Tirada larga continua',km:Math.round(km*1.3),pace:'cómodo estable'}]};
  return{...base,km,segments:[{lbl:'Correr',km,pace:'cómodo'}]};
}

/* ---------- Onboarding ---------- */
function openRunSetup(){
  const r=DB.running;
  openModal(`<h3>🏃 Configura tu running</h3>
  <p class="mini" style="margin-bottom:10px">La app te preparará las sesiones de la semana adaptándolas a tus entrenos de gym y a cómo estés recuperado.</p>
  <label>Objetivo principal</label><select id="rsGoal"><option value="5K" ${r.target==='5K'?'selected':''}>5 km</option><option value="10K" ${r.target==='10K'?'selected':''}>10 km</option></select>
  <label style="margin-top:8px">Días de carrera por semana</label><select id="rsDays"><option value="1" ${r.daysWeek==1?'selected':''}>1 día</option><option value="2" ${r.daysWeek==2?'selected':''}>2 días</option><option value="3" ${r.daysWeek==3?'selected':''}>3 días</option></select>
  <label style="margin-top:8px">Km máximos por sesión (los cortos serán más suaves)</label><select id="rsMax"><option value="5" ${(r.maxKm||8)==5?'selected':''}>5 km</option><option value="7" ${(r.maxKm||8)==7?'selected':''}>7 km</option><option value="8" ${(r.maxKm||8)==8?'selected':''}>8 km</option><option value="10" ${(r.maxKm||8)==10?'selected':''}>10 km</option></select>
  <label style="margin-top:8px">Ritmo aproximado en cómodo (min/km)</label><input id="rsPace" type="number" step="0.1" inputmode="decimal" value="${r.paceEasy||6.0}" placeholder="6.0">
  <button class="btn" style="margin-top:14px" onclick="saveRunSetup()">Guardar y generar plan</button>`);
}
function saveRunSetup(){
  DB.running.setup=true;
  DB.running.target=document.getElementById('rsGoal').value;
  DB.running.daysWeek=+document.getElementById('rsDays').value;
  DB.running.maxKm=+document.getElementById('rsMax').value;
  DB.running.paceEasy=+document.getElementById('rsPace').value||6.0;
  generateRunPlan(true);save();closeModal();renderRunView();toast('🏃 Plan de carrera creado');
}

/* ---------- Planificador inteligente ---------- */
function gymDaysThisWeek(){
  // días de gym previstos según rutinas (día de la semana)
  const set=new Set();DB.routines.forEach(r=>{if(r.day)set.add(r.day);});
  return [...set];
}
function generateRunPlan(force){
  const r=DB.running;if(!r.setup)return;
  const wk=weekDates();const gymD=gymDaysThisWeek();
  const days=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
  // huecos = días sin gym; priorizamos esos. Si no llegan, aceptamos días con gym pero con sesión suave.
  const freeIdx=days.map((d,i)=>({d,i})).filter(x=>!gymD.includes(x.d));
  const slots=[];
  // reparto por número de días: siempre día alterno si es posible
  const nDays=r.daysWeek;
  const pref={1:[3],2:[1,4],3:[0,3,5]}[nDays]||[1,4]; // Mar/Vie/Dom por ejemplo
  pref.forEach(idx=>{const dName=days[idx];if(!gymD.includes(dName))slots.push({dayName:dName,dayIdx:idx,heavy:true});else slots.push({dayName:dName,dayIdx:idx,heavy:false});});
  // decidir tipo: alternamos calidad/suave según objetivo y frecuencia
  const rotation=nDays===1?['tempo']:nDays===2?['series','rodaje']:['series','rodaje','larga'];
  const plan=slots.map((s,i)=>{
    let type=rotation[i%rotation.length];
    if(!s.heavy)type='rodaje'; // día coincidente con gym: siempre suave
    // adaptar km al objetivo
    const km=(function(){const M=r.maxKm||8;if(type==='larga')return M;if(type==='rodaje')return Math.max(4,Math.round(M*0.7));if(type==='tempo')return Math.max(5,Math.round(M*0.85));return Math.max(4,Math.round(M*0.7));})();
    const tpl=runTemplate(type,km);
    return{...s,type,templateKm:km,session:tpl,date:wk[s.dayIdx],done:false};
  });
  DB.running.currentPlan={createdAt:today(),weekStart:wk[0],items:plan};
  save();
}
/* ===================== PLAN DE CARRERA PERIODIZADO (10/15/21K) ===================== */
const RACE_DIST={'10K':{km:10,peakLong:12,ic:'🏃'},'15K':{km:15,peakLong:16,ic:'🏃'},'21K':{km:21.1,peakLong:19,ic:'🏅'}};
function currentWeeklyKm(){
  const h=(DB.running.history||[]).filter(x=>x.km>0);if(!h.length)return 0;
  const now=Date.now();const recent=h.filter(x=>{const d=new Date(x.date);return isFinite(d)&&(now-d)/6048e5<=3;});
  if(!recent.length)return 0;
  return Math.round(recent.reduce((a,x)=>a+x.km,0)/3);
}
function buildRacePlan(distKey,weeks,daysWeek){
  const R=RACE_DIST[distKey]||RACE_DIST['10K'];const peak=R.peakLong;
  const base=currentWeeklyKm();
  let startLong=Math.min(peak,Math.max(6,Math.round(base?base*0.5:6)));
  const taper=weeks>=6?2:1;const buildWeeks=Math.max(1,weeks-taper);
  const qualityRot=['tempo','series','fartlek'];const out=[];
  for(let w=1;w<=weeks;w++){
    let phase,longKm;const sessions=[];const isTaper=w>weeks-taper;
    if(!isTaper){
      const prog=(w-1)/Math.max(1,buildWeeks-1);
      longKm=Math.round(startLong+(peak-startLong)*prog);
      if(w%4===0)longKm=Math.round(longKm*0.8); // semana de descarga
      phase=w<=2?'Base':w<=Math.round(buildWeeks*0.7)?'Construcción':'Pico';
    }else{
      const tw=w-(weeks-taper);
      longKm=Math.round(peak*(taper===2?(tw===1?0.6:0.4):0.5));
      phase='Afinamiento';
    }
    sessions.push({type:'long',km:longKm,lbl:'Tirada larga'});
    if(daysWeek>=2)sessions.push({type:qualityRot[(w-1)%qualityRot.length],km:Math.max(5,Math.round(longKm*0.6)),lbl:'Calidad'});
    if(daysWeek>=3)sessions.push({type:'easy',km:Math.max(4,Math.round(longKm*0.5)),lbl:'Rodaje suave'});
    out.push({n:w,phase,sessions,race:w===weeks});
  }
  out[out.length-1].sessions=[{type:'easy',km:3,lbl:'Activación (2-3 días antes)'},{type:'race',km:R.km,lbl:'🏁 DÍA DE CARRERA · '+distKey}];
  return {distance:distKey,weeks,daysWeek,createdAt:today(),plan:out};
}
function openRacePlanSetup(){
  const base=currentWeeklyKm();
  openModal(`<h3>🏁 Plan de carrera</h3><p class="mini" style="margin-bottom:10px">Plan progresivo desde hoy hasta el día de la carrera: base → construcción → pico → afinamiento. Tiene en cuenta lo que ya corres${base?` (~${base} km/sem)`:''} y sube la carga poco a poco.</p>
  <label>Distancia objetivo</label><select id="rpDist"><option value="10K">10 km</option><option value="15K">15 km</option><option value="21K">21 km (media maratón)</option></select>
  <label style="margin-top:8px">Semanas hasta la carrera</label><select id="rpWeeks"><option value="6">6 semanas</option><option value="8" selected>8 semanas</option><option value="10">10 semanas</option><option value="12">12 semanas</option></select>
  <label style="margin-top:8px">Días de carrera por semana</label><select id="rpDays"><option value="2">2 días</option><option value="3" selected>3 días</option></select>
  <button class="btn" style="margin-top:14px" onclick="genRacePlan()">Generar plan</button>`);
}
function genRacePlan(){
  const dist=document.getElementById('rpDist').value,weeks=+document.getElementById('rpWeeks').value,days=+document.getElementById('rpDays').value;
  DB.running.racePlan=buildRacePlan(dist,weeks,days);save();closeModal();renderRunView();toast('🏁 Plan de '+dist+' creado');
}
function startPlannedRun(type,km){
  if(type==='long'||type==='race'){toast(`Objetivo: ${km} km. Mídelo con 📍 Carrera libre (GPS).`);startGpsRun();return;}
  const map={tempo:'tempo',series:'int400',fartlek:'fartlek',easy:'easy5'};
  if(typeof previewRunWorkout==='function')previewRunWorkout(map[type]||'easy5');else startGpsRun();
}
function renderRacePlan(){
  const rp=DB.running.racePlan;if(!rp)return '';
  return `<div class="card" style="border-color:var(--viol);margin-top:14px"><div style="display:flex;justify-content:space-between;align-items:center"><h3>🏁 Plan ${rp.distance} · ${rp.weeks} sem</h3><button class="btn-sm btn2" onclick="openRacePlanSetup()">Rehacer</button></div>
  <p class="mini" style="margin:4px 0 8px">${rp.daysWeek} días/semana. Corre las largas los días sin gym para no acumular fatiga.</p>
  ${rp.plan.map(w=>`<div class="ex-block" style="margin-top:8px${w.race?';border-color:var(--gold)':''}"><b>Semana ${w.n} · <span style="color:${w.race?'var(--gold)':'var(--viol)'}">${w.phase}</span></b>${w.sessions.map(s=>`<div class="sub-opt"><span>${s.lbl}${s.km?` <span class="mini">${s.km} km</span>`:''}</span>${s.type!=='race'?`<button class="btn-sm btn2" style="padding:3px 8px" onclick="startPlannedRun('${s.type}',${s.km||0})">▶</button>`:'<span>🏁</span>'}</div>`).join('')}</div>`).join('')}
  <p class="mini" style="margin-top:8px;color:var(--dim)">Las tiradas largas y la carrera, con 📍 Carrera libre (GPS). Si un día llegas cansado, cámbialo por rodaje suave: progresar sin lesionarte es lo que cuenta. Orientativo, no plan médico.</p></div>`;
}
/* Adaptación diaria: si Recovery bajo, mutar el tipo del día a algo más suave */
function adaptForToday(item){
  const rc=recoveryScore();const clone=JSON.parse(JSON.stringify(item));
  if(rc<50){
    if(['series','cuestas','tempo'].includes(clone.type)){
      clone.type='rodaje';clone.session=runTemplate('rodaje',Math.max(4,(clone.templateKm||6)-1));
      clone.adapted=`Recovery ${rc}: cambiado a rodaje suave para no acumular fatiga.`;
    }
  }else if(rc<70&&clone.type==='series'){
    clone.type='fartlek';clone.session=runTemplate('fartlek',clone.templateKm||6);
    clone.adapted=`Recovery ${rc}: fartlek en vez de series (menos duro).`;
  }
  return clone;
}

/* ---------- Vista de Carrera (dentro de Entreno) ---------- */
function renderRunView(){
  const el=document.getElementById('runView');if(!el)return;
  const r=DB.running;
  if(!r.setup){el.innerHTML=`<div class="note">Aún no has configurado tu running. Elige tu objetivo (5K o 10K) y cuántos días quieres correr.</div><button class="btn btn-acc2" style="margin-top:10px" onclick="openRunSetup()">🏃 Configurar mi running</button>`;return;}
  // regenerar si la semana ha cambiado
  const wk=weekDates();if(!r.currentPlan||r.currentPlan.weekStart!==wk[0])generateRunPlan();
  const p=r.currentPlan;
  // resumen semanal
  const totalKm=p.items.reduce((a,x)=>a+(x.session.km||0),0);
  const doneKm=p.items.filter(x=>x.done).reduce((a,x)=>a+(x.actualKm||x.session.km||0),0);
  const stats=(function(){const s=r.history;if(!s.length)return null;const best5=s.filter(x=>x.km>=4.8&&x.km<=5.2).sort((a,b)=>a.duration-b.duration)[0];const best10=s.filter(x=>x.km>=9.5&&x.km<=10.5).sort((a,b)=>a.duration-b.duration)[0];return{best5,best10};})();
  let html=`<div class="row" style="margin-bottom:12px"><button class="btn btn-acc" style="flex:1" onclick="openRunWorkouts()">🎯 Entreno guiado</button><button class="btn btn-acc2" style="flex:1" onclick="startGpsRun()">📍 Carrera libre</button></div><div class="stat-grid c2"><div class="stat"><div class="v acc2">${r.target}</div><div class="l">objetivo</div></div><div class="stat"><div class="v acc">${totalKm.toFixed(1)}</div><div class="l">km planificados</div></div></div>`;
  if(stats){html+=`<div class="row" style="margin-top:8px">${stats.best5?`<div class="stat" style="flex:1"><div class="v gold">${paceStr(stats.best5.duration/stats.best5.km)}</div><div class="l">mejor 5K min/km</div></div>`:''}${stats.best10?`<div class="stat" style="flex:1"><div class="v gold">${paceStr(stats.best10.duration/stats.best10.km)}</div><div class="l">mejor 10K min/km</div></div>`:''}</div>`;}
  html+=`<div class="bar" style="margin-top:10px"><i style="width:${totalKm>0?Math.min(100,Math.round(doneKm/totalKm*100)):0}%;background:var(--acc2)"></i></div><p class="mini" style="margin-top:4px">${doneKm.toFixed(1)} / ${totalKm.toFixed(1)} km esta semana</p>`;
  // sesiones
  html+='<div style="margin-top:14px">';
  p.items.forEach((it,idx)=>{
    const t=RUN_TYPES[it.type];const isToday=it.date===today();const adapted=isToday?adaptForToday(it):it;
    html+=`<div class="ex-block" style="border-left:4px solid ${t.color}"><div class="ex-head"><span class="nm">${it.dayName} · ${t.ic} ${t.lbl}</span>${it.done?'<span class="tag" style="color:var(--ok)">✓ hecho</span>':''}</div>`;
    html+=`<div class="mini" style="margin-top:4px">${adapted.session.km} km aprox · ${t.desc}</div>`;
    if(adapted.adapted)html+=`<div class="note" style="margin-top:6px;padding:8px 10px;font-size:12px">🧠 ${adapted.adapted}</div>`;
    if(!it.done){html+=`<div class="row" style="margin-top:8px">${isToday?`<button class="btn-sm btn-acc2" onclick="startRun(${idx})">▶ Empezar</button>`:''}<button class="btn-sm btn2" onclick="viewRun(${idx})">Ver detalle</button><button class="btn-sm btn2" onclick="quickLogRun(${idx})">Registrar sin cronómetro</button></div>`;}
    else{html+=`<div class="mini" style="margin-top:6px">${it.actualKm||0} km en ${Math.round((it.duration||0)/60)} min · ritmo ${paceStr((it.duration||0)/(it.actualKm||1))}</div>`;}
    html+='</div>';
  });
  html+='</div>';
  html+=`<div class="row" style="margin-top:10px"><button class="btn2" style="flex:1" onclick="openRunSetup()">⚙️ Ajustar objetivo</button><button class="btn2" style="flex:1" onclick="regenPlan()">🔄 Replanificar</button></div>`;
  if(!DB.running.racePlan)html+=`<button class="btn btn-viol" style="margin-top:10px;width:100%" onclick="openRacePlanSetup()">🏁 Preparar una carrera (10K · 15K · 21K)</button>`;
  html+=renderRacePlan();
  // últimas carreras
  if(r.history.length){html+=`<div class="card" style="margin-top:14px"><h3>📚 Últimas carreras</h3>${r.history.slice(0,5).map(h=>`<div class="sub-opt"><span>${RUN_TYPES[h.type]?.ic||'🏃'} ${fd(h.date)} · ${h.km} km · ${Math.round(h.duration/60)}min</span><span class="mini">${paceStr(h.duration/h.km)}/km</span></div>`).join('')}</div>`;}
  el.innerHTML=html;
}
function paceStr(secPerKm){if(!secPerKm||!isFinite(secPerKm))return '-';const m=Math.floor(secPerKm/60),s=Math.round(secPerKm%60);return `${m}:${String(s).padStart(2,'0')}`;}
function regenPlan(){generateRunPlan(true);renderRunView();toast('🔄 Plan regenerado');}
function viewRun(idx){const it=DB.running.currentPlan.items[idx];const s=it.session;openModal(`<h3>${RUN_TYPES[it.type].ic} ${RUN_TYPES[it.type].lbl}</h3><p class="mini" style="margin-bottom:10px">${RUN_TYPES[it.type].desc}</p><b style="font-family:Anton">Estructura</b>${s.segments.map(sg=>`<div class="sub-opt"><span>${sg.lbl}</span><span class="mini">${sg.km>0?sg.km.toFixed(1)+' km':''} ${sg.pace}</span></div>`).join('')}<p class="mini" style="margin-top:10px">Total aprox: <b>${s.km} km</b></p>`);}
function quickLogRun(idx){
  const it=DB.running.currentPlan.items[idx];const s=adaptForToday(it).session;
  openModal(`<h3>🏃 Registrar carrera</h3><p class="mini" style="margin-bottom:10px">Si la corriste con reloj/aplicación externa, apunta km y tiempo.</p>
  <div class="row"><div><label>Km</label><input id="qrKm" type="number" step="0.1" inputmode="decimal" value="${s.km}"></div><div><label>Minutos</label><input id="qrMin" type="number" inputmode="numeric" placeholder="${Math.round(s.km*(DB.running.paceEasy||6))}"></div></div>
  <label style="margin-top:8px">Nota (opcional)</label><input id="qrNote" placeholder="Cómo fue">
  <button class="btn" style="margin-top:14px" onclick="saveRunLog(${idx})">Guardar</button>`);
}
function saveRunLog(idx){
  const km=+document.getElementById('qrKm').value||0;const min=+document.getElementById('qrMin').value||0;
  if(!km||!min){toast('Pon km y minutos');return;}
  const note=document.getElementById('qrNote').value||'';
  const it=DB.running.currentPlan.items[idx];
  it.done=true;it.actualKm=km;it.duration=min*60;
  DB.running.history.unshift({date:today(),type:it.type,km,duration:min*60,note});
  // marcar en extraLog para no romper resumen semanal existente
  DB.extraLog[today()]=DB.extraLog[today()]||{};DB.extraLog[today()].run=true;DB.extraLog[today()].runKm=(DB.extraLog[today()].runKm||0)+km;DB.extraLog[today()].runMin=(DB.extraLog[today()].runMin||0)+min;
  save();closeModal();renderRunView();renderDashboard();toast('🏃 Carrera registrada');
}

/* ---------- Ejecutor de carrera con cronómetro e intervalos ---------- */
/* ===================== CARRERA LIBRE CON GPS (Android) ===================== */
let GPS={active:false,watchId:null,tickId:null,startTs:0,pauseAccum:0,paused:false,km:0,pts:[],lastPt:null,splits:[],lastSplitKm:0};
function haversine(a,b){const R=6371e3,t=x=>x*Math.PI/180;const dLat=t(b.lat-a.lat),dLng=t(b.lng-a.lng);const s=Math.sin(dLat/2)**2+Math.cos(t(a.lat))*Math.cos(t(b.lat))*Math.sin(dLng/2)**2;return 2*R*Math.asin(Math.sqrt(s));}
function startGpsRun(){
  if(!navigator.geolocation){toast('Tu navegador no tiene GPS disponible');return;}
  initAudio();
  const ov=ensureRunOverlay();ov.style.display='flex';
  document.getElementById('gpsStat').innerHTML='<div class="mini" style="text-align:center">📡 Buscando señal GPS… sal a cielo abierto y espera unos segundos.</div>';
  GPS={active:true,watchId:null,tickId:null,startTs:Date.now(),pauseAccum:0,paused:false,km:0,pts:[],lastPt:null,splits:[],lastSplitKm:0};
  if(DB.settings&&DB.settings.wakeLock!==false)requestWake();
  speak('Carrera iniciada. Buscando GPS');
  GPS.watchId=navigator.geolocation.watchPosition(onGpsPos,onGpsErr,{enableHighAccuracy:true,maximumAge:1000,timeout:15000});
  GPS.tickId=setInterval(renderGpsLive,1000);
  renderGpsLive();
}
function onGpsPos(pos){
  if(!GPS.active||GPS.paused)return;
  const p={lat:pos.coords.latitude,lng:pos.coords.longitude,t:Date.now(),acc:pos.coords.accuracy};
  if(p.acc&&p.acc>40){return;} // descarta lecturas imprecisas
  if(GPS.lastPt){const d=haversine(GPS.lastPt,p);if(d>1&&d<80){GPS.km+=d/1000;GPS.pts.push(p);
    // split por km
    if(Math.floor(GPS.km)>GPS.lastSplitKm){GPS.lastSplitKm=Math.floor(GPS.km);const elapsed=(Date.now()-GPS.startTs-GPS.pauseAccum)/1000;const prevT=GPS.splits.reduce((a,s)=>a+s,0);GPS.splits.push(elapsed-prevT);beep(2,true);speak(`Kilómetro ${GPS.lastSplitKm}. Ritmo ${paceStr(GPS.splits[GPS.splits.length-1])}`);}
  }}
  GPS.lastPt=p;
}
function onGpsErr(e){const el=document.getElementById('gpsStat');if(el&&GPS.km===0)el.innerHTML=`<div class="mini" style="text-align:center;color:var(--bad)">⚠️ ${e.code===1?'Permiso de ubicación denegado. Actívalo en los ajustes del navegador.':'Señal GPS débil. Sal a cielo abierto.'}</div>`;}
function currentPace(){const el=(Date.now()-GPS.startTs-GPS.pauseAccum)/1000;return GPS.km>0.05?el/GPS.km:0;}
function renderGpsLive(){
  const ov=document.getElementById('runOverlay');if(!ov||!GPS.active)return;
  const el=(Date.now()-GPS.startTs-GPS.pauseAccum)/1000;const m=Math.floor(el/60),s=Math.floor(el%60);
  const pace=currentPace();
  const speed=pace>0?(3600/pace).toFixed(1):'0.0';
  ov.innerHTML=`<div style="width:100%;max-width:440px;text-align:center">
    <div class="mini" style="letter-spacing:2px">📍 CARRERA GPS${GPS.paused?' · EN PAUSA':''}</div>
    <div style="font-family:Anton;font-size:76px;line-height:1;margin:8px 0">${GPS.km.toFixed(2)}<span style="font-size:26px"> km</span></div>
    <div class="stat-grid" style="margin:10px 0"><div class="stat"><div class="v acc">${pace>0?paceStr(pace):'--:--'}</div><div class="l">ritmo min/km</div></div><div class="stat"><div class="v acc2">${m}:${String(s).padStart(2,'0')}</div><div class="l">tiempo</div></div><div class="stat"><div class="v gold">${speed}</div><div class="l">km/h</div></div></div>
    <div id="gpsStat"></div>
    ${GPS.splits.length?`<div class="mini" style="margin-top:8px">Últimos km: ${GPS.splits.slice(-4).map((sp,i)=>`km${GPS.splits.length-GPS.splits.slice(-4).length+i+1} ${paceStr(sp)}`).join(' · ')}</div>`:''}
    <div class="row" style="margin-top:18px;justify-content:center"><button class="btn2" onclick="pauseGps()">${GPS.paused?'▶ Seguir':'⏸ Pausa'}</button><button class="btn-acc" onclick="finishGps()">✓ Terminar</button></div>
  </div>`;
}
function pauseGps(){if(!GPS.active)return;if(GPS.paused){GPS.paused=false;GPS.pauseAccum+=Date.now()-GPS._pauseStart;GPS.lastPt=null;speak('Seguimos');}else{GPS.paused=true;GPS._pauseStart=Date.now();speak('Pausa');}renderGpsLive();}
function finishGps(){
  if(GPS.watchId!=null)navigator.geolocation.clearWatch(GPS.watchId);
  clearInterval(GPS.tickId);GPS.active=false;
  const dur=Math.round((Date.now()-GPS.startTs-GPS.pauseAccum)/1000);const km=+GPS.km.toFixed(2);
  releaseWake();
  const ov=document.getElementById('runOverlay');if(ov)ov.style.display='none';
  if(km<0.1){toast('Carrera muy corta, no se guarda');return;}
  const pace=paceStr(dur/km);
  openModal(`<h3>🏁 Carrera terminada</h3><div class="stat-grid" style="margin:10px 0"><div class="stat"><div class="v acc">${km}</div><div class="l">km</div></div><div class="stat"><div class="v acc2">${Math.floor(dur/60)}:${String(dur%60).padStart(2,'0')}</div><div class="l">tiempo</div></div><div class="stat"><div class="v gold">${pace}</div><div class="l">ritmo</div></div></div><label>RPE (esfuerzo 1-10)</label><input id="gpsRpe" type="number" value="6"><label style="margin-top:8px">Nota</label><input id="gpsNote" placeholder="Cómo fue"><button class="btn btn-acc2" style="margin-top:12px" onclick="saveGpsRun(${km},${dur})">Guardar</button>`);
  speak(`Carrera completada. ${km} kilómetros. Buen trabajo`);beep(3,true);
}
function saveGpsRun(km,dur){
  const rpe=+document.getElementById('gpsRpe').value||6;const note=document.getElementById('gpsNote').value||'';
  DB.running.history.unshift({date:today(),type:'gps',km,duration:dur,rpe,note,splits:GPS.splits.map(s=>Math.round(s)),gps:true});
  DB.extraLog[today()]=DB.extraLog[today()]||{};DB.extraLog[today()].run=true;DB.extraLog[today()].runKm=(DB.extraLog[today()].runKm||0)+km;DB.extraLog[today()].runMin=(DB.extraLog[today()].runMin||0)+Math.round(dur/60);
  save();closeModal();renderRunView();renderDashboard();toast(`🏃 ${km} km guardados · ${paceStr(dur/km)}/km`);
}
function ensureRunOverlay(){let ov=document.getElementById('runOverlay');if(!ov){ov=document.createElement('div');ov.id='runOverlay';ov.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(10,11,15,.98);display:flex;align-items:center;justify-content:center;padding:20px';document.body.appendChild(ov);}return ov;}

/* ===================== CARRERA ESTRUCTURADA (GPS + ritmo objetivo + feedback) ===================== */
/* Ritmo base tomado de TU historial. Nunca impone ritmos irreales.
   Feedback en vivo: 🟢 dentro / 🟡 acelera / 🔴 afloja, con voz. */
function myBasePace(){
  // mediana de ritmo de las carreras guardadas; fallback 6:30/km
  const hist=(DB.running.history||[]).filter(h=>h.km>=1&&h.duration>0);
  if(!hist.length)return 390; // 6:30/km por defecto, prudente
  const paces=hist.map(h=>h.duration/h.km).sort((a,b)=>a-b);
  return Math.round(paces[Math.floor(paces.length/2)]);
}
/* Genera la sesión estructurada. Cada fase: {lbl,kind,km?,sec?,targetLo?,targetHi?,tip} */
function buildRunWorkout(type){
  const base=myBasePace(); // s/km cómodo
  const easy=Math.round(base*1.05), mod=base, fast=Math.round(base*0.88), sprint=Math.round(base*0.80);
  const P=(p)=>paceStr(p);
  const warm={lbl:'CALENTAMIENTO',kind:'warm',sec:480,targetLo:easy+30,targetHi:easy+90,tip:'Trote suave, movilidad y algún progresivo'};
  const cool={lbl:'VUELTA A LA CALMA',kind:'cool',sec:300,targetLo:easy+30,targetHi:easy+120,tip:'Trota muy suave y respira'};
  const rec=(sec)=>({lbl:'RECUPERA',kind:'rest',sec,targetLo:easy+60,targetHi:easy+180,tip:'Trote muy suave o camina'});
  let mid=[];
  if(type==='easy5'){mid=[{lbl:'RODAJE CÓMODO',kind:'work',km:5,targetLo:easy-15,targetHi:easy+30,tip:'Ritmo conversado, sin ahogarte'}];}
  else if(type==='prog5'){mid=[{lbl:'PROGRESIVO 1',kind:'work',km:2,targetLo:easy,targetHi:easy+30,tip:'Empieza cómodo'},{lbl:'PROGRESIVO 2',kind:'work',km:2,targetLo:mod,targetHi:mod+20,tip:'Sube un punto'},{lbl:'PROGRESIVO 3',kind:'work',km:1,targetLo:fast,targetHi:mod,tip:'Termina fuerte'}];}
  else if(type==='int400'){for(let i=1;i<=6;i++){mid.push({lbl:`400 m FUERTE (${i}/6)`,kind:'interval',km:0.4,targetLo:fast-10,targetHi:fast+10,tip:'Rápido pero controlado'});if(i<6)mid.push(rec(120));}}
  else if(type==='int800'){for(let i=1;i<=5;i++){mid.push({lbl:`800 m FUERTE (${i}/5)`,kind:'interval',km:0.8,targetLo:fast,targetHi:fast+15,tip:'Ritmo exigente sostenible'});if(i<5)mid.push(rec(150));}}
  else if(type==='tempo'){mid=[{lbl:'TEMPO SOSTENIDO',kind:'work',km:4,targetLo:mod-10,targetHi:mod+10,tip:'Cómodo pero exigente, sin ahogarte'}];}
  else if(type==='fartlek'){for(let i=1;i<=6;i++){mid.push({lbl:`1 min FUERTE (${i}/6)`,kind:'interval',sec:60,targetLo:fast,targetHi:fast+20,tip:'Cambia de ritmo'});mid.push({lbl:'2 min suave',kind:'rest',sec:120,targetLo:easy,targetHi:easy+60,tip:'Recupera trotando'});}}
  else if(type==='tecnica'){mid=[{lbl:'DRILLS + PROGRESIVOS',kind:'work',sec:300,targetLo:easy,targetHi:easy+60,tip:'Skipping, talones, zancada amplia'},{lbl:'CARRERA CONTINUA',kind:'work',km:3,targetLo:easy-10,targetHi:easy+30,tip:'Aplica la técnica'}];}
  else if(type==='long10'){mid=[{lbl:'TIRADA LARGA',kind:'work',km:10,targetLo:easy,targetHi:easy+40,tip:'Ritmo cómodo y constante, construye resistencia'}];}
  return [warm,...mid,cool];
}
const RUN_WORKOUTS=[
  {id:'easy5',ic:'🏃',lbl:'5 km fácil'},
  {id:'prog5',ic:'📈',lbl:'5 km progresivo'},
  {id:'int400',ic:'⚡',lbl:'Intervalos 400 m'},
  {id:'int800',ic:'🔥',lbl:'Intervalos 800 m'},
  {id:'tempo',ic:'🫀',lbl:'Tempo'},
  {id:'fartlek',ic:'🌊',lbl:'Fartlek'},
  {id:'tecnica',ic:'🦵',lbl:'Técnica + carrera'},
  {id:'long10',ic:'🛣️',lbl:'10 km'}
];
function openRunWorkouts(){
  const base=myBasePace();
  const rc=recoveryScore();
  let warn='';
  if(rc<50)warn=`<div class="note" style="border-color:var(--gold);margin-bottom:10px">⚠️ Tu Recovery está bajo (${rc}). Hoy mejor un rodaje fácil que series duras.</div>`;
  openModal(`<h3>🏃 Entrenamiento guiado por GPS</h3><p class="mini" style="margin-bottom:10px">Ritmo objetivo calculado desde tus carreras (tu base: <b>${paceStr(base)}/km</b>). La app te marcará el objetivo de cada bloque y te dirá en vivo si vas 🟢 bien, 🟡 rápido o 🔴 lento.</p>${warn}<div style="display:flex;flex-direction:column;gap:6px">${RUN_WORKOUTS.map(w=>`<button class="btn2" onclick="previewRunWorkout('${w.id}')">${w.ic} ${w.lbl}</button>`).join('')}</div>`);
}
function previewRunWorkout(type){
  const seq=buildRunWorkout(type);const w=RUN_WORKOUTS.find(x=>x.id===type);
  const totalKm=seq.reduce((a,s)=>a+(s.km||0),0);
  openModal(`<h3>${w.ic} ${w.lbl}</h3><p class="mini" style="margin-bottom:10px">Vista previa. Cada bloque con su ritmo objetivo:</p><div style="max-height:280px;overflow:auto">${seq.map(s=>`<div class="sub-opt"><span>${s.lbl} <span class="mini">${s.tip}</span></span><span class="mini">${s.km?s.km+' km':Math.round(s.sec/60)+':'+String(s.sec%60).padStart(2,'0')}${s.targetLo&&s.kind!=='rest'&&s.kind!=='warm'&&s.kind!=='cool'?' · '+paceStr(s.targetHi)+'-'+paceStr(s.targetLo):''}</span></div>`).join('')}</div><p class="mini" style="margin-top:8px">${totalKm>0?'≈ '+totalKm.toFixed(1)+' km + calentamiento':''}</p><button class="btn btn-acc" style="margin-top:12px;width:100%" onclick="startRunWorkout('${type}')">▶ EMPEZAR con GPS</button>`);
}
let RW=null;
function startRunWorkout(type){
  if(!navigator.geolocation){toast('Tu navegador no tiene GPS');return;}
  initAudio();closeModal();
  const phases=buildRunWorkout(type);
  RW={type,phases,idx:0,phaseKm:0,phaseSec:0,phaseStartKm:0,phaseStartTs:Date.now(),lastFb:'',fbTs:0};
  GPS={active:true,watchId:null,tickId:null,startTs:Date.now(),pauseAccum:0,paused:false,km:0,pts:[],lastPt:null,splits:[],lastSplitKm:0,workout:true};
  if(DB.settings&&DB.settings.wakeLock!==false)requestWake();
  const ov=ensureRunOverlay();ov.style.display='flex';
  const ph=phases[0];
  speak(`${ph.lbl}. ${ph.tip}`);beep(2);
  GPS.watchId=navigator.geolocation.watchPosition(onRunWorkoutPos,onGpsErr,{enableHighAccuracy:true,maximumAge:1000,timeout:15000});
  GPS.tickId=setInterval(runWorkoutTick,1000);
  renderRunWorkout();
}
function onRunWorkoutPos(pos){
  if(!GPS.active||GPS.paused)return;
  const p={lat:pos.coords.latitude,lng:pos.coords.longitude,t:Date.now(),acc:pos.coords.accuracy};
  if(p.acc&&p.acc>40)return;
  if(GPS.lastPt){const d=haversine(GPS.lastPt,p);if(d>1&&d<80){GPS.km+=d/1000;RW.phaseKm=GPS.km-RW.phaseStartKm;
    if(Math.floor(GPS.km)>GPS.lastSplitKm){GPS.lastSplitKm=Math.floor(GPS.km);const elapsed=(Date.now()-GPS.startTs-GPS.pauseAccum)/1000;const prevT=GPS.splits.reduce((a,s)=>a+s,0);GPS.splits.push(elapsed-prevT);}
  }}
  GPS.lastPt=p;
}
function phasePace(){const dt=(Date.now()-RW.phaseStartTs)/1000;return RW.phaseKm>0.03?dt/RW.phaseKm:0;}
function runWorkoutTick(){
  if(GPS.paused)return;
  const ph=RW.phases[RW.idx];RW.phaseSec=(Date.now()-RW.phaseStartTs)/1000;
  // ¿fase terminada? por distancia o por tiempo
  const doneKm=ph.km&&RW.phaseKm>=ph.km;
  const doneSec=ph.sec&&RW.phaseSec>=ph.sec;
  if(doneKm||doneSec){nextRunPhase();return;}
  // feedback de ritmo en fases con objetivo de trabajo
  if((ph.kind==='work'||ph.kind==='interval')&&ph.targetLo){
    const pace=phasePace();
    if(pace>0&&Date.now()-RW.fbTs>8000&&RW.phaseKm>0.08){
      let fb;
      if(pace>ph.targetLo+12){fb='slow';}      // más lento que el objetivo (número mayor)
      else if(pace<ph.targetHi-12){fb='fast';} // más rápido
      else fb='ok';
      if(fb!==RW.lastFb){RW.lastFb=fb;RW.fbTs=Date.now();
        if(fb==='slow'){speak('Acelera un poco');beep(1);}
        else if(fb==='fast'){speak('Afloja un poco');beep(1);}
        else{speak('Ritmo perfecto');}
      }
    }
  }
  // aviso de últimos segundos en fases por tiempo
  if(ph.sec){const left=ph.sec-RW.phaseSec;if(left<=3&&left>2){beep(1);}}
  renderRunWorkout();
}
function nextRunPhase(){
  RW.idx++;
  if(RW.idx>=RW.phases.length){finishRunWorkout();return;}
  RW.phaseStartKm=GPS.km;RW.phaseKm=0;RW.phaseStartTs=Date.now();RW.phaseSec=0;RW.lastFb='';RW.fbTs=Date.now();
  const ph=RW.phases[RW.idx];const last=RW.idx===RW.phases.length-1;
  beep(3,true);try{if(navigator.vibrate)navigator.vibrate([200,80,200]);}catch(e){}
  speak(`${ph.lbl}. ${ph.tip}${last?'. Última parte':''}`);
  renderRunWorkout();
}
function fbBadge(){
  if(!RW)return '';const ph=RW.phases[RW.idx];
  if((ph.kind!=='work'&&ph.kind!=='interval')||!ph.targetLo)return '';
  const map={ok:['🟢','DENTRO DEL OBJETIVO','var(--ok)'],fast:['🔴','VAS RÁPIDO · afloja','var(--bad)'],slow:['🟡','VAS LENTO · acelera','var(--gold)']};
  const m=map[RW.lastFb];if(!m)return '';
  return `<div style="font-family:Anton;font-size:20px;color:${m[2]};margin:6px 0">${m[0]} ${m[1]}</div>`;
}
function renderRunWorkout(){
  const ov=document.getElementById('runOverlay');if(!ov||!GPS.active||!RW)return;
  const ph=RW.phases[RW.idx];const col={warm:'var(--acc2)',work:'var(--acc)',interval:'var(--gold)',rest:'var(--ok)',cool:'var(--ok)'}[ph.kind]||'var(--acc)';
  const pace=phasePace();
  const totalT=(Date.now()-GPS.startTs-GPS.pauseAccum)/1000;
  // progreso de fase
  let prog=0,goal='';
  if(ph.km){prog=Math.min(100,RW.phaseKm/ph.km*100);goal=`${RW.phaseKm.toFixed(2)} / ${ph.km} km`;}
  else if(ph.sec){prog=Math.min(100,RW.phaseSec/ph.sec*100);goal=`${Math.floor(RW.phaseSec)} / ${ph.sec}s`;}
  const tgt=ph.targetLo&&(ph.kind==='work'||ph.kind==='interval')?`🎯 ${paceStr(ph.targetHi)}–${paceStr(ph.targetLo)}/km`:'';
  const next=RW.phases[RW.idx+1];
  ov.innerHTML=`<div style="width:100%;max-width:440px;text-align:center">
    <div class="mini" style="letter-spacing:2px">🏃 ${RUN_WORKOUTS.find(w=>w.id===RW.type)?.lbl||''} · fase ${RW.idx+1}/${RW.phases.length}</div>
    <div style="font-family:Anton;font-size:26px;color:${col};margin-top:4px">${ph.lbl}</div>
    <div style="font-size:13px;color:var(--dim);margin:2px 0 6px">${ph.tip}</div>
    ${tgt?`<div class="tag" style="color:var(--gold);font-size:14px">${tgt}</div>`:''}
    ${fbBadge()}
    <div style="font-family:Anton;font-size:60px;line-height:1;margin:6px 0">${pace>0?paceStr(pace):'--:--'}<span style="font-size:20px">/km</span></div>
    <div class="stat-grid" style="margin:8px 0"><div class="stat"><div class="v acc">${GPS.km.toFixed(2)}</div><div class="l">km total</div></div><div class="stat"><div class="v acc2">${Math.floor(totalT/60)}:${String(Math.floor(totalT%60)).padStart(2,'0')}</div><div class="l">tiempo</div></div><div class="stat"><div class="v gold">${goal.split(' / ')[0]}</div><div class="l">en fase</div></div></div>
    <div style="height:10px;background:var(--bg3);border-radius:5px;margin:0 20px"><div style="height:100%;background:${col};border-radius:5px;width:${prog}%;transition:width .3s"></div></div>
    <div class="mini" style="margin-top:6px">${goal}${next?` · sigue: ${next.lbl}`:' · última fase'}</div>
    <div id="gpsStat"></div>
    <div class="row" style="margin-top:14px;justify-content:center"><button class="btn2" onclick="skipRunPhase()">Saltar fase ▶</button><button class="btn2" onclick="pauseRunWorkout()">${GPS.paused?'▶':'⏸'}</button><button class="btn-acc" onclick="stopRunWorkout()">Terminar</button></div>
  </div>`;
}
function skipRunPhase(){if(RW)nextRunPhase();}
function pauseRunWorkout(){if(!GPS.active)return;if(GPS.paused){GPS.paused=false;GPS.pauseAccum+=Date.now()-GPS._pauseStart;GPS.lastPt=null;RW.phaseStartTs+=Date.now()-GPS._pauseStart;speak('Seguimos');}else{GPS.paused=true;GPS._pauseStart=Date.now();speak('Pausa');}renderRunWorkout();}
function stopRunWorkout(){if(!confirm('¿Terminar el entrenamiento?'))return;finishRunWorkout();}
function finishRunWorkout(){
  if(GPS.watchId!=null)navigator.geolocation.clearWatch(GPS.watchId);
  clearInterval(GPS.tickId);GPS.active=false;
  const dur=Math.round((Date.now()-GPS.startTs-GPS.pauseAccum)/1000);const km=+GPS.km.toFixed(2);
  releaseWake();const ov=document.getElementById('runOverlay');if(ov)ov.style.display='none';
  const wlbl=RUN_WORKOUTS.find(w=>w.id===RW.type)?.lbl||'Entrenamiento';
  if(km<0.1){RW=null;toast('Carrera muy corta, no se guarda');return;}
  openModal(`<h3>🏁 ${wlbl}</h3><div class="stat-grid" style="margin:10px 0"><div class="stat"><div class="v acc">${km}</div><div class="l">km</div></div><div class="stat"><div class="v acc2">${Math.floor(dur/60)}:${String(dur%60).padStart(2,'0')}</div><div class="l">tiempo</div></div><div class="stat"><div class="v gold">${paceStr(dur/km)}</div><div class="l">ritmo medio</div></div></div><label>RPE (1-10)</label><input id="gpsRpe" type="number" value="7"><label style="margin-top:8px">Nota</label><input id="gpsNote" placeholder="Cómo fue"><button class="btn btn-acc2" style="margin-top:12px" onclick="saveRunWorkout(${km},${dur})">Guardar</button>`);
  speak(`${wlbl} completado. ${km} kilómetros. Muy bien`);beep(3,true);
}
function saveRunWorkout(km,dur){
  const rpe=+document.getElementById('gpsRpe').value||7;const note=document.getElementById('gpsNote').value||'';
  DB.running.history.unshift({date:today(),type:RW.type,km,duration:dur,rpe,note,splits:GPS.splits.map(s=>Math.round(s)),gps:true,structured:true});
  DB.extraLog[today()]=DB.extraLog[today()]||{};DB.extraLog[today()].run=true;DB.extraLog[today()].runKm=(DB.extraLog[today()].runKm||0)+km;DB.extraLog[today()].runMin=(DB.extraLog[today()].runMin||0)+Math.round(dur/60);
  RW=null;save();closeModal();renderRunView();renderDashboard();toast(`🏃 ${km} km guardados`);
}

/* ===================== RUTINA MATUTINA ===================== */
/* Despertar el cuerpo por la mañana. Reutiliza el motor de secuencias guiadas.
   Dos versiones: exprés (con niños, sin tiempo) y completa. */
const MORNING_QUICK=[
  {lbl:'Respiración profunda',sec:40,tip:'De pie, inhala 4s por nariz, exhala 6s. Activa el cuerpo con calma',kind:'warm'},
  {lbl:'Movilidad de cuello y hombros',sec:45,tip:'Círculos suaves de cuello y hombros, desbloquea la noche',kind:'mobility'},
  {lbl:'Gato-camello',sec:45,tip:'A cuatro patas, arquea y redondea la espalda al ritmo de la respiración',kind:'mobility'},
  {lbl:'Sentadillas suaves',sec:45,tip:'10-12 lentas, despierta piernas y cadera',kind:'activation'},
  {lbl:'Estiramiento global',sec:45,tip:'Brazos al cielo, estírate entero, luego toca el suelo',kind:'stretch'}
];
const MORNING_FULL=[
  {lbl:'Respiración y despertar',sec:60,tip:'Inhala 4s, exhala 6s. Nota cómo el cuerpo se enciende',kind:'warm'},
  {lbl:'Movilidad de cuello',sec:40,tip:'Círculos suaves y oreja al hombro a cada lado',kind:'mobility'},
  {lbl:'Círculos de hombros y brazos',sec:45,tip:'Grandes, adelante y atrás',kind:'mobility'},
  {lbl:'Gato-camello',sec:50,tip:'Moviliza toda la columna con la respiración',kind:'mobility'},
  {lbl:'Rotaciones de cadera',sec:45,tip:'De pie, círculos amplios a cada lado',kind:'mobility'},
  {lbl:'Zancada con rotación',sec:50,tip:'Zancada y gira el torso: abre cadera y espalda',kind:'mobility'},
  {lbl:'Sentadillas al aire',sec:45,tip:'12-15 lentas y profundas',kind:'activation'},
  {lbl:'Plancha suave',sec:35,tip:'Activa el core, cuerpo en línea',kind:'core'},
  {lbl:'Estiramiento global',sec:50,tip:'Estírate entero hacia el cielo y luego al suelo',kind:'stretch'},
  {lbl:'Respiración final',sec:40,tip:'3 respiraciones lentas. Listo para el día',kind:'cool'}
];
function startMorning(full){
  const seq=(full?MORNING_FULL:MORNING_QUICK).map(p=>({...p}));
  runSequence(full?'Rutina matutina completa':'Rutina matutina exprés',seq,()=>{
    DB.morningLog=DB.morningLog||[];if(!DB.morningLog.includes(today()))DB.morningLog.push(today());save();renderMorning();renderDashboard();
  });
}
function renderMorning(){
  const el=document.getElementById('morningView');if(!el)return;
  DB.morningLog=DB.morningLog||[];
  const wk=weekDates();const doneWk=wk.filter(d=>DB.morningLog.includes(d)).length;
  const doneToday=DB.morningLog.includes(today());
  el.innerHTML=`<p class="mini" style="margin-bottom:10px">Despierta el cuerpo nada más levantarte: moviliza articulaciones, activa músculos y arranca el día con energía. La app te guía paso a paso con voz.</p>
  ${doneToday?'<div class="note" style="border-color:var(--ok);margin-bottom:10px">✅ Ya hiciste tu rutina matutina hoy. ¡Bien!</div>':''}
  <div class="row"><button class="btn btn-acc2" style="flex:1" onclick="startMorning(false)">⚡ Exprés · 4 min</button><button class="btn2" style="flex:1" onclick="startMorning(true)">🌅 Completa · 8 min</button></div>
  <div class="mini" style="margin-top:10px">Esta semana: <b>${doneWk}</b> ${doneWk===1?'mañana activada':'mañanas activadas'} 🔥</div>`;
}

/* ===================== RUTINA MATUTINA FIN ===================== */
let RUN={active:false,idx:null,segIdx:0,startTs:0,pauseAccum:0,pauseTs:0,intv:null,phase:'work',phaseSec:0,phaseRound:1,tickId:null};
function startRun(idx){
  const it=DB.running.currentPlan.items[idx];
  RUN={active:true,idx,segIdx:0,startTs:Date.now(),pauseAccum:0,pauseTs:0,intv:null,phase:'work',phaseSec:0,phaseRound:1,tickId:null,session:adaptForToday(it).session};
  DB.running.activeSession={idx,started:Date.now()};save();
  if(DB.settings&&DB.settings.wakeLock)requestWake();
  speak(`Empezamos ${RUN_TYPES[it.type].lbl}. Primer bloque: ${RUN.session.segments[0].lbl}`);
  runStartSegment(0);
  RUN.tickId=setInterval(runTick,1000);
  renderRunLive();
}
function runStartSegment(si){
  RUN.segIdx=si;const seg=RUN.session.segments[si];
  if(seg.interval){RUN.intv=seg.interval;RUN.phase='work';RUN.phaseSec=seg.interval.work;RUN.phaseRound=1;speak('Fuerte');}
  else{RUN.intv=null;speak(seg.lbl);}
  renderRunLive();
}
function runTick(){
  if(!RUN.active)return;
  if(RUN.intv){
    RUN.phaseSec--;
    if(RUN.phaseSec===3||RUN.phaseSec===2||RUN.phaseSec===1)try{if(navigator.vibrate)navigator.vibrate(60);}catch(e){}
    if(RUN.phaseSec<=0){
      beep(3);try{if(navigator.vibrate)navigator.vibrate([200,60,200]);}catch(e){}
      if(RUN.phase==='work'){
        if(RUN.phaseRound>=RUN.intv.rounds){runNextSegment();return;}
        RUN.phase='rest';RUN.phaseSec=RUN.intv.rest;speak('Recupera');
      }else{
        RUN.phaseRound++;RUN.phase='work';RUN.phaseSec=RUN.intv.work;
        if(RUN.phaseRound===RUN.intv.rounds)speak(`Última. Fuerte`);
        else speak(`Serie ${RUN.phaseRound}. Fuerte`);
      }
    }
  }
  renderRunLive();
}
function runNextSegment(){
  if(RUN.segIdx>=RUN.session.segments.length-1){finishRun();return;}
  runStartSegment(RUN.segIdx+1);
}
function renderRunLive(){
  const el=document.getElementById('runLive');if(!el)return;
  if(!RUN.active){el.innerHTML='';return;}
  const seg=RUN.session.segments[RUN.segIdx];
  const elapsed=Math.floor((Date.now()-RUN.startTs-RUN.pauseAccum)/1000);
  const em=Math.floor(elapsed/60),es=elapsed%60;
  let bloq;
  if(RUN.intv){
    const m=Math.floor(RUN.phaseSec/60),s=RUN.phaseSec%60;
    const isWork=RUN.phase==='work';
    bloq=`<div class="timer-hero ${isWork?'go':'rest'}"><div class="phase">${isWork?'🔥 FUERTE':'😮‍💨 RECUPERA'}</div><div class="clock" style="color:${isWork?'var(--acc)':'var(--acc2)'}">${m}:${String(s).padStart(2,'0')}</div><div class="sub">Serie ${RUN.phaseRound}/${RUN.intv.rounds}${RUN.phaseRound===RUN.intv.rounds&&isWork?' · ÚLTIMA':''}</div></div>`;
  }else{
    bloq=`<div class="timer-hero go"><div class="phase">${seg.lbl}</div><div class="clock">${em}:${String(es).padStart(2,'0')}</div><div class="sub">${seg.pace}${seg.km>0?' · ~'+seg.km+' km':''}</div></div>`;
  }
  el.innerHTML=`<div style="margin-bottom:10px">${bloq}<div class="mini" style="text-align:center;margin-top:6px">Segmento ${RUN.segIdx+1}/${RUN.session.segments.length} · total ${em} min</div><div class="row" style="margin-top:8px"><button class="btn2" style="flex:1" onclick="runNextSegment()">Sig ▶</button><button class="btn2" style="flex:1" onclick="finishRun()">✓ Terminar</button></div></div>`;
}
function finishRun(){
  clearInterval(RUN.tickId);
  const dur=Math.floor((Date.now()-RUN.startTs-RUN.pauseAccum)/1000);
  const it=DB.running.currentPlan.items[RUN.idx];const est=it.session.km;
  openModal(`<h3>✓ Carrera terminada</h3><p class="mini" style="margin-bottom:10px">Tiempo total: <b>${Math.floor(dur/60)} min ${dur%60}s</b>. Confirma km reales para calcular tu ritmo.</p><label>Km reales</label><input id="frKm" type="number" step="0.1" value="${est}"><label style="margin-top:8px">Nota</label><input id="frNote" placeholder="Cómo fue">
  <button class="btn btn-acc2" style="margin-top:14px" onclick="saveFinishRun(${dur})">Guardar</button>`);
}
function saveFinishRun(dur){
  const km=+document.getElementById('frKm').value||0;const note=document.getElementById('frNote').value||'';
  if(!km){toast('Pon los km reales');return;}
  const it=DB.running.currentPlan.items[RUN.idx];
  it.done=true;it.actualKm=km;it.duration=dur;
  DB.running.history.unshift({date:today(),type:it.type,km,duration:dur,note});
  DB.extraLog[today()]=DB.extraLog[today()]||{};DB.extraLog[today()].run=true;DB.extraLog[today()].runKm=(DB.extraLog[today()].runKm||0)+km;DB.extraLog[today()].runMin=(DB.extraLog[today()].runMin||0)+Math.round(dur/60);
  DB.running.activeSession=null;RUN={active:false,idx:null,segIdx:0,startTs:0,pauseAccum:0,pauseTs:0,intv:null,phase:'work',phaseSec:0,phaseRound:1,tickId:null};
  releaseWake();save();closeModal();renderRunView();renderDashboard();
  const pace=paceStr(dur/km);toast(`🏃 ${km} km en ${Math.round(dur/60)} min · ${pace}/km`);
}

/* ===================== SPINNING GUIADO ===================== */
/* Genera sesiones según duración + tipo + tu estado (Recovery/fatiga).
   Reutiliza el motor de intervalos por fases con avisos, voz, cuenta atrás de 5s. */

const SPIN_TYPES={
  base:{ic:'🚴',lbl:'Base aeróbica',desc:'Continuo a intensidad moderada. Resistencia y quema de grasa sin machacarte.',load:1.0},
  hiit:{ic:'🔥',lbl:'Intervalos HIIT',desc:'Bloques fuertes y recuperaciones. Máximo gasto en poco tiempo.',load:1.6},
  subida:{ic:'⛰️',lbl:'Simulación de subida',desc:'Resistencia progresiva. Fuerza de piernas sobre la bici.',load:1.4},
  sprints:{ic:'⚡',lbl:'Sprints',desc:'Esfuerzos cortos máximos. Potencia y capacidad anaeróbica.',load:1.5},
  tempo:{ic:'🫀',lbl:'Tempo / umbral',desc:'Bloques largos exigentes pero sostenibles. Sube tu umbral.',load:1.4},
  piramide:{ic:'🔺',lbl:'Pirámide',desc:'Bloques que suben y bajan de duración. Muy completa.',load:1.5},
  regen:{ic:'🌿',lbl:'Regenerativo',desc:'Pedaleo muy suave. Recupera activando la circulación sin fatiga.',load:0.5}
};

/* Construye la secuencia de fases según tipo y minutos. Cada fase: {lbl,sec,rpe,tip,kind} */
function buildSpinSession(type,min){
  const warm={lbl:'CALENTAMIENTO',sec:300,rpe:3,tip:'Pedaleo cómodo, sube poco a poco',kind:'warm'};
  const cool={lbl:'VUELTA A LA CALMA',sec:300,rpe:2,tip:'Baja resistencia, suelta piernas',kind:'cool'};
  // presupuesto de minutos para el cuerpo central (quitando 5+5 de warm/cool si cabe)
  let coreMin=min-10;let hasWarm=true,hasCool=true;
  if(min<=15){coreMin=min-4;warm.sec=120;cool.sec=120;} // sesiones cortas: warm/cool de 2min
  const phases=[];phases.push({...warm});
  let coreSec=coreMin*60;
  const W=(lbl,sec,rpe,tip,kind)=>({lbl,sec,rpe,tip,kind:kind||'work'});
  const R=(sec,rpe=3)=>({lbl:'RECUPERA',sec,rpe,tip:'Baja resistencia y recupera',kind:'rest'});
  if(type==='base'||type==='regen'){
    const rpe=type==='regen'?3:5;phases.push(W('RITMO CONTINUO',coreSec,rpe,type==='regen'?'Pedaleo suave y constante':'Ritmo sostenido cómodo','work'));
  }else if(type==='hiit'){
    // bloques de 30/30 x8 con 3 min suave entre bloques
    let used=0;let block=1;
    while(used<coreSec-120){
      for(let i=0;i<8&&used<coreSec-60;i++){phases.push(W('TRABAJO',30,8,'Fuerte, sube resistencia','work'));phases.push(R(30));used+=60;}
      if(used<coreSec-180){phases.push(W('SUAVE',180,4,'Rueda suave entre bloques','work'));used+=180;block++;}
    }
  }else if(type==='sprints'){
    let used=0;while(used<coreSec-60){phases.push(W('SPRINT',10,10,'¡Todo lo que tengas!','sprint'));phases.push(R(50));used+=60;}
  }else if(type==='subida'){
    let used=0;while(used<coreSec-60){
      phases.push(W('SUBIDA baja',180,5,'Sube resistencia, mantén cadencia','work'));
      phases.push(W('SUBIDA media',180,6,'Más resistencia, sigue firme','work'));
      phases.push(W('SUBIDA alta',120,8,'Resistencia alta, de pie si hace falta','work'));
      phases.push(W('CIMA',60,9,'Máximo esfuerzo, ya casi','sprint'));
      phases.push(R(120));used+=660;
    }
  }else if(type==='tempo'){
    let used=0;while(used<coreSec-180){phases.push(W('RITMO ALTO',Math.min(480,coreSec-used-180),7,'Exigente pero sostenible','work'));used+=480;if(used<coreSec-180){phases.push(R(180));used+=180;}}
  }else if(type==='piramide'){
    const steps=[[60,60],[120,60],[180,60],[240,120],[180,60],[120,60],[60,0]];
    steps.forEach(([w,r])=>{phases.push(W('FUERTE',w,8,'Sube intensidad progresiva','work'));if(r)phases.push(R(r));});
  }
  phases.push({...cool});
  return phases;
}

/* ---- REMO ---- reutiliza el mismo formato de fases {lbl,sec,rpe,tip,kind} ---- */
const ROW_TYPES={
  aerobico:{ic:'🚣',lbl:'Remo aeróbico',desc:'Continuo moderado. Cuerpo entero, bajo impacto.',load:1.1},
  intervalos:{ic:'🔥',lbl:'Remo intervalos',desc:'1 min fuerte / 1 min suave. Potencia aeróbica.',load:1.5},
  piramide:{ic:'🔺',lbl:'Remo pirámide',desc:'Bloques 1-2-3-4-3-2-1 min. Completo.',load:1.5},
  hiit:{ic:'⚡',lbl:'Remo HIIT',desc:'Bloques cortos muy intensos.',load:1.6},
  recup:{ic:'🌿',lbl:'Remo recuperación',desc:'Palada suave y técnica.',load:0.5}
};
function buildRowSession(type,min){
  const W=(lbl,sec,rpe,tip,kind)=>({lbl,sec,rpe,tip,kind:kind||'work'});
  const R=(sec,rpe=3)=>({lbl:'SUAVE',sec,rpe,tip:'Palada suave, recupera',kind:'rest'});
  const phases=[W('CALENTAMIENTO',180,3,'Paladas suaves, técnica','warm')];
  let core=(min-6)*60;
  if(type==='aerobico'||type==='recup'){phases.push(W('REMO CONTINUO',core,type==='recup'?3:5,type==='recup'?'Suave y técnico':'Ritmo sostenido cómodo','work'));}
  else if(type==='intervalos'){let u=0;while(u<core-60){phases.push(W('FUERTE',60,8,'Palada potente','work'));phases.push(R(60));u+=120;}}
  else if(type==='hiit'){let u=0;while(u<core-40){phases.push(W('TRABAJO',40,9,'A tope','sprint'));phases.push(R(80));u+=120;}}
  else if(type==='piramide'){[60,120,180,240,180,120,60].forEach((w,i)=>{phases.push(W('FUERTE',w,8,'Sube intensidad','work'));if(i<6)phases.push(R(60));});}
  phases.push({lbl:'VUELTA A LA CALMA',sec:180,rpe:2,tip:'Palada muy suave',kind:'cool'});
  return phases;
}

/* ---- CINTA / CAMINATA INCLINADA ---- */
const TREAD_TYPES={
  caminata:{ic:'🚶',lbl:'Caminata rápida',desc:'Ritmo vivo en llano. Quema grasa sin impacto.',load:0.7},
  inclinada:{ic:'⛰️',lbl:'Inclinada continua',desc:'Pendiente sostenida. Glúteo y gasto alto.',load:1.1},
  pendiente:{ic:'🔥',lbl:'Intervalos de pendiente',desc:'Alterna pendiente alta y llano.',load:1.3},
  piramide:{ic:'🔺',lbl:'Pirámide inclinación',desc:'Sube y baja la pendiente por bloques.',load:1.3},
  recup:{ic:'🌿',lbl:'Caminata suave',desc:'Paseo de recuperación.',load:0.4}
};
function buildTreadSession(type,min){
  const W=(lbl,sec,rpe,tip,kind)=>({lbl,sec,rpe,tip,kind:kind||'work'});
  const R=(sec)=>({lbl:'LLANO',sec,rpe:3,tip:'Baja pendiente, recupera',kind:'rest'});
  const phases=[W('CALENTAMIENTO',300,3,'Camina cómodo en llano','warm')];
  let core=(min-8)*60;
  if(type==='caminata'||type==='recup'){phases.push(W('RITMO VIVO',core,type==='recup'?3:5,type==='recup'?'Paso tranquilo':'Paso rápido, brazos activos','work'));}
  else if(type==='inclinada'){phases.push(W('INCLINACIÓN',core,6,'Sube la pendiente y mantén el paso','work'));}
  else if(type==='pendiente'){let u=0;while(u<core-120){phases.push(W('PENDIENTE ALTA',120,7,'Sube inclinación, aguanta','work'));phases.push(R(120));u+=240;}}
  else if(type==='piramide'){[[120,3],[120,5],[120,7],[120,8],[120,6],[120,4]].forEach(([s,r])=>phases.push(W(r>=7?'PENDIENTE ALTA':r>=5?'PENDIENTE MEDIA':'PENDIENTE BAJA',s,r,'Ajusta inclinación','work')));}
  phases.push({lbl:'VUELTA A LA CALMA',sec:180,rpe:2,tip:'Camina suave en llano',kind:'cool'});
  return phases;
}

/* ---- BOXEO CARDIO ---- rounds guiados con el mismo motor ---- */
const BOX_TYPES={
  rounds3:{ic:'🥊',lbl:'3 rounds',desc:'Combate de sombra por rounds de 3 min con 1 min de descanso.',load:1.2,rounds:3},
  rounds5:{ic:'🥊',lbl:'5 rounds',desc:'Sesión clásica de 5 rounds. Técnica y cardio.',load:1.5,rounds:5},
  hiit:{ic:'🔥',lbl:'Boxeo HIIT',desc:'30 s ráfagas máximas / 30 s ligero. Quema alta.',load:1.6,rounds:0},
  tecnica:{ic:'🎯',lbl:'Técnica suave',desc:'Rounds suaves centrados en técnica. Recuperación activa.',load:0.7,rounds:3}
};
function buildBoxSession(type,min){
  const W=(lbl,sec,rpe,tip,kind)=>({lbl,sec,rpe,tip,kind:kind||'work'});
  const phases=[W('CALENTAMIENTO',180,3,'Suelta hombros, muévete, sombra suave','warm')];
  if(type==='hiit'){let u=0;const core=(min-6)*60;while(u<core-30){phases.push(W('RÁFAGA',30,9,'Combinaciones rápidas a tope','sprint'));phases.push({lbl:'LIGERO',sec:30,rpe:4,tip:'Sigue moviéndote, suave',kind:'rest'});u+=60;}}
  else{const cfg=BOX_TYPES[type];const rounds=cfg.rounds;const rpe=type==='tecnica'?4:8;for(let r=1;r<=rounds;r++){phases.push(W('ROUND '+r,180,rpe,type==='tecnica'?'Técnica limpia, sin forzar':'Combina, muévete, no pares',r===rounds?'sprint':'work'));if(r<rounds)phases.push({lbl:'DESCANSO',sec:60,rpe:2,tip:'Respira, agua, sacude brazos',kind:'rest'});}}
  phases.push({lbl:'VUELTA A LA CALMA',sec:120,rpe:2,tip:'Estira hombros y respira',kind:'cool'});
  return phases;
}

/* ---- CARDIO MIXTO ---- encadena bloques de distintas modalidades ---- */
function buildMixedSession(type,min){
  // reparte el tiempo entre 3-4 modalidades con calentamiento y calma
  const W=(lbl,sec,rpe,tip,kind)=>({lbl,sec,rpe,tip,kind:kind||'work'});
  const phases=[W('CALENTAMIENTO',300,3,'Empieza suave en la primera máquina','warm')];
  const core=min-8;
  const blocks=type==='hiit'
    ? [['🚴 Spinning fuerte',Math.round(core*0.3),7],['🚣 Remo intervalos',Math.round(core*0.25),8],['🚶 Cinta pendiente',Math.round(core*0.25),6],['🚴 Spinning sprints',Math.round(core*0.2),9]]
    : [['🚴 Spinning',Math.round(core*0.35),5],['🚣 Remo',Math.round(core*0.3),6],['🚶 Cinta inclinada',Math.round(core*0.35),5]];
  blocks.forEach(([lbl,m,rpe])=>phases.push(W(lbl.toUpperCase(),m*60,rpe,'Cambia de máquina y mantén el ritmo','work')));
  phases.push({lbl:'VUELTA A LA CALMA',sec:180,rpe:2,tip:'Suave para bajar pulsaciones',kind:'cool'});
  return phases;
}
const MIX_TYPES={
  aerobico:{ic:'🔄',lbl:'Mixto aeróbico',desc:'Spinning + remo + cinta a ritmo sostenido. Variedad sin machacar.',load:1.2},
  hiit:{ic:'🔥',lbl:'Mixto HIIT',desc:'Bloques intensos rotando de máquina. Máximo estímulo.',load:1.7}
};

/* ---- ROUTER central: cualquier modalidad -> lista de fases ---- */
const CARDIO_MODES={
  spin:{ic:'🚴',name:'Spinning',types:SPIN_TYPES,build:buildSpinSession},
  row:{ic:'🚣',name:'Remo',types:ROW_TYPES,build:buildRowSession},
  tread:{ic:'🚶',name:'Cinta / inclinada',types:TREAD_TYPES,build:buildTreadSession},
  box:{ic:'🥊',name:'Boxeo cardio',types:BOX_TYPES,build:buildBoxSession},
  mixed:{ic:'🔄',name:'Cardio mixto',types:MIX_TYPES,build:buildMixedSession}
};
function buildCardioSession(mode,type,min){return CARDIO_MODES[mode].build(type,min);}

/* Recomendación según estado: si ayer/hoy hay carga, propone tipo e intensidad adecuados */
function spinSuggestion(){
  const rc=recoveryScore();
  // ¿entrenó ayer piernas o fuerte?
  const yst=new Date();yst.setDate(yst.getDate()-1);const ys=yst.toISOString().slice(0,10);
  const trainedYst=DB.sessions.some(s=>s.date===ys)||(DB.extraLog[ys]&&(DB.extraLog[ys].box||DB.extraLog[ys].run));
  const legsYst=DB.sessions.some(s=>s.date===ys&&/legs|pierna/i.test(s.name||''));
  const trainedToday=DB.sessions.some(s=>s.date===today());
  let type,min,reason;
  if(rc<45||legsYst){type='regen';min=25;reason=legsYst?'Ayer entrenaste piernas: hoy mejor spinning regenerativo para recuperar sin cargar más.':`Recovery bajo (${rc}): sesión suave para recuperar.`;}
  else if(rc<65||trainedYst||trainedToday){type='base';min=35;reason=trainedYst?'Ayer entrenaste: carga cardiovascular moderada, ni muy suave ni HIIT brutal.':`Recovery medio (${rc}): base aeróbica sostenible.`;}
  else{type='hiit';min=30;reason=`Recovery alto (${rc}): buen día para intervalos de calidad.`;}
  return {type,min,reason,rc};
}

function renderSpinView(){
  const el=document.getElementById('spinView');if(!el)return;
  const sug=spinSuggestion();const t=SPIN_TYPES[sug.type];
  let html=`<div class="note" style="border-color:var(--acc2)">🧠 <b>Hoy te sugiero:</b> ${t.ic} ${t.lbl} · ${sug.min} min<br><span class="mini">${sug.reason}</span></div>
  <button class="btn btn-acc2" style="margin-top:10px;width:100%" onclick="setupSpin('${sug.type}',${sug.min},'spin')">▶ Empezar la sesión sugerida</button>
  <div style="margin-top:14px"><b style="font-family:Anton;font-size:13px">O móntala tú:</b></div>
  <label style="margin-top:8px">Modalidad</label><select id="cMode" onchange="onCardioModeChange()">${Object.entries(CARDIO_MODES).map(([k,v])=>`<option value="${k}">${v.ic} ${v.name}</option>`).join('')}</select>
  <label style="margin-top:8px">Tipo de sesión</label><select id="spinType">${Object.entries(SPIN_TYPES).map(([k,v])=>`<option value="${k}" ${k===sug.type?'selected':''}>${v.ic} ${v.lbl}</option>`).join('')}</select>
  <label style="margin-top:8px">Duración</label><select id="spinMin"><option>15</option><option>20</option><option ${sug.min===30?'selected':''}>30</option><option>40</option><option>45</option><option>60</option></select>
  <div id="spinTypeDesc" class="mini" style="margin-top:8px">${t.desc}</div>
  <button class="btn2" style="margin-top:10px;width:100%" onclick="setupSpinManual()">Preparar esta sesión</button>`;
  // resumen semanal cardio
  const wk=weekDates();const spinWk=DB.spin.history.filter(h=>wk.includes(h.date));
  const minWk=spinWk.reduce((a,h)=>a+h.min,0);
  if(DB.spin.history.length)html+=`<div class="card" style="margin-top:14px"><h3>Esta semana en máquina</h3><div class="stat-grid c2"><div class="stat"><div class="v acc2">${minWk}</div><div class="l">min cardio</div></div><div class="stat"><div class="v acc">${spinWk.length}</div><div class="l">sesiones</div></div></div></div>`;
  el.innerHTML=html;
}
function onCardioModeChange(){
  const mode=document.getElementById('cMode').value;const types=CARDIO_MODES[mode].types;
  const sel=document.getElementById('spinType');
  sel.innerHTML=Object.entries(types).map(([k,v])=>`<option value="${k}">${v.ic} ${v.lbl}</option>`).join('');
  document.getElementById('spinTypeDesc').textContent=types[sel.value].desc;
  sel.onchange=()=>{document.getElementById('spinTypeDesc').textContent=types[sel.value].desc;};
}
function setupSpinManual(){const mode=document.getElementById('cMode').value;setupSpin(document.getElementById('spinType').value,+document.getElementById('spinMin').value,mode);}
function setupSpin(type,min,mode){
  mode=mode||'spin';
  const phases=buildCardioSession(mode,type,min);
  const totalSec=phases.reduce((a,p)=>a+p.sec,0);const m=CARDIO_MODES[mode];const ty=m.types[type];
  openModal(`<h3>${ty.ic} ${ty.lbl} · ${Math.round(totalSec/60)} min</h3><p class="mini" style="margin-bottom:10px">${m.name}. Vista previa: la app te guiará fase por fase con voz, sonido y aviso de 5 segundos antes de cada cambio.</p><div style="max-height:260px;overflow:auto">${phases.map(p=>`<div class="sub-opt"><span>${p.lbl} <span class="mini">${p.tip}</span></span><span class="mini">${Math.floor(p.sec/60)}:${String(p.sec%60).padStart(2,'0')} · RPE ${p.rpe}</span></div>`).join('')}</div><button class="btn btn-acc2" style="margin-top:12px;width:100%" onclick="startSpin('${type}',${min},'${mode}')">▶ EMPEZAR</button>`);
}

/* Ejecutor: usa un motor de fases genérico con avisos (mismo patrón que finishers) */
let SPIN={active:false,id:null,phases:[],idx:0,left:0,type:null,min:0,startTs:0,mode:'spin'};
function startSpin(type,min,mode){
  mode=mode||'spin';
  initAudio();closeModal();
  const phases=buildCardioSession(mode,type,min);
  SPIN={active:true,id:null,phases,idx:0,left:phases[0].sec,type,min,startTs:Date.now(),mode};
  if(DB.settings&&DB.settings.wakeLock)requestWake();
  speak(`${phases[0].lbl}. ${Math.round(phases[0].sec/60)} minutos. Erre pe e ${phases[0].rpe}`);beep(2);
  SPIN.id=setInterval(spinTick,1000);
  const cont=document.querySelector('#cardio-spin');if(cont&&cont.scrollIntoView)cont.scrollIntoView({behavior:'smooth'});
  renderSpinLive();
}
function spinTick(){
  SPIN.left--;
  const nextPh=SPIN.phases[SPIN.idx+1];
  const ph=SPIN.phases[SPIN.idx];
  // aviso previo de 5 segundos
  if(SPIN.left===5&&nextPh){speak(`Cambio en 5`);beep(1);}
  if(SPIN.left===4||SPIN.left===3||SPIN.left===2||SPIN.left===1){if(nextPh){beep(1);try{if(navigator.vibrate)navigator.vibrate(60);}catch(e){}}}
  // microinstrucciones de coach a mitad de fase (solo fases largas de trabajo)
  const elapsed=ph.sec-SPIN.left;
  if(ph.sec>=40&&(ph.kind==='work'||ph.kind==='sprint')){
    if(SPIN.left===10)speak('Últimos 10 segundos, aguanta');
    else if(elapsed===15&&ph.sec>=60)speak(spinCue(ph));
    else if(SPIN.left===Math.floor(ph.sec/2)&&ph.sec>=50)speak('Mantén, vas muy bien');
  }
  if(ph.kind==='rest'&&SPIN.left===Math.floor(ph.sec/2)&&ph.sec>=30)speak('Recupera, respira');
  if(SPIN.left<=0){
    SPIN.idx++;
    if(SPIN.idx>=SPIN.phases.length){finishSpin();return;}
    const np=SPIN.phases[SPIN.idx];SPIN.left=np.sec;
    beep(3,true);try{if(navigator.vibrate)navigator.vibrate([200,80,200]);}catch(e){}
    const last=SPIN.idx===SPIN.phases.length-2;
    speak(`${np.lbl}. ${spinCue(np)}${last?'. Última parte':''}`);
  }
  renderSpinLive();
}
/* Microinstrucción según el tipo de fase (coaching relativo, no números de resistencia) */
function spinCue(ph){
  if(ph.kind==='warm')return 'Resistencia baja, cadencia cómoda, entra en calor';
  if(ph.kind==='cool')return 'Baja resistencia, suelta las piernas';
  if(ph.kind==='rest')return 'Recupera, respira hondo';
  if(ph.kind==='sprint')return 'De pie, sube resistencia, a tope';
  // work: variar según intensidad (rpe)
  if(ph.rpe>=7)return 'Sube resistencia un punto, mantén la cadencia';
  if(ph.rpe>=5)return 'Cadencia firme, resistencia media';
  return 'Pedaleo controlado';
}
function spinRoad(kind){
  // fondo visual de ruta: terreno según fase
  const map={warm:['🌅','llano suave'],cool:['🌇','llano, bajando'],rest:['🛣️','llano, recupera'],work:['⛰️','subida'],sprint:['🏔️','cima / sprint']};
  return map[kind]||['🛣️','ruta'];
}
function spinPhaseColor(kind){return {warm:'var(--acc2)',cool:'var(--ok)',rest:'var(--acc2)',work:'var(--acc)',sprint:'var(--gold)'}[kind]||'var(--acc)';}
function renderSpinLive(){
  const el=document.getElementById('spinLive');if(!el)return;
  if(!SPIN.active){el.innerHTML='';return;}
  const ph=SPIN.phases[SPIN.idx];const col=spinPhaseColor(ph.kind);
  const m=Math.floor(SPIN.left/60),s=SPIN.left%60;
  const pct=Math.round((ph.sec-SPIN.left)/ph.sec*100);
  const next=SPIN.phases[SPIN.idx+1];
  const totalLeft=SPIN.phases.slice(SPIN.idx).reduce((a,p,i)=>a+(i===0?SPIN.left:p.sec),0);
  const road=spinRoad(ph.kind);
  // perfil de ruta: una barra por fase, altura según intensidad (rpe), la actual parpadea
  const profile=SPIN.phases.map((p,i)=>{const h=6+(p.rpe||3)*3.5;const active=i===SPIN.idx;const done=i<SPIN.idx;return `<div style="flex:1;height:${h}px;background:${done?'var(--dim)':active?spinPhaseColor(p.kind):'var(--bg3)'};border-radius:2px 2px 0 0;${active?'box-shadow:0 0 8px '+spinPhaseColor(p.kind):''};transition:all .3s"></div>`;}).join('');
  el.innerHTML=`<div class="card" style="border-color:${col};margin-bottom:10px">
    <div style="display:flex;align-items:flex-end;gap:2px;height:52px;margin-bottom:6px;padding:0 2px">${profile}</div>
    <div style="text-align:center">
      <div style="font-size:26px">${road[0]}</div>
      <div style="font-family:Anton;font-size:26px;color:${col};letter-spacing:1px">${ph.lbl}</div>
      <div class="mini" style="color:${col}">${road[1]}</div>
      <div style="font-family:Anton;font-size:64px;line-height:1;margin:4px 0">${m}:${String(s).padStart(2,'0')}</div>
      <div class="tag" style="color:${col};font-size:14px">RPE ${ph.rpe} · ${['','muy suave','muy suave','suave','moderado','moderado','sostenido','fuerte','fuerte','muy fuerte','máximo'][ph.rpe]||''}</div>
      <div style="font-size:14px;color:var(--fg);margin-top:8px;font-weight:600">💬 ${spinCue(ph)}</div>
      <div style="height:8px;background:var(--bg3);border-radius:4px;margin:10px 0 0"><div style="height:100%;background:${col};border-radius:4px;width:${pct}%;transition:width .3s"></div></div>
      ${next?`<div class="mini" style="margin-top:8px">Siguiente: ${next.lbl} · ${Math.floor(next.sec/60)}:${String(next.sec%60).padStart(2,'0')}</div>`:'<div class="mini" style="margin-top:8px">¡Última fase!</div>'}
      <div class="mini">Fase ${SPIN.idx+1}/${SPIN.phases.length} · quedan ~${Math.ceil(totalLeft/60)} min</div>
    </div>
    <div class="timer-ctrl" style="margin-top:10px"><button class="btn2" onclick="skipSpinPhase()">Saltar fase ▶</button><button class="btn2" onclick="stopSpin()">Terminar</button></div>
  </div>`;
}
function skipSpinPhase(){if(!SPIN.active)return;SPIN.left=1;}
function finishSpin(){
  clearInterval(SPIN.id);SPIN.active=false;
  const dur=Math.round((Date.now()-SPIN.startTs)/1000);
  const el=document.getElementById('spinLive');if(el)el.innerHTML='';
  // carga estimada = min * factor de intensidad del tipo
  const load=Math.round(SPIN.min*SPIN_TYPES[SPIN.type].load);
  const modeName=CARDIO_MODES[SPIN.mode].name;const typeLbl=CARDIO_MODES[SPIN.mode].types[SPIN.type].lbl;
  openModal(`<h3>✓ ${modeName} completado</h3><p class="mini" style="margin-bottom:10px">${typeLbl} · ${Math.round(dur/60)} min. Carga estimada: ${load}. Confirma para guardar.</p><label>RPE medio de la sesión (1-10)</label><input id="spinRpe" type="number" inputmode="numeric" value="${/recup|regen/.test(SPIN.type)?3:/hiit|sprint/.test(SPIN.type)?8:6}"><label style="margin-top:8px">Nota (opcional)</label><input id="spinNote" placeholder="Cómo fue"><button class="btn btn-acc2" style="margin-top:12px" onclick="saveSpin(${dur},${load})">Guardar</button>`);
  speak('Sesión completada. Buen trabajo');beep(3,true);
}
function stopSpin(){if(SPIN.active&&!confirm('¿Terminar la sesión?'))return;finishSpin();}
function saveSpin(dur,load){
  const rpe=+document.getElementById('spinRpe').value||6;const note=document.getElementById('spinNote').value||'';
  DB.spin.history.unshift({date:today(),mode:SPIN.mode,type:SPIN.type,min:Math.round(dur/60),rpe,load,note});
  DB.extraLog[today()]=DB.extraLog[today()]||{};DB.extraLog[today()].run=true;DB.extraLog[today()].spin=true;DB.extraLog[today()].spinMin=(DB.extraLog[today()].spinMin||0)+Math.round(dur/60);
  releaseWake();save();closeModal();renderSpinView();renderDashboard();toast('✅ Sesión guardada');
}

/* Historial de cardio (carrera + todas las modalidades de máquina) */
function cardioTypeLabel(h){
  if(h.mode==='run')return {ic:'🏃',lbl:RUN_TYPES[h.type]?.lbl||'Carrera'};
  if(h.mode==='swim')return {ic:'🏊',lbl:h.swimName||'Piscina'};
  const m=CARDIO_MODES[h.mode||'spin'];return {ic:m?.ic||'🚴',lbl:(m&&m.types[h.type]?.lbl)||'Cardio'};
}
function renderCardioHist(){
  const el=document.getElementById('cardioHist');if(!el)return;
  const runs=(DB.running.history||[]).map(h=>({...h,mode:'run'}));
  const machines=(DB.spin.history||[]).map(h=>({...h,mode:h.mode||'spin',km:0,duration:h.min*60}));
  const all=[...runs,...machines].sort((a,b)=>b.date.localeCompare(a.date));
  if(!all.length){el.innerHTML='<p class="empty">Aún no hay sesiones de cardio. Haz tu primera sesión.</p>';return;}
  const wk=weekDates();const minWk=all.filter(h=>wk.includes(h.date)).reduce((a,h)=>a+Math.round((h.duration||h.min*60)/60),0);
  const loadWk=all.filter(h=>wk.includes(h.date)).reduce((a,h)=>a+(h.load||0),0);
  el.innerHTML=`<div class="stat-grid"><div class="stat"><div class="v acc2">${minWk}</div><div class="l">min esta semana</div></div><div class="stat"><div class="v gold">${loadWk}</div><div class="l">carga cardio</div></div><div class="stat"><div class="v acc">${all.length}</div><div class="l">sesiones</div></div></div>
  <div style="margin-top:12px">${all.slice(0,20).map(h=>{const t=cardioTypeLabel(h);return `<div class="sub-opt"><span>${t.ic} ${fd(h.date)} · ${t.lbl}</span><span class="mini">${h.mode==='run'?h.km+' km':h.min+' min · RPE '+h.rpe}</span></div>`;}).join('')}</div>`;
}

function cardioTab(t,el){
  ['spin','run','swim','hist'].forEach(x=>{const e=document.getElementById('cardio-'+x);if(e)e.style.display='none';});
  document.getElementById('cardio-'+t).style.display='block';
  el.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('on'));el.classList.add('on');
  if(t==='spin'){renderSpinView();renderSpinLive();}
  else if(t==='run'){renderRunView();renderRunLive();}
  else if(t==='swim'){renderSwimView();}
  else if(t==='hist'){renderCardioHist();}
}

/* ===================== 🏊 PISCINA (sesiones prefijadas, móvil fuera del agua) ===================== */
/* Se entrena leyendo el plan (no en vivo). Distancias en metros → se convierten a largos según tu piscina. */
const SWIM_WORKOUTS=[
  {id:'ini',name:'Iniciación suave',ic:'🔰',goal:'Empezar',sets:[
    {type:'cont',lbl:'Calentamiento suave',m:100},
    {type:'rep',lbl:'Técnica (crol tranquilo)',reps:8,dist:25,rest:'20"'},
    {type:'cont',lbl:'Nado continuo cómodo',m:200},
    {type:'rep',lbl:'Piernas (con tabla si tienes)',reps:4,dist:25,rest:'20"'},
    {type:'cont',lbl:'Vuelta a la calma',m:100}]},
  {id:'cont1000',name:'Continuo 1000',ic:'💪',goal:'Fondo',sets:[
    {type:'cont',lbl:'Calentamiento',m:200},
    {type:'cont',lbl:'Nado continuo a ritmo constante',m:600},
    {type:'cont',lbl:'Suave',m:200}]},
  {id:'s50',name:'Series de 50',ic:'💪',goal:'Fondo',sets:[
    {type:'cont',lbl:'Calentamiento',m:200},
    {type:'rep',lbl:'Series fuertes pero controladas',reps:20,dist:50,rest:'25-30"'},
    {type:'cont',lbl:'Suave',m:100}]},
  {id:'i100',name:'Intervalos de 100',ic:'⚡',goal:'Calidad',sets:[
    {type:'cont',lbl:'Calentamiento',m:300},
    {type:'rep',lbl:'Intervalos a ritmo vivo',reps:10,dist:100,rest:'30"'},
    {type:'cont',lbl:'Suave',m:200}]},
  {id:'pir',name:'Pirámide',ic:'⚡',goal:'Calidad',sets:[
    {type:'cont',lbl:'Calentamiento',m:200},
    {type:'ladder',lbl:'Pirámide 50-100-150-200-150-100-50',steps:[50,100,150,200,150,100,50],rest:'20-30"'},
    {type:'cont',lbl:'Suave',m:100}]},
  {id:'tec',name:'Técnica y patada',ic:'🧘',goal:'Técnica',sets:[
    {type:'cont',lbl:'Calentamiento',m:200},
    {type:'rep',lbl:'Técnica de brazada',reps:8,dist:25,rest:'15"'},
    {type:'rep',lbl:'Patada con tabla',reps:8,dist:25,rest:'20"'},
    {type:'rep',lbl:'Nado completo suave',reps:4,dist:50,rest:'20"'},
    {type:'cont',lbl:'Suave',m:100}]},
  {id:'hiit',name:'HIIT piscina',ic:'⚡',goal:'Calidad',sets:[
    {type:'cont',lbl:'Calentamiento',m:200},
    {type:'rep',lbl:'Esprints controlados',reps:16,dist:25,rest:'15-20"'},
    {type:'cont',lbl:'Suave',m:200}]},
  {id:'l1500',name:'Fondo 1500',ic:'💪',goal:'Fondo',sets:[
    {type:'cont',lbl:'Calentamiento',m:300},
    {type:'cont',lbl:'Nado continuo largo',m:1000},
    {type:'cont',lbl:'Progresivo (sube ritmo al final)',m:200},
    {type:'cont',lbl:'Suave',m:100}]}
];
function poolLen(){DB.swim=DB.swim||{poolLen:25};return DB.swim.poolLen||25;}
function swimSetMeters(s){return s.type==='cont'?s.m:s.type==='ladder'?s.steps.reduce((a,b)=>a+b,0):s.reps*s.dist;}
function swimTotal(w){return w.sets.reduce((a,s)=>a+swimSetMeters(s),0);}
function swimMinEst(m){return Math.round(m/100*2.5);}
function swimSetLine(s,pool){
  if(s.type==='cont'){const l=Math.round(s.m/pool);return `<div class="sub-opt"><span>${s.lbl}</span><span class="mini">${s.m} m · ${l} largo${l>1?'s':''}</span></div>`;}
  if(s.type==='ladder'){return `<div class="sub-opt" style="align-items:flex-start"><span>${s.lbl}</span><span class="mini" style="text-align:right">${s.steps.map(x=>x/pool+'L').join(' · ')}<br>desc. ${s.rest}</span></div>`;}
  const each=Math.round(s.dist/pool);return `<div class="sub-opt"><span>${s.lbl}</span><span class="mini">${s.reps} × ${s.dist} m (${each} largo${each>1?'s':''}) · desc. ${s.rest}</span></div>`;
}
function renderSwimView(){
  const el=document.getElementById('swimView');if(!el)return;DB.swim=DB.swim||{poolLen:25};
  const pool=poolLen();
  const hist=(DB.spin.history||[]).filter(h=>h.mode==='swim').slice(0,5);
  el.innerHTML=`<div class="note" style="margin-bottom:10px">📵 <b>El móvil se queda fuera del agua.</b> Elige la sesión, repasa el plan (o memorízalo) antes de meterte, y al salir marca ✓ Hecho. Distancias en largos de tu piscina.</div>
  <div class="ex-block" style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;align-items:center"><b>🏊 Mi piscina</b><span style="display:flex;gap:5px">${[25,33,50].map(p=>`<button class="btn-sm ${pool===p?'btn-acc2':'btn2'}" onclick="setPool(${p})">${p} m</button>`).join('')}</span></div><div class="mini" style="margin-top:4px">1 largo = ${pool} m. Ajusta si tu piscina mide otra cosa.</div></div>
  <div style="display:flex;flex-direction:column;gap:8px">${SWIM_WORKOUTS.map(w=>{const m=swimTotal(w);return `<div class="ex-block" style="cursor:pointer" onclick="openSwimPlan('${w.id}')"><div style="display:flex;align-items:center;gap:12px"><div style="font-size:30px">${w.ic}</div><div style="flex:1"><b>${w.name}</b><div class="mini">${m} m · ${Math.round(m/pool)} largos · ~${swimMinEst(m)} min · ${w.goal}</div></div><div style="color:var(--acc)">›</div></div></div>`;}).join('')}</div>
  ${hist.length?`<div class="card" style="margin-top:12px"><b style="font-family:Anton;font-size:13px">🏊 Últimas piscinas</b>${hist.map(h=>`<div class="sub-opt"><span>${fd(h.date)} · ${h.swimName||'Natación'}</span><span class="mini">${h.meters||0} m · RPE ${h.rpe}</span></div>`).join('')}</div>`:''}`;
}
function setPool(p){DB.swim=DB.swim||{};DB.swim.poolLen=p;save();renderSwimView();}
function openSwimPlan(id){
  const w=SWIM_WORKOUTS.find(x=>x.id===id);if(!w)return;const pool=poolLen();const m=swimTotal(w);
  openModal(`<div style="text-align:center;font-size:40px">${w.ic}</div><h3 style="text-align:center">${w.name}</h3>
  <div class="stat-grid" style="grid-template-columns:repeat(3,1fr);margin:10px 0"><div class="stat"><div class="v acc">${m}</div><div class="l">metros</div></div><div class="stat"><div class="v acc2">${Math.round(m/pool)}</div><div class="l">largos (${pool}m)</div></div><div class="stat"><div class="v gold">~${swimMinEst(m)}</div><div class="l">min aprox</div></div></div>
  <b style="font-family:Anton;font-size:13px">Plan (léelo antes de entrar)</b>
  <div style="margin-top:6px">${w.sets.map(s=>swimSetLine(s,pool)).join('')}</div>
  <div class="note viol" style="margin-top:10px">💡 Respira cada 2-3 brazadas, técnica antes que velocidad. Los descansos son en el borde, mirando el reloj de la piscina.</div>
  <label style="margin-top:10px">Al terminar, ¿cómo fue? (RPE)</label><select id="swimRpe"><option value="4">4 · muy suave</option><option value="6" selected>6 · cómodo</option><option value="8">8 · exigente</option><option value="9">9 · al límite</option></select>
  <button class="btn btn-acc2" style="margin-top:12px;width:100%" onclick="logSwim('${w.id}')">✓ Hecho — registrar</button>`);
}
function logSwim(id){const w=SWIM_WORKOUTS.find(x=>x.id===id);if(!w)return;const m=swimTotal(w);const rpe=+(document.getElementById('swimRpe')||{}).value||6;
  DB.spin=DB.spin||{history:[]};DB.spin.history.unshift({date:today(),mode:'swim',min:swimMinEst(m),rpe,load:Math.round(m/100),swimName:w.name,meters:m,poolLen:poolLen()});
  DB.extraLog=DB.extraLog||{};DB.extraLog[today()]=DB.extraLog[today()]||{};DB.extraLog[today()].run=true;
  save();closeModal();renderSwimView();renderDashboard&&renderDashboard();toast('🏊 '+m+' m registrados');
}

/* Cada animación es un SVG ligero (~1KB) con figura esquemática y movimiento CSS.
   Se referencian por clave desde calentamiento, core, matutina, estiramientos.
   Fallback: si no hay animación específica, figura genérica + botón a YouTube. */
const EX_ANIM={
  tobillo:`<g class="an-rock"><circle cx="50" cy="30" r="10"/><line x1="50" y1="40" x2="50" y2="70"/><line x1="50" y1="70" x2="35" y2="95"/><line x1="50" y1="70" x2="68" y2="92"/><line x1="35" y1="95" x2="30" y2="95"/></g>`,
  cadera:`<g class="an-circle" style="transform-origin:50px 55px"><circle cx="50" cy="25" r="9"/><line x1="50" y1="34" x2="50" y2="62"/><line x1="50" y1="62" x2="40" y2="92"/><line x1="50" y1="62" x2="60" y2="92"/><line x1="50" y1="44" x2="34" y2="52"/><line x1="50" y1="44" x2="66" y2="52"/></g>`,
  hombros:`<g><circle cx="50" cy="26" r="9"/><line x1="50" y1="35" x2="50" y2="70"/><line x1="50" y1="70" x2="42" y2="95"/><line x1="50" y1="70" x2="58" y2="95"/><line class="an-armL" x1="50" y1="42" x2="30" y2="42" style="transform-origin:50px 42px"/><line class="an-armR" x1="50" y1="42" x2="70" y2="42" style="transform-origin:50px 42px"/></g>`,
  gato:`<g class="an-catcamel"><ellipse cx="50" cy="55" rx="26" ry="10"/><line x1="26" y1="58" x2="24" y2="80"/><line x1="74" y1="58" x2="76" y2="80"/><line x1="34" y1="60" x2="33" y2="80"/><line x1="66" y1="60" x2="67" y2="80"/><circle cx="80" cy="48" r="6"/></g>`,
  sentadilla:`<g class="an-squat"><circle cx="50" cy="22" r="9"/><line x1="50" y1="31" x2="50" y2="58"/><line x1="50" y1="58" x2="40" y2="78"/><line x1="40" y1="78" x2="42" y2="95"/><line x1="50" y1="58" x2="60" y2="78"/><line x1="60" y1="78" x2="58" y2="95"/><line x1="50" y1="40" x2="36" y2="46"/><line x1="50" y1="40" x2="64" y2="46"/></g>`,
  estiramiento:`<g class="an-reach"><circle cx="50" cy="28" r="9"/><line x1="50" y1="37" x2="50" y2="72"/><line x1="50" y1="72" x2="42" y2="96"/><line x1="50" y1="72" x2="58" y2="96"/><line class="an-up" x1="50" y1="45" x2="42" y2="18" style="transform-origin:50px 45px"/><line class="an-up" x1="50" y1="45" x2="58" y2="18" style="transform-origin:50px 45px"/></g>`,
  plancha:`<g class="an-plank"><line x1="18" y1="70" x2="82" y2="58" stroke-width="5"/><circle cx="84" cy="56" r="6"/><line x1="24" y1="70" x2="22" y2="92"/><line x1="70" y1="61" x2="72" y2="92"/><line x1="30" y1="69" x2="28" y2="88"/></g>`,
  deadbug:`<g><ellipse cx="50" cy="60" rx="8" ry="18"/><line class="an-armL" x1="48" y1="46" x2="34" y2="30" style="transform-origin:48px 46px"/><line class="an-armR" x1="52" y1="46" x2="66" y2="30" style="transform-origin:52px 46px"/><line class="an-legR" x1="52" y1="74" x2="68" y2="88" style="transform-origin:52px 74px"/><line class="an-legL" x1="48" y1="74" x2="34" y2="88" style="transform-origin:48px 74px"/></g>`,
  sidePlank:`<g class="an-fade"><line x1="20" y1="82" x2="78" y2="40" stroke-width="5"/><circle cx="80" cy="37" r="6"/><line x1="22" y1="82" x2="22" y2="60"/><line class="an-up" x1="50" y1="61" x2="52" y2="34" style="transform-origin:50px 61px"/></g>`,
  hollow:`<g class="an-hollow"><path d="M25 60 Q50 48 75 60" fill="none" stroke-width="5"/><circle cx="20" cy="60" r="6"/><line x1="26" y1="59" x2="14" y2="46"/><line x1="74" y1="60" x2="86" y2="48"/></g>`,
  zancada:`<g class="an-lunge"><circle cx="50" cy="24" r="9"/><line x1="50" y1="33" x2="50" y2="60"/><line x1="50" y1="60" x2="34" y2="76"/><line x1="34" y1="76" x2="34" y2="95"/><line x1="50" y1="60" x2="68" y2="80"/><line x1="68" y1="80" x2="60" y2="95"/></g>`,
  respira:`<g class="an-breathe" style="transform-origin:50px 50px"><circle cx="50" cy="50" r="24" fill="none" stroke-width="3"/><circle cx="50" cy="50" r="12"/></g>`,
  generic:`<g class="an-fade"><circle cx="50" cy="28" r="10"/><line x1="50" y1="38" x2="50" y2="70"/><line x1="50" y1="70" x2="40" y2="95"/><line x1="50" y1="70" x2="60" y2="95"/><line x1="50" y1="48" x2="34" y2="58"/><line x1="50" y1="48" x2="66" y2="58"/></g>`
};
function exSVG(key){
  const g=EX_ANIM[key]||EX_ANIM.generic;
  return `<svg viewBox="0 0 100 100" style="width:150px;height:150px" fill="none" stroke="var(--acc2)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${g}</svg>`;
}

/* ===================== MOTOR DE SECUENCIAS GUIADAS (universal) ===================== */
/* Reutiliza el patrón del cardio: una lista de fases {lbl,sec,tip,kind} guiada con
   cuenta atrás, aviso de 5s, sonido, vibración y voz. Sirve para calentamiento,
   estiramientos y core. Se muestra en un overlay para funcionar desde cualquier vista. */
let SEQ={active:false,id:null,phases:[],idx:0,left:0,title:'',onDone:null};
function autoAnim(lbl){
  const s=(lbl||'').toLowerCase();
  if(/tobillo/.test(s))return{anim:'tobillo',ex:'movilidad de tobillo'};
  if(/cadera|glúteo|gluteo/.test(s))return{anim:'cadera',ex:'movilidad de cadera'};
  if(/hombro|escápula|escapula|manguito/.test(s))return{anim:'hombros',ex:'movilidad de hombros'};
  if(/gato|camello|columna|torácica|toracica/.test(s))return{anim:'gato',ex:'gato camello ejercicio'};
  if(/sentadilla|squat/.test(s))return{anim:'sentadilla',ex:'sentadilla peso corporal'};
  if(/zancada|lunge/.test(s))return{anim:'zancada',ex:'zancada'};
  if(/dead ?bug/.test(s))return{anim:'deadbug',ex:'dead bug ejercicio'};
  if(/plancha lateral|side plank/.test(s))return{anim:'sidePlank',ex:'plancha lateral'};
  if(/plancha|plank/.test(s))return{anim:'plancha',ex:'plancha abdominal'};
  if(/hollow/.test(s))return{anim:'hollow',ex:'hollow hold'};
  if(/estira|estíra|cuádriceps|cuadriceps|isquios|gemelo|dorsal|tríceps|triceps|pecho|cuello/.test(s))return{anim:'estiramiento',ex:lbl+' estiramiento'};
  if(/respira|respiración|respiracion|breathe/.test(s))return{anim:'respira',ex:''};
  if(/jumping|jack|cardio|progres|dinámica|dinamica|balanceo/.test(s))return{anim:'sentadilla',ex:''};
  return{anim:'generic',ex:lbl};
}
function runSequence(title,phases,onDone){
  if(!phases||!phases.length){if(onDone)onDone();return;}
  initAudio();
  // enriquecer cada fase con animación si no la trae
  phases=phases.map(p=>{if(p.anim)return p;if(p.kind==='rest'||p.kind==='cool'&&/calma/.test(p.lbl||''))return{...p,anim:'respira',ex:''};const a=autoAnim(p.lbl);return{...p,anim:a.anim,ex:a.ex};});
  SEQ={active:true,id:null,phases,idx:0,left:phases[0].sec,title,onDone};
  if(DB.settings&&DB.settings.wakeLock)requestWake();
  let ov=document.getElementById('seqOverlay');
  if(!ov){ov=document.createElement('div');ov.id='seqOverlay';ov.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(10,11,15,.97);display:flex;align-items:center;justify-content:center;padding:20px';document.body.appendChild(ov);}
  ov.style.display='flex';
  speak(`${title}. ${phases[0].lbl}`);beep(2);
  SEQ.id=setInterval(seqTick,1000);renderSeq();
}
function seqTick(){
  SEQ.left--;const next=SEQ.phases[SEQ.idx+1];
  if(SEQ.left===5&&next){speak('Cambio en 5');beep(1);}
  if(SEQ.left>=1&&SEQ.left<=3){beep(1);try{if(navigator.vibrate)navigator.vibrate(50);}catch(e){}}
  if(SEQ.left<=0){
    SEQ.idx++;
    if(SEQ.idx>=SEQ.phases.length){finishSequence();return;}
    const ph=SEQ.phases[SEQ.idx];SEQ.left=ph.sec;
    beep(3,true);try{if(navigator.vibrate)navigator.vibrate([200,80,200]);}catch(e){}
    const last=SEQ.idx===SEQ.phases.length-1;
    speak(`${ph.lbl}. ${ph.tip||''}${last?'. Última':''}`);
  }
  renderSeq();
}
function seqColor(kind){return {warm:'var(--acc)',mobility:'var(--acc2)',activation:'var(--gold)',approach:'var(--acc)',stretch:'var(--acc2)',core:'var(--viol)',rest:'var(--ok)',cool:'var(--ok)'}[kind]||'var(--acc2)';}
function renderSeq(){
  const ov=document.getElementById('seqOverlay');if(!ov||!SEQ.active)return;
  const ph=SEQ.phases[SEQ.idx];const col=seqColor(ph.kind);
  const m=Math.floor(SEQ.left/60),s=SEQ.left%60;const pct=Math.round((ph.sec-SEQ.left)/ph.sec*100);
  const next=SEQ.phases[SEQ.idx+1];
  const totalLeft=SEQ.phases.slice(SEQ.idx).reduce((a,p,i)=>a+(i===0?SEQ.left:p.sec),0);
  ov.innerHTML=`<div style="width:100%;max-width:440px;text-align:center">
    <div class="mini" style="letter-spacing:2px;text-transform:uppercase">${SEQ.title}</div>
    <div style="font-family:Anton;font-size:26px;color:${col};letter-spacing:1px;margin-top:4px">${ph.lbl}</div>
    <div style="display:flex;justify-content:center;margin:6px 0">${exSVG(ph.anim||'generic')}</div>
    ${ph.ex?`<a class="exvid-link" href="https://www.youtube.com/results?search_query=${encodeURIComponent(ph.ex+' ejercicio técnica')}" target="_blank">🎬 Ver en vídeo</a>`:''}
    <div style="font-family:Anton;font-size:64px;line-height:1;margin:4px 0">${m}:${String(s).padStart(2,'0')}</div>
    ${ph.tip?`<div style="font-size:14px;color:var(--dim);margin-bottom:8px">${ph.tip}</div>`:''}
    <div style="height:10px;background:var(--bg3);border-radius:5px;margin:0 20px"><div style="height:100%;background:${col};border-radius:5px;width:${pct}%;transition:width .3s"></div></div>
    ${next?`<div class="mini" style="margin-top:10px">Siguiente: ${next.lbl} · ${next.sec}s</div>`:'<div class="mini" style="margin-top:10px">¡Última!</div>'}
    <div class="mini">Paso ${SEQ.idx+1}/${SEQ.phases.length} · quedan ~${Math.ceil(totalLeft/60)} min</div>
    <div class="row" style="margin-top:16px;justify-content:center"><button class="btn2" onclick="skipSeq()">Saltar ▶</button><button class="btn2" onclick="pauseSeq()" id="seqPauseBtn">${SEQ.id?'Pausa':'Seguir'}</button><button class="btn2" onclick="quitSequence()">Salir</button></div>
  </div>`;
}
function skipSeq(){if(SEQ.active)SEQ.left=1;}
function pauseSeq(){if(!SEQ.active)return;if(SEQ.id){clearInterval(SEQ.id);SEQ.id=null;try{speechSynthesis.cancel();}catch(e){}}else{SEQ.id=setInterval(seqTick,1000);}renderSeq();}
function finishSequence(){
  if(SEQ.id)clearInterval(SEQ.id);SEQ.active=false;
  speak('Completado. Buen trabajo');beep(3,true);try{if(navigator.vibrate)navigator.vibrate([250,80,250]);}catch(e){}
  const ov=document.getElementById('seqOverlay');if(ov)ov.style.display='none';
  releaseWake();const cb=SEQ.onDone;SEQ.onDone=null;toast('✅ '+SEQ.title+' completado');if(cb)cb();
}
function quitSequence(){if(SEQ.id)clearInterval(SEQ.id);SEQ.active=false;try{speechSynthesis.cancel();}catch(e){}const ov=document.getElementById('seqOverlay');if(ov)ov.style.display='none';releaseWake();const cb=SEQ.onDone;SEQ.onDone=null;if(cb)cb();}

/* ---- Generadores de calentamiento según el músculo/tipo de la sesión ---- */
const WU_LOWER=[
  {lbl:'Movilidad de tobillo',sec:40,tip:'Rodilla sobre la punta, adelante y atrás',kind:'mobility'},
  {lbl:'Apertura de cadera',sec:40,tip:'Círculos amplios de cadera a cada lado',kind:'mobility'},
  {lbl:'Activación de glúteo',sec:40,tip:'Puente de glúteo, aprieta arriba',kind:'activation'},
  {lbl:'Sentadilla corporal',sec:45,tip:'Profundas y controladas, sin peso',kind:'activation'},
  {lbl:'Bisagra de cadera',sec:40,tip:'Peso muerto sin carga, espalda recta',kind:'activation'},
  {lbl:'Core anti-extensión',sec:30,tip:'Plancha activa, abdomen firme',kind:'core'}
];
const WU_UPPER=[
  {lbl:'Movilidad de hombros',sec:45,tip:'Círculos amplios adelante y atrás',kind:'mobility'},
  {lbl:'Rotación de escápulas',sec:35,tip:'Junta y separa omóplatos',kind:'mobility'},
  {lbl:'Manguito rotador',sec:40,tip:'Rotaciones externas con poco o nada de peso',kind:'activation'},
  {lbl:'Scapular push-ups',sec:35,tip:'En plancha, solo mueve los omóplatos',kind:'activation'},
  {lbl:'Muñecas y codos',sec:30,tip:'Círculos de muñeca y flexo-extensión',kind:'mobility'},
  {lbl:'Flexiones progresivas',sec:35,tip:'Suaves, activa pecho y tríceps',kind:'activation'}
];
const WU_METCON=[
  {lbl:'Movilidad dinámica',sec:60,tip:'Balanceos de brazos y piernas',kind:'mobility'},
  {lbl:'Sentadillas + brazos',sec:45,tip:'Ritmo suave, sube pulsaciones',kind:'activation'},
  {lbl:'Jumping jacks suaves',sec:45,tip:'Eleva temperatura corporal',kind:'warm'},
  {lbl:'Patrón del ejercicio',sec:45,tip:'Ensaya el gesto que harás, sin carga',kind:'activation'},
  {lbl:'Progresión de intensidad',sec:45,tip:'Sube el ritmo poco a poco',kind:'warm'}
];
function warmupFor(routine){
  // detectar tipo por nombre + primer ejercicio de fuerza
  const nm=(routine.name||'').toUpperCase();
  const firstEx=(routine.blocks?.find(b=>b.type==='fuerza')?.exercises?.[0]?.name)||'';
  let base;
  if(/LEG|PIERNA/.test(nm)||/sentadilla|peso muerto|prensa|zancada|pierna/i.test(firstEx))base=WU_LOWER;
  else if(/PULL|PUSH|TORSO|EMPUJE|TRACC/.test(nm)||/press|dominada|remo|banca|militar|fondo/i.test(firstEx))base=WU_UPPER;
  else base=WU_METCON;
  let seq=base.map(p=>({...p}));
  // Recovery bajo -> añadir 2 pasos progresivos; alto -> quitar el último
  const rc=recoveryScore();
  if(rc<50){seq.unshift({lbl:'Cardio suave',sec:60,tip:'Caminar en el sitio o cuerda imaginaria',kind:'warm'});seq.push({lbl:'Segunda progresión',sec:40,tip:'Repite el patrón, algo más de ritmo',kind:'warm'});}
  else if(rc>=80&&seq.length>4)seq=seq.slice(0,seq.length-1);
  // series de aproximación si hay ejercicio de fuerza con peso
  const heavy=routine.blocks?.find(b=>b.type==='fuerza')?.exercises?.[0];
  if(heavy&&+heavy.kg>40){const top=+heavy.kg;[[0.4,10],[0.6,5],[0.8,3]].forEach(([f,r])=>seq.push({lbl:`Aproximación ${Math.round(top*f/2.5)*2.5} kg`,sec:35,tip:`${r} reps suaves de ${heavy.name}`,kind:'approach'}));}
  return seq;
}

/* ---- Estiramientos y core según lo trabajado ---- */
const ST_LOWER=[
  {lbl:'Cuádriceps de pie',sec:30,tip:'Talón al glúteo, rodillas juntas — izquierda',kind:'stretch'},
  {lbl:'Cuádriceps — derecha',sec:30,tip:'Cambia de pierna',kind:'stretch'},
  {lbl:'Isquios',sec:35,tip:'Pierna estirada, inclínate desde la cadera',kind:'stretch'},
  {lbl:'Glúteo (figura 4)',sec:30,tip:'Tobillo sobre rodilla — izquierda',kind:'stretch'},
  {lbl:'Glúteo — derecha',sec:30,tip:'Cambia de lado',kind:'stretch'},
  {lbl:'Flexor de cadera',sec:35,tip:'Zancada baja, empuja cadera adelante',kind:'stretch'},
  {lbl:'Gemelo en pared',sec:30,tip:'Talón al suelo, pierna atrás estirada',kind:'stretch'}
];
const ST_UPPER=[
  {lbl:'Pecho en marco',sec:30,tip:'Antebrazo en la pared, gira el torso',kind:'stretch'},
  {lbl:'Dorsal',sec:30,tip:'Brazo arriba, inclínate al lado contrario',kind:'stretch'},
  {lbl:'Tríceps',sec:25,tip:'Codo arriba y atrás — izquierdo',kind:'stretch'},
  {lbl:'Tríceps — derecho',sec:25,tip:'Cambia de brazo',kind:'stretch'},
  {lbl:'Hombro cruzado',sec:25,tip:'Brazo cruzado al pecho — izquierdo',kind:'stretch'},
  {lbl:'Hombro — derecho',sec:25,tip:'Cambia de brazo',kind:'stretch'},
  {lbl:'Cuello y trapecio',sec:30,tip:'Oreja al hombro, suave a cada lado',kind:'stretch'}
];
const CORE_SEQ=[
  {lbl:'Dead bug',sec:40,tip:'Brazo y pierna opuestos, zona lumbar pegada',kind:'core'},
  {lbl:'Descanso',sec:20,tip:'Respira',kind:'rest'},
  {lbl:'Plancha frontal',sec:40,tip:'Cuerpo en línea, glúteo y abdomen firmes',kind:'core'},
  {lbl:'Descanso',sec:20,tip:'Respira',kind:'rest'},
  {lbl:'Plancha lateral izq.',sec:30,tip:'Cadera arriba, línea recta',kind:'core'},
  {lbl:'Plancha lateral der.',sec:30,tip:'Cambia de lado',kind:'core'},
  {lbl:'Descanso',sec:20,tip:'Respira',kind:'rest'},
  {lbl:'Hollow hold',sec:35,tip:'Lumbar pegada, brazos y piernas arriba',kind:'core'}
];
function recoveryPlanFor(sessionName){
  const nm=(sessionName||'').toUpperCase();
  const lower=/LEG|PIERNA|FULL/.test(nm);
  const stretches=lower?ST_LOWER:ST_UPPER;
  // ¿toca core? no si fue piernas pesadas (ya cargaste core), sí en tren superior, según frecuencia semanal
  const wk=weekDates();const coreThisWeek=(DB.coreLog||[]).filter(d=>wk.includes(d)).length;
  const doneToday=(DB.coreLog||[]).includes(today());
  const core=!lower&&!doneToday&&coreThisWeek<3;
  return {stretches,core,lower};
}
function coreDoneToday(){DB.coreLog=DB.coreLog||[];if(!DB.coreLog.includes(today()))DB.coreLog.push(today());save();}

/* ===================== NUTRICIÓN · MÉTODO DEL PLATO ===================== */
/* Sin contar calorías ni pesar comida. Decisiones visuales + proteína en cada toma.
   El seguimiento real es peso y cintura, no gramos. Diseñado para vida con niños. */
const MEALS=[['desayuno','🌅'],['comida','☀️'],['merienda','🥪'],['cena','🌙']];
function proteinTargetG(){const w=DB.body[0]?.peso||DB.profile.weight||115;return Math.round(w*1.3);} // ~1.3 g/kg, objetivo pérdida de grasa manteniendo músculo
function renderDietCard(){
  const el=document.getElementById('dietCard');if(!el)return;
  const d=today();DB.diet=DB.diet||{log:{}};const log=DB.diet.log[d]||{};
  const done=MEALS.filter(m=>log[m[0]]).length;
  const gTarget=proteinTargetG();
  el.innerHTML=`<div class="card" style="border-color:var(--ok)"><h3>🥗 Dieta de hoy <span class="tag" style="color:var(--ok)">método del plato</span></h3>
    <div class="mini" style="margin-bottom:10px">Proteína en cada comida (palma de la mano). Objetivo: ~${gTarget} g/día. Toca cada comida al meter tu ración de proteína:</div>
    <div class="row" style="gap:6px">${MEALS.map(m=>`<button class="btn-sm ${log[m[0]]?'btn-acc2':'btn2'}" style="flex:1;flex-direction:column;padding:10px 4px" onclick="toggleMeal('${m[0]}')">${m[1]}<br><span style="font-size:10px">${m[0]}</span>${log[m[0]]?'<br>✓':''}</button>`).join('')}</div>
    <div class="bar" style="margin-top:10px"><i style="width:${done/4*100}%;background:var(--ok)"></i></div>
    <div class="mini" style="margin-top:4px">${done}/4 comidas con proteína${done===4?' · ¡día redondo! 💪':''}</div>
    <button class="btn" style="margin-top:10px;width:100%" onclick="document.querySelector('nav button:nth-child(4)').click()">🍽️ Abrir mi Comida (qué comer, pesar, guía)</button>
  </div>`;
}
function toggleMeal(m){const d=today();DB.diet=DB.diet||{log:{}};DB.diet.log[d]=DB.diet.log[d]||{};DB.diet.log[d][m]=!DB.diet.log[d][m];save();renderDietCard();}
function openPlateGuide(){
  openModal(`<h3>🍽️ Tu plato modelo</h3>
  <p class="mini" style="margin-bottom:12px">En cada comida principal, monta el plato así. Sin pesar nada, solo proporciones visuales:</p>
  <div class="ex-block"><b style="color:var(--ok)">½ plato · Verdura o ensalada</b><div class="mini" style="margin-top:2px">Te llena sin apenas calorías. Cuanto más color, mejor.</div></div>
  <div class="ex-block"><b style="color:var(--acc)">¼ plato · Proteína</b><div class="mini" style="margin-top:2px">Del tamaño de tu palma: pollo, huevos, pescado, legumbre, carne magra. Es lo que mantiene el músculo mientras pierdes grasa.</div></div>
  <div class="ex-block"><b style="color:var(--gold)">¼ plato · Carbohidrato</b><div class="mini" style="margin-top:2px">Un puño: arroz, pasta, patata, pan. Energía para entrenar.</div></div>
  <div class="ex-block"><b style="color:var(--acc2)">Grasa · con medida</b><div class="mini" style="margin-top:2px">Un chorrito de aceite o medio aguacate (un pulgar). No más.</div></div>
  <div class="note" style="margin-top:10px">💡 Cocinas una vez para toda la familia: solo ajustas <b>tus proporciones</b> en tu plato. Medio plato de verdura y tu ración de proteína, y el resto encaja solo.</div>
  <div class="note viol" style="margin-top:8px">🥤 Bebe agua, no calorías. Refrescos y alcohol son el sabotaje silencioso. Un capricho a la semana no rompe nada; la constancia el 90% del tiempo es lo que cuenta.</div>
  <div class="note gold" style="margin-top:8px">⚠️ Ojo: este reparto es para <b>comida y cena</b>. El desayuno y las meriendas tienen su propia lógica (energía + proteína + fruta). Míralo en «¿Qué preparo hoy?» → Por comida.</div>
  <p class="mini" style="margin-top:10px">Basado en el <b>Plato para Comer Saludable de Harvard</b> y la dieta mediterránea. Son pautas generales sensatas, no una dieta médica. Para algo personalizado, un dietista-nutricionista colegiado.</p>`);
}
/* ===================== NUTRICIÓN VISUAL · BIBLIOTECA DE PLATOS ===================== */
/* Platos reales por categoría con ingredientes, cantidades (modo preciso/rápido) y proteína.
   Referencia visual con emoji grande (offline, sin peso). Filtros y generador de combos.
   "Tengo que comer ahora, ¿qué preparo?" */
const DISHES=[
  // DESAYUNOS
  {cat:'desayuno',emoji:'🥣',name:'Yogur, avena y fruta',kcal:380,prot:28,min:5,tags:['rapido','altoproteina','pocosingr','familia'],ingr:[['Yogur griego natural','200 g','1 vaso'],['Avena','40 g','1 puño'],['Fruta (plátano/frutos rojos)','1 pieza','1 puño'],['Proteína en polvo (opcional)','20 g','1 cazo']],prep:'Mezcla el yogur con la avena, añade fruta troceada. Si quieres más proteína, una cucharada de proteína en polvo.',fam:'Para los peques: el mismo bol con menos avena y la fruta bien troceada. Sin proteína en polvo.'},
  {cat:'desayuno',emoji:'🍳',name:'Huevos revueltos con pan',kcal:400,prot:30,min:8,tags:['rapido','altoproteina','pocosingr','antesent','familia'],ingr:[['Huevos','3','3'],['Pan integral','2 rebanadas','2 puños'],['Aceite de oliva','1 chorrito','1 pulgar'],['Tomate','1','1']],prep:'Revuelve los huevos a fuego suave. Tuesta el pan, frota tomate y un hilo de aceite.',fam:'Para los peques: 1 huevo revuelto y pan en trocitos. Les encanta.'},
  {cat:'desayuno',emoji:'🥪',name:'Tostada de pavo y aguacate',kcal:420,prot:26,min:5,tags:['rapido','pocosingr','familia'],ingr:[['Pan integral','2 rebanadas','2 puños'],['Pavo/jamón','80 g','1 palma'],['Aguacate','½','1 pulgar']],prep:'Tuesta el pan, extiende el aguacate y pon el pavo encima.',fam:'Para los peques: media tostada cortada en tiras (les es más fácil de coger).'},
  // COMIDAS
  {cat:'comida',emoji:'🍗',name:'Pollo, arroz y verduras',kcal:520,prot:45,min:25,tags:['altoproteina','mealprep','despuesent','familia'],ingr:[['Pollo','180 g','1 palma grande'],['Arroz cocido','150 g','1 puño'],['Verduras salteadas','200 g','2 puños'],['Aceite de oliva','1 chorrito','1 pulgar']],prep:'Cocina el pollo a la plancha. Hierve el arroz. Saltea las verduras. Plato ideal de meal prep: multiplica cantidades y guarda en táperes.',fam:'La misma cazuela para todos. Tú: ½ plato de verdura. Peques: más arroz, verdura blandita y pollo desmenuzado.'},
  {cat:'comida',emoji:'🐟',name:'Lentejas con atún',kcal:480,prot:38,min:15,tags:['altoproteina','pocosingr','mealprep','familia'],ingr:[['Lentejas cocidas','200 g','1 puño grande'],['Atún al natural','1 lata','1 palma'],['Verdura (cebolla, pimiento)','100 g','1 puño'],['Aceite de oliva','1 chorrito','1 pulgar']],prep:'Mezcla las lentejas ya cocidas con el atún escurrido y la verdura picada. Frío o templado.',fam:'Para los peques: lentejas con la verdura muy picada; el atún aparte si no les gusta mezclado.'},
  {cat:'comida',emoji:'🥩',name:'Ternera con patata y ensalada',kcal:550,prot:42,min:25,tags:['altoproteina','despuesent','familia'],ingr:[['Ternera magra','170 g','1 palma'],['Patata','250 g','2 puños'],['Ensalada','libre','½ plato']],prep:'Ternera a la plancha, patata cocida o al horno, ensalada grande de acompañamiento.',fam:'Para los peques: ternera en trocitos pequeños y patata chafada. La ensalada, en bastones de zanahoria/pepino.'},
  {cat:'comida',emoji:'🍝',name:'Pasta con pollo y verdura',kcal:560,prot:40,min:20,tags:['despuesent','mealprep','familia'],ingr:[['Pasta integral','80 g seca','1 puño'],['Pollo','150 g','1 palma'],['Verduras','150 g','1 puño'],['Tomate triturado','100 g','']],prep:'Cuece la pasta. Saltea el pollo troceado con verduras y tomate. Mezcla.',fam:'Plato estrella familiar: la verdura triturada en el tomate «desaparece» y los peques ni la notan.'},
  // CENAS
  {cat:'cena',emoji:'🐟',name:'Salmón, patata y ensalada',kcal:500,prot:38,min:25,tags:['altoproteina','pocosingr','familia'],ingr:[['Salmón','170 g','1 palma'],['Patata','200 g','1 puño grande'],['Ensalada','libre','½ plato']],prep:'Salmón al horno o plancha, patata cocida, ensalada. Cena completa y ligera.',fam:'Para los peques: salmón sin espinas desmenuzado y patata chafada con un hilo de aceite.'},
  {cat:'cena',emoji:'🍳',name:'Tortilla de verduras',kcal:360,prot:26,min:15,tags:['rapido','pocosingr','altoproteina','familia'],ingr:[['Huevos','3','3'],['Verduras (calabacín, cebolla)','150 g','1 puño'],['Aceite','1 chorrito','1 pulgar']],prep:'Saltea las verduras, añade los huevos batidos y cuaja la tortilla. Rápida y saciante.',fam:'Cena familiar por excelencia: la verdura rallada fina pasa desapercibida. Un trozo para cada uno.'},
  {cat:'cena',emoji:'🥗',name:'Ensalada de pollo completa',kcal:400,prot:38,min:12,tags:['rapido','altoproteina','despuesent'],ingr:[['Pollo','150 g','1 palma'],['Ensalada variada','libre','½ plato'],['Garbanzos cocidos','80 g','½ puño'],['Aceite','1 chorrito','1 pulgar']],prep:'Pollo a tiras sobre ensalada abundante con un puñado de garbanzos. Ligera pero con proteína.',fam:'Para los peques: el pollo y los garbanzos aparte, la verdura en bastoncitos.'},
  {cat:'cena',emoji:'🍤',name:'Revuelto de gambas y verduras',kcal:340,prot:32,min:12,tags:['rapido','altoproteina','pocosingr'],ingr:[['Gambas','150 g','1 palma'],['Verduras salteadas','200 g','2 puños'],['Huevo','1','1']],prep:'Saltea gambas y verduras, añade un huevo para ligar. Muy proteico y bajo en calorías.',fam:'Para los peques mejor otra opción (marisco): tortilla francesa con la misma verdura.'},
  // SNACKS
  {cat:'snack',emoji:'🥛',name:'Batido de proteína y fruta',kcal:200,prot:25,min:3,tags:['rapido','altoproteina','pocosingr','despuesent'],ingr:[['Proteína en polvo','30 g','1 cazo'],['Leche o bebida vegetal','250 ml','1 vaso'],['Fruta','1','1']],prep:'Bate todo. Ideal justo después de entrenar.',fam:'Es tu snack post-entreno. Para los peques, mejor fruta + yogur natural.'},
  {cat:'snack',emoji:'🥜',name:'Yogur con frutos secos',kcal:230,prot:18,min:2,tags:['rapido','pocosingr','familia'],ingr:[['Yogur griego','150 g','1 vaso'],['Frutos secos','20 g','1 pulgar']],prep:'Yogur con un puñado pequeño de frutos secos. Saciante entre horas.',fam:'Para los peques: yogur natural con fruta troceada (los frutos secos enteros no, riesgo de atragantamiento).'},
  {cat:'snack',emoji:'🍎',name:'Fruta y pavo',kcal:180,prot:16,min:2,tags:['rapido','pocosingr','antesent','familia'],ingr:[['Fruta','1','1'],['Pavo lonchas','60 g','1 palma fina']],prep:'Una pieza de fruta con unas lonchas de pavo. Perfecto antes de entrenar.',fam:'Merienda perfecta para toda la familia: fruta troceada + pavo en tiras.'},
  // MÁS DESAYUNOS
  {cat:'desayuno',emoji:'🥞',name:'Tortitas de avena y huevo',kcal:420,prot:32,min:12,tags:['altoproteina','despuesent','familia'],ingr:[['Avena','60 g','1 puño grande'],['Huevos','2','2'],['Clara de huevo','2','2'],['Plátano','1','1'],['Canela','al gusto','']],prep:'Tritura avena, huevos, claras y plátano. Cuaja como tortitas en la sartén. Muy saciantes.',fam:'A los peques les encantan: hazlas pequeñitas y sin canela si no la quieren.'},
  {cat:'desayuno',emoji:'🍅',name:'Tostada de tomate, aceite y huevo',kcal:360,prot:22,min:8,tags:['rapido','pocosingr','familia'],ingr:[['Pan integral','2 rebanadas','2 puños'],['Tomate maduro','1','1'],['Huevo','2','2'],['Aceite de oliva','1 chorrito','1 pulgar']],prep:'Pan a la tostadora, tomate rallado y un hilo de aceite. Huevo a la plancha o pasado por agua encima. Desayuno mediterráneo clásico.',fam:'Media tostada en tiras para los peques. Sin sal añadida.'},
  {cat:'desayuno',emoji:'🥛',name:'Requesón con fruta y nueces',kcal:340,prot:28,min:3,tags:['rapido','altoproteina','pocosingr'],ingr:[['Requesón o queso fresco batido','200 g','1 vaso'],['Fruta','1','1 puño'],['Nueces','15 g','½ pulgar'],['Miel (opcional)','1 cdta','']],prep:'Requesón con fruta troceada y unas nueces. Muchísima proteína y muy saciante.'},
  // MÁS COMIDAS
  {cat:'comida',emoji:'🍤',name:'Garbanzos con espinacas y huevo',kcal:490,prot:30,min:20,tags:['altoproteina','mealprep','familia'],ingr:[['Garbanzos cocidos','200 g','1 puño grande'],['Espinacas','150 g','2 puños'],['Huevo','2','2'],['Aceite de oliva','1 chorrito','1 pulgar'],['Ajo y pimentón','al gusto','']],prep:'Saltea ajo, añade espinacas y garbanzos, y corona con huevo. Potaje ligero muy mediterráneo.',fam:'Para los peques: garbanzos aplastados con las espinacas bien picadas.'},
  {cat:'comida',emoji:'🐟',name:'Merluza al horno con patata',kcal:470,prot:40,min:30,tags:['altoproteina','pocosingr','familia'],ingr:[['Merluza','200 g','1 palma grande'],['Patata','200 g','1 puño grande'],['Cebolla y pimiento','100 g','1 puño'],['Aceite de oliva','1 chorrito','1 pulgar']],prep:'Patata en rodajas + verdura de cama, merluza encima, aceite y al horno 20-25 min. Plato de domingo, sano y para todos.',fam:'Merluza sin espinacas desmenuzada y patata chafada para los peques.'},
  {cat:'comida',emoji:'🍚',name:'Arroz con pollo y verduras (tipo paella)',kcal:560,prot:38,min:30,tags:['mealprep','familia','despuesent'],ingr:[['Arroz','80 g seco','1 puño'],['Pollo','150 g','1 palma'],['Verduras (pimiento, judía, alcachofa)','200 g','2 puños'],['Caldo y azafrán','','']],prep:'Sofríe pollo y verduras, añade arroz y caldo, cuece. Un arroz mediterráneo que come toda la familia.',fam:'El plato familiar por excelencia. Para los peques, ración pequeña y pollo desmenuzado.'},
  {cat:'comida',emoji:'🥗',name:'Ensalada de garbanzos, atún y huevo',kcal:450,prot:34,min:12,tags:['rapido','altoproteina','mealprep'],ingr:[['Garbanzos cocidos','150 g','1 puño'],['Atún al natural','1 lata','1 palma'],['Huevo duro','1','1'],['Tomate, cebolla, pepino','libre','½ plato'],['Aceite de oliva','1 chorrito','1 pulgar']],prep:'Mezcla todo en frío. Ideal para llevar en táper y no pasar hambre.'},
  {cat:'comida',emoji:'🌯',name:'Wrap integral de pollo y verduras',kcal:520,prot:36,min:15,tags:['rapido','familia','despuesent'],ingr:[['Tortilla integral','1 grande','2 puños'],['Pollo','150 g','1 palma'],['Verduras (lechuga, tomate, pimiento)','libre','½ plato'],['Yogur o hummus','1 cda','1 pulgar']],prep:'Rellena la tortilla con pollo a tiras, verdura y una cucharada de yogur o hummus. Enrolla.',fam:'Para los peques, mini-wrap cortado en rueditas.'},
  // MÁS CENAS
  {cat:'cena',emoji:'🍲',name:'Crema de verduras con huevo y jamón',kcal:320,prot:24,min:20,tags:['pocosingr','familia'],ingr:[['Verduras (puerro, calabacín, zanahoria)','300 g','3 puños'],['Huevo duro','2','2'],['Jamón/pavo en taquitos','60 g','1 palma fina'],['Aceite de oliva','1 chorrito','1 pulgar']],prep:'Hierve y tritura las verduras. Sirve con huevo duro picado y taquitos de jamón por encima para dar proteína. Cena calentita y ligera.',fam:'La crema es perfecta para los peques. A ellos, sin el jamón si no lo quieren.'},
  {cat:'cena',emoji:'🐙',name:'Sepia o calamar a la plancha con ensalada',kcal:300,prot:34,min:15,tags:['altoproteina','pocosingr'],ingr:[['Sepia o calamar','200 g','1 palma grande'],['Ensalada','libre','½ plato'],['Ajo y perejil','al gusto',''],['Aceite de oliva','1 chorrito','1 pulgar']],prep:'Sepia a la plancha con ajo y perejil, ensalada de acompañamiento. Muchísima proteína, muy pocas calorías.'},
  {cat:'cena',emoji:'🥦',name:'Salmón con brócoli al vapor',kcal:420,prot:38,min:18,tags:['altoproteina','pocosingr','familia'],ingr:[['Salmón','170 g','1 palma'],['Brócoli','200 g','2 puños'],['Aceite de oliva','1 chorrito','1 pulgar'],['Limón','½','']],prep:'Brócoli al vapor y salmón a la plancha con limón. Cena de 15 minutos, saciante y completa.',fam:'Salmón desmenuzado sin espinas y brócoli bien blandito para los peques.'},
  {cat:'cena',emoji:'🍳',name:'Tortilla francesa con jamón y ensalada',kcal:350,prot:28,min:10,tags:['rapido','altoproteina','pocosingr','familia'],ingr:[['Huevos','3','3'],['Jamón serrano/york','50 g','1 palma fina'],['Ensalada','libre','½ plato'],['Aceite de oliva','1 chorrito','1 pulgar']],prep:'Tortilla francesa con taquitos de jamón y ensalada al lado. Rápida y resuelve la cena.',fam:'Tortilla partida en trozos para los peques.'},
  // MÁS MERIENDAS / SNACKS
  {cat:'snack',emoji:'🥕',name:'Hummus con crudités',kcal:220,prot:10,min:5,tags:['rapido','familia'],ingr:[['Hummus','60 g','1 pulgar grande'],['Zanahoria, pepino, pimiento','libre','1 puño'],['Palitos integrales (opcional)','20 g','']],prep:'Bastones de verdura para mojar en hummus. Snack saciante y con fibra.',fam:'A los peques les divierte mojar los bastoncitos.'},
  {cat:'snack',emoji:'🧀',name:'Tostada de queso fresco y pavo',kcal:250,prot:22,min:4,tags:['rapido','altoproteina','pocosingr','familia'],ingr:[['Pan integral','1 rebanada','1 puño'],['Queso fresco batido','60 g','1 pulgar'],['Pavo','50 g','1 palma fina']],prep:'Pan con queso fresco y pavo. Merienda con proteína que no engorda.'},
  {cat:'snack',emoji:'🍌',name:'Plátano con crema de cacahuete',kcal:260,prot:9,min:2,tags:['rapido','pocosingr','antesent'],ingr:[['Plátano','1','1'],['Crema de cacahuete 100%','1 cda','1 pulgar']],prep:'Plátano con una cucharada de crema de cacahuete. Energía antes de entrenar (ojo con la ración de crema).'}
];
const DIET_FILTERS=[['todos','Todos'],['desayuno','🍳 Desayuno'],['comida','☀️ Comida'],['cena','🌙 Cena'],['snack','🥛 Snack'],['altoproteina','💪 Alto proteína'],['rapido','⚡ Rápido'],['familia','👨‍👩‍👧‍👦 Familia'],['pocosingr','🥄 Pocos ingr.'],['mealprep','🍱 Meal prep'],['antesent','🔋 Antes entrenar'],['despuesent','🏋️ Después entrenar']];
let dietFilter='todos';
function renderFoodExplorer(){
  const el=document.getElementById('foodExplorer');if(!el)return;
  const dishes=DISHES.filter(d=>dietFilter==='todos'||d.cat===dietFilter||(d.tags||[]).includes(dietFilter));
  el.innerHTML=`<div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:6px;margin-bottom:10px">${DIET_FILTERS.map(f=>`<button class="btn-sm ${dietFilter===f[0]?'btn-acc2':'btn2'}" style="white-space:nowrap" onclick="setDietFilter('${f[0]}')">${f[1]}</button>`).join('')}</div>
  <div style="display:flex;flex-direction:column;gap:8px">${dishes.map((d,i)=>`<div class="ex-block" style="cursor:pointer" onclick="openDish(${DISHES.indexOf(d)})"><div style="display:flex;align-items:center;gap:12px"><div style="font-size:38px">${d.emoji}</div><div style="flex:1"><b>${d.name}${(d.tags||[]).includes('familia')?' <span title="Adaptable a los peques">👨‍👩‍👧‍👦</span>':''}</b><div class="mini">${d.kcal} kcal · ${d.prot} g proteína${d.min?' · ⏱️ '+d.min+' min':''}</div><div class="mini" style="color:var(--acc2)">${(d.tags||[]).filter(t=>t!=='familia').slice(0,3).map(t=>({altoproteina:'alto proteína',rapido:'rápido',pocosingr:'pocos ingr.',mealprep:'meal prep',antesent:'pre-entreno',despuesent:'post-entreno'}[t]||t)).join(' · ')}</div></div><div style="color:var(--acc)">›</div></div></div>`).join('')}</div>
  ${dishes.length===0?'<p class="empty">No hay platos con ese filtro.</p>':''}`;
}
function setDietFilter(f){dietFilter=f;renderFoodExplorer();}
function openDish(idx){
  const d=DISHES[idx];const precise=DB.diet&&DB.diet.mode!=='rapido';
  const main=d.cat==='comida'||d.cat==='cena';
  openModal(`<div style="text-align:center;font-size:64px">${d.emoji}</div><h3 style="text-align:center">${d.name}</h3>
  <div class="stat-grid" style="margin:10px 0;grid-template-columns:repeat(3,1fr)"><div class="stat"><div class="v acc">${d.kcal}</div><div class="l">kcal aprox</div></div><div class="stat"><div class="v acc2">${d.prot} g</div><div class="l">proteína</div></div><div class="stat"><div class="v gold">${d.min||'-'}</div><div class="l">min</div></div></div>
  <div class="row" style="gap:6px;margin-bottom:8px"><button class="btn-sm ${precise?'btn-acc2':'btn2'}" style="flex:1" onclick="setDietMode('precision',${idx})">⚖️ Precisión</button><button class="btn-sm ${!precise?'btn-acc2':'btn2'}" style="flex:1" onclick="setDietMode('rapido',${idx})">✋ Rápido</button></div>
  <b style="font-family:Anton;font-size:13px">Ingredientes</b>
  ${d.ingr.map(i=>`<div class="sub-opt"><span>${i[0]}</span><span class="mini" style="color:var(--acc2)">${precise?i[1]:(i[2]||i[1])}</span></div>`).join('')}
  <b style="font-family:Anton;font-size:13px;display:block;margin-top:10px">Preparación</b>
  <p class="mini" style="margin-top:4px">${d.prep}</p>
  ${d.fam?`<div class="note" style="margin-top:10px;border-color:var(--viol)"><b style="color:var(--viol)">👨‍👩‍👧‍👦 Para los peques</b><div class="mini" style="margin-top:3px">${d.fam}</div></div>`:''}
  ${main?`<div class="note gold" style="margin-top:8px">🍽️ <b>Encaja con el plato saludable</b>: proteína del tamaño de tu palma, ¼ de hidrato (un puño) y llena ½ plato de verdura. Grasa buena: un hilo de aceite de oliva.</div>`:''}
  <p class="mini" style="margin-top:10px;color:var(--dim)">Cantidades y calorías orientativas. ${precise?'Modo precisión: pesa para aprender las raciones.':'Modo rápido: usa la mano como medida (palma=proteína, puño=carbo, pulgar=grasa).'}</p>
  <p class="mini" style="color:var(--dim)">Basado en el Plato para Comer Saludable (Harvard) y la dieta mediterránea. Pautas generales, no dieta médica.</p>`);
}
function setDietMode(m,idx){DB.diet=DB.diet||{log:{}};DB.diet.mode=m;save();openDish(idx);}
/* Generador «Construye tu plato»: 1 proteína + 1 hidrato + 1-2 verduras + 1 fruta (patrón plato saludable de Harvard) */
const COMBO_PROT=[['🍗','Pollo','1 palma','40 g prot'],['🥩','Ternera','1 palma','38 g'],['🐟','Pescado','1 palma','35 g'],['🥚','Huevos (3)','3','20 g'],['🫘','Legumbres','1 puño','18 g'],['🥫','Atún','1 lata','25 g']];
const COMBO_CARB=[['🍚','Arroz','1 puño'],['🥔','Patata','1 puño grande'],['🍝','Pasta','1 puño'],['🍞','Pan','2 puños'],['🍠','Boniato','1 puño'],['—','Sin carbo (más verdura)','']];
const COMBO_VEG=[['🥦','Brócoli',''],['🥗','Ensalada',''],['🥕','Verduras salteadas',''],['🍅','Pisto/tomate',''],['🫑','Pimientos',''],['🥬','Espinacas','']];
const COMBO_FRUIT=[['🍎','Manzana'],['🍌','Plátano'],['🍊','Naranja'],['🍓','Frutos rojos'],['🍐','Pera'],['—','Sin fruta']];
let combo={p:0,c:0,v:0,f:0};
function renderCombo(){
  const el=document.getElementById('comboBuilder');if(!el)return;
  el.innerHTML=`<p class="mini" style="margin-bottom:8px">Elige <b>1 proteína + 1 hidrato + 1-2 verduras + 1 fruta</b>. FORJA arma el plato y calcula la proteína aproximada.</p>
  <b style="font-family:Anton;font-size:12px;color:var(--acc)">PROTEÍNA (¼ plato)</b><div style="display:flex;gap:6px;overflow-x:auto;padding:4px 0">${COMBO_PROT.map((x,i)=>`<button class="btn-sm ${combo.p===i?'btn-acc2':'btn2'}" style="white-space:nowrap" onclick="setCombo('p',${i})">${x[0]} ${x[1]}</button>`).join('')}</div>
  <b style="font-family:Anton;font-size:12px;color:var(--gold)">HIDRATO (¼ plato)</b><div style="display:flex;gap:6px;overflow-x:auto;padding:4px 0">${COMBO_CARB.map((x,i)=>`<button class="btn-sm ${combo.c===i?'btn-gold':'btn2'}" style="white-space:nowrap" onclick="setCombo('c',${i})">${x[0]} ${x[1]}</button>`).join('')}</div>
  <b style="font-family:Anton;font-size:12px;color:var(--ok)">VERDURA (½ plato)</b><div style="display:flex;gap:6px;overflow-x:auto;padding:4px 0">${COMBO_VEG.map((x,i)=>`<button class="btn-sm ${combo.v===i?'btn-acc2':'btn2'}" style="white-space:nowrap" onclick="setCombo('v',${i})">${x[0]} ${x[1]}</button>`).join('')}</div>
  <b style="font-family:Anton;font-size:12px;color:var(--viol)">FRUTA (postre)</b><div style="display:flex;gap:6px;overflow-x:auto;padding:4px 0">${COMBO_FRUIT.map((x,i)=>`<button class="btn-sm ${combo.f===i?'btn-viol':'btn2'}" style="white-space:nowrap" onclick="setCombo('f',${i})">${x[0]} ${x[1]}</button>`).join('')}</div>
  <div class="note" style="margin-top:10px;border-color:var(--acc2)"><div style="font-size:40px;text-align:center">${COMBO_PROT[combo.p][0]}${COMBO_CARB[combo.c][0]!=='—'?COMBO_CARB[combo.c][0]:''}${COMBO_VEG[combo.v][0]}${COMBO_FRUIT[combo.f][0]!=='—'?COMBO_FRUIT[combo.f][0]:''}</div><b>${COMBO_PROT[combo.p][1]} + ${COMBO_CARB[combo.c][1]} + ${COMBO_VEG[combo.v][1]}${COMBO_FRUIT[combo.f][1]!=='Sin fruta'?' + '+COMBO_FRUIT[combo.f][1]:''}</b><div class="mini" style="margin-top:4px">Proteína aprox: <b style="color:var(--acc2)">${COMBO_PROT[combo.p][3]}</b> · Raciones: ${COMBO_PROT[combo.p][2]} proteína, ${COMBO_CARB[combo.c][2]||'—'} hidrato, ½ plato verdura, grasa: 1 hilo de aceite</div><div class="mini" style="margin-top:4px;color:var(--viol)">👨‍👩‍👧‍👦 Toda la familia come esto: tú ajustas proporciones, los peques con raciones más pequeñas y la verdura blandita.</div></div>
  <p class="mini" style="margin-top:8px;color:var(--dim)">Estructura del Plato para Comer Saludable (Harvard). Añade agua como bebida.</p>`;
}
function setCombo(k,i){combo[k]=i;renderCombo();}

/* ===================== HUB DE NUTRICIÓN (¿Qué como hoy?) ===================== */
let foodTab='platos';
function openFoodHub(){foodTab='platos';openModal(`<h3>🍽️ ¿Qué como hoy?</h3><div id="foodSeg" style="display:flex;gap:6px;overflow-x:auto;padding-bottom:8px;margin-bottom:6px"></div><div id="foodHubBody"></div>`);renderFoodHub();}
function setFoodTab(t){foodTab=t;renderFoodHub();}
function renderFoodHub(){
  const tabs=[['platos','🍽️ Platos'],['combina','🎨 Construye'],['comida','📅 Por comida'],['fuentes','📚 Fuentes']];
  const seg=document.getElementById('foodSeg');
  if(seg)seg.innerHTML=tabs.map(t=>`<button class="btn-sm ${foodTab===t[0]?'btn-acc2':'btn2'}" style="white-space:nowrap" onclick="setFoodTab('${t[0]}')">${t[1]}</button>`).join('');
  const body=document.getElementById('foodHubBody');if(!body)return;
  if(foodTab==='platos'){body.innerHTML=`<div id="foodExplorer"></div>`;renderFoodExplorer();}
  else if(foodTab==='combina'){body.innerHTML=`<div id="comboBuilder"></div>`;renderCombo();}
  else if(foodTab==='comida'){body.innerHTML=renderMealGuide();}
  else if(foodTab==='fuentes'){body.innerHTML=renderFoodSources();}
}
/* Guía por comida: no todas las comidas se montan igual (el error del ½+¼+¼ en el desayuno) */
const MEAL_GUIDE=[
  ['🥣','Desayuno','Energía + proteína + fruta/fibra','Avena con yogur y plátano · Huevos con pan y tomate · Tostada de pavo y aguacate'],
  ['🍎','Media mañana','Algo sencillo y saciante','Fruta + yogur · Puñado de frutos secos · Bocadillo pequeño'],
  ['🍛','Comida','Plato completo (el del plato saludable)','½ verdura + ¼ proteína + ¼ hidrato · Pollo con arroz y verduras · Lentejas con atún'],
  ['🥛','Merienda','Recuperar energía sin excesos','Yogur + fruta · Tostada + queso · Batido si has entrenado'],
  ['🍽️','Cena','Completa pero más ligera que la comida','Pescado + patata + verduras · Tortilla de verduras · Ensalada de pollo']
];
function renderMealGuide(){
  return `<div class="note" style="margin-bottom:10px">No todas las comidas se montan igual. El «½ verdura + ¼ proteína + ¼ hidrato» es para <b>comida y cena</b>. El desayuno y las meriendas tienen su propia lógica:</div>
  ${MEAL_GUIDE.map(m=>`<div class="ex-block"><div style="display:flex;align-items:center;gap:10px"><div style="font-size:30px">${m[0]}</div><div style="flex:1"><b>${m[1]}</b><div class="mini" style="color:var(--acc2)">${m[2]}</div></div></div><div class="mini" style="margin-top:6px">💡 ${m[3]}</div></div>`).join('')}
  <div class="note gold" style="margin-top:10px">🍽️ <b>El plato saludable (comida y cena)</b><br>🥦 ½ plato verdura · 🍗 ¼ proteína (tu palma) · 🍚 ¼ hidrato (un puño) · 🫒 grasa buena (aceite de oliva) · 🍎 fruta de postre · 💧 agua de bebida.</div>
  <div class="note viol" style="margin-top:8px">👨‍👩‍👧‍👦 <b>Una sola cocina para todos.</b> Cocinas el mismo plato para la familia: tú ajustas <b>tus</b> proporciones (más verdura, tu ración de proteína). Los peques: raciones más pequeñas, verdura blandita o triturada, y sin picante.</div>
  <button class="btn2" style="margin-top:10px;width:100%" onclick="openPlateGuide()">📖 Ver el plato modelo en detalle</button>`;
}
/* Fuentes reales para inspirarse (necesitan internet, se abren en el navegador) */
const FOOD_SOURCES=[
  ['🥇','El Plato para Comer Saludable — Harvard','La estructura del plato, en español. La base de todo.','https://nutritionsource.hsph.harvard.edu/healthy-eating-plate/translations/spanish-spain/'],
  ['🇪🇸','Fundación Dieta Mediterránea','Menús semanales completos y buscador de recetas mediterráneas.','https://dietamediterranea.com/'],
  ['👨‍👩‍👧‍👦','En Familia — AEP','Asociación Española de Pediatría: alimentación y raciones para niños.','https://enfamilia.aeped.es/'],
  ['🏥','FAROS — Hospital Sant Joan de Déu','Alimentación infantil y familiar, orientado a padres.','https://faros.hsjdbcn.org/'],
  ['🥗','Recetario EINA Salut','Recetas mediterráneas saludables y menús por temporada.','https://einasalut.caib.es/web/ciudadania-activa/recetario']
];
function openMealGuide(){openModal(renderMealGuide());}
function renderFoodSources(){
  return `<p class="mini" style="margin-bottom:10px">FORJA no se inventa los menús: sigue criterios nutricionales reconocidos. Aquí tienes las fuentes para coger ideas (se abren en el navegador, necesitan internet):</p>
  ${FOOD_SOURCES.map(s=>`<a href="${s[3]}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit"><div class="ex-block" style="cursor:pointer"><div style="display:flex;align-items:center;gap:10px"><div style="font-size:26px">${s[0]}</div><div style="flex:1"><b>${s[1]}</b><div class="mini">${s[2]}</div></div><div style="color:var(--acc2)">↗</div></div></div></a>`).join('')}
  <p class="mini" style="margin-top:10px;color:var(--dim)">Jerarquía de FORJA: Harvard (estructura del plato) + Dieta Mediterránea (ideas de menús) + AEP/Sant Joan de Déu (adaptación a los niños). Todo son pautas generales, no una dieta médica; para algo personalizado, un dietista-nutricionista colegiado.</p>`;
}

/* ===================== ALIMENTOS PARA PESAR (lo calórico) ===================== */
/* Valores por 100 g de alimento tal como se come (cocido salvo indicación). Orientativos.
   Solo lo que aporta calorías de verdad: proteína, carbo, legumbre, grasa, fruta, lácteo.
   La VERDURA no se pesa: va «a voluntad», llena medio plato. */
const FOOD_DB=[
  // PROTEÍNA
  {e:'🍗',n:'Pechuga de pollo',cat:'proteina',kcal:165,p:31,c:0,f:4},
  {e:'🦃',n:'Pavo',cat:'proteina',kcal:135,p:29,c:0,f:1},
  {e:'🥩',n:'Ternera magra',cat:'proteina',kcal:180,p:26,c:0,f:8},
  {e:'🐖',n:'Lomo de cerdo',cat:'proteina',kcal:165,p:27,c:0,f:6},
  {e:'🥚',n:'Huevo (100 g ≈ 2 uds)',cat:'proteina',kcal:155,p:13,c:1,f:11},
  {e:'🐟',n:'Atún al natural',cat:'proteina',kcal:116,p:26,c:0,f:1},
  {e:'🐟',n:'Salmón',cat:'proteina',kcal:208,p:20,c:0,f:13},
  {e:'🐟',n:'Merluza / pescado blanco',cat:'proteina',kcal:90,p:18,c:0,f:2},
  {e:'🍤',n:'Gambas',cat:'proteina',kcal:99,p:24,c:0,f:0.3},
  {e:'🦑',n:'Sepia / calamar',cat:'proteina',kcal:92,p:16,c:3,f:1},
  {e:'🥛',n:'Queso fresco batido / requesón',cat:'proteina',kcal:90,p:12,c:4,f:3},
  {e:'🥛',n:'Yogur griego natural',cat:'proteina',kcal:97,p:9,c:4,f:5},
  {e:'🍖',n:'Jamón serrano',cat:'proteina',kcal:240,p:31,c:0,f:12},
  {e:'🥓',n:'Pavo / jamón york',cat:'proteina',kcal:105,p:18,c:1,f:3},
  {e:'🥤',n:'Proteína en polvo (cazo ≈ 30 g)',cat:'proteina',kcal:380,p:80,c:8,f:6},
  {e:'🧈',n:'Tofu',cat:'proteina',kcal:145,p:16,c:3,f:8},
  // CARBOHIDRATO
  {e:'🍚',n:'Arroz cocido',cat:'carbo',kcal:130,p:2.7,c:28,f:0.3},
  {e:'🍝',n:'Pasta cocida',cat:'carbo',kcal:158,p:6,c:31,f:1},
  {e:'🥔',n:'Patata cocida',cat:'carbo',kcal:87,p:2,c:20,f:0.1},
  {e:'🍠',n:'Boniato cocido',cat:'carbo',kcal:90,p:2,c:21,f:0.1},
  {e:'🍞',n:'Pan integral',cat:'carbo',kcal:250,p:9,c:45,f:3},
  {e:'🌾',n:'Quinoa cocida',cat:'carbo',kcal:120,p:4.4,c:21,f:1.9},
  {e:'🥣',n:'Avena (cruda)',cat:'carbo',kcal:380,p:13,c:60,f:7},
  {e:'🍥',n:'Cuscús cocido',cat:'carbo',kcal:112,p:3.8,c:23,f:0.2},
  {e:'🌯',n:'Tortilla integral (wrap)',cat:'carbo',kcal:300,p:8,c:50,f:7},
  // LEGUMBRE
  {e:'🫘',n:'Lentejas cocidas',cat:'legumbre',kcal:116,p:9,c:20,f:0.4},
  {e:'🫛',n:'Garbanzos cocidos',cat:'legumbre',kcal:164,p:9,c:27,f:2.6},
  {e:'🫘',n:'Alubias cocidas',cat:'legumbre',kcal:127,p:9,c:22,f:0.5},
  {e:'🟢',n:'Guisantes',cat:'legumbre',kcal:84,p:5,c:14,f:0.4},
  {e:'🥣',n:'Hummus',cat:'legumbre',kcal:170,p:8,c:15,f:10},
  // GRASA
  {e:'🫒',n:'Aceite de oliva (cda ≈ 10 g)',cat:'grasa',kcal:884,p:0,c:0,f:100},
  {e:'🥑',n:'Aguacate',cat:'grasa',kcal:160,p:2,c:9,f:15},
  {e:'🥜',n:'Frutos secos',cat:'grasa',kcal:620,p:15,c:12,f:55},
  {e:'🥜',n:'Crema de cacahuete',cat:'grasa',kcal:590,p:25,c:20,f:50},
  {e:'🫒',n:'Aceitunas',cat:'grasa',kcal:145,p:1,c:6,f:15},
  // FRUTA
  {e:'🍌',n:'Plátano',cat:'fruta',kcal:89,p:1,c:23,f:0.3},
  {e:'🍎',n:'Manzana',cat:'fruta',kcal:52,p:0.3,c:14,f:0.2},
  {e:'🍊',n:'Naranja',cat:'fruta',kcal:47,p:0.9,c:12,f:0.1},
  {e:'🍓',n:'Fresas',cat:'fruta',kcal:32,p:0.7,c:8,f:0.3},
  {e:'🍇',n:'Uvas',cat:'fruta',kcal:69,p:0.7,c:18,f:0.2},
  // LÁCTEO
  {e:'🥛',n:'Leche semidesnatada',cat:'lacteo',kcal:47,p:3.3,c:5,f:1.6},
  {e:'🥛',n:'Yogur natural',cat:'lacteo',kcal:60,p:4,c:5,f:3}
];
const FOOD_CATS=[['proteina','🍗 Proteína'],['carbo','🍚 Carbohidrato'],['legumbre','🫘 Legumbre'],['grasa','🫒 Grasa'],['fruta','🍎 Fruta'],['lacteo','🥛 Lácteo']];
let weighCat='proteina', weighPlate=[]; // [{i:indexFOOD_DB, g:gramos}]
/* Referencia de déficit suave (orientativa, no médica) */
function currentWeight(){return (DB.body&&DB.body[0]&&DB.body[0].peso)||DB.profile.weight||118;}
function gentleTargets(){
  const w=currentWeight(), h=DB.profile.height||183, age=DB.profile.age||38;
  const bmr=Math.round(10*w+6.25*h-5*age+5);       // Mifflin-St Jeor (hombre)
  const maint=Math.round(bmr*1.5);                   // actividad moderada-alta
  const defLo=Math.round((maint-500)/10)*10, defHi=Math.round((maint-300)/10)*10; // -300 a -500
  const objW=(DB.goalWeight||105);
  const protLo=Math.round(objW*1.6), protHi=Math.round(objW*2); // 1.6-2 g/kg del peso objetivo
  return {w,maint,defLo,defHi,protLo,protHi};
}
/* ===================== COCINA INTELIGENTE (inventario · batch · motor · compra) =====================
   FORJA propone, el usuario decide. Flujo: lo que tengo → qué puedo comer → qué falta → qué he comido.
   Motor de COMPONENTES: pocos componentes generan cientos de platos coherentes con lo que hay en casa. */
const COMPONENTS=[
  // PROTEÍNAS (b=batchable: aguanta preparado)
  {k:'pollo',e:'🍗',n:'Pechuga de pollo',cat:'prot',b:1},{k:'pinchos_pollo',e:'🍢',n:'Pinchos de pollo',cat:'prot',b:1},{k:'muslo_pollo',e:'🍗',n:'Muslo de pollo',cat:'prot',b:1},
  {k:'pavo_fil',e:'🦃',n:'Pavo',cat:'prot',b:1},{k:'hamb_pavo',e:'🍔',n:'Hamburguesa de pavo',cat:'prot',b:0},{k:'salch_pollo',e:'🌭',n:'Salchichas de pollo',cat:'prot',b:0},
  {k:'ternera',e:'🥩',n:'Ternera',cat:'prot',b:1},{k:'lomo',e:'🐖',n:'Lomo de cerdo',cat:'prot',b:1},{k:'albondigas',e:'🧆',n:'Albóndigas',cat:'prot',b:1},{k:'butifarra',e:'🌭',n:'Butifarra',cat:'prot',b:0},
  {k:'huevos',e:'🥚',n:'Huevos',cat:'prot',b:0},{k:'atun',e:'🥫',n:'Atún',cat:'prot',b:0},{k:'salmon',e:'🐟',n:'Salmón',cat:'prot',b:0},{k:'merluza',e:'🐟',n:'Merluza',cat:'prot',b:0},
  {k:'gambas',e:'🍤',n:'Gambas',cat:'prot',b:0},{k:'sepia',e:'🦑',n:'Sepia/calamar',cat:'prot',b:0},{k:'tofu',e:'🧈',n:'Tofu',cat:'prot',b:1},{k:'jamon',e:'🥓',n:'Pavo/jamón lonchas',cat:'prot',b:0},
  // HIDRATOS
  {k:'arroz',e:'🍚',n:'Arroz',cat:'hidrato',b:1},{k:'pasta',e:'🍝',n:'Pasta',cat:'hidrato',b:1},{k:'patata',e:'🥔',n:'Patata',cat:'hidrato',b:1},{k:'boniato',e:'🍠',n:'Boniato',cat:'hidrato',b:1},
  {k:'quinoa',e:'🌾',n:'Quinoa',cat:'hidrato',b:1},{k:'pan',e:'🍞',n:'Pan integral',cat:'hidrato',b:0},{k:'avena',e:'🥣',n:'Avena',cat:'hidrato',b:0},{k:'cuscus',e:'🍥',n:'Cuscús',cat:'hidrato',b:1},{k:'wrap',e:'🌯',n:'Wrap integral',cat:'hidrato',b:0},
  // LEGUMBRES (cuentan como hidrato+proteína vegetal)
  {k:'lentejas',e:'🫘',n:'Lentejas',cat:'legumbre',b:1},{k:'garbanzos',e:'🫛',n:'Garbanzos',cat:'legumbre',b:1},{k:'alubias',e:'🫘',n:'Alubias',cat:'legumbre',b:1},
  // VERDURAS (libres, no se pesan)
  {k:'brocoli',e:'🥦',n:'Brócoli',cat:'verdura',b:1},{k:'calabacin',e:'🥒',n:'Calabacín',cat:'verdura',b:1},{k:'pimientos',e:'🫑',n:'Pimientos',cat:'verdura',b:1},{k:'berenjena',e:'🍆',n:'Berenjena',cat:'verdura',b:1},
  {k:'esparragos',e:'🌱',n:'Espárragos',cat:'verdura',b:1},{k:'judias',e:'🫛',n:'Judías verdes',cat:'verdura',b:1},{k:'zanahoria',e:'🥕',n:'Zanahoria',cat:'verdura',b:1},{k:'espinacas',e:'🥬',n:'Espinacas',cat:'verdura',b:0},
  {k:'ensalada',e:'🥗',n:'Ensalada',cat:'verdura',b:0},{k:'tomate',e:'🍅',n:'Tomate',cat:'verdura',b:0},{k:'champinones',e:'🍄',n:'Champiñones',cat:'verdura',b:0},{k:'cebolla',e:'🧅',n:'Cebolla',cat:'verdura',b:0},
  // SALSAS / COMPLEMENTOS
  {k:'aove',e:'🫒',n:'AOVE',cat:'salsa',b:0},{k:'guacamole',e:'🥑',n:'Guacamole',cat:'salsa',b:0},{k:'hummus',e:'🥣',n:'Hummus',cat:'salsa',b:0},{k:'pesto',e:'🌿',n:'Pesto',cat:'salsa',b:0},
  {k:'yogurt_sauce',e:'🥛',n:'Salsa de yogur',cat:'salsa',b:0},{k:'tomate_casero',e:'🍅',n:'Tomate casero',cat:'salsa',b:0},{k:'aguacate',e:'🥑',n:'Aguacate',cat:'salsa',b:0},{k:'aceitunas',e:'🫒',n:'Aceitunas',cat:'salsa',b:0},
  {k:'frutossecos',e:'🥜',n:'Frutos secos',cat:'salsa',b:0},{k:'cebolla_car',e:'🧅',n:'Cebolla caramelizada',cat:'salsa',b:0},
  // FRUTAS
  {k:'platano',e:'🍌',n:'Plátano',cat:'fruta',b:0},{k:'manzana',e:'🍎',n:'Manzana',cat:'fruta',b:0},{k:'naranja',e:'🍊',n:'Naranja',cat:'fruta',b:0},{k:'fresas',e:'🍓',n:'Fresas',cat:'fruta',b:0},{k:'pera',e:'🍐',n:'Pera',cat:'fruta',b:0},{k:'kiwi',e:'🥝',n:'Kiwi',cat:'fruta',b:0},{k:'uvas',e:'🍇',n:'Uvas',cat:'fruta',b:0},
  // LÁCTEOS
  {k:'yogur_griego',e:'🥛',n:'Yogur griego',cat:'lacteo',b:0},{k:'yogur_nat',e:'🥛',n:'Yogur natural',cat:'lacteo',b:0},{k:'queso_fresco',e:'🧀',n:'Queso fresco',cat:'lacteo',b:0},{k:'requeson',e:'🥛',n:'Requesón',cat:'lacteo',b:0},{k:'leche',e:'🥛',n:'Leche',cat:'lacteo',b:0}
];
/* Base ampliada: cualquier alimento habitual de compra mediterránea española.
   Flags: b=batch cooking, oc=consumo ocasional (procesado). cat alimenta el motor; 'especia' se ignora en combos. */
const FOODMORE=[
  // CARNES Y AVES
  {k:'contramuslo_pollo',e:'🍗',n:'Contramuslo de pollo',cat:'prot',b:1},{k:'hamb_pollo',e:'🍔',n:'Hamburguesa de pollo',cat:'prot'},{k:'pechuga_pavo',e:'🦃',n:'Pechuga de pavo',cat:'prot',b:1},{k:'picada_pavo',e:'🦃',n:'Carne picada de pavo',cat:'prot',b:1},
  {k:'ternera_magra',e:'🥩',n:'Ternera magra',cat:'prot',b:1},{k:'picada_ternera',e:'🥩',n:'Picada de ternera',cat:'prot',b:1},{k:'solomillo_ternera',e:'🥩',n:'Solomillo de ternera',cat:'prot'},{k:'entrecot',e:'🥩',n:'Entrecot',cat:'prot'},
  {k:'solomillo_cerdo',e:'🐖',n:'Solomillo de cerdo',cat:'prot',b:1},{k:'chuleta_cerdo',e:'🐖',n:'Chuleta de cerdo',cat:'prot'},{k:'picada_cerdo',e:'🐖',n:'Picada de cerdo',cat:'prot',b:1},{k:'conejo',e:'🐰',n:'Conejo',cat:'prot',b:1},{k:'cordero',e:'🐑',n:'Cordero',cat:'prot'},
  {k:'jamon_serrano',e:'🍖',n:'Jamón serrano',cat:'prot'},{k:'jamon_iberico',e:'🍖',n:'Jamón ibérico',cat:'prot'},{k:'jamon_cocido',e:'🥓',n:'Jamón cocido',cat:'prot'},{k:'pavo_cocido',e:'🥓',n:'Pavo cocido',cat:'prot'},
  {k:'chorizo',e:'🌶️',n:'Chorizo',cat:'prot',oc:1},{k:'fuet',e:'🌭',n:'Fuet',cat:'prot',oc:1},{k:'salchichon',e:'🌭',n:'Salchichón',cat:'prot',oc:1},
  // PESCADO AZUL
  {k:'sardina',e:'🐟',n:'Sardina',cat:'prot'},{k:'caballa',e:'🐟',n:'Caballa',cat:'prot'},{k:'bonito',e:'🐟',n:'Bonito',cat:'prot'},{k:'anchoa',e:'🐟',n:'Anchoa',cat:'prot'},{k:'boqueron',e:'🐟',n:'Boquerón',cat:'prot'},{k:'trucha',e:'🐟',n:'Trucha',cat:'prot'},{k:'jurel',e:'🐟',n:'Jurel',cat:'prot'},
  // PESCADO BLANCO
  {k:'bacalao',e:'🐟',n:'Bacalao',cat:'prot'},{k:'lenguado',e:'🐟',n:'Lenguado',cat:'prot'},{k:'dorada',e:'🐟',n:'Dorada',cat:'prot'},{k:'lubina',e:'🐟',n:'Lubina',cat:'prot'},{k:'rape',e:'🐟',n:'Rape',cat:'prot'},{k:'pescadilla',e:'🐟',n:'Pescadilla',cat:'prot'},{k:'gallo',e:'🐟',n:'Gallo',cat:'prot'},{k:'rodaballo',e:'🐟',n:'Rodaballo',cat:'prot'},
  // CONSERVAS PESCADO
  {k:'atun_aceite',e:'🥫',n:'Atún en aceite',cat:'prot'},{k:'bonito_aceite',e:'🥫',n:'Bonito en aceite',cat:'prot'},{k:'sardinas_lata',e:'🥫',n:'Sardinas en lata',cat:'prot'},{k:'caballa_lata',e:'🥫',n:'Caballa en lata',cat:'prot'},{k:'mejillones_lata',e:'🥫',n:'Mejillones en lata',cat:'prot'},{k:'anchoas_lata',e:'🥫',n:'Anchoas en lata',cat:'prot'},{k:'berberechos_lata',e:'🥫',n:'Berberechos en lata',cat:'prot'},
  // MARISCO
  {k:'langostinos',e:'🦐',n:'Langostinos',cat:'prot'},{k:'calamar',e:'🦑',n:'Calamar',cat:'prot'},{k:'pulpo',e:'🐙',n:'Pulpo',cat:'prot'},{k:'chipirones',e:'🦑',n:'Chipirones',cat:'prot'},{k:'mejillones',e:'🦪',n:'Mejillones',cat:'prot'},{k:'almejas',e:'🦪',n:'Almejas',cat:'prot'},{k:'vieira',e:'🦪',n:'Vieira',cat:'prot'},
  // HUEVOS
  {k:'clara_huevo',e:'🥚',n:'Clara de huevo',cat:'prot'},{k:'huevo_codorniz',e:'🥚',n:'Huevo de codorniz',cat:'prot'},
  // LEGUMBRES
  {k:'alubias_rojas',e:'🫘',n:'Alubias rojas',cat:'legumbre',b:1},{k:'judias_negras',e:'🫘',n:'Judías negras',cat:'legumbre',b:1},{k:'soja',e:'🫛',n:'Soja',cat:'legumbre'},{k:'edamame',e:'🫛',n:'Edamame',cat:'legumbre'},{k:'guisantes',e:'🟢',n:'Guisantes',cat:'legumbre',b:1},{k:'habas',e:'🫛',n:'Habas',cat:'legumbre'},
  // CEREALES / HIDRATOS
  {k:'arroz_integral',e:'🍚',n:'Arroz integral',cat:'hidrato',b:1},{k:'arroz_basmati',e:'🍚',n:'Arroz basmati',cat:'hidrato',b:1},{k:'espaguetis',e:'🍝',n:'Espaguetis',cat:'hidrato',b:1},{k:'macarrones',e:'🍝',n:'Macarrones',cat:'hidrato',b:1},{k:'pasta_integral',e:'🍝',n:'Pasta integral',cat:'hidrato',b:1},{k:'pasta_legumbre',e:'🍝',n:'Pasta de legumbre',cat:'hidrato',b:1},{k:'fideos',e:'🍜',n:'Fideos',cat:'hidrato',b:1},
  {k:'bulgur',e:'🌾',n:'Bulgur',cat:'hidrato',b:1},{k:'polenta',e:'🌽',n:'Polenta',cat:'hidrato'},{k:'pan_masamadre',e:'🍞',n:'Pan de masa madre',cat:'hidrato'},{k:'pan_centeno',e:'🍞',n:'Pan de centeno',cat:'hidrato'},{k:'pan_espelta',e:'🍞',n:'Pan de espelta',cat:'hidrato'},{k:'pita',e:'🫓',n:'Pan pita',cat:'hidrato'},{k:'tortilla_trigo',e:'🌯',n:'Tortilla de trigo',cat:'hidrato'},{k:'yuca',e:'🥔',n:'Yuca',cat:'hidrato',b:1},
  // VERDURAS
  {k:'lechuga',e:'🥬',n:'Lechuga',cat:'verdura'},{k:'rucula',e:'🥬',n:'Rúcula',cat:'verdura'},{k:'acelgas',e:'🥬',n:'Acelgas',cat:'verdura',b:1},{k:'canonigos',e:'🥬',n:'Canónigos',cat:'verdura'},{k:'escarola',e:'🥬',n:'Escarola',cat:'verdura'},{k:'col_rizada',e:'🥬',n:'Col rizada (kale)',cat:'verdura'},{k:'endibia',e:'🥬',n:'Endibia',cat:'verdura'},
  {k:'coliflor',e:'🥦',n:'Coliflor',cat:'verdura',b:1},{k:'col',e:'🥬',n:'Col',cat:'verdura',b:1},{k:'lombarda',e:'🥬',n:'Col lombarda',cat:'verdura'},{k:'coles_bruselas',e:'🥬',n:'Coles de Bruselas',cat:'verdura',b:1},{k:'romanesco',e:'🥦',n:'Romanesco',cat:'verdura',b:1},
  {k:'tomate_cherry',e:'🍅',n:'Tomate cherry',cat:'verdura'},{k:'pimiento_verde',e:'🫑',n:'Pimiento verde',cat:'verdura',b:1},{k:'calabaza',e:'🎃',n:'Calabaza',cat:'verdura',b:1},{k:'remolacha',e:'🟣',n:'Remolacha',cat:'verdura',b:1},{k:'nabo',e:'🥔',n:'Nabo',cat:'verdura',b:1},{k:'rabano',e:'🔴',n:'Rábano',cat:'verdura'},{k:'chirivia',e:'🥕',n:'Chirivía',cat:'verdura',b:1},
  {k:'alcachofa',e:'🌿',n:'Alcachofa',cat:'verdura',b:1},{k:'puerro',e:'🥬',n:'Puerro',cat:'verdura',b:1},{k:'cebolleta',e:'🧅',n:'Cebolleta',cat:'verdura'},{k:'ajo',e:'🧄',n:'Ajo',cat:'verdura'},{k:'apio',e:'🥬',n:'Apio',cat:'verdura'},{k:'pepino',e:'🥒',n:'Pepino',cat:'verdura'},{k:'setas',e:'🍄',n:'Setas',cat:'verdura',b:1},{k:'maiz',e:'🌽',n:'Maíz',cat:'verdura'},{k:'hinojo',e:'🌿',n:'Hinojo',cat:'verdura'},
  // CONGELADAS Y PREPARACIONES
  {k:'menestra',e:'🧊',n:'Menestra congelada',cat:'verdura',b:1},{k:'salteado_verduras',e:'🧊',n:'Salteado de verduras',cat:'verdura',b:1},{k:'verduras_asadas',e:'🔥',n:'Verduras asadas (batch)',cat:'verdura',b:1},{k:'crema_verduras',e:'🍲',n:'Crema de verduras',cat:'verdura',b:1},{k:'pure_verduras',e:'🥣',n:'Puré de verduras',cat:'verdura',b:1},{k:'pisto',e:'🍅',n:'Pisto',cat:'verdura',b:1},
  // TOMATES / DERIVADOS
  {k:'tomate_triturado',e:'🥫',n:'Tomate triturado',cat:'salsa'},{k:'tomate_frito',e:'🥫',n:'Tomate frito',cat:'salsa'},{k:'passata',e:'🥫',n:'Passata',cat:'salsa'},{k:'tomate_seco',e:'🍅',n:'Tomate seco',cat:'salsa'},
  // FRUTAS
  {k:'mandarina',e:'🍊',n:'Mandarina',cat:'fruta'},{k:'limon',e:'🍋',n:'Limón',cat:'fruta'},{k:'pomelo',e:'🍊',n:'Pomelo',cat:'fruta'},{k:'arandanos',e:'🫐',n:'Arándanos',cat:'fruta'},{k:'frambuesas',e:'🍓',n:'Frambuesas',cat:'fruta'},{k:'moras',e:'🍇',n:'Moras',cat:'fruta'},{k:'melocoton',e:'🍑',n:'Melocotón',cat:'fruta'},{k:'nectarina',e:'🍑',n:'Nectarina',cat:'fruta'},{k:'ciruela',e:'🍑',n:'Ciruela',cat:'fruta'},{k:'albaricoque',e:'🍑',n:'Albaricoque',cat:'fruta'},
  {k:'sandia',e:'🍉',n:'Sandía',cat:'fruta'},{k:'melon',e:'🍈',n:'Melón',cat:'fruta'},{k:'pina',e:'🍍',n:'Piña',cat:'fruta'},{k:'mango',e:'🥭',n:'Mango',cat:'fruta'},{k:'granada',e:'🔴',n:'Granada',cat:'fruta'},{k:'higo',e:'🟣',n:'Higo',cat:'fruta'},{k:'caqui',e:'🟠',n:'Caqui',cat:'fruta'},{k:'datiles',e:'🟤',n:'Dátiles',cat:'fruta'},{k:'pasas',e:'🟤',n:'Pasas',cat:'fruta'},
  // GRASAS / FRUTOS SECOS / SEMILLAS
  {k:'almendras',e:'🥜',n:'Almendras',cat:'salsa'},{k:'nueces',e:'🥜',n:'Nueces',cat:'salsa'},{k:'avellanas',e:'🥜',n:'Avellanas',cat:'salsa'},{k:'pistachos',e:'🥜',n:'Pistachos',cat:'salsa'},{k:'anacardos',e:'🥜',n:'Anacardos',cat:'salsa'},{k:'pinones',e:'🌰',n:'Piñones',cat:'salsa'},{k:'tahini',e:'🥣',n:'Tahini',cat:'salsa'},{k:'aceitunas_negras',e:'⚫',n:'Aceitunas negras',cat:'salsa'},
  {k:'chia',e:'🌱',n:'Semillas de chía',cat:'salsa'},{k:'lino',e:'🌱',n:'Semillas de lino',cat:'salsa'},{k:'sesamo',e:'🌱',n:'Sésamo',cat:'salsa'},{k:'sem_calabaza',e:'🌱',n:'Semillas de calabaza',cat:'salsa'},{k:'sem_girasol',e:'🌻',n:'Semillas de girasol',cat:'salsa'},
  // LÁCTEOS
  {k:'leche_entera',e:'🥛',n:'Leche entera',cat:'lacteo'},{k:'kefir',e:'🥛',n:'Kéfir',cat:'lacteo'},{k:'yogur_proteico',e:'🥛',n:'Yogur alto en proteína',cat:'lacteo'},{k:'mozzarella',e:'🧀',n:'Mozzarella',cat:'lacteo'},{k:'feta',e:'🧀',n:'Feta',cat:'lacteo'},{k:'queso_cabra',e:'🧀',n:'Queso de cabra',cat:'lacteo'},{k:'manchego',e:'🧀',n:'Queso manchego',cat:'lacteo'},{k:'queso_curado',e:'🧀',n:'Queso curado',cat:'lacteo'},{k:'parmesano',e:'🧀',n:'Parmesano',cat:'lacteo'},{k:'ricotta',e:'🧀',n:'Ricotta',cat:'lacteo'},
  // SALSAS / UNTABLES
  {k:'tzatziki',e:'🥣',n:'Tzatziki',cat:'salsa'},{k:'romesco',e:'🥣',n:'Salsa romesco',cat:'salsa'},{k:'mostaza',e:'🥣',n:'Mostaza',cat:'salsa'},{k:'salsa_soja',e:'🥢',n:'Salsa de soja',cat:'salsa'},{k:'salsa_picante',e:'🌶️',n:'Salsa picante',cat:'salsa'},{k:'baba_ganoush',e:'🍆',n:'Baba ganoush',cat:'salsa'},{k:'crema_berenjena',e:'🍆',n:'Crema de berenjena',cat:'salsa'},
  {k:'mayonesa',e:'🥚',n:'Mayonesa',cat:'salsa',oc:1},{k:'alioli',e:'🧄',n:'Alioli',cat:'salsa',oc:1},{k:'bbq',e:'🍖',n:'Salsa barbacoa',cat:'salsa',oc:1},
  // ESPECIAS (no entran en combos)
  {k:'perejil',e:'🌿',n:'Perejil',cat:'especia'},{k:'albahaca',e:'🌿',n:'Albahaca',cat:'especia'},{k:'oregano',e:'🌿',n:'Orégano',cat:'especia'},{k:'romero',e:'🌿',n:'Romero',cat:'especia'},{k:'tomillo',e:'🌿',n:'Tomillo',cat:'especia'},{k:'cilantro',e:'🌿',n:'Cilantro',cat:'especia'},{k:'laurel',e:'🍃',n:'Laurel',cat:'especia'},{k:'pimienta',e:'⚫',n:'Pimienta negra',cat:'especia'},{k:'pimenton',e:'🌶️',n:'Pimentón',cat:'especia'},{k:'comino',e:'🟤',n:'Comino',cat:'especia'},{k:'curry',e:'🟡',n:'Curry',cat:'especia'},{k:'curcuma',e:'🟡',n:'Cúrcuma',cat:'especia'},{k:'canela',e:'🟤',n:'Canela',cat:'especia'},{k:'ajo_polvo',e:'🧄',n:'Ajo en polvo',cat:'especia'},{k:'hierbas_prov',e:'🌿',n:'Hierbas provenzales',cat:'especia'}
];
const FOODBASE=COMPONENTS.concat(FOODMORE);
const KCAT=[['prot','🥩 Proteínas'],['verdura','🥦 Verduras'],['hidrato','🍚 Hidratos'],['legumbre','🫘 Legumbres'],['salsa','🥑 Salsas/extras'],['fruta','🍎 Frutas'],['lacteo','🥛 Lácteos'],['especia','🌿 Especias']];
const KCAT_LBL={prot:'Proteína',verdura:'Verdura',hidrato:'Hidrato',legumbre:'Legumbre',salsa:'Salsa/extra',fruta:'Fruta',lacteo:'Lácteo',especia:'Especia'};
const SALSA_PREF={pollo:['hummus','guacamole','tomate_casero','pesto','cebolla_car','aove'],pinchos_pollo:['hummus','guacamole','pesto','aove'],muslo_pollo:['tomate_casero','cebolla_car','aove'],pavo_fil:['hummus','guacamole','aove'],hamb_pavo:['guacamole','cebolla_car','aove'],salch_pollo:['tomate_casero','aove'],ternera:['tomate_casero','cebolla_car','aove'],lomo:['tomate_casero','cebolla_car','aove'],albondigas:['tomate_casero','aove'],butifarra:['tomate_casero','cebolla_car','aove'],huevos:['aove','tomate_casero','guacamole'],atun:['aove','guacamole'],salmon:['aove','yogurt_sauce','guacamole'],merluza:['aove','yogurt_sauce'],gambas:['aove'],sepia:['aove'],tofu:['aove','guacamole'],jamon:['aove']};
const BATCH_ITEMS=['boniato','patata','calabacin','pimientos','berenjena','esparragos','judias','zanahoria','brocoli','arroz','quinoa','lentejas','garbanzos','pollo','pinchos_pollo','pavo_fil','ternera','lomo','albondigas'];
function compByKey(k){return FOODBASE.find(c=>c.k===k)||((DB.kitchen&&DB.kitchen.custom)||[]).find(c=>c.k===k)||null;}
function kitchenInit(){DB.kitchen=DB.kitchen||{};const K=DB.kitchen;K.inv=K.inv||[];K.shop=K.shop||[];K.eaten=K.eaten||[];K.week=K.week||{};K.favs=K.favs||[];K.custom=K.custom||[];K.recent=K.recent||[];}
function bumpQty(q){const m=(q||'').match(/^(\d+)/);if(m)return q.replace(m[1],String(+m[1]+1));return q;}
function addInv(k,qty,batch,pri){kitchenInit();const c=compByKey(k);if(!c)return;const ex=DB.kitchen.inv.find(x=>x.k===k);
  if(ex){ex.qty=bumpQty(ex.qty);if(batch)ex.batch=true;if(pri)ex.pri=pri;save();return;}
  DB.kitchen.inv.push({id:'i'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),k,name:c.n,e:c.e,cat:c.cat,oc:!!c.oc,qty:qty||'1',pri:pri||'now',batch:!!batch,ts:Date.now()});save();}
function delInv(id){DB.kitchen.inv=DB.kitchen.inv.filter(x=>x.id!==id);save();renderFood();}
function invQty(id,d){const it=DB.kitchen.inv.find(x=>x.id===id);if(!it)return;const m=(it.qty||'').match(/^(\d+)/);let n=m?+m[1]:1;n=Math.max(0,n+d);if(n===0){delInv(id);return;}it.qty=m?it.qty.replace(m[1],String(n)):String(n);save();renderFood();}
function cycleInvPri(id){const it=DB.kitchen.inv.find(x=>x.id===id);if(!it)return;it.pri=it.pri==='now'?'week':it.pri==='week'?'stock':'now';save();renderFood();}
function decInv(id){const it=DB.kitchen.inv.find(x=>x.id===id);if(!it)return;const m=(it.qty||'').match(/^(\d+)/);if(m&&+m[1]>1){it.qty=it.qty.replace(m[1],String(+m[1]-1));}else{DB.kitchen.inv=DB.kitchen.inv.filter(x=>x.id!==id);}}
const PRI_DOT={now:'🟢',week:'🟡',stock:'🔵'};const PRI_TXT={now:'consumir primero',week:'esta semana',stock:'despensa'};
/* ---- Motor de combinaciones ---- */
function availCat(cat){kitchenInit();return DB.kitchen.inv.filter(x=>x.cat===cat);}
function priRank(x){return x.batch||x.pri==='now'?0:x.pri==='week'?1:2;}
function pickSalsa(pKey,S){if(!S.length)return null;const pref=SALSA_PREF[pKey]||['aove'];for(const pk of pref){const f=S.find(s=>s.k===pk);if(f)return f;}return S.find(s=>s.k==='aove')||S[0];}
function invByK(k){kitchenInit();return DB.kitchen.inv.find(x=>x.k===k)||null;}
function plateName(parts){return parts.filter(p=>p.k!=='aove').map(p=>p.name).join(' + ')||'Plato';}
function mkPlate(parts,meal,checks){return {name:plateName(parts),e:(parts[0]||{}).e||'🍽️',parts,meal,usesBatch:parts.some(x=>x.batch),checks};}
function eatenTodayProt(){const t=today();const names=DB.kitchen.eaten.filter(x=>x.date===t).map(x=>x.name);return COMPONENTS.filter(c=>c.cat==='prot'&&names.some(n=>n.includes(c.n))).map(c=>c.k);}
function suggestMain(meal){
  const eatenP=eatenTodayProt();
  const prot=availCat('prot'),hid=[...availCat('hidrato').filter(x=>x.k!=='avena'),...availCat('legumbre')],veg=availCat('verdura'),sal=availCat('salsa');
  if(!prot.length||(!hid.length&&!veg.length))return [];
  const rank=x=>priRank(x)+(eatenP.includes(x.k)?1:0)+(x.k==='pan'?3:0)+(x.oc?8:0); // repetir es normal: solo un pequeño desempate por variedad
  const S=a=>[...a].sort((x,y)=>rank(x)-rank(y));
  const P=S(prot),H=S(hid),V=S(veg),SA=[...sal].sort((x,y)=>priRank(x)-priRank(y));const out=[];
  P.forEach((p,pi)=>{
    const h=H.length?H[pi%H.length]:null;
    const v1=V.length?V[pi%V.length]:null;const v2=V.length>1?V[(pi+1)%V.length]:null;
    const s=pickSalsa(p.k,SA);
    const parts=[p,h,v1,v2,s].filter(Boolean);
    out.push(mkPlate(parts,meal,{proteina:true,hidrato:!!h,verdura:!!(v1||v2),grasa:true}));
  });
  return out;
}
function firstInv(keys){for(const k of keys){const it=invByK(k);if(it)return it;}return null;}
function suggestBreakfast(){
  const out=[];
  const pan=firstInv(['pan','pan_masamadre','pan_centeno','pan_espelta','pita']);
  const emb=firstInv(['jamon_serrano','jamon_iberico','pavo_cocido','jamon_cocido','jamon']);
  const queso=firstInv(['queso_fresco','requeson','mozzarella','feta','queso_cabra']);
  const yog=firstInv(['yogur_griego','yogur_proteico','yogur_nat','kefir']);
  const leche=invByK('leche')||invByK('leche_entera');
  const avena=invByK('avena'),tom=invByK('tomate'),aove=invByK('aove'),agu=invByK('aguacate'),egg=invByK('huevos'),fs=invByK('frutossecos');
  const fru=availCat('fruta');
  const mk=(parts,checks)=>out.push(mkPlate(parts.filter(Boolean),'desayuno',checks));
  // 1. Pan con tomate, aceite y embutido (el clásico mediterráneo)
  if(pan&&tom&&emb)mk([pan,tom,aove,emb],{cereal:true,verdura:true,proteina:true,grasa:true});
  // 2. Tostada con queso fresco y pavo/jamón
  if(pan&&queso&&emb)mk([pan,queso,emb],{cereal:true,proteina:true});
  // 3. Tostada con aguacate y embutido/huevo
  if(pan&&agu&&(emb||egg))mk([pan,agu,emb||egg],{cereal:true,grasa:true,proteina:true});
  // 4. Huevos + pan + tomate
  if(egg&&pan)mk([egg,pan,tom],{proteina:true,cereal:true,verdura:!!tom});
  // 5. Pan con tomate y aceite (+ queso) — vegetariano
  if(pan&&tom&&!emb)mk([pan,tom,aove,queso],{cereal:true,verdura:true,grasa:true,proteina:!!queso});
  // 6. Yogur + fruta + avena/frutos secos
  if(yog&&fru.length)mk([yog,avena,fru[0],fs],{proteina:true,fruta:true,cereal:!!avena});
  // 7. Avena + leche/yogur + fruta
  if(avena&&(leche||yog)&&fru.length)mk([avena,leche||yog,fru[fru.length>1?1:0],fs],{cereal:true,fruta:true,proteina:!!(leche||yog)});
  // 8. Bocadillo pequeño de pavo/jamón
  if(pan&&emb&&!tom&&!queso)mk([pan,emb],{cereal:true,proteina:true});
  return out;
}
function suggestSnack(){
  const out=[];
  const fru=availCat('fruta');
  const yog=firstInv(['yogur_griego','yogur_proteico','yogur_nat','kefir']);
  const fs=invByK('frutossecos'),avena=invByK('avena');
  const queso=firstInv(['queso_fresco','requeson']);
  const pan=firstInv(['pan','pan_masamadre','pan_centeno']);
  const emb=firstInv(['pavo_cocido','jamon_serrano','jamon_cocido','jamon']);
  const agu=invByK('aguacate'),plat=invByK('platano');
  const mk=(parts,checks,elab)=>out.push(Object.assign(mkPlate(parts.filter(Boolean),'snack',checks),{elab:!!elab}));
  // SIMPLES (día a día): lo primero
  if(fru.length&&fs)mk([fru[0],fs],{fruta:true,grasa:true});
  if(fru.length)mk([fru[0]],{fruta:true});
  if(yog&&fru.length)mk([yog,fru[0]],{proteina:true,fruta:true});
  if(fs)mk([fs],{grasa:true});
  if(yog)mk([yog],{proteina:true});
  if(fru.length&&queso)mk([fru[0],queso],{fruta:true,proteina:true});
  // ELABORADOS (opcional, fin de semana / si hay tiempo)
  if(pan&&agu&&emb)mk([pan,agu,emb],{cereal:true,grasa:true,proteina:true},true);
  if(queso&&fru.length&&fs)mk([queso,fru[0],fs],{proteina:true,fruta:true,grasa:true},true);
  if(pan&&queso&&emb)mk([pan,queso,emb],{cereal:true,proteina:true},true);
  if(yog&&avena)mk([yog,avena],{proteina:true,cereal:true},true);
  return out;
}
function suggestByMeal(m){return m==='desayuno'?suggestBreakfast():m==='snack'?suggestSnack():suggestMain(m);}
function mealDefault(){const h=new Date().getHours();return h<11?'desayuno':h<13?'snack':h<16?'comida':h<19?'snack':'cena';}
let hoySugs=[],hoyIdx=0,hoyMeal=null,hoyPlate=null;
function curPlate(){return hoyPlate||hoySugs[hoyIdx];}
function portionFor(meal){
  const t=gentleTargets();
  const frac={desayuno:0.22,comida:0.33,cena:0.30,snack:0.13}[meal]||0.3;
  const g=Math.round((t.protLo+t.protHi)/2*frac/5)*5;
  const palms=Math.max(0.5,Math.round(g/28*2)/2);
  return {g,palms,t};
}
function setHoyMeal(m){hoyMeal=m;hoyIdx=0;hoyPlate=null;renderFood();}
function renderHoy(){
  kitchenInit();const inv=DB.kitchen.inv;
  if(!hoyMeal)hoyMeal=mealDefault();
  const MEALS=[['desayuno','🌅'],['comida','☀️'],['cena','🌙'],['snack','🍎']];
  let html=`<div class="note viol" style="margin-bottom:10px">👨‍👩‍👧‍👦 <b>Una sola cocina.</b> Mismo plato para todos: tú ajustas tu ración, los peques con porción más pequeña y verdura blandita.</div>`;
  html+=`<div class="row" style="gap:5px;margin-bottom:10px">${MEALS.map(m=>`<button class="btn-sm ${hoyMeal===m[0]?'btn-acc2':'btn2'}" style="flex:1;flex-direction:column;padding:8px 2px" onclick="setHoyMeal('${m[0]}')">${m[1]}<span style="font-size:10px">${m[0]}</span></button>`).join('')}</div>`;
  if(!inv.length){
    return html+`<div class="empty" style="padding:24px 14px"><div style="font-size:44px">🧊</div><b>Aún no hay nada en tu cocina</b><p class="mini" style="margin-top:6px">Dime qué tienes o marca lo que has preparado, y FORJA te propone qué comer.</p></div><div class="row" style="gap:8px"><button class="btn btn-acc2" style="flex:1" onclick="setFoodPage('casa')">🧊 Añadir lo que tengo</button><button class="btn2" style="flex:1" onclick="setFoodPage('prep')">👨‍🍳 Preparar</button></div><button class="btn2" style="margin-top:8px;width:100%" onclick="setFoodPage('ideas')">💡 O ver ideas de platos</button>`;
  }
  hoySugs=suggestByMeal(hoyMeal);
  if(hoyPlate&&(hoyPlate.meal!==hoyMeal||!hoyPlate.parts.every(p=>DB.kitchen.inv.find(x=>x.id===p.id))))hoyPlate=null;
  if(!hoySugs.length&&!hoyPlate){
    const falta=hoyMeal==='desayuno'?'pan integral + tomate + aceite + jamón/pavo/queso, o yogur + fruta, o huevos + pan':hoyMeal==='snack'?'fruta, frutos secos o yogur (y algo de pan/queso si quieres)':'1 proteína + 1 verdura o 1 hidrato';
    return html+`<div class="note gold">Para un <b>${hoyMeal}</b> necesito ${falta}. Añádelo en tu cocina.</div><div class="row" style="gap:8px;margin-top:10px"><button class="btn btn-acc2" style="flex:1" onclick="setFoodPage('casa')">🧊 Mi casa</button><button class="btn2" style="flex:1" onclick="setFoodPage('ideas')">💡 Ideas</button></div>`;
  }
  if(hoyIdx>=hoySugs.length)hoyIdx=0;
  const c=curPlate();const ch=c.checks;const fav=isFav(c);const po=portionFor(hoyMeal);
  html+=`<div style="font-family:Anton;letter-spacing:1px;margin-bottom:6px;font-size:13px">🍽️ ${hoySugs.length} IDEA${hoySugs.length>1?'S':''} DE ${hoyMeal.toUpperCase()} CON LO QUE TIENES</div>
  <div class="card" style="border-color:var(--acc2)"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div style="font-size:44px">${c.parts.map(p=>p.e).join('')}</div><button class="btn-sm btn2" style="padding:4px 9px" onclick="toggleFav()">${fav?'❤️':'🤍'}</button></div>
  <h3 style="margin:4px 0">${c.name}${c.elab?' <span class="mini" style="color:var(--gold)">🍳 elaborado</span>':''}</h3>
  <div class="mini" style="margin-bottom:8px">${ch.proteina?'🍗 Proteína ✓ ':''}${ch.verdura?'🥦 Verdura ✓ ':''}${ch.hidrato?'🍚 Hidrato ✓ ':''}${ch.cereal?'🌾 Cereal ✓ ':''}${ch.fruta?'🍎 Fruta ✓ ':''}${ch.grasa?'🫒 Grasa ✓':''}${c.usesBatch?' · 👨‍🍳 batch':''}</div>
  <div class="note gold" style="margin-bottom:8px;padding:8px 10px">📏 <b>Tu ración (${po.t.w} kg → perder grasa)</b>: proteína ≈ <b>${po.g} g</b> (${po.palms} palma${po.palms!==1?'s':''} de la mano)${hoyMeal==='desayuno'||hoyMeal==='snack'?'':' · hidrato 1 puño · grasa 1 pulgar'} · verdura ½ plato a voluntad. <span class="mini">Se ajusta solo cuando actualizas tu peso en Cuerpo.</span></div>
  <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px">${c.parts.map((p,i)=>`<button class="btn-sm btn2" style="padding:4px 8px" onclick="openSwapPart(${i})">${p.e} ${p.name} ⇄</button>`).join('')}</div>
  <div class="row" style="gap:8px"><button class="btn btn-acc2" style="flex:2" onclick="eatPlate()">✓ He comido esto</button><button class="btn2" style="flex:1" onclick="cyclePlate()">🔄 Cambiar</button></div>
  <p class="mini" style="margin-top:6px;color:var(--dim)">Toca cualquier ingrediente para cambiarlo por otro que tengas. Repetir un plato entre semana es perfectamente normal.</p></div>`;
  if(hoyMeal==='snack')html+=`<div class="note" style="margin-top:8px">Entre semana, cuanto más simple mejor: fruta, frutos secos o yogur. Lo 🍳 elaborado, para el finde o si tienes tiempo.</div>`;
  const others=hoySugs.filter(o=>o!==c).slice(0,4);
  if(others.length)html+=`<div style="margin-top:12px"><div class="mini" style="margin-bottom:6px">Otras opciones:</div>${others.map(o=>{const i=hoySugs.indexOf(o);return `<div class="sub-opt" style="cursor:pointer" onclick="hoyPlate=null;hoyIdx=${i};renderFood()"><span>${o.parts.map(p=>p.e).join('')} ${o.name}${o.elab?' <span class="mini" style="color:var(--gold)">🍳</span>':''}</span><span style="color:var(--acc)">›</span></div>`;}).join('')}</div>`;
  const favsAvail=(DB.kitchen.favs||[]).filter(f=>f.keys.every(k=>invByK(k)));
  if(favsAvail.length)html+=`<div class="card" style="margin-top:12px;border-color:var(--acc)"><b style="font-family:Anton;font-size:13px">❤️ Tus favoritos disponibles</b>${favsAvail.slice(0,4).map(f=>`<div class="sub-opt"><span>${f.name}</span><button class="btn-sm btn-acc2" style="padding:3px 10px" onclick="eatFav('${f.id}')">✓</button></div>`).join('')}</div>`;
  const eatenToday=DB.kitchen.eaten.filter(x=>x.date===today());
  if(eatenToday.length)html+=`<div class="card" style="margin-top:12px"><b style="font-family:Anton;font-size:13px">✓ Hoy has comido</b>${eatenToday.map(x=>`<div class="mini" style="margin-top:4px">• ${x.name}</div>`).join('')}</div>`;
  html+=`<div class="row" style="gap:8px;margin-top:12px"><button class="btn2" style="flex:1" onclick="openPlateGuide()">📖 El plato</button><button class="btn2" style="flex:1" onclick="openMealGuide()">📅 Por comida</button></div>`;
  return html;
}
function cyclePlate(){if(!hoySugs.length)return;hoyPlate=null;hoyIdx=(hoyIdx+1)%hoySugs.length;renderFood();}
function openSwapPart(i){
  const c=curPlate();if(!c)return;const part=c.parts[i];if(!part)return;
  const opts=availCat(part.cat).filter(x=>x.id!==part.id);
  if(!opts.length){toast('No tienes otro/a '+(KCAT_LBL[part.cat]||'ingrediente')+' en casa');return;}
  openModal(`<h3>⇄ Cambiar ${part.name}</h3><p class="mini" style="margin-bottom:10px">Otros ${KCAT_LBL[part.cat]||''} que tienes en casa:</p><div style="display:flex;flex-wrap:wrap;gap:6px">${opts.map(o=>`<button class="btn-sm btn2" onclick="doSwapPart(${i},'${o.id}')">${o.e} ${o.n||o.name}</button>`).join('')}</div>`);
}
function doSwapPart(i,id){let c=curPlate();const it=DB.kitchen.inv.find(x=>x.id===id);if(!c||!it)return;hoyPlate=JSON.parse(JSON.stringify(c));hoyPlate.parts[i]=it;hoyPlate.name=plateName(hoyPlate.parts);hoyPlate.usesBatch=hoyPlate.parts.some(x=>x.batch);closeModal();renderFood();}
function eatPlate(){const c=curPlate();if(!c)return;DB.kitchen.eaten.unshift({date:today(),name:c.name,meal:hoyMeal});c.parts.forEach(p=>{if((p.cat!=='salsa'&&p.cat!=='verdura')||p.batch)decInv(p.id);});save();toast('✓ Registrado. Inventario actualizado.');hoyIdx=0;hoyPlate=null;renderFood();}
/* Favoritos ❤️ */
function comboSig(c){return c.parts.map(p=>p.k).sort().join('|');}
function isFav(c){return (DB.kitchen.favs||[]).some(f=>f.sig===comboSig(c));}
function toggleFav(){const c=curPlate();if(!c)return;kitchenInit();const sig=comboSig(c);const i=DB.kitchen.favs.findIndex(f=>f.sig===sig);if(i>=0){DB.kitchen.favs.splice(i,1);toast('Quitado de favoritos');}else{DB.kitchen.favs.push({id:'f'+Date.now().toString(36),sig,name:c.name,keys:c.parts.map(p=>p.k)});toast('❤️ Guardado en favoritos');}save();renderFood();}
function eatFav(id){const f=(DB.kitchen.favs||[]).find(x=>x.id===id);if(!f)return;DB.kitchen.eaten.unshift({date:today(),name:f.name});f.keys.forEach(k=>{const it=invByK(k);if(it&&((it.cat!=='salsa'&&it.cat!=='verdura')||it.batch))decInv(it.id);});save();toast('✓ Registrado');renderFood();}
/* ---- 🧊 Mi casa (inventario) ---- */
function renderMiCasa(){
  kitchenInit();const inv=DB.kitchen.inv;
  let html=`<div class="note" style="margin-bottom:10px">Dime qué tienes en casa. Sin pesar: unidades, raciones, «½ bote»... Toca 🟢🟡🔵 para marcar qué consumir antes.</div>`;
  html+=KCAT.map(([cat,lbl])=>{
    const items=inv.filter(x=>x.cat===cat);
    return `<div class="ex-block" style="margin-bottom:8px"><div style="display:flex;justify-content:space-between;align-items:center"><b>${lbl}</b><button class="btn-sm btn-acc2" style="padding:4px 10px" onclick="openAddInv('${cat}')">＋</button></div>
    ${items.length?items.map(x=>`<div class="sub-opt" style="align-items:center"><span style="cursor:pointer" onclick="cycleInvPri('${x.id}')">${PRI_DOT[x.pri]} ${x.e} ${x.name}${x.batch?' <span class="mini" style="color:var(--viol)">batch</span>':''} <span class="mini">${x.qty}</span></span><span style="display:flex;gap:3px"><button class="btn-sm btn2" style="padding:2px 8px" onclick="invQty('${x.id}',-1)">−</button><button class="btn-sm btn2" style="padding:2px 8px" onclick="invQty('${x.id}',1)">＋</button><button class="btn-sm btn2" style="padding:2px 8px" onclick="delInv('${x.id}')">✕</button></span></div>`).join(''):'<p class="mini" style="margin-top:4px;color:var(--dim)">Vacío</p>'}</div>`;
  }).join('');
  html+=`<div class="row" style="gap:8px;margin-top:6px"><button class="btn btn-viol" style="flex:1" onclick="setFoodPage('hoy')">🍽️ Qué puedo comer</button><button class="btn2" style="flex:1" onclick="setFoodPage('compra')">🛒 Qué me falta</button></div>`;
  return html;
}
let addCat='all';
function normTxt(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
function openAddInv(cat){addCat=cat||'all';kitchenInit();
  openModal(`<h3>🧊 Añadir a mi cocina</h3><p class="mini" style="margin-bottom:8px">Busca y toca varios seguidos (no se cierra). Cantidad por defecto 1; ajústala luego en Mi casa.</p>
  <input id="invSearch" placeholder="Busca: bro, pollo, buti, merlu, ham..." autocomplete="off" oninput="renderAddResults()" style="width:100%;padding:11px;font-size:15px;margin-bottom:8px;background:var(--bg3);border:1px solid var(--line);border-radius:10px;color:var(--txt)">
  <div id="invCatChips" style="display:flex;gap:5px;overflow-x:auto;padding-bottom:6px"></div>
  <div id="invRecent"></div>
  <div id="invResults" style="max-height:42vh;overflow-y:auto;margin-top:6px"></div>
  <div class="row" style="gap:8px;margin-top:8px"><button class="btn2" style="flex:1" onclick="openCustomFood()">➕ Personalizado</button><button class="btn btn-acc2" style="flex:1" onclick="closeModal();setFoodPage('casa')">Hecho</button></div>`);
  renderAddCats();renderAddRecent();renderAddResults();
}
function renderAddCats(){const el=document.getElementById('invCatChips');if(!el)return;const cats=[['all','Todo'],...KCAT];el.innerHTML=cats.map(c=>`<button class="btn-sm ${addCat===c[0]?'btn-acc2':'btn2'}" style="white-space:nowrap" onclick="setAddCat('${c[0]}')">${c[1]}</button>`).join('');}
function setAddCat(c){addCat=c;renderAddCats();renderAddResults();}
function renderAddRecent(){const el=document.getElementById('invRecent');if(!el)return;const rec=(DB.kitchen.recent||[]).map(compByKey).filter(Boolean).slice(0,8);el.innerHTML=rec.length?`<div class="mini" style="margin:4px 0 2px">Recientes:</div><div style="display:flex;flex-wrap:wrap;gap:5px">${rec.map(c=>`<button class="btn-sm btn2" onclick="addPick('${c.k}')">${c.e} ${c.n}</button>`).join('')}</div>`:'';}
function renderAddResults(){const el=document.getElementById('invResults');if(!el)return;const q=normTxt((document.getElementById('invSearch')||{}).value);
  let list=FOODBASE.filter(c=>addCat==='all'||c.cat===addCat);
  if(q)list=list.filter(c=>normTxt(c.n).includes(q));
  const total=list.length;list=list.slice(0,80);
  if(!total){el.innerHTML=`<div class="empty" style="padding:16px">Nada con «${q}». Usa ➕ Personalizado para añadirlo.</div>`;return;}
  el.innerHTML=`<div style="display:flex;flex-direction:column;gap:4px">${list.map(c=>{const inInv=DB.kitchen.inv.find(x=>x.k===c.k);return `<div class="sub-opt" style="align-items:center"><span>${c.e} ${c.n}${c.oc?' <span class="mini" style="color:var(--bad)">🔴</span>':''}${inInv?` <span class="mini" style="color:var(--ok)">·${inInv.qty} en casa</span>`:''}</span><button class="btn-sm ${inInv?'btn2':'btn-acc2'}" style="padding:3px 10px" onclick="addPick('${c.k}')">${inInv?'＋1':'añadir'}</button></div>`;}).join('')}</div>${total>80?`<div class="mini" style="margin-top:6px;color:var(--dim)">+${total-80} más. Afina la búsqueda.</div>`:''}`;
}
function addPick(k){addInv(k,'1',false,'now');DB.kitchen.recent=[k,...(DB.kitchen.recent||[]).filter(x=>x!==k)].slice(0,12);save();renderAddResults();renderAddRecent();toast('✓ añadido');}
function openCustomFood(){window._cfCat='prot';openModal(`<h3>➕ Alimento personalizado</h3><p class="mini" style="margin-bottom:8px">Para lo que no esté en la lista. FORJA lo recordará.</p><input id="cfName" placeholder="Nombre (ej: Tempeh, Seitán...)" autocomplete="off" style="width:100%;padding:11px;font-size:15px;margin-bottom:8px;background:var(--bg3);border:1px solid var(--line);border-radius:10px;color:var(--txt)"><label>Categoría</label><div id="cfCat" style="display:flex;flex-wrap:wrap;gap:5px;margin-top:6px">${KCAT.map(c=>`<button class="btn-sm ${c[0]==='prot'?'btn-acc2':'btn2'}" onclick="pickCfCat('${c[0]}',this)">${c[1]}</button>`).join('')}</div><button class="btn btn-acc2" style="margin-top:14px;width:100%" onclick="saveCustomFood()">Guardar y añadir</button>`);}
function pickCfCat(c,el){window._cfCat=c;el.parentElement.querySelectorAll('button').forEach(b=>{b.className='btn-sm btn2';});el.className='btn-sm btn-acc2';}
function saveCustomFood(){const n=((document.getElementById('cfName')||{}).value||'').trim();if(!n){toast('Pon un nombre');return;}const cat=window._cfCat||'prot';const k='c_'+normTxt(n).replace(/[^a-z0-9]/g,'').slice(0,12)+Date.now().toString(36).slice(-3);kitchenInit();DB.kitchen.custom.push({k,e:'🍽️',n,cat,custom:1});addInv(k,'1',false,'now');DB.kitchen.recent=[k,...(DB.kitchen.recent||[])].slice(0,12);save();closeModal();setFoodPage('casa');toast('✓ '+n+' añadido');}
/* ---- 👨‍🍳 Preparar semana (batch cooking) ---- */
function renderPreparar(){
  kitchenInit();const inv=DB.kitchen.inv;
  let html=`<div class="note viol" style="margin-bottom:10px">👨‍🍳 <b>Batch cooking.</b> Marca lo que has preparado en tandas. Pasa a tu cocina como «consumir primero» 🟢 y FORJA lo usará en las propuestas.</div>`;
  html+=`<div style="display:flex;flex-direction:column;gap:6px">${BATCH_ITEMS.map(k=>{const c=compByKey(k);const has=inv.find(x=>x.k===k&&x.batch);return `<div class="sub-opt" style="align-items:center;cursor:pointer" onclick="toggleBatch('${k}')"><span>${has?'☑️':'☐'} ${c.e} ${c.n}</span>${has?`<span class="mini" style="color:var(--viol)">${has.qty} · preparado</span>`:'<span class="mini" style="color:var(--dim)">marcar</span>'}</div>`;}).join('')}</div>
  <p class="mini" style="margin-top:10px;color:var(--dim)">¿Cantidad? Toca el elemento ya marcado en 🧊 Mi casa y ajústala (bandeja, raciones...). No hace falta pesar.</p>
  <button class="btn btn-acc2" style="margin-top:12px;width:100%" onclick="setFoodPage('hoy')">🍽️ Ver qué puedo comer con esto</button>`;
  return html;
}
function toggleBatch(k){kitchenInit();const ex=DB.kitchen.inv.find(x=>x.k===k&&x.batch);if(ex){DB.kitchen.inv=DB.kitchen.inv.filter(x=>x.id!==ex.id);save();}else{addInv(k,'2 raciones',true,'now');}renderFood();}
/* ---- 🛒 Compra ---- */
function shopRecommend(){
  kitchenInit();const inv=DB.kitchen.inv;const have=k=>inv.some(x=>x.k===k);const haveCat=c=>inv.some(x=>x.cat===c);const recs=[];
  const pescados=['merluza','salmon','atun','gambas'];if(!pescados.some(have))recs.push({k:'merluza',why:'no tienes pescado; aporta variedad y omega-3'});
  if(!haveCat('fruta'))recs.push({k:'platano',why:'sin fruta en casa'});
  if(!have('huevos'))recs.push({k:'huevos',why:'proteína versátil y barata'});
  if(inv.filter(x=>x.cat==='verdura').length<3)recs.push({k:'brocoli',why:'pocas verduras; llena medio plato'});
  if(!haveCat('lacteo'))recs.push({k:'yogur_griego',why:'proteína para desayunos y snacks'});
  const prots=inv.filter(x=>x.cat==='prot');if(prots.length&&!prots.some(p=>['merluza','salmon','atun','gambas','sepia','tofu','huevos'].includes(p.k)))recs.push({k:'garbanzos',why:'tienes mucha carne; alterna con legumbre/vegetal'});
  return recs.filter((r,i,a)=>a.findIndex(x=>x.k===r.k)===i).slice(0,6);
}
function renderCompra(){
  kitchenInit();const shop=DB.kitchen.shop;const recs=shopRecommend();
  let html=`<div class="note gold" style="margin-bottom:10px">💡 <b>Ideas de compra</b> según lo que ya tienes. Compra poco y aprovéchalo mejor.</div>`;
  if(recs.length)html+=`<div class="ex-block" style="border-color:var(--gold)"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-family:Anton;font-size:13px">FORJA te recomienda</b><button class="btn-sm btn-gold" style="padding:4px 10px" onclick="addAllShop()">＋ añadir todo</button></div>${recs.map(r=>{const c=compByKey(r.k);const inList=shop.some(s=>s.k===r.k);return `<div class="sub-opt"><span>${c.e} ${c.n} <span class="mini" style="color:var(--dim)">· ${r.why}</span></span>${inList?'<span class="mini" style="color:var(--ok)">en lista ✓</span>':`<button class="btn-sm btn2" style="padding:3px 10px" onclick="addShop('${r.k}')">＋ lista</button>`}</div>`;}).join('')}</div>`;
  html+=`<div class="ex-block" style="margin-top:10px"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-family:Anton;font-size:13px">🛒 Mi lista de compra</b><button class="btn-sm btn2" style="padding:4px 10px" onclick="openAddShop()">＋</button></div>
  ${shop.length?shop.map(s=>`<div class="sub-opt"><span>☐ ${s.e} ${s.name}</span><span style="display:flex;gap:4px"><button class="btn-sm btn-acc2" style="padding:2px 8px" onclick="buyShop('${s.id}')">✓ comprado</button><button class="btn-sm btn2" style="padding:2px 8px" onclick="delShop('${s.id}')">✕</button></span></div>`).join(''):'<p class="mini" style="margin-top:4px;color:var(--dim)">Lista vacía. Añade lo que recomienda FORJA o pulsa ＋.</p>'}</div>
  <p class="mini" style="margin-top:8px;color:var(--dim)">Al marcar ✓ comprado pasa directo a 🧊 Mi casa.</p>`;
  return html;
}
function addShop(k){kitchenInit();const c=compByKey(k);if(!c)return;if(DB.kitchen.shop.some(s=>s.k===k))return;DB.kitchen.shop.push({id:'s'+Date.now().toString(36)+Math.random().toString(36).slice(2,4),k,name:c.n,e:c.e,cat:c.cat});save();renderFood();}
function addAllShop(){shopRecommend().forEach(r=>{const c=compByKey(r.k);if(c&&!DB.kitchen.shop.some(s=>s.k===r.k))DB.kitchen.shop.push({id:'s'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),k:r.k,name:c.n,e:c.e,cat:c.cat});});save();toast('🛒 Añadido a la lista');renderFood();}
function openAddShop(){openModal(`<h3>＋ Añadir a la compra</h3>${KCAT.map(([cat,lbl])=>`<b style="font-family:Anton;font-size:12px;display:block;margin-top:8px">${lbl}</b><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px">${COMPONENTS.filter(c=>c.cat===cat).map(c=>`<button class="btn-sm btn2" onclick="addShop('${c.k}');closeModal();setFoodPage('compra')">${c.e} ${c.n}</button>`).join('')}</div>`).join('')}`);}
function buyShop(id){const s=DB.kitchen.shop.find(x=>x.id===id);if(!s)return;addInv(s.k,'1',false,'week');DB.kitchen.shop=DB.kitchen.shop.filter(x=>x.id!==id);save();toast('✓ '+s.name+' → tu cocina');renderFood();}
function delShop(id){DB.kitchen.shop=DB.kitchen.shop.filter(x=>x.id!==id);save();renderFood();}
/* ---- 📅 Mi semana (flexible, sin rigidez) ---- */
const WEEK_DAYS=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
function renderSemana(){
  kitchenInit();const wk=DB.kitchen.week;
  let html=`<div class="note" style="margin-bottom:10px">📅 <b>Propuesta flexible, no obligación.</b> Marca lo que vas comiendo. Da igual el día: si te comes el jueves lo del martes, no pasa nada. Aquí solo llevas el control.</div>`;
  const meals=[['desayuno','🌅'],['comida','☀️'],['cena','🌙']];
  html+=WEEK_DAYS.map(d=>{const dd=wk[d]||{};return `<div class="ex-block" style="margin-bottom:6px"><b>${d}</b><div class="row" style="gap:6px;margin-top:6px">${meals.map(m=>`<button class="btn-sm ${dd[m[0]]?'btn-acc2':'btn2'}" style="flex:1;flex-direction:column;padding:8px 2px" onclick="toggleWeekMeal('${d}','${m[0]}')">${m[1]}<span style="font-size:10px">${m[0]}</span>${dd[m[0]]?'<br>✓':''}</button>`).join('')}</div></div>`;}).join('');
  const done=WEEK_DAYS.reduce((a,d)=>a+meals.filter(m=>(wk[d]||{})[m[0]]).length,0);
  html+=`<div class="mini" style="margin-top:6px">${done}/21 comidas registradas esta semana.</div><button class="btn2" style="margin-top:8px;width:100%" onclick="resetWeek()">↺ Empezar semana nueva</button>`;
  return html;
}
function toggleWeekMeal(d,m){kitchenInit();DB.kitchen.week[d]=DB.kitchen.week[d]||{};DB.kitchen.week[d][m]=!DB.kitchen.week[d][m];save();renderFood();}
function resetWeek(){DB.kitchen.week={};save();renderFood();}

/* ===================== PÁGINA DE DIETA (hoja propia) ===================== */
let foodPage='hoy';
function renderFood(){
  kitchenInit();
  const el=document.getElementById('foodBody');if(!el)return;
  const tabs=[['hoy','🍽️ Hoy'],['casa','🧊 Mi casa'],['prep','👨‍🍳 Preparar'],['semana','📅 Semana'],['compra','🛒 Compra'],['ideas','💡 Ideas'],['construye','🧩 Construye'],['pesar','⚖️ Pesar'],['fuentes','📚 Fuentes']];
  const tb=document.getElementById('foodTabs');if(tb)tb.innerHTML=tabs.map(t=>`<button class="btn-sm ${foodPage===t[0]?'btn-acc2':'btn2'}" style="white-space:nowrap" onclick="setFoodPage('${t[0]}')">${t[1]}</button>`).join('');
  if(foodPage==='hoy')el.innerHTML=renderHoy();
  else if(foodPage==='casa')el.innerHTML=renderMiCasa();
  else if(foodPage==='prep')el.innerHTML=renderPreparar();
  else if(foodPage==='semana')el.innerHTML=renderSemana();
  else if(foodPage==='compra')el.innerHTML=renderCompra();
  else if(foodPage==='ideas'){el.innerHTML=`<div id="foodExplorer"></div>`;renderFoodExplorer();}
  else if(foodPage==='construye'){el.innerHTML=`<div id="comboBuilder"></div>`;renderCombo();}
  else if(foodPage==='pesar'){el.innerHTML=renderWeighShell();renderWeigh();}
  else if(foodPage==='fuentes')el.innerHTML=renderFoodSources();
}
function setFoodPage(p){foodPage=p;renderFood();}
function renderWeighShell(){
  const t=gentleTargets();
  return `<div class="note gold" style="margin-bottom:10px">🎯 <b>Tu referencia (orientativa)</b><br>Mantenimiento ≈ <b>${t.maint}</b> kcal/día. Para adelgazar sin sufrir: <b>${t.defLo}–${t.defHi}</b> kcal/día. Proteína: <b>${t.protLo}–${t.protHi} g/día</b>.<br><span class="mini">Déficit suave (−300 a −500 kcal). No cuentes cada caloría: pesa lo calórico, llena ½ plato de verdura y prioriza proteína. Así no pasas hambre.</span></div>
  <p class="mini" style="margin-bottom:6px">Elige categoría, pesa el alimento (g) y añádelo. La <b>verdura no se pesa</b>: va a voluntad.</p>
  <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:6px" id="weighCats"></div>
  <div id="weighList"></div>
  <div id="weighPlate"></div>`;
}
function renderWeigh(){
  const cats=document.getElementById('weighCats');if(cats)cats.innerHTML=FOOD_CATS.map(c=>`<button class="btn-sm ${weighCat===c[0]?'btn-acc2':'btn2'}" style="white-space:nowrap" onclick="setWeighCat('${c[0]}')">${c[1]}</button>`).join('');
  const list=document.getElementById('weighList');
  if(list){const items=FOOD_DB.map((f,i)=>({f,i})).filter(x=>x.f.cat===weighCat);
    list.innerHTML=`<div style="display:flex;flex-direction:column;gap:5px;margin:8px 0">${items.map(x=>`<div class="sub-opt" style="align-items:center"><span>${x.f.e} ${x.f.n} <span class="mini">(${x.f.kcal} kcal · ${x.f.p}g P / 100g)</span></span><span style="display:flex;gap:4px;align-items:center"><input type="number" inputmode="numeric" id="wg_${x.i}" placeholder="g" style="width:64px;padding:6px"><button class="btn-sm btn-acc2" onclick="addWeigh(${x.i})">+</button></span></div>`).join('')}</div>`;
  }
  renderWeighPlate();
}
function setWeighCat(c){weighCat=c;renderWeigh();}
function addWeigh(i){const inp=document.getElementById('wg_'+i);const g=+(inp&&inp.value);if(!g||g<=0){toast('Pon los gramos');return;}weighPlate.push({i,g});if(inp)inp.value='';renderWeighPlate();}
function removeWeigh(k){weighPlate.splice(k,1);renderWeighPlate();}
function clearWeigh(){weighPlate=[];renderWeighPlate();}
function renderWeighPlate(){
  const el=document.getElementById('weighPlate');if(!el)return;
  if(!weighPlate.length){el.innerHTML=`<div class="empty">Tu plato está vacío. Añade alimentos arriba y ve sumando.</div>`;return;}
  let kcal=0,p=0,c=0,f=0;
  const rows=weighPlate.map((it,k)=>{const fd=FOOD_DB[it.i];const K=fd.kcal*it.g/100,P=fd.p*it.g/100,C=fd.c*it.g/100,F=fd.f*it.g/100;kcal+=K;p+=P;c+=C;f+=F;return `<div class="sub-opt"><span>${fd.e} ${fd.n} · <b>${it.g} g</b></span><span style="display:flex;gap:8px;align-items:center"><span class="mini">${Math.round(K)} kcal · ${Math.round(P)}g P</span><button class="btn-sm btn2" style="padding:3px 8px" onclick="removeWeigh(${k})">✕</button></span></div>`;}).join('');
  const t=gentleTargets();const pct=Math.min(100,Math.round(kcal/t.defHi*100));
  el.innerHTML=`<div class="card" style="border-color:var(--acc2);margin-top:8px"><b style="font-family:Anton">🍽️ Tu plato</b>${rows}
    <div class="stat-grid" style="margin:10px 0;grid-template-columns:repeat(3,1fr)"><div class="stat"><div class="v acc">${Math.round(kcal)}</div><div class="l">kcal</div></div><div class="stat"><div class="v acc2">${Math.round(p)} g</div><div class="l">proteína</div></div><div class="stat"><div class="v gold">${Math.round(c)}/${Math.round(f)}</div><div class="l">carb/grasa g</div></div></div>
    <div class="mini">+ ½ plato de verdura a voluntad (apenas suma calorías y te llena).</div>
    <div class="bar" style="margin-top:8px"><i style="width:${pct}%;background:var(--acc2)"></i></div>
    <div class="mini" style="margin-top:3px">Vas por ${Math.round(kcal)} kcal de una comida. Referencia del día: ${t.defLo}–${t.defHi} kcal.</div>
    <button class="btn2" style="margin-top:10px;width:100%" onclick="clearWeigh()">🗑️ Vaciar plato</button></div>
    <p class="mini" style="margin-top:8px;color:var(--dim)">Valores orientativos por 100 g. No es una dieta médica; para un plan personalizado, dietista-nutricionista colegiado.</p>`;
}

/* Feedback nutricional: si adherencia buena pero peso estancado varias semanas, sugerir ajuste */
function dietFeedback(){
  const series=[...DB.body].filter(b=>b.peso).sort((a,b)=>a.date.localeCompare(b.date));
  if(series.length<3)return null;
  const last3=series.slice(-3);const change=last3[2].peso-last3[0].peso;
  // adherencia media de las últimas 2 semanas
  const wk=weekDates();DB.diet=DB.diet||{log:{}};
  const days=Object.keys(DB.diet.log);const recent=days.filter(d=>{const dd=new Date(d);return (Date.now()-dd)/864e5<=14;});
  if(!recent.length)return null;
  const adher=recent.reduce((a,d)=>a+MEALS.filter(m=>DB.diet.log[d][m[0]]).length,0)/(recent.length*4);
  if(adher>=0.7&&change>=-0.3)return 'Llevas buena adherencia a la dieta pero el peso no baja. Reduce un poco la ración de carbohidrato en la cena, o añade una caminata diaria. Pequeño ajuste, no pasar hambre.';
  if(change<=-0.4)return 'El peso baja y mantienes la proteína: vas perfecto, sigue así.';
  return null;
}

/* ===================== CHECK-IN DIARIO · HEALTH SCORE ===================== */
const CHECKIN_Q=[
  {k:'mood',q:'¿Cómo estás?',opts:[['😞',1],['😐',2],['🙂',3],['😄',4]]},
  {k:'sleep',q:'¿Cómo has dormido?',opts:[['😴 mal',1],['💤 regular',2],['🌙 bien',3],['⭐ genial',4]]},
  {k:'stress',q:'Nivel de estrés',opts:[['Bajo',1],['Medio',2],['Alto',3],['Muy alto',4]]},
  {k:'energy',q:'Energía',opts:[['Baja',1],['Media',2],['Alta',3],['Tope',4]]},
  {k:'motiv',q:'Motivación',opts:[['Baja',1],['Media',2],['Alta',3],['Tope',4]]}
];
function renderCheckin(){
  const el=document.getElementById('checkinView');if(!el)return;
  const d=today();const c=DB.checkins[d]||{};
  el.innerHTML=CHECKIN_Q.map(q=>`<div style="margin-bottom:12px"><div style="font-size:14px;margin-bottom:6px">${q.q}</div><div class="row">${q.opts.map(o=>`<button class="btn-sm ${c[q.k]===o[1]?'btn-acc2':'btn2'}" style="flex:1" onclick="setCheckin('${q.k}',${o[1]})">${o[0]}</button>`).join('')}</div></div>`).join('');
  // sugerencia según estrés/energía
  const c2=DB.checkins[d]||{};
  if(c2.stress>=3||c2.energy<=1){el.innerHTML+=`<div class="note viol">Hoy vienes cargado o con poca energía. Te vendría bien la pestaña Guiado: respiración o movilidad suave. El descanso también entrena.</div>`;}
  else if(c2.mood>=3&&c2.energy>=3){el.innerHTML+=`<div class="note">Buen día para darlo todo. Aprovecha la energía. 💪</div>`;}
}
function setCheckin(k,v){const d=today();DB.checkins[d]=DB.checkins[d]||{};DB.checkins[d][k]=v;save();renderCheckin();renderCheckinTrend();}
function renderCheckinTrend(){
  const el=document.getElementById('checkinTrend');if(!el)return;
  const days=weekRange(0);const data=days.map(d=>({d,c:DB.checkins[d]}));
  if(!data.some(x=>x.c)){el.innerHTML='<p class="empty">Haz tu primer check-in para ver tu semana.</p>';return;}
  const dayL=['L','M','X','J','V','S','D'];
  el.innerHTML=`<div class="chart">${data.map((x,i)=>{const v=x.c&&x.c.mood?x.c.mood:0;const h=v?20+v/4*80:6;const em=['','😞','😐','🙂','😄'][v]||'·';return `<div class="b" style="height:${h}%;${v?'':'opacity:.2'}"><em>${em}</em><span>${dayL[i]}</span></div>`;}).join('')}</div><div style="height:22px"></div><p class="mini">Tu ánimo a lo largo de la semana. Útil para ver si el entreno o el estrés te están pasando factura.</p>`;
}
function renderHealthScore(){
  const el=document.getElementById('healthScore');if(!el)return;
  const d=today();const log=DB.habitLog[d]||{};const c=DB.checkins[d]||{};
  const habPct=DB.habits.length?DB.habits.filter(h=>log[h.id]).length/DB.habits.length:0;
  // componentes 0-100
  const comps=[];
  comps.push({n:'Hábitos',v:Math.round(habPct*100)});
  if(c.sleep)comps.push({n:'Sueño',v:Math.round(c.sleep/4*100)});
  if(c.energy)comps.push({n:'Energía',v:Math.round(c.energy/4*100)});
  if(c.stress)comps.push({n:'Calma',v:Math.round((5-c.stress)/4*100)});
  const sess=DB.sessions.some(s=>s.date===d)||DB.extraLog[d]&&(DB.extraLog[d].box||DB.extraLog[d].run);
  comps.push({n:'Actividad',v:sess?100:0});
  const score=Math.round(comps.reduce((a,x)=>a+x.v,0)/comps.length);
  const col=score>=80?'var(--ok)':score>=55?'var(--gold)':'var(--acc)';
  el.innerHTML=`<div style="text-align:center;margin-bottom:10px"><span style="font-family:Anton;font-size:46px;color:${col}">${score}</span><span class="mini"> /100</span></div>${comps.map(c=>`<div style="margin-bottom:6px"><div style="display:flex;justify-content:space-between"><span style="font-size:12px">${c.n}</span><span class="mini">${c.v}</span></div><div class="bar"><i style="width:${c.v}%;background:${col}"></i></div></div>`).join('')}<p class="mini" style="margin-top:8px">Combina hábitos, sueño, energía, calma y actividad del día. Rellena el Check-in para que sea más preciso.</p>`;
}

/* ===================== V26 · MEJORAS DE VALOR ===================== */

/* --- 2. Pantalla HOY grande --- */
/* Veredicto honesto: ¿progresas o estás aflojando? (constancia + tendencia de peso) */
function progressVerdict(){
  const now=new Date();
  const sess=DB.sessions.map(s=>s.date).filter(Boolean);
  const daysSince=d=>Math.floor((now-new Date(d))/864e5);
  const last=sess.length?Math.min(...sess.map(daysSince)):999;
  const last14=sess.filter(d=>daysSince(d)<=14).length;
  const cardio14=Object.keys(DB.extraLog||{}).filter(d=>daysSince(d)<=14&&(DB.extraLog[d].run||DB.extraLog[d].box)).length;
  // tendencia de peso: primera vs última de las últimas 3 mediciones
  const b=(DB.body||[]).filter(x=>x.peso).slice(0,3);
  let wTrend=null;if(b.length>=2)wTrend=+(b[0].peso-b[b.length-1].peso).toFixed(1); // <0 = bajando
  // señales
  if(!DB.sessions.length)return {ic:'🚀',tone:'gold',txt:'Aún sin entrenos registrados. Haz el primero y pésate para empezar a medir tu progreso.'};
  if(last>=10)return {ic:'📉',tone:'bad',txt:`Llevas <b>${last} días</b> sin entrenar. Se está enfriando: hoy vuelve, aunque sea corto.`};
  const trainOk=last14>=3||(DB.mode==='fullbody'&&last14>=3);
  if(wTrend!=null&&wTrend<0&&(last14+cardio14)>=3)return {ic:'📈',tone:'ok',txt:`Vas bien: <b>${last14} entrenos</b> en 2 semanas y peso <b>bajando ${Math.abs(wTrend)} kg</b>. Sigue exactamente así.`};
  if(wTrend!=null&&wTrend>0&&(last14+cardio14)<3)return {ic:'📉',tone:'bad',txt:`Peso <b>subiendo ${wTrend} kg</b> y poca actividad (${last14+cardio14} sesiones/2 sem). Aprieta esta semana: mueve el cuerpo y cuida la comida.`};
  if((last14+cardio14)>=4)return {ic:'🔥',tone:'ok',txt:`Buena racha: <b>${last14+cardio14} sesiones</b> en 2 semanas. La constancia es lo que mueve la aguja.`};
  if((last14+cardio14)<=1)return {ic:'⚠️',tone:'gold',txt:`Solo ${last14+cardio14} sesión en 2 semanas. Estás aflojando: mete 2-3 esta semana y no falles 2 días seguidos.`};
  if(wTrend==null)return {ic:'⚖️',tone:'gold',txt:'Constancia decente. Te falta pesarte: sin báscula no sé si progresas. Mídete esta semana.'};
  return {ic:'👍',tone:'acc2',txt:`Ritmo sostenible: ${last14+cardio14} sesiones/2 sem. Mantén y busca bajar algo de peso o cintura.`};
}
function renderTodayHero(){
  const el=document.getElementById('todayHero');if(!el)return;
  const td=DAYS[(new Date().getDay()+6)%7];
  const gymR=DB.routines.find(x=>x.day===td);
  const runToday=DB.running&&DB.running.currentPlan&&DB.running.currentPlan.items.find(x=>x.date===today()&&!x.done);
  const rc=recoveryScore();const rcA=recoveryAdvice(rc);
  const log=DB.habitLog[today()]||{};const habPend=DB.habits.filter(h=>!log[h.id]).length;
  const doneToday=DB.sessions.some(s=>s.date===today());
  let plan,ic,btn='';
  if(doneToday){ic='✅';plan='Entreno completado. ¡Bien hecho!';}
  else if(gymR){ic='💪';plan=`Hoy toca <b>${gymR.name}</b>`;btn=`<button class="btn btn-acc2" style="margin-top:10px;width:100%" onclick="document.querySelector('nav button:nth-child(2)').click()">Ir a entrenar →</button>`;}
  else if(runToday){ic='🏃';plan=`Hoy toca <b>${RUN_TYPES[runToday.type].lbl}</b>`;btn=`<button class="btn btn-acc2" style="margin-top:10px;width:100%" onclick="document.querySelector('nav button:nth-child(2)').click()">Ir a correr →</button>`;}
  else{ic='🌿';plan='Día de descanso. Recupera bien.';}
  const painZones=currentPain();
  const v=progressVerdict();const vcol={ok:'var(--ok)',bad:'var(--bad)',gold:'var(--gold)',acc2:'var(--acc2)'}[v.tone]||'var(--acc2)';
  el.innerHTML=`<div class="card" style="border-color:var(--acc);background:linear-gradient(135deg,rgba(255,64,21,.08),transparent)">
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <div><div class="mini" style="text-transform:capitalize">${new Date().toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'})}</div><div style="font-family:Anton;font-size:22px;margin-top:2px">${ic} ${plan}</div></div>
      <div style="text-align:center"><div style="font-family:Anton;font-size:32px;color:${rcA.col}">${rc}</div><div class="mini">recovery</div></div>
    </div>
    <div style="margin-top:10px;padding:9px 11px;border-radius:10px;background:rgba(255,255,255,.03);border-left:3px solid ${vcol}"><span style="font-size:14px;line-height:1.4">${v.ic} ${v.txt}</span></div>
    ${btn}
    <div class="row" style="margin-top:10px">
      <div class="stat" style="flex:1"><div class="v ${habPend?'gold':'acc2'}">${habPend}</div><div class="l">hábitos pendientes</div></div>
      <div class="stat" style="flex:1;cursor:pointer" onclick="openPainLog()"><div class="v ${painZones.length?'bad':'acc2'}">${painZones.length||'✓'}</div><div class="l">molestias 🩹</div></div>
    </div>
    ${painZones.length?`<div class="mini" style="margin-top:6px;color:var(--bad)">⚠️ Molestia en: ${painZones.join(', ')}. Ve con cuidado en esas zonas hoy.</div>`:''}
  </div>`;
}

/* --- 1. Menú de ejercicio: histórico + sustitución --- */
function exerciseMenu(bi,ei){
  const ex=DB.session.blocks[bi].exercises[ei];
  openModal(`<h3>${ex.name}</h3><div class="row" style="margin-top:6px"><button class="btn2" style="flex:1" onclick="showExerciseHistory('${ex.name.replace(/'/g,"")}')">📊 Ver progresión</button><button class="btn2" style="flex:1" onclick="swapExercise(${bi},${ei})">⇄ Cambiar</button></div><button class="btn2" style="margin-top:8px;width:100%" onclick="showExVideo('${ex.name.replace(/'/g,"")}')">🎬 Técnica</button>`);
}
function showExerciseHistory(name){
  const h=exerciseHistory(name);
  if(!h.length){openModal(`<h3>📊 ${name}</h3><p class="empty">Aún no hay histórico de este ejercicio. Al registrarlo unas cuantas veces verás aquí tu progresión.</p>`);return;}
  const recent=h.slice(-10);const max=Math.max(...recent.map(x=>x.topKg),1);
  const first=h[0],last=h[h.length-1];const diff=(last.topKg-first.topKg).toFixed(1);
  const e1=bestE1RM(name);
  openModal(`<h3>📊 ${name}</h3><div class="stat-grid"><div class="stat"><div class="v acc2">${last.topKg}</div><div class="l">último kg</div></div><div class="stat"><div class="v gold">${max}</div><div class="l">máximo</div></div><div class="stat"><div class="v ${diff>=0?'acc':'bad'}">${diff>=0?'+':''}${diff}</div><div class="l">desde inicio</div></div></div>
  <div class="chart" style="margin-top:14px">${recent.map(x=>`<div class="b" style="height:${Math.round(x.topKg/max*100)}%"><em>${x.topKg}</em><span>${x.date.slice(5)}</span></div>`).join('')}</div><div style="height:22px"></div>
  ${e1?`<p class="mini" style="margin-top:6px">Fuerza estimada (1RM): <b>${e1} kg</b>.</p>`:''}
  <p class="mini">Últimas ${recent.length} veces que registraste este ejercicio.</p>`);
}

/* --- 3. Repetir + progresar (sube 2,5 kg donde cerraste con RPE ≤ 8) --- */
function repeatProgress(rid){
  startSession(rid,'normal');
  const s=DB.session;if(!s)return;let subidos=0;
  s.blocks.forEach(b=>{if(b.type!=='fuerza'&&b.type!=='hipertrofia')return;b.exercises.forEach(e=>{
    const prev=e.prev;if(!prev||!prev.length)return;
    if(noteSentiment(DB.exNotes&&DB.exNotes[e.name])==='pain')return; // no subir si hay molestia anotada
    const allDone=prev.every(p=>(+p.reps||0)>0);const maxRpe=Math.max(...prev.map(p=>+p.rpe||0));
    if(allDone&&maxRpe>0&&maxRpe<=8){e.sets.forEach((st,i)=>{const base=+((prev[i]||prev[0]).kg)||0;if(base>0){st.kg=Math.round((base+2.5)*4)/4;subidos++;}});}
  });});
  save();renderSessionBody();renderSessionHead();
  toast(subidos?`↺ +2,5 kg en ${subidos} series donde ibas sobrado (RPE ≤8)`:'↺ Cargada. No había series claras para subir; progresa donde puedas');
}

/* --- 4. Compartir logro como imagen --- */
function shareAchievement(title,subtitle){
  const cv=document.createElement('canvas');cv.width=1080;cv.height=1080;const x=cv.getContext('2d');
  x.fillStyle='#0e0f13';x.fillRect(0,0,1080,1080);
  x.fillStyle='#ff4015';x.fillRect(0,0,1080,14);
  x.fillStyle='#15e0c0';x.fillRect(0,1066,1080,14);
  x.textAlign='center';
  x.fillStyle='#fff';x.font='bold 64px Arial';x.fillText('FORJA',540,180);
  x.fillStyle='#ff4015';x.font='bold 120px Arial';
  wrapText(x,title,540,480,980,120);
  x.fillStyle='#c9ccd4';x.font='42px Arial';
  wrapText(x,subtitle||'',540,720,900,54);
  x.fillStyle='#8a8f99';x.font='34px Arial';x.fillText(new Date().toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}),540,980);
  cv.toBlob(blob=>{
    const file=new File([blob],'forja-logro.png',{type:'image/png'});
    if(navigator.canShare&&navigator.canShare({files:[file]})){navigator.share({files:[file],title:'Mi logro en FORJA'}).catch(()=>{});}
    else{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='forja-logro.png';a.click();toast('📸 Imagen descargada');}
  },'image/png');
}
function wrapText(ctx,text,cx,cy,maxW,lh){const words=(text||'').split(' ');let line='',y=cy;const lines=[];words.forEach(w=>{const test=line+w+' ';if(ctx.measureText(test).width>maxW&&line){lines.push(line);line=w+' ';}else line=test;});lines.push(line);const startY=cy-(lines.length-1)*lh/2;lines.forEach((l,i)=>ctx.fillText(l.trim(),cx,startY+i*lh));}

/* --- 5. Diario de molestias (toca zona del mapa) --- */
const PAIN_ZONES=['Hombro','Pecho','Espalda','Brazo','Core','Cadera','Pierna','Rodilla'];
function openPainLog(){
  DB.pain=DB.pain||{};const d=today();const cur=DB.pain[d]||{};
  openModal(`<h3>🩹 Molestias de hoy</h3><p class="mini" style="margin-bottom:10px">Marca dónde notas molestia y cuánto. El Coach lo tendrá en cuenta para sugerirte bajar volumen en esa zona.</p>${PAIN_ZONES.map(z=>`<div style="margin-bottom:8px"><div style="font-size:13px;margin-bottom:4px">${z}</div><div class="row">${[['ninguna',0],['leve',1],['media',2],['fuerte',3]].map(o=>`<button class="btn-sm ${((cur[z]||0)===o[1])?'btn-acc2':'btn2'}" style="flex:1" onclick="setPain('${z}',${o[1]},this)">${o[0]}</button>`).join('')}</div></div>`).join('')}<button class="btn" style="margin-top:10px" onclick="closeModal();renderDashboard()">Guardar</button>`);
}
function setPain(zone,lvl,btn){DB.pain=DB.pain||{};const d=today();DB.pain[d]=DB.pain[d]||{};if(lvl===0)delete DB.pain[d][zone];else DB.pain[d][zone]=lvl;save();btn.parentElement.querySelectorAll('button').forEach(b=>{b.classList.remove('btn-acc2');b.classList.add('btn2');});btn.classList.remove('btn2');btn.classList.add('btn-acc2');}
function currentPain(){const d=today();const p=DB.pain&&DB.pain[d];if(!p)return[];return Object.keys(p).filter(z=>p[z]>=2);}

/* --- 6. Insights automáticos (patrones) --- */
function generateInsights(){
  const out=[];const S=DB.sessions;
  if(S.length>=4){
    // mejor día de la semana por density
    const byDow={};S.forEach(s=>{if(!s.density)return;const dw=new Date(s.date).getDay();(byDow[dw]=byDow[dw]||[]).push(s.density);});
    let bestDow=null,bestAvg=0;Object.keys(byDow).forEach(dw=>{const avg=byDow[dw].reduce((a,x)=>a+x,0)/byDow[dw].length;if(avg>bestAvg){bestAvg=avg;bestDow=dw;}});
    if(bestDow!==null){const names=['domingos','lunes','martes','miércoles','jueves','viernes','sábados'];out.push(`Tu mejor rendimiento suele caer los ${names[bestDow]}.`);}
  }
  // correlación sueño/rendimiento
  const paired=S.filter(s=>s.density&&DB.checkins[s.date]&&DB.checkins[s.date].sleep);
  if(paired.length>=4){const good=paired.filter(s=>DB.checkins[s.date].sleep>=3),bad=paired.filter(s=>DB.checkins[s.date].sleep<3);if(good.length&&bad.length){const ga=good.reduce((a,s)=>a+s.density,0)/good.length,ba=bad.reduce((a,s)=>a+s.density,0)/bad.length;if(ga>ba*1.05)out.push(`Rindes mejor cuando duermes bien: cuida el sueño la víspera de entrenar.`);}}
  // racha de progreso
  if(S.length>=3){const vols=S.slice(0,3).map(s=>sessionVolume(s));if(vols[0]>vols[2])out.push(`Tu volumen de entrenamiento viene subiendo en las últimas sesiones. Buena progresión.`);}
  // consistencia
  const wk=weekDates();const done=wk.filter(d=>S.some(s=>s.date===d)).length;
  if(done>=3)out.push(`Llevas ${done} entrenos esta semana. La constancia es tu mayor activo.`);
  return out;
}
function renderInsights(){const el=document.getElementById('insightsCard');if(!el)return;const ins=generateInsights();if(!ins.length){el.innerHTML='';return;}el.innerHTML=`<div class="card"><h3>🔍 Patrones detectados</h3>${ins.map(i=>`<div style="display:flex;gap:8px;margin-bottom:6px"><span style="color:var(--gold)">●</span><span style="font-size:14px">${i}</span></div>`).join('')}</div>`;}

/* --- 7. Predicción de 1RM futuro --- */
function predictE1RM(name){
  const h=exerciseHistory(name).filter(x=>x.topKg>0);if(h.length<3)return null;
  const pts=h.map((x,i)=>({x:new Date(x.date).getTime()/864e5,y:e1RM(x.topKg,x.topReps||1)}));
  const n=pts.length,sx=pts.reduce((a,p)=>a+p.x,0),sy=pts.reduce((a,p)=>a+p.y,0),sxy=pts.reduce((a,p)=>a+p.x*p.y,0),sxx=pts.reduce((a,p)=>a+p.x*p.x,0);
  const slope=(n*sxy-sx*sy)/(n*sxx-sx*sx||1);if(slope<=0)return null;
  const last=pts[pts.length-1];const cur=last.y;
  return {slope,cur,name};
}
function renderPredictions(){
  const el=document.getElementById('predictView');if(!el)return;
  const names=[...new Set(DB.sessions.flatMap(s=>(s.blocks||[]).filter(b=>b.type==='fuerza').flatMap(b=>b.exercises.map(e=>e.name))))];
  const preds=names.map(predictE1RM).filter(Boolean);
  if(!preds.length){el.innerHTML='<p class="empty">Con más sesiones registradas podré proyectar tu progreso futuro.</p>';return;}
  el.innerHTML=preds.map(p=>{const target=Math.ceil((p.cur+5)/5)*5;const daysNeeded=Math.round((target-p.cur)/p.slope);const dt=new Date();dt.setDate(dt.getDate()+daysNeeded);const when=daysNeeded>0&&daysNeeded<720?dt.toLocaleDateString('es-ES',{month:'long',year:'numeric'}):'—';return `<div class="sub-opt"><span>${p.name}</span><span class="mini">${Math.round(p.cur)}→${target}kg ${when!=='—'?'· '+when:''}</span></div>`;}).join('')+`<p class="mini" style="margin-top:8px">Proyección según tu ritmo actual. Es una estimación motivadora, no una promesa: el progreso real no es lineal.</p>`;
}

/* --- MANUAL integrado --- */
const MANUAL=[
  ['👋 Bienvenida','FORJA es tu entrenador personal en el móvil. Funciona sin conexión y guarda todo en tu teléfono. Tiene 4 pestañas abajo: Panel (resumen), Entreno (fuerza y carrera), Cuerpo (medidas) y Mente (hábitos y bienestar). La filosofía: constancia sobre perfección. No busques el 100% cada día; busca no fallar dos días seguidos.'],
  ['📊 Panel','Tu centro de mando. Arriba, la pantalla HOY te dice qué toca. El Coach Semanal analiza tu semana y te da acciones concretas. El Recovery Score (0-100) combina tu carga reciente y tu descanso: si está bajo, entrena más suave. También ves tu camino a la meta de peso, calendario y constancia.'],
  ['💪 Entreno · sistema','Cada sesión tiene 4 bloques: FUERZA (principal pesado), ACCESORIOS (complementos), DENSIDAD (cardio-fuerza) y FINISHER (cierre). Antes de empezar eliges cómo estás (fresco/normal/fatigado) y la app ajusta el volumen. Tienes 3 modos: Gym, Strongman y Viaje (sin gimnasio).'],
  ['📝 Registrar series','Teclea kg y reps, marca ✓ al terminar cada serie. Si repites lo mismo que la última vez, marca ✓ sin teclear: se autocompleta. Cuando superas tu marca anterior, la serie se pone verde. Toca el nombre del ejercicio para ver su progresión o cambiarlo si la máquina está ocupada. Con gomas (dominadas/fondos): apunta la ayuda en negativo (-15).'],
  ['⏱️ Formatos','EMOM: cada minuto haces las reps y descansas lo que sobre. AMRAP: máximas rondas en X minutos. Tabata: 20s fuerte / 10s suave × 8. La app te guía con cuenta atrás, sonido, vibración y voz. En Ajustes puedes activar o silenciar la voz.'],
  ['🏃 Carrera','Configura tu objetivo (5K o 10K) y días por semana. La app planifica sesiones variadas (rodaje, series, tempo, fartlek, cuestas, técnica, tirada larga) evitando tus días de gym. Si tu Recovery está bajo, cambia sola la sesión por una más suave. Al terminar, apunta km y calcula tu ritmo.'],
  ['📏 Cuerpo','Mídete cada 2 semanas (peso, cintura, cuello...) siempre igual: en ayunas y a la misma hora. Los campos salen vacíos con tu última medida como referencia gris: teclea solo lo que midas hoy. La tendencia de peso usa media móvil para no asustarte con el ruido diario. La composición estimada usa la fórmula US Navy (orientativa).'],
  ['🧠 Mente','Check-in diario de 30 segundos (ánimo, sueño, estrés...). Hábitos con cadena de días: no rompas la cadena. Health Score combina hábitos, sueño y actividad. Biblioteca de vídeos de movilidad, yoga y respiración.'],
  ['⚙️ Ajustes y copia','MUY IMPORTANTE: exporta tu copia de seguridad de vez en cuando (Ajustes → Exportar). Tus datos viven solo en este móvil; si lo pierdes o borras el navegador sin copia, se pierden. También ajustas tamaño de letra, voz, pantalla activa y tienes calculadora de discos y cronómetros.'],
  ['❓ Problemas','¿Datos borrados? Solo se recuperan si tienes copia exportada. ¿Vídeos no cargan? Necesitan internet, el resto funciona sin conexión. ¿La app no se actualiza? Ciérrala del todo y reábrela. ¿Algo va raro? Exporta tu copia antes de tocar nada, así nunca pierdes el progreso.']
];
function openManual(cap){
  cap=cap||0;const[t,txt]=MANUAL[cap];
  openModal(`<h3>${t}</h3><p style="font-size:14px;line-height:1.55;margin:8px 0 14px">${txt}</p><div class="row"><button class="btn2" style="flex:1" ${cap===0?'disabled style=opacity:.4':''} onclick="openManual(${cap-1})">‹ Anterior</button><span class="mini" style="align-self:center">${cap+1}/${MANUAL.length}</span><button class="btn2" style="flex:1" ${cap===MANUAL.length-1?'disabled style=opacity:.4':''} onclick="openManual(${cap+1})">Siguiente ›</button></div><div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:4px">${MANUAL.map((m,i)=>`<button class="btn-sm ${i===cap?'btn-acc2':'btn2'}" style="padding:4px 8px;font-size:11px" onclick="openManual(${i})">${m[0].split(' ')[0]}</button>`).join('')}</div>`);
}

/* --- TOUR de bienvenida (primera vez) --- */
const TOUR=[
  ['👋 Bienvenido a FORJA','Tu entrenador personal en el bolsillo. Todo funciona sin conexión y tus datos se guardan en tu móvil. Te enseño lo básico en 4 pasos.'],
  ['📊 Panel','Aquí ves de un vistazo qué toca hoy, cómo estás de recuperado y tu progreso. El Coach te aconseja cada semana.'],
  ['💪 Entreno','Registra tus series (la app recuerda tus marcas y te avisa cuando mejoras), sigue tu plan de carrera y cambia entre modo Gym, Strongman o Viaje.'],
  ['📏📧 Cuerpo y Mente','Mídete cada 2 semanas para ver tu evolución, y cuida hábitos, sueño y descanso. Y muy importante: exporta tu copia de seguridad de vez en cuando desde Ajustes ⚙️.']
];
function showTour(step){
  step=step||0;const[t,txt]=TOUR[step];
  openModal(`<div style="text-align:center"><div style="font-size:40px;margin-bottom:8px">${t.split(' ')[0]}</div><h3>${t.substring(t.indexOf(' ')+1)}</h3><p style="font-size:15px;line-height:1.5;margin:12px 0">${txt}</p><div style="display:flex;justify-content:center;gap:6px;margin:14px 0">${TOUR.map((_,i)=>`<span style="width:8px;height:8px;border-radius:50%;background:${i===step?'var(--acc)':'var(--line)'}"></span>`).join('')}</div>${step<TOUR.length-1?`<button class="btn btn-acc2" onclick="showTour(${step+1})">Siguiente</button><br><button class="btn2" style="margin-top:8px" onclick="finishTour()">Saltar</button>`:`<button class="btn btn-acc2" onclick="finishTour()">¡Empezar!</button>`}</div>`);
}
function finishTour(){DB.tourDone=true;save();closeModal();toast('💪 ¡A darlo todo! Consulta el Manual en Ajustes cuando quieras');}

/* ===================== CONTROL DE TEMPO E ISOMÉTRICOS ===================== */
/* Guía cada repetición por fases (excéntrica-pausa-concéntrica) con voz, pitido y vibración.
   Formato de tempo: "3-1-1" = 3s bajada, 1s pausa abajo, 1s subida. "3-1-1-0" añade pausa arriba. */
let TEMPO={active:false,id:null};
const TEMPO_PRESETS=['3-1-1','4-1-1','2-0-2','4-0-1','5-1-1','3-1-2','2-1-2'];
function openTempo(name,preset){
  const def=preset||'3-1-1';
  openModal(`<h3>⏱️ Tempo · ${name||'ejercicio'}</h3>
  <p class="mini" style="margin-bottom:10px">La app te guía cada repetición: bajada, pausa y subida, con voz y sonido. Ejecuta al ritmo que marca.</p>
  <label>Tempo (bajada-pausa-subida)</label>
  <select id="tempoSel">${TEMPO_PRESETS.map(t=>`<option ${t===def?'selected':''}>${t}</option>`).join('')}</select>
  <label style="margin-top:8px">Repeticiones a guiar</label>
  <input id="tempoReps" type="number" inputmode="numeric" value="8">
  <div id="tempoLive" style="margin-top:14px"></div>
  <button class="btn btn-acc2" style="margin-top:12px" id="tempoStartBtn" onclick="startTempo()">▶ Empezar</button>`);
}
function startTempo(){
  const parts=document.getElementById('tempoSel').value.split('-').map(Number);
  const reps=+document.getElementById('tempoReps').value||8;
  const [down,pauseB,up,pauseT=0]=parts;
  TEMPO={active:true,id:null,phases:[],rep:1,reps,phaseIdx:0,phaseLeft:0};
  // construir secuencia de fases de UNA repetición
  const seq=[];
  if(down>0)seq.push({lbl:'BAJA',sec:down,col:'var(--acc2)',say:'Baja'});
  if(pauseB>0)seq.push({lbl:'PAUSA',sec:pauseB,col:'var(--gold)',say:'Pausa'});
  if(up>0)seq.push({lbl:'SUBE',sec:up,col:'var(--acc)',say:'Sube'});
  if(pauseT>0)seq.push({lbl:'ARRIBA',sec:pauseT,col:'var(--gold)',say:'Arriba'});
  TEMPO.seq=seq;TEMPO.phaseIdx=0;TEMPO.phaseLeft=seq[0].sec;
  document.getElementById('tempoStartBtn').style.display='none';
  speak(`Repetición 1. ${seq[0].say}`);beep(1);
  TEMPO.id=setInterval(tempoTick,1000);renderTempoLive();
}
function tempoTick(){
  TEMPO.phaseLeft--;
  if(TEMPO.phaseLeft<=0){
    TEMPO.phaseIdx++;
    if(TEMPO.phaseIdx>=TEMPO.seq.length){
      // fin de una repetición
      if(TEMPO.rep>=TEMPO.reps){finishTempo();return;}
      TEMPO.rep++;TEMPO.phaseIdx=0;TEMPO.phaseLeft=TEMPO.seq[0].sec;
      beep(2);try{if(navigator.vibrate)navigator.vibrate(120);}catch(e){}
      speak(`${TEMPO.rep}. ${TEMPO.seq[0].say}`);
    }else{
      const ph=TEMPO.seq[TEMPO.phaseIdx];TEMPO.phaseLeft=ph.sec;
      beep(1);try{if(navigator.vibrate)navigator.vibrate(60);}catch(e){}
      speak(ph.say);
    }
  }
  renderTempoLive();
}
function renderTempoLive(){
  const el=document.getElementById('tempoLive');if(!el||!TEMPO.active)return;
  const ph=TEMPO.seq[TEMPO.phaseIdx];
  el.innerHTML=`<div class="timer-hero go" style="background:${ph.col}22"><div class="phase" style="color:${ph.col}">${ph.lbl}</div><div class="clock" style="color:${ph.col};font-size:56px">${TEMPO.phaseLeft}</div><div class="sub">Repetición ${TEMPO.rep} de ${TEMPO.reps}</div><div class="timer-ctrl"><button class="btn2" onclick="stopTempo()">Parar</button></div></div>`;
}
function finishTempo(){clearInterval(TEMPO.id);TEMPO.active=false;speak('Serie completada');beep(3);try{if(navigator.vibrate)navigator.vibrate([200,80,200]);}catch(e){}const el=document.getElementById('tempoLive');if(el)el.innerHTML='<div class="note">✅ Serie completada con tempo controlado.</div>';toast('✅ Serie con tempo completada');}
function stopTempo(){clearInterval(TEMPO.id);TEMPO.active=false;try{speechSynthesis.cancel();}catch(e){}const el=document.getElementById('tempoLive');if(el)el.innerHTML='';const b=document.getElementById('tempoStartBtn');if(b)b.style.display='block';}

/* Isométrico / mantenimiento (plancha, hang, wall sit, pausa) */
let ISO={active:false,id:null,left:0};
function openIso(name){
  openModal(`<h3>🧊 Isométrico · ${name||'mantenimiento'}</h3>
  <p class="mini" style="margin-bottom:10px">Para planchas, hangs, wall sits o pausas. Elige el tiempo a mantener; la app avisa al empezar, en la recta final y al terminar.</p>
  <label>Segundos a mantener</label>
  <select id="isoSec"><option>20</option><option>30</option><option selected>45</option><option>60</option><option>90</option><option>120</option></select>
  <div id="isoLive" style="margin-top:14px"></div>
  <button class="btn btn-acc2" style="margin-top:12px" id="isoStartBtn" onclick="startIso()">▶ Empezar</button>`);
}
function startIso(){
  const sec=+document.getElementById('isoSec').value||45;
  ISO={active:true,id:null,left:sec,total:sec};
  document.getElementById('isoStartBtn').style.display='none';
  speak(`Mantén la posición. ${sec} segundos`);beep(2);
  ISO.id=setInterval(isoTick,1000);renderIsoLive();
}
function isoTick(){
  ISO.left--;
  if(ISO.left===10)speak('Diez segundos');
  if(ISO.left<=5&&ISO.left>0){beep(1);try{if(navigator.vibrate)navigator.vibrate(60);}catch(e){}}
  if(ISO.left<=0){clearInterval(ISO.id);ISO.active=false;speak('Descansa');beep(3);try{if(navigator.vibrate)navigator.vibrate([200,80,200]);}catch(e){}const el=document.getElementById('isoLive');if(el)el.innerHTML='<div class="note">✅ ¡Aguantado!</div>';toast('✅ Isométrico completado');return;}
  renderIsoLive();
}
function renderIsoLive(){const el=document.getElementById('isoLive');if(!el||!ISO.active)return;const pct=Math.round((ISO.total-ISO.left)/ISO.total*100);const col=ISO.left<=5?'var(--acc)':'var(--acc2)';el.innerHTML=`<div class="timer-hero go"><div class="phase" style="color:${col}">MANTÉN</div><div class="clock" style="color:${col};font-size:56px">${ISO.left}s</div><div style="height:6px;background:var(--bg3);border-radius:4px;margin:8px 12px 0"><div style="height:100%;background:${col};border-radius:4px;width:${pct}%"></div></div><div class="timer-ctrl"><button class="btn2" onclick="stopIso()">Parar</button></div></div>`;}
function stopIso(){clearInterval(ISO.id);ISO.active=false;try{speechSynthesis.cancel();}catch(e){}const el=document.getElementById('isoLive');if(el)el.innerHTML='';const b=document.getElementById('isoStartBtn');if(b)b.style.display='block';}

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
  <div class="ex-block" style="border-color:var(--acc2)"><b style="font-family:Anton">📖 Manual de uso</b><p class="mini" style="margin:6px 0 10px">Cómo sacar el máximo partido a cada pantalla de FORJA.</p><button class="btn2" style="width:100%" onclick="openManual(0)">Abrir manual</button></div>
  <div class="ex-block"><b style="font-family:Anton">💾 Respaldo de datos</b><p class="mini" style="margin:6px 0 10px">Guarda una copia de todo (entrenos, medidas, fotos, hábitos). Impórtala si cambias de móvil o limpias el navegador. <b>Hazlo cada 1-2 semanas</b>: es tu único seguro contra perderlo todo.</p><div class="row"><button class="btn-acc2" style="flex:1" onclick="exportData()">⬇ Exportar</button><button class="btn2" style="flex:1" onclick="document.getElementById('importFile').click()">⬆ Importar</button></div><div id="storageBar" style="margin-top:10px"></div></div>
  <div class="ex-block"><b style="font-family:Anton">🔤 Tamaño de letra</b><div class="row" style="margin-top:8px"><button class="btn2" onclick="setFont(0.9)">A−</button><button class="btn2" onclick="setFont(1)">A</button><button class="btn2" onclick="setFont(1.15)">A+</button><button class="btn2" onclick="setFont(1.3)">A++</button></div><p class="mini" style="margin-top:6px">Actual: ${Math.round(fs*100)}%</p></div>
  <div class="ex-block"><b style="font-family:Anton">🧮 Calculadora de discos</b><p class="mini" style="margin:6px 0 8px">Qué discos poner por lado para un peso objetivo.</p><button class="btn2" onclick="openPlates()">Abrir calculadora</button></div>
  <div class="ex-block"><b style="font-family:Anton">⏱️ Cronómetro de intervalos</b><p class="mini" style="margin:6px 0 8px">Para carrera y cardio: trabajo/descanso × rondas (HIIT, sprints).</p><button class="btn2" onclick="openIntervals()">Abrir cronómetro</button></div>
  <div class="ex-block"><b style="font-family:Anton">🐢 Tiempo bajo tensión (TUT)</b><p class="mini" style="margin:6px 0 8px">Cuenta los segundos de una serie. El rango óptimo para hipertrofia es 40-70s. Útil en el modo Strongman.</p><button class="btn2" onclick="openTUT()">Abrir contador TUT</button></div>
  <div class="ex-block"><b style="font-family:Anton">📱 Pantalla activa</b><p class="mini" style="margin:6px 0 8px">Evita que el móvil se apague durante la sesión.</p><label style="display:flex;align-items:center;gap:8px;text-transform:none;font-size:14px"><input type="checkbox" id="wlChk" ${DB.settings&&DB.settings.wakeLock?'checked':''} onchange="toggleWakeSetting(this.checked)" style="width:20px;height:20px"> Mantener pantalla encendida</label></div>
  <div class="ex-block"><b style="font-family:Anton">🗣️ Avisos de voz</b><p class="mini" style="margin:6px 0 8px">Voz en tabata, EMOM y protocolos ("trabajo", "descanso", "última ronda").</p><label style="display:flex;align-items:center;gap:8px;text-transform:none;font-size:14px"><input type="checkbox" id="vcChk" ${!DB.settings||DB.settings.voice!==false?'checked':''} onchange="toggleVoice(this.checked)" style="width:20px;height:20px"> Voz activada</label></div>
  <div class="ex-block"><b style="font-family:Anton">⚠️ Datos</b><p class="mini" style="margin:6px 0 8px">Tus datos viven solo en este teléfono. Exporta de vez en cuando como copia de seguridad.</p></div>`);
  renderStorageBar();
}
function renderStorageBar(){const el=document.getElementById('storageBar');if(!el)return;const s=storageInfo();const col=s.pct>=80?'var(--bad)':s.pct>=60?'var(--gold)':'var(--acc2)';
  el.innerHTML=`<div class="mini" style="margin-bottom:4px">Almacenamiento usado: <b>${s.mb} MB</b> (${s.pct}%)${s.photos?` · ${s.photos} foto${s.photos!==1?'s':''}`:''}</div><div class="bar"><i style="width:${Math.max(3,s.pct)}%;background:${col}"></i></div>${s.pct>=70?`<p class="mini" style="margin-top:6px;color:var(--gold)">Cerca del límite del navegador (~5 MB). Exporta una copia y valora borrar fotos antiguas.</p>`:''}`;}
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
function toggleVoice(on){DB.settings=DB.settings||{};DB.settings.voice=on;save();if(on)speak('Voz activada');else{try{speechSynthesis.cancel();}catch(e){}}}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&DB.settings&&DB.settings.wakeLock&&DB.session)requestWake();});

/* ===================== RESUMEN SEMANAL ===================== */
function renderWeeklySummary(){
  const el=document.getElementById('weeklySummary');if(!el)return;
  const wk=weekDates();const sess=DB.sessions.filter(s=>wk.includes(s.date));
  const box=wk.filter(d=>DB.extraLog[d]&&DB.extraLog[d].box).length;
  const run=wk.filter(d=>DB.extraLog[d]&&DB.extraLog[d].run).length;
  const kmWeek=wk.reduce((a,d)=>a+((DB.extraLog[d]&&DB.extraLog[d].runKm)||0),0);
  // mejores marcas de la semana
  const prs=[];sess.forEach(s=>(s.blocks||[]).forEach(b=>b.exercises.forEach(e=>{let mx=0;(e.sets||[]).forEach(st=>{if(+st.kg>mx)mx=+st.kg;});if(mx>0)prs.push({n:e.name,kg:mx});})));
  const top=Object.values(prs.reduce((a,p)=>{if(!a[p.n]||p.kg>a[p.n].kg)a[p.n]=p;return a;},{})).sort((a,b)=>b.kg-a.kg).slice(0,3);
  const fl=fatLossScore();
  el.innerHTML=`<div class="stat-grid"><div class="stat"><div class="v acc2">${sess.length}</div><div class="l">entrenos</div></div><div class="stat"><div class="v gold">${box}</div><div class="l">boxeos</div></div><div class="stat"><div class="v viol">${run}</div><div class="l">carreras${kmWeek?' · '+kmWeek.toFixed(1)+' km':''}</div></div></div>${fl!=null?`<div class="note" style="margin-top:10px">Fat Loss de la semana: <b>${fl}/100</b></div>`:''}${top.length?`<div style="margin-top:10px"><div class="mini" style="text-transform:uppercase">Mejores marcas</div>${top.map(t=>`<span class="pill" style="border-color:var(--gold);color:var(--gold)">${t.n} ${t.kg}kg</span>`).join('')}</div>`:'<p class="mini" style="margin-top:10px">Entrena esta semana para ver tus marcas aquí.</p>'}`;
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

/* ===================== CALENTAMIENTO GUIADO (usa motor de secuencias) ===================== */
function startWarmup(rid){
  const r=DB.routines.find(x=>x.id===rid);if(!r)return;
  const seq=warmupFor(r);const mins=Math.round(seq.reduce((a,p)=>a+p.sec,0)/60);
  runSequence(`Calentamiento · ${r.name}`,seq,()=>{toast('🔥 Calentado. ¡A entrenar!');});
}
function ytSearch(q){return 'https://www.youtube.com/results?search_query='+encodeURIComponent(q);}
function warmupVideo(rid){const r=DB.routines.find(x=>x.id===rid);const nm=r?r.name:'';const zona=/pierna|leg|lower|inferior|sentadilla/i.test(nm)?'piernas':/push|pull|torso|upper|superior|press|espalda|pecho/i.test(nm)?'tren superior':'cuerpo completo';try{window.open(ytSearch('calentamiento dinámico antes de entrenar '+zona),'_blank');}catch(e){}}
function startStretchFull(){closeModal();const seq=[...ST_LOWER,...ST_UPPER].map(p=>({...p}));runSequence('Estiramientos completos',seq,()=>renderDashboard());}
function openRecoveryMenu(){
  openModal(`<h3>🧘 Recuperación</h3><p class="mini" style="margin-bottom:10px">Estira y trabaja el abdomen al terminar de entrenar. Elige zona (o míralo en vídeo si prefieres ver la forma):</p>
  <div class="ex-block" style="border-color:var(--acc2)"><b>🧘 Estiramientos</b><div class="row" style="gap:6px;margin-top:8px"><button class="btn-sm btn-acc2" onclick="startStretch(true)">Tren inferior</button><button class="btn-sm btn-acc2" onclick="startStretch(false)">Tren superior</button><button class="btn-sm btn2" onclick="startStretchFull()">Completo</button></div><a class="exvid-link" href="${ytSearch('rutina de estiramientos post entreno guiada')}" target="_blank">🎬 Ver en vídeo</a></div>
  <div class="ex-block" style="border-color:var(--viol)"><b>🔥 Abdominales / core</b><div class="row" style="gap:6px;margin-top:8px"><button class="btn-sm btn-viol" onclick="startCore()">▶ Rutina de core guiada</button></div><a class="exvid-link" href="${ytSearch('rutina de abdominales core sin material guiada')}" target="_blank">🎬 Ver en vídeo</a></div>`);
}

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
let TUT={sec:0,id:null};
function openTUT(){TUT={sec:0,id:null};openModal(`<h3>🐢 Tiempo bajo tensión</h3><p class="mini" style="margin-bottom:10px">Pulsa Iniciar al empezar la serie y Parar al acabar. Objetivo hipertrofia: 40-70s por serie.</p><div id="tutLive"><div class="timer-hero go"><div class="clock" id="tutClock">0s</div><div class="sub" id="tutMsg">Listo para empezar</div><div class="timer-ctrl"><button class="btn-acc2" onclick="tutStart()">Iniciar</button><button class="btn2" onclick="tutStop()">Parar</button></div></div></div>`);}
function tutStart(){TUT.sec=0;if(TUT.id)clearInterval(TUT.id);TUT.id=setInterval(()=>{TUT.sec++;const c=document.getElementById('tutClock'),m=document.getElementById('tutMsg');if(c)c.textContent=TUT.sec+'s';if(m){if(TUT.sec<40)m.textContent='Sigue... (objetivo 40-70s)';else if(TUT.sec<=70)m.textContent='✅ En rango óptimo de hipertrofia';else m.textContent='Muy largo: baja el peso o corta la serie';}},1000);}
function tutStop(){if(TUT.id)clearInterval(TUT.id);const m=document.getElementById('tutMsg');beep(1);if(m)m.textContent=`Serie de ${TUT.sec}s. ${TUT.sec>=40&&TUT.sec<=70?'Rango ideal 💪':TUT.sec<40?'Corta: prioriza más reps o tempo lento':'Larga: baja peso'}`;}

/* ===================== CALENDARIO MENSUAL ===================== */
function renderCalendar(){const el=document.getElementById('calendarView');if(!el)return;const now=new Date();const y=now.getFullYear(),mo=now.getMonth();const first=new Date(y,mo,1);const startDow=(first.getDay()+6)%7;const daysIn=new Date(y,mo+1,0).getDate();let html=`<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center">${['L','M','X','J','V','S','D'].map(d=>`<div class="mini" style="font-weight:700">${d}</div>`).join('')}`;for(let i=0;i<startDow;i++)html+='<div></div>';for(let d=1;d<=daysIn;d++){const ds=`${y}-${String(mo+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;const sess=DB.sessions.some(s=>s.date===ds);const e=DB.extraLog[ds]||{};const meas=DB.body.some(b=>b.date===ds);let dots='';if(sess)dots+='<span style="color:var(--acc)">●</span>';if(e.box)dots+='<span style="color:var(--gold)">●</span>';if(e.run)dots+='<span style="color:var(--viol)">●</span>';if(meas)dots+='<span style="color:var(--acc2)">●</span>';const isToday=ds===today();html+=`<div style="aspect-ratio:1;border-radius:8px;border:1px solid ${isToday?'var(--acc)':'var(--line)'};background:var(--bg3);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2px"><span class="mini" style="${isToday?'color:var(--acc);font-weight:700':''}">${d}</span><span style="font-size:7px;line-height:1">${dots||'&nbsp;'}</span></div>`;}html+='</div>';html+=`<p class="mini" style="margin-top:10px"><span style="color:var(--acc)">●</span> entreno · <span style="color:var(--gold)">●</span> boxeo · <span style="color:var(--viol)">●</span> carrera · <span style="color:var(--acc2)">●</span> medición</p>`;el.innerHTML=html;}

/* ===================== INIT ===================== */
/* tarjetas plegables: toca el título para plegar/desplegar; se recuerda tu elección */
const DEFAULT_COLLAPSED=['reto-de-la','resumen-semanal','calendario-del-mes','constancia-días','semana','descarga-deload','estancamientos','fuerza-estimada-rm','comparativa-de-ciclos','density-score-sesiones','récords-máx-peso','últimas-sesiones','logros-de-medidas','fotos-de-progreso','historial'];
function cardSlug(h3){return h3.textContent.toLowerCase().replace(/[^a-záéíóúñü\s]/g,'').trim().split(/\s+/).slice(0,3).join('-');}
function isCollapsed(slug){const c=DB.settings&&DB.settings.collapsedCards;if(c&&slug in c)return c[slug];return DEFAULT_COLLAPSED.includes(slug);}
function applyCollapsed(){document.querySelectorAll('.card>h3').forEach(h3=>{const card=h3.parentElement;if(card.id==='sessionCard')return;card.classList.toggle('collapsed',isCollapsed(cardSlug(h3)));});}
document.addEventListener('click',e=>{const h3=e.target.closest('.card>h3');if(!h3)return;if(e.target.closest('button,a,input,select'))return;const card=h3.parentElement;if(card.id==='sessionCard')return;const slug=cardSlug(h3);DB.settings=DB.settings||{};DB.settings.collapsedCards=DB.settings.collapsedCards||{};DB.settings.collapsedCards[slug]=!card.classList.contains('collapsed');card.classList.toggle('collapsed');save();});
function renderAll(){applyFont();document.getElementById('hdrDate').textContent=new Date().toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'});renderDashboard();renderCycle();renderTodayReady();renderExtra();if(DB.session){document.getElementById('sessionCard').style.display='block';renderSessionHead();renderSessionBody();renderTimerHero();if(DB.settings&&DB.settings.wakeLock)requestWake();}applyCollapsed();}
if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(()=>{});});}
load();
