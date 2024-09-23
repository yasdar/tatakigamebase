import 'phaser';

import {  GameData, placeIt, playAudio, tween_Elastic, tween_Rays1, tween_Rays2, tween_Rotate} from "./utils";
import { Bg } from './objects/Bg';

export class completeLetterScreen extends Phaser.Scene {
   
    
   backTitle1:Phaser.GameObjects.Image;
   backTitle2:Phaser.GameObjects.Image;

    //title
    title:Phaser.GameObjects.Image;
    titleTXT:Phaser.GameObjects.Text;
    //playBtn
    playBtn:Phaser.GameObjects.Image;
    playBtnArrow:Phaser.GameObjects.Image;
    TXT:Phaser.GameObjects.Text;
    //menu
    menuBtn:Phaser.GameObjects.Image;
    TXTmenu:Phaser.GameObjects.Text;
    //replay
    replayBtn:Phaser.GameObjects.Image;
    TXTreplay:Phaser.GameObjects.Text;

     letterObj:any;

     constructor() {super("completeLetterScreen");}
     init(letterObj:any){
        this.letterObj = letterObj;
        console.log('received',this.letterObj)
     }
     preload(): void {}

     create(): void {

      playAudio('kids_cheers');

        let _Bg:Bg = new Bg(this);

        _Bg.base.setTexture(this.letterObj.bg.texture,this.letterObj.bg.frame);
        _Bg.layer.setTexture('backgrounds_1',"_Items0000");
        _Bg.refresh();


        let data_text:any = this.cache.json.get('_texts')[(GameData.Languge).toLowerCase()];

        this.backTitle2 = this.add.image(0,0,"graphics_1","Rays0000");
        placeIt(this.backTitle2,this,0.5,0.33);
        this.backTitle2.setAlpha(0.4);
        tween_Rays2(this.backTitle2,this);

        this.backTitle1 = this.add.image(0,0,"graphics_1","Rays0000");
        this.backTitle1.setScale(0.9);
        placeIt(this.backTitle1,this,0.5,0.4);
        this.backTitle1.setAlpha(0.6);
        this.backTitle1.setAngle(6)
        tween_Rays1(this.backTitle1,this,18);

        //console.log("ee",this.letterObj.picture.texture,this.letterObj.picture.frame)
        this.title = this.add.image(0,0,this.letterObj.picture.texture,this.letterObj.picture.frame);
        placeIt(this.title,this,0.5,0.31);
        tween_Elastic(this.title,this);
        this.title.setInteractive();
        this.title.on('pointerdown',()=>{this.playTheWord();});

        this.titleTXT = this.add.text(0,0,(this.letterObj.picture.word).toUpperCase(),{
            font: "bold 96px bariol_boldbold",
            color: "#ffffff",
            shadow: { color: "#5a5a5a", fill: true, offsetX: 2, offsetY: 2, blur: 0 }
          });
          this.titleTXT.setOrigin(0.5,0.5)
        placeIt(this.titleTXT,this,0.5,0.6);
        tween_Elastic(this.titleTXT,this);

        this.playBtn = this.add.image(0,0,'graphics_1','Button_Next0000');
        placeIt(this.playBtn,this,0.5,0.8);
        this.playBtn.setInteractive({cursor:"pointer"});
        this.playBtn.on('pointerdown',()=>{
          playAudio('tap');
            //actual level
            let index:number = GameData.levelsIndex.indexOf(GameData.currentLetter);

            if(index+1 >= GameData.maxletter){
              console.log('! this is thelast latter !')
            }
            else{
              //next letter
              GameData.currentLetter = GameData.levelsIndex[index+1];
              console.log('play next',GameData.currentLetter);
              this.goPlay();
            }
            

        })
        this.playBtn.on('pointerover',()=>{tween_Rotate(this.playBtn,this);})


            let index:number = GameData.levelsIndex.indexOf(GameData.currentLetter);
            if(index+1 >= GameData.maxletter){this.playBtn.setAlpha(0.2);}
            else{this.playBtn.setAlpha(1);}
       


        
        
        
        this.menuBtn = this.add.image(0,0,'graphics_1','Button_Menu0000');
        placeIt(this.menuBtn,this,0.23,0.8);
        this.menuBtn.setInteractive({cursor:"pointer"});
        this.menuBtn.on('pointerdown',()=>{ playAudio('tap');this.openMenu();})


        this.replayBtn= this.add.image(0,0,'graphics_1','Button_Restart0000');
        placeIt(this.replayBtn,this,0.77,0.8);
        this.replayBtn.setInteractive({cursor:"pointer"});
        this.replayBtn.on('pointerdown',()=>{
             playAudio('tap');
            this.goPlay();
        })


          


        this.TXT = this.add.text(0, 0,data_text.next, {
          font: "bold 36px bariol_boldbold",
          color: "#ffffff"
        });
        this.TXT.setOrigin(0.5,0.5);
        placeIt(this.TXT,this,0.5,0.91);


        this.TXTmenu= this.add.text(0, 0,data_text.menu, {
            font: "bold 36px bariol_boldbold",
            color: "#ffffff"
          });
          this.TXTmenu.setOrigin(0.5,0.5);
          placeIt(this.TXTmenu,this,0.23,0.91);


        this.TXTreplay =this.add.text(0, 0,data_text.restart, {
            font: "bold 36px bariol_boldbold",
            color: "#ffffff"
          });
          this.TXTreplay.setOrigin(0.5,0.5);
          placeIt(this.TXTreplay,this,0.77,0.91);


          setTimeout(() => {this.playTheWord();}, 1000);


          this.playBtn.setVisible(false);
          this.menuBtn.setVisible(false);
          this.replayBtn.setVisible(false);
          this.TXT.setVisible(false);
          this.TXTmenu.setVisible(false);
          this.TXTreplay.setVisible(false);
        setTimeout(() => {
          this.TXT.setVisible(true);
          this.TXTmenu.setVisible(true);
          this.TXTreplay.setVisible(true);
          this.playBtn.setVisible(true);
          this.menuBtn.setVisible(true);
          this.replayBtn.setVisible(true);

            tween_Rotate(this.playBtn,this);
        }, 1500);
   }
  playTheWord(){
    let l:string = GameData.Languge.toLowerCase();
    if(GameData.SoundEnabled && GameData.UserInteract){
      this.sound.addAudioSprite(l+'_fx_mixdown',{volume:1}).play(GameData.currentLetter+'_word');
    }
  }
   goPlay(){
    this.cameras.main.once(
       Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam:any, effect:any) => {
       this.scene.start('PlayGame');
   });
   this.cameras.main.fadeOut(300, 0, 0, 0);
  }
   openMenu(){
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam:any, effect:any) => {
      this.scene.start('Menu');

  });
  this.cameras.main.fadeOut(300, 0, 0, 0);

   }
 }

 //flag screen with loading data