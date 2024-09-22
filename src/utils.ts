import { delay, repeat } from 'lodash';
import 'phaser';

export let shuffleArray = function shuffleArray(array:any) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }
  export let GameObj:Array<any>=[];

export let GameData:any = {
  equa:{case:'',X:0,Y:0,pente:0,ori:0},
  UserInteract:false,
  gameSize:{width:0,height:0},
  SoundEnabled:true,
  Languge:'EN',
  maxletter:26,
  LangFromName:{
    'Flag_EN0000':"en",
    'Flag_IT0000':"it",
    'Flag_FR0000':"fr",
    'Flag_ES0000':"es",
    'Flag_PT0000':"pt",
  },
  MenuPage:0,
  currentLevel:1,
  playedLevel:0,
  currentLetter:'',
  levelsOrder:[
    "Aa", "Bb", "Cc",
    "Dd", "Ee", "Ff",
    "Gg", "Hh", "Ii",
    "Jj", "Kk", "Ll",
    
    "Mm", "Nn", "Oo",
    "Pp", "Qq", "Rr",
    "Ss", "Tt", "Uu",
    "Vv", "Ww", "Xx",
    
    "Yy", "Zz"],
    levelsIndex:[
      "a", "b", "c",
      "d", "e", "f",
      "g", "h", "i",
      "j", "k", "l",
      
      "m", "n", "o",
      "p", "q", "r",
      "s", "t", "u",
      "v", "w", "x",
      
      "y", "z"]

}


export const  mobileAndTabletcheck = ()=>{
  var check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
      check = true; })(navigator.userAgent || navigator.vendor);
  return check;
};

export const placeIt = (obg:any,_scene:any,Xcoef:number,Ycoef:number)=> {
  obg.setPosition(
  _scene.cameras.main.width*Xcoef,
  _scene.cameras.main.height*Ycoef);
}



export const tween_Elastic = (obg:any,_scene:any)=> {
  _scene.tweens.add({
    targets:obg,
    duration:700,
    scaleX:1.05,
    scaleY:0.95,
    yoyo:true,
    repeat:-1,
    ease:Phaser.Math.Easing.Bounce
  })
}


export const click_Anim = (obg:any,_scene:any,callBack:Function)=> {

  if(obg.scaleX <1){return;}

  _scene.tweens.add({
    targets:obg,
    duration:50,
    scaleX:0.90,
    scaleY:0.90,
    yoyo:true,
    ease:Phaser.Math.Easing.Linear,
    onComplete:()=>{ callBack();}
  })
}

export const tween_EndOf_letter = (top:any,back:any,stars:any,_scene:any)=> {
  _scene.tweens.add({
    targets:[top,back],
    duration:300,
    delay:1000,
    scaleY:0.1,
    scaleX:0.1,
    alpha:0,
    ease:Phaser.Math.Easing.Bounce
  })

  _scene.tweens.add({
    targets:stars,
    duration:300,
    delay:1300,
    alpha:0,
    ease:Phaser.Math.Easing.Bounce
  })
}

export const tween_Rays1 = (obj:any,_scene:any,_angle:number)=> {
  _scene.tweens.add({
    targets:obj,
    duration:1200,
    angle:_angle,
    alpha:0,
    yoyo:true,
    repeat:-1,
    ease:Phaser.Math.Easing.Linear
  })
}
export const tween_Rays2 = (obj:any,_scene:any)=> {
  _scene.tweens.add({
    targets:obj,
    duration:500,
    alpha:0,
    yoyo:true,
    repeat:-1,
    ease:Phaser.Math.Easing.Linear
  })
}

export const tween_complete_letter = (top:any,back:any,_scene:any)=> {
  _scene.tweens.add({
    targets:[top,back],
    duration:300,
    delay:600,
    scaleY:1.1,
    scaleX:1.1,
    yoyo:true,
    ease:Phaser.Math.Easing.Bounce,
    onComplete:()=>{}
  })
  
};

export const tween_complete_stars = (A:Array<any>,_scene:any)=> {
  _scene.tweens.add({
    targets:[A[0],A[3]],
    duration:300,
    delay:1000,
    x:A[0].x-32,
    y:A[0].y-24,
    angle:30,
    yoyo:true,
    ease:Phaser.Math.Easing.Bounce
    
  })

  _scene.tweens.add({
    targets:[A[1],A[4]],
    duration:300,
    delay:1000,
    y:A[1].y+16,
    yoyo:true,
    ease:Phaser.Math.Easing.Bounce
  })

  _scene.tweens.add({
    targets:[A[2],A[5]],
    duration:300,
    delay:1000,
    x:A[2].x+32,
    y:A[2].y-28,
    angle:-30,
    yoyo:true,
    ease:Phaser.Math.Easing.Bounce
  })
  
};
export const tween_Rotate = (obg:any,_scene:any)=> {

  if(obg.angle != 0){return;}

  _scene.tweens.add({
    targets:obg,
    duration:100,
    angle:8,
    yoyo:true,
    repeat:2,
    ease:Phaser.Math.Easing.Bounce
  })
}



export const tween_ElasticY = (obg:any,_scene:any)=> {
  _scene.tweens.add({
    targets:obg,
    duration:800,
    scaleY:0.95,
    yoyo:true,
    repeat:-1,
    ease:Phaser.Math.Easing.Linear
  })
}


export const UpDown = (obg:any,_scene:any,_delay:number)=> {

  let Y:number = obg.y;

  _scene.tweens.add({
    targets:obg,
    duration:800,
    y:Y-16,
    yoyo:true,
    delay:_delay,
    repeat:-1,
    //repeatDelay:100,
    ease:Phaser.Math.Easing.Linear
  })
}

export const tween_small_star = (obg:Phaser.GameObjects.Image,_scene:any)=> {
   
  _scene.tweens.add({
    targets:obg,
    duration:400,
    scaleY:1.1,
    scaleX:1.1,
    yoyo:true,
    repeat:-1,
    ease:Phaser.Math.Easing.Linear
  })

  _scene.tweens.add({
    targets:obg,
    duration:800,
    angle:10,
    yoyo:true,
    repeat:-1,
    ease:Phaser.Math.Easing.Linear
  })

}


export const tween_big_star = (obg:Phaser.GameObjects.Image,_target:Phaser.GameObjects.Image,_scene:any)=> {
   
  _scene.tweens.add({
    targets:obg,
    duration:100,
    scaleY:1.1,
    scaleX:1.1,
    angle:-15,
    ease:Phaser.Math.Easing.Linear
  })

  _scene.tweens.add({
    targets:obg,
    duration:400,
    delay:200,
    x:_target.x,
    y:_target.y,
    angle:359,
    onComplete:()=>{ 
      obg.setScale(1,1); 
      obg.setAngle(0); 
      obg.setTexture('graphics_1','Star_GUI_White0000');
      playAudio('Collect_Item');
    },
    ease:Phaser.Math.Easing.Linear
  })


  _scene.tweens.add({
    targets:obg,
    duration:200,
    delay:700,
    scaleY:1.1,
    scaleX:1.1,
    yoyo:true,
    ease:Phaser.Math.Easing.Linear,
    onStart:()=>{
      obg.setTexture('graphics_1','Star_GUI0000');
    }
  })
    
}



export const tween_shine = (obg:Phaser.GameObjects.Container,_target:Phaser.GameObjects.Image,_scene:any)=> {

  obg.setPosition(_target.x,_target.y);
  obg.setScale(0.6);
  
  _scene.tweens.add({
    targets:obg,
    duration:200,
    alpha:1,
    scaleY:1,
    scaleX:1,
    onUpdate:()=>{
      obg.getAll().forEach((_shine:any)=>{
        _shine.setAngle(_shine.angle+3);
      })
    },
    ease:Phaser.Math.Easing.Linear
  })


  _scene.tweens.add({
    targets:obg,
    duration:400,
    delay:200,
    alpha:0,
    ease:Phaser.Math.Easing.Linear
  })
    
}



export const resetLevels = ()=> {
  GameData.playedLevel = 0;
  GameData.currentLevel = 1;

  localStorage.setItem("playedLevel", "0");
  localStorage.setItem("currentLevel", "1");

}

export const IncreaseLevels =  ()=> {
  GameData.playedLevel = GameData.currentLevel;
  GameData.currentLevel = GameData.currentLevel+1;

  if(GameData.currentLevel > GameData.maxletter){GameData.currentLevel = GameData.maxletter};

  localStorage.setItem("playedLevel", (GameData.playedLevel).toString());
  localStorage.setItem("currentLevel", (GameData.currentLevel).toString());
}


export const getLevels =  ()=> {
  if(localStorage.getItem("playedLevel")){
    GameData.playedLevel = Number(localStorage.getItem("playedLevel"));
    GameData.currentLevel = Number(localStorage.getItem("currentLevel"));
  }else{
    resetLevels();
  }
}

export const saveLanguage = ()=>{
  console.log('save now',GameData.Languge)
  localStorage.setItem("Languge", (GameData.Languge).toString());
}


const supportedLanguages:any = {
	en:"english",
	fr:"french",
	it:"italian",
	pt:"portuguese",
	es:"spanish"
};

export const getSavedLanguage = ()=>{
  if( localStorage.getItem("Languge")){
    GameData.Languge = localStorage.getItem("Languge"); 
  }else{
    //get default brwoser language
    GameData.Languge = (navigator.language).substring(0,2);
    GameData.Languge = GameData.Languge.toUpperCase();

    if( supportedLanguages[GameData.Languge] == undefined ){
      console.log('unsupported Language',GameData.Languge);
      GameData.Languge = "EN";
      console.log('use defualt Language',GameData.Languge)
    }


   
  }
  
}

export let all_audios:any={};

export const playAudio =  (audioName:string)=> {
  if(GameData.SoundEnabled && GameData.UserInteract){

    if(audioName == 'MainLoop' && all_audios[audioName].isPaused){
      all_audios[audioName].resume();
    }
    else{
      all_audios[audioName].play();
    }
  }
}


export const stopAudio =  (audioName:string)=> {
  if(audioName == 'MainLoop' && !all_audios[audioName].isPaused){
    all_audios[audioName].pause();
  }else{
    all_audios[audioName].stop();
  }
   
}

export const formatJson = (data:any)=>{
  //console.log(Object.keys(data));
  let _data:any = {
    "spritemap": {}
  }
  let a2:Array<any>=[];
  let a1 = Object.keys(data);

  a1.forEach((item:string)=>{
   /* a2.push(
      {
      "start": data[item][0],
      "end": data[item][1],
      "loop": false
      }
    );*/
    //console.log(data[item])

    _data.spritemap[item] = {
      "start": data[item][0],
      "end": data[item][1],
      "loop": false
      }
  });

  
  console.log('voila',_data);
}
