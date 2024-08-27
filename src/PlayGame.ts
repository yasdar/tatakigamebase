import 'phaser';
import { Bg } from './objects/Bg';
import { click_Anim, GameData, placeIt } from './utils';


export class PlayGame extends Phaser.Scene {
   
    bg:Bg;

    homeBtn:Phaser.GameObjects.Image;
    //sound control
    soundBt:Phaser.GameObjects.Image;
    //3 stars
    allstars:Array<Phaser.GameObjects.Image>;

    letterTop:Phaser.GameObjects.Image
    letterBottom:Phaser.GameObjects.Image


    graphics : Phaser.GameObjects.Graphics;


    isDown:boolean = false;
     constructor() {super("PlayGame");}
    
     preload(): void {
     }
     create(): void {

        this.bg = new Bg(this);
        this.bg.base.setTexture('backgrounds_1','BG_Green0000');
        this.bg.layer.setTexture('backgrounds_1',"_Items0000");
        this.bg.refresh();


        this.homeBtn = this.add.image(0,0,'choose_level','Button_Home0000');
        placeIt(this.homeBtn,this,0.90,0.07);
        this.homeBtn.setInteractive({cursor:"pointer"});
        this.homeBtn.on('pointerdown',()=>{
          click_Anim(this.homeBtn,this,this.backMenu.bind(this));
        })

         this.soundBt = this.add.image(0,0,'choose_level','Button_Sound_On0000');
         if(!GameData.SoundEnabled){ this.soundBt.setTexture('choose_level','Button_Sound_Off0000')}
        placeIt(this.soundBt,this,0.76,0.07);
        this.soundBt.setInteractive({cursor:"pointer"});
        this.soundBt.on('pointerdown',()=>{
          click_Anim(this.soundBt,this,this.toggleSound.bind(this));
        })


        let star1 = this.add.image(0,0,'graphics_1','Star_GUI_Empty0000');
        placeIt(star1,this,0.32,0.82);
        let star2 = this.add.image(0,0,'graphics_1','Star_GUI_Empty0000');
        placeIt(star2,this,0.5,0.82);
        let star3 = this.add.image(0,0,'graphics_1','Star_GUI_Empty0000');
        placeIt(star3,this,0.67,0.82);

        this.allstars=[star1,star2,star3];


        this.Addletter();




      //  this.graphics.clear();

    /*  this.graphics = this.add.graphics();
      this.graphics.fillStyle(0xffffff, 1);
      this.graphics.fillCircle(360,400, 32);
      setTimeout(() => {
          this.graphics.fillCircle(376,416, 32);
      }, 2000);
      this.graphics.setVisible(false)
    var mask = this.graphics.createGeometryMask();
this.letterTop.mask = mask;
*/








     }

     update(): void {

     }
     Addletter(){
        //GameData.currentLetter
        console.log("Addletter",GameData.currentLetter,GameData.Languge);

        let data_letter = this.cache.json.get((GameData.Languge).toLowerCase()+'_letters');
        let letterObj =data_letter[GameData.currentLetter];
        console.log(GameData.currentLetter,letterObj);

        //update background image
        this.bg.base.setTexture(letterObj.bg.texture,letterObj.bg.frame);

        let backFrame:string = letterObj['upper'].frame.replace('_Upper','_Upper_Back')
        this.letterBottom = this.add.image(0,0,letterObj['upper'].texture,backFrame);
        this.letterTop = this.add.image(0,0,letterObj['upper'].texture,letterObj['upper'].frame);

        placeIt(this.letterBottom,this,0.5,0.5);
        placeIt(this.letterTop,this,0.5,0.5);


        console.log("spline to apply",letterObj['upper'].splines);
        let SplineDots:any = letterObj['upper'].splines;
        
       // for(let i: number = 0; i < SplineDots.length; i++){
          let block = SplineDots[0];
          for(let n:number=0; n <block.length; n++){
           // console.log(this.letterTop.x+block[n].x,this.letterTop.y+block[n].y)
            this.add.image(
              this.letterTop.x-this.letterTop.displayWidth*0.5+block[n].x,
              this.letterTop.y-this.letterTop.displayHeight*0.5+block[n].y,'choose_level','Pagination_Inner0000'
            ).setTint(0x000000);
          }
        //}


        this.letterBottom.setInteractive(this.input.makePixelPerfect());
        this.letterBottom.on('pointermove',()=>{
          if(this.isDown) {
            console.log("Moving");

        }
        })

        this.letterBottom.on('pointerdown',()=>{this.isDown = true;})
        this.letterBottom.on('pointerup',()=>{this.isDown = false;})
        this.letterBottom.on('pointerout',()=>{this.isDown = false;})

     }

     toggleSound(){
        GameData.SoundEnabled = ! GameData.SoundEnabled;
              if(GameData.SoundEnabled){this.soundBt.setTexture('choose_level','Button_Sound_On0000')}
              else{this.soundBt.setTexture('choose_level','Button_Sound_Off0000')}
       }

    backMenu(){
        this.cameras.main.once(
           Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam:any, effect:any) => {
            this.scene.start('Menu');
       });
       this.cameras.main.fadeOut(300, 0, 0, 0);
      }
     
 }
