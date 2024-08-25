import 'phaser';
 /* great or wrong */
export class Question extends Phaser.GameObjects.Container {
    zone:Phaser.GameObjects.Sprite;
    TXT:Phaser.GameObjects.Text;
    ico:Phaser.GameObjects.Sprite;
    _w:number;
    _h:number;
    isCorrect:boolean;
    constructor(scene:any) {
        super(scene);
        const SC:number = 2
        //zone image 
        this.zone = this.scene.add.sprite(0,0,'b1').setScale(SC);
        this.zone.setOrigin(0.5,0.28);
        //icon
        this.ico = this.scene.add.sprite(this.zone.displayWidth*0.35,0,'');
        this.ico.setOrigin(0.5,0.5);
        this.ico.setPosition(
            this.zone.x,
            this.zone.y
            )
        
            
        //add to container
        this.add([this.zone,this.ico]);
        //add to scene
        this.x = this.scene.cameras.main.width*0.5;
        this.y = this.scene.cameras.main.height*0.5;
        this._w =  this.zone.displayWidth;
        this._h =  this.zone.displayHeight;
        this.scene.add.existing(this);


       
       
    }addQ(key:string,ballon:string){
  
       
        this.zone.setScale(2);
        this.ico.setAlpha(1);
        this.zone.setAlpha(1);

        this.isCorrect = false;
        //change ballon texture
        this.zone.setTexture(ballon)
        //change ico image
        this.ico.setTexture(key);
        let coef = this.ico.width/this.ico.height;
        this.ico.setDisplaySize(this.zone.displayWidth*0.6,this.zone.displayWidth*0.6/coef)
    }explode_ballon(){
        this.scene.tweens.add({
            targets: [this.zone],
            scale:0.1,
            ease: 'Power1',
            duration: 600,
            onComplete:()=>{  this.zone.setAlpha(0);}
        });
        this.scene.tweens.add({
            targets: [this.ico],
            alpha:0,
            ease: 'Power1',
            duration: 300
        });
    }makeCorrect(){
        this.isCorrect = true;
    }
    Hide(HideAfter:number){
        if(HideAfter){
            /*
            this.scene.tweens.add({
                targets: this,
                alpha:0,
                ease: 'Power1',
                duration: 500,
                delay:HideAfter
            });*/
        }
    }
}