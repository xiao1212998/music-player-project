const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const cover = document.getElementById('cover');
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const listBtn = document.getElementById('list-btn');
const playlistContainer = document.getElementById('playlist-container');
const playlistEl = document.getElementById('playlist');

// 完美匹配你截图里的所有资源
const songs = [
    {
        name: '歌曲一',
        artist: '未知歌手',
        src: 'mp3/music0.mp3',
        cover: 'img/record0.jpg',
        bg: 'img/bg0.png'
    },
    {
        name: '歌曲二',
        artist: '未知歌手',
        src: 'mp3/music1.mp3',
        cover: 'img/record1.jpg',
        bg: 'img/bg1.png'
    },
    {
        name: '歌曲三',
        artist: '未知歌手',
        src: 'mp3/music2.mp3',
        cover: 'img/record2.jpg',
        bg: 'img/bg2.png'
    },
    {
        name: '歌曲四',
        artist: '未知歌手',
        src: 'mp3/music3.mp3',
        cover: 'img/record3.jpg',
        bg: 'img/bg3.png'
    }
];

let songIndex = 0;

// 初始化播放器
loadSong(songs[songIndex]);
renderPlaylist();

// 加载歌曲信息与动态背景
function loadSong(song) {
    audio.pause(); // 暂停当前播放的音频
    title.innerText = song.name;
    artist.innerText = song.artist;
    audio.src = song.src;
    audio.load(); // 强制重新加载音频源
    cover.src = song.cover;
    // 动态更换网页背景图
    document.body.style.backgroundImage = `url('${song.bg}')`;
    // 重置播放速率，确保正常速度
    audio.playbackRate = 1;
    updatePlaylistActive();
}

// 播放音乐
function playSong() {
    audio.play();
    playIcon.src = 'img/暂停.png'; // 切换为暂停图标
    cover.classList.add('playing'); 
}

// 暂停音乐
function pauseSong() {
    audio.pause();
    playIcon.src = 'img/继续播放.png'; // 切换为播放图标
    cover.classList.remove('playing'); 
}

// 播放/暂停按钮点击事件
playBtn.addEventListener('click', () => {
    const isPlaying = cover.classList.contains('playing');
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

// 上一曲
prevBtn.addEventListener('click', () => {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1; 
    }
    loadSong(songs[songIndex]);
    playSong();
});

// 下一曲
function playNext() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0; 
    }
    loadSong(songs[songIndex]);
    playSong();
}
nextBtn.addEventListener('click', playNext);
audio.addEventListener('ended', playNext); 

// 更新进度条
audio.addEventListener('timeupdate', (e) => {
    const { duration, currentTime } = e.srcElement;
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        let min_current = Math.floor(currentTime / 60);
        let sec_current = Math.floor(currentTime % 60);
        if (sec_current < 10) sec_current = `0${sec_current}`;
        currentTimeEl.innerText = `${min_current}:${sec_current}`;

        let min_duration = Math.floor(duration / 60);
        let sec_duration = Math.floor(duration % 60);
        if (sec_duration < 10) sec_duration = `0${sec_duration}`;
        durationEl.innerText = `${min_duration}:${sec_duration}`;
    }
});

// 点击进度条跳转
progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
});

// 显示/隐藏播放列表
listBtn.addEventListener('click', () => {
    playlistContainer.classList.toggle('show');
});

// 渲染播放列表DOM
function renderPlaylist() {
    playlistEl.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerText = `${song.name} - ${song.artist}`;
        li.addEventListener('click', () => {
            songIndex = index;
            loadSong(songs[songIndex]);
            playSong();
        });
        playlistEl.appendChild(li);
    });
}

// 播放列表高亮当前歌曲
function updatePlaylistActive() {
    const listItems = playlistEl.querySelectorAll('li');
    listItems.forEach(li => li.classList.remove('active'));
    if(listItems[songIndex]) {
        listItems[songIndex].classList.add('active');
    }
}