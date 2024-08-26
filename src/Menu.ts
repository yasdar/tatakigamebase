import 'phaser';

import { click_Anim, GameData, placeIt, tween_Elastic, tween_ElasticY, tween_Rotate, UpDown} from "./utils";
import { Bg } from './objects/Bg';

export class Menu extends Phaser.Scene {

    homeBtn:Phaser.GameObjects.Image;
    //sound control
    soundBt:Phaser.GameObjects.Image;

    //create crollable menu
    //design, dots, locked/unlocked
    //chalkboard btn

     constructor() {super("Menu");}
     preload(): void {}
     create(): void {

        let bg = new Bg(this);
        bg.base.setTexture('backgrounds_1','BG_Red0000');
        bg.layer.setTexture('backgrounds_1',"_Items0000");
        bg.refresh();

        this.homeBtn = this.add.image(0,0,'choose_level','Button_Home0000');
        placeIt(this.homeBtn,this,0.1,0.07);
        this.homeBtn.setInteractive({cursor:"pointer"});
        this.homeBtn.on('pointerdown',()=>{
          click_Anim(this.homeBtn,this,this.backHome.bind(this));
        })

         this.soundBt = this.add.image(0,0,'choose_level','Button_Sound_On0000');
         if(!GameData.SoundEnabled){ this.soundBt.setTexture('choose_level','Button_Sound_Off0000')}
        placeIt(this.soundBt,this,0.90,0.08);
        this.soundBt.setInteractive({cursor:"pointer"});
        this.soundBt.on('pointerdown',()=>{
          click_Anim(this.soundBt,this,this.toggleSound.bind(this));
        })









    }

    toggleSound(){
        GameData.SoundEnabled = ! GameData.SoundEnabled;
              if(GameData.SoundEnabled){this.soundBt.setTexture('choose_level','Button_Sound_On0000')}
              else{this.soundBt.setTexture('choose_level','Button_Sound_Off0000')}
       }

    backHome(){
        this.cameras.main.once(
           Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam:any, effect:any) => {
           this.scene.start('Home');
       });
       this.cameras.main.fadeOut(300, 0, 0, 0);
      }




 }