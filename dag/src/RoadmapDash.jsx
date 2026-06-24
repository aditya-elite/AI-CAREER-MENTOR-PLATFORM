import { useState, useCallback, useMemo } from "react";
import React from "react";

// ═══════════════════════════════════════════════════════════════════
//  DAG CORE ENGINE
//  Pure algorithmic layer — no UI dependencies.
//  Algorithms: Kahn's topological sort, DFS cycle detection,
//  CPM critical path (PERT), Coffman-Graham layer assignment,
//  ancestor/descendant traversal, subgraph extraction.
// ═══════════════════════════════════════════════════════════════════

const NODE_TYPE = {
  ROOT: "root", CONCEPT: "concept", SKILL: "skill",
  PROJECT: "project", MILESTONE: "milestone", GOAL: "goal",
};

const NODE_COLOR = {
  root: "#475569", concept: "#6366f1", skill: "#3b82f6",
  project: "#10b981", milestone: "#f59e0b", goal: "#ec4899",
};

// Full prerequisite adjacency: A → [B, C] means A must be learned before B and C
const PREREQS = {
  "Programming Basics":    ["Python","JavaScript","Java"],
  "Math Foundations":      ["Statistics","Linear Algebra"],
  "Statistics":            ["Machine Learning","Data Analysis","R"],
  "Linear Algebra":        ["Machine Learning","Deep Learning"],
  "Python":                ["Machine Learning","Data Analysis","FastAPI","Automation","Django"],
  "JavaScript":            ["React","Node.js","TypeScript","Vue.js"],
  "TypeScript":            ["React","Angular","Node.js"],
  "Java":                  ["Spring Boot"],
  "SQL":                   ["Database Design","Data Analysis","Data Warehousing"],
  "R":                     ["Statistical Modeling","Data Visualization"],
  "HTML":                  ["CSS","JavaScript"],
  "CSS":                   ["React","Vue.js"],
  "React":                 ["Next.js","Redux","GraphQL"],
  "Vue.js":                ["Nuxt.js"],
  "Node.js":               ["Express.js","REST APIs","GraphQL"],
  "Express.js":            ["REST APIs"],
  "Django":                ["REST APIs"],
  "FastAPI":               ["REST APIs"],
  "REST APIs":             ["API Security"],
  "Database Design":       ["PostgreSQL","MongoDB"],
  "PostgreSQL":            ["Database Optimization"],
  "MongoDB":               ["Database Optimization"],
  "Machine Learning":      ["Deep Learning","MLOps","Feature Engineering"],
  "Deep Learning":         ["Computer Vision","NLP"],
  "Feature Engineering":   ["Model Selection"],
  "Model Selection":       ["Production ML"],
  "NLP":                   ["LLMs","Transformers"],
  "Data Analysis":         ["Data Visualization","Business Intelligence"],
  "Data Visualization":    ["Tableau","Dashboard Design"],
  "Statistical Modeling":  ["Predictive Modeling"],
  "Linux":                 ["Shell Scripting","Docker","Server Admin"],
  "Shell Scripting":       ["Automation","CI/CD"],
  "Docker":                ["Kubernetes","Container Security"],
  "Kubernetes":            ["Helm","MLOps"],
  "AWS":                   ["Cloud Architecture","Serverless"],
  "Terraform":             ["Cloud Architecture","Infrastructure as Code"],
  "CI/CD":                 ["DevOps Practices","GitOps"],
  "MLOps":                 ["Production ML","Model Monitoring"],
  "Networking Basics":     ["Network Security","Cloud Security"],
  "Network Security":      ["Penetration Testing","SIEM"],
  "Cryptography":          ["TLS/SSL","Key Management"],
  "Penetration Testing":   ["Red Teaming"],
  "Risk Analysis":         ["Compliance","Threat Modeling"],
};

const CAREER_GOALS = {
  "data-scientist": {
    label:"Data Scientist", icon:"🧬", color:"#6366f1",
    required:["Python","Machine Learning","Statistics","SQL","Data Visualization","Deep Learning"],
    optional:["R","MLOps","Feature Engineering"],
    foundations:["Math Foundations","Programming Basics"],
  },
  "frontend-dev": {
    label:"Frontend Developer", icon:"🎨", color:"#f59e0b",
    required:["HTML","CSS","JavaScript","React","TypeScript"],
    optional:["Next.js","GraphQL","Redux"],
    foundations:["Programming Basics"],
  },
  "backend-dev": {
    label:"Backend Developer", icon:"⚙️", color:"#10b981",
    required:["Python","SQL","REST APIs","Database Design","Docker"],
    optional:["Node.js","AWS","MongoDB"],
    foundations:["Programming Basics"],
  },
  "ml-engineer": {
    label:"ML Engineer", icon:"🤖", color:"#ec4899",
    required:["Python","Machine Learning","Docker","MLOps","REST APIs"],
    optional:["Kubernetes","Deep Learning","Feature Engineering","AWS"],
    foundations:["Math Foundations","Programming Basics"],
  },
  "devops": {
    label:"DevOps Engineer", icon:"🔧", color:"#8b5cf6",
    required:["Linux","Docker","Kubernetes","CI/CD","AWS","Terraform"],
    optional:["Shell Scripting","GitOps"],
    foundations:["Linux","Networking Basics"],
  },
  "cybersecurity": {
    label:"Security Engineer", icon:"🔐", color:"#ef4444",
    required:["Network Security","Linux","Python","Cryptography","Risk Analysis"],
    optional:["Penetration Testing","SIEM","Cloud Security"],
    foundations:["Networking Basics","Linux"],
  },
  "data-analyst": {
    label:"Data Analyst", icon:"📊", color:"#3b82f6",
    required:["SQL","Excel","Python","Tableau","Statistics","Data Visualization"],
    optional:["Power BI","R","Statistical Modeling"],
    foundations:["Math Foundations","Programming Basics"],
  },
  "product-manager": {
    label:"Product Manager", icon:"🗺️", color:"#f97316",
    required:["Agile","User Research","Data Analysis","SQL","Communication","Roadmapping"],
    optional:["A/B Testing","Excel","REST APIs"],
    foundations:["Math Foundations","Programming Basics"],
  },
};

// ─────────────────────────────────────────────────────────────────
//  DAG CLASS  — pure data structure
// ─────────────────────────────────────────────────────────────────
class DAG {
  constructor() {
    this.nodes = new Map();  // id → {id, label, type, weight, meta}
    this.adj   = new Map();  // adjacency: id → Set<id>  (A→B: A before B)
    this.inDeg = new Map();  // id → int
  }

  addNode(id, label, type=NODE_TYPE.SKILL, weight=20, meta={}) {
    if (!this.nodes.has(id)) {
      this.nodes.set(id, {id, label, type, weight, meta});
      this.adj.set(id, new Set());
      this.inDeg.set(id, 0);
    }
    return this;
  }

  addEdge(from, to) {
    if (!this.nodes.has(from) || !this.nodes.has(to) || from===to) return this;
    if (!this.adj.get(from).has(to)) {
      this.adj.get(from).add(to);
      this.inDeg.set(to, (this.inDeg.get(to)||0) + 1);
    }
    return this;
  }

  // ── Kahn's topological sort ─────────────────────────────────
  // Returns {order, layers} where layers = Coffman-Graham level sets
  // Throws if cycle detected (remaining nodes > processed)
  topoSort() {
    const deg = new Map(this.inDeg);
    const queue = [...this.nodes.keys()].filter(id => deg.get(id)===0);
    const order=[], layers=[];
    while (queue.length) {
      const layer=[...queue]; queue.length=0; layers.push(layer);
      for (const u of layer) {
        order.push(u);
        for (const v of (this.adj.get(u)||[])) {
          deg.set(v, deg.get(v)-1);
          if (deg.get(v)===0) queue.push(v);
        }
      }
    }
    if (order.length !== this.nodes.size)
      throw new Error(`Cycle detected — ${this.nodes.size - order.length} node(s) unreachable`);
    return {order, layers};
  }

  // ── DFS cycle detection ─────────────────────────────────────
  // Colors: 0=white 1=gray(active) 2=black(done)
  // Returns first cycle path found, or null
  detectCycle() {
    const col = new Map([...this.nodes.keys()].map(k=>[k,0]));
    const par = new Map();
    let cycle = null;
    const dfs = u => {
      if (cycle) return;
      col.set(u,1);
      for (const v of (this.adj.get(u)||[])) {
        if (col.get(v)===1) {
          // reconstruct cycle
          const path=[v,u]; let cur=u;
          while (par.get(cur)!==v && par.has(cur)) { cur=par.get(cur); path.push(cur); }
          cycle=path.reverse(); return;
        }
        if (col.get(v)===0) { par.set(v,u); dfs(v); }
      }
      col.set(u,2);
    };
    for (const id of this.nodes.keys()) { if (col.get(id)===0) dfs(id); if (cycle) return cycle; }
    return null;
  }

  // ── CPM critical path ──────────────────────────────────────
  // Forward + backward pass over topological order
  // Float(v) = LS(v) - ES(v); critical iff float===0
  criticalPath() {
    const {order} = this.topoSort();
    const ES=new Map(), EF=new Map(), LS=new Map(), LF=new Map();

    // predecessors lookup
    const preds = new Map([...this.nodes.keys()].map(id=>[id,[]]));
    for (const [u, tos] of this.adj) for (const v of tos) preds.get(v).push(u);

    // Forward
    for (const u of order) {
      const es = preds.get(u).length ? Math.max(...preds.get(u).map(p=>EF.get(p)||0)) : 0;
      ES.set(u, es); EF.set(u, es + this.nodes.get(u).weight);
    }
    const D = Math.max(...[...EF.values()]);

    // Backward
    for (const u of [...order].reverse()) {
      const succs = [...(this.adj.get(u)||[])];
      LF.set(u, succs.length ? Math.min(...succs.map(v=>LS.get(v)||D)) : D);
      LS.set(u, LF.get(u) - this.nodes.get(u).weight);
    }

    const float = new Map();
    const criticalPath = [];
    for (const u of order) {
      const f = Math.round(LS.get(u) - ES.get(u));
      float.set(u, f);
      if (f===0) criticalPath.push(u);
    }
    return {ES, EF, LS, LF, float, criticalPath, projectDuration: D};
  }

  // ── Ancestor / Descendant traversal ───────────────────────
  ancestors(id) {
    const vis=new Set();
    const stack=[...this.nodes.keys()].filter(v=>this.adj.get(v)?.has(id));
    while (stack.length) {
      const u=stack.pop();
      if (!vis.has(u)) {
        vis.add(u);
        for (const v of this.nodes.keys()) if (this.adj.get(v)?.has(u)) stack.push(v);
      }
    }
    return vis;
  }

  descendants(id) {
    const vis=new Set();
    const stack=[...(this.adj.get(id)||[])];
    while (stack.length) {
      const u=stack.pop();
      if (!vis.has(u)) { vis.add(u); for (const v of (this.adj.get(u)||[])) stack.push(v); }
    }
    return vis;
  }

  get nodeCount() { return this.nodes.size; }
  get edgeCount() { let n=0; for (const s of this.adj.values()) n+=s.size; return n; }
}

// ─────────────────────────────────────────────────────────────────
//  ROADMAP BUILDER  — career goal + user skills → DAG
// ─────────────────────────────────────────────────────────────────

const nid = s => s.replace(/[^a-zA-Z0-9]/g,"_");

function estimateHours(skill) {
  const heavy = new Set(["Machine Learning","Deep Learning","Kubernetes","AWS","React","Docker","Python","TypeScript"]);
  const light  = new Set(["HTML","CSS","Linux","SQL","Git","Shell Scripting"]);
  return heavy.has(skill) ? 40 : light.has(skill) ? 10 : 20;
}

function buildRoadmapDAG(goalId, userSkills, goals = CAREER_GOALS) {
  const goal = goals[goalId];
  if (!goal) throw new Error("Unknown goal");
  const dag = new DAG();
  const haveSet = new Set(userSkills.map(s=>s.toLowerCase()));
  const have = s => haveSet.has(s.toLowerCase());

  // Collect all needed skills via BFS over prerequisite graph
  const mustKeep = new Set([...goal.required, ...goal.foundations]);
  let needed = new Set([...goal.required, ...goal.optional, ...goal.foundations]);
  // Add transitive prereqs that are prerequisites OF needed skills
  let changed=true;
  while (changed) {
    changed=false;
    for (const [pre, targets] of Object.entries(PREREQS)) {
      if (targets.some(t=>needed.has(t)) && !needed.has(pre)) {
        needed.add(pre); changed=true;
      }
    }
  }

  // Cap DAG size to prevent "page not responding" freezes.
  // Large DAGs + SVG edge rendering can block the main thread.
  const MAX_SKILLS = 80;
  if (needed.size > MAX_SKILLS) {
    const extras = [...needed].filter(s => !mustKeep.has(s));
    const scored = extras
      .map(s => ({
        s,
        score:
          (goal.required.includes(s) ? 3000 : goal.optional.includes(s) ? 2000 : 1000) +
          (estimateHours(s) || 0),
      }))
      .sort((a, b) => b.score - a.score);
    const remaining = Math.max(0, MAX_SKILLS - mustKeep.size);
    const trimmedExtras = scored.slice(0, remaining).map(x => x.s);
    needed = new Set([...mustKeep, ...trimmedExtras]);
  }

  // Add root + goal
  dag.addNode("__root__","You (start)", NODE_TYPE.ROOT, 0);
  dag.addNode(nid(goal.label), goal.label, NODE_TYPE.GOAL, 0, {icon:goal.icon, color:goal.color});

  // Add skill nodes
  for (const skill of needed) {
    const type = goal.foundations.includes(skill) ? NODE_TYPE.CONCEPT
               : goal.required.includes(skill)    ? NODE_TYPE.SKILL
               : NODE_TYPE.SKILL;
    dag.addNode(nid(skill), skill, type, have(skill)?0:estimateHours(skill), {
      alreadyHave: have(skill),
      isRequired:  goal.required.includes(skill),
      isOptional:  goal.optional.includes(skill),
      isFoundation:goal.foundations.includes(skill),
    });
  }

  // Add prerequisite edges
  for (const [pre, targets] of Object.entries(PREREQS)) {
    if (!needed.has(pre)) continue;
    for (const t of targets) {
      if (needed.has(t)) dag.addEdge(nid(pre), nid(t));
    }
  }

  // Wire foundations to root
  for (const f of goal.foundations) dag.addEdge("__root__", nid(f));
  // Wire orphan required skills to root
  for (const s of goal.required) {
    if (dag.inDeg.get(nid(s))===0) dag.addEdge("__root__", nid(s));
  }
  // Wire required skills to goal
  for (const s of goal.required) dag.addEdge(nid(s), nid(goal.label));

  return dag;
}

// ─────────────────────────────────────────────────────────────────
//  WEEK ASSIGNMENT  — topological layers → weekly schedule
//  15h/week budget; critical-path tasks scheduled first per layer
// ─────────────────────────────────────────────────────────────────

function assignWeeks(dag, userSkills) {
  let { layers } = dag.topoSort();
  let cpData;
  try { cpData = dag.criticalPath(); } catch { cpData = {criticalPath:[], projectDuration:0, float:new Map()}; }
  const critSet = new Set(cpData.criticalPath);
  const HOURS_PER_WEEK = 15;
  const haveSet = new Set(userSkills.map(s=>s.toLowerCase()));

  const weeks=[];
  let wk=1, whours=0, wtasks=[];

  const flush = () => {
    if (wtasks.length) { weeks.push({week:wk, tasks:wtasks, totalHours:whours}); wk++; whours=0; wtasks=[]; }
  };

  for (const layer of layers) {
    // Sort layer: critical-path first, then by weight desc
    const sorted = [...layer].sort((a,b)=>{
      if (critSet.has(a)!==critSet.has(b)) return critSet.has(a)?-1:1;
      return (dag.nodes.get(b)?.weight||0) - (dag.nodes.get(a)?.weight||0);
    });

    for (const id of sorted) {
      const node = dag.nodes.get(id);
      if (!node || node.type===NODE_TYPE.ROOT || node.type===NODE_TYPE.GOAL) continue;
      const haveSkill = node.meta?.alreadyHave || haveSet.has(node.label.toLowerCase());
      if (haveSkill) continue;

      if (whours + node.weight > HOURS_PER_WEEK && wtasks.length) flush();

      wtasks.push({
        id, label:node.label, type:node.type, hours:node.weight,
        isCritical: critSet.has(id),
        float: cpData.float.get(id)??0,
        isRequired: node.meta?.isRequired,
        isOptional: node.meta?.isOptional,
      });
      whours += node.weight;
    }
  }
  flush();

  // Insert milestone checkpoints every 3 skill-weeks
  const out=[];
  weeks.forEach((w,i)=>{
    out.push(w);
    if ((i+1)%3===0) out.push({
      week: w.week+0.5, isMilestone:true,
      label:`Review & project — weeks ${w.week-2}–${w.week}`,
      tasks:[], totalHours:5
    });
  });

  return {
    weeks: out,
    criticalPath: cpData.criticalPath,
    totalHours: weeks.reduce((a,w)=>a+w.totalHours,0),
    totalWeeks: wk-1,
  };
}

// ─────────────────────────────────────────────────────────────────
//  LAYOUT ENGINE  — Sugiyama-style layer placement
// ─────────────────────────────────────────────────────────────────

const LO = { nw:128, nh:36, xg:18, yg:62, padL:10, padT:36 };

function layoutDAG(dag) {
  let layers;
  try { ({layers} = dag.topoSort()); }
  catch(e) { return {positions:{}, layers:[], error:e.message}; }

  // Separate root, display layers, goal
  const ROOT_ID = "__root__";
  const goalId = [...dag.nodes.keys()].find(id=>dag.nodes.get(id)?.type===NODE_TYPE.GOAL);

  // Build display-only layers (exclude root/goal from middle layers)
  const midLayers = layers
    .map(l=>l.filter(id=>id!==ROOT_ID && id!==goalId && dag.nodes.get(id)?.type!==NODE_TYPE.ROOT && dag.nodes.get(id)?.type!==NODE_TYPE.GOAL))
    .filter(l=>l.length>0);

  const allLayers = [
    [ROOT_ID],
    ...midLayers,
    ...(goalId ? [[goalId]] : []),
  ].filter(l=>l.length>0 && l.some(id=>dag.nodes.has(id)));

  const W = 680;
  const positions = {};

  allLayers.forEach((layer,li)=>{
    const y = LO.padT + li*(LO.nh+LO.yg);
    const totalW = layer.length*LO.nw + (layer.length-1)*LO.xg;
    const startX = Math.max(LO.padL, (W-totalW)/2);
    layer.forEach((id,ni)=>{
      positions[id] = {x: startX + ni*(LO.nw+LO.xg), y, li};
    });
  });

  return {positions, layers:allLayers, error:null};
}

// ═══════════════════════════════════════════════════════════════════
//  UI PRIMITIVES
// ═══════════════════════════════════════════════════════════════════

const BG="#020617", SURF="#0f172a", SURF2="#1e293b", BOR="#334155",
      TEXT="#e2e8f0", MUT="#64748b", DIM="#475569";

const Pill = ({children, color="#6366f1", sm=true}) => (
  <span style={{
    display:"inline-flex", alignItems:"center", padding:sm?"2px 8px":"4px 12px",
    borderRadius:99, fontSize:sm?10:12, fontWeight:700, letterSpacing:".3px",
    background:color+"22", color, border:`1px solid ${color}44`,
  }}>{children}</span>
);

const Card = ({children, style={}, accent}) => (
  <div style={{background:SURF, border:`1px solid ${accent||BOR}`, borderRadius:14, padding:"1.25rem", ...style}}>
    {children}
  </div>
);

const PBar = ({value, max=100, color="#6366f1", h=6}) => (
  <div style={{background:SURF2, borderRadius:99, height:h, overflow:"hidden"}}>
    <div style={{width:`${Math.min(100,Math.round((value/max)*100))}%`, height:"100%",
      background:color, borderRadius:99, transition:"width .8s cubic-bezier(.4,0,.2,1)"}}/>
  </div>
);

// ─────────────────────────────────────────────────────────────────
//  SVG DAG CANVAS
// ─────────────────────────────────────────────────────────────────

function DAGCanvas({dag, layout, criticalPath, completed, userSkills, onNodeClick, selected}) {
  const critSet = new Set(criticalPath||[]);
  const doneSet = new Set([...completed]);
  const haveSet = new Set(userSkills.map(s=>s.toLowerCase()));
  const {positions} = layout;

  const maxY = Object.values(positions).reduce((m,p)=>Math.max(m,p.y),0);
  const svgH = maxY + LO.nh + 60;

  // Build edge list
  const edges=[];
  for (const [from, tos] of dag.adj) {
    for (const to of tos) {
      const fp=positions[from], tp=positions[to];
      if (!fp||!tp) continue;
      const x1=fp.x+LO.nw/2, y1=fp.y+LO.nh;
      const x2=tp.x+LO.nw/2, y2=tp.y;
      const isCrit = critSet.has(from)&&critSet.has(to);
      const isDone = doneSet.has(from)&&doneSet.has(to);
      edges.push({x1,y1,x2,y2,isCrit,isDone,from,to});
    }
  }

  const getStyle = (id,node) => {
    const haveSkill = node.meta?.alreadyHave||haveSet.has(node.label.toLowerCase());
    const isDone    = doneSet.has(id);
    const isSel     = id===selected;
    const isCrit    = critSet.has(id);
    if (haveSkill||isDone) return {fill:"#10b98122", stroke:"#10b981", tx:"#34d399"};
    if (isSel)  return {fill:NODE_COLOR[node.type]+"44", stroke:NODE_COLOR[node.type], tx:"#fff"};
    if (isCrit) return {fill:"#f59e0b1a", stroke:"#f59e0b", tx:"#fbbf24"};
    return {fill:NODE_COLOR[node.type]+"1a", stroke:NODE_COLOR[node.type]+"66", tx:NODE_COLOR[node.type]};
  };

  const trunc = (s,n=14) => s.length>n?s.slice(0,n-1)+"…":s;

  return (
    <div style={{overflowX:"auto"}}>
      <svg width="680" height={svgH} viewBox={`0 0 680 ${svgH}`}
        style={{display:"block", background:BG, borderRadius:12}}>
        <defs>
          <marker id="da" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </marker>
        </defs>

        {/* Edges */}
        {edges.map(({x1,y1,x2,y2,isCrit,isDone},i)=>{
          const my=(y1+y2)/2;
          const d=`M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`;
          const col = isDone?"#10b981":isCrit?"#f59e0b":DIM;
          return <path key={i} d={d} fill="none" stroke={col}
            strokeWidth={isCrit?2:1} strokeDasharray={isCrit?"none":"4 3"}
            opacity={isCrit?.9:.5} markerEnd="url(#da)"/>;
        })}

        {/* Nodes */}
        {[...dag.nodes.entries()].map(([id,node])=>{
          const pos=positions[id];
          if (!pos) return null;
          const st=getStyle(id,node);
          const haveSkill=node.meta?.alreadyHave||haveSet.has(node.label.toLowerCase());
          const isDone=doneSet.has(id);
          const isRootGoal=node.type===NODE_TYPE.ROOT||node.type===NODE_TYPE.GOAL;
          const cx=pos.x+LO.nw/2, cy=pos.y+LO.nh/2;
          return (
            <g key={id} onClick={()=>onNodeClick?.(id)} style={{cursor:"pointer"}}>
              <rect x={pos.x} y={pos.y} width={LO.nw} height={LO.nh}
                rx={isRootGoal?16:6} fill={st.fill} stroke={st.stroke}
                strokeWidth={id===selected?2:1}/>
              {(haveSkill||isDone)&&<>
                <circle cx={pos.x+LO.nw-9} cy={pos.y+9} r={7} fill="#10b981"/>
                <text x={pos.x+LO.nw-9} y={pos.y+9} textAnchor="middle" dominantBaseline="central"
                  fontSize={9} fill="#fff" fontWeight={700} fontFamily="system-ui,sans-serif">✓</text>
              </>}
              <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
                fontSize={isRootGoal?12:11} fontWeight={isRootGoal||id===selected?700:500}
                fill={st.tx} fontFamily="system-ui,sans-serif">
                {trunc(node.label, isRootGoal?18:14)}
              </text>
              {node.weight>0&&!haveSkill&&!isRootGoal&&(
                <text x={pos.x+5} y={pos.y+LO.nh-5} fontSize={8} fill={MUT}
                  fontFamily="monospace">{node.weight}h</text>
              )}
            </g>
          );
        })}

        {/* Legend */}
        {[{c:"#f59e0b",l:"Critical path",d:false},{c:DIM,l:"Dependency",d:true},{c:"#10b981",l:"Owned/done",d:false}]
          .map(({c,l,d},i)=>(
            <g key={i} transform={`translate(${10+i*155},${svgH-20})`}>
              <line x1={0} y1={7} x2={20} y2={7} stroke={c} strokeWidth={1.5} strokeDasharray={d?"4 3":"none"}/>
              <text x={25} y={11} fontSize={9} fill={MUT} fontFamily="system-ui,sans-serif">{l}</text>
            </g>
          ))}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  NODE INSPECTOR
// ─────────────────────────────────────────────────────────────────

function NodeInspector({dag, nodeId, critSet, completed, onToggle, userSkills}) {
  if (!nodeId||!dag.nodes.has(nodeId)) return null;
  const node = dag.nodes.get(nodeId);
  const preds= [...dag.nodes.keys()].filter(v=>dag.adj.get(v)?.has(nodeId));
  const nexts= [...(dag.adj.get(nodeId)||[])];
  const isDone = completed.has(nodeId);
  const haveSkill = node.meta?.alreadyHave||new Set(userSkills.map(s=>s.toLowerCase())).has(node.label.toLowerCase());
  const isCrit = critSet.has(nodeId);

  return (
    <Card accent={NODE_COLOR[node.type]+"66"} style={{marginTop:"1rem"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
        <div>
          <div style={{display:"flex", gap:8, alignItems:"center", marginBottom:4}}>
            <span style={{fontSize:15, fontWeight:700, color:NODE_COLOR[node.type]}}>{node.label}</span>
            <Pill color={NODE_COLOR[node.type]}>{node.type}</Pill>
            {isCrit&&<Pill color="#f59e0b">critical path</Pill>}
            {haveSkill&&<Pill color="#10b981">you have this</Pill>}
          </div>
          <div style={{fontSize:11, color:MUT}}>
            {node.weight}h estimated ·{" "}
            {isCrit?"Zero slack — any delay extends your roadmap":
              `Slack: ${node.meta?.float??0}h before it delays the plan`}
          </div>
        </div>
        {!haveSkill&&(
          <button onClick={()=>onToggle(nodeId)} style={{
            padding:"5px 12px", borderRadius:8, border:"none", cursor:"pointer",
            background:isDone?"#10b98133":"#6366f133",
            color:isDone?"#10b981":"#818cf8", fontWeight:700, fontSize:11,
          }}>{isDone?"✓ Done":"Mark done"}</button>
        )}
      </div>
      {(preds.length>0||nexts.length>0)&&(
        <div style={{marginTop:"0.75rem", display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
          {preds.length>0&&(
            <div>
              <div style={{fontSize:9, color:DIM, fontWeight:700, marginBottom:4}}>PREREQUISITES</div>
              <div style={{display:"flex", flexWrap:"wrap", gap:4}}>
                {preds.map(d=><Pill key={d} color={completed.has(d)?"#10b981":"#475569"}>{dag.nodes.get(d)?.label||d}</Pill>)}
              </div>
            </div>
          )}
          {nexts.length>0&&(
            <div>
              <div style={{fontSize:9, color:DIM, fontWeight:700, marginBottom:4}}>UNLOCKS</div>
              <div style={{display:"flex", flexWrap:"wrap", gap:4}}>
                {nexts.slice(0,6).map(d=><Pill key={d} color={NODE_COLOR[dag.nodes.get(d)?.type]||"#475569"}>{dag.nodes.get(d)?.label||d}</Pill>)}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────
//  WEEKLY SCHEDULE VIEW
// ─────────────────────────────────────────────────────────────────

function LevelPlanView({dag, critSet, completed, userSkills, certificates, onVerify, onUploadCertificate}) {
  let layers = [];
  try {
    ({ layers } = dag.topoSort());
  } catch {
    layers = [];
  }
  const haveSet = new Set((userSkills || []).map(s => String(s).toLowerCase()));
  const goalId = [...dag.nodes.keys()].find(id => dag.nodes.get(id)?.type === NODE_TYPE.GOAL);

  const levels = layers
    .map((layer, idx) => ({
      level: idx + 1,
      ids: layer
        .filter(id => id !== "__root__" && id !== goalId)
        .filter(id => {
          const n = dag.nodes.get(id);
          if (!n) return false;
          const haveSkill = n.meta?.alreadyHave || haveSet.has(n.label.toLowerCase());
          return !haveSkill; // only show learnable units
        })
    }))
    .filter(l => l.ids.length > 0);

  const isUnitDone = (id) => {
    const n = dag.nodes.get(id);
    if (!n) return false;
    return completed.has(id) || n.meta?.alreadyHave || haveSet.has(n.label.toLowerCase());
  };

  const levelUnlocked = (levelIndex) => {
    if (levelIndex === 0) return true;
    const prev = levels[levelIndex - 1];
    return prev.ids.every(isUnitDone);
  };

  const courseraSearchUrl = (q) => `https://www.coursera.org/search?query=${encodeURIComponent(q)}`;

  return (
    <div style={{ display: "grid", gap: "0.85rem" }}>
      {levels.map((lvl, li) => {
        const unlocked = levelUnlocked(li);
        const doneCount = lvl.ids.filter(isUnitDone).length;
        const pct = lvl.ids.length ? Math.round((doneCount / lvl.ids.length) * 100) : 0;

        return (
          <Card key={lvl.level} accent={unlocked ? "#6366f144" : "#334155"} style={{ opacity: unlocked ? 1 : 0.55 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: unlocked ? "#6366f122" : "#1e293b",
                  border: `1px solid ${unlocked ? "#6366f144" : "#334155"}`,
                  color: unlocked ? "#a5b4fc" : "#64748b",
                  fontWeight: 900, fontFamily: "monospace", fontSize: 12
                }}>
                  L{li + 1}
                </div>
                <div>
                  <div style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>
                    {unlocked ? "Active level" : "Locked level"}
                  </div>
                  <div style={{ color: MUT, fontSize: 11 }}>
                    {doneCount}/{lvl.ids.length} units verified
                  </div>
                </div>
              </div>
              <div style={{ minWidth: 120 }}>
                <PBar value={pct} color={pct === 100 ? "#10b981" : "#6366f1"} h={5} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
              {lvl.ids.map((id) => {
                const n = dag.nodes.get(id);
                if (!n) return null;
                const done = isUnitDone(id);
                const isCrit = critSet.has(id);
                const courseraUrl = courseraSearchUrl(n.label);
                const hasCertificate = certificates.has(id);
                return (
                  <div key={id} style={{
                    padding: 10,
                    borderRadius: 12,
                    background: done ? "#10b9810f" : unlocked ? SURF2 : "#0b1220",
                    border: `1px solid ${done ? "#10b98133" : isCrit ? "#f59e0b33" : BOR}`,
                    display: "grid",
                    gap: 8
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{
                          color: done ? "#34d399" : TEXT,
                          fontWeight: 900,
                          fontSize: 12,
                          lineHeight: 1.15,
                          textDecoration: done ? "line-through" : "none",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}>
                          {n.label}
                        </div>
                        <div style={{ color: MUT, fontSize: 10, marginTop: 2 }}>
                          {n.weight || 0}h · {n.type}
                        </div>
                      </div>
                      {isCrit && <Pill color="#f59e0b">critical</Pill>}
                    </div>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <a
                        href={courseraUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          padding: "6px 10px",
                          borderRadius: 10,
                          border: "1px solid #334155",
                          background: "transparent",
                          color: "#94a3b8",
                          fontWeight: 800,
                          fontSize: 11,
                          textDecoration: "none",
                          pointerEvents: unlocked ? "auto" : "none",
                          opacity: unlocked ? 1 : 0.6
                        }}
                      >
                        Coursera link
                      </a>

                      <button
                        onClick={() => onUploadCertificate(id)}
                        disabled={!unlocked || done}
                        style={{
                          padding: "6px 10px",
                          borderRadius: 10,
                          border: "1px solid #334155",
                          cursor: !unlocked || done ? "not-allowed" : "pointer",
                          background: hasCertificate ? "#0f766e33" : "transparent",
                          color: hasCertificate ? "#2dd4bf" : "#94a3b8",
                          fontWeight: 900,
                          fontSize: 11
                        }}
                      >
                        {hasCertificate ? "Certificate uploaded" : "Upload certificate"}
                      </button>

                      <button
                        onClick={() => onVerify(id)}
                        disabled={!unlocked || done}
                        style={{
                          padding: "6px 10px",
                          borderRadius: 10,
                          border: "none",
                          cursor: !unlocked || done ? "not-allowed" : "pointer",
                          background: done ? "#10b98133" : unlocked ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#334155",
                          color: done ? "#34d399" : "#fff",
                          fontWeight: 900,
                          fontSize: 11
                        }}
                      >
                        {done ? "Finished" : "Verify understanding"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function WeeklyView({weeks, critSet, completed, onToggle}) {
  return (
    <div style={{display:"grid", gap:"0.75rem"}}>
      {weeks.map((w,wi)=>{
        if (w.isMilestone) return (
          <div key={wi} style={{padding:"10px 16px", borderRadius:10,
            background:"#f59e0b11", border:"1px solid #f59e0b33",
            display:"flex", gap:10, alignItems:"center"}}>
            <span style={{fontSize:14}}>🏆</span>
            <span style={{color:"#fbbf24", fontWeight:600, fontSize:13}}>{w.label}</span>
          </div>
        );
        const done=w.tasks.filter(t=>completed.has(t.id)).length;
        const pct=w.tasks.length?Math.round((done/w.tasks.length)*100):0;
        return (
          <Card key={wi}>
            <div style={{display:"flex", justifyContent:"space-between", marginBottom:6}}>
              <div>
                <span style={{color:"#6366f1", fontWeight:700, fontSize:10}}>WEEK {w.week}</span>
                <span style={{color:MUT, fontSize:10, marginLeft:8}}>~{w.totalHours}h</span>
              </div>
              <span style={{color:pct===100?"#10b981":MUT, fontWeight:700, fontSize:11}}>{done}/{w.tasks.length}</span>
            </div>
            <PBar value={pct} color={pct===100?"#10b981":"#6366f1"} h={4}/>
            <div style={{display:"grid", gap:6, marginTop:8}}>
              {w.tasks.map(t=>{
                const isDone=completed.has(t.id);
                const isCrit=critSet.has(t.id);
                return (
                  <div key={t.id} onClick={()=>onToggle(t.id)} style={{
                    display:"flex", gap:10, alignItems:"center", padding:"7px 10px",
                    borderRadius:8, cursor:"pointer", transition:"all .15s",
                    background:isDone?"#10b98111":SURF2,
                    border:`1px solid ${isDone?"#10b98133":isCrit?"#f59e0b33":BOR}`,
                  }}>
                    <div style={{width:17, height:17, borderRadius:4, flexShrink:0,
                      background:isDone?"#10b981":"transparent",
                      border:`2px solid ${isDone?"#10b981":DIM}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:9, color:"#fff"}}>{isDone?"✓":""}</div>
                    <div style={{flex:1, minWidth:0}}>
                      <div style={{display:"flex", gap:5, alignItems:"center"}}>
                        <span style={{fontSize:12, fontWeight:600, color:isDone?MUT:TEXT,
                          textDecoration:isDone?"line-through":"none"}}>{t.label}</span>
                        {isCrit&&<Pill color="#f59e0b">critical</Pill>}
                        {t.isOptional&&<Pill color="#64748b">optional</Pill>}
                      </div>
                      <div style={{fontSize:10, color:MUT, marginTop:1}}>{t.type} · {t.hours}h</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  ANALYSIS PANEL
// ─────────────────────────────────────────────────────────────────

function AnalysisPanel({dag, cpData, completed}) {
  const {criticalPath, projectDuration} = cpData;
  const totalSkills = dag.nodeCount - 2;
  const pct = totalSkills>0?Math.round((completed.size/totalSkills)*100):0;
  const critNodes = criticalPath.filter(id=>{const n=dag.nodes.get(id);return n&&n.type!==NODE_TYPE.ROOT&&n.type!==NODE_TYPE.GOAL;});

  return (
    <div>
      {/* Progress */}
      <div style={{marginBottom:"1rem"}}>
        <div style={{display:"flex", justifyContent:"space-between", marginBottom:4}}>
          <span style={{color:TEXT, fontWeight:600, fontSize:13}}>Overall readiness</span>
          <span style={{color:"#6366f1", fontWeight:700}}>{pct}%</span>
        </div>
        <PBar value={pct} h={10}/>
      </div>

      {/* Stat grid */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:"1.25rem"}}>
        {[
          {l:"Skills in graph", v:totalSkills, c:"#6366f1"},
          {l:"Marked done", v:completed.size, c:"#10b981"},
          {l:"Edges (deps)", v:dag.edgeCount, c:"#3b82f6"},
          {l:"Critical nodes", v:critNodes.length, c:"#f59e0b"},
          {l:"Est. total hours", v:`${projectDuration}h`, c:"#ec4899"},
        ].map(s=>(
          <div key={s.l} style={{background:SURF2, borderRadius:10, padding:"10px", textAlign:"center"}}>
            <div style={{fontSize:20, fontWeight:700, color:s.c, fontFamily:"monospace"}}>{s.v}</div>
            <div style={{fontSize:10, color:MUT, marginTop:2}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Critical path */}
      <div style={{marginBottom:"1.25rem"}}>
        <div style={{fontSize:9, color:DIM, fontWeight:700, marginBottom:6}}>CRITICAL PATH (float = 0)</div>
        <div style={{display:"flex", flexWrap:"wrap", gap:4}}>
          {critNodes.map((id,i)=>{
            const n=dag.nodes.get(id);
            if (!n) return null;
            return (
              <React.Fragment key={id}>
                <Pill color="#f59e0b">{n.label}</Pill>
                {i<critNodes.length-1&&<span style={{color:DIM, fontSize:10, alignSelf:"center"}}>→</span>}
              </React.Fragment>
            );
          })}
        </div>
        <p style={{color:MUT, fontSize:11, marginTop:6}}>
          Zero-slack nodes — delaying any of these extends your total timeline.
        </p>
      </div>

      {/* (PERT/float table removed per simplified Analysis requirement) */}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  ALGORITHM VIEWER TAB
// ─────────────────────────────────────────────────────────────────

function AlgoViewer({dag, cpData}) {
  let topoOrder=[];
  try { topoOrder=dag.topoSort().order; } catch { /* ignore topo-sort failure */ }
  const critSet=new Set(cpData.criticalPath);
  const cycleResult=dag.detectCycle();

  return (
    <div style={{display:"grid", gap:"1rem"}}>
      {/* Topo order */}
      <Card>
        <div style={{fontWeight:700, fontSize:13, color:TEXT, marginBottom:6}}>Kahn's topological order</div>
        <p style={{color:MUT, fontSize:12, marginBottom:"0.75rem"}}>
          Each skill index i is guaranteed to appear after all its prerequisites.
        </p>
        <div style={{display:"flex", flexWrap:"wrap", gap:4}}>
          {topoOrder.map((id,i)=>{
            const n=dag.nodes.get(id); if (!n) return null;
            const isCrit=critSet.has(id);
            return (
              <React.Fragment key={id}>
                <span style={{
                  display:"inline-flex", alignItems:"center", gap:3,
                  padding:"2px 9px", borderRadius:99, fontSize:10,
                  background:NODE_COLOR[n.type]+"22",
                  border:`1px solid ${isCrit?"#f59e0b":NODE_COLOR[n.type]+"44"}`,
                  color:isCrit?"#fbbf24":NODE_COLOR[n.type],
                }}>
                  <span style={{color:DIM, fontFamily:"monospace", fontSize:8}}>{i}</span>
                  {n.label}
                </span>
                {i<topoOrder.length-1&&<span style={{color:DIM, alignSelf:"center", fontSize:9}}>›</span>}
              </React.Fragment>
            );
          })}
        </div>
      </Card>

      {/* Cycle check */}
      <Card accent={cycleResult?"#ef444466":"#10b98166"}>
        <div style={{fontWeight:700, fontSize:13, color:TEXT, marginBottom:4}}>DFS cycle detection</div>
        {cycleResult ? (
          <div>
            <Pill color="#ef4444">Cycle found</Pill>
            <div style={{marginTop:6, display:"flex", flexWrap:"wrap", gap:4}}>
              {cycleResult.map((id,i)=>(
                <React.Fragment key={id}>
                  <Pill color="#ef4444">{dag.nodes.get(id)?.label||id}</Pill>
                  {i<cycleResult.length-1&&<span style={{color:DIM, alignSelf:"center"}}>→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : (
          <div style={{display:"flex", gap:8, alignItems:"center"}}>
            <Pill color="#10b981">No cycle — valid DAG</Pill>
            <span style={{color:MUT, fontSize:12}}>All nodes colorable WHITE→BLACK with no back edges.</span>
          </div>
        )}
      </Card>

      {/* Algorithm cards */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem"}}>
        {[
          {title:"DAG representation", color:"#6366f1",
            items:[`${dag.nodeCount} nodes (adjacency list)`,`${dag.edgeCount} directed edges`,
              "in-degree map for Kahn's","O(V + E) space complexity"]},
          {title:"Kahn's algorithm", color:"#3b82f6",
            items:["Seed queue: in-degree = 0","BFS layer-by-layer processing",
              "Decrement successor in-degrees","Leftover nodes → cycle exists"]},
          {title:"CPM forward pass", color:"#10b981",
            items:["ES[v] = max(EF[predecessors])","EF[v] = ES[v] + weight[v]",
              "Project duration D = max(EF)","O(V + E) over topo order"]},
          {title:"CPM backward pass", color:"#f59e0b",
            items:["LF[v] = min(LS[successors])","LS[v] = LF[v] − weight[v]",
              "Float = LS − ES","Critical: float === 0"]},
        ].map(({title,color,items})=>(
          <Card key={title} accent={color+"44"}>
            <div style={{color, fontWeight:700, fontSize:12, marginBottom:8}}>{title}</div>
            <ul style={{listStyle:"none", display:"grid", gap:4}}>
              {items.map((item,i)=>(
                <li key={i} style={{display:"flex", gap:7, fontSize:11, color:MUT}}>
                  <span style={{color, fontSize:9, marginTop:2}}>▸</span>{item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      {/* Code */}
      <Card>
        <div style={{color:TEXT, fontWeight:700, fontSize:12, marginBottom:8}}>Core algorithms — JavaScript</div>
        <pre style={{background:"#020617", padding:"1rem", borderRadius:8,
          fontSize:11, color:"#7dd3fc", overflowX:"auto", lineHeight:1.65}}>{
`// ── Kahn's topological sort — O(V + E) ─────────────────────
topoSort() {
  const deg = new Map(this.inDeg);          // copy in-degree map
  const queue = [...nodes].filter(id => deg.get(id) === 0);
  const order = [], layers = [];

  while (queue.length) {
    const layer = [...queue];  queue.length = 0;
    layers.push(layer);                    // Coffman-Graham layer
    for (const u of layer) {
      order.push(u);
      for (const v of this.adj.get(u)) {
        deg.set(v, deg.get(v) - 1);
        if (deg.get(v) === 0) queue.push(v);
      }
    }
  }
  // Cycle check: unprocessed nodes remain
  if (order.length !== this.nodes.size) throw new Error("Cycle");
  return { order, layers };
}

// ── CPM critical path — O(V + E) two-pass ───────────────────
criticalPath() {
  const { order } = this.topoSort();
  const ES = new Map(), EF = new Map();    // earliest start / finish
  const LS = new Map(), LF = new Map();    // latest start / finish

  // Forward pass
  for (const u of order) {
    const es = max(EF[predecessor] for each predecessor of u);
    ES.set(u, es);
    EF.set(u, es + weight[u]);             // weight = estimated hours
  }
  const D = max(EF.values());             // total project duration

  // Backward pass
  for (const u of [...order].reverse()) {
    const succs = [...this.adj.get(u)];
    LF.set(u, succs.length ? min(LS[s] for s of succs) : D);
    LS.set(u, LF.get(u) - weight[u]);
  }

  // Float = slack time before this node delays the project
  const critical = order.filter(u => LS.get(u) === ES.get(u));
  return { critical, duration: D };
}

// ── DFS cycle detection — O(V + E) ──────────────────────────
detectCycle() {
  // 0=white(unvisited) 1=gray(in-stack) 2=black(done)
  const color = new Map(nodes.map(k => [k, 0]));
  let cycle = null;
  const dfs = u => {
    color.set(u, 1);                       // mark in-stack
    for (const v of this.adj.get(u)) {
      if (color.get(v) === 1) {            // back edge → cycle!
        cycle = reconstructPath(v, u);  return;
      }
      if (color.get(v) === 0) dfs(v);
    }
    color.set(u, 2);                       // fully processed
  };
  for (const id of nodes) if (color.get(id) === 0) dfs(id);
  return cycle;                            // null if no cycle
}`}</pre>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  SKILL SELECTOR
// ─────────────────────────────────────────────────────────────────

const QUICK_SKILLS=["Python","JavaScript","TypeScript","React","Node.js","SQL","Java",
  "HTML","CSS","Docker","AWS","Linux","Git","Machine Learning","Statistics",
  "MongoDB","PostgreSQL","REST APIs","Next.js","Kubernetes","R","Data Analysis"];

function SkillSelector({selected, onChange}) {
  return (
    <div style={{display:"flex", flexWrap:"wrap", gap:5}}>
      {QUICK_SKILLS.map(s=>(
        <button key={s} onClick={()=>onChange(selected.includes(s)?selected.filter(x=>x!==s):[...selected,s])} style={{
          padding:"3px 9px", borderRadius:99, fontSize:11, fontWeight:600, cursor:"pointer", transition:"all .1s",
          background:selected.includes(s)?"#10b98133":SURF2,
          color:selected.includes(s)?"#10b981":MUT,
          border:`1px solid ${selected.includes(s)?"#10b98166":BOR}`,
        }}>{s}</button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  ROOT COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function DAGRoadmapEngine() {
  const [customRole] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const roleTitle = (params.get("role_title") || "").trim();
    const roleSkills = (params.get("role_skills") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 20);
    if (!roleTitle) return null;
    return { title: roleTitle, skills: roleSkills };
  });
  const customGoalId = "custom-role";
  const roadmapGoals = useMemo(() => {
    if (!customRole?.title) return CAREER_GOALS;
    const required = (customRole.skills.length ? customRole.skills : ["Communication", "Problem Solving"]).slice(0, 8);
    return {
      ...CAREER_GOALS,
      [customGoalId]: {
        label: customRole.title,
        icon: "🧭",
        color: "#14b8a6",
        required,
        optional: ["Customer Service", "Time Management", "Professionalism"].filter((s) => !required.includes(s)),
        foundations: ["Communication"]
      }
    };
  }, [customRole]);

  const [homeCareerId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('goal') || "data-scientist";
  });
  const [goalId, setGoalId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if ((params.get("role_title") || "").trim()) return customGoalId;
    return params.get('goal') || "data-scientist";
  });
  const [skills] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('skills');
    const parsed = s ? s.split(',').map(x => x.trim()).filter(Boolean) : ["Python", "SQL", "Statistics"];
    // Cap to keep initial DAG construction + SVG render fast.
    const unique = [...new Map(parsed.map(x => [x.toLowerCase(), x])).values()].slice(0, 25);
    return unique;
  });
  const [tab,     setTab]       = useState("graph");
  const [selNode, setSelNode]   = useState(null);
  const [done,    setDone]      = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const verifiedUnit = params.get("verify_unit");
    const rawScore = params.get("verify_score") ?? params.get("score") ?? params.get("rating");
    const initial = new Set();
    if (verifiedUnit && rawScore != null) {
      const score = Number(rawScore);
      if (Number.isFinite(score) && score >= 8) {
        initial.add(verifiedUnit);
      } else if (Number.isFinite(score)) {
        alert(`Verification score ${score}/10 is below 8. Please retry this unit.`);
      }
      params.delete("verify_unit");
      params.delete("verify_score");
      params.delete("score");
      params.delete("rating");
      const nextUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      window.history.replaceState({}, "", nextUrl);
    }
    return initial;
  });
  const [certificates, setCertificates] = useState(new Set());
  const [setup,   setSetup]     = useState(true);

  const dag = useMemo(()=>{
    try { return buildRoadmapDAG(goalId, skills, roadmapGoals); }
    catch(e) { console.error(e); return new DAG(); }
  },[goalId,skills,roadmapGoals]);

  const layout = useMemo(()=>layoutDAG(dag),[dag]);

  const cpData = useMemo(()=>{
    try { return dag.criticalPath(); }
    catch { return {criticalPath:[], projectDuration:0, ES:new Map(), EF:new Map(), LS:new Map(), LF:new Map(), float:new Map()}; }
  },[dag]);

  const schedule = useMemo(()=>assignWeeks(dag,skills),[dag,skills]);
  const critSet  = useMemo(()=>new Set(cpData.criticalPath),[cpData]);

  const toggleDone = useCallback((id)=>{
    const n=dag.nodes.get(id);
    if (!n||n.meta?.alreadyHave) return;
    setDone(prev=>{ const s=new Set(prev); s.has(id)?s.delete(id):s.add(id); return s; });
  },[dag]);
  const startVerifyFlow = useCallback((id) => {
    const n = dag.nodes.get(id);
    if (!n) return;
    const returnUrl = new URL(window.location.href);
    returnUrl.searchParams.set("verify_unit", id);
    // Open local Explainly app in this workspace.
    const explainlyPorts = [3000, 3001, 3002, 3003, 3004];
    const run = async () => {
      let reachablePort = null;
      for (const port of explainlyPorts) {
        const ctrl = new AbortController();
        const timeout = setTimeout(() => ctrl.abort(), 800);
        try {
          await fetch(`http://localhost:${port}/`, { method: "GET", mode: "no-cors", signal: ctrl.signal });
          reachablePort = port;
          break;
        } catch {
          // try next port
        } finally {
          clearTimeout(timeout);
        }
      }
      if (!reachablePort) {
        alert(
          "Explainly app is not responding.\n\n" +
          "Start it first, then click Verify understanding again.\n" +
          "Tip: run `npm run explainly` from the project root."
        );
        return;
      }
      const explainlyUrl = new URL(`http://localhost:${reachablePort}/`);
      explainlyUrl.searchParams.set("topic", n.label);
      explainlyUrl.searchParams.set("return_url", returnUrl.toString());
      window.location.assign(explainlyUrl.toString());
    };
    run();
  }, [dag]);
  const uploadCertificate = useCallback((id) => {
    setCertificates(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const goal = roadmapGoals[goalId];

  const completedCount = done.size;
  const totalTaskCount = schedule.weeks.reduce((a,w)=>a+(w.isMilestone?0:w.tasks.length),0);
  const schedPct = totalTaskCount?Math.round((completedCount/totalTaskCount)*100):0;

  return (
    <div style={{background:BG, minHeight:"100vh", color:TEXT, padding:"1.25rem",
      fontFamily:"'Segoe UI',system-ui,-apple-system,sans-serif"}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${BOR};border-radius:2px}
        button:focus{outline:none}`}
      </style>

      {/* Header */}
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.25rem"}}>
        <div>
          <h1 style={{fontSize:21, fontWeight:700, color:"#fff", margin:0}}>DAG Roadmap Engine</h1>
          <p style={{color:MUT, fontSize:12, marginTop:3}}>
            Directed acyclic graph · Kahn's topological sort · CPM critical path · DFS cycle detection
          </p>
        </div>
        <div style={{display:"flex", gap:8}}>
          <button onClick={() => window.location.href = `http://localhost:5173/dashboard?from_dag=true&career=${encodeURIComponent(homeCareerId)}` } style={{
            padding:"5px 12px", borderRadius:8, border:`1px solid ${BOR}`,
            background:"#6366f122", color:"#818cf8", cursor:"pointer", fontSize:11, fontWeight:600
          }}>← Home</button>
          <button onClick={()=>setSetup(s=>!s)} style={{
            padding:"5px 12px", borderRadius:8, border:`1px solid ${BOR}`,
            background:"transparent", color:MUT, cursor:"pointer", fontSize:11,
          }}>{setup?"Hide setup":"Configure"}</button>
        </div>
      </div>

      {/* Setup panel */}
      {setup&&(
        <Card style={{marginBottom:"1.25rem"}}>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", alignItems:"start"}}>
            <div>
              <div style={{fontSize:9, color:DIM, fontWeight:700, marginBottom:7}}>TARGET CAREER</div>
              <div style={{display:"grid", gap:8}}>
                {Object.entries(roadmapGoals)
                  .filter(([id]) => id === goalId)
                  .map(([id,g])=>(
                    <button key={id} type="button" style={{
                      display:"flex", gap:7, alignItems:"center", padding:"9px 14px",
                      borderRadius:8, border:"1px solid "+g.color, cursor:"default",
                      background:g.color+"33", minWidth:180, whiteSpace:"nowrap",
                    }}>
                      <span style={{fontSize:15}}>{g.icon}</span>
                      <span style={{color:"#fff", fontSize:11, fontWeight:700}}>{g.label}</span>
                    </button>
                  ))}
              </div>
            </div>
            <div>
              <div style={{fontSize:9, color:DIM, fontWeight:700, marginBottom:7}}>EXPLORE OTHER ROADMAPS</div>
              <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
                {Object.entries(roadmapGoals)
                  .filter(([id]) => id !== goalId)
                  .map(([id,g])=>(
                    <button key={id} onClick={()=>{setGoalId(id);setDone(new Set());setSelNode(null);setCertificates(new Set());}} style={{
                      display:"flex", gap:7, alignItems:"center", padding:"8px 14px",
                      borderRadius:8, border:"none", cursor:"pointer",
                      background:SURF2, borderWidth:1, borderStyle:"solid",
                      borderColor:BOR, minWidth:180, whiteSpace:"nowrap",
                    }}>
                      <span style={{fontSize:15}}>{g.icon}</span>
                      <span style={{color:MUT, fontSize:11, fontWeight:600}}>{g.label}</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Summary bar */}
      <div style={{display:"flex", gap:7, marginBottom:"1rem", flexWrap:"wrap", alignItems:"center"}}>
        <div style={{display:"flex", gap:6, alignItems:"center", marginRight:4}}>
          <span style={{fontSize:18}}>{goal?.icon}</span>
          <span style={{color:"#fff", fontWeight:700, fontSize:14}}>{goal?.label}</span>
        </div>
        {[
          {l:`${dag.nodeCount} nodes`, c:"#6366f1"},
          {l:`${dag.edgeCount} edges`, c:"#3b82f6"},
          {l:`${critSet.size} critical`, c:"#f59e0b"},
          {l:`~${cpData.projectDuration}h`, c:"#ec4899"},
          {l:`${skills.length} owned`, c:"#10b981"},
          {l:`${schedPct}% done`, c:"#6366f1"},
        ].map(({l,c})=><Pill key={l} color={c}>{l}</Pill>)}
        {layout.error&&<Pill color="#ef4444">⚠ {layout.error}</Pill>}
      </div>

      {/* Tabs */}
      <div style={{display:"flex", gap:4, marginBottom:"1.25rem"}}>
        {[{id:"graph",l:"DAG Graph"},{id:"weekly",l:"Weekly Plan"}]
          .map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              padding:"6px 14px", borderRadius:8, border:"none", cursor:"pointer",
              fontSize:12, fontWeight:600, transition:"all .15s",
              background:tab===t.id?goal?.color||"#6366f1":SURF2,
              color:tab===t.id?"#fff":MUT,
            }}>{t.l}</button>
          ))}
      </div>

      {/* ── GRAPH TAB ── */}
      {tab==="graph"&&(
        <div>
          <div style={{display:"grid", gridTemplateColumns:"minmax(620px,1.4fr) minmax(320px,1fr)", gap:12, alignItems:"start"}}>
            <Card style={{padding:"1rem", marginBottom:"0.75rem"}}>
              {layout.error
                ? <div style={{color:"#ef4444", padding:"2rem", textAlign:"center"}}>{layout.error}</div>
                : <DAGCanvas dag={dag} layout={layout} criticalPath={cpData.criticalPath}
                    completed={done} userSkills={skills} onNodeClick={setSelNode} selected={selNode}/>
              }
            </Card>
            <Card>
              <AnalysisPanel dag={dag} cpData={cpData} completed={done}/>
            </Card>
          </div>
          <p style={{color:MUT, fontSize:11, textAlign:"center", marginBottom:"0.75rem"}}>
            Click any node to inspect · amber border = critical path · ✓ = you own this skill
          </p>
          {selNode&&(
            <NodeInspector dag={dag} nodeId={selNode} critSet={critSet}
              completed={done} onToggle={toggleDone} userSkills={skills}/>
          )}
        </div>
      )}

      {/* ── WEEKLY TAB ── */}
      {tab==="weekly"&&(
        <div>
          <Card style={{marginBottom:"1rem", padding:"1rem 1.25rem"}}>
            <div style={{display:"flex", justifyContent:"space-between", marginBottom:5}}>
              <span style={{fontWeight:600, fontSize:13}}>Schedule progress</span>
              <span style={{color:"#6366f1", fontWeight:700, fontSize:13}}>{schedPct}%</span>
            </div>
            <PBar value={completedCount} max={Math.max(1,totalTaskCount)}/>
            <div style={{fontSize:11, color:MUT, marginTop:5}}>
              {schedule.totalWeeks} skill-weeks · ~{schedule.totalHours}h total · ~{Math.ceil(schedule.totalHours/15)} weeks at 15h/week
            </div>
          </Card>
          <LevelPlanView
            dag={dag}
            critSet={critSet}
            completed={done}
            userSkills={skills}
            certificates={certificates}
            onVerify={startVerifyFlow}
            onUploadCertificate={uploadCertificate}
          />
        </div>
      )}

    </div>
  );
}