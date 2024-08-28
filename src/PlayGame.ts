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

    letterTop:Phaser.GameObjects.Image;
    letterBottom:Phaser.GameObjects.Image;



    graphics : Phaser.GameObjects.Graphics;


    isDown:boolean = false;

/*
{
      "bg": {"texture": string,"frame": string},
      "upper": {"texture": string,"frame": string,"splines":Array<any>},
      "lower": {"texture": string,"frame": string,"splines":Array<any>},
      "picture": {
        "texture": string,"frame": string,"word": string,
        "raysOffsetX": number,"raysOffsetY": number},
      "sound": {"letter": string,"word": string}
  }
      */
    currentSplineDots:Array<Array<{
      x:number, y: number, star: boolean
    }>>
   
    targetCounter:number = 1;
    Alldots:Array<Phaser.GameObjects.Image>;
    marker:Phaser.GameObjects.Image;
    targetdot:Phaser.GameObjects.Image;
    blockCounter:number = 0;

    lastLetter:boolean = false;
     constructor() {super("PlayGame");}
    
     preload(): void {
     }
     create(): void {
      this.isDown = false;
      
      this.lastLetter = false;
      this.blockCounter = 0;

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



        this.letterBottom = this.add.image(0,0,'');
        this.letterTop = this.add.image(0,0,'');

        this.letterBottom.setInteractive(this.input.makePixelPerfect());
        this.letterBottom.on('pointermove',(P:Phaser.Input.Pointer)=>{
          if(this.isDown && this.onMarker(P) && this.near(P)) {
            //console.log("Moving");
            //move from spline point
            this.handleMarker(P);
            this.makerOnTarget();
        }
        })

        this.letterBottom.on('pointerdown',()=>{this.isDown = true;})
        this.letterBottom.on('pointerup',()=>{this.isDown = false;})
        this.letterBottom.on('pointerout',()=>{this.isDown = false;})

        this.Addletter("upper");
        this.startBlock();
        

        



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
     startBlock(){
       
        if(this.marker){this.marker.destroy();}
        this.targetCounter = 1;
        this.addBlock(this.blockCounter);//first array
        //console.log("starting letter with",this.targetCounter,this.Alldots)
        this.targetdot = this.Alldots[this.targetCounter];
        this.targetdot.setTint(0xff0000);

        
     }
     Addletter(upperORlower:"upper"|"lower"){
        if(upperORlower == "lower"){this.lastLetter = true;}
        //GameData.currentLetter
        console.log("Addletter",GameData.currentLetter,GameData.Languge);

        let data_letter = this.cache.json.get((GameData.Languge).toLowerCase()+'_letters');
        let letterObj =data_letter[GameData.currentLetter];
        console.log(GameData.currentLetter,letterObj);

        //update background image
        this.bg.base.setTexture(letterObj.bg.texture,letterObj.bg.frame);

        let backFrame:string = letterObj[upperORlower].frame.replace('_Upper','_Upper_Back')
        if(upperORlower == "lower"){
          backFrame = letterObj[upperORlower].frame.replace('_Lower','_Lower_Back')
        }
        this.letterBottom.setTexture(letterObj[upperORlower].texture,backFrame);
        this.letterTop.setTexture(letterObj[upperORlower].texture,letterObj[upperORlower].frame);

        placeIt(this.letterBottom,this,0.5,0.5);
        placeIt(this.letterTop,this,0.5,0.5);
        this.letterTop.setAlpha(0.2)

        //console.log("spline to apply",letterObj[upperORlower].splines);
        this.currentSplineDots = letterObj[upperORlower].splines;
        console.log("this.currentSplineDots",this.currentSplineDots);
       

     }
     handleMarker(P:Phaser.Input.Pointer){
      //position
      this.marker.setPosition(P.x,P.y);
      //correct position with equation
      //this.dotsEquation(P.x,P.y);
      //orientation
      let A:number = Phaser.Math.Angle.Between(P.x,P.y,this.targetdot.x,this.targetdot.y);
      this.marker.setRotation(A+Math.PI/2);
     }
     dotsEquation(X:number,Y:number){
      //y = a.x + b
      let previousdot = this.Alldots[this.targetCounter-1];
      let a = (this.targetdot.y -previousdot.y) / (this.targetdot.x-previousdot.x);
      //console.log('yy',this.targetdot.y -previousdot.y);
     // console.log('xx',this.targetdot.x-previousdot.x);

      //b = y -a.x
      let b = previousdot.y - (a*previousdot.x);

      console.log('previousdot',previousdot.x,previousdot.y);
      console.log('targetdot',this.targetdot.x,this.targetdot.y);
      console.log("droite",a,b);

      //forme cartesienne
      //y -ax - b = 0
      let d = Math.abs(a*X + 1*Y +b)/Math.sqrt(a*a + b*b);
      console.log("d",d)
     }
     addBlock(index:number){
      if(this.Alldots){
        this.Alldots.forEach((dot:Phaser.GameObjects.Image)=>{
          dot.destroy();
        })
      }
      this.Alldots=[];
        let block = this.currentSplineDots[index];
        for(let n:number=0; n <block.length; n++){
         // console.log(this.letterTop.x+block[n].x,this.letterTop.y+block[n].y)
          let dot =this.add.image(
            this.letterTop.x-this.letterTop.displayWidth*0.5+block[n].x,
            this.letterTop.y-this.letterTop.displayHeight*0.5+block[n].y,'choose_level','Pagination_Inner0000'
          );
          this.Alldots.push(dot);
          //if( block[n].star ){dot.setTexture('graphics_1','Star_Letter0000')}

          if( n == 0 ){
            dot.setTexture('graphics_1','Marker0000');
            this.marker = dot;
          }
          if (n==1){
            console.log('first dot orientation')
            let A:number = Phaser.Math.Angle.Between(this.marker.x,this.marker.y,dot.x,dot.y);
            this.marker.setRotation(A+Math.PI/2);
          }
        }
     }
//Star_GUI0000 big star
//Finger0000 finger
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

      onMarker(P:Phaser.Input.Pointer){
        //check if pointer is on marker
        let on_marker:boolean = false;
        let D = Phaser.Math.Distance.Between(this.marker.x,this.marker.y,P.x,P.y);
        if(D<this.marker.displayWidth*0.5){on_marker = true;}
        return on_marker;
      }

      near(P:Phaser.Input.Pointer){
        let nearest:boolean = false;
        //check if the next postion of the marker is near to target compared to the actual position
        let _actualDistance = Phaser.Math.Distance.Between(
          this.marker.x,this.marker.y,
          this.targetdot.x, this.targetdot.y);
        let _nextDistance = Phaser.Math.Distance.Between(P.x,P.y,
          this.targetdot.x, this.targetdot.y);

          if(_nextDistance<_actualDistance  ){nearest = true;}
          return nearest;
      }
      /**
       * marker hit target or not
       */
      makerOnTarget(){
        //check when marker hit target
        let D = Phaser.Math.Distance.Between(
          this.marker.x,this.marker.y,
          this.targetdot.x, this.targetdot.y);
          //console.log("@1",D);

        if(D<12 ){
          this.marker.setPosition(this.targetdot.x, this.targetdot.y);
          this.targetCounter++;
          //update target
          if(this.targetCounter < this.Alldots.length){
            this.targetdot = this.Alldots[this.targetCounter];
            this.targetdot.setTint(0xff0000);
          }
          else{
            console.log("end of all points");
            this.isDown = false;
            //check next block if exist
            this.blockCounter++;
            if(this.blockCounter < this.currentSplineDots.length){
              this.startBlock();
            }else{
              console.log("end of all blocks");
              if(!this.lastLetter){
                setTimeout(() => {
                  this.Addletter("lower");
                  this.blockCounter = 0;
                  this.startBlock();
                }, 2000);
              }else{
                console.log("end of game");
              }
              
            }
            
          }
         




        }
      }
     
 }
