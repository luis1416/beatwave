const songs = [
  {title:"Midnight Dreams", artist:"Nova", icon:"✦"},
  {title:"Ocean Lights", artist:"Luna Waves", icon:"◈"},
  {title:"Neon Drive", artist:"Kairo", icon:"◉"},
  {title:"Green Horizon", artist:"Echo Room", icon:"◆"},
  {title:"Afterglow", artist:"Mira", icon:"✧"},
  {title:"Golden Hour", artist:"Solaris", icon:"●"}
];

let current = -1, playing = false, seconds = 0;
let favorites = JSON.parse(localStorage.getItem("beatwaveFavorites") || "[]");

const songBox = document.getElementById("songs");
const playlistBox = document.getElementById("playlistList");
const count = document.getElementById("count");
const playBtn = document.getElementById("playBtn");
const progress = document.getElementById("progress");

function renderSongs(list=songs){
  songBox.innerHTML = list.map((s,i)=>`
    <article class="song">
      <div class="cover">${s.icon}</div>
      <div class="song-info">
        <div><h3>${s.title}</h3><p>${s.artist}</p></div>
        <button class="heart ${favorites.includes(s.title) ? "active":""}" onclick="toggleFavorite('${s.title}')">${favorites.includes(s.title) ? "♥":"♡"}</button>
      </div>
      <button class="small-btn" style="margin-top:13px;width:100%" onclick="selectSong(${songs.indexOf(s)})">▶ Escuchar</button>
    </article>`).join("");
}
function renderPlaylist(){
  if(!favorites.length){playlistBox.innerHTML='<div class="empty">Tu playlist está vacía.<br><small>Presiona ♡ en una canción para agregarla.</small></div>'}
  else playlistBox.innerHTML=favorites.map((name)=>{let s=songs.find(x=>x.title===name);return `<div class="playlist-item"><div class="mini-cover">${s.icon}</div><div><strong>${s.title}</strong><p style="color:var(--muted);font-size:12px">${s.artist}</p></div><button class="remove" onclick="toggleFavorite('${s.title}')">✕</button></div>`}).join("");
  count.textContent=`${favorites.length} canción${favorites.length===1?"":"es"}`;
}
function toggleFavorite(title){
  favorites.includes(title) ? favorites=favorites.filter(x=>x!==title) : favorites.push(title);
  localStorage.setItem("beatwaveFavorites",JSON.stringify(favorites)); renderSongs(); renderPlaylist();
}
function selectSong(i){
  current=i; seconds=0; playing=true;
  document.getElementById("playerTitle").textContent=songs[i].title;
  document.getElementById("playerArtist").textContent=songs[i].artist;
  document.getElementById("playerCover").textContent=songs[i].icon;
  playBtn.textContent="❚❚";
  progress.value=0;
}
function togglePlay(){
  if(current===-1) selectSong(0); else {playing=!playing;playBtn.textContent=playing?"❚❚":"▶"}
}
function next(){selectSong((current+1+songs.length)%songs.length)}
function prev(){selectSong((current-1+songs.length)%songs.length)}
playBtn.onclick=togglePlay;
document.getElementById("nextBtn").onclick=next;
document.getElementById("prevBtn").onclick=prev;
document.getElementById("heroPlay").onclick=()=>{selectSong(0);document.querySelector(".player").scrollIntoView({behavior:"smooth"})};
document.getElementById("shuffleBtn").onclick=()=>{renderSongs([...songs].sort(()=>Math.random()-.5));};
progress.oninput=()=>seconds=Number(progress.value)*2.22;
setInterval(()=>{if(playing){seconds+=1;if(seconds>=222){next();return}progress.value=(seconds/222)*100;document.getElementById("currentTime").textContent=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,"0")}`}},1000);

document.getElementById("themeBtn").onclick=()=>{
  document.body.classList.toggle("light");
  const light=document.body.classList.contains("light");
  document.getElementById("themeBtn").textContent=light?"🌙":"☀️";
  localStorage.setItem("beatwaveTheme",light?"light":"dark");
};
if(localStorage.getItem("beatwaveTheme")==="light"){document.body.classList.add("light");document.getElementById("themeBtn").textContent="🌙"}
renderSongs();renderPlaylist();
