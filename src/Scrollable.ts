import 'phaser';
import { Thumb } from './objects/Thumb';
import { GameData, placeIt } from './utils';

export class Scrollable extends Phaser.GameObjects.Container {
   
  back:Phaser.GameObjects.Image;//invisible image
  indexation:number = 0;
  
  XX:number = 0;
  Np:number;//number of pages
  MaxPageItem:number = 12;
  MovmentC:number=0;//actual page index 0,  -1  -2 .... always <= 0
 AllThumbs:Array<Thumb>;

    constructor(scene:any) {
        super(scene);
       
    //add background
    this.back = this.scene.add.image(0, 0, "main_menu", "BG0000");
    this.back.setOrigin(0,0.5)
    this.back.setAlpha(0.01);
    placeIt(this.back,this.scene,0,0.5)

    
        //add to container
        this.add([this.back]);
        this.scene.add.existing(this);
       
       
        this.back.setInteractive();
        this.scene.input.setDraggable(this.back);
        //prepare dragdrop
        this.scene.input.on('dragstart',  (pointer:Phaser.Input.Pointer, gameObject:any, dragX:number, dragY:number)=>{
            this.XX = this.x;
           //console.log(this.XX);
           },this);

  this.scene.input.on('drag',  (pointer:any, gameObject:any, dragX:number, dragY:number)=>{
  this.x = this.XX+dragX
 },this);

 this.scene.input.on('dragend',  (pointer:any, gameObject:any, dragX:number, dragY:number)=>{
    //direction
    let toX:number=(this.x - this.XX);
    if(toX <0 ){this.MovmentC--;}
    else if(toX >0){this.MovmentC++;}
    //pagination
    if(this.MovmentC <-(this.Np-1) ){this.MovmentC = -(this.Np-1);}
    if(this.MovmentC >0 ){this.MovmentC = 0;}
    
    this.movePage(300);
    //refresh dots
},this);

    }
    movePage(_duration:number){

        this.scene.tweens.add({
            targets:this,
            duration:_duration,
            x:this.scene.cameras.main.width*this.MovmentC,
            ease:Phaser.Math.Easing.Linear,
            onComplete:()=>{
                this.XX = this.scene.cameras.main.width*this.MovmentC;
                GameData.MenuPage = this.MovmentC;
            }
          })
    }
    makeThumbs(a:Array<any>){
        this.AllThumbs=[];
        //calculate pages
        this.Np = Math.ceil(a.length/this.MaxPageItem);
        //console.log('Np',this.Np);
        this.refresh(this.Np);
        //split array fr each page
        for( let p:number = 0 ; p < this.Np; p++){
        //add thumbs for each page
        this.addThumbs(a.slice(p*this.MaxPageItem, (p+1)*this.MaxPageItem));
        }
        

    }
    addThumbs(a:Array<any>){
        //console.log('received',a)
        const _W = this.scene.cameras.main.width;
        const _H = this.scene.cameras.main.height;

        const Xi = (this.indexation*_W) - _W/32;
        let Yi = _H/4.5;
        let XX:number=0;

       for ( let i:number = 0; i < a.length; i++ ){
        let thumb:Thumb = new Thumb(this.scene,a[i]);//this.indexation+'-'+i
        thumb.lock();
        this.add(thumb);
        this.AllThumbs.push(thumb);
        XX++;
        thumb.setPosition( Xi +((XX)*_W/3.8) ,Yi);
       
        if(XX>2){
            XX = 0;
            Yi+=_H/7;
        }
       }

       this.indexation++;
    }
    refresh(numberofpages:number){
      this.back.setDisplaySize(
        this.scene.cameras.main.width * numberofpages,
        this.scene.cameras.main.height * 1
      );
     
      this.width = this.back.displayWidth;
      this.height = this.back.displayHeight;

}
updateLevels(){
    console.log(' --- updateLevels ---',GameData.currentLevel)
    for (let l:number = 0 ; l <GameData.currentLevel; l++){
       // console.log("voila",l,this.AllThumbs.length);
     
        
        if(l < GameData.playedLevel){
            this.AllThumbs[l].stars.setVisible(true);
        }
        
        if(this.AllThumbs[l]){this.AllThumbs[l].unlock();}
    }
    
}
}