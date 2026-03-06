<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>HT-SECURITY // COMMAND CENTER</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
<style>
/* ══════════════════════════════════════════════
   ROOT VARIABLES
══════════════════════════════════════════════ */
:root {
  --c-blue: #00d2ff; --c-blue-dim: rgba(0,210,255,0.15); --c-blue-glow: rgba(0,210,255,0.4);
  --c-green: #00ff88; --c-green-dim: rgba(0,255,136,0.15); --c-green-glow: rgba(0,255,136,0.4);
  --c-red: #ff3366; --c-red-dim: rgba(255,51,102,0.15); --c-amber: #ffb700;
  --c-amber-dim: rgba(255,183,0,0.15); --bg-void: #020810; --bg-deep: #030d1a;
  --bg-panel: rgba(4,14,28,0.85); --bg-card: rgba(6,18,36,0.8); --bg-input: rgba(3,10,22,0.95);
  --border-dim: rgba(0,210,255,0.15); --border-mid: rgba(0,210,255,0.3); --border-hi: rgba(0,210,255,0.5);
  --txt-hi: #ffffff; --txt-mid: #8bc1df; --txt-lo: #5c8fa6;
  --font-mono: 'Share Tech Mono', monospace; --font-ui: 'Rajdhani', sans-serif; --font-display: 'Orbitron', monospace;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{width:100%;height:100%;overflow:hidden;background:var(--bg-void);color:var(--txt-hi);font-family:var(--font-ui);font-size:16px;cursor:crosshair}
#file-input,#bcast-file-input{display:none!important;visibility:hidden;position:absolute;z-index:-999;width:0;height:0}
.world{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.grid-layer{position:absolute;inset:-100px;background-image:linear-gradient(rgba(0,210,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,210,255,0.05) 1px,transparent 1px);background-size:50px 50px;animation:grid-move 25s linear infinite}
.grid-layer-2{position:absolute;inset:-100px;background-image:linear-gradient(rgba(0,255,136,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,0.03) 1px,transparent 1px);background-size:200px 200px;animation:grid-move 60s linear infinite reverse}
@keyframes grid-move{0%{transform:translateY(0) translateX(0)}100%{transform:translateY(50px) translateX(50px)}}
.atm-blob{position:absolute;border-radius:50%;filter:blur(80px);opacity:0.15}
.atm-blob-1{width:600px;height:400px;background:var(--c-blue);top:-100px;left:-100px;animation:blob-drift 20s ease-in-out infinite}
.atm-blob-2{width:500px;height:500px;background:var(--c-green);bottom:-150px;right:-100px;animation:blob-drift 28s ease-in-out infinite reverse}
@keyframes blob-drift{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(40px,-30px) scale(1.1)}66%{transform:translate(-20px,20px) scale(0.95)}}
.scanlines{position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.1) 3px,rgba(0,0,0,0.1) 4px)}
.login-screen{position:fixed;inset:0;z-index:500;display:flex;align-items:center;justify-content:center;background:radial-gradient(ellipse 100% 100% at 50% 50%,rgba(0,30,60,0.85) 0%,rgba(2,8,16,0.97) 70%);backdrop-filter:blur(8px);animation:screen-in .5s ease-out}
.login-screen.gone{display:none}
@keyframes screen-in{from{opacity:0}to{opacity:1}}
.login-frame{position:relative;width:90%;max-width:520px;background:var(--bg-panel);border:1px solid var(--border-hi);backdrop-filter:blur(30px);padding:0;clip-path:polygon(25px 0,100% 0,100% calc(100% - 25px),calc(100% - 25px) 100%,0 100%,0 25px);animation:frame-drop .55s cubic-bezier(.16,1,.3,1)}
@keyframes frame-drop{from{opacity:0;transform:translateY(-20px) scale(0.97)}to{opacity:1;transform:none}}
.login-frame::before{content:'';position:absolute;top:0;left:25px;right:0;height:3px;background:linear-gradient(90deg,transparent,var(--c-blue),var(--c-green),var(--c-blue),transparent);animation:shimmer 3s ease-in-out infinite}
@keyframes shimmer{0%,100%{opacity:.5}50%{opacity:1}}
.login-header{padding:40px 40px 24px;border-bottom:1px solid var(--border-dim);text-align:center}
.login-emblem svg{width:76px;height:76px;filter:drop-shadow(0 0 12px var(--c-blue))}
.login-title{font-family:var(--font-display);font-size:28px;font-weight:900;letter-spacing:5px;background:linear-gradient(90deg,var(--c-blue),var(--c-green));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:8px}
.login-subtitle{font-family:var(--font-mono);font-size:13px;letter-spacing:4px;color:var(--txt-mid);text-transform:uppercase}
.login-body{padding:32px 40px 40px}
.lf-group{margin-bottom:22px}
.lf-label{display:flex;align-items:center;gap:8px;font-family:var(--font-mono);font-size:13px;letter-spacing:2px;color:var(--txt-mid);text-transform:uppercase;margin-bottom:10px}
.tac-input{width:100%;background:var(--bg-input);border:1px solid var(--border-mid);color:var(--txt-hi);font-family:var(--font-mono);font-size:18px;letter-spacing:2px;padding:16px 20px;outline:none;direction:rtl}
.tac-input:focus{border-color:var(--c-blue);box-shadow:0 0 0 1px var(--c-blue-dim),inset 0 0 16px rgba(0,210,255,0.1)}
.enc-note{display:flex;align-items:flex-start;gap:10px;background:var(--c-green-dim);border:1px solid rgba(0,255,136,0.3);padding:14px 18px;margin-bottom:28px;font-family:var(--font-mono);font-size:13px;color:var(--c-green)}
.tac-btn{width:100%;padding:18px 24px;background:transparent;border:1px solid var(--border-hi);color:var(--c-blue);font-family:var(--font-display);font-size:16px;font-weight:700;letter-spacing:4px;cursor:pointer;text-transform:uppercase;transition:all .15s}
.tac-btn:hover{box-shadow:0 0 24px var(--c-blue-glow);background:rgba(0,210,255,0.08)}
#app{position:relative;z-index:1;display:grid;grid-template-rows:70px 1fr;grid-template-columns:460px 1fr 400px;width:100%;height:100%;gap:2px;background:var(--border-dim)}
.topbar{grid-column:1 / -1;background:rgba(2,8,18,0.95);backdrop-filter:blur(20px);border-bottom:1px solid var(--border-mid);display:flex;align-items:center;justify-content:space-between;padding:0 28px;position:relative}
.topbar::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent 0%,var(--c-blue) 20%,var(--c-green) 50%,var(--c-blue) 80%,transparent 100%);opacity:0.7}
.brand{display:flex;align-items:center;gap:18px}
.brand-shield svg{width:42px;height:42px;filter:drop-shadow(0 0 8px var(--c-blue))}
.brand-name{font-family:var(--font-display);font-size:20px;font-weight:900;letter-spacing:4px;background:linear-gradient(90deg,var(--c-blue),var(--c-green));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.brand-ver{font-family:var(--font-mono);font-size:11px;letter-spacing:4px;color:var(--txt-mid);text-transform:uppercase;margin-top:3px}
.metrics-bar{display:flex;align-items:center;gap:0;flex:1;justify-content:center}
.metric-item{display:flex;flex-direction:column;align-items:center;padding:0 32px;border-left:1px solid var(--border-mid)}
.metric-item:last-child{border-right:1px solid var(--border-mid)}
.metric-val{font-family:var(--font-display);font-size:24px;font-weight:700;line-height:1;color:var(--c-blue);text-shadow:0 0 12px var(--c-blue);transition:all .3s}
.metric-val.green{color:var(--c-green);text-shadow:0 0 12px var(--c-green)}
.metric-val.amber{color:var(--c-amber);text-shadow:0 0 12px var(--c-amber)}
.metric-lbl{font-family:var(--font-mono);font-size:11px;font-weight:bold;letter-spacing:3px;color:var(--txt-mid);text-transform:uppercase;margin-top:6px}
.topbar-right{display:flex;align-items:center;gap:18px}
.node-tag{font-family:var(--font-mono);font-size:14px;letter-spacing:1px;color:var(--txt-mid)}
.node-tag em{font-style:normal;color:var(--c-blue);font-weight:bold}
.status-chip{display:flex;align-items:center;gap:8px;padding:6px 16px;border:1px solid;font-family:var(--font-mono);font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase}
.status-chip.online{border-color:rgba(0,255,136,0.5);color:var(--c-green);background:var(--c-green-dim)}
.status-chip.offline{border-color:var(--txt-lo);color:var(--txt-lo);background:transparent}
.status-chip.enc{border-color:rgba(0,210,255,0.4);color:var(--c-blue);background:var(--c-blue-dim)}
.blink-dot{width:8px;height:8px;border-radius:50%;background:currentColor;animation:blink 1s step-end infinite}

/* LEFT PANEL */
.panel-left{background:var(--bg-panel);backdrop-filter:blur(20px);display:flex;flex-direction:column;overflow:hidden;position:relative;border-right:1px solid var(--border-mid)}
.panel-head{padding:20px 24px;border-bottom:1px solid var(--border-mid);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;background:rgba(0,0,0,0.2)}
.ph-label{font-family:var(--font-mono);font-size:14px;font-weight:bold;letter-spacing:4px;color:var(--txt-mid);text-transform:uppercase}
.ph-badge{font-family:var(--font-mono);font-size:14px;font-weight:700;padding:4px 12px;background:var(--c-blue);color:#000}
.room-section{padding:24px;border-bottom:1px solid var(--border-mid);flex-shrink:0}
.rs-row{display:flex;gap:12px;margin-bottom:16px}
.room-display{font-family:var(--font-mono);font-size:16px;font-weight:bold;letter-spacing:1px;color:var(--c-blue);padding:10px 16px;border:1px solid var(--border-mid);background:var(--c-blue-dim);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tac-btn-sm{padding:10px 16px;background:transparent;border:1px solid;font-family:var(--font-mono);font-size:14px;font-weight:bold;letter-spacing:2px;cursor:pointer;transition:all .15s;text-transform:uppercase}
.tac-btn-sm.red{border-color:rgba(255,34,85,.6);color:var(--c-red)}
.tac-btn-sm:hover{background:rgba(255,34,85,.1)}
.mic-block{display:flex;align-items:center;gap:16px;padding:14px 20px;border:1px solid;cursor:pointer;transition:all .2s}
.mic-block.off{border-color:rgba(255,34,85,.5);background:rgba(255,34,85,.1)}
.mic-block.on{border-color:rgba(0,255,136,.5);background:rgba(0,255,136,.1)}
.mic-block svg{flex-shrink:0;width:24px;height:24px}
.mic-block.off svg{color:var(--c-red)}
.mic-block.on svg{color:var(--c-green)}
.mic-text{font-family:var(--font-mono);font-size:15px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;flex:1}
.mic-block.off .mic-text{color:var(--c-red)}
.mic-block.on .mic-text{color:var(--c-green)}
.nodes-scroll{flex:1;overflow-y:auto;padding:16px}
.nodes-scroll::-webkit-scrollbar{width:6px}
.nodes-scroll::-webkit-scrollbar-thumb{background:var(--border-hi)}
.node-card{display:flex;align-items:center;gap:16px;padding:14px 20px;margin-bottom:10px;border:1px solid transparent;cursor:pointer;transition:all .2s;position:relative;animation:node-appear .3s ease-out}
.node-card:hover{border-color:var(--border-mid);background:rgba(0,210,255,0.05)}
.node-card.active{border-color:var(--c-blue);background:var(--c-blue-dim)}
.node-card.active::after{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--c-blue);box-shadow:0 0 12px var(--c-blue)}
.nc-avatar{width:54px;height:54px;border-radius:50%;border:1px solid var(--border-hi);background:var(--bg-card);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:16px;font-weight:700;color:var(--c-blue);flex-shrink:0}
.nc-info{flex:1;min-width:0}
.nc-id{font-family:var(--font-mono);font-size:16px;font-weight:bold;color:var(--txt-hi);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nc-state{font-family:var(--font-mono);font-size:12px;font-weight:bold;letter-spacing:2px;margin-top:6px;text-transform:uppercase}
.nc-state.connected{color:var(--c-green)}
.nc-state.connecting{color:var(--c-amber);animation:blink 1s step-end infinite}
.nc-state.failed{color:var(--c-red)}
.nc-unread{min-width:26px;height:26px;padding:0 8px;border-radius:4px;background:var(--c-blue);color:#000;font-family:var(--font-mono);font-size:14px;font-weight:900;display:flex;align-items:center;justify-content:center}

@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes node-appear{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:none}}

/* CENTER PANEL */
.panel-center{background:rgba(3,10,20,0.85);backdrop-filter:blur(12px);display:flex;flex-direction:column;overflow:hidden}
.console-head{padding:20px 24px;border-bottom:1px solid var(--border-mid);background:rgba(2,8,18,0.9);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.ch-target{font-family:var(--font-mono);font-size:16px;font-weight:bold;letter-spacing:2px;color:var(--txt-mid)}
.ch-target em{font-style:normal;color:var(--c-blue)}
.ch-enc-tag{display:flex;align-items:center;gap:6px;font-family:var(--font-mono);font-size:12px;font-weight:bold;letter-spacing:2px;color:var(--c-green);border:1px solid rgba(0,255,136,.3);padding:4px 12px;background:var(--c-green-dim)}
.console-msgs{flex:1;overflow-y:auto;padding:24px;display:flex;flex-direction:column;gap:12px}
.console-msgs::-webkit-scrollbar{width:6px}
.console-msgs::-webkit-scrollbar-thumb{background:var(--border-hi)}
.terminal-idle{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;font-family:var(--font-mono);font-size:16px;font-weight:bold;letter-spacing:3px;color:var(--txt-mid);text-align:center}
.terminal-glyph{font-size:80px;opacity:.2;margin-bottom:10px}
.sys-line{align-self:center;font-family:var(--font-mono);font-size:13px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;padding:8px 20px;border:1px solid var(--border-mid);color:var(--txt-mid);background:rgba(0,0,0,.6);margin:10px 0}
.sys-line.join{color:var(--c-green);border-color:rgba(0,255,136,.3);background:rgba(0,255,136,.08)}
.sys-line.leave{color:var(--c-red);border-color:rgba(255,51,102,.3);background:rgba(255,51,102,.08)}
.sys-line.warn{color:var(--c-amber);border-color:rgba(255,183,0,.4);background:rgba(255,183,0,.15)}
.cmd-row{display:flex;margin-bottom:8px;animation:cmd-pop .2s ease-out}
@keyframes cmd-pop{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.cmd-row.out{justify-content:flex-end}
.cmd-row.in{justify-content:flex-start}
.cmd-bubble{max-width:85%;padding:14px 22px;font-family:var(--font-mono);font-size:17px;line-height:1.6;letter-spacing:0.5px;word-break:break-word;border:1px solid;position:relative;backdrop-filter:blur(10px)}
.cmd-row.out .cmd-bubble{background:rgba(0,60,120,.4);border-color:rgba(0,210,255,.5);color:var(--txt-hi);clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)}
.cmd-row.in .cmd-bubble{background:rgba(0,40,30,.5);border-color:rgba(0,255,136,.5);color:var(--txt-hi);clip-path:polygon(14px 0,100% 0,100% 100%,0 100%,0 14px)}
.cmd-row.out .cmd-bubble::before{content:'> ';color:var(--c-blue);font-weight:bold}
.cmd-row.in .cmd-bubble::before{content:'$ ';color:var(--c-green);font-weight:bold}
.cmd-meta{font-size:12px;font-weight:bold;letter-spacing:2px;color:var(--txt-mid);margin-bottom:8px;text-transform:uppercase;opacity:0.8}
.bcast-msg{align-self:stretch;border:1px solid rgba(255,183,0,.4);background:rgba(255,183,0,.15);padding:16px 24px;font-family:var(--font-mono);font-size:17px;color:var(--c-amber);margin:8px 0;font-weight:500}
.bcast-msg .bcast-hdr{font-size:12px;font-weight:bold;letter-spacing:2px;opacity:.9;margin-bottom:8px;text-transform:uppercase}
.pkt-row{display:flex;margin-bottom:8px;animation:cmd-pop .2s ease-out}
.pkt-row.out{justify-content:flex-end}
.pkt-row.in{justify-content:flex-start}
.data-packet{max-width:80%;border:1px solid;backdrop-filter:blur(10px);cursor:pointer;transition:filter .15s;position:relative;overflow:hidden}
.pkt-row.out .data-packet{border-color:rgba(0,210,255,.5);background:rgba(0,40,80,.4)}
.pkt-row.in .data-packet{border-color:rgba(0,255,136,.4);background:rgba(0,30,20,.5)}
.data-packet:hover{filter:brightness(1.3)}
.pkt-head{padding:10px 16px;border-bottom:1px solid rgba(0,210,255,.2);display:flex;align-items:center;gap:12px}
.pkt-row.in .pkt-head{border-color:rgba(0,255,136,.2)}
.pkt-type-tag{font-family:var(--font-mono);font-size:12px;font-weight:bold;letter-spacing:2px;padding:4px 10px;text-transform:uppercase}
.pkt-row.out .pkt-type-tag{background:var(--c-blue);color:#000}
.pkt-row.in .pkt-type-tag{background:var(--c-green);color:#000}
.pkt-ts{font-family:var(--font-mono);font-size:12px;font-weight:bold;color:var(--txt-mid);margin-right:auto}
.pkt-body{padding:16px 20px;display:flex;align-items:center;gap:18px}
.pkt-icon{font-size:36px;flex-shrink:0}
.pkt-info .pkt-name{font-family:var(--font-mono);font-size:18px;font-weight:bold;color:var(--txt-hi)}
.pkt-info .pkt-detail{font-family:var(--font-mono);font-size:13px;color:var(--txt-mid);margin-top:8px;letter-spacing:1px}
.pkt-progress{height:4px;background:rgba(255,255,255,.1);margin:0;overflow:hidden}
.pkt-progress-fill{height:100%;background:linear-gradient(90deg,var(--c-blue),var(--c-green));transition:width .1s linear}
.input-zone{padding:20px 24px;border-top:1px solid var(--border-mid);background:rgba(2,7,16,.95);display:flex;gap:16px;align-items:center;flex-shrink:0}
.inp-prompt{font-family:var(--font-mono);font-size:24px;font-weight:bold;color:var(--c-blue);flex-shrink:0}
.inp-field{flex:1;background:transparent;border:none;border-bottom:2px solid var(--border-dim);color:var(--txt-hi);font-family:var(--font-mono);font-size:20px;padding:10px 12px;outline:none;transition:border-color .2s;direction:rtl;letter-spacing:0.5px}
.inp-field:focus{border-color:var(--c-blue)}
.inp-file-btn{width:50px;height:50px;border-radius:50%;border:1px solid var(--border-mid);background:transparent;color:var(--txt-hi);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.inp-file-btn:hover{border-color:var(--c-blue);color:var(--c-blue);box-shadow:0 0 14px var(--c-blue-glow);background:rgba(0,210,255,0.1)}
.inp-file-btn svg{width:24px;height:24px}
.inp-send-btn{padding:12px 28px;background:transparent;border:1px solid var(--border-hi);color:var(--c-blue);font-family:var(--font-mono);font-size:16px;font-weight:bold;letter-spacing:3px;cursor:pointer;text-transform:uppercase;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)}
.inp-send-btn:hover{background:var(--c-blue-dim);box-shadow:0 0 18px var(--c-blue-glow)}
.bcast-zone{padding:0 24px 20px;background:rgba(2,7,16,.95);display:flex;gap:16px;align-items:center;flex-shrink:0}
.bcast-prompt{font-family:var(--font-mono);font-size:18px;font-weight:bold;color:var(--c-amber);flex-shrink:0}
.bcast-field{flex:1;background:transparent;border:none;border-bottom:2px solid rgba(255,183,0,.3);color:var(--c-amber);font-family:var(--font-mono);font-size:18px;padding:8px 12px;outline:none;direction:rtl;letter-spacing:0.5px}
.bcast-attach-btn{width:44px;height:44px;border-color:rgba(255,183,0,.4);color:var(--c-amber);border-radius:50%;border:1px solid;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0}
.bcast-attach-btn:hover{border-color:var(--c-amber);color:var(--c-amber);box-shadow:0 0 12px rgba(255,183,0,0.2);background:rgba(255,183,0,.15)}
.bcast-attach-btn svg{width:20px;height:20px}
.bcast-send-btn{padding:10px 24px;background:transparent;border:1px solid rgba(255,183,0,.5);color:var(--c-amber);font-family:var(--font-mono);font-size:14px;font-weight:bold;letter-spacing:2px;cursor:pointer;text-transform:uppercase}
.bcast-send-btn:hover{background:rgba(255,183,0,.15);box-shadow:0 0 12px rgba(255,183,0,0.2)}

/* RIGHT PANEL */
.panel-right{background:var(--bg-panel);backdrop-filter:blur(20px);display:flex;flex-direction:column;overflow:hidden;position:relative;border-left:1px solid var(--border-mid)}
.intel-section{padding:24px;border-bottom:1px solid var(--border-mid);flex-shrink:0}
.intel-title{font-family:var(--font-mono);font-size:14px;font-weight:bold;letter-spacing:3px;color:var(--txt-mid);text-transform:uppercase;margin-bottom:16px;display:flex;align-items:center;gap:12px}
.intel-title::after{content:'';flex:1;height:1px;background:var(--border-mid)}
.stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.stat-box{background:var(--bg-card);border:1px solid var(--border-mid);padding:20px 12px;text-align:center;position:relative;overflow:hidden}
.stat-box::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,var(--c-blue-dim),transparent)}
.sb-val{font-family:var(--font-display);font-size:38px;font-weight:900;line-height:1;color:var(--c-blue);text-shadow:0 0 20px var(--c-blue)}
.sb-val.g{color:var(--c-green);text-shadow:0 0 20px var(--c-green)}
.sb-lbl{font-family:var(--font-mono);font-size:12px;font-weight:bold;letter-spacing:2px;color:var(--txt-mid);margin-top:10px;text-transform:uppercase}
.live-metrics .lm-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border-dim);font-family:var(--font-mono);font-size:14px;font-weight:bold;letter-spacing:1px}
.live-metrics .lm-row:last-child{border:none;padding-bottom:0}
.lm-key{color:var(--txt-mid)}
.lm-val{color:var(--c-blue)}
.lm-val.g{color:var(--c-green)}
.enc-block{background:var(--c-green-dim);border:1px solid rgba(0,255,136,.3);padding:16px 20px}
.eb-row{display:flex;justify-content:space-between;margin-bottom:10px;font-family:var(--font-mono);font-size:13px;font-weight:bold;letter-spacing:1px}
.eb-row:last-child{margin:0}
.eb-key{color:var(--txt-mid)}
.eb-val{color:var(--c-green)}
.activity-log{flex:1;overflow-y:auto;padding:20px}
.activity-log::-webkit-scrollbar{width:6px}
.activity-log::-webkit-scrollbar-thumb{background:var(--border-hi)}
.act-entry{display:flex;gap:12px;padding:8px 10px;margin-bottom:8px;font-family:var(--font-mono);font-size:13px;font-weight:bold;letter-spacing:1px;animation:act-in .2s ease-out}
@keyframes act-in{from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:none}}
.act-ts{color:var(--txt-lo);flex-shrink:0}
.act-msg{color:var(--txt-hi)}
.act-msg.g{color:var(--c-green)}
.act-msg.b{color:var(--c-blue)}
.act-msg.r{color:var(--c-red)}
.act-msg.a{color:var(--c-amber)}

@media (max-width: 1024px) {
  html,body{overflow-y:auto!important;overflow-x:hidden;height:auto!important;min-height:100vh}
  #app{display:flex!important;flex-direction:column;height:auto;min-height:100vh;overflow:visible}
  .topbar{padding:15px 10px;flex-wrap:wrap;height:auto;justify-content:center;gap:15px;text-align:center}
  .brand{justify-content:center;width:100%}
  .topbar-right{justify-content:center;width:100%}
  .metrics-bar{display:none}
  .panel-center{order:1;height:65vh;min-height:500px;border-left:none;border-right:none;border-bottom:2px solid var(--border-hi)}
  .panel-left{order:2;height:auto;min-height:400px;border-right:none;border-bottom:2px solid var(--border-hi)}
  .panel-right{order:3;height:auto;min-height:300px;border-left:none}
  .login-frame{width:92%;max-width:400px;clip-path:none!important;border-radius:12px}
  .login-header{padding:30px 20px 20px}
  .login-body{padding:20px}
  .tac-input{font-size:16px;padding:14px;clip-path:none!important;border-radius:8px}
  .tac-btn{font-size:16px;padding:16px;clip-path:none!important;border-radius:8px}
  .enc-note{flex-direction:column;align-items:center;text-align:center;font-size:12px}
  .cmd-bubble{max-width:90%;font-size:16px;padding:12px 16px;clip-path:none!important;border-radius:12px}
  .cmd-row.out .cmd-bubble{border-radius:12px 12px 0 12px}
  .cmd-row.in .cmd-bubble{border-radius:12px 12px 12px 0}
  .input-zone,.bcast-zone{flex-wrap:wrap;padding:12px;gap:10px;justify-content:space-between}
  .inp-prompt,.bcast-prompt{display:none}
  .inp-field,.bcast-field{flex:1 1 100%;min-width:100%;margin-bottom:5px;font-size:16px;padding:10px}
  .inp-send-btn,.bcast-send-btn{flex:1;clip-path:none!important;border-radius:8px;padding:14px;text-align:center}
  .inp-file-btn,.bcast-attach-btn{flex-shrink:0}
}
</style>
</head>
<body>

<div class="world">
  <div class="grid-layer"></div>
  <div class="grid-layer-2"></div>
  <div class="atm-blob atm-blob-1"></div>
  <div class="atm-blob atm-blob-2"></div>
  <div class="scanlines"></div>
</div>

<input type="file" id="file-input">
<input type="file" id="bcast-file-input">

<div class="login-screen" id="login-screen">
  <div class="login-frame">
    <div class="login-header">
      <div class="login-emblem">
        <svg viewBox="0 0 56 56" fill="none">
          <path d="M28 4L6 13v15c0 13.25 9.1 25.65 22 28.9C41.9 53.65 50 41.25 50 28V13L28 4z" stroke="#00d2ff" stroke-width="1.5" fill="rgba(0,100,200,0.08)"/>
          <path d="M20 28l6 6L36 20" stroke="#00ff88" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="login-title">HT-SECURITY</div>
      <div class="login-subtitle">TACTICAL COMMAND CENTER</div>
    </div>
    <div class="login-body">
      <div class="lf-group">
        <label class="lf-label">מזהה חדר</label>
        <input class="tac-input" id="inp-room" type="text" placeholder="ALPHA-NODE-7..." autocomplete="off">
      </div>
      <div class="lf-group">
        <label class="lf-label">מפתח הצפנה</label>
        <input class="tac-input" id="inp-pass" type="password" placeholder="••••••••••••••••">
      </div>
      <div class="enc-note">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L3 7v6c0 5.25 3.75 10.15 9 11.25C17.25 23.15 21 18.25 21 13V7L12 2z"/>
        </svg>
        <span>PBKDF2 · 100K iterations · AES-256-GCM · HMAC-SHA256 Token · מפתח לא עוזב את המכשיר</span>
      </div>
      <button class="tac-btn" id="btn-connect">⚡ INITIATE SECURE CONNECTION</button>
    </div>
  </div>
</div>

<div id="app" style="display:none">

  <header class="topbar">
    <div class="brand">
      <div class="brand-shield">
        <svg viewBox="0 0 32 32" fill="none">
          <path d="M16 2L3 8v9c0 8.28 5.73 16.04 13 18.18C23.27 33.04 29 25.28 29 17V8L16 2z" stroke="#00d2ff" stroke-width="1.5" fill="rgba(0,80,180,0.12)"/>
          <path d="M11 16l4 4 6-7" stroke="#00ff88" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div>
        <div class="brand-name">HT-SECURITY</div>
        <div class="brand-ver">FULL-MESH P2P · AES-256-GCM · HARDENED</div>
      </div>
    </div>

    <div class="metrics-bar">
      <div class="metric-item"><div class="metric-val" id="m-nodes">0</div><div class="metric-lbl">NODES</div></div>
      <div class="metric-item"><div class="metric-val green" id="m-msgs">0</div><div class="metric-lbl">MSG TX</div></div>
      <div class="metric-item"><div class="metric-val green" id="m-pkt">0</div><div class="metric-lbl">PACKETS</div></div>
    </div>

    <div class="topbar-right">
      <div class="node-tag">NODE: <em id="my-id-el">--------</em></div>
      <div class="status-chip enc"><span class="blink-dot"></span> E2EE</div>
    </div>
  </header>

  <aside class="panel-left">
    <div class="panel-head">
      <span class="ph-label">MESH NETWORK</span>
      <span class="ph-badge" id="n-count">0</span>
    </div>
    <div class="room-section">
      <div class="rs-row">
        <div class="room-display" id="room-disp">NO ROOM</div>
        <button class="tac-btn-sm red" id="btn-leave" disabled>LEAVE</button>
      </div>
      <div class="mic-block off" id="mic-block">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
        </svg>
        <span class="mic-text" id="mic-txt">MIC OFFLINE</span>
      </div>
    </div>
    <div class="panel-head" style="border-top:1px solid var(--border-mid)">
      <span class="ph-label">ACTIVE NODES</span>
    </div>
    <div class="nodes-scroll" id="nodes-scroll"></div>
  </aside>

  <main class="panel-center">
    <div class="console-head">
      <div class="ch-target">SECURE CHANNEL › <em id="ch-target">SELECT NODE</em></div>
      <div class="ch-enc-tag">🔒 AES-256-GCM · E2EE</div>
    </div>
    <div class="console-msgs" id="console-msgs">
      <div class="terminal-idle" id="terminal-idle">
        <div class="terminal-glyph">⬡</div>
        <div>AWAITING SECURE CHANNEL SELECTION</div>
        <div style="font-size:14px;margin-top:8px;letter-spacing:3px;color:var(--txt-lo)">BROADCAST AVAILABLE TO ALL NODES</div>
      </div>
    </div>
    <div class="input-zone">
      <span class="inp-prompt">›_</span>
      <input class="inp-field" id="inp-msg" type="text" placeholder="הודעה מוצפנת AES-256..." disabled>
      <button class="inp-file-btn" id="btn-attach" title="Data Packet" disabled>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
        </svg>
      </button>
      <button class="inp-send-btn" id="btn-send" disabled>TRANSMIT</button>
    </div>
    <div class="bcast-zone">
      <span class="bcast-prompt">&gt;&gt;</span>
      <input class="bcast-field" id="bcast-msg" type="text" placeholder="שידור לכל הרשת..." disabled>
      <button class="bcast-attach-btn" id="btn-bcast-attach" title="Broadcast File" disabled>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
        </svg>
      </button>
      <button class="bcast-send-btn" id="btn-bcast" disabled>BROADCAST</button>
    </div>
  </main>

  <aside class="panel-right">
    <div class="panel-head"><span class="ph-label">INTEL BOARD</span></div>
    <div class="intel-section">
      <div class="intel-title">NETWORK STATS</div>
      <div class="stats-grid">
        <div class="stat-box"><div class="sb-val" id="s-nodes">0</div><div class="sb-lbl">NODES</div></div>
        <div class="stat-box"><div class="sb-val g" id="s-msgs">0</div><div class="sb-lbl">MESSAGES</div></div>
        <div class="stat-box"><div class="sb-val" id="s-ch">0</div><div class="sb-lbl">CHANNELS</div></div>
        <div class="stat-box"><div class="sb-val g" id="s-pkt">0</div><div class="sb-lbl">PACKETS</div></div>
      </div>
    </div>
    <div class="intel-section">
      <div class="intel-title">LIVE METRICS</div>
      <div class="live-metrics">
        <div class="lm-row"><span class="lm-key">UPTIME</span><span class="lm-val g" id="lm-up">00:00:00</span></div>
        <div class="lm-row"><span class="lm-key">TX BYTES</span><span class="lm-val" id="lm-tx">0 B</span></div>
        <div class="lm-row"><span class="lm-key">RX BYTES</span><span class="lm-val" id="lm-rx">0 B</span></div>
        <div class="lm-row"><span class="lm-key">CIPHER</span><span class="lm-val g">AES-256-GCM</span></div>
        <div class="lm-row"><span class="lm-key">TOKEN</span><span class="lm-val g">HMAC-SHA256</span></div>
      </div>
    </div>
    <div class="intel-section">
      <div class="intel-title">ENCRYPTION</div>
      <div class="enc-block">
        <div class="eb-row"><span class="eb-key">ALGO</span><span class="eb-val">AES-256-GCM</span></div>
        <div class="eb-row"><span class="eb-key">IV SIZE</span><span class="eb-val">96 BIT</span></div>
        <div class="eb-row"><span class="eb-key">KDF ITER</span><span class="eb-val">100,000</span></div>
        <div class="eb-row"><span class="eb-key">CHUNK</span><span class="eb-val">16 KB</span></div>
        <div class="eb-row"><span class="eb-key">AUTH</span><span class="eb-val">HMAC-SHA256</span></div>
      </div>
    </div>
    <div class="panel-head" style="border-top:1px solid var(--border-mid)">
      <span class="ph-label">ACTIVITY LOG</span>
    </div>
    <div class="activity-log" id="activity-log"></div>
  </aside>
</div>

<script>
'use strict';

/* ══════════════════════════════════════════════════════════════
   HT-SECURITY MESH  ·  v3.0-FINAL (Hardened + History)
══════════════════════════════════════════════════════════════ */

const SIGNAL_URL  = 'https://ht-security-signaling-mesh.onrender.com';
const ICE_CONFIG  = [{ urls: 'stun:stun.l.google.com:19302' }];
const CHUNK_BYTES = 16 * 1024;

const peers = new Map();
let socket      = null;
let localStream = null;
let myId        = null;
let currentRoom = null;
let authToken   = null;
let cryptoKey   = null;
let _rawPass    = null;   
let activePeer  = null;
let totalMsgs   = 0;
let totalPkts   = 0;
let txBytes     = 0;
let rxBytes     = 0;
let micOn       = false;
let uptimeStart = null;
const fileRx    = new Map();
const seenNonces = new Set(); 

const $ = id => document.getElementById(id);
const loginScreen    = $('login-screen');
const appEl          = $('app');
const inpRoom        = $('inp-room');
const inpPass        = $('inp-pass');
const btnConnect     = $('btn-connect');
const roomDisp       = $('room-disp');
const btnLeave       = $('btn-leave');
const nodesScroll    = $('nodes-scroll');
const consoleMsgs    = $('console-msgs');
const inpMsg         = $('inp-msg');
const btnSend        = $('btn-send');
const btnAttach      = $('btn-attach');
const fileInput      = $('file-input');
const bcastMsg       = $('bcast-msg');
const btnBcast       = $('btn-bcast');
const btnBcastAttach = $('btn-bcast-attach');
const bcastFileInput = $('bcast-file-input');
const micBlock       = $('mic-block');
const micTxt         = $('mic-txt');
const chTarget       = $('ch-target');
const myIdEl         = $('my-id-el');
const actLog         = $('activity-log');

/* ── 🔒 Security: HMAC & AES ── */
async function deriveKey(pass, room) {
  const e    = new TextEncoder();
  const base = await crypto.subtle.importKey('raw', e.encode(pass), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name:'PBKDF2', salt:e.encode(room), iterations:100_000, hash:'SHA-256' },
    base, { name:'AES-GCM', length:256 }, false, ['encrypt','decrypt']
  );
}

async function encrypt(plainBuf) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name:'AES-GCM', iv }, cryptoKey, plainBuf);
  const out = new Uint8Array(12 + ct.byteLength);
  out.set(iv); out.set(new Uint8Array(ct), 12);
  return out.buffer;
}

async function decrypt(encBuf) {
  const a = new Uint8Array(encBuf);
  return crypto.subtle.decrypt({ name:'AES-GCM', iv:a.slice(0,12) }, cryptoKey, a.slice(12));
}

async function makeToken(room, pass) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(pass), { name:'HMAC', hash:'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(room));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

async function validToken(token) {
  if (!token || !currentRoom || !_rawPass) return false;
  const expected = await makeToken(currentRoom, _rawPass);
  return token === expected;
}

/* ── 🚀 LOGIN ── */
btnConnect.addEventListener('click', doConnect);
inpPass.addEventListener('keydown', e => { if (e.key === 'Enter') doConnect(); });

async function doConnect() {
  const room = inpRoom.value.trim();
  const pass = inpPass.value;
  if (!room || !pass) return;
  btnConnect.textContent = 'INITIALIZING CRYPTO...';
  btnConnect.disabled = true;

  _rawPass    = pass;
  cryptoKey   = await deriveKey(pass, room);
  authToken   = await makeToken(room, pass); 
  currentRoom = room;
  uptimeStart = Date.now();

  loginScreen.classList.add('gone');
  appEl.style.display = '';
  roomDisp.textContent = `#${room}`;
  bcastMsg.disabled        = false;
  btnBcast.disabled        = false;
  btnBcastAttach.disabled  = false;

  initSocket();
  setInterval(updateUptime, 1000);
}

/* ── 🛰️ SOCKET ── */
function initSocket() {
  socket = io(SIGNAL_URL, { transports: ['websocket'] });

  socket.on('connect', () => {
    myId = socket.id;
    myIdEl.textContent = short(myId);
    socket.emit('join-room', { room: currentRoom, token: authToken });
    logAct('SOCKET CONNECTED', 'g');
    btnLeave.disabled = false;
    updateStats();
  });

  socket.on('disconnect', () => {
    cleanAll();
    logAct('SOCKET DISCONNECTED', 'r');
    btnLeave.disabled = true;
  });

  socket.on('auth-rejected', ({ reason }) => {
    sysMsg(`CONNECTION REJECTED: ${reason || 'invalid token'}`, 'warn');
    logAct('AUTH REJECTED BY SERVER', 'r');
  });

  socket.on('room-peers', async ({ peers: existing }) => {
    for (const pid of existing) {
      if (pid !== myId && !peers.has(pid)) await mkPeer(pid, true);
    }
  });

  socket.on('user-connected', async ({ peerId }) => {
    sysMsg(`NODE ${short(peerId)} JOINED MESH`, 'join');
    logAct(`+NODE ${short(peerId)}`, 'g');
    if (!peers.has(peerId)) await mkPeer(peerId, false);
    renderNodes(); updateStats();
  });

  socket.on('user-disconnected', ({ peerId }) => {
    sysMsg(`NODE ${short(peerId)} LEFT MESH`, 'leave');
    logAct(`-NODE ${short(peerId)}`, 'r');
    cleanPeer(peerId);
  });

  socket.on('offer', async (data) => {
    const rToken = data.token || data.auth;
    if (!await validToken(rToken)) {
      logAct('AUTH REJECTED: TOKEN MISMATCH', 'r');
      sysMsg(`BLOCKED: WRONG PASSWORD FROM ${short(data.from)}`, 'warn');
      return;
    }
    if (!peers.has(data.from)) await mkPeer(data.from, false);
    const peerEntry = peers.get(data.from);
    if (peerEntry?.pc) {
      try {
        if (peerEntry.pc.signalingState !== 'stable') {
          await peerEntry.pc.setLocalDescription({ type: 'rollback' });
        }
        await peerEntry.pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const ans = await peerEntry.pc.createAnswer();
        await peerEntry.pc.setLocalDescription(ans);
        socket.emit('answer', { to: data.from, answer: ans, token: authToken, auth: authToken });
      } catch(e) { console.error('Offer error', e); }
    }
  });

  socket.on('answer', async (data) => {
    const rToken = data.token || data.auth;
    if (!await validToken(rToken)) return;
    const e = peers.get(data.from);
    if (e?.pc) try { await e.pc.setRemoteDescription(new RTCSessionDescription(data.answer)); } catch(_) {}
  });

  socket.on('ice-candidate', async (data) => {
    const rToken = data.token || data.auth;
    if (!await validToken(rToken)) return;
    const e = peers.get(data.from);
    if (e?.pc && data.candidate) try { await e.pc.addIceCandidate(new RTCIceCandidate(data.candidate)); } catch(_) {}
  });
}

/* ── 📡 WebRTC ── */
async function mkPeer(pid, isInit) {
  const pc    = new RTCPeerConnection({ iceServers: ICE_CONFIG });
  const entry = { pc, dc: null, audioEl: null, unread: 0, history: [] }; // ✅ added history
  peers.set(pid, entry);

  if (localStream) {
    localStream.getTracks().forEach(t => { try { pc.addTrack(t, localStream); } catch(_) {} });
  }

  pc.ontrack = ({ streams }) => {
    if (!entry.audioEl && streams?.[0]) {
      const a = document.createElement('audio');
      a.autoplay   = true;
      a.srcObject  = streams[0];
      document.body.appendChild(a);
      entry.audioEl = a;
    }
  };

  pc.onnegotiationneeded = async () => {
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('offer', { to: pid, offer, token: authToken, auth: authToken });
    } catch(e) {}
  };

  pc.onicecandidate = ({ candidate }) => {
    if (candidate) socket.emit('ice-candidate', { to: pid, candidate, token: authToken, auth: authToken });
  };

  pc.onconnectionstatechange = () => {
    renderNodes(); updateStats();
    if (pc.connectionState === 'failed' || pc.connectionState === 'closed') cleanPeer(pid);
    if (pc.connectionState === 'connected') logAct(`CHANNEL UP: ${short(pid)}`, 'g');
  };

  if (isInit) {
    const dc = pc.createDataChannel('sec', { ordered: true });
    dc.binaryType = 'arraybuffer';
    entry.dc = dc;
    wireDC(dc, pid);
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('offer', { to: pid, offer, token: authToken, auth: authToken });
    } catch(_) {}
  } else {
    pc.ondatachannel = ({ channel }) => {
      channel.binaryType = 'arraybuffer';
      entry.dc = channel;
      wireDC(channel, pid);
    };
  }

  renderNodes(); updateStats();
  return entry;
}

function wireDC(dc, pid) {
  dc.onopen  = () => { renderNodes(); updateStats(); logAct(`DC OPEN: ${short(pid)}`, 'b'); };
  dc.onclose = () => { renderNodes(); updateStats(); };

  dc.onmessage = async ({ data }) => {
    if (!(data instanceof ArrayBuffer)) return;
    rxBytes += data.byteLength;
    let plain;
    try { plain = await decrypt(data); }
    catch(_) { logAct('DECRYPT FAILED', 'r'); return; }
    let msg;
    try { msg = JSON.parse(new TextDecoder().decode(plain)); } catch(_) { return; }

    // ✅ FIX VULN-001: Replay Protection
    if (seenNonces.has(msg.nonce) || (Date.now() - msg.ts > 60000)) return;
    seenNonces.add(msg.nonce);

    const e = peers.get(pid);
    if (!e) return;

    if (msg.type === 'text') {
      totalMsgs++; totalPkts++;
      e.history.push({ dir: 'in', content: msg.content, ts: msg.ts }); // ✅ Save history
      if (activePeer === pid) {
          appendMsg(msg.content, 'in', pid);
      } else { 
          e.unread++; renderNodes(); 
      }
    } else if (msg.type === 'file-chunk') {
      handleChunk(msg, pid);
    } else if (msg.type === 'broadcast') {
      appendBcast(msg.content, pid); totalPkts++;
    }
    updateStats();
  };
}

/* ── 💬 SEND ── */
async function sendText() {
  const text = inpMsg.value.trim();
  if (!text || !activePeer) return;
  const e = peers.get(activePeer);
  if (!e?.dc || e.dc.readyState !== 'open') { logAct('CHANNEL NOT READY', 'r'); return; }
  
  const payload = { type:'text', content:text, ts:Date.now(), nonce:crypto.randomUUID() };
  const enc = await encrypt(new TextEncoder().encode(JSON.stringify(payload)));
  e.dc.send(enc);
  txBytes += enc.byteLength;
  
  e.history.push({ dir: 'out', content: text, ts: Date.now() }); // ✅ Save history
  appendMsg(text, 'out', myId);
  inpMsg.value = '';
  totalMsgs++; totalPkts++;
  updateStats();
}

async function sendBroadcast() {
  const text = bcastMsg.value.trim();
  if (!text) return;
  let n = 0;
  const payload = { type:'broadcast', content:text, ts:Date.now(), nonce:crypto.randomUUID() };
  const enc = await encrypt(new TextEncoder().encode(JSON.stringify(payload)));
  for (const e of peers.values()) {
    if (e.dc?.readyState === 'open') {
      e.dc.send(enc); txBytes += enc.byteLength; n++;
    }
  }
  if (n) { appendBcast(text, 'me'); bcastMsg.value = ''; totalPkts += n; updateStats(); }
}

async function sendFile(file, target) {
  if (target !== 'all' && !peers.has(target)) { logAct('SELECT A NODE FIRST', 'r'); return; }
  const buf    = await file.arrayBuffer();
  const total  = Math.ceil(buf.byteLength / CHUNK_BYTES);
  const fid    = crypto.randomUUID();
  const progId = appendPktSend(target === 'all' ? `[BCAST] ${file.name}` : file.name, file.size);
  logAct(`TX FILE: ${file.name}`, 'b');

  for (let i = 0; i < total; i++) {
    const chunk = buf.slice(i * CHUNK_BYTES, (i + 1) * CHUNK_BYTES);
    const msg   = { type:'file-chunk', fid, index:i, total, name:file.name, size:file.size, data:Array.from(new Uint8Array(chunk)) };
    const enc   = await encrypt(new TextEncoder().encode(JSON.stringify(msg)));
    let sent = 0;
    if (target === 'all') {
      peers.forEach(p => { if (p.dc?.readyState === 'open') { p.dc.send(enc); txBytes += enc.byteLength; sent++; } });
    } else {
      const p = peers.get(target);
      if (p?.dc?.readyState === 'open') { p.dc.send(enc); txBytes += enc.byteLength; sent++; }
    }
    totalPkts += sent;
    updatePktProg(progId, (i + 1) / total);
    if (i % 8 === 7) await new Promise(r => setTimeout(r, 8));
  }
  updateStats();
}

async function sendBroadcastFile(file) {
  let open = 0;
  peers.forEach(e => { if (e.dc?.readyState === 'open') open++; });
  if (open === 0) { sysMsg('NO ACTIVE NODES TO BROADCAST TO', 'warn'); return; }
  sendFile(file, 'all');
}

/* ✅ FIX-006: Chunk bounds validation — OOM protection */
function handleChunk(msg, pid) {
  if (!msg.fid || typeof msg.fid !== 'string') return;
  if (!Number.isInteger(msg.total) || msg.total < 1 || msg.total > 1000) return;
  if (!Number.isInteger(msg.index) || msg.index < 0 || msg.index >= msg.total) return;
  if (!Number.isInteger(msg.size)  || msg.size > 200 * 1024 * 1024) return;
  if (!msg.data || !Array.isArray(msg.data) || msg.data.length > CHUNK_BYTES + 100) return;
  if (typeof msg.name !== 'string' || msg.name.length > 255) return;

  const key = `${pid}:${msg.fid}`;
  if (!fileRx.has(key)) fileRx.set(key, { chunks:[], total:msg.total, name:msg.name, size:msg.size });
  const st = fileRx.get(key);
  if (st.total !== msg.total) { fileRx.delete(key); return; }

  st.chunks[msg.index] = new Uint8Array(msg.data);
  rxBytes += msg.data.length;
  totalPkts++;

  if (st.chunks.filter(Boolean).length === st.total) {
    fileRx.delete(key);
    let off = 0;
    const full = new Uint8Array(st.chunks.reduce((s, c) => s + c.length, 0));
    st.chunks.forEach(c => { full.set(c, off); off += c.length; });
    appendPktRecv(st.name, st.size, full.buffer, pid);
    logAct(`RX FILE: ${st.name}`, 'g');
  }
  updateStats();
}

/* ── 🎤 MICROPHONE ── */
micBlock.addEventListener('click', async () => {
  if (!micOn) {
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ audio:true, video:false });
      micOn = true;
      micBlock.className = 'mic-block on';
      micTxt.textContent = 'MIC LIVE';
      peers.forEach(async (entry, pid) => {
        if (entry.pc?.signalingState !== 'closed') {
          localStream.getTracks().forEach(t => { try { entry.pc.addTrack(t, localStream); } catch(_) {} });
          try {
            const offer = await entry.pc.createOffer();
            await entry.pc.setLocalDescription(offer);
            socket.emit('offer', { to: pid, offer, token: authToken, auth: authToken });
          } catch(_) {}
        }
      });
      logAct('MICROPHONE ARMED', 'g');
    } catch { sysMsg('MICROPHONE ACCESS DENIED', 'warn'); logAct('MIC ACCESS DENIED', 'r'); }
  } else {
    if (localStream) {
      const tracks  = localStream.getAudioTracks();
      tracks.forEach(t => { t.enabled = !t.enabled; });
      const muted   = !tracks[0]?.enabled;
      micBlock.className = `mic-block ${muted ? 'off' : 'on'}`;
      micTxt.textContent = muted ? 'MIC MUTED' : 'MIC LIVE';
      logAct(muted ? 'CHANNEL MUTED' : 'CHANNEL LIVE', muted ? 'a' : 'g');
    }
  }
});

function stopMic() {
  if (localStream) { localStream.getTracks().forEach(t => t.stop()); localStream = null; }
  micOn = false;
  micBlock.className = 'mic-block off';
  micTxt.textContent = 'MIC OFFLINE';
}

/* ── 🧹 CLEANUP ── */
function cleanPeer(pid) {
  const e = peers.get(pid);
  if (!e) return;
  if (e.dc)      { try { e.dc.close(); }      catch(_) {} e.dc      = null; }
  if (e.pc)      { try { e.pc.close(); }      catch(_) {} e.pc      = null; }
  if (e.audioEl) { try { e.audioEl.srcObject = null; e.audioEl.remove(); } catch(_) {} e.audioEl = null; }
  peers.delete(pid);
  if (activePeer === pid) { activePeer = null; resetConsole(); }
  renderNodes(); updateStats();
}

function cleanAll() {
  [...peers.keys()].forEach(cleanPeer);
  stopMic(); renderNodes(); updateStats();
}

/* ── 🖥️ UI & EVENTS ── */
function renderNodes() {
  nodesScroll.innerHTML = '';
  if (peers.size === 0) {
    nodesScroll.innerHTML = '<div style="text-align:center;padding:40px;color:var(--txt-mid);font-family:var(--font-mono);font-size:14px;font-weight:bold;letter-spacing:2px;animation:blink 1.5s step-end infinite;">SCANNING MESH...</div>';
    return;
  }
  peers.forEach((entry, pid) => {
    const st   = peerState(entry);
    const card = document.createElement('div');
    card.className = `node-card${activePeer === pid ? ' active' : ''}`;
    card.dataset.id = pid;
    card.innerHTML = `
      <div class="nc-avatar${entry.speaking ? ' speaking' : ''}" style="${st==='connected'?'border-color:rgba(0,255,136,.5);color:var(--c-green)':''}">${short(pid).slice(0,2).toUpperCase()}</div>
      <div class="nc-info">
        <div class="nc-id">${short(pid)}</div>
        <div class="nc-state ${st}">${{connected:'● CONNECTED',connecting:'◌ LINKING...',failed:'✕ FAILED'}[st]}${entry.dc?.readyState==='open'?' 🔒':''}</div>
      </div>
      ${entry.unread > 0 ? `<div class="nc-unread">${entry.unread}</div>` : ''}
    `;
    card.addEventListener('click', () => selectPeer(pid));
    nodesScroll.appendChild(card);
  });
  $('n-count').textContent = peers.size;
}

function peerState(e) {
  if (!e.pc) return 'failed';
  return { connected:'connected', connecting:'connecting', new:'connecting' }[e.pc.connectionState] || 'failed';
}

function selectPeer(pid) {
  activePeer = pid;
  const e    = peers.get(pid);
  if (e) {
    e.unread = 0;
    chTarget.textContent = short(pid);
    inpMsg.disabled  = false;
    btnSend.disabled = false;
    btnAttach.disabled = false;
    $('terminal-idle')?.remove();
    // ✅ Load history for selected peer
    consoleMsgs.innerHTML = '';
    e.history.forEach(m => appendMsg(m.content, m.dir, pid));
    renderNodes();
  }
}

function resetConsole() {
  chTarget.textContent   = 'SELECT NODE';
  inpMsg.disabled        = true;
  btnSend.disabled       = true;
  btnAttach.disabled     = true;
  if (!$('terminal-idle')) {
    const d = document.createElement('div');
    d.className = 'terminal-idle'; d.id = 'terminal-idle';
    d.innerHTML = '<div class="terminal-glyph">⬡</div><div>AWAITING SECURE CHANNEL SELECTION</div><div style="font-size:14px;margin-top:8px;letter-spacing:3px;color:var(--txt-lo)">BROADCAST AVAILABLE TO ALL NODES</div>';
    consoleMsgs.prepend(d);
  }
}

function appendMsg(text, dir, fromId) {
  $('terminal-idle')?.remove();
  const row = document.createElement('div');
  row.className = `cmd-row ${dir}`;
  
  const bubble = document.createElement('div');
  bubble.className = 'cmd-bubble';
  
  const meta = document.createElement('div');
  meta.className = 'cmd-meta';
  meta.textContent = `${dir === 'in' ? short(fromId) + ' RX' : 'TX'} · ${ts()}`;
  
  // ✅ FIX VULN-002: Safe text injection (XSS proof)
  const content = document.createElement('div');
  content.textContent = text;
  
  bubble.appendChild(meta);
  bubble.appendChild(content);
  row.appendChild(bubble);
  
  consoleMsgs.appendChild(row);
  consoleMsgs.scrollTop = consoleMsgs.scrollHeight;
}

function appendBcast(text, fromId) {
  $('terminal-idle')?.remove();
  const d = document.createElement('div');
  d.className = 'bcast-msg';
  
  const hdr = document.createElement('div');
  hdr.className = 'bcast-hdr';
  hdr.textContent = `${fromId==='me'?'TX':'RX'} BROADCAST · ${ts()}`;
  
  const content = document.createElement('div');
  content.textContent = text;
  
  d.appendChild(hdr);
  d.appendChild(content);
  consoleMsgs.appendChild(d);
  consoleMsgs.scrollTop = consoleMsgs.scrollHeight;
}

function sysMsg(text, cls = '') {
  $('terminal-idle')?.remove();
  const d = document.createElement('div');
  d.className = `sys-line ${cls}`;
  d.textContent = `[${ts()}] ${text}`;
  consoleMsgs.appendChild(d);
  consoleMsgs.scrollTop = consoleMsgs.scrollHeight;
}

let pktCtr = 0;
function appendPktSend(name, size) {
  $('terminal-idle')?.remove();
  const id  = `pkt${++pktCtr}`;
  const row = document.createElement('div');
  row.className = 'pkt-row out'; row.id = id;
  
  // Safe HTML construction
  row.innerHTML = `
    <div class="data-packet">
      <div class="pkt-head"><span class="pkt-type-tag">TX PACKET</span><span class="pkt-ts">${ts()}</span></div>
      <div class="pkt-body">
        <div class="pkt-icon">📦</div>
        <div class="pkt-info"><div class="pkt-name"></div><div class="pkt-detail">${fmtSz(size)} · ENCRYPTING & TRANSMITTING...</div></div>
      </div>
      <div class="pkt-progress"><div class="pkt-progress-fill" style="width:0%"></div></div>
    </div>`;
    
  row.querySelector('.pkt-name').textContent = name; // Safe assignment
  consoleMsgs.appendChild(row);
  consoleMsgs.scrollTop = consoleMsgs.scrollHeight;
  return id;
}

function updatePktProg(id, ratio) {
  const fill = document.querySelector(`#${id} .pkt-progress-fill`);
  if (fill) fill.style.width = `${Math.round(ratio * 100)}%`;
  if (ratio >= 1) {
    const det = document.querySelector(`#${id} .pkt-detail`);
    if (det) det.textContent = '— TRANSMITTED ✓';
  }
}

function appendPktRecv(name, size, buffer, fromId) {
  $('terminal-idle')?.remove();
  const id   = `pkt-rx-${++pktCtr}`;
  const blob = new Blob([buffer], { type:'application/octet-stream' });
  const url  = URL.createObjectURL(blob);
  const row  = document.createElement('div');
  row.className = 'pkt-row in';
  
  row.innerHTML = `
    <div class="data-packet" id="${id}">
      <div class="pkt-head"><span class="pkt-type-tag" style="background:var(--c-green)">RX PACKET</span><span class="pkt-ts">← ${short(fromId)} · ${ts()}</span></div>
      <div class="pkt-body">
        <div class="pkt-icon">📥</div>
        <div class="pkt-info"><div class="pkt-name"></div><div class="pkt-detail">${fmtSz(size)} · לחץ להורדה</div></div>
      </div>
    </div>`;
    
  row.querySelector('.pkt-name').textContent = name; // Safe assignment
  consoleMsgs.appendChild(row);
  consoleMsgs.scrollTop = consoleMsgs.scrollHeight;
  
  document.getElementById(id).addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  });
}

function logAct(msg, cls = '') {
  const d = document.createElement('div');
  d.className = 'act-entry';
  const tsSpan = document.createElement('span');
  tsSpan.className = 'act-ts';
  tsSpan.textContent = ts() + " ";
  const msgSpan = document.createElement('span');
  msgSpan.className = `act-msg ${cls}`;
  msgSpan.textContent = msg;
  d.appendChild(tsSpan);
  d.appendChild(msgSpan);
  actLog.appendChild(d);
  actLog.scrollTop = actLog.scrollHeight;
  while (actLog.children.length > 80) actLog.removeChild(actLog.firstChild);
}

function updateStats() {
  let open = 0;
  peers.forEach(e => { if (e.dc?.readyState === 'open') open++; });
  const n = (socket?.connected) ? peers.size + 1 : 0;
  $('n-count').textContent  = n;
  $('s-nodes').textContent  = n;   $('m-nodes').textContent = n;
  $('s-msgs').textContent   = totalMsgs; $('m-msgs').textContent = totalMsgs;
  $('s-ch').textContent     = open;
  $('s-pkt').textContent    = totalPkts; $('m-pkt').textContent = totalPkts;
  $('lm-tx').textContent    = fmtSz(txBytes);
  $('lm-rx').textContent    = fmtSz(rxBytes);
}

function updateUptime() {
  if (!uptimeStart) return;
  const s  = Math.floor((Date.now() - uptimeStart) / 1000);
  const h  = String(Math.floor(s / 3600)).padStart(2, '0');
  const m  = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  $('lm-up').textContent = `${h}:${m}:${ss}`;
}

btnSend.addEventListener('click', sendText);
inpMsg.addEventListener('keydown', e => { if (e.key === 'Enter') sendText(); });
btnBcast.addEventListener('click', sendBroadcast);
bcastMsg.addEventListener('keydown', e => { if (e.key === 'Enter') sendBroadcast(); });

btnAttach.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) sendFile(fileInput.files[0], activePeer);
  fileInput.value = '';
});

btnBcastAttach.addEventListener('click', () => bcastFileInput.click());
bcastFileInput.addEventListener('change', () => {
  if (bcastFileInput.files[0]) sendBroadcastFile(bcastFileInput.files[0]);
  bcastFileInput.value = '';
});

btnLeave.addEventListener('click', () => {
  if (socket) socket.emit('leave-room', { room: currentRoom });
  cleanAll();
  loginScreen.classList.remove('gone');
  appEl.style.display    = 'none';
  
  // Wipe sensitive data
  currentRoom = null; authToken = null; cryptoKey = null; _rawPass = null;
  
  btnConnect.textContent   = '⚡ INITIATE SECURE CONNECTION';
  btnConnect.disabled      = false;
  bcastMsg.disabled        = true;
  btnBcast.disabled        = true;
  btnBcastAttach.disabled  = true;
});

const short = id  => id ? id.substring(0, 8) : '????????';
const ts    = ()  => new Date().toLocaleTimeString('he-IL', { hour12: false });
const fmtSz = b   => b > 1e9 ? `${(b/1e9).toFixed(2)} GB` : b > 1e6 ? `${(b/1e6).toFixed(1)} MB` : b > 1e3 ? `${(b/1e3).toFixed(0)} KB` : `${b} B`;
</script>
</body>
</html>
