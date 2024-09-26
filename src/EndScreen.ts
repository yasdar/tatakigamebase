import 'phaser';

import { GameData, placeIt, playAudio, tween_Elastic} from "./utils";
import { Bg } from './objects/Bg';


export class EndScreen extends Phaser.Scene {

    cong_txt:Phaser.GameObjects.Text;
    lear_txt:Phaser.GameObjects.Text;
    tap_txt:Phaser.GameObjects.Text;
    gift:Phaser.GameObjects.Image;
    page1:Phaser.GameObjects.Container;
    data_text:any;
    page_index:number;
     constructor() {super("EndScreen");}
     preload(): void {}
     create(): void {

        playAudio('Cartoon_Big_Win');

        GameData.endScreenPlayed = 1;
        localStorage.setItem("endScreenPlayed_"+GameData.Languge, "1");


        let bg = new Bg(this);
        bg.base.setTexture('backgrounds_1','BG_Red0000');
        bg.layer.setTexture('backgrounds_1',"_Items0000");
        bg.refresh();

        this.page_index = 0;
       this.data_text = this.cache.json.get('_texts')[(GameData.Languge).toLowerCase()];

        const style1:any ={font: "bold 60px bariol_boldbold",color: "#ffffff",
          shadow: { color: "#5a5a5a", fill: true, offsetX: 1, offsetY: 1, blur: 0 }
      };
      const style2:any ={font: "bold 42px bariol_boldbold",color: "#ffffff",
        shadow: { color: "#5a5a5a", fill: true, offsetX: 1, offsetY: 1, blur: 0 }
    };
    const style3:any ={font: "bold 60px bariol_boldbold",color: "#ffffff",
        shadow: { color: "#5a5a5a", fill: true, offsetX: 1, offsetY: 1, blur: 0 }
    };
        
        this.page1 = this.add.container();

       this.cong_txt = this.add.text(0,0, this.data_text.letters_complete_title,style1).setOrigin(0.5,0.5);
       placeIt(this.cong_txt,this,0.5,0.125);
       this.cong_txt.setAlpha(0);

       this.lear_txt= this.add.text(0,0, this.data_text.letters_complete_subtitle,style2).setOrigin(0.5,0.5);
       placeIt(this.lear_txt,this,0.5,0.2);
       this.lear_txt.setAlpha(0);

       this.tap_txt= this.add.text(0,0, this.data_text.letters_complete_hint_1,style3).setOrigin(0.5,0.5);
        placeIt(this.tap_txt,this,0.5,0.86);
        this.tap_txt.setAlpha(0);

        this.gift = this.add.image(0,0,'letters_complete','Present_Closed0000');
        placeIt(this.gift,this,0.5,0.5);
        this.gift.setAlpha(0);
        tween_Elastic(this.gift,this);

        this.page1.add([this.cong_txt,this.lear_txt,this.tap_txt,this.gift])

        this.tweens.add({
            targets:this.cong_txt,
            duration:200,
            alpha:1
          })
          this.tweens.add({
            targets:this.lear_txt,
            duration:200,
            delay:200,
            alpha:1
          })

        this.tweens.add({
            targets:this.gift,
            duration:400,
            delay:400,
            alpha:1,
            ease:Phaser.Math.Easing.Linear
          })


          this.tweens.add({
            targets:this.tap_txt,
            duration:200,
            delay:800,
            alpha:1
          })

          this.tweens.add({
            targets:this.tap_txt,
            duration:400,
            scaleX:1.05,
            scaleY:1.05,
            yoyo:true,
            repeat:-1,
            ease:Phaser.Math.Easing.Bounce
          })

        this.input.setDefaultCursor('pointer');

        this.input.on('pointerdown',this.onClick,this);

    }onClick(){
        console.log('open gift now');
       

        if(this.page_index == 0){
            playAudio('Game_Award_3');
            this.page_index = -1;
            this.tweens.killTweensOf(this.gift);
            this.tweens.add({
                targets:this.gift,
                duration:200,
                scaleX:3,
                scaleY:3,
                alpha:0,
                ease:Phaser.Math.Easing.Expo.InOut,
                onComplete:()=>{this.GoPage2();}
              })
        }else if(this.page_index == 1){
          playAudio('tap');
          this.page_index = 0;
          this.input.removeListener('pointerdown',this.onClick,this);

          console.log("go to chalkboard");
        }
    }
    GoPage2(){

        this.cong_txt.setText( this.data_text.sandbox);
        placeIt(this.cong_txt,this,0.5,0.2);

        this.tap_txt.setText( this.data_text.letters_complete_hint_2);

        this.lear_txt.setText('');

        
        this.gift.setTexture('chalkboard_button');
        this.gift.setScale(1,1);
        this.gift.setAlpha(1);

        this.tweens.add({
            targets:this.gift,
            duration:100,
            scaleX:1.05,
            scaleY:1.05,
            yoyo:true,
            repeat:0,
            ease:Phaser.Math.Easing.Linear,
            onComplete:()=>{this.page_index = 1;}
          })


        this.playconfetti();
       
    }
    playconfetti(){
        let _config:Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
            frame:['Confetti_10000','Confetti_20000','Confetti_30000','Confetti_40000','Confetti_50000','Confetti_60000'],
            x: { min: 0, max: this.cameras.main.width },
            y:-10,
            quantity: 0.1,
            lifespan: 4000,
            gravityY: 200,
            frequency:100,
            alpha:{ min: 0.7, max: 1},
            rotate:{ min: 0, max: 270},
            scale:{ min: 0.8, max: 1.2},
        };

        this.add.particles('word_level','',_config);

    }


 }