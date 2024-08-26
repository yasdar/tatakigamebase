import 'phaser';

import { click_Anim, GameData, placeIt, tween_Elastic, tween_ElasticY, tween_Rotate, UpDown} from "./utils";
import { Bg } from './objects/Bg';

export class Home extends Phaser.Scene {
   
    img:Phaser.GameObjects.Image;
    TXT:Phaser.GameObjects.Text;
    //title
    title:Phaser.GameObjects.Image;
    //sound control
    soundBt:Phaser.GameObjects.Image;
    //playBtn
    playBtn:Phaser.GameObjects.Image;
    playBtnArrow:Phaser.GameObjects.Image;
    //languae selection button
    languageBtn:Phaser.GameObjects.Image;
    //welcome animation
    animal:Phaser.GameObjects.Image;
    pop:Phaser.GameObjects.Image;
    txt:Phaser.GameObjects.Text;


     data_text :any;
     constructor() {super("Home");}
     preload(): void {}

     create(): void {
      console.log('Home Create ---- GameData.Languge',GameData.Languge);

      this.data_text = this.cache.json.get('_texts')[(GameData.Languge).toLowerCase()];
      console.log('data_text',this.data_text)

        new Bg(this);

        this.title = this.add.image(0,0,'game_logo');
        placeIt(this.title,this,0.5,0.2);
        tween_Elastic(this.title,this);

        this.soundBt = this.add.image(0,0,'main_menu','Button_Sound_On0000');

        if(!GameData.SoundEnabled){ this.soundBt.setTexture('main_menu','Button_Sound_Off0000')}

        placeIt(this.soundBt,this,0.90,0.08);
        this.soundBt.setInteractive({cursor:"pointer"});
        this.soundBt.on('pointerdown',()=>{
          click_Anim(this.soundBt,this,this.toggleSound.bind(this));
        })

        this.playBtn = this.add.image(0,0,'main_menu','Button_Play0000');
        placeIt(this.playBtn,this,0.5,0.55);
        this.playBtn.setInteractive({cursor:"pointer"});
        this.playBtn.on('pointerdown',()=>{this.openMenu();})
        this.playBtn.on('pointerover',()=>{tween_Rotate(this.playBtn,this);})

        this.languageBtn = this.add.image(0,0,'main_menu','Flag_'+GameData.Languge+'_Round0000');
        placeIt(this.languageBtn,this,0.75,0.55);
        this.languageBtn.setInteractive({cursor:"pointer"});
        this.languageBtn.on('pointerdown',()=>{
          click_Anim(this.languageBtn,this,this.openFlagsSelection.bind(this));
        })


        this.animal = this.add.image(0,0,'main_menu','Zebra0000');
        this.animal.setOrigin(0.5,1);
        placeIt(this.animal,this,0.87,1.15);
        tween_ElasticY(this.animal,this);


        this.pop = this.add.image(0,0,'main_menu',"TalkBubble0000");
        placeIt(this.pop,this,0.25,0.88);
        UpDown(this.pop,this,1000);

        this.TXT = this.add.text(0, 0, this.data_text.zebra_0, {
          font: "bold 36px bariol_boldbold",
          color: "#206b8c"
        });
        this.TXT.setOrigin(0.5,0.5);
        placeIt(this.TXT,this,0.2,0.88);
        UpDown(this.TXT,this,1000);

   }
   openFlagsSelection(){
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam:any, effect:any) => {
      this.scene.start('Flags');
      });
      this.cameras.main.fadeOut(300, 0, 0, 0);
   }
   toggleSound(){
    GameData.SoundEnabled = ! GameData.SoundEnabled;

          if(GameData.SoundEnabled){
            this.soundBt.setTexture('main_menu','Button_Sound_On0000')
          }
          else{
            this.soundBt.setTexture('main_menu','Button_Sound_Off0000')
          }
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