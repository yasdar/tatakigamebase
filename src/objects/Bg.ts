import 'phaser';
 /* great or wrong */
export class Bg extends Phaser.GameObjects.Container {
   
    constructor(scene:any) {
        super(scene);
       
            //add background
    let bg = this.scene.add.image(0, 0, "main_menu", "BG0000");
    bg.setOrigin(0, 0);
    bg.setDisplaySize(
      this.scene.cameras.main.width * 1.015,
      this.scene.cameras.main.height * 1.01
    );

    let bgLetters = this.scene.add.image(0, 0, "main_menu", "Letters_BG0000");
    bgLetters.setOrigin(0, 0);
    bgLetters.setDisplaySize(
      this.scene.cameras.main.width * 1.015,
      this.scene.cameras.main.height * 1.01
    );
        //add to container
        this.add([bg,bgLetters]);
       
        this.scene.add.existing(this);


       
       
    }
}