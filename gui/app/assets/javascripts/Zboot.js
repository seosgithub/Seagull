var SplashController = function() {
  this.base = FlokController; this.base(); var self = this;

  this.init = function() {
  }

  this.action = function(from, to) {
  }

  this.event = function(name, info) {
    self.$sel("#devices").append("<li>" + info.name + "</li>")
  }
}

var RotateController = function() {
  this.base = FlokController; this.base(); var self = this;

  this.init = function() {
    /*var scene = new THREE.Scene();*/
    //mydom = self.$_sel
    //var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 100 );

    //var renderer = new THREE.WebGLRenderer();
    //renderer.setSize( self.$_sel.width(), self.$_sel.height());
    //renderer.setClearColor( 0xffffff, 1 );
    //self.$sel(".area")[0].appendChild( renderer.domElement );

    //var geometry = new THREE.BoxGeometry( 1.5, 2, 0.001 );
    ////var material = new THREE.MeshBasicMaterial( { color: 0x00fff0 } );
    //var material = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
        //map:THREE.ImageUtils.loadTexture('Paper.png')
    //});
    //var cube = new THREE.Mesh( geometry, material );
    //scene.add( cube );

    //camera.position.z = 2;

    //x = 0;
    //y = 0;
    //var render = function () {
      //requestAnimationFrame( render );

      //cube.rotation.x = y;
      //cube.rotation.y = x;

      //renderer.render(scene, camera);
    //};

    //render();

    //self.$sel(".area")[0].translate = false;
    //self.$sel(".area")[0].rotate = false;
    //self.$sel(".area")[0].addEventListener("mousemove", function(e) {
      //if (this.rotate == true || this.translate == true) {
        //var _x = e.clientX / $(this).width()*2;
        //var _y = e.clientY / $(this).height()*2;
      //}

      //if (this.lastX) {
        //var dx = _x-this.lastX;
        //var dy = _y-this.lastY;

        //if (this.rotate == true) {
          //x += dx*2;
          //y += dy*2;
        //} else if (this.translate == true) {
          //camera.position.x -= dx*4;
          //camera.position.y += dy*4;
        //}
      //}

      ////Save XY
      //this.lastX = _x;
      //this.lastY = _y;
    //});

    //self.$sel(".area")[0].addEventListener("mousedown", function(e) {
      //if (e.button === 0) {
        //this.rotate = true;
      //} else if (e.button === 2) {
        //this.translate = true;
      //}
    //});

    //self.$sel(".area")[0].addEventListener("mouseup", function(e) {
      //this.rotate = false;
      //this.translate = false;
      //this.lastX = null;
      //this.lastY = null;
    //});

    //self.$sel(".area")[0].addEventListener("mousewheel", function(e) {
      //e.preventDefault();
      //camera.position.z -= e.wheelDelta/600.0;
    /*});*/
  }

  this.action = function(from, to) {
  }

  this.event = function(name, info) {
  }
}
$(document).ready(function() {
  regController("splash", SplashController);
  regController("rotate", RotateController);

  _embed("root", 0, {});
  int_dispatch([]);
});
