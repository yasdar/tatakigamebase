import 'phaser';
import { GameData } from '../utils';

export class Thumb extends Phaser.GameObjects.Container {
   
  back:Phaser.GameObjects.Image;
  contour:Phaser.GameObjects.Image;
  txt:Phaser.GameObjects.Text;
  stars:Phaser.GameObjects.Image;


  id:string;

    constructor(scene:any,id:string) {
        super(scene);
       this.id = id;
        const style:any ={font: "bold 50px bariol_boldbold",color: "#ffffff",
          shadow: { color: "#5a5a5a", fill: true, offsetX: 1, offsetY: 1, blur: 0 }
      };

        this.back = this.scene.add.image(0,0,'choose_level','LetterIcon_Back_Unlocked0000');
        this.txt = this.scene.add.text(0,0,id,style);
        this.txt.setOrigin(0.5,0.5);
        this.stars = this.scene.add.image(0,0,'choose_level','Stars0000');
       


        this.add(this.back);
        this.add(this.stars);
        this.add(this.txt);

       
        this.scene.add.existing(this);
        this.stars.setX(this.back.displayWidth*0.5)
        this.width = this.back.displayWidth;
       

        this.back.setInteractive({cursor:'pointer'});
          this.back.on('pointerdown',()=>{
            if(this.txt.visible){
              console.log('playing now ',this.id);
              GameData.currentLetter = this.id.charAt(1);
              //go to play screen
              this.goPlay();
            }
          })

    }
    lock(){//fermer
      this.back.setTexture('choose_level','LetterIcon_Back_Locked0000');
      this.txt.setVisible(false);
      this.stars.setVisible(false);
    }
    /** ouvrir */
    unlock(){//ovrir
      if(!this.txt.visible){
        this.txt.setVisible(true);
        console.log('activate',this.id)
        this.back.setTexture('choose_level','LetterIcon_Back_Unlocked0000');
       
      }
    
    }
   goPlay(){
      this.scene.cameras.main.once(
         Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam:any, effect:any) => {
         this.scene.scene.start('PlayGame');
     });
     this.scene.cameras.main.fadeOut(300, 0, 0, 0);
    }
}