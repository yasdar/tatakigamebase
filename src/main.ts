import $ from "jquery";
import { Boot } from "./Boot";
import { PlayGame } from "./PlayGame";
import { Preload } from "./Preload";
import { GameData, getLevels, getSavedLanguage, mobileAndTabletcheck } from "./utils";
import { Home } from "./Home";
import { Flags } from "./Flags";
import { Menu } from "./Menu";
import { completeLetterScreen } from "./completeLetterScreen";
import { EndScreen } from "./EndScreen";
import { FreeDraw } from "./FreeDraw";


$(function(){ 
  console.log('Game Base : version V1');
    checkScreenRotation();
    window.onresize = function(event) {checkScreenRotation();};
    startGame();
});


function checkScreenRotation(){

  if(mobileAndTabletcheck() && window.innerWidth>window.innerHeight){
    $('#rotate').show();
  }else{
    $('#rotate').hide();
  }
}


function startGame(){
    
    //create the game

getSavedLanguage();
getLevels();
console.log('start game now',GameData.Languge);
console.log('currentLevel',GameData.currentLevel);
console.log('GameData.playedLevel',GameData.playedLevel);


let game_width = 640;
let game_height = 900;
/*if(mobileAndTabletcheck()){
  game_width = window.innerWidth;
  game_height = window.innerHeight;
}*/
      new Phaser.Game(
        {
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: 'GameDiv',
            width: game_width,
            height: game_height
        },
        backgroundColor: '#000000',
        scene: [Boot,Preload,Home,PlayGame,Flags,Menu,completeLetterScreen,EndScreen,FreeDraw]
    }
    );
   }