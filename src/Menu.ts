import 'phaser';

import { click_Anim, GameData, GameObj, OrilevelsIndex, OrilevelsOrder, placeIt, playAudio, stopAudio} from "./utils";
import { Bg } from './objects/Bg';
import { Scrollable } from './Scrollable';

export class Menu extends Phaser.Scene {

    homeBtn:Phaser.GameObjects.Image;
    //sound control
    soundBt:Phaser.GameObjects.Image;

    scrollable:Scrollable

    //dots pagination
    dotIndex : Phaser.GameObjects.Image;
    AllDots:Array<Phaser.GameObjects.Image>;
    //chalkboard btn
    chalkboardBtn : Phaser.GameObjects.Image; 
     constructor() {super("Menu");}
     preload(): void {}
     create(): void {

      

        let bg = new Bg(this);
        bg.base.setTexture('backgrounds_1','BG_Red0000');
        bg.layer.setTexture('backgrounds_1',"_Items0000");
        bg.refresh();

      //scrollable menu
      this.scrollable = new Scrollable(this);


      let data_letter = this.cache.json.get((GameData.Languge).toLowerCase()+'_letters');
      //console.log('voila',data_letter);
      //create an ew array not just point to array
      GameData.levelsOrder = [...OrilevelsOrder];
      GameData.levelsIndex = [...OrilevelsIndex];
      //console.log('okokok',OrilevelsOrder)
      let removeAt=[];

      for( let v:number = 0 ; v<GameData.levelsOrder.length; v++){
        //console.log(GameData.levelsOrder[v].charAt(1),"@",data_letter[GameData.levelsOrder[v].charAt(1)])
        if( data_letter[GameData.levelsOrder[v].charAt(1)] == undefined){
          removeAt.push(v);
        }
      }
   
       //remove not founded data
      for( let r:number = 0 ; r<removeAt.length; r++){
        GameData.levelsOrder.splice(removeAt[r], 1);
        GameData.levelsIndex.splice(removeAt[r], 1);
      }
      
//console.log("result levelsOrder",GameData.levelsOrder)
//console.log("result levelsIndex",GameData.levelsIndex)

      this.scrollable.makeThumbs(GameData.levelsOrder);

        this.scrollable.MovmentC = GameData.MenuPage;
        this.scrollable.movePage(0);

        this.scrollable.updateLevels();

       
       

        this.homeBtn = this.add.image(0,0,'choose_level','Button_Home0000');
        placeIt(this.homeBtn,this,0.1,0.07);
        this.homeBtn.setInteractive({cursor:"pointer"});
        this.homeBtn.on('pointerdown',()=>{
          playAudio('tap');
          click_Anim(this.homeBtn,this,this.backHome.bind(this));
        })

         this.soundBt = this.add.image(0,0,'choose_level','Button_Sound_On0000');
         if(!GameData.SoundEnabled){ this.soundBt.setTexture('choose_level','Button_Sound_Off0000')}
        placeIt(this.soundBt,this,0.90,0.08);
        this.soundBt.setInteractive({cursor:"pointer"});
        this.soundBt.on('pointerdown',()=>{
          playAudio('tap');
          click_Anim(this.soundBt,this,this.toggleSound.bind(this));
        })



        let dot1 = this.add.image(0,0,'choose_level','Pagination_Outer0000');
        placeIt(dot1,this,0.43,0.75);
        let dot2 = this.add.image(0,0,'choose_level','Pagination_Outer0000');
        placeIt(dot2,this,0.5,0.75);
        let dot3 = this.add.image(0,0,'choose_level','Pagination_Outer0000');
        placeIt(dot3,this,0.57,0.75);
        this.AllDots=[dot1,dot2,dot3]

        this.dotIndex = this.add.image(0,0,'choose_level','Pagination_Inner0000');
        this.dotIndex.setOrigin(0.6,0.65);
        placeIt(this.dotIndex,this,0.43,0.75);

        this.chalkboardBtn = this.add.image(0,0,'choose_level','Button_Sandbox0000')
        placeIt(this.chalkboardBtn,this,0.5,0.88);
        this.chalkboardBtn.setInteractive({cursor:"pointer"});
        this.chalkboardBtn.on('pointerdown',()=>{this.goToChalkBoard();})

        if(GameData.endScreenPlayed == 0){this.chalkboardBtn.setAlpha(0.4)}
        else{this.chalkboardBtn.setAlpha(1)}

        let data_text = this.cache.json.get('_texts')[(GameData.Languge).toLowerCase()];

        const style:any ={font: "bold 50px bariol_boldbold",color: "#ffffff",
          shadow: { color: "#5a5a5a", fill: true, offsetX: 1, offsetY: 1, blur: 0 }
      };
        let chalkboardText = this.add.text(0,0,data_text.sandbox,style);
        chalkboardText.setOrigin(0.5,0.5);
        placeIt(chalkboardText,this,0.5,0.88);

    }
    update(){
      //console.log(GameData.MenuPage); 0 -1 -2
      this.dotIndex.setX(this.AllDots[Math.abs(GameData.MenuPage)].x);
    }
    toggleSound(){
        GameData.SoundEnabled = ! GameData.SoundEnabled;
             
              if(GameData.SoundEnabled && GameData.UserInteract){
                this.soundBt.setTexture('choose_level','Button_Sound_On0000')
                playAudio('MainLoop');
              }
              else{
                this.soundBt.setTexture('choose_level','Button_Sound_Off0000')
                stopAudio('MainLoop');
              }
       }

    backHome(){
        this.cameras.main.once(
           Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam:any, effect:any) => {
           this.scene.start('Home');
       });
       this.cameras.main.fadeOut(300, 0, 0, 0);
      }
      goToChalkBoard(){
        if(GameData.endScreenPlayed == 1){
          console.log('going to chalkboard');
          this.scene.start('FreeDraw');
        }
       
      }



 }