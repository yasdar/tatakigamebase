import 'phaser';
 /* great or wrong */
export class Bg extends Phaser.GameObjects.Container {
   
  base:Phaser.GameObjects.Image;
  layer:Phaser.GameObjects.Image;
    constructor(scene:any) {
        super(scene);
       
            //add background
    this.base = this.scene.add.image(0, 0, "main_menu", "BG0000");
    this.base.setOrigin(0, 0);
    

    this.layer = this.scene.add.image(0, 0, "main_menu", "Letters_BG0000");
    this.layer.setOrigin(0, 0);
    
        //add to container
        this.add([this.base,this.layer]);
       
        this.scene.add.existing(this);

        this.refresh();
       
       
    }
    refresh(){
      this.base.setDisplaySize(
        this.scene.cameras.main.width * 1.015,
        this.scene.cameras.main.height * 1.01
      );
      this.layer.setDisplaySize(
        this.scene.cameras.main.width * 1.015,
        this.scene.cameras.main.height * 1.01
      );
    }
}