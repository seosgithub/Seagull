var SplashController = function() {
  this.base = FlokController; this.base(); var self = this;

  this.init = function() {
  }

  this.action = function(from, to) {
  }

  this.event = function(name, info) {
    //Found a new set of devices
    if (name == "devices_updated") {
      //Clear old devices
      self.$sel("#devices").html("");

      //Append new device with data-id for name
      for (var i = 0; i < info.length; ++i) {
        self.$sel("#devices").append("<li data-id='" + info[i].id + "'> <img style='display: inline' width=40 src='chrome.png' />" + info[i].name + "</li>");

        //When the user clicks on one, send the device_clicked event along with the id
        (function() {
          var _i = i;
          self.$sel("#devices [data-id='" + info[_i].id + "']").on("click", function() {
            self.send("device_clicked", {id: info[_i].id});
          });
        })()
      }
    }
  }
}

var ReplController = function() {
  this.base = FlokController; this.base(); var self = this;

  this.init = function() {
    self.$sel("button").on("click", function() {
      var input = self.$sel("input").val();

      self.send("eval", {input: input})
    });
  }

  this.action = function(from, to) {
  }

  this.event = function(name, info) {
    if (name == "eval_res") {
      var textarea = self.$sel("textarea");
      textarea.append(JSON.stringify(info.res));
      textarea.append("\n")
    }
  }
}

var DashboardController = function() {
  this.base = FlokController; this.base(); var self = this;

  self.init = function() {
    self.$sel(".tab").on("click", function() {
      var name = $(this).attr("data-event");
      self.send(name, {});
    });
  }

  self.action = function(from, to) {
    self.$sel(".tab").removeClass('tabopen')
    self.$sel(".tab[data-name='" + to + "']").addClass("tabopen")
  }

  self.event = function(name, info) {
  }
}

var HierarchySelectorController = function() {
  this.base = FlokController; this.base(); var self = this;

  self.init = function() {
  }

  self.action = function(from, to) {
  }

  self.event = function(name, info) {
    function _process(node, $ssel) {
      var uuid = UUID();
      var name = node.name;
      if (node.type == 'vc') {
        name = (name+"#"+node.action)
      }
      $ssel.append("<li data-ptr='" + node.ptr + "' class='" + node.type + "'><span class='name'>" + name + "</span> </li><ul data-uuid='" + uuid + "'></ul>");

      //The actual node we just added
      var $node = $ssel.find("[data-ptr='" + node.ptr + "']");

      //Handle highlighting
      ///////////////////////////////////////////////////
      $node.on("mouseenter", function() {
        var ptr = $(this).attr("data-ptr");
        self.send("highlight", {ptr: ptr, on: true});
      });
      $node.on("mouseleave", function() {
        var ptr = $(this).attr("data-ptr");
        self.send("highlight", {ptr: ptr, on: false});
      });
      if (node.type === "vc") {
        $node.on("click", function() {
          var ptr = $(this).attr("data-ptr");
          self.send("vc_clicked", {ptr: ptr});
        });
      }
      ///////////////////////////////////////////////////

      //The children
      var $ul = $ssel.find("[data-uuid='" + uuid + "']");
      for (var i = 0; i < node.children.length; ++i) {
        var child = node.children[i];
        _process(child, $ul);
      }
    }

    console.error(name);
    if (name === "hierarchy_updated") {
      _process(info, self.$sel("#nodes"));
    } else if (name === "vc_selected") {
      var ptr = info.ptr;
      self.$sel(".vc").removeClass('selected');
      console.error(ptr.toString());
      self.$sel(".vc[data-ptr='" + ptr + "']").addClass('selected');
    }
  }
}

var HierarchyVCInfoController = function() {
  this.base = FlokController; this.base(); var self = this;

  self.init = function() {
  }

  self.action = function(from, to) {
  }

  self.event = function(name, info) {
    if (name === "context_update") {
      self.$sel("textarea#context").val(JSON.stringify(info));
    } else if (name === "events_update") {
      self.$sel("textarea#events").val(JSON.stringify(info));
    }
  }
}

var RotateController = function() {
  this.base = FlokController; this.base(); var self = this;

  this.init = function() {
    var scene = new THREE.Scene();
    mydom = self.$_sel
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 100 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( 500, 500)
    renderer.setClearColor( 0xffffff, 1 );
    self.$sel(".area")[0].appendChild( renderer.domElement );

    var geometry = new THREE.BoxGeometry( 1.5, 2, 0.001 );
    //var material = new THREE.MeshBasicMaterial( { color: 0x00fff0 } );
    var material = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
        map:THREE.ImageUtils.loadTexture('Paper.png')
    });
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 2;

    x = 0;
    y = 0;
    var render = function () {
      requestAnimationFrame( render );

      cube.rotation.x = y;
      cube.rotation.y = x;

      renderer.render(scene, camera);
    };

    render();

    self.$sel(".area")[0].translate = false;
    self.$sel(".area")[0].rotate = false;
    self.$sel(".area")[0].addEventListener("mousemove", function(e) {
      if (this.rotate == true || this.translate == true) {
        var _x = e.clientX / $(this).width()*2;
        var _y = e.clientY / $(this).height()*2;
      }

      if (this.lastX) {
        var dx = _x-this.lastX;
        var dy = _y-this.lastY;

        if (this.rotate == true) {
          x += dx*2;
          y += dy*2;
        } else if (this.translate == true) {
          camera.position.x -= dx*4;
          camera.position.y += dy*4;
        }
      }

      //Save XY
      this.lastX = _x;
      this.lastY = _y;
    });

    self.$sel(".area")[0].addEventListener("mousedown", function(e) {
      if (e.button === 0) {
        this.rotate = true;
      } else if (e.button === 2) {
        this.translate = true;
      }
    });

    self.$sel(".area")[0].addEventListener("mouseup", function(e) {
      this.rotate = false;
      this.translate = false;
      this.lastX = null;
      this.lastY = null;
    });

    self.$sel(".area")[0].addEventListener("mousewheel", function(e) {
      e.preventDefault();
      camera.position.z -= e.wheelDelta/600.0;
    });
  }
  this.action = function(from, to) {
  }

  this.event = function(name, info) {
  }
}

$(document).ready(function() {
  regController("splash", SplashController);
  regController("dashboard", DashboardController);
  regController("rotate", RotateController);
  regController("repl", ReplController);
  regController("hierarchy_selector", HierarchySelectorController);
  regController("hierarchy_vc_info", HierarchyVCInfoController);

  int_dispatch([]);
  if_timer_init(4);
  _embed("root", 0, {});
});
