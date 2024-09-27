import "phaser";
import { Bg } from "./objects/Bg";
import { GameData, placeIt, playAudio } from "./utils";

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
    //add boad

    

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
        if(this.CurrentLetter){this.CurrentLetter.setPosition(P.x,P.y);}
    })

    this.input.on('pointerup',(P:Phaser.Input.Pointer)=>{
        
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
   
  
  
    
  }moveRight(){

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
    console.log('you click',name);

    let letter:Phaser.GameObjects.Image = this.add.image(x,y,'free_zone','Letter_'+name+'0001');
    letter.setInteractive({cursor:'pointer'});
    letter.setName('Letter_'+name+'0001');

    letter.on('pointerdown',()=>{

        this.CurrentLetter = letter;
        this.CurrentLetter.setTexture('free_zone',this.CurrentLetter.name.replace('0002','0001'))
    })
    letter.on('pointerup',()=>{
    
        this.CurrentLetter = letter;
        this.CurrentLetter.setScale(1,1)
        this.CurrentLetter.setTexture('free_zone',this.CurrentLetter.name.replace('0001','0002'))
    })


    this.CurrentLetter = letter;
    this.tweens.add({
        targets:letter,
        duration:100,
        scaleX:1.2,
        scaleY:1.2
      });
    this.addedLetters.push(letter);
    playAudio('tap');
    
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
    let im = document.body.appendChild(image);
    im.id ="screenShot";
    }); 



    setTimeout(() => {
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
   
   
          /*
       show edit button
       show save  button
       show menu button
       add sounds
       correct italian issue
       */
    }, 1000);
    
}



//for the download GamepadButton
 /*let src =document.getElementById("screenShot").src;
    var a = document.createElement("a");
    a.href = src;
   // a.href = "data:image/png;base64," + ImageBase64; //Image Base64 Goes here
    a.download = "screenShot.png"; //File name Here
    //a.click(); //Downloaded file
    */
}
