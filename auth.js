const DEMO_RECIPES=[
  {id:1,emoji:'🍋',name:'Lemon Herb Roast Chicken',cuisine:'Mediterranean',difficulty:'Easy',prepTime:'15 min',cookTime:'45 min',servings:4,description:'Fragrant golden roast chicken with bright lemon and fresh herbs.',nutrition:{calories:420,protein:38,carbs:12,fat:24},ingredients:[{amount:'1.5 kg',item:'whole chicken'},{amount:'4 cloves',item:'garlic'},{amount:'2',item:'lemons'},{amount:'2 tbsp',item:'olive oil'},{amount:'1 tsp',item:'rosemary'},{amount:'500g',item:'potatoes'}],steps:[{title:'Preheat & prep',instruction:'Preheat oven to 200°C. Pat chicken dry and place in a roasting tin with halved potatoes.'},{title:'Season',instruction:'Rub chicken with olive oil, lemon zest, minced garlic, rosemary, salt and pepper.'},{title:'Roast',instruction:'Roast for 45 minutes until juices run clear and skin is golden brown.'},{title:'Rest & serve',instruction:'Let rest 10 minutes before carving. Serve with potatoes and pan juices.'}],tips:['Dry-brine the night before for crispier skin.','Add white wine to the roasting tin for extra depth.']},
  {id:2,emoji:'🥑',name:'Avocado Grain Bowl',cuisine:'Mediterranean',difficulty:'Easy',prepTime:'10 min',cookTime:'20 min',servings:2,description:'Nutritious quinoa bowl with creamy avocado, crispy chickpeas, and bright lemon dressing.',nutrition:{calories:380,protein:14,carbs:42,fat:18},ingredients:[{amount:'1 cup',item:'quinoa'},{amount:'1',item:'avocado'},{amount:'1 can',item:'chickpeas'},{amount:'2 cups',item:'spinach'},{amount:'1',item:'cucumber'},{amount:'2 tbsp',item:'lemon juice'}],steps:[{title:'Cook quinoa',instruction:'Rinse quinoa and cook in 2 cups water for 15 minutes until fluffy.'},{title:'Crisp chickpeas',instruction:'Drain and dry chickpeas, toss in olive oil and salt, pan-fry 8 minutes.'},{title:'Assemble',instruction:'Layer quinoa, spinach, sliced avocado, chickpeas, and cucumber in bowls.'},{title:'Dress',instruction:'Drizzle with lemon juice and olive oil. Season to taste.'}],tips:['Add a soft-boiled egg for extra protein.','Roast chickpeas at 200°C for 25 min for max crunch.']},
  {id:3,emoji:'🍝',name:'Garlic Pasta al Limone',cuisine:'Italian',difficulty:'Easy',prepTime:'10 min',cookTime:'15 min',servings:2,description:'Simple, bright pasta with garlic, lemon, and parmesan — weeknight perfection.',nutrition:{calories:510,protein:16,carbs:72,fat:18},ingredients:[{amount:'250g',item:'spaghetti'},{amount:'4 cloves',item:'garlic'},{amount:'1',item:'lemon'},{amount:'50g',item:'parmesan'},{amount:'3 tbsp',item:'olive oil'},{amount:'handful',item:'fresh basil'}],steps:[{title:'Boil pasta',instruction:'Cook spaghetti in heavily salted boiling water until al dente.'},{title:'Make sauce',instruction:'Sauté sliced garlic in olive oil 2 minutes. Add lemon zest and juice.'},{title:'Combine',instruction:'Toss pasta with sauce and pasta water, adding parmesan until creamy.'},{title:'Serve',instruction:'Plate with fresh basil and extra parmesan.'}],tips:['Salt your pasta water generously.','Use starchy pasta water to emulsify the sauce.']},
  {id:4,emoji:'🍗',name:'Rosemary Roast Chicken',cuisine:'French',difficulty:'Medium',prepTime:'15 min',cookTime:'45 min',servings:4,description:'Classic French-style roast chicken with aromatic rosemary and crispy skin.',nutrition:{calories:390,protein:42,carbs:5,fat:22},ingredients:[{amount:'1.2 kg',item:'chicken thighs'},{amount:'4 sprigs',item:'fresh rosemary'},{amount:'5 cloves',item:'garlic'},{amount:'2 tbsp',item:'butter'},{amount:'1',item:'lemon'},{amount:'1 tsp',item:'thyme'}],steps:[{title:'Marinate',instruction:'Mix butter, garlic, rosemary, thyme, lemon zest. Rub under and over chicken skin.'},{title:'Rest',instruction:'Let marinated chicken sit at room temperature for 20 minutes.'},{title:'Roast',instruction:'Roast at 200°C for 40-45 minutes, basting every 15 minutes.'},{title:'Rest & serve',instruction:'Rest 5 minutes then serve with pan drippings as jus.'}],tips:['Basting is key for juicy results.','Finish under broiler 2 min for extra crispy skin.']},
  {id:5,emoji:'🍜',name:'Ginger Sesame Stir Fry',cuisine:'Asian',difficulty:'Easy',prepTime:'10 min',cookTime:'15 min',servings:3,description:'Quick and vibrant stir fry with ginger, sesame, and crisp vegetables over fluffy rice.',nutrition:{calories:320,protein:12,carbs:48,fat:10},ingredients:[{amount:'2 cups',item:'jasmine rice'},{amount:'2 cups',item:'broccoli florets'},{amount:'2',item:'carrots, julienned'},{amount:'3 tbsp',item:'soy sauce'},{amount:'1 tbsp',item:'sesame oil'},{amount:'2 tsp',item:'fresh ginger'}],steps:[{title:'Cook rice',instruction:'Cook rice according to package directions. Keep warm.'},{title:'Prep veg',instruction:'Chop all vegetables into similar sizes for even cooking.'},{title:'Stir fry',instruction:'Heat wok on high, add oil, stir fry vegetables 5-6 minutes crisp-tender.'},{title:'Sauce & serve',instruction:'Add soy sauce, ginger, sesame oil. Toss to coat. Serve over rice.'}],tips:['High heat is the secret — get the wok smoking hot.','A splash of rice wine adds great depth.']},
];

const users = {};
let session = null;
let state = { history:[], favorites:[], prefs:{diet:[],cuisines:[]}, stepsCompleted:0, currentRecipe:null, currentServings:2, baseServings:2, stepsState:[], activity:[], nextId:100 };

function showAuthMsg(type,msg){
  const el=document.getElementById('authMsg');
  el.textContent=msg; el.className='auth-msg '+type; el.style.display='block';
  if(type==='err') setTimeout(()=>el.style.display='none',3500);
}

function switchTab(t){
  document.getElementById('loginForm').style.display=t==='login'?'block':'none';
  document.getElementById('signupForm').style.display=t==='signup'?'block':'none';
  document.getElementById('tabLogin').classList.toggle('active',t==='login');
  document.getElementById('tabSignup').classList.toggle('active',t==='signup');
  document.getElementById('authMsg').style.display='none';
  ['loginEmail','loginPassword','signupName','signupEmail','signupPassword','signupConfirm'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.classList.remove('err');
  });
}

function markErr(id){ const el=document.getElementById(id); if(el) el.classList.add('err'); }

function handleLogin(){
  const email=document.getElementById('loginEmail').value.trim().toLowerCase();
  const pass=document.getElementById('loginPassword').value;
  if(!email){ markErr('loginEmail'); return showAuthMsg('err','Email is required.'); }
  if(!pass){ markErr('loginPassword'); return showAuthMsg('err','Password is required.'); }
  if(!users[email]){ markErr('loginEmail'); return showAuthMsg('err','No account found with that email.'); }
  if(users[email].password !== btoa(pass)){ markErr('loginPassword'); return showAuthMsg('err','Incorrect password.'); }
  const u=users[email];
  state=JSON.parse(JSON.stringify(u.state));
  enterApp(u.name, email, false);
}

function handleSignup(){
  const name=document.getElementById('signupName').value.trim();
  const email=document.getElementById('signupEmail').value.trim().toLowerCase();
  const pass=document.getElementById('signupPassword').value;
  const confirm=document.getElementById('signupConfirm').value;
  if(!name){ markErr('signupName'); return showAuthMsg('err','Display name is required.'); }
  if(!email){ markErr('signupEmail'); return showAuthMsg('err','Email is required.'); }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ markErr('signupEmail'); return showAuthMsg('err','Enter a valid email address.'); }
  if(!pass||pass.length<6){ markErr('signupPassword'); return showAuthMsg('err','Password must be at least 6 characters.'); }
  if(pass!==confirm){ markErr('signupConfirm'); return showAuthMsg('err','Passwords do not match.'); }
  if(users[email]){ markErr('signupEmail'); return showAuthMsg('err','An account already exists with that email.'); }
  users[email]={ name, password:btoa(pass), state:{ history:[], favorites:[], prefs:{diet:[],cuisines:[]}, stepsCompleted:0, currentRecipe:null, currentServings:2, baseServings:2, stepsState:[], activity:['Account created'], nextId:100 }};
  state=JSON.parse(JSON.stringify(users[email].state));
  showAuthMsg('ok','Welcome, '+name+'! Signing you in...');
  setTimeout(()=>enterApp(name,email,false),900);
}

function enterApp(name,email,isGuest){
  session={name,email,isGuest};
  document.getElementById('authPage').style.display='none';
  document.getElementById('appPage').style.display='block';
  document.getElementById('sidebarUser').textContent=name+(isGuest?' (Guest)':'');
  document.getElementById('profileAvatar').textContent=name.charAt(0).toUpperCase();
  document.getElementById('profileNameEl').textContent=name;
  document.getElementById('profileEmailEl').textContent=isGuest?'Guest session':email;
  applyPrefs(state.prefs);
  updateBadges();
  document.getElementById('output').innerHTML='<div class="empty">🍽️<br/>Enter ingredients above<br/>and hit Generate Recipe</div>';
  document.getElementById('regenBtn').style.display='none';
  navTo('generate',document.querySelector('.nav-item'));
}

function handleLogout(){
  if(session && !session.isGuest && users[session.email]){
    users[session.email].state=JSON.parse(JSON.stringify(state));
  }
  session=null;
  state={history:[],favorites:[],prefs:{diet:[],cuisines:[]},stepsCompleted:0,currentRecipe:null,currentServings:2,baseServings:2,stepsState:[],activity:[],nextId:100};
  document.getElementById('appPage').style.display='none';
  document.getElementById('authPage').style.display='block';
  document.getElementById('authMsg').style.display='none';
  document.getElementById('loginEmail').value='';
  document.getElementById('loginPassword').value='';
  switchTab('login');
  showToast('Signed out successfully');
}

function applyPrefs(prefs){
  document.querySelectorAll('#dietChips .pref-chip').forEach(c=>c.classList.toggle('active',!!prefs.diet?.includes(c.textContent)));
  document.querySelectorAll('#cuisineChips .pref-chip').forEach(c=>c.classList.toggle('active',!!prefs.cuisines?.includes(c.textContent)));
}

function savePrefs(){
  state.prefs.diet=[...document.querySelectorAll('#dietChips .pref-chip.active')].map(c=>c.textContent);
  state.prefs.cuisines=[...document.querySelectorAll('#cuisineChips .pref-chip.active')].map(c=>c.textContent);
  if(session&&!session.isGuest&&users[session.email]) users[session.email].state.prefs=JSON.parse(JSON.stringify(state.prefs));
  state.activity.unshift('Updated preferences');
  showToast('✅ Preferences saved!');
}

function clearAllData(){
  if(!confirm('Clear all recipes, favorites, and history?')) return;
  state.history=[];state.favorites=[];state.activity=[];state.stepsCompleted=0;state.currentRecipe=null;
  document.getElementById('output').innerHTML='<div class="empty">🍽️<br/>Enter ingredients above<br/>and hit Generate Recipe</div>';
  document.getElementById('regenBtn').style.display='none';
  updateBadges();
  navTo('generate',document.querySelector('.nav-item'));
  showToast('All data cleared','danger');
}

function showToast(msg,type='ok'){
  const t=document.getElementById('toastEl');
  t.textContent=msg; t.className=type==='danger'?'toast danger':'toast'; t.style.display='block';
  setTimeout(()=>t.style.display='none',2400);
}

function updateBadges(){
  document.getElementById('favCount').textContent=state.favorites.length;
  document.getElementById('histCount').textContent=state.history.length;
}

function navTo(pageId,btn){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const pg=document.getElementById('page-'+pageId);
  if(pg) pg.classList.add('active');
  if(btn) btn.classList.add('active');
  if(pageId==='favorites') renderFavorites();
  if(pageId==='history') renderHistory();
  if(pageId==='stats') renderStats();
  if(pageId==='profile'){renderProfile();}
}

function renderProfile(){
  applyPrefs(state.prefs);
}

function fillIng(val){ document.getElementById('ingredients').value=val; }

function toggleStep(i){
  state.stepsState[i]=!state.stepsState[i];
  if(state.stepsState[i]) state.stepsCompleted++; else state.stepsCompleted=Math.max(0,state.stepsCompleted-1);
  const el=document.getElementById('step-'+i),num=document.getElementById('snum-'+i);
  if(!el) return;
  el.classList.toggle('done',state.stepsState[i]);
  num.textContent=state.stepsState[i]?'✓':i+1;
}

function scaleAmt(a,ratio){ const n=parseFloat(a); if(isNaN(n)) return a; const s=n*ratio; return s%1===0?s:parseFloat(s.toFixed(1)); }

function updateServings(){
  if(!state.currentRecipe) return;
  const ratio=state.currentServings/state.baseServings;
  document.getElementById('srvCount').textContent=state.currentServings;
  state.currentRecipe.ingredients.forEach((ing,i)=>{ const el=document.getElementById('ing-'+i); if(el) el.innerHTML=`<strong>${scaleAmt(ing.amount,ratio)}</strong> ${ing.item}`; });
  const n=state.currentRecipe.nutrition;
  if(n){
    document.getElementById('nutr-cal').textContent=Math.round(n.calories*ratio);
    document.getElementById('nutr-prot').textContent=Math.round(n.protein*ratio)+'g';
    document.getElementById('nutr-carb').textContent=Math.round(n.carbs*ratio)+'g';
    document.getElementById('nutr-fat').textContent=Math.round(n.fat*ratio)+'g';
  }
}

function toggleFav(){
  if(!state.currentRecipe) return;
  const r=state.currentRecipe;
  const idx=state.favorites.findIndex(f=>f.name===r.name);
  const btn=document.getElementById('favBtn');
  if(idx>=0){ state.favorites.splice(idx,1); btn.classList.remove('saved'); btn.textContent='☆ Save'; showToast('Removed from favorites'); }
  else { state.favorites.push(JSON.parse(JSON.stringify(r))); state.activity.unshift('Favorited: '+r.name); btn.classList.add('saved'); btn.textContent='★ Saved!'; showToast('⭐ Saved to favorites!'); }
  updateBadges();
}

function doGenerate(){
  const ing=document.getElementById('ingredients').value.trim();
  if(!ing){ showToast('Please enter some ingredients!','danger'); return; }
  const btn=document.getElementById('generateBtn');
  btn.disabled=true; btn.textContent='✨ Generating...';
  document.getElementById('regenBtn').style.display='none';
  document.getElementById('output').innerHTML=`<div>
    <div style="background:#1a2e1a;border:1px solid #2a4a2a;border-radius:10px;padding:1.4rem;margin-bottom:.8rem">
      <div style="display:flex;align-items:center;gap:.8rem;margin-bottom:.9rem">
        <div class="skel" style="width:44px;height:44px;border-radius:9px;flex-shrink:0"></div>
        <div style="flex:1"><div class="skel" style="height:19px;width:50%;margin-bottom:6px"></div><div class="skel" style="height:11px;width:28%"></div></div>
      </div>
      <div class="skel" style="height:11px;width:80%;margin-bottom:5px"></div>
      <div class="skel" style="height:11px;width:58%;margin-bottom:13px"></div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">
        <div class="skel" style="height:52px"></div><div class="skel" style="height:52px"></div>
        <div class="skel" style="height:52px"></div><div class="skel" style="height:52px"></div>
      </div>
    </div>
    <p class="skel-pulse">🤖 Claude is crafting your recipe...</p>
  </div>`;
  setTimeout(()=>{
    const r=JSON.parse(JSON.stringify(DEMO_RECIPES[Math.floor(Math.random()*DEMO_RECIPES.length)]));
    r.id=state.nextId++;
    state.currentRecipe=r; state.currentServings=r.servings||2; state.baseServings=r.servings||2;
    state.stepsState=new Array((r.steps||[]).length).fill(false);
    state.history.unshift(r); state.activity.unshift('Generated: '+r.name);
    updateBadges(); btn.disabled=false; btn.textContent='✨ Generate Recipe';
    renderRecipe(r);
    document.getElementById('regenBtn').style.display='block';
  },1700);
}

function renderRecipe(r){
  const isFav=state.favorites.some(f=>f.name===r.name);
  const nutr=r.nutrition?`<div class="nutrition-row">
    <div class="nutr-card" style="border:1px solid #fbbf2430"><div class="nutr-val" style="color:#fbbf24" id="nutr-cal">${r.nutrition.calories}</div><div class="nutr-unit">kcal</div><div class="nutr-lbl">Calories</div></div>
    <div class="nutr-card" style="border:1px solid #4ade8030"><div class="nutr-val" style="color:#4ade80" id="nutr-prot">${r.nutrition.protein}g</div><div class="nutr-unit">protein</div><div class="nutr-lbl">Protein</div></div>
    <div class="nutr-card" style="border:1px solid #22d3ee30"><div class="nutr-val" style="color:#22d3ee" id="nutr-carb">${r.nutrition.carbs}g</div><div class="nutr-unit">carbs</div><div class="nutr-lbl">Carbs</div></div>
    <div class="nutr-card" style="border:1px solid #f472b630"><div class="nutr-val" style="color:#f472b6" id="nutr-fat">${r.nutrition.fat}g</div><div class="nutr-unit">fat</div><div class="nutr-lbl">Fat</div></div>
  </div>`:'';
  const ings=(r.ingredients||[]).map((g,i)=>`<div class="ing-chip" id="ing-${i}"><strong>${g.amount}</strong> ${g.item}</div>`).join('');
  const steps=(r.steps||[]).map((s,i)=>`<div class="step" id="step-${i}" onclick="toggleStep(${i})"><div class="step-num" id="snum-${i}">${i+1}</div><div>${s.title?`<div class="step-title">${s.title}</div>`:''}<div class="step-text">${s.instruction}</div></div></div>`).join('');
  const tips=r.tips&&r.tips.length?`<div class="section section-tips"><div class="section-title">💡 Chef's Tips</div><div class="tips-list">${r.tips.map(t=>`<div class="tip-row"><span class="tip-arrow">→</span><span class="tip-text">${t}</span></div>`).join('')}</div></div>`:'';
  document.getElementById('output').innerHTML=`<div class="recipe">
    <div class="recipe-header">
      <div class="recipe-title-row">
        <div class="recipe-emoji">${r.emoji||'🍽️'}</div>
        <div style="flex:1"><div class="recipe-name">${r.name}</div>
          <div class="badges">${r.cuisine?`<span class="badge badge-cyan">${r.cuisine}</span>`:''} ${r.difficulty?`<span class="badge badge-yellow">${r.difficulty}</span>`:''}</div>
        </div>
        <button class="fav-btn ${isFav?'saved':''}" id="favBtn" onclick="toggleFav()">${isFav?'★ Saved!':'☆ Save'}</button>
      </div>
      <p class="recipe-desc">${r.description}</p>
      <div class="meta-row">
        <div class="meta-chip">⏱ <strong>Prep:</strong> ${r.prepTime}</div>
        <div class="meta-chip">🔥 <strong>Cook:</strong> ${r.cookTime}</div>
        <div class="srvcol" style="margin-left:auto">
          <span style="font-size:.68rem;color:#22d3ee;font-family:monospace">🍽 Servings:</span>
          <button class="adj-btn" onclick="state.currentServings=Math.max(1,state.currentServings-1);updateServings()">−</button>
          <span style="color:#4ade80;font-weight:700;font-family:monospace;min-width:16px;text-align:center" id="srvCount">${r.servings||2}</span>
          <button class="adj-btn" onclick="state.currentServings++;updateServings()">+</button>
        </div>
      </div>
    </div>
    ${nutr}
    <div class="section"><div class="section-title">🧺 Ingredients</div><div class="ing-grid">${ings}</div></div>
    <div class="section"><div class="section-title">📋 Instructions</div><div class="steps-list">${steps}</div></div>
    ${tips}
  </div>`;
}

function miniCard(r,type){
  return `<div class="recipe-card" onclick="loadCard(${r.id},'${type}')">
    <div class="rc-emoji">${r.emoji||'🍽️'}</div>
    <div class="rc-name">${r.name}</div>
    <div class="rc-meta">${r.prepTime||'?'} prep · ${r.cookTime||'?'} cook</div>
    <div class="badges">${r.cuisine?`<span class="badge badge-cyan" style="font-size:.6rem">${r.cuisine}</span>`:''} ${r.difficulty?`<span class="badge badge-yellow" style="font-size:.6rem">${r.difficulty}</span>`:''}</div>
    <button class="rc-del" onclick="event.stopPropagation();${type==='fav'?`removeFav(${r.id})`:`removeHist(${r.id})`}">✕ Remove</button>
  </div>`;
}

function renderFavorites(){
  const el=document.getElementById('favList');
  if(!state.favorites.length){ el.innerHTML='<div class="empty-state">⭐<br/>No favorites yet<br/>Star a recipe to save it here</div>'; return; }
  el.innerHTML=`<div class="cards-grid">${state.favorites.map(r=>miniCard(r,'fav')).join('')}</div>`;
}

function renderHistory(){
  const el=document.getElementById('histList');
  if(!state.history.length){ el.innerHTML='<div class="empty-state">📜<br/>No history yet<br/>Generate your first recipe!</div>'; return; }
  el.innerHTML=`<div class="cards-grid">${state.history.map(r=>miniCard(r,'hist')).join('')}</div>`;
}

function loadCard(id,type){
  const list=type==='fav'?state.favorites:state.history;
  const r=list.find(x=>x.id===id); if(!r) return;
  state.currentRecipe=JSON.parse(JSON.stringify(r));
  state.currentServings=r.servings||2; state.baseServings=r.servings||2;
  state.stepsState=new Array((r.steps||[]).length).fill(false);
  navTo('generate',document.querySelector('.nav-item'));
  renderRecipe(state.currentRecipe);
  document.getElementById('regenBtn').style.display='none';
}

function removeFav(id){
  const idx=state.favorites.findIndex(f=>f.id===id); if(idx<0) return;
  const name=state.favorites[idx].name; state.favorites.splice(idx,1); updateBadges(); renderFavorites();
  showToast('Removed "'+name+'" from favorites');
  const btn=document.getElementById('favBtn');
  if(state.currentRecipe&&state.currentRecipe.name===name&&btn){ btn.classList.remove('saved'); btn.textContent='☆ Save'; }
}

function removeHist(id){
  const idx=state.history.findIndex(h=>h.id===id); if(idx<0) return;
  state.history.splice(idx,1); updateBadges(); renderHistory(); showToast('Removed from history');
}

function renderStats(){
  const cuisines={};
  state.history.forEach(r=>{ const c=r.cuisine||'Unknown'; cuisines[c]=(cuisines[c]||0)+1; });
  document.getElementById('statTotal').textContent=state.history.length;
  document.getElementById('statFavs').textContent=state.favorites.length;
  document.getElementById('statCuisines').textContent=Object.keys(cuisines).length;
  document.getElementById('statSteps').textContent=state.stepsCompleted;
  const sorted=Object.entries(cuisines).sort((a,b)=>b[1]-a[1]);
  const max=sorted[0]?.[1]||1;
  document.getElementById('cuisineStats').innerHTML=sorted.length
    ?sorted.map(([c,n])=>`<div class="cuisine-bar"><div class="cuisine-name-row"><span>${c}</span><span>${n}</span></div><div class="bar-track"><div class="bar-fill" style="width:${Math.round(n/max*100)}%"></div></div></div>`).join('')
    :'<div style="color:#4ade8028;font-size:.72rem;font-family:monospace">No data yet</div>';
  document.getElementById('activityLog').innerHTML=state.activity.length
    ?state.activity.slice(0,8).map(a=>`<div>→ ${a}</div>`).join('')
    :'No activity yet';
}