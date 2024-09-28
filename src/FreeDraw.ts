import "phaser";
import { Bg } from "./objects/Bg";
import { click_Anim, GameData, placeIt, playAudio, stopAudio } from "./utils";

export class FreeDraw extends Phaser.Scene {
  TXT: Phaser.GameObjects.Text;
  boardDeco:Phaser.GameObjects.Image;
  boardBack:Phaser.GameObjects.Image;
  board:Phaser.GameObjects.Image;
  cadre : Phaser.GameObjects.Image;
  block1Container:Phaser.GameObjects.Container;
  block2Container:Phaser.GameObjects.Container;

    arrowLeft:Phaser.GameObjects.Image;
    arrowright:Phaser.GameObjects.Image;
    addedLetters:Array<Phaser.GameObjects.Image>;


    CurrentLetter:null|Phaser.GameObjects.Image;

    camera:Phaser.GameObjects.Image;
    trashBin:Phaser.GameObjects.Image;



    edit_button:Phaser.GameObjects.Image;
    save_button:Phaser.GameObjects.Image;
    menu_button:Phaser.GameObjects.Image;

    edit_buttonTxt:Phaser.GameObjects.Text;
    save_buttonTxt:Phaser.GameObjects.Text;
    menu_buttonTxt:Phaser.GameObjects.Text;

    container1:Phaser.GameObjects.Container;
    editMode:boolean = true;


    top_back:Phaser.GameObjects.Image;//Dropzone_Inner0000  Dropzone_Outer0000  SlideMenu_Back0000
    top_arrow:Phaser.GameObjects.Image;//Down_Arrow0000  Up_Arrow0000
    top_audio:Phaser.GameObjects.Image;//Button_Sound_Off0000  Button_Sound_On0000
    top_menu:Phaser.GameObjects.Image;//Home0000
    containerTop:Phaser.GameObjects.Container;
    menu_down:boolean = false;
    finger:Phaser.GameObjects.Image|null;

  constructor() {
    super("FreeDraw");
  }
  preload(): void {
    //add background
    const bg = new Bg(this);
    bg.layer.setTexture('backgrounds_1',"_Items0000");

    this.load.on("loaderror", this.OnError, this);

    //listeners
    this.load.on("progress", this.fileComplte, this);
    this.load.on("complete", this.complete, this);

    
    this.load.atlas(
        "free_zone",
        "./assets/graphics/free_zone.png",
        "./assets/graphics/free_zone.json"
      );
      
    


  }
  OnError(error: any) {
    alert("game say : OnError  :" + error.url);
  }
  fileComplte(progress: any) {
   console.log(Math.round(progress * 100) + "%");
  }
  complete() {
    console.log("all assets loaded");
  }

  create(): void {
    this.addedLetters=[];
    this.editMode = true;
    this.menu_down = false;

    this.board = this.add.image(0,0,'free_zone','Board0000');
    placeIt(this.board,this,0.5,0.3);

    this.cadre = this.add.image(0,0,'free_zone','Board_Border0000');
    placeIt(this.cadre,this,0.5,0.3);
    this.cadre.setAlpha(0);


   
    this.boardDeco= this.add.image(0,0,'free_zone','Photo_Front0000');
    placeIt(this.boardDeco,this,0.505,0.35);
    this.boardDeco.setAlpha(0);


    this.boardBack= this.add.image(0,0,'free_zone','Photo_Front0000');
    placeIt(this.boardBack,this,0.505,0.35);
    this.boardBack.setScale(1.15,1.15);
    this.boardBack.setAlpha(0);


    //add letter selection 
    this.addKeyBoard();

    this.arrowLeft = this.add.image(0,0,'free_zone','Left_Arrow0000')
    placeIt(this.arrowLeft,this,0.06,0.76);
    this.arrowLeft.setVisible(false);

    this.arrowright = this.add.image(0,0,'free_zone','Right_Arrow0000')
    placeIt(this.arrowright,this,1- 0.06,0.76);

    this.arrowLeft.setInteractive({cursor:'pointer'});
    this.arrowLeft.on('pointerdown',()=>{this.moveLeft();})

    this.arrowright.setInteractive({cursor:'pointer'});
    this.arrowright.on('pointerdown',()=>{this.moveRight();})

    //add letter/drag drop
    this.input.on('pointermove',(P:Phaser.Input.Pointer)=>{
        if(!this.editMode){return;}
        if(this.CurrentLetter){
          if(this.finger){this.finger.destroy(); this.finger = null;}
          this.CurrentLetter.setPosition(P.x,P.y);
        }
    })

    this.input.on('pointerup',(P:Phaser.Input.Pointer)=>{
      if(!this.editMode){return;}
        //check if letter inside the baord
        let rect:Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle(
            this.board.x-this.board.displayWidth*0.43,
            this.board.y-this.board.displayHeight*0.41,
            this.board.displayWidth*0.86,this.board.displayHeight*0.81);

        console.log(Phaser.Geom.Rectangle.Contains(rect,P.x,P.y));
        if(!Phaser.Geom.Rectangle.Contains(rect,P.x,P.y) && this.CurrentLetter){
            this.CurrentLetter?.destroy();
            this.alertCadre();
        }

        if(this.CurrentLetter){this.CurrentLetter = null;}
    })

   this.camera = this.add.image(0,0,'free_zone','Save_Button0000');
   placeIt(this.camera,this,0.82,0.51);
   this.camera.setInteractive({cursor:'pointer'});
   this.camera.on('pointerdown',()=>{this.takeSnapShot();})


   this.trashBin = this.add.image(0,0,'free_zone','Clear_Button0000');
   placeIt(this.trashBin,this,0.18,0.51);

   this.trashBin.setInteractive({cursor:'pointer'});
   this.trashBin.on('pointerdown',()=>{this.clearBoard();})
   
   let data_text:any = this.cache.json.get('_texts')[(GameData.Languge).toLowerCase()];
   console.log('data_text',data_text);
  let style1:any = {font: "bold 32px bariol_boldbold",color: "#ffffff"};

   this.edit_button = this.add.image(0,0,'free_zone','Button_Edit0000');
   placeIt(this.edit_button,this,0.25,0.85);
   this.edit_buttonTxt =this.add.text(0, 0,data_text.edit, style1);this.edit_buttonTxt.setOrigin(0.5,0.5);
   placeIt(this.edit_buttonTxt,this,0.25,0.93);
   this.edit_button.setInteractive({cursor:'pointer'});
   this.edit_button.on('pointerdown',()=>{this.goEditMode();})

   this.save_button = this.add.image(0,0,'free_zone','Button_Save0000');
   placeIt(this.save_button,this,0.5,0.85);
   this.save_buttonTxt =this.add.text(0, 0,data_text.save, style1);this.save_buttonTxt.setOrigin(0.5,0.5);
   placeIt(this.save_buttonTxt,this,0.5,0.93);
   this.save_button.setInteractive({cursor:'pointer'});
   this.save_button.on('pointerdown',()=>{this.savePng();})

   this.menu_button = this.add.image(0,0,'free_zone','Button_Menu0000');
   placeIt(this.menu_button,this,0.75,0.85);
   this.menu_buttonTxt =this.add.text(0, 0,data_text.menu, style1);this.menu_buttonTxt.setOrigin(0.5,0.5);
   placeIt(this.menu_buttonTxt,this,0.75,0.93);
   this.menu_button.setInteractive({cursor:'pointer'});
   this.menu_button.on('pointerdown',()=>{this.openMenu();})
   

this.container1 = this.add.container();
this.container1.add([
  this.edit_button,this.edit_buttonTxt,
  this.save_button,this.save_buttonTxt,
  this.menu_button,this.menu_buttonTxt
])
this.container1.setAlpha(0); 



this.top_back= this.add.image(0,0,'free_zone','SlideMenu_Back0000');
placeIt(this.top_back,this,0.85,0.1);

this.top_arrow = this.add.image(0,0,'free_zone','Down_Arrow0000');
placeIt(this.top_arrow,this,0.85,0.23);

this.top_audio = this.add.image(0,0,'free_zone','Button_Sound_On0000');
placeIt(this.top_audio,this,0.85,0.05);
if(!GameData.SoundEnabled){this.top_audio.setTexture('free_zone','Button_Sound_Off0000')}
this.top_audio.setInteractive({cursor:"pointer"});
        this.top_audio.on('pointerdown',()=>{
          playAudio('tap');
          click_Anim(this.top_audio,this,this.toggleSound.bind(this));
        })

this.top_menu = this.add.image(0,0,'free_zone','Home0000');
this.top_menu.setInteractive({cursor:'pointer'});
this.top_menu.on('pointerdown',()=>{
  click_Anim(this.top_menu,this,this.openMenu.bind(this));
});
placeIt(this.top_menu,this,0.85,0.14);

this.containerTop =this.add.container(0,-this.cameras.main.height*0.21,[this.top_back,this.top_arrow,this.top_audio,this.top_menu]);
this.top_arrow.setInteractive({cursor:'pointer'});
this.top_arrow.on('pointerdown',()=>{
  playAudio('tap');
  if(!this.menu_down){
    this.tweens.add({
      duration:800,
      targets:this.containerTop,
      y:0,
      ease:Phaser.Math.Easing.Expo.Out,
      onComplete:()=>{this.top_arrow.setTexture('free_zone','Up_Arrow0000');}
    });
  }else{
    this.tweens.add({
      duration:800,
      targets:this.containerTop,
      y:-this.cameras.main.height*0.21,
      ease:Phaser.Math.Easing.Expo.Out,
      onComplete:()=>{this.top_arrow.setTexture('free_zone','Down_Arrow0000');}
    });
  }

  this.menu_down = !this.menu_down;

})



this.finger = this.add.image(200,200,'graphics_1','Finger0000');
this.finger.setOrigin(0.1,0.1);
this.finger.setVisible(false);

this.showFinger();
}
showFinger(): void {

  setTimeout(() => {
   if( !this.finger ){return;}
    this.finger.setScale(1.1,1.1);
    let firstC:any = this.block1Container.getAt(0);
    this.finger.setPosition(firstC.x,firstC.y);
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
      duration:1000,
      delay:750,
      x:this.board.x,
      y:this.board.y
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
moveRight(){
    playAudio('tap');
    this.arrowright.setVisible(false);
    this.block2Container.setAlpha(0);

    this.tweens.add({
        targets:this.block1Container,
        duration:200,
        alpha:0,
        x:-this.cameras.main.width,
        ease:Phaser.Math.Easing.Linear
      });

      this.tweens.add({
        targets:this.block2Container,
        duration:200,
        x:0,
        alpha:1,
        ease:Phaser.Math.Easing.Linear,
        onComplete:()=>{
            this.arrowLeft.setVisible(true);
        }
      });

  }
  moveLeft(){
    playAudio('tap');
    this.arrowLeft.setVisible(false);

    this.block1Container.setAlpha(0);

    this.tweens.add({
        targets:this.block1Container,
        duration:200,
        x:0,
        alpha:1,
        ease:Phaser.Math.Easing.Linear
      });

      this.tweens.add({
        targets:this.block2Container,
        duration:200,
        x:this.cameras.main.width,
        alpha:0,
        ease:Phaser.Math.Easing.Linear,
        onComplete:()=>{
            this.arrowright.setVisible(true);
        }
      });
  }
  addKeyBoard(){

    this.block1();
    this.block2();
    
  }block1(){
    this.block1Container = this.add.container();
    let _W = this.cameras.main.width*2/3;
    let Xi = this.cameras.main.width/4.8;
    let Yi = this.cameras.main.height*0.65;
    let XX = 0;
    let YY = 0;

    for(let i = 0 ; i< 15 ; i++){
        let L:string = GameData.levelsIndex[i].toUpperCase();
        let k = this.add.image(Xi+(XX*_W/4.5),Yi+(YY*100),'free_zone','LetterTile_Back0000');
        let t = this.add.image(Xi+(XX*_W/4.5),Yi+(YY*100),'free_zone','Letter_'+L+'0000');
        t.x -= 2;
        t.y -= 4;
        k.setName(L);
        k.setInteractive({cursor:'pointer'});
        k.on('pointerdown',()=>{this.clicked(k.name,k.x,k.y);})
        XX++;
        if(XX>4){XX=0;YY++;}
        this.block1Container.add(k);
        this.block1Container.add(t);
    }

  }block2(){
    this.block2Container = this.add.container();
    let nA:Array<string> =[".",",","!","?"];
    nA = nA.concat(GameData.levelsIndex);
    nA.reverse();

    let _W = this.cameras.main.width*2/3;
    let Xi = this.cameras.main.width/4.8;
    let Yi = this.cameras.main.height*0.65;
    let XX = 0;
    let YY = 0;

    for(let i = 0 ; i< 15 ; i++){
        let L:string = nA[i+15].toUpperCase();
        let k = this.add.image(Xi+(XX*_W/4.5),Yi+(YY*100),'free_zone','LetterTile_Back0000');
        let t = this.add.image(Xi+(XX*_W/4.5),Yi+(YY*100),'free_zone','Letter_'+L+'0000');
        t.x -= 2;
        t.y -= 4;
        k.setName(L);
        k.setInteractive({cursor:'pointer'});
        k.on('pointerdown',()=>{this.clicked(k.name,k.x,k.y);})

        XX++;
        if(XX>4){XX=0;YY++;}
        this.block2Container.add(k);
        this.block2Container.add(t);
        this.block2Container.setX(this.cameras.main.width)
    }
  }clicked(name:string,x:number,y:number){
    if(!this.editMode){return;}
    console.log('you click',name);

    let letter:Phaser.GameObjects.Image = this.add.image(x,y,'free_zone','Letter_'+name+'0001');
    letter.setInteractive({cursor:'pointer'});
    letter.setName('Letter_'+name+'0001');

    letter.on('pointerdown',()=>{
      if(!this.editMode){return;}
      playAudio('Pop_B');
        this.CurrentLetter = letter;
        this.tweens.add({
          targets:letter,
          duration:50,
          scaleX:1.2,
          scaleY:1.2
        });
        this.CurrentLetter.setTexture('free_zone',this.CurrentLetter.name.replace('0002','0001'))
    })
    letter.on('pointerup',()=>{
      if(!this.editMode){return;}
      playAudio('Pop_D');
        this.CurrentLetter = letter;
        this.CurrentLetter.setScale(1,1)
        this.CurrentLetter.setTexture('free_zone',this.CurrentLetter.name.replace('0001','0002'))
    })


    this.CurrentLetter = letter;
    this.tweens.add({
        targets:letter,
        duration:50,
        scaleX:1.2,
        scaleY:1.2
      });
    this.addedLetters.push(letter);
    playAudio('Pop_B');
    
  }
  alertCadre(){
    this.tweens.add({
        targets:this.cadre,
        duration:150,
        alpha:0.5,
        scaleX:1.05,
        scaleY:1.05,
        yoyo:true,
        repeat:0,
        ease:Phaser.Math.Easing.Linear
      });
  }
  clearBoard(){
    playAudio('tap');
    playAudio('erase_board');
    console.log(this.addedLetters);
    this.trashBin.setDepth(2);
    this.addedLetters.forEach((letter:Phaser.GameObjects.Image)=>{
        if(letter){
            this.tweens.add({
                targets:letter,
                duration:100,
                x:this.trashBin.x,
                y:this.trashBin.y,
                ease:Phaser.Math.Easing.Linear,
                onComplete:()=>{letter.destroy();}
              });
        }
       

    })
    
    this.CurrentLetter = null;
    this.addedLetters=[];
  }
takeSnapShot(){

  playAudio('tap');

  this.editMode = false;
   this.boardBack.setAlpha(1);
    //hide
    this.board.setAlpha(0);
    this.block1Container.setAlpha(0);
    this.block2Container.setAlpha(0);
    this.camera.setAlpha(0);
    this.trashBin.setAlpha(0);
    this.arrowLeft.setAlpha(0);
    this.arrowright.setAlpha(0);



    let rect:Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle(
        this.boardBack.x-this.boardBack.displayWidth*0.48,
        this.boardBack.y-this.boardBack.displayHeight*0.478,
        this.boardBack.displayWidth*0.93,this.boardBack.displayHeight*0.92);
    /*const g = this.add.graphics().setDepth(1);
    g.lineStyle(2, 0xffffff);
    g.strokeRect(rect.x, rect.y, rect.width, rect.height);*/
    this.game.renderer.snapshotArea(
        Math.round(rect.x), 
        Math.round(rect.y), 
        Math.round(rect.width), 
        Math.round(rect.height), (image:any) =>
    {

      //remove old image
  let image_x:any = document.getElementById('screenShot');
  if(image_x){ image_x.parentNode.removeChild(image_x);}


    let im = document.body.appendChild(image);
    im.id ="screenShot";
    }); 



    setTimeout(() => {
      playAudio('photo');
        this.boardBack.setAlpha(0.5);
        //show
        this.tweens.add({
           targets:this.boardBack,
           duration:200,
           alpha:1
         });
   
       this.tweens.add({
           targets:this.boardDeco,
           duration:300,
           scaleX:1.1,
           scaleY:1.1,
           alpha:1,
           angle:10,
         });
       this.container1.setY(-24);
       this.tweens.add({
        targets:this.container1,
        duration:500,
        y:0,
        alpha:1
      });
    }, 500);
    
}
goEditMode(){
    playAudio('tap');
    this.container1.setAlpha(0);

    this.boardBack.setAlpha(0);
    this.boardDeco.setAlpha(0);
    this.boardDeco.setAngle(0);

    this.board.setAlpha(1);
    this.block1Container.setAlpha(1);
    this.block2Container.setAlpha(1);
    this.camera.setAlpha(1);
    this.trashBin.setAlpha(1);
    this.arrowLeft.setAlpha(1);
    this.arrowright.setAlpha(1);

    this.editMode = true;
   
}savePng(){
    playAudio('tap');
    //console.log('save now');
    let dom:any = document.getElementById("screenShot");
    let src:any = dom.src;
    //console.log('src',src);
    var a = document.createElement("a");
    a.href = src;
   // a.href = "data:image/png;base64," + ImageBase64; //Image Base64 Goes here
    a.download = "screenShot.png"; //File name Here
    a.click(); //Downloaded file
}
openMenu(){
  playAudio('tap');
  this.cameras.main.once(
    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam:any, effect:any) => {
    this.scene.start('Menu');

});
this.cameras.main.fadeOut(300, 0, 0, 0);
}


toggleSound(){
  GameData.SoundEnabled = ! GameData.SoundEnabled;
       
        if(GameData.SoundEnabled && GameData.UserInteract){
          this.top_audio.setTexture('free_zone','Button_Sound_On0000')
          playAudio('MainLoop');
        }
        else{
          this.top_audio.setTexture('free_zone','Button_Sound_Off0000');
          stopAudio('MainLoop');
        }
 }
}
