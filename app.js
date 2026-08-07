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
  goals:[], checkins:{},
  running:{setup:false,target:'10K',daysWeek:2,history:[],currentPlan:null,activeSession:null},
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
function nav(v,el){document.querySelectorAll('.view').forEach(x=>x.classList.remove('on'));document.getElementById('v-'+v).classList.add('on');document.querySelectorAll('nav button').forEach(b=>b.classList.remove('on'));el.classList.add('on');window.scrollTo(0,0);if(v==='home')renderDashboard();if(v==='mind'){renderVideoCats();renderHabits();}if(v==='body')renderBody();if(v==='run'){renderRunView();renderRunLive();}if(v==='train'){renderCycle();renderTodayReady();renderExtra();}}
function navBtn(i){return document.querySelectorAll('nav button')[i];}
function trainTab(t,el){['hoy','prog','retos','rutinas'].forEach(x=>{const e=document.getElementById('train-'+x);if(e)e.style.display='none';});document.getElementById('train-'+t).style.display='block';el.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('on'));el.classList.add('on');if(t==='prog'){renderDeload();renderStagnation();renderProgSelect();renderVolume();renderE1RM();renderPredictions();renderCycleCompare();renderDensityChart();renderPR();renderHistory();}if(t==='retos'){renderGoals();renderMedals();renderFormatPR();}if(t==='rutinas'){renderRoutines();renderRotation();}if(t==='hoy'){renderCycle();renderTodayReady();renderExtra();}}
function mindTab(t,el){['video','checkin','ritual','habits'].forEach(x=>{const e=document.getElementById('mind-'+x);if(e)e.style.display='none';});document.getElementById('mind-'+t).style.display='block';el.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('on'));el.classList.add('on');if(t==='habits'){renderHabits();renderHabitStreak();renderHealthScore();}else if(t==='ritual'){renderMindSteps();renderMindTimer();}else if(t==='checkin'){renderCheckin();renderCheckinTrend();}else{renderVideoCats();}}
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
  const target=DB.routines.length||3;
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
  renderWeekChallenge();renderWeeklySummary();renderTodayHero();renderCoach();renderRecovery();renderInsights();renderGoalProgress();renderBackupReminder();renderCalendar();renderExtraHistory();renderTodayDash();renderWeekView();applyCollapsed();
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
  if(r){const hasLast=!!lastSessionFor(r.id);el.innerHTML=`<div class="day-row"><div class="dd">💪</div><div class="di"><b>${r.name}</b><div class="mini">4 bloques · Fuerza · Hipertrofia · Densidad · Finisher</div></div><button class="btn-sm btn-acc2" onclick="startFlow('${r.id}')">Empezar</button></div><div class="row" style="margin-top:8px"><button class="btn2" style="flex:1" onclick="startWarmup('${r.id}')">🔥 Calentamiento</button>${hasLast?`<button class="btn2" style="flex:1" onclick="repeatLast('${r.id}')">↺ Repetir última</button><button class="btn2" style="flex:1" onclick="repeatProgress('${r.id}')">↺⬆ Repetir y subir</button>`:''}</div>`;}
  else el.innerHTML=`<p class="mini">Hoy (${td}) sin rutina. Descanso o empieza una manual:</p><div style="margin-top:8px">${DB.routines.map(x=>`<button class="btn-sm btn2" style="margin:2px" onclick="startFlow('${x.id}')">${x.name}</button>`).join('')}</div>`;
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
      let sug=showRpe?rpeSuggestion(ex.name):null;
      let sugTxt=sug?`<div class="prev" style="color:var(--gold)">🎯 Sugerencia: ${sug}</div>`:'';
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
  toast(np.length?`🏆 ¡RÉCORD en ${np[0]}! · Density ${rec.density}${volMsg}`:`💪 Guardado · Density ${rec.density}${volMsg}`);
}
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
  let head=`<div class="row" style="margin-bottom:12px"><button class="btn-sm ${DB.mode==='gym'?'btn-acc2':'btn2'}" style="flex:1" onclick="setMode('gym')">🏋️ Gym</button><button class="btn-sm ${isS?'btn-acc2':'btn2'}" style="flex:1" onclick="setMode('strong')">🪨 Strong</button><button class="btn-sm ${isT?'btn-acc2':'btn2'}" style="flex:1" onclick="setMode('travel')">✈️ Viaje</button></div>`;
  if(isT)head+=`<div class="note" style="margin-bottom:10px">Modo viaje: rutinas sin gimnasio con peso corporal, comba, bandas + barra y carrera. Ideal para vacaciones.</div>`;
  if(isS)head+=`<div class="note" style="margin-bottom:10px">Modo strongman adaptado a tu nivel: compuestos pesados primero, hipertrofia con tiempo bajo tensión (baja lento) y acarreos (farmer walk, zercher). Full-body, gran gasto y músculo funcional. Progresa 2,5 kg cuando cierres todas las series.</div>`;
  const list=DB.routines.map(r=>`<div class="ex-block"><div class="ex-head"><span class="nm">${r.name} <span class="split-tag">${r.day}</span></span><span><button class="btn-sm btn2" onclick="editRoutine('${r.id}')">✎</button> <button class="btn-sm btn2" onclick="changeDay('${r.id}')">📅</button> <button class="btn-sm btn2" onclick="startFlow('${r.id}')">▶</button></span></div>${r.blocks.map(b=>`<div class="mini" style="margin-top:4px"><b style="color:var(--acc)">${b.label.replace('Bloque','B').replace(' · ',': ')}</b> ${b.exercises.map(e=>e.name+(SUBS[e.name]?` <span style="color:var(--acc2);cursor:pointer" onclick="showSubs('${e.name.replace(/'/g,"")}')">⇄</span>`:'')).join(' · ')}</div>`).join('')}</div>`).join('');
  const box=`<div class="ex-block" style="border-color:var(--gold);margin-top:6px"><div class="ex-head"><span class="nm">🥊 BOXEO TÉCNICA <span class="split-tag" style="color:var(--gold)">guiado</span></span><button class="btn-sm btn-gold" onclick="startBoxSession()">▶ Empezar</button></div><div class="mini" style="margin-top:4px">5 rounds de 3 min con descanso de 1 min. Sombra, drills 1-2, combate imaginario y ráfagas, con vídeo y campana en cada round. Como tener un entrenador.</div></div>`;
  const reset=`<button class="btn2" style="margin-top:10px;width:100%;font-size:12px" onclick="resetRoutines()">🔄 Restaurar rutinas base de este modo</button><p class="mini" style="margin-top:4px;text-align:center">No borra tu historial de sesiones, solo repone las rutinas por defecto (útil si el orden se descuadró).</p>`;
  el.innerHTML=head+list+box+reset;
}
function resetRoutines(){
  if(!confirm('¿Reponer las rutinas base de este modo? Tu historial de entrenos NO se toca, solo se regeneran las plantillas de rutina.'))return;
  if(DB.mode==='travel')DB.routines=travelRoutines();
  else if(DB.mode==='strong'){DB.routines=strongRoutines();DB.strongRoutinesSaved=DB.routines;}
  else{DB.routines=buildRoutines(DB.cycle.rotIndex||0);DB.gymRoutinesSaved=DB.routines;}
  save();renderRoutines();renderTodayReady();toast('🔄 Rutinas base restauradas');
}
function setMode(m){if(DB.mode==='strong')DB.strongRoutinesSaved=DB.routines;if(DB.mode===m){renderRoutines();return;}
  // guardar las rutinas actuales en su cajón antes de cambiar
  if(DB.mode==='travel')DB.travelRoutinesSaved=DB.routines;else DB.gymRoutinesSaved=DB.routines;
  DB.mode=m;
  if(m==='travel')DB.routines=DB.travelRoutinesSaved&&DB.travelRoutinesSaved.length?DB.travelRoutinesSaved:travelRoutines();
  else if(m==='strong')DB.routines=DB.strongRoutinesSaved&&DB.strongRoutinesSaved.length?DB.strongRoutinesSaved:strongRoutines();
  else DB.routines=DB.gymRoutinesSaved&&DB.gymRoutinesSaved.length?DB.gymRoutinesSaved:buildRoutines(DB.cycle.rotIndex||0);
  save();renderRoutines();renderTodayReady();renderDashboard();toast(m==='travel'?'✈️ Modo viaje activado':m==='strong'?'🪨 Modo strongman activado':'🏋️ Modo gym activado');}
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
  // carga: cuántas actividades intensas en los últimos 3 días
  let load=0;for(let i=0;i<3;i++){const dd=new Date();dd.setDate(dd.getDate()-i);const ds=dd.toISOString().slice(0,10);if(DB.sessions.some(s=>s.date===ds))load+=2;const e=DB.extraLog[ds]||{};if(e.box)load+=1.5;if(e.run)load+=1.5;}
  // sesión dura hoy/ayer baja recovery
  const c=DB.checkins[d]||{};
  let score=100;
  score-=Math.min(40,load*7); // a más carga acumulada, menos recovery
  if(c.sleep)score+=(c.sleep-2.5)*8; // dormir bien suma
  if(c.stress)score-=(c.stress-2)*8; // estrés resta
  if(c.energy)score+=(c.energy-2.5)*6;
  // sensación de la última sesión
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
  larga:{ic:'🛣️',lbl:'Tirada larga',desc:'La sesión más larga de la semana a ritmo cómodo. Construye resistencia.',color:'var(--viol)',fatigue:4}
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
  let html=`<div class="stat-grid c2"><div class="stat"><div class="v acc2">${r.target}</div><div class="l">objetivo</div></div><div class="stat"><div class="v acc">${totalKm.toFixed(1)}</div><div class="l">km planificados</div></div></div>`;
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
  el.innerHTML=`<div class="card" style="border-color:var(--acc);background:linear-gradient(135deg,rgba(255,64,21,.08),transparent)">
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <div><div class="mini" style="text-transform:capitalize">${new Date().toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'})}</div><div style="font-family:Anton;font-size:22px;margin-top:2px">${ic} ${plan}</div></div>
      <div style="text-align:center"><div style="font-family:Anton;font-size:32px;color:${rcA.col}">${rc}</div><div class="mini">recovery</div></div>
    </div>
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
  <div class="ex-block"><b style="font-family:Anton">💾 Respaldo de datos</b><p class="mini" style="margin:6px 0 10px">Guarda una copia de todo (entrenos, medidas, fotos, hábitos). Impórtala si cambias de móvil o limpias el navegador.</p><div class="row"><button class="btn-acc2" style="flex:1" onclick="exportData()">⬇ Exportar</button><button class="btn2" style="flex:1" onclick="document.getElementById('importFile').click()">⬆ Importar</button></div></div>
  <div class="ex-block"><b style="font-family:Anton">🔤 Tamaño de letra</b><div class="row" style="margin-top:8px"><button class="btn2" onclick="setFont(0.9)">A−</button><button class="btn2" onclick="setFont(1)">A</button><button class="btn2" onclick="setFont(1.15)">A+</button><button class="btn2" onclick="setFont(1.3)">A++</button></div><p class="mini" style="margin-top:6px">Actual: ${Math.round(fs*100)}%</p></div>
  <div class="ex-block"><b style="font-family:Anton">🧮 Calculadora de discos</b><p class="mini" style="margin:6px 0 8px">Qué discos poner por lado para un peso objetivo.</p><button class="btn2" onclick="openPlates()">Abrir calculadora</button></div>
  <div class="ex-block"><b style="font-family:Anton">⏱️ Cronómetro de intervalos</b><p class="mini" style="margin:6px 0 8px">Para carrera y cardio: trabajo/descanso × rondas (HIIT, sprints).</p><button class="btn2" onclick="openIntervals()">Abrir cronómetro</button></div>
  <div class="ex-block"><b style="font-family:Anton">🐢 Tiempo bajo tensión (TUT)</b><p class="mini" style="margin:6px 0 8px">Cuenta los segundos de una serie. El rango óptimo para hipertrofia es 40-70s. Útil en el modo Strongman.</p><button class="btn2" onclick="openTUT()">Abrir contador TUT</button></div>
  <div class="ex-block"><b style="font-family:Anton">📱 Pantalla activa</b><p class="mini" style="margin:6px 0 8px">Evita que el móvil se apague durante la sesión.</p><label style="display:flex;align-items:center;gap:8px;text-transform:none;font-size:14px"><input type="checkbox" id="wlChk" ${DB.settings&&DB.settings.wakeLock?'checked':''} onchange="toggleWakeSetting(this.checked)" style="width:20px;height:20px"> Mantener pantalla encendida</label></div>
  <div class="ex-block"><b style="font-family:Anton">🗣️ Avisos de voz</b><p class="mini" style="margin:6px 0 8px">Voz en tabata, EMOM y protocolos ("trabajo", "descanso", "última ronda").</p><label style="display:flex;align-items:center;gap:8px;text-transform:none;font-size:14px"><input type="checkbox" id="vcChk" ${!DB.settings||DB.settings.voice!==false?'checked':''} onchange="toggleVoice(this.checked)" style="width:20px;height:20px"> Voz activada</label></div>
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
