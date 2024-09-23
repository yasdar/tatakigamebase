import 'phaser';
import { Bg } from './objects/Bg';
import { click_Anim, GameData, IncreaseLevels, placeIt, playAudio, stopAudio, tween_big_star, tween_complete_letter, tween_complete_stars, tween_EndOf_letter, tween_shine, tween_small_star } from './utils';


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
    Pdown:any;

    currentSplineDots:Array<Array<{
      x:number, y: number, star: boolean
    }>>
   
    targetCounter:number = 1;
    Alldots:Array<Phaser.GameObjects.Image>;
    marker:Phaser.GameObjects.Image;
    real_marker:Phaser.GameObjects.Image;
    targetdot:Phaser.GameObjects.Image;
    startdot:Phaser.GameObjects.Image;
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
     

        this.bg = new Bg(this);
        this.bg.base.setTexture('backgrounds_1','BG_Green0000');
        this.bg.layer.setTexture('backgrounds_1',"_Items0000");
        this.bg.refresh();

        this.homeBtn = this.add.image(0,0,'choose_level','Button_Home0000');
        placeIt(this.homeBtn,this,0.90,0.07);
        this.homeBtn.setInteractive({cursor:"pointer"});
        this.homeBtn.on('pointerdown',()=>{
          playAudio('tap');
          click_Anim(this.homeBtn,this,this.backMenu.bind(this));
        })

         this.soundBt = this.add.image(0,0,'choose_level','Button_Sound_On0000');
         if(!GameData.SoundEnabled){ this.soundBt.setTexture('choose_level','Button_Sound_Off0000')}
        placeIt(this.soundBt,this,0.76,0.07);
        this.soundBt.setInteractive({cursor:"pointer"});
        this.soundBt.on('pointerdown',()=>{
          playAudio('tap');
          click_Anim(this.soundBt,this,this.toggleSound.bind(this));
        })

       

        this.addBottomStars();


        this.letterBottom = this.add.image(0,0,'');
        this.letterTop = this.add.image(0,0,'');

       
        


        this.marker =this.add.image(0,0,'graphics_1','Marker0000');
        this.marker.setScale(2);
        this.marker.setAlpha(0.01);
       

        this.real_marker = this.add.image(0,0,'graphics_1','Marker0000');
        this.real_marker.setVisible(false);


         //containesr for 3 bottomstars
         this.starsContainer = this.add.container();

        this.marker.setInteractive(this.input.makePixelPerfect());
        this.marker.on('pointerdown',(P:Phaser.Input.Pointer)=>{
          console.log('onDown')
          this.Pdown = {x:P.x,y:P.y}
          this.isDown = true;
        })
        this.marker.on('pointerup',()=>{this.isDown = false;})
        //this.marker.on('pointerout',()=>{this.isDown = false;});

        this.marker.on('pointermove',(P:Phaser.Input.Pointer)=>{this.onMove(P)})

       

       

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
        
       

        this.addBlock(this.blockCounter);//first array

        //first target index
        this.targetCounter = 1;
        //get first target
        this.targetdot = this.Alldots[this.targetCounter];
        this.targetdot.setTint(0xff0000);

        this.startdot= this.Alldots[this.targetCounter-1];
        this.startdot.setTint(0x00ff00);

        GameData.equa = this.Equation();
        console.log("equa",GameData.equa)
   
        this.letter_starsCounter = 0;
        this.showNextStar();
        
     }
     Equation(){
      let equation:any={case:'',X:0,Y:0,pente:0,ori:0};
      if(Math.abs(this.targetdot.x - this.marker.x) <=2){
       // console.log('eqution : vertical',"X=const")
        equation.case = 'V';equation.X = this.targetdot.x;
      }
      else if(Math.abs(this.targetdot.y - this.marker.y) <=2){
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
     
      console.log("equation using : ");
      console.log("marker",this.marker.x,this.marker.y);
      console.log("targetdot",this.targetdot.x,this.targetdot.y);

      return equation;
     }
     Addletter(upperORlower:"upper"|"lower"){
     
      if(this.allBigStars){
        this.allBigStars.forEach((img:Phaser.GameObjects.Image)=>{img.destroy();})
      }
        this.allBigStars=[];
        this.starsCounter = 0;


        if(upperORlower == "lower"){this.lastLetter = true; playAudio('restart');}
        else{
          let l:string = GameData.Languge.toLowerCase();
          if(GameData.SoundEnabled && GameData.UserInteract){
          this.sound.addAudioSprite(l+'_fx_mixdown',{volume:1}).play(GameData.currentLetter);
          }
        }
        //GameData.currentLetter
        console.log("Add letter :",GameData.currentLetter,'Languge',GameData.Languge);

        let data_letter = this.cache.json.get((GameData.Languge).toLowerCase()+'_letters');
        let letterObj =data_letter[GameData.currentLetter];
        this.letterObj = letterObj;
        console.log("letterObj",letterObj);

        //update background image
        this.bg.base.setTexture(letterObj.bg.texture,letterObj.bg.frame);
        //update letterBottom texture
        let backFrame:string = letterObj[upperORlower].frame.replace('_Upper','_Upper_Back')
        if(upperORlower == "lower"){
          backFrame = letterObj[upperORlower].frame.replace('_Lower','_Lower_Back')
        }
        this.letterBottom.setTexture(letterObj[upperORlower].texture,backFrame);
         //update letterTop texture
        this.letterTop.setTexture(letterObj[upperORlower].texture,letterObj[upperORlower].frame);
        //place lettersin the correct position
        placeIt(this.letterBottom,this,0.5,0.5);
        placeIt(this.letterTop,this,0.5,0.5);
       
        // tween letters when appears
        tween_complete_letter(this.letterTop,this.letterBottom,this);
        this.currentSplineDots = letterObj[upperORlower].splines;
        console.log("this.current Spline Dots",this.currentSplineDots);
        //init block counter value
        this.blockCounter = 0;
     }
     updateMask(w:number){
      if(this.graphics){this.graphics.fillCircle(this.marker.x,this.marker.y, w);}
     }
     addBlock(index:number){
      //reset dots
      if(this.Alldots){
        this.Alldots.forEach((dot:Phaser.GameObjects.Image)=>{dot.destroy();})
      }
      if(this.letter_stars){
        this.letter_stars.forEach((dot:Phaser.GameObjects.Image)=>{dot.destroy();})
      }

      this.Alldots=[];
      this.letter_stars =[];
      
        //array from spline dots
        let block = this.currentSplineDots[index];

        for(let n:number=0; n <block.length; n++){
         // add dots
          let dot =this.add.image(
            this.letterTop.x-this.letterTop.displayWidth*0.5+block[n].x,
            this.letterTop.y-this.letterTop.displayHeight*0.5+block[n].y,'choose_level','Pagination_Inner0000'
          );
          dot.setVisible(this.dot_visible);
          this.Alldots.push(dot);
          if( block[n].star ){

            dot.setData({isStar:true});
            let big_star = this.add.image(dot.x,dot.y,"graphics_1","Star_GUI0000");
            big_star.setAlpha(0);
            
            this.allBigStars.push(big_star);

            let small_stars = this.add.image(dot.x,dot.y,'graphics_1','Star_Letter0000');
            small_stars.setVisible(false);
            this.letter_stars.push(small_stars)

            this.starsContainer.add(small_stars);
            this.starsContainer.add(big_star);
            

          }else{
            dot.setData({isStar:false})
          }
         
          if( n == 0 ){
            this.marker.setPosition(dot.x,dot.y);
            this.real_marker.setVisible(true);
          }
          if (n==1){
            let A:number = Phaser.Math.Angle.Between(this.marker.x,this.marker.y,dot.x,dot.y);
            this.marker.setRotation(A+Math.PI/2);
          }
        }
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

    backMenu(){
        this.cameras.main.once(
           Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam:any, effect:any) => {
            this.scene.start('Menu');
       });
       this.cameras.main.fadeOut(300, 0, 0, 0);
      }

 

      near(P:any){
        let nearest:boolean = false;
        //check if the next postion of the marker is near to target compared to the actual position
        let _actualDistance = Phaser.Math.Distance.Between(
          this.marker.x,this.marker.y,
          this.targetdot.x, this.targetdot.y);

        let _nextDistance = Phaser.Math.Distance.Between(P.x,P.y,
          this.targetdot.x, this.targetdot.y);
          if(_nextDistance <= _actualDistance ){nearest = true;}
          return nearest;
      }
      /**
       * marker hit target or not
       */
      markerIsOnTarget(){
        //check when marker hit target
        let D = Phaser.Math.Distance.Between(
          this.marker.x,this.marker.y,
          this.targetdot.x, this.targetdot.y);

        if( D<10 ){
          //console.log("@D",D)
         this.updateDot();
        }
      }
      playstarAnimation(){
        console.log('@ playstarAnimation');
        playAudio('restart');
      for(let bs:number = 0 ; bs < this.allBigStars.length; bs++){
        if(this.allBigStars[bs].alpha == 0){
          this.allBigStars[bs].setAlpha(1);
          tween_big_star(this.allBigStars[bs],this.allstars[this.starsCounter],this);
          tween_shine(this.shineContainer,this.allBigStars[bs],this)
          this.starsCounter++;
          break;
        }
      }
     

      }

      showNextStar(){

        if(this.finger){
          this.finger.setVisible (false);
          this.finger.destroy();
        }
        


        //show next star
        console.log(" showNextStar -->",
          this.letter_starsCounter,
          this.letter_stars.length);
       
        
        
          //console.log('show start at',this.letter_starsCounter)
       if(this.letter_stars[this.letter_starsCounter]){
        this.letter_stars[this.letter_starsCounter].setVisible(true);
       }
      

        for(let s:number = 0 ; s< this.letter_stars.length; s++){
          if(s != this.letter_starsCounter){this.letter_stars[s].setVisible(false);}
         }

        

         tween_small_star(this.letter_stars[this.letter_starsCounter],this);
       
         
        
      }

      updateDot(){
        //console.log("updateDot",this.targetCounter);
        this.targetdot.setTint(0xffffff);
        this.startdot.setTint(0xffffff);
        this.checkForStar();

        this.targetCounter++;
        if(this.targetCounter < this.Alldots.length){
          //update target
          this.targetdot = this.Alldots[this.targetCounter];
          this.targetdot.setTint(0xff0000);

          this.startdot= this.Alldots[this.targetCounter-1];
         this.startdot.setTint(0x00ff00);
         this.marker.setPosition(this.startdot.x, this.startdot.y);
 
        

          //update equation
          GameData.equa = this.Equation();
          console.log("next equa",GameData.equa);
          //update marker angle
          let A:number = Phaser.Math.Angle.Between(
            this.marker.x,this.marker.y,
            this.targetdot.x,this.targetdot.y);
          this.marker.setRotation(A+Math.PI/2);
         // this.isDown = true;
        }
        else{
          this.isDown = false;
          console.log("end of all points");
          this.blockCounter++;
          console.log("next blockCounter",this.blockCounter);
          //check next block if exist
         
          if(this.blockCounter < this.currentSplineDots.length){
           this.startBlock();
          }

          else{
            console.log("end of all blocks");
            //hide marker

            this.lastMask();
           
            this.animateCompleteLetter();
            this.animateCompleteStars();
            setTimeout(() => {playAudio('Small_Success'); }, 1000);

            if(!this.lastLetter){
              setTimeout(() => {
                this.Addletter("lower");
                this.blockCounter = 0;
                this.startBlock();
                this.initGraphic();
              }, 2000);
            }else{
              console.log("end of game");
              this.real_marker.setVisible(false);
              this.marker.setVisible(false);
              this.EndOfLetter();
            setTimeout(() => {
              this.scene.start('completeLetterScreen',this.letterObj);
            }, 2800);
            }
            
          }
          
        }
      }
      checkForStar(){
        if(this.targetdot.getData("isStar")){
          console.log("--------@ isStar");
          this.playstarAnimation();
          this.letter_stars[this.letter_starsCounter].setVisible(false);
         //show next start if exist
          if(this.letter_starsCounter < this.letter_stars.length-1){
            this.letter_starsCounter++;
            this.showNextStar();
          }  
        }
      }
      addBottomStars(){
        let star1 = this.add.image(0,0,'graphics_1','Star_GUI_Empty0000');
        placeIt(star1,this,0.32,0.82);
        let star2 = this.add.image(0,0,'graphics_1','Star_GUI_Empty0000');
        placeIt(star2,this,0.5,0.82);
        let star3 = this.add.image(0,0,'graphics_1','Star_GUI_Empty0000');
        placeIt(star3,this,0.67,0.82);
        this.allstars=[star1,star2,star3];

      }
      onMove(_p:Phaser.Input.Pointer){

       




        if(this.isDown) {


          // console.log('pointer on',P.x,P.y);
        //console.log('downPointer',this.Pdown);
        let Dec ={x:_p.x-this.Pdown.x,y:_p.y-this.Pdown.y};
       // console.log('Dec',Dec);
        this.Pdown = {x:_p.x,y:_p.y}
       
          let P ={x:this.marker.x+Dec.x,y:this.marker.y+Dec.y};

         // console.log('on Down moving...')
          if(GameData.equa.case =="D"){
            P.y = GameData.equa.pente*P.x + GameData.equa.ori;
          }else if(GameData.equa.case =="H"){
            P.y = GameData.equa.Y;
          }else if(GameData.equa.case =="V"){
            P.x = GameData.equa.X;
          }

          // check if next move will is nearest to target
          if( this.near(P)){

            let D1:number = Phaser.Math.Distance.Between(
              this.startdot.x,this.startdot.y,P.x,P.y);

              let D2:number = Phaser.Math.Distance.Between(
                this.startdot.x,this.startdot.y,this.targetdot.x,this.targetdot.y);


 this.marker.setPosition(P.x,P.y);

 //if do not execed
 if(D1>D2){this.marker.setPosition(this.targetdot.x,this.targetdot.y);}

this.updateMask(40);
this.markerIsOnTarget();
        
            
          }

        
            
          
         
      }
      }
      update(time: number, delta: number): void {
        if(this.marker && this.real_marker){
          this.real_marker.setPosition(this.marker.x,this.marker.y);
          this.real_marker.setRotation(this.marker.rotation);
        }
      }
     
 }
