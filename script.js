// config
const PATH_P1 = "images/布丁cookies (2)_20250408_155950.gif";  
const PATH_P2 = "images/布丁cookies (3)_20250408_155952.gif";  
const PATH_P3 = "images/布丁cookies (2).gif";                 
const SONG_SRC = "audio/happy_birthday.m4a";                
const BGM_SRC  = "audio/bgm.m4a";                    
// =====================================================

const mascot     = document.getElementById("mascot");
const endBtn     = document.getElementById("endBtn");
const startModal = document.getElementById("startModal");
const endModal   = document.getElementById("endModal");
const startYes   = document.getElementById("startYes");
const startAlso  = document.getElementById("startAlso");
const endYes     = document.getElementById("endYes");

const song       = document.getElementById("song"); // 生日歌
song.src = SONG_SRC;

const bgm        = document.getElementById("bgm");  // 背景音乐
const bgmToggle  = document.getElementById("bgmToggle");
bgm.src = BGM_SRC;
bgm.loop = true;
bgm.volume = 0.6; 

let isSinging = false; // 当前是否在唱生日歌
let bgmEnabled = true; // BGM 开关

// 打开/关闭弹窗
function openModal(el){ el.classList.add("show"); el.setAttribute("aria-hidden","false"); }
function closeModal(el){ el.classList.remove("show"); el.setAttribute("aria-hidden","true"); }
document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", e => closeModal(e.target.closest(".modal")));
});

// BGM 
function updateBgmButton(){
  bgmToggle.setAttribute("aria-pressed", bgmEnabled ? "true" : "false");
  // bgmToggle.textContent = `♪ BGM：${bgmEnabled ? "开" : "关"}`;
}
async function playBgmIfAllowed(){
  if (!isSinging && bgmEnabled) {
    try { await bgm.play(); } catch (e) { /* 首次需用户手势 */ }
  }
}
function pauseBgm(){ bgm.pause(); }

bgmToggle.addEventListener("click", async () => {
  bgmEnabled = !bgmEnabled;
  updateBgmButton();
  if (bgmEnabled) {
    await playBgmIfAllowed();
  } else {
    pauseBgm();
  }
});

// 用户第一次交互后尝试播放 BGM（规避自动播放限制）
window.addEventListener("click", () => playBgmIfAllowed(), { once:true });
updateBgmButton();

// 点击 P1 -> 询问是否开始唱
mascot.addEventListener("click", () => {
  if (!isSinging) openModal(startModal);
});

async function startSinging() {
  closeModal(startModal);
  mascot.src = PATH_P2;        // 切到 P2
  isSinging = true;

  // 先暂停 BGM，再播生日歌
  pauseBgm();
  try { 
    await song.play();         // 播放音乐
  } catch (e) { 
    console.warn("需要用户互动才能播放音频：", e); 
  }

  endBtn.classList.remove("hidden");
  burstConfetti(120);          // 撒彩带
}

// 两个按钮都绑定同一事件
startYes.addEventListener("click", startSinging);
startAlso.addEventListener("click", startSinging);

// 点击结束按钮 -> 弹窗确认
endBtn.addEventListener("click", () => openModal(endModal));

// 确认结束
endYes.addEventListener("click", async () => {
  closeModal(endModal);

  // 停止生日歌
  song.pause();
  song.currentTime = 0;

  isSinging = false;
  endBtn.classList.add("hidden");
  mascot.src = PATH_P1;        // 切回 P1
  burstConfetti(60);           // 收尾彩纸

  // 若 BGM 开关是开，恢复 BGM
  await playBgmIfAllowed();
});

// 彩带特效
function burstConfetti(count=80){
  const box = document.getElementById("confetti");
  const colors = ["#ffd3e2","#ff9fc1","#a5d8ff","#c9f2e4","#fff3b0","#e7d1ff"];
  for(let i=0;i<count;i++){
    const piece = document.createElement("div");
    piece.className = "confetti";
    const size = Math.random()*8 + 6;
    piece.style.width = `${size}px`;
    piece.style.height = `${size*1.3}px`;
    piece.style.left = `${Math.random()*100}vw`;
    piece.style.top = `-20px`;
    piece.style.background = colors[i%colors.length];
    const dx = (Math.random()*2-1)*30 + "vw"; // 横向漂移
    piece.style.setProperty("--dx", dx);
    piece.style.animationDuration = (Math.random()*1.5 + 1.8) + "s";
    box.appendChild(piece);
    setTimeout(()=> piece.remove(), 2500);
  }
}

// Esc 关闭弹窗
document.addEventListener("keydown", e => {
  if(e.key === "Escape"){
    [startModal,endModal].forEach(m => m.classList.contains("show") && closeModal(m));
  }
});
