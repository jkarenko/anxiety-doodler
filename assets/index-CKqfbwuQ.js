var I=Object.defineProperty;var F=(r,t,s)=>t in r?I(r,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):r[t]=s;var a=(r,t,s)=>F(r,typeof t!="symbol"?t+"":t,s);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const e of n)if(e.type==="childList")for(const o of e.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function s(n){const e={};return n.integrity&&(e.integrity=n.integrity),n.referrerPolicy&&(e.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?e.credentials="include":n.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function i(n){if(n.ep)return;n.ep=!0;const e=s(n);fetch(n.href,e)}})();var c=(r=>(r.NONE="none",r.HAMMER="hammer",r.EXPLOSION="explosion",r.FIRE="fire",r))(c||{});class D{constructor(){a(this,"isDrawingActive",!1);a(this,"currentDestructionMethod","none");a(this,"isAnimating",!1)}isDrawing(){return this.isDrawingActive}setDrawing(t){this.isDrawingActive=t}getDestructionMethod(){return this.currentDestructionMethod}setDestructionMethod(t){this.currentDestructionMethod=t}isAnimationPlaying(){return this.isAnimating}setAnimating(t){this.isAnimating=t}reset(){this.isDrawingActive=!1,this.currentDestructionMethod="none",this.isAnimating=!1}}class L{constructor(t){a(this,"canvas");a(this,"ctx");a(this,"container");this.container=t,this.canvas=document.createElement("canvas"),this.canvas.className="drawing-canvas",t.appendChild(this.canvas);const s=this.canvas.getContext("2d");if(!s)throw new Error("Could not get 2D context from canvas");this.ctx=s,this.resizeCanvas(),window.addEventListener("resize",this.resizeCanvas.bind(this)),window.addEventListener("orientationchange",this.resizeCanvas.bind(this))}resizeCanvas(){const t=window.innerWidth<=480,s=window.innerWidth<=768,i=window.innerWidth>768&&window.innerWidth<=1024;let n,e;t?(n=this.container.clientWidth*.95,e=this.container.clientHeight*.8):s?(n=this.container.clientWidth*.95,e=this.container.clientHeight*.85):i?(n=this.container.clientWidth*.9,e=this.container.clientHeight*.85):(n=Math.min(900,this.container.clientWidth*.9),e=Math.min(700,this.container.clientHeight*.9)),this.canvas.width=n,this.canvas.height=e,this.canvas.style.width=`${n}px`,this.canvas.style.height=`${e}px`,this.ctx.setTransform(1,0,0,1,0,0),this.ctx.lineJoin="round",this.ctx.lineCap="round",this.ctx.lineWidth=5,this.ctx.strokeStyle="#000000"}getElement(){return this.canvas}getContext(){return this.ctx}getWidth(){return this.canvas.width}getHeight(){return this.canvas.height}clear(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)}}class W{constructor(){a(this,"paths",[]);a(this,"currentPath",null);a(this,"lineWidth",5);a(this,"lineColor","#000000")}startPath(t,s){this.currentPath={points:[{x:t,y:s}],color:this.lineColor,width:this.lineWidth},this.paths.push(this.currentPath)}addPoint(t,s){if(!this.currentPath){this.startPath(t,s);return}this.currentPath.points.push({x:t,y:s})}endPath(){this.currentPath=null}getPaths(){return this.paths}setPaths(t){this.paths=t,this.currentPath=null}clearPaths(){this.paths=[],this.currentPath=null}setLineWidth(t){this.lineWidth=t}getLineWidth(){return this.lineWidth}setLineColor(t){this.lineColor=t}getLineColor(){return this.lineColor}}class H{constructor(t){a(this,"ctx");this.ctx=t}clear(){const t=this.ctx.canvas;this.ctx.clearRect(0,0,t.width,t.height)}drawPath(t){const{points:s,color:i,width:n}=t;if(s.length<2){if(s.length===1){const e=s[0];this.ctx.beginPath(),this.ctx.arc(e.x,e.y,n/2,0,Math.PI*2),this.ctx.fillStyle=i,this.ctx.fill()}return}this.ctx.strokeStyle=i,this.ctx.lineWidth=n,this.ctx.lineJoin="round",this.ctx.lineCap="round",this.ctx.beginPath(),this.ctx.moveTo(s[0].x,s[0].y);for(let e=1;e<s.length;e++)this.ctx.lineTo(s[e].x,s[e].y);this.ctx.stroke()}drawDoodle(t){for(const s of t)this.drawPath(s)}getContext(){return this.ctx}setContext(t){this.ctx=t}}class l{constructor(t=0,s=0){this.x=t,this.y=s}clone(){return new l(this.x,this.y)}add(t){return this.x+=t.x,this.y+=t.y,this}subtract(t){return this.x-=t.x,this.y-=t.y,this}multiply(t){return this.x*=t,this.y*=t,this}divide(t){return t!==0&&(this.x/=t,this.y/=t),this}magnitude(){return Math.sqrt(this.x*this.x+this.y*this.y)}normalize(){const t=this.magnitude();return t>0&&this.divide(t),this}setMagnitude(t){return this.normalize(),this.multiply(t),this}dot(t){return this.x*t.x+this.y*t.y}distance(t){const s=this.x-t.x,i=this.y-t.y;return Math.sqrt(s*s+i*i)}limit(t){return this.magnitude()>t&&(this.normalize(),this.multiply(t)),this}heading(){return Math.atan2(this.y,this.x)}rotate(t){const s=this.heading()+t,i=this.magnitude();return this.x=Math.cos(s)*i,this.y=Math.sin(s)*i,this}static fromAngle(t,s=1){return new l(Math.cos(t)*s,Math.sin(t)*s)}static random2D(){return l.fromAngle(Math.random()*Math.PI*2)}}class M{constructor(t,s){a(this,"particles",[]);a(this,"origin");a(this,"gravity");this.origin=new l(t,s),this.gravity=new l(0,.1)}setOrigin(t,s){this.origin.x=t,this.origin.y=s}setGravity(t,s){this.gravity.x=t,this.gravity.y=s}addParticle(t=this.origin.x,s=this.origin.y,i="#FF5722",n=5,e=60){const o={position:new l(t,s),velocity:l.random2D().multiply(Math.random()*2+1),acceleration:this.gravity.clone(),color:i,size:n,life:e,maxLife:e,isDead:!1};this.particles.push(o)}addParticles(t,s=this.origin.x,i=this.origin.y,n="#FF5722",e=[3,8],o=[30,90]){for(let h=0;h<t;h++){const d=Math.random()*(e[1]-e[0])+e[0],u=Math.floor(Math.random()*(o[1]-o[0])+o[0]);this.addParticle(s,i,n,d,u)}}addParticlesFromPoints(t,s=.5,i="#FF5722",n=[3,8],e=[30,90]){const o=Math.max(1,Math.floor(t.length*s)),h=Math.floor(t.length/o);for(let d=0;d<t.length;d+=h){const u=t[d],S=Math.random()*(n[1]-n[0])+n[0],x=Math.floor(Math.random()*(e[1]-e[0])+e[0]),p=2,P=u.x+(Math.random()*p*2-p),A=u.y+(Math.random()*p*2-p);this.addParticle(P,A,i,S,x)}}update(){for(let t=this.particles.length-1;t>=0;t--){const s=this.particles[t];s.velocity.add(s.acceleration),s.position.add(s.velocity),s.acceleration.multiply(0),s.life--,s.life<=0&&(s.isDead=!0,this.particles.splice(t,1))}}applyForce(t){for(const s of this.particles)s.acceleration.add(t)}draw(t){for(const s of this.particles){const i=s.life/s.maxLife;t.save(),t.globalAlpha=i,t.fillStyle=s.color,t.beginPath(),t.arc(s.position.x,s.position.y,s.size,0,Math.PI*2),t.fill(),t.restore()}}isEmpty(){return this.particles.length===0}getParticleCount(){return this.particles.length}clear(){this.particles=[]}}const g=new Map;let f=.7,y=!1;class R{constructor(t,s=.7){this.sampleCollections={},this.soundPaths=t,f=Math.max(0,Math.min(1,s))}registerSamples(t,s){this.sampleCollections[t]=s}preloadSound(t,s){if(!g.has(t)){const i=new Audio(s);i.preload="auto",g.set(t,i),i.load()}}preloadAllSounds(){Object.entries(this.soundPaths).forEach(([t,s])=>{this.preloadSound(t,s)})}playSound(t,s,i=!1){if(y)return;!g.has(t)&&t in this.soundPaths&&this.preloadSound(t,this.soundPaths[t]);const n=g.get(t);if(n){const e=new Audio(n.src);return e.volume=s!==void 0?s:f,e.loop=i,setTimeout(()=>{e.play().catch(o=>{console.error(`Error playing sound "${t}":`,o)})},0),e}console.warn(`Sound "${t}" not found in audio cache`)}playSoundSample(t,s,i){if(y)return;const n=s||this.sampleCollections[t];if(!n){console.warn(`No samples provided or registered for "${t}"`);return}!g.has(t)&&t in this.soundPaths&&this.preloadSound(t,this.soundPaths[t]);const e=g.get(t);if(e){const o=new Audio(e.src);o.volume=i!==void 0?i:f;const h=n[Math.floor(Math.random()*n.length)];return o.currentTime=h.start,setTimeout(()=>{o.play().catch(d=>{console.error(`Error playing sound "${t}":`,d)}),setTimeout(()=>{this.stopSound(o)},h.duration*1e3)},0),o}console.warn(`Sound "${t}" not found in audio cache`)}stopSound(t){t&&(t.pause(),t.currentTime=0)}setVolume(t){f=Math.max(0,Math.min(1,t))}getVolume(){return f}setMuted(t){y=t}isMuted(){return y}}const O={hammerImpact:"./sounds/hammer-impact.mp3",whoosh:"./sounds/whoosh.mp3",explosion:"./sounds/explosion.mp3",smallExplosion:"./sounds/small-explosion.mp3",fire:"./sounds/fire.mp3",burn:"./sounds/burn.mp3",pop:"./sounds/pop.mp3",crumble:"./sounds/crumble.mp3"},m=new R(O),C=[{start:0,duration:.5},{start:.5,duration:.5},{start:1,duration:.5},{start:1.5,duration:.5}],E=[{start:0,duration:1},{start:1,duration:1},{start:2,duration:1},{start:3,duration:1}];m.registerSamples("whoosh",C);m.registerSamples("crumble",E);m.preloadAllSounds();function B(r){return m.playSound("hammerImpact",r)}function v(r){return m.playSoundSample("whoosh",C,r)}function w(r=!1,t){return m.playSound(r?"smallExplosion":"explosion",t)}function X(r){return m.playSoundSample("crumble",E,r)}function N(r){return m.playSound("pop",r)}class Y{constructor(t,s,i){a(this,"ctx");a(this,"canvasWidth");a(this,"canvasHeight");a(this,"hammerImg");a(this,"hammerX");a(this,"hammerY");a(this,"hammerRotation",-Math.PI/4);a(this,"hammerScale",1);a(this,"isAnimating",!1);a(this,"animationProgress",0);a(this,"animationDuration",60);a(this,"particleSystem");a(this,"paths",[]);a(this,"originalPaths",[]);a(this,"smashPoint");a(this,"centerLineX",0);a(this,"highestPointY",0);a(this,"smashCount",0);a(this,"totalSmashes",1);a(this,"pathScaleFactor",1);a(this,"onComplete",()=>{});this.ctx=t,this.canvasWidth=s,this.canvasHeight=i,this.hammerImg=new Image,this.hammerImg.src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMzAgMjBINzBWNDBIMzBWMjBaIiBmaWxsPSIjODg4Ii8+PHBhdGggZD0iTTQ1IDQwSDU1VjgwSDQ1VjQwWiIgZmlsbD0iIzYxNDEyNiIvPjwvc3ZnPg==",this.hammerX=this.canvasWidth/2,this.hammerY=0,this.smashPoint=new l(this.canvasWidth/2,this.canvasHeight/2),this.particleSystem=new M(this.smashPoint.x,this.smashPoint.y)}setPaths(t){(this.paths.length===0||this.originalPaths.length===0)&&(this.paths=JSON.parse(JSON.stringify(t)),this.originalPaths=JSON.parse(JSON.stringify(t)))}findCenterLineX(){if(this.paths.length===0)return this.canvasWidth/2;let t=Number.MAX_VALUE,s=Number.MIN_VALUE;for(const i of this.paths)for(const n of i.points)t=Math.min(t,n.x),s=Math.max(s,n.x);return(t+s)/2}findHighestPointOnCenterLine(){if(this.paths.length===0)return this.canvasHeight/2;let t=this.canvasHeight;const s=5;for(const i of this.paths)for(let n=0;n<i.points.length-1;n++){const e=i.points[n],o=i.points[n+1];if(e.x<=this.centerLineX&&o.x>=this.centerLineX||e.x>=this.centerLineX&&o.x<=this.centerLineX||Math.abs(e.x-this.centerLineX)<s||Math.abs(o.x-this.centerLineX)<s){let h;if(Math.abs(o.x-e.x)<.001)h=Math.min(e.y,o.y);else{const d=(this.centerLineX-e.x)/(o.x-e.x);h=e.y+d*(o.y-e.y)}t=Math.min(t,h)}}return t}findLowestPoint(){const t=this.pathScaleFactor===1?this.originalPaths:this.paths;if(t.length===0)return this.canvasHeight;let s=0;for(const i of t)for(const n of i.points)s=Math.max(s,n.y);return s}flattenPaths(t){this.pathScaleFactor===1&&(this.paths=JSON.parse(JSON.stringify(this.originalPaths)));const s=this.findLowestPoint();for(const i of this.paths)for(const n of i.points)n.y=s-(s-n.y)*t}setOnComplete(t){this.onComplete=t}start(){this.isAnimating||(this.isAnimating=!0,this.animationProgress=0,this.smashCount=0,v(),this.centerLineX=this.findCenterLineX(),this.highestPointY=this.findHighestPointOnCenterLine(),this.smashPoint.x=this.centerLineX,this.smashPoint.y=this.highestPointY,this.hammerX=this.centerLineX,this.hammerY=-50,this.particleSystem.setOrigin(this.smashPoint.x,this.smashPoint.y),this.particleSystem.clear(),console.log(`Starting hammer animation: centerLineX=${this.centerLineX}, highestPointY=${this.highestPointY}`))}update(){if(!this.isAnimating)return!1;if(this.animationProgress++,this.animationProgress<this.animationDuration*.3){const t=this.animationProgress/(this.animationDuration*.3);this.hammerRotation=-Math.PI/4+t*Math.PI/2,this.hammerY=-50+t*(this.smashPoint.y+50)}else if(this.animationProgress<this.animationDuration*.4){this.animationProgress===Math.floor(this.animationDuration*.3)&&(B(),this.createImpactParticles(),this.smashCount++,console.log(`Smash ${this.smashCount} of ${this.totalSmashes}`),this.pathScaleFactor*=.8,this.flattenPaths(this.pathScaleFactor),X(),this.highestPointY=this.findHighestPointOnCenterLine(),this.smashPoint.y=this.highestPointY);const t=3;this.hammerX=this.smashPoint.x+(Math.random()*2-1)*t,this.hammerY=this.smashPoint.y+(Math.random()*2-1)*t}else{const t=(this.animationProgress-this.animationDuration*.4)/(this.animationDuration*.6);this.hammerRotation=Math.PI/4-t*Math.PI/2,this.hammerY=this.smashPoint.y+50-t*(this.smashPoint.y+100),this.hammerX=this.smashPoint.x}if(this.particleSystem.update(),this.animationProgress>=this.animationDuration)if(this.smashCount<this.totalSmashes)this.animationProgress=0,this.hammerX=this.centerLineX,this.hammerY=-50,this.hammerRotation=-Math.PI/4,this.particleSystem.clear(),v(),console.log(`Starting next smash at y=${this.highestPointY}`);else return this.isAnimating=!1,this.onComplete(),!1;return!0}createImpactParticles(){for(const s of this.paths)this.particleSystem.addParticlesFromPoints(s.points,.3,s.color,[2,5],[30,60]);this.particleSystem.addParticles(20,this.smashPoint.x,this.smashPoint.y,"#FFF",[3,8],[20,40]);const t=new l(0,-.2);this.particleSystem.applyForce(t)}draw(){if(!(!this.isAnimating&&this.particleSystem.isEmpty())){if(this.paths.length>0){for(const t of this.paths)if(!(t.points.length<2)){this.ctx.beginPath(),this.ctx.strokeStyle=t.color,this.ctx.lineWidth=t.width,this.ctx.lineCap="round",this.ctx.lineJoin="round",this.ctx.moveTo(t.points[0].x,t.points[0].y);for(let s=1;s<t.points.length;s++)this.ctx.lineTo(t.points[s].x,t.points[s].y);this.ctx.stroke()}}this.particleSystem.draw(this.ctx),this.isAnimating&&(this.ctx.save(),this.ctx.translate(this.hammerX,this.hammerY),this.ctx.rotate(this.hammerRotation),this.ctx.scale(this.hammerScale,this.hammerScale),this.ctx.drawImage(this.hammerImg,-60/2,-100/2,60,100),this.ctx.restore())}}isPlaying(){return this.isAnimating||!this.particleSystem.isEmpty()}getPaths(){return this.paths}stop(){this.isAnimating=!1,this.particleSystem.clear()}reset(){this.paths=[],this.originalPaths=[],this.pathScaleFactor=1,this.animationProgress=0,this.smashCount=0,this.hammerRotation=-Math.PI/4,this.hammerX=this.canvasWidth/2,this.hammerY=0,this.stop()}}class T{constructor(t,s,i){a(this,"ctx");a(this,"canvasWidth");a(this,"canvasHeight");a(this,"particleSystem");a(this,"paths",[]);a(this,"isAnimating",!1);a(this,"animationProgress",0);a(this,"animationDuration",90);a(this,"explosionCenter");a(this,"explosionRadius",0);a(this,"maxExplosionRadius",100);a(this,"onComplete",()=>{});a(this,"explosionRings",[]);this.ctx=t,this.canvasWidth=s,this.canvasHeight=i,this.explosionCenter=new l(this.canvasWidth/2,this.canvasHeight/2),this.particleSystem=new M(this.explosionCenter.x,this.explosionCenter.y)}setPaths(t){this.paths=t}setOnComplete(t){this.onComplete=t}start(){if(!this.isAnimating){if(this.isAnimating=!0,this.animationProgress=0,this.explosionRadius=0,this.explosionRings=[],this.paths.length>0){let t=0,s=0,i=0;for(const n of this.paths)for(const e of n.points)t+=e.x,s+=e.y,i++;i>0&&(this.explosionCenter.x=t/i,this.explosionCenter.y=s/i)}this.particleSystem.setOrigin(this.explosionCenter.x,this.explosionCenter.y),this.particleSystem.clear(),this.createExplosionParticles(),w()}}update(){if(!this.isAnimating)return!1;if(this.animationProgress++,this.animationProgress<this.animationDuration*.2){const s=this.animationProgress/(this.animationDuration*.2);this.explosionRadius=this.maxExplosionRadius*s,this.animationProgress%5===0&&(this.addExplosionRing(),N())}else this.animationProgress%15===0&&this.animationProgress<this.animationDuration*.6&&(this.addSecondaryExplosion(),w(!0));for(let s=this.explosionRings.length-1;s>=0;s--){const i=this.explosionRings[s];i.radius+=i.speed,i.alpha-=.02,i.alpha<=0&&this.explosionRings.splice(s,1)}this.particleSystem.update();const t=new l(0,.05);return this.particleSystem.applyForce(t),this.animationProgress>=this.animationDuration&&this.particleSystem.isEmpty()?(this.isAnimating=!1,this.onComplete(),!1):!0}createExplosionParticles(){for(const t of this.paths)this.particleSystem.addParticlesFromPoints(t.points,.5,t.color,[2,6],[40,80]);this.particleSystem.addParticles(30,this.explosionCenter.x,this.explosionCenter.y,"#FFA500",[4,10],[30,60]);for(let t=0;t<10;t++){const s=Math.random()*Math.PI*2,i=l.fromAngle(s,.3+Math.random()*.3);this.particleSystem.applyForce(i)}}addSecondaryExplosion(){if(this.particleSystem.getParticleCount()>0){const t=new l((Math.random()*2-1)*50,(Math.random()*2-1)*50),s=new l(this.explosionCenter.x+t.x,this.explosionCenter.y+t.y);this.particleSystem.addParticles(10,s.x,s.y,"#FF4500",[3,8],[20,40]),this.explosionRings.push({x:s.x,y:s.y,radius:5,maxRadius:30+Math.random()*20,speed:1+Math.random(),alpha:.8,color:"#FF4500"})}}addExplosionRing(){this.explosionRings.push({x:this.explosionCenter.x,y:this.explosionCenter.y,radius:this.explosionRadius*.5,maxRadius:this.maxExplosionRadius,speed:2+Math.random()*2,alpha:.7,color:"#FFA500"})}draw(){if(!(!this.isAnimating&&this.particleSystem.isEmpty()&&this.explosionRings.length===0)){for(const t of this.explosionRings)this.ctx.save(),this.ctx.globalAlpha=t.alpha,this.ctx.strokeStyle=t.color,this.ctx.lineWidth=3,this.ctx.beginPath(),this.ctx.arc(t.x,t.y,t.radius,0,Math.PI*2),this.ctx.stroke(),this.ctx.restore();this.particleSystem.draw(this.ctx)}}isPlaying(){return this.isAnimating||!this.particleSystem.isEmpty()||this.explosionRings.length>0}stop(){this.isAnimating=!1,this.particleSystem.clear(),this.explosionRings=[]}reset(){this.paths=[],this.animationProgress=0,this.explosionRadius=0,this.explosionCenter=new l(this.canvasWidth/2,this.canvasHeight/2),this.stop()}}class z{constructor(t,s,i){a(this,"ctx");a(this,"canvasWidth");a(this,"canvasHeight");a(this,"particleSystem");a(this,"paths",[]);a(this,"isAnimating",!1);a(this,"animationProgress",0);a(this,"animationDuration",120);a(this,"burnPoints",[]);a(this,"onComplete",()=>{});a(this,"burnedSegments",0);a(this,"totalSegments",0);a(this,"fireColors",["#FF4500","#FF7F50","#FFA500","#FFD700","#FFFF00"]);this.ctx=t,this.canvasWidth=s,this.canvasHeight=i,this.particleSystem=new M(this.canvasWidth/2,this.canvasHeight),this.particleSystem.setGravity(0,-.05)}setPaths(t){this.paths=t,this.totalSegments=0;for(const s of t)s.points.length>1&&(this.totalSegments+=s.points.length-1)}setOnComplete(t){this.onComplete=t}start(){this.isAnimating||(this.isAnimating=!0,this.animationProgress=0,this.burnPoints=[],this.burnedSegments=0,this.particleSystem.clear(),this.initializeBurnPoints())}initializeBurnPoints(){for(let t=0;t<this.paths.length;t++){const s=this.paths[t];if(s.points.length<2)continue;let i=0,n=s.points[0].y;for(let e=1;e<s.points.length;e++)s.points[e].y>n&&(n=s.points[e].y,i=e);this.burnPoints.push({pathIndex:t,segmentIndex:i>0?i-1:0,progress:0,position:new l(s.points[i].x,s.points[i].y),speed:.05+Math.random()*.05,active:!0})}}update(){if(!this.isAnimating)return!1;if(this.animationProgress++,this.updateBurnPoints(),this.particleSystem.update(),this.animationProgress%10===0){const t=new l((Math.random()*2-1)*.02,0);this.particleSystem.applyForce(t)}return this.burnedSegments>=this.totalSegments&&this.particleSystem.getParticleCount()<5||this.animationProgress>=this.animationDuration?(this.isAnimating=!1,this.onComplete(),!1):!0}updateBurnPoints(){for(let t=this.burnPoints.length-1;t>=0;t--){const s=this.burnPoints[t];if(!s.active)continue;const i=this.paths[s.pathIndex],n=s.segmentIndex;if(n<i.points.length-1){const e=i.points[n],o=i.points[n+1];if(s.progress+=s.speed,s.progress>=1&&(s.segmentIndex++,s.progress=0,this.burnedSegments++,this.createFireParticles(e,o),s.segmentIndex>=i.points.length-1)){this.createFireParticles(i.points[i.points.length-2],i.points[i.points.length-1]),s.active=!1,this.burnedSegments++;continue}const h=e.x+(o.x-e.x)*s.progress,d=e.y+(o.y-e.y)*s.progress;s.position.x=h,s.position.y=d,this.animationProgress%2===0&&this.createEmberParticle(s.position.x,s.position.y)}}this.animationProgress%30===0&&this.burnPoints.length<10&&this.addRandomBurnPoint()}addRandomBurnPoint(){const t=this.burnPoints.filter(e=>e.active);if(t.length===0)return;const s=t[Math.floor(Math.random()*t.length)],i=this.paths[s.pathIndex],n=Math.max(0,s.segmentIndex-Math.floor(Math.random()*3));if(n<i.points.length-1){const e=i.points[n];this.burnPoints.push({pathIndex:s.pathIndex,segmentIndex:n,progress:0,position:new l(e.x,e.y),speed:.03+Math.random()*.04,active:!0})}}createFireParticles(t,s){const i=s.x-t.x,n=s.y-t.y,e=Math.sqrt(i*i+n*n),o=Math.max(3,Math.floor(e/5));for(let h=0;h<o;h++){const d=h/(o-1),u=t.x+i*d,S=t.y+n*d;for(let x=0;x<3;x++){const p=this.fireColors[Math.floor(Math.random()*this.fireColors.length)],P=3;this.particleSystem.addParticle(u+(Math.random()*2-1)*P,S+(Math.random()*2-1)*P,p,2+Math.random()*4,20+Math.random()*30)}}}createEmberParticle(t,s){const i=this.fireColors[Math.floor(Math.random()*this.fireColors.length)];this.particleSystem.addParticle(t+(Math.random()*2-1)*2,s+(Math.random()*2-1)*2,i,1+Math.random()*2,10+Math.random()*20)}draw(){!this.isAnimating&&this.particleSystem.isEmpty()||this.particleSystem.draw(this.ctx)}isPlaying(){return this.isAnimating||!this.particleSystem.isEmpty()}stop(){this.isAnimating=!1,this.particleSystem.clear(),this.burnPoints=[]}reset(){this.paths=[],this.totalSegments=0,this.burnedSegments=0,this.animationProgress=0,this.stop()}}class U{constructor(t){a(this,"gameState");a(this,"canvas");a(this,"doodleManager");a(this,"renderer");a(this,"animationFrameId",null);a(this,"hammerSmash");a(this,"exploder");a(this,"burner");a(this,"destructionButtons");a(this,"destructionMethodUsed",!1);this.gameState=new D,this.canvas=new L(t),this.doodleManager=new W,this.renderer=new H(this.canvas.getContext());const s=this.canvas.getContext(),i=this.canvas.getWidth(),n=this.canvas.getHeight();this.hammerSmash=new Y(s,i,n),this.exploder=new T(s,i,n),this.burner=new z(s,i,n),this.hammerSmash.setOnComplete(()=>this.onAnimationComplete()),this.exploder.setOnComplete(()=>this.onAnimationComplete()),this.burner.setOnComplete(()=>this.onAnimationComplete()),this.createDestructionButtons(),this.setupEventListeners(),window.addEventListener("beforeunload",()=>this.stop())}setupEventListeners(){const t=this.canvas.getElement();t.addEventListener("mousedown",this.handlePointerStart.bind(this)),t.addEventListener("mousemove",this.handlePointerMove.bind(this)),t.addEventListener("mouseup",this.handlePointerEnd.bind(this)),t.addEventListener("mouseout",this.handlePointerEnd.bind(this)),t.addEventListener("touchstart",this.handleTouchStart.bind(this)),t.addEventListener("touchmove",this.handleTouchMove.bind(this)),t.addEventListener("touchend",this.handleTouchEnd.bind(this))}handlePointerStart(t){if(t.preventDefault(),this.gameState.isAnimationPlaying())return;const{offsetX:s,offsetY:i}=t;this.destructionMethodUsed&&(this.hammerSmash.reset(),this.exploder.reset(),this.burner.reset(),this.doodleManager.clearPaths(),this.destructionMethodUsed=!1),this.gameState.setDrawing(!0),this.doodleManager.startPath(s,i)}handlePointerMove(t){if(!this.gameState.isDrawing())return;const{offsetX:s,offsetY:i}=t;this.doodleManager.addPoint(s,i),this.render()}handlePointerEnd(t){t.preventDefault(),this.gameState.setDrawing(!1),this.doodleManager.endPath()}handleTouchStart(t){if(t.preventDefault(),t.touches.length!==1||this.gameState.isAnimationPlaying())return;const s=t.touches[0],i=this.canvas.getElement().getBoundingClientRect(),n=s.clientX-i.left,e=s.clientY-i.top;this.destructionMethodUsed&&(this.hammerSmash.reset(),this.exploder.reset(),this.burner.reset(),this.doodleManager.clearPaths(),this.destructionMethodUsed=!1),this.gameState.setDrawing(!0),this.doodleManager.startPath(n,e)}handleTouchMove(t){if(t.preventDefault(),!this.gameState.isDrawing()||t.touches.length!==1)return;const s=t.touches[0],i=this.canvas.getElement().getBoundingClientRect(),n=s.clientX-i.left,e=s.clientY-i.top;this.doodleManager.addPoint(n,e),this.render()}handleTouchEnd(t){t.preventDefault(),this.gameState.setDrawing(!1),this.doodleManager.endPath()}createDestructionButtons(){const t=document.getElementById("controls");if(!t){console.error("Controls container not found!");return}this.destructionButtons=document.createElement("div"),this.destructionButtons.className="destruction-buttons";const s=[{id:c.HAMMER,label:"🔨 Hammer",color:"#4CAF50"},{id:c.EXPLOSION,label:"💥 Explode",color:"#FF9800"},{id:c.FIRE,label:"🔥 Burn",color:"#F44336"}];for(const e of s){const o=document.createElement("button");o.textContent=e.label;let h="";switch(e.id){case c.HAMMER:h="hammer";break;case c.EXPLOSION:h="explosion";break;case c.FIRE:h="fire";break}o.className=`destruction-button ${h}`,o.addEventListener("click",()=>{this.startAnimation(e.id)}),this.destructionButtons.appendChild(o)}const i=document.createElement("button");i.textContent="🔄 Reset",i.className="reset-button",i.addEventListener("click",()=>{this.resetGame()}),this.destructionButtons.appendChild(i),this.destructionButtons.querySelectorAll("button").forEach(e=>{e.disabled=!0}),t.appendChild(this.destructionButtons)}startAnimation(t){if(this.gameState.isAnimationPlaying())return;this.stop(),this.gameState.setDestructionMethod(t),this.gameState.setAnimating(!0),this.gameState.setDrawing(!1),this.destructionMethodUsed=!0,this.destructionButtons.querySelectorAll("button").forEach(n=>{n.disabled=!0});const i=this.doodleManager.getPaths();switch(t){case c.HAMMER:this.hammerSmash.setPaths(i),this.hammerSmash.start();break;case c.EXPLOSION:this.exploder.setPaths(i),this.exploder.start();break;case c.FIRE:this.burner.setPaths(i),this.burner.start();break}this.start()}onAnimationComplete(){this.stop();const t=this.gameState.getDestructionMethod();if(this.gameState.setAnimating(!1),this.gameState.setDestructionMethod(c.NONE),t===c.HAMMER){const i=this.hammerSmash.getPaths();this.doodleManager.setPaths(i)}else this.doodleManager.clearPaths();const s=this.destructionButtons.querySelector("button:last-child");s&&s.classList.remove("disabled"),this.start()}resetGame(){this.stop(),this.hammerSmash.reset(),this.exploder.reset(),this.burner.reset(),this.gameState.reset(),this.destructionMethodUsed=!1,this.doodleManager.clearPaths(),this.destructionButtons.querySelectorAll("button").forEach(s=>{s.disabled=!0}),this.start()}hasValidDoodle(){const t=this.doodleManager.getPaths();return t.length>0&&t.some(s=>s.points.length>1)}render(){if(this.renderer.clear(),this.gameState.isAnimationPlaying())switch(this.gameState.getDestructionMethod()){case c.HAMMER:this.hammerSmash.update(),this.hammerSmash.draw();break;case c.EXPLOSION:this.exploder.update(),this.exploder.draw();break;case c.FIRE:this.burner.update(),this.burner.draw();break}else{this.renderer.drawDoodle(this.doodleManager.getPaths());const t=this.hasValidDoodle();this.destructionButtons.querySelectorAll("button").forEach(i=>{i.disabled=!t})}}gameLoop(){this.render(),this.animationFrameId=requestAnimationFrame(this.gameLoop.bind(this))}start(){this.gameLoop()}stop(){this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}}const b=document.getElementById("canvas-container");b?new U(b).start():console.error("Canvas container not found!");
