import "phaser";

import { GameData } from "./utils";
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
    

    this.load.image('game_logo','./assets/graphics/game_logo.png')
  }
  OnError(error: any) {
    alert("game say : OnError  :" + error.url);
  }
  create(): void {

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
