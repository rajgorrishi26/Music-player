let currentsong = new Audio();

async function getsongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  //  console.log(as);
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}
function secondsToTime(seconds) {
  // Ensure the input is a non-negative number
  if (isNaN(seconds) || seconds < 0) {
    return "Invalid input";
  }

  // Calculate minutes and seconds
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = Math.floor(seconds % 60);

  // Ensure the minutes and seconds are displayed with leading zeros if needed
  var formattedMinutes = (minutes < 10) ? "0" + minutes : minutes;
  var formattedSeconds = (remainingSeconds < 10) ? "0" + remainingSeconds : remainingSeconds;

  // Return the time in the "MM:SS" format
  return formattedMinutes + ":" + formattedSeconds;
}

const playMusic = (track, pause = false) => {
  currentsong.src = "/songs/" + track;
  if (!pause) {
    currentsong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
}
async function main() {

  let songs = await getsongs();
  playMusic(songs[0], true);
  //  show all songs in plylist
  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];

  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML +
      `<li> 
         <img class="invert" src="music.svg" alt="">
        <div class="info">
          <div>${song.replaceAll("%20", " ")}</div>
          <div>Rishi</div>
        </div>
      <div class="palynow">
        <span>Play Now</span>
        <img src="play.svg" alt="" class="invert">
      </div>
   </li>`

  }
  // attatch an event listner to each song 
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    })
  });

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "pause.svg"
      // console.log("playing");
    }
    else {
      currentsong.pause();
      play.src = "play.svg"
      // console.log("pushing");
    }
  });

  // listen for time update event 
  currentsong.addEventListener("timeupdate", () => {
    // console.log(currentsong.currentTime , currentsong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToTime(currentsong.currentTime)} / ${secondsToTime(currentsong.duration)}`
   document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
   document.querySelector(".seekbar").style.background = ` ${(currentsong.currentTime / currentsong.duration) * 100} % `
  });

  // add an event listenr on seekbar
  document.querySelector(".seekbar").addEventListener("click",e=>{
    let persent = (e.offsetX/e.target.getBoundingClientRect().width)*100 ;
    // console.log(persent);
    document.querySelector(".circle").style.left = persent + "%";
    currentsong.currentTime = ((currentsong.duration)*persent)/100;
  });                                    


}
main();