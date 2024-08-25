import 'phaser';
import $ from "jquery";
export class Boot extends Phaser.Scene {

     constructor() {super("Boot");}

     preload(): void {
         this.load.atlas('main_menu', './assets/graphics/main_menu.png', './assets/graphics/main_menu.json');
     }
     create(): void {
        //hide spinner
        $('#loading-spinner-container').hide();
        this.scene.start("Preload");

     }
 }