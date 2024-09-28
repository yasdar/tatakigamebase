import "phaser";

import { all_audios, formatJson, GameData } from "./utils";
import { Bg } from "./objects/Bg";

export class Preload extends Phaser.Scene {
  TXT: Phaser.GameObjects.Text;
  constructor() {
    super("Preload");
  }
  preload(): void {
    //add background
    new Bg(this);

    this.load.on("loaderror", this.OnError, this);

    this.TXT = this.add.text(0, 0, "100%", {
      font: "bold 72px bariol_boldbold",
      color: "#ffffff",
      shadow: { color: "#000000", fill: true, offsetX: 1, offsetY: 1, blur: 0 },
    });
    this.TXT.setOrigin(0.5, 0.5);
    this.TXT.x = this.cameras.main.width * 0.5;
    this.TXT.y = this.cameras.main.height * 0.5;
    
    //listeners
    this.load.on("progress", this.fileComplte, this);
    this.load.on("complete", this.complete, this);

    //load agame assets
    this.load.json("_texts","./assets/texts.json");

    this.load.json("en_letters","./assets/letters/en_letters.json");
    this.load.json("es_letters","./assets/letters/es_letters.json");
    this.load.json("fr_letters","./assets/letters/fr_letters.json");
    this.load.json("it_letters","./assets/letters/it_letters.json");
    this.load.json("pt_letters","./assets/letters/pt_letters.json");


    this.load.atlas(
      "backgrounds",
      "./assets/graphics/backgrounds.png",
      "./assets/graphics/backgrounds.json"
    );

    this.load.atlas(
      "backgrounds_1",
      "./assets/graphics/backgrounds_1.png",
      "./assets/graphics/backgrounds_1.json"
    );

    this.load.atlas(
      "graphics_1",
      "./assets/graphics/graphics_1.png",
      "./assets/graphics/graphics_1.json"
    );
    
    this.load.atlas(
      "pictures_1",
      "./assets/graphics/pictures_1.png",
      "./assets/graphics/pictures_1.json"
    );

    this.load.atlas(
      "pictures_2",
      "./assets/graphics/pictures_2.png",
      "./assets/graphics/pictures_2.json"
    );
    this.load.atlas(
      "letters_complete",
      "./assets/graphics/letters_complete.png",
      "./assets/graphics/letters_complete.json"
    );

    this.load.atlas(
      "word_level",
      "./assets/graphics/word_level.png",
      "./assets/graphics/word_level.json"
    );
    
    this.load.image('chalkboard_button','./assets/graphics/chalkboard_button.png');
    this.load.atlas(
      "letters_1",
      "./assets/graphics/letters_1.png",
      "./assets/graphics/letters_1.json"
    );

    this.load.atlas(
      "letters_2",
      "./assets/graphics/letters_2.png",
      "./assets/graphics/letters_2.json"
    );
    

    this.load.atlas(
      "choose_level",
      "./assets/graphics/choose_level.png",
      "./assets/graphics/choose_level.json"
    );

    
    this.load.atlas(
      "languages_menu",
      "./assets/graphics/languages_menu.png",
      "./assets/graphics/languages_menu.json"
    );
    
    this.load.image('game_logo','./assets/graphics/game_logo.png');


    this.load.audio('MainLoop','./assets/audio/MainLoop.mp3');
    this.load.audio('tap','./assets/audio/tap.mp3');

    this.load.audio('Collect Item','./assets/audio/Collect Item.mp3');
    this.load.audio('Small Success','./assets/audio/Small Success.mp3');
    this.load.audio('restart','./assets/audio/restart.mp3');
    this.load.audio('kids_cheers','./assets/audio/kids_cheers.mp3');
    this.load.audio('Cartoon_Big_Win','./assets/audio/Cartoon Big Win.mp3');
    this.load.audio('Game_Award_3','./assets/audio/Game Award 3.mp3');
    
    this.load.audio('Pop_B','./assets/audio/Pop_B.mp3');
    this.load.audio('Pop_D','./assets/audio/Pop_D.mp3');
    this.load.audio('erase_board','./assets/audio/erase_board.mp3');
    this.load.audio('photo','./assets/audio/photo.mp3');

      
      let l:string = GameData.Languge.toLowerCase();
      this.load.audioSprite(
       l+'_fx_mixdown', 
        'assets/audio/words/'+l+'_fx_mixdown.json',
          'assets/audio/words/'+l+'_sounds.mp3'
      );
      
  }
  OnError(error: any) {
    alert("game say : OnError  :" + error.url);
  }
  create(): void {

    


    //formatJson()



/*let a=  this.sound.add('MainLoop',{volume:0.5});
a.volume = 0.5;*/

    all_audios['MainLoop'] =  this.sound.add('MainLoop',{volume:0.33});
    all_audios['tap'] =  this.sound.add('tap');

   
    all_audios['restart'] =  this.sound.add('restart');
    all_audios['Collect_Item'] =  this.sound.add('Collect Item');
    all_audios['Small_Success'] =  this.sound.add('Small Success');
    all_audios['kids_cheers'] =  this.sound.add('kids_cheers');

    all_audios['Cartoon_Big_Win'] =  this.sound.add('Cartoon_Big_Win');
    all_audios['Game_Award_3'] =  this.sound.add('Game_Award_3');

    
    all_audios['Pop_B'] =  this.sound.add('Pop_B');
    all_audios['Pop_D'] =  this.sound.add('Pop_D');
    all_audios['erase_board'] =  this.sound.add('erase_board');
    all_audios['photo'] =  this.sound.add('photo');



    GameData.gameSize={width:this.cameras.main.width,height:this.cameras.main.height},
    //scene transtion with fade out
    this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam:any, effect:any) => {
		this.scene.start('Home');
	});
    this.cameras.main.fadeOut(300, 0, 0, 0);

  }

  fileComplte(progress: any) {
    this.TXT.setText(Math.round(progress * 100) + "%");
  }
  complete() {
    console.log("all assets loaded");
  }
}
