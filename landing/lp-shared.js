/* ============================================================
   Bezant landing — shared kit: CSS, mark, mini app screens, scenes
   Exposes window.LP = { css, mark, phone, screens }
   ============================================================ */
(function () {
  const css = `
  .lp{position:relative;width:100%;height:100%;background:#0A0C0B;color:#E9ECE8;
    font-family:-apple-system,"SF Pro Display",system-ui,sans-serif;-webkit-font-smoothing:antialiased;
    overflow:hidden;display:flex;flex-direction:column;}
  .lp *{box-sizing:border-box;margin:0;padding:0;}
  .lp .mono{font-family:ui-monospace,"SF Mono","JetBrains Mono",monospace;font-feature-settings:"tnum" 1;}
  .lp a,.lp button{color:inherit;font-family:inherit;background:none;border:none;cursor:pointer;text-decoration:none;}

  /* ambient drift (looping) */
  .lp-amb{position:absolute;inset:-20%;pointer-events:none;opacity:.8;
    background:radial-gradient(40% 30% at 78% 10%,rgba(53,224,161,.13),transparent 60%),
               radial-gradient(36% 28% at 12% 86%,rgba(94,168,224,.09),transparent 60%);
    animation:lpDrift 26s ease-in-out infinite alternate;}
  @keyframes lpDrift{from{transform:translate(0,0) scale(1)}to{transform:translate(3%,-2%) scale(1.06)}}

  /* nav */
  .lp-nav{display:flex;justify-content:space-between;align-items:center;padding:26px 64px;position:relative;z-index:2;}
  .lp-brand{display:flex;align-items:center;gap:9px;}
  .lp-wm{font-size:19px;font-weight:600;letter-spacing:-.03em;}
  .lp-links{display:flex;gap:30px;font-size:14px;color:#8B928B;}
  .lp-links span:hover{color:#E9ECE8;}
  .lp .lp-navcta{font-size:13.5px;font-weight:600;color:#35E0A1;border:1px solid rgba(53,224,161,.35);
    padding:9px 18px;border-radius:99px;background:rgba(53,224,161,.08);}

  /* type */
  .lp-kicker{font-family:ui-monospace,monospace;font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:#35E0A1;}
  .lp-h1{font-size:62px;font-weight:650;letter-spacing:-.04em;line-height:1.04;}
  .lp-h2{font-size:34px;font-weight:650;letter-spacing:-.03em;line-height:1.1;}
  .lp-sub{font-size:17px;line-height:1.6;color:#8B928B;}
  .lp-sub b{color:#E9ECE8;font-weight:550;}

  /* buttons */
  .lp .lp-btn{display:inline-flex;align-items:center;gap:9px;background:#35E0A1;color:#04130d;
    font-size:15.5px;font-weight:650;padding:15px 28px;border-radius:14px;box-shadow:0 0 30px -8px #35E0A1;}
  .lp .lp-btn-ghost{display:inline-flex;align-items:center;gap:8px;font-size:14.5px;font-weight:550;color:#8B928B;
    padding:15px 22px;border-radius:14px;border:1px solid rgba(255,255,255,.12);}
  .lp-ctanote{font-family:ui-monospace,monospace;font-size:11.5px;color:#555C58;letter-spacing:.06em;}

  /* feature cards */
  .lp-feats{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding:0 64px;position:relative;z-index:1;}
  .lp-feat{background:#111513;border:1px solid rgba(255,255,255,.07);border-radius:22px;padding:28px 26px;
    display:flex;flex-direction:column;gap:12px;}
  .lp-feat h3{font-size:18px;font-weight:600;letter-spacing:-.01em;}
  .lp-feat p{font-size:13.5px;line-height:1.6;color:#8B928B;}
  .lp-fstage{height:84px;display:flex;align-items:center;}

  /* privacy band */
  .lp-priv{margin:0 64px;border:1px solid rgba(255,255,255,.07);border-radius:24px;background:#0E1211;
    padding:42px 48px;display:flex;align-items:center;gap:36px;position:relative;overflow:hidden;}
  .lp-priv::before{content:"";position:absolute;right:-10%;top:-40%;width:50%;height:180%;
    background:radial-gradient(circle,rgba(53,224,161,.10),transparent 65%);}
  .lp-lock{width:64px;height:64px;border-radius:20px;background:rgba(53,224,161,.12);display:grid;place-items:center;flex:0 0 auto;color:#35E0A1;}
  .lp-priv h3{font-size:22px;font-weight:600;letter-spacing:-.02em;margin-bottom:8px;}
  .lp-priv p{font-size:14px;line-height:1.6;color:#8B928B;max-width:560px;}

  /* waitlist cta */
  .lp-ctasec{display:flex;flex-direction:column;align-items:center;gap:20px;text-align:center;padding:0 64px;position:relative;z-index:1;}
  .lp-mailrow{display:flex;gap:10px;}
  .lp-input{background:#111513;border:1px solid rgba(255,255,255,.12);border-radius:13px;padding:14px 18px;
    color:#E9ECE8;font-size:14.5px;width:300px;outline:none;font-family:inherit;}
  .lp-input::placeholder{color:#555C58;}

  /* footer */
  .lp-foot{margin-top:auto;display:flex;justify-content:space-between;align-items:center;padding:26px 64px;
    border-top:1px solid rgba(255,255,255,.06);font-family:ui-monospace,monospace;font-size:11.5px;color:#555C58;letter-spacing:.05em;}

  /* phone shell + mini screens */
  .lp-phone{width:280px;background:#000;border-radius:44px;padding:10px;flex:0 0 auto;
    box-shadow:0 0 0 1.5px #1c201d,0 40px 80px -30px rgba(0,0,0,.9);position:relative;}
  .lp-phone::before{content:"";position:absolute;top:20px;left:50%;transform:translateX(-50%);width:84px;height:24px;background:#000;border-radius:14px;z-index:3;}
  .lp-scr{background:#0A0C0B;border-radius:35px;overflow:hidden;height:560px;padding:46px 18px 18px;
    display:flex;flex-direction:column;gap:13px;
    background-image:radial-gradient(110% 50% at 88% -4%,rgba(53,224,161,.15),transparent 56%);}
  .lp-cap{font-family:ui-monospace,monospace;font-size:9px;letter-spacing:.18em;color:#555C58;text-transform:uppercase;}
  .lp-big{font-size:34px;font-weight:650;letter-spacing:-.04em;}
  .lp-big .c{color:#555C58;}
  .lp-mini-sub{font-size:11px;color:#8B928B;}
  .lp-tilegrid{display:grid;grid-template-columns:1fr 1fr;gap:9px;}
  .lp-tile{position:relative;border-radius:15px;padding:12px;height:86px;overflow:hidden;
    background:linear-gradient(150deg,#10231b,#0a0f0c 70%);border:1px solid rgba(53,224,161,.16);
    display:flex;flex-direction:column;justify-content:flex-end;gap:1px;}
  .lp-tile.blue{background:linear-gradient(150deg,#0f1c28,#0a0d10 70%);border-color:rgba(94,168,224,.16);}
  .lp-tile .tl{font-size:9.5px;color:#8B928B;font-weight:600;}
  .lp-tile .tv{font-size:16px;font-weight:700;letter-spacing:-.02em;}
  .lp-ring{position:absolute;top:10px;right:10px;opacity:.9;}
  .lp-bars{position:absolute;top:14px;right:12px;display:flex;align-items:flex-end;gap:3px;height:26px;}
  .lp-bars i{width:5px;border-radius:2px;background:#5EA8E0;opacity:.75;}
  .lp-row{display:flex;align-items:center;gap:10px;background:#111513;border:1px solid rgba(255,255,255,.06);
    border-radius:13px;padding:10px 12px;}
  .lp-dot{width:26px;height:26px;border-radius:9px;display:grid;place-items:center;flex:0 0 auto;}
  .lp-rn{flex:1;font-size:12px;font-weight:550;}
  .lp-ra{font-size:12px;font-weight:650;}
  .lp-pct{font-size:9.5px;font-weight:700;padding:2px 7px;border-radius:99px;}
  .lp-strip{display:flex;height:14px;border-radius:99px;overflow:hidden;gap:2px;}
  .lp-strip span{height:100%;}
  .lp-rail{display:flex;gap:6px;}
  .lp-railp{font-family:ui-monospace,monospace;font-size:9.5px;font-weight:600;color:#555C58;padding:5px 10px;border-radius:99px;border:1px solid rgba(255,255,255,.08);}
  .lp-railp.on{color:#35E0A1;background:rgba(53,224,161,.12);border-color:rgba(53,224,161,.3);}
  .lp-fundbar{height:6px;border-radius:99px;background:rgba(255,255,255,.07);overflow:hidden;}
  .lp-fundbar i{display:block;height:100%;width:16%;border-radius:99px;background:linear-gradient(90deg,#1F8F66,#35E0A1);}

  /* looping scenes */
  @keyframes lpSpin{to{transform:rotate(360deg)}}
  @keyframes lpBreath{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
  @keyframes lpFloat{0%,100%{transform:translateY(0) rotate(var(--r,0deg))}50%{transform:translateY(-14px) rotate(var(--r,0deg))}}
  @keyframes lpFall{0%{opacity:0;transform:translateY(0) scale(.8)}12%{opacity:1}80%{opacity:1}100%{opacity:0;transform:translateY(64px) scale(.85)}}
  @keyframes lpEq{0%,100%{transform:scaleY(.5)}50%{transform:scaleY(1)}}
  @keyframes lpClimb{0%{transform:translateY(100%)}40%,75%{transform:translateY(0)}100%{transform:translateY(100%)}}
  @keyframes lpBlink{0%,55%{opacity:1}60%,100%{opacity:0}}
  @keyframes lpShine{0%{transform:translateX(-130%)}55%,100%{transform:translateX(130%)}}

  .lp-orbit{position:relative;width:64px;height:64px;flex:0 0 auto;}
  .lp-orbit .core{position:absolute;top:50%;left:50%;width:16px;height:16px;margin:-8px;border-radius:50%;
    background:radial-gradient(circle at 38% 32%,#6df2c4,#1b9f72);box-shadow:0 0 14px -2px #35E0A1;animation:lpBreath 4s ease-in-out infinite;}
  .lp-orbit .ring{position:absolute;inset:4px;border:1px solid rgba(255,255,255,.12);border-radius:50%;animation:lpSpin 9s linear infinite;}
  .lp-orbit .ring i{position:absolute;top:-4px;left:50%;width:8px;height:8px;margin-left:-4px;border-radius:50%;background:#5EA8E0;box-shadow:0 0 8px -1px #5EA8E0;}
  .lp-orbit .ring.r2{inset:16px;animation-duration:14s;animation-direction:reverse;}
  .lp-orbit .ring.r2 i{background:#E8A23C;box-shadow:0 0 8px -1px #E8A23C;}

  .lp-coins{position:relative;width:74px;height:72px;flex:0 0 auto;overflow:hidden;}
  .lp-coins i{position:absolute;top:2px;width:12px;height:12px;border-radius:50%;
    background:radial-gradient(circle at 38% 32%,#6df2c4,#1b9f72);box-shadow:0 0 6px -1px #35E0A1;opacity:0;}
  .lp-coins i:nth-child(1){left:8px;animation:lpFall 2.2s ease-in infinite;}
  .lp-coins i:nth-child(2){left:32px;animation:lpFall 2.6s ease-in .6s infinite;}
  .lp-coins i:nth-child(3){left:54px;animation:lpFall 2.3s ease-in 1.2s infinite;}

  .lp-eq{display:flex;align-items:flex-end;gap:6px;height:58px;flex:0 0 auto;}
  .lp-eq i{width:11px;border-radius:4px;transform-origin:bottom;animation:lpEq 1.6s ease-in-out infinite;background:linear-gradient(180deg,#35E0A1,#1b9f72);}
  .lp-eq i:nth-child(2){height:80%;animation-delay:.2s;background:linear-gradient(180deg,#5EA8E0,#2d6ea0);}
  .lp-eq i:nth-child(1){height:48%;}
  .lp-eq i:nth-child(3){height:62%;animation-delay:.45s;}
  .lp-eq i:nth-child(4){height:95%;animation-delay:.15s;background:linear-gradient(180deg,#E8A23C,#a86f1e);}
  .lp-eq i:nth-child(5){height:55%;animation-delay:.6s;}

  .lp-steps{display:flex;align-items:flex-end;gap:5px;height:60px;flex:0 0 auto;}
  .lp-steps b{width:10px;border-radius:3px;background:#111513;border:1px solid rgba(255,255,255,.08);position:relative;overflow:hidden;display:block;}
  .lp-steps b i{position:absolute;inset:0;background:linear-gradient(180deg,#35E0A1,#1b9f72);animation:lpClimb 4s ease-in-out infinite;display:block;}
  .lp-flame{color:#E8A23C;animation:lpBreath 2.4s ease-in-out infinite;flex:0 0 auto;}
  `;

  const mark = (s, c) => `<svg width="${s}" height="${s}" viewBox="0 0 120 120" fill="none">
    <defs><mask id="lpbz${s}${(c || "").replace(/[^a-z0-9]/gi, "")}"><rect width="120" height="120" fill="#000"/><circle cx="64" cy="74" r="27" fill="#fff"/><circle cx="64" cy="74" r="13" fill="#000"/></mask></defs>
    <path d="M38 20 V94" stroke="${c || "#35E0A1"}" stroke-width="11.5" stroke-linecap="round"/>
    <circle cx="64" cy="74" r="27" fill="${c || "#35E0A1"}" mask="url(#lpbz${s}${(c || "").replace(/[^a-z0-9]/gi, "")})"/>
    <circle cx="64" cy="74" r="5" fill="${c || "#35E0A1"}"/></svg>`;

  const ring = (size, pct, color) => {
    const r = (size - 6) / 2, C = 2 * Math.PI * r;
    return `<svg class="lp-ring" width="${size}" height="${size}" style="transform:rotate(-90deg)">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="4"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"
        stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}"/></svg>`;
  };

  const screenHome = () => `
    <div class="lp-cap">Good evening, Alex</div>
    <div>
      <div class="lp-cap" style="margin-bottom:5px">Total wealth</div>
      <div class="lp-big mono"><span class="c">$</span>16,700</div>
      <div class="lp-mini-sub" style="margin:7px 0 8px"><b style="color:#35E0A1">16%</b> funded · $89,000 to go</div>
      <div class="lp-fundbar"><i></i></div>
    </div>
    <div class="lp-tilegrid">
      <div class="lp-tile">${ring(34, 0.16, "#35E0A1")}<span class="tl">Goals</span><span class="tv mono">4 active</span></div>
      <div class="lp-tile blue"><span class="lp-bars"><i style="height:30%"></i><i style="height:55%"></i><i style="height:42%"></i><i style="height:75%"></i><i style="height:100%"></i></span><span class="tl">Saving</span><span class="tv mono">$16.7k</span></div>
    </div>
    <div class="lp-cap" style="margin-top:2px">Funding plan</div>
    <div class="lp-row"><span class="lp-dot" style="background:rgba(232,162,60,.16);color:#E8A23C">◆</span><span class="lp-rn">Marriage</span><span class="lp-ra mono" style="color:#8B928B">~Dec 26</span></div>
    <div class="lp-row"><span class="lp-dot" style="background:rgba(63,207,200,.14);color:#3FCFC8">✈</span><span class="lp-rn">Vacation</span><span class="lp-ra mono" style="color:#8B928B">~Apr 27</span></div>`;

  const screenTrack = () => `
    <div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:20px;font-weight:650;letter-spacing:-.03em">Track</span><span class="lp-cap">Spending</span></div>
    <div class="lp-rail"><span class="lp-railp">Mar</span><span class="lp-railp">Apr</span><span class="lp-railp">May</span><span class="lp-railp on">Jun</span></div>
    <div style="text-align:center;padding:6px 0 2px">
      <div class="lp-big mono" style="font-size:38px">$2,005</div>
      <div class="lp-mini-sub">spent this month · <span style="color:#35E0A1">↓ 12% vs May</span></div>
    </div>
    <div class="lp-strip"><span style="width:64%;background:#E8C84A"></span><span style="width:15%;background:#E8A23C"></span><span style="width:9%;background:#3FCFC8"></span><span style="width:6%;background:#8A8AF0"></span><span style="width:4%;background:#E87C93"></span><span style="width:2%;background:#35E0A1"></span></div>
    <div class="lp-row"><span class="lp-dot" style="background:rgba(232,200,74,.14);color:#E8C84A">⚡</span><span class="lp-rn">Utilities</span><span class="lp-ra mono">$1,290</span><span class="lp-pct mono" style="background:rgba(232,200,74,.14);color:#E8C84A">64%</span></div>
    <div class="lp-row"><span class="lp-dot" style="background:rgba(232,162,60,.14);color:#E8A23C">🍴</span><span class="lp-rn">Food</span><span class="lp-ra mono">$300</span><span class="lp-pct mono" style="background:rgba(232,162,60,.14);color:#E8A23C">15%</span></div>
    <div class="lp-row"><span class="lp-dot" style="background:rgba(63,207,200,.14);color:#3FCFC8">🚗</span><span class="lp-rn">Transport</span><span class="lp-ra mono">$180</span><span class="lp-pct mono" style="background:rgba(63,207,200,.14);color:#3FCFC8">9%</span></div>`;

  const screenGoal = () => `
    <div class="lp-cap">Goals</div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 0 4px">
      <div style="position:relative;width:110px;height:110px;display:grid;place-items:center">
        ${ring(110, 0.68, "#3FCFC8").replace('class="lp-ring"', 'class=""')}
        <span style="position:absolute;font-size:24px;font-weight:700;letter-spacing:-.03em" class="mono">68%</span>
      </div>
      <div style="font-size:16px;font-weight:600">Vacation in Japan</div>
      <div class="lp-mini-sub mono">$1,920 to go · 6-mo streak 🔥</div>
    </div>
    <div class="lp-row"><span class="lp-dot" style="background:rgba(232,124,147,.14);color:#E87C93">◆</span><span class="lp-rn">Marriage</span><span class="lp-ra mono">30%</span></div>
    <div class="lp-row"><span class="lp-dot" style="background:rgba(53,224,161,.14);color:#35E0A1">⌂</span><span class="lp-rn">House deposit</span><span class="lp-ra mono">10%</span></div>
    <div class="lp-row"><span class="lp-dot" style="background:rgba(94,168,224,.14);color:#5EA8E0">●</span><span class="lp-rn">Buy a car</span><span class="lp-ra mono">12%</span></div>`;

  const phone = (screenHtml, extra) => `<div class="lp-phone" ${extra || ""}><div class="lp-scr">${screenHtml}</div></div>`;

  window.LP = { css, mark, ring, phone, screenHome, screenTrack, screenGoal };
})();
