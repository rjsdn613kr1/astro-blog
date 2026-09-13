const {Plugin,Notice,TFile,parseYaml}=require('obsidian');
const {execFile}=require('child_process');
const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
module.exports=class extends Plugin {
 async onload(){
  this.pending=new Set((await this.loadData())?.pending||[]);this.running=false;this.tracked=new Set((await this.run('/usr/bin/git',['ls-files','-z','--','src/data/blog'])).split('\0'));
  this.fingerprints=new Map();const root=this.app.vault.adapter.basePath;const scan=dir=>{for(const f of fs.readdirSync(dir,{withFileTypes:true})){if(f.name.startsWith('.')||f.name==='templates')continue;const full=path.join(dir,f.name);if(f.isDirectory())scan(full);else if(f.name.endsWith('.md'))this.fingerprints.set(path.relative(root,full).normalize('NFC'),crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex'));}};scan(path.join(root,'src/data/blog'));
  this.status=this.addStatusBarItem();this.status.setText('Astro 자동 발행 대기');
  const collect=file=>{if(file instanceof TFile && file.extension==='md' && file.path.startsWith('src/data/blog/') && !file.path.includes('/.obsidian/') && !file.path.includes('/templates/')){let hash;try{hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(this.app.vault.adapter.basePath,file.path))).digest('hex')}catch{return}const key=file.path.normalize('NFC');if(this.fingerprints.get(key)===hash)return;this.fingerprints.set(key,hash);this.lastChange=Date.now();this.pending.add(file.path);this.changed=this.changed||{};this.changed[file.path]=Date.now();this.saveData({pending:[...this.pending]});clearTimeout(this.timer);this.timer=setTimeout(()=>this.publish(),120000)}};
  this.app.workspace.onLayoutReady(()=>{this.registerEvent(this.app.vault.on('modify',collect));this.registerEvent(this.app.vault.on('create',collect));});
  this.registerInterval(setInterval(()=>this.publish(),300000));
  this.addCommand({id:'publish',name:'변경한 글 발행',callback:()=>this.publish(true)});
  this.addCommand({id:'new-post',name:'새 블로그 글 작성',callback:async()=>{const stamp=new Date().toISOString();const name='새 글 '+stamp.replace(/[:.]/g,'-');const file=await this.app.vault.create('src/data/blog/'+name+'.md',`---\ntitle: "새 글"\npubDatetime: ${stamp}\ntags: []\ncategory: "블로그"\ndraft: true\n---\n\n`);await this.app.workspace.getLeaf().openFile(file)}});
 }
 isDraft(text){const match=text.match(/^---\r?\n([\s\S]*?)\r?\n---/);if(!match)return true;try{return parseYaml(match[1]).draft!==false}catch{return true}}
 run(bin,args){return new Promise((resolve,reject)=>execFile(bin,args,{cwd:this.app.vault.adapter.basePath,env:{...process.env,PATH:'/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin'},maxBuffer:8*1024*1024},(error,out,err)=>error?reject(new Error(err||out||error.message)):resolve(out.trim())))}
 async publish(manual=false){
  if(!manual && Date.now()-this.lastChange<120000)return;
  if(this.running||!this.pending.size)return;this.running=true;this.status.setText('Astro 발행 확인 중');
  const stamps={...this.changed};const batch=[...this.pending].filter(p=>fs.existsSync(path.join(this.app.vault.adapter.basePath,p)) && (!p.endsWith('.md') || !this.isDraft(fs.readFileSync(path.join(this.app.vault.adapter.basePath,p),'utf8')) || this.tracked?.has(p)));
  try{
   if(!batch.length){this.status.setText('Astro 초안 대기');return;}
   if(await this.run('/usr/bin/git',['branch','--show-current'])!=='main')throw new Error('main 브랜치에서만 자동 발행합니다.');
   if(await this.run('/usr/bin/git',['diff','--cached','--name-only']))throw new Error('이미 준비된 Git 변경이 있어 자동 발행을 보류합니다.');
   await this.run('/usr/bin/git',['fetch','origin','main']);
   const behind=await this.run('/usr/bin/git',['rev-list','--count','HEAD..origin/main']);if(behind!=='0')throw new Error('원격 변경을 먼저 가져와야 합니다.');
   await this.run('/opt/homebrew/bin/npm',['run','build']);
   if(batch.some(p=>stamps[p]!==this.changed?.[p])){this.status.setText('수정 완료 후 다시 발행');return;}
   const assets=new Set();for(const p of batch){const content=fs.readFileSync(path.join(this.app.vault.adapter.basePath,p),'utf8');for(const m of content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)){const dest=this.app.metadataCache.getFirstLinkpathDest(decodeURIComponent(m[1]),p);if(dest && dest.path.startsWith('src/data/blog/') && !dest.path.endsWith('.md'))assets.add(dest.path);}}
   if(batch.length){await this.run('/usr/bin/git',['add','--',...batch,...assets]);if(await this.run('/usr/bin/git',['diff','--cached','--name-only']))await this.run('/usr/bin/git',['commit','-m','Update blog posts from Obsidian']);}
   await this.run('/usr/bin/git',['push','origin','HEAD:main']);
   for(const p of batch)this.tracked?.add(p);for(const p of batch)if(stamps[p]===this.changed?.[p])this.pending.delete(p);await this.saveData({pending:[...this.pending]});this.status.setText('Astro 업로드 완료');new Notice('Astro 글을 업로드했습니다. GitHub에서 배포를 진행합니다.');
  }catch(e){this.status.setText('Astro 발행 오류');new Notice('Astro: '+e.message,10000);console.error(e)}finally{this.running=false}
 }
 onunload(){clearTimeout(this.timer)}
};
