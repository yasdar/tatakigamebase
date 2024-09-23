import 'phaser';

import { click_Anim, GameData, getLevels, placeIt, saveLanguage, tween_Elastic, tween_ElasticY, tween_Rotate, UpDown} from "./utils";
import { Bg } from './objects/Bg';

export class Flags extends Phaser.Scene {

    cadre_flag:Phaser.GameObjects.Image;
    homeBtn:Phaser.GameObjects.Image;

    //top layer with alpha
    _layer:Bg;
    actualFlag:Phaser.GameObjects.Image;
    TXT_perc:Phaser.GameObjects.Text;

    currentFlagFrameName:string;
     constructor() {super("Flags");}
     preload(): void {}
     create(): void {

        let bg = new Bg(this);
        bg.layer.setAlpha(0);

        this.homeBtn = this.add.image(0,0,'languages_menu','Button_Home0000');
        placeIt(this.homeBtn,this,0.1,0.07);
        this.homeBtn.setInteractive({cursor:"pointer"});
        this.homeBtn.on('pointerdown',()=>{
          click_Anim(this.homeBtn,this,this.backHome.bind(this));
        })

        this.addFlag('Flag_EN0000',"English",0.3,0.3);
        this.addFlag('Flag_IT0000',"Italian",0.3,0.55);
        this.addFlag('Flag_FR0000',"French",0.7,0.3);
        this.addFlag('Flag_ES0000',"Spanish",0.7,0.55);
        this.addFlag('Flag_PT0000',"Portuguese",0.5,0.8);

        this._layer = new Bg(this);
        this._layer.layer.setAlpha(0);
        this._layer.base.setTint(0x000000);
        this._layer.setAlpha(0.66);
        this._layer.base.setInteractive();
        this._layer.setVisible(false);

        this.actualFlag = this.add.image(0,0,'');
        this.actualFlag.setVisible(false);
        placeIt(this.actualFlag,this,0.5,0.5);

        const style:any ={font: "bold 42px bariol_boldbold",color: "#ffffff",
            shadow: { color: "#000000", fill: true, offsetX: 1, offsetY: 1, blur: 0 }
        };
        this.TXT_perc = this.add.text(0,0,'',style);
        this.TXT_perc.setVisible(false);
        this.TXT_perc.setOrigin(0.5,0.5);
       

   }
   addFlag(frameName:string,Lang:string,x:number,y:number){

    const style:any ={font: "bold 36px bariol_boldbold",color: "#ffffff",
        shadow: { color: "#000000", fill: true, offsetX: 1, offsetY: 1, blur: 0 }
    };

    let img = this.add.image(0,0,'languages_menu',frameName);
    placeIt(img,this,x,y);
    img.setInteractive({cursor:"pointer"});
    let TXT = this.add.text(0, 0, Lang, style);
    TXT.setOrigin(0.5,0.5);
    TXT.setPosition(img.x,img.y-img.displayHeight*0.7);
    img.on('pointerdown',()=>{this.selectFlag(img)});
    //show current flag hilight
    if(frameName.indexOf((GameData.Languge).toUpperCase())!= -1){
        this.cadre_flag = this.add.image(0,0,'languages_menu','Selection0000');
        this.cadre_flag.setPosition(img.x,img.y);
    }
    
   }
   selectFlag(img:Phaser.GameObjects.Image){
    this.currentFlagFrameName = img.frame.name;
    this.cadre_flag.setPosition(img.x,img.y);
    this.cadre_flag.setAlpha(0);
    click_Anim(img,this,this.Load_Language.bind(this));
   }
   Load_Language(){
    this.cadre_flag.setAlpha(1);
    //get corret path
    let _name = GameData.LangFromName[this.currentFlagFrameName]+"_sounds";
    GameData.Languge = (GameData.LangFromName[this.currentFlagFrameName]).toUpperCase();
    saveLanguage();
    //load the assets
    getLevels();

    
     this.load.audioSprite(
      GameData.LangFromName[this.currentFlagFrameName]+'_fx_mixdown', 
      'assets/audio/words/'+GameData.LangFromName[this.currentFlagFrameName]+'_fx_mixdown.json',
        'assets/audio/words/'+GameData.LangFromName[this.currentFlagFrameName]+'_sounds.mp3'
    );
    
    this.load.on("progress", this.fileComplte, this);
    this.load.on("complete", this.complete, this);
    //show layer
    this._layer.setVisible(true);
    this.actualFlag.setTexture('languages_menu',this.currentFlagFrameName);
    this.actualFlag.setVisible(true);
    this.TXT_perc.setPosition(this.actualFlag.x,this.actualFlag.y+this.actualFlag.displayHeight*0.7)
    this.TXT_perc.setVisible(true);
    this.load.start();

   }
   fileComplte(progress: any) {
    this.TXT_perc.setText(Math.round(progress * 100) + "%");
  }
  complete() {
    this._layer.setVisible(false);
    this.TXT_perc.setVisible(false);
    this.actualFlag.setVisible(false);
  }
   backHome(){
     //scene transtion with fade out
     this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam:any, effect:any) => {
		this.scene.start('Home');

	});
    this.cameras.main.fadeOut(300, 0, 0, 0);
   }
 }