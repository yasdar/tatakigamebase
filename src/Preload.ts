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
    this.load.atlas(
      "backgrounds",
      "./assets/graphics/backgrounds.png",
      "./assets/graphics/backgrounds.json"
    );

    this.load.image('game_logo','./assets/graphics/game_logo.png')
  }
  OnError(error: any) {
    alert("game say : OnError  :" + error.url);
  }
  create(): void {

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
