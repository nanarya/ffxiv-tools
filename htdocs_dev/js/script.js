
//console.log("hello world!!??????");

let card;
card = document.querySelectorAll('.card');

let init = () => {
  loadActive();
  eventHandler();
}

let eventHandler = () => {
  for(let i of card){
    i.addEventListener('click', cardClick, false);
  }
  //console.log(card);
}

function cardClick() {
  //console.log(this);
  this.classList.toggle('is-active');
  saveActive();
}
console.log("lo");
let saveActive = () => {
  let savedata = {};
  for(let i = 0; i < card.length; i++){
    savedata[card[i].id] = card[i].classList.contains('is-active')
  }
  // console.log(savedata);
  // console.log(JSON.stringify(savedata));

  localStorage.setItem('activeFlg', JSON.stringify(savedata));
}

let loadActive = () => {
  if(localStorage.getItem('activeFlg')) {
    let loaddata = JSON.parse(localStorage.getItem('activeFlg'));
    console.log(loaddata);
    //console.log(Object.keys(loaddata).length);
    for(let i = 0; i < Object.keys(loaddata).length; i++){
      if(!loaddata["card" + i]){
        document.getElementById("card" + i).classList.remove('is-active')
      }
    }
  }
}
init();
