import 'phaser';
import { Bg } from './objects/Bg';
import { click_Anim, GameData, GameObj, IncreaseLevels, placeIt, tween_big_star, tween_complete_letter, tween_complete_stars, tween_EndOf_letter, tween_shine, tween_small_star } from './utils';


export class PlayGame extends Phaser.Scene {
   
    bg:Bg;

    homeBtn:Phaser.GameObjects.Image;
    //sound control
    soundBt:Phaser.GameObjects.Image;
    //3 stars
    allstars:Array<Phaser.GameObjects.Image>;
    starsCounter:number = 0;
    starsContainer:Phaser.GameObjects.Container;

    letterTop:Phaser.GameObjects.Image;
    letterBottom:Phaser.GameObjects.Image;



    graphics : Phaser.GameObjects.Graphics;
    dot_visible:boolean = false;

    isDown:boolean = false;

    letter_stars:Array<Phaser.GameObjects.Image>;
    letter_starsCounter:number = 0;
    allBigStars:Array<Phaser.GameObjects.Image>;
    
    finger:Phaser.GameObjects.Image;

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

    shineContainer:Phaser.GameObjects.Container;

    letterObj:any;
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

        this.starsContainer = this.add.container();
       // this.starsContainer.setAlpha(0.5)
        this.starsContainer.add([star1,star2,star3]);


        this.letterBottom.setInteractive(this.input.makePixelPerfect());
        this.letterBottom.on('pointermove',(P:Phaser.Input.Pointer)=>{
          let Pin = {x:P.x,y:P.y};

          if(this.isDown) {
            
            if(GameData.equa.case =="D"){
              P.y = GameData.equa.pente*P.x + GameData.equa.ori;
            }else if(GameData.equa.case =="H"){
              P.y = GameData.equa.Y;
            }else if(GameData.equa.case =="V"){
              P.x = GameData.equa.X;
            }

           // console.log('current equation', GameData.equa);
           // console.log('PP', P.x,P.y);

           // if(this.onMarker(Pin)){console.log('-onMarker-')}
           // if(this.near(P)){console.log('-near-')}
           // this.onMarker(P) &&
            if( this.onMarker(P) && this.near(P) ){
             // console.log('GameData.equa.case',GameData.equa.case,P.x,P.y)

            //move from spline point
            this.starsContainer.bringToTop(this.marker)
            this.handleMarker(P);
            this.makerOnTarget();
            }
           
        }
        })

        this.letterBottom.on('pointerdown',()=>{this.isDown = true;})
        this.letterBottom.on('pointerup',()=>{this.isDown = false;})
        this.letterBottom.on('pointerout',()=>{this.isDown = false;})


        this.Addletter("upper");
        this.startBlock();
        this.initGraphic();
 
       



      
        //add shine 
        this.shineContainer = this.add.container();
        let radius = 80;
        for(let n:number=0 ; n < 12; n++){
         let _x=Math.cos(n*(Math.PI/6))*radius;
         let _y=Math.sin(n*(Math.PI/6))*radius;
         let _shine =this.add.image(_x,_y,"graphics_1","Star_Particle0000");
         _shine.setScale(0.8)
         this.shineContainer.add(_shine) 
        }
        this.shineContainer.setAlpha(0);
        

      this.finger = this.add.image(200,200,'graphics_1','Finger0000');
      this.finger.setOrigin(0.1,0.1);
      this.finger.setVisible(false);

        //show finger , only for the first letter
      let data_letter = this.cache.json.get((GameData.Languge).toLowerCase()+'_letters');
      if(data_letter[GameData.currentLetter].upper.frame == "Letter_A_Upper0000"){
        this.showFinger();
      }
     




      /*let en_sounds_map = this.cache.json.get('en_fx_mixdown');
      console.log('en_sounds_map',en_sounds_map)
      this.sound.playAudioSprite('en_fx_mixdown',"a_word");*/


     }initGraphic(){
//init mask
if(this.graphics){this.graphics.clear(); this.graphics.destroy();}
this.graphics = this.add.graphics();
this.graphics.fillStyle(0xffffff, 1);
this.graphics.fillCircle(this.marker.x,this.marker.y, 32);
this.graphics.setVisible(false);
var mask = this.graphics.createGeometryMask();
this.letterTop.mask = mask;
     }
     lastMask(){
      let maxsize = Math.max(this.letterTop.displayWidth,this.letterTop.displayHeight)
      this.graphics.clear();
      this.graphics.fillCircle(this.letterTop.x,this.letterTop.y, maxsize);
     }
     animateCompleteLetter(){
      tween_complete_letter(this.letterTop,this.letterBottom,this);
     }
     animateCompleteStars(){
      tween_complete_stars(this.allstars.concat(this.allBigStars),this);
     }
     EndOfLetter(){
      tween_EndOf_letter(this.letterTop,this.letterBottom,this.allstars.concat(this.allBigStars),this)
      IncreaseLevels();
    }
     showFinger(): void {

      setTimeout(() => {
       if( !this.finger ){return;}
        this.finger.setScale(1.1,1.1);
        this.finger.setPosition(this.marker.x,this.marker.y);
        this.finger.setVisible(true);
        this.finger.setAlpha(1);
        this.finger.setAngle(0);

        this.tweens.add({
          targets:this.finger,
          duration:500,
          delay:0,
          scaleY:0.8,
          scaleX:0.8,
          angle:-20
        })

        this.tweens.add({
          targets:this.finger,
          duration:500,
          delay:750,
          x:this.letter_stars[0].x,
          y:this.letter_stars[0].y
        })


        this.tweens.add({
          targets:this.finger,
          duration:200,
          delay:2000,
          alpha:0,
          onComplete:()=>{
            this.showFinger();
          }
        })
      }, 500);
      
     }
     startBlock(){
       console.log("------- startBlock ----------")
        if(this.marker){this.marker.destroy();}
        this.targetCounter = 1;
        this.addBlock(this.blockCounter);//first array
       
        this.targetdot = this.Alldots[this.targetCounter];

        console.log("starting letter with",this.targetCounter,this.Alldots,"isStar",this.targetdot.getData("isStar"))
        
        //this.targetdot.setTexture('graphics_1','Star_GUI0000');
        //this.targetdot.setVisible(true);
        //this.targetdot.setTint(0xff0000);

        this.letter_starsCounter = 0;
        this.showNextStar();

        GameData.equa = this.Equation();
     }
     Equation(){
      let equation:any={case:'',X:0,Y:0,pente:0,ori:0};
      if(Math.abs(this.targetdot.x - this.marker.x) <2){
       // console.log('eqution : vertical',"X=const")
        equation.case = 'V';equation.X = this.targetdot.x;
      }
      else if(Math.abs(this.targetdot.y - this.marker.y) <2){
       // console.log('eqution : horizental',"Y=const");
        equation.case = 'H';equation.Y = this.targetdot.y;
      }else{
       // console.log('eqution : y = ax + b')
        let a:number = (this.targetdot.y - this.marker.y)/(this.targetdot.x - this.marker.x);
        //console.log("pente a", a);
        let b = this.targetdot.y - (a*this.targetdot.x);
       // console.log("b", b);
        equation.case = 'D';equation.pente = a;equation.ori = b;
      }
      //console.log("this.targetdot.x - this.marker.x",this.targetdot.x - this.marker.x);
     // console.log("this.targetdot.y - this.marker.y",this.targetdot.y - this.marker.y);
      console.log("equation",equation);
      return equation;
     }
     Addletter(upperORlower:"upper"|"lower"){
     
      if(this.allBigStars){
        this.allBigStars.forEach((img:Phaser.GameObjects.Image)=>{
          img.destroy();
        })
      }
        this.allBigStars=[];
        this.starsCounter = 0;

        if(upperORlower == "lower"){this.lastLetter = true;}
        //GameData.currentLetter
        console.log("Addletter",GameData.currentLetter,GameData.Languge);

        let data_letter = this.cache.json.get((GameData.Languge).toLowerCase()+'_letters');
        let letterObj =data_letter[GameData.currentLetter];
        this.letterObj = letterObj;
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
        //this.letterTop.setAlpha(1)
        tween_complete_letter(this.letterTop,this.letterBottom,this);

        //console.log("spline to apply",letterObj[upperORlower].splines);
        this.currentSplineDots = letterObj[upperORlower].splines;
        console.log("this.currentSplineDots",this.currentSplineDots);
       
       


     }
     handleMarker(P:Phaser.Input.Pointer){
      //position
      this.marker.setPosition(P.x,P.y);
      if(this.graphics){this.graphics.fillCircle(P.x,P.y, 32);}
      //orientation
      let A:number = Phaser.Math.Angle.Between(P.x,P.y,this.targetdot.x,this.targetdot.y);
      this.marker.setRotation(A+Math.PI/2);
      //console.log('angle is',A+Math.PI/2)
     }
     addBlock(index:number){
      if(this.Alldots){
        this.Alldots.forEach((dot:Phaser.GameObjects.Image)=>{
          dot.destroy();
        })
      }
    
      this.Alldots=[];
      this.letter_stars =[];
      

        let block = this.currentSplineDots[index];
        for(let n:number=0; n <block.length; n++){
         // console.log(this.letterTop.x+block[n].x,this.letterTop.y+block[n].y)
          let dot =this.add.image(
            this.letterTop.x-this.letterTop.displayWidth*0.5+block[n].x,
            this.letterTop.y-this.letterTop.displayHeight*0.5+block[n].y,'choose_level','Pagination_Inner0000'
          );
          dot.setVisible(this.dot_visible);
          dot.setAlpha(1)
          this.Alldots.push(dot);
          this.starsContainer.add(dot);
          if( block[n].star ){
            dot.setData({isStar:true})
            this.letter_stars.push(dot);
            let big_star = this.add.image(dot.x,dot.y,"graphics_1","Star_GUI0000");
            big_star.setAlpha(0);
            this.starsContainer.add(big_star);
            this.allBigStars.push(big_star);
            console.log('star here',block[n])
          }else{
            dot.setData({isStar:false})
          }
         
          if( n == 0 ){
            dot.setTexture('graphics_1','Marker0000');
            this.marker = dot;
            this.marker.setVisible(true);
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
      if(GameData.SoundEnabled && GameData.UserInteract){
        this.soundBt.setTexture('choose_level','Button_Sound_On0000')
        GameObj[0].play();
      }
      else{
        this.soundBt.setTexture('choose_level','Button_Sound_Off0000')
        GameObj[0].pause();
      }

       }

    backMenu(){
        this.cameras.main.once(
           Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam:any, effect:any) => {
            this.scene.start('Menu');
       });
       this.cameras.main.fadeOut(300, 0, 0, 0);
      }

      onMarker(P:any){
        //check if pointer is on marker
        let on_marker:boolean = false;
        //console.log("this.marker",this.marker)
       // console.log("P",P,P.x,P.y)
        let D = Phaser.Math.Distance.Between(this.marker.x,this.marker.y,P.x,P.y);
        //if (D>this.marker.displayWidth*0.5){this.marker.setPosition(P.x,P.y)}
        //console.log('onMarker -D',D,this.marker.displayWidth*0.5)
        if(D<this.marker.displayWidth*0.5){on_marker = true;}
        return on_marker;
      }

      near(P:Phaser.Input.Pointer){
        let nearest:boolean = false;
        //check if the next postion of the marker is near to target compared to the actual position
        let _actualDistance = Phaser.Math.Distance.Between(
          this.marker.x,this.marker.y,
          this.targetdot.x, this.targetdot.y)+2;

        let _nextDistance = Phaser.Math.Distance.Between(P.x,P.y,
          this.targetdot.x, this.targetdot.y);

          if(_nextDistance <= _actualDistance ){nearest = true;}
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
          //console.log("--------@ D",D);

        if( D<24 ){//16 try with 24 or more
         this.updateDot();

         //console.log("@@",this.targetdot.x,this.targetdot.y,this.targetdot.getData("isStar"));
         if(this.targetdot.getData("isStar")){
          console.log("--------@ isStar");

          this.playstarAnimation();

         //show next start if exist
          if(this.letter_starsCounter < this.letter_stars.length-1){
            this.letter_starsCounter++;
            this.showNextStar();
          }  
        }
        }
      }
      playstarAnimation(){
        //console.log('@ playstarAnimation');
      for(let bs:number = 0 ; bs < this.allBigStars.length; bs++){
        if(this.allBigStars[bs].alpha == 0){
          this.allBigStars[bs].setAlpha(1);
          this.starsContainer.bringToTop(this.allBigStars[bs]);
          tween_big_star(this.allBigStars[bs],this.allstars[this.starsCounter],this);
          tween_shine(this.shineContainer,this.allBigStars[bs],this)
          this.starsCounter++;
          break;
        }
      }
     

      }
      hideSmallStars(){
        console.log('@ hideSmallStars');
         //hide all small stars
      for(let s:number = 0 ; s< this.letter_stars.length; s++){
        this.letter_stars[s].visible = false;
       }
      }
      showNextStar(){

        if(this.finger){
          this.finger.setVisible (false);
          this.finger.destroy();
        }
        


        //show next star
        console.log(" showNextStar -->",this.letter_starsCounter);
       
        for(let s:number = 0 ; s< this.letter_stars.length; s++){
          this.letter_stars[s].visible = false;
         }

         if(this.letter_starsCounter<this.letter_stars.length){
         this.letter_stars[this.letter_starsCounter].setTexture('graphics_1','Star_Letter0000');
         this.letter_stars[this.letter_starsCounter].setVisible(true);
         tween_small_star(this.letter_stars[this.letter_starsCounter],this);
         }
         
        
      }

      updateDot(){
        console.log('updateDot 1',this.targetCounter);
        this.marker.setPosition(this.targetdot.x, this.targetdot.y);
        this.targetCounter++;
        //update target
        console.log('voila ',this.targetCounter , this.Alldots.length);
        if(this.targetCounter < this.Alldots.length){
          console.log('updateDot 2',this.targetCounter);
          this.targetdot = this.Alldots[this.targetCounter];
          //this.targetdot.setTint(0xff0000);

          GameData.equa = this.Equation();
        }
        else{
          console.log("end of all points");
          this.hideSmallStars();
          this.isDown = false;
          //check next block if exist
          this.blockCounter++;
          if(this.blockCounter < this.currentSplineDots.length){
           setTimeout(() => {this.startBlock();}, 500); 
          }else{
            console.log("end of all blocks");
            //hide marker
            this.marker.setVisible(false);
            this.lastMask();

            this.animateCompleteLetter();
            this.animateCompleteStars();

            if(!this.lastLetter){
              setTimeout(() => {
                this.Addletter("lower");
                this.blockCounter = 0;
                this.startBlock();
                this.initGraphic();
              }, 2000);
            }else{
              console.log("end of game");
              this.EndOfLetter();
            setTimeout(() => {
              this.scene.start('completeLetterScreen',this.letterObj);
            }, 2800);
            }
            
          }
          
        }
      }
     
 }
