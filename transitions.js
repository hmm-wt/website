/* hmm site - the threading dot-field. One persistent field of reused particles (R8) behind the whole
   page. It drifts (breath), flows in the scroll direction (the flock / school), and shifts colour to
   the necessity of the section in view: Power orange -> Eat green -> Heal blue -> AI/Regulation tomato.
   Metaphorical continuity, not entity mapping. Honours prefers-reduced-motion (static faint field). */
(function(){
  var cv=document.getElementById('dotfield'); if(!cv) return;
  var ctx=cv.getContext('2d'), DPR=Math.min(2,window.devicePixelRatio||1), W=0,H=0;
  function resize(){W=cv.width=Math.floor(innerWidth*DPR);H=cv.height=Math.floor(innerHeight*DPR);cv.style.width=innerWidth+'px';cv.style.height=innerHeight+'px';}
  resize(); addEventListener('resize',resize);

  var NEC={power:[224,129,46],eat:[79,138,91],heal:[62,121,166],ai:[196,69,57],reg:[196,69,57]};
  var COLKEY={power:'power',eat:'eat',heal:'heal',s5:'ai',s6:'reg'};
  function currentColor(){
    var vc=innerHeight/2, best=null, bd=1e9;
    Object.keys(COLKEY).forEach(function(id){var el=document.getElementById(id);if(!el)return;var r=el.getBoundingClientRect();var c=r.top+r.height/2;var d=Math.abs(c-vc);if(d<bd){bd=d;best=COLKEY[id];}});
    return best?NEC[best]:[196,69,57];
  }

  var N=Math.max(140,Math.min(360,Math.round(innerWidth*innerHeight/13000))), dots=[];
  for(var i=0;i<N;i++){var q=Math.random();dots.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:(q<.14?2.0:q<.5?1.3:.85)*DPR,ph:Math.random()*6.283,q:q});}

  var col=[196,69,57], last=window.scrollY, sv=0, t=0;
  var reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  function frame(){
    t+=0.016;
    var s=window.scrollY; sv=sv*0.86+(s-last)*0.14; last=s;
    var tc=currentColor(); for(var k=0;k<3;k++)col[k]+=(tc[k]-col[k])*0.035;
    var flow=Math.max(-7,Math.min(7,sv*DPR*0.28));
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<N;i++){var d=dots[i];
      d.x+=d.vx*DPR+Math.sin(t*0.5+d.ph)*0.13*DPR;
      d.y+=d.vy*DPR+flow+Math.cos(t*0.42+d.ph)*0.13*DPR;
      if(d.y>H+12)d.y=-12; else if(d.y<-12)d.y=H+12;
      if(d.x>W+12)d.x=-12; else if(d.x<-12)d.x=W+12;
      var op=(0.09+0.11*(0.5+0.5*Math.sin(t*0.8+d.ph)))*(d.q<.14?1.5:1);
      ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,6.2832);
      ctx.fillStyle='rgba('+(col[0]|0)+','+(col[1]|0)+','+(col[2]|0)+','+op.toFixed(3)+')';ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  if(reduced){col=currentColor();ctx.clearRect(0,0,W,H);dots.forEach(function(d){ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,6.2832);ctx.fillStyle='rgba('+(col[0]|0)+','+(col[1]|0)+','+(col[2]|0)+',0.12)';ctx.fill();});}
  else requestAnimationFrame(frame);
})();
