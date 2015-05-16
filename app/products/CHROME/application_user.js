
//The view-controller hierarchy is managed by this set of functions.

//Embed a view-controller into a named spot. If spot is null, then it is assumed
//you are referring to the root-spot.
function _embed(vc_name, sp, context, event_gw) {
  //Lookup VC ctable entry
  var cte = ctable[vc_name];

  //Find the root view name
  var vname = cte.root_view;

  //Get spot names
  var spots = cte.spots;

  //Actions
  var actions = cte.actions;

  //Allocate a list of tels, the base is the actual 'vc', followed by
  //the 'main' spot, and so on
  var base = tels(spots.length+1);

  //TODO: choose action
  var action = Object.keys(cte.actions)[0];

  spots.unshift("vc") //Borrow spots array to place 'vc' in the front => ['vc', 'main', ...]
    //Initialize the view at base+1 (base+0 is vc), and the vc at base+0
main_q.push([4, "if_init_view", vname, {}, base+1, spots])
    
main_q.push([4, "if_controller_init", base, base+1, vc_name, context])
main_q.push([2, "if_attach_view", base+1, sp])
  spots.shift() //Un-Borrow spots array (it's held in a constant struct, so it *cannot* change)

  //Create controller information struct
  var info = {
    context: context,
    action: action,
    cte: cte,
    embeds: [],
    event_gw: event_gw
  };

  //Register controller base with the struct, we already requested base
  tel_reg_ptr(info, base);


  //Register the event handler callback
  reg_evt(base, controller_event_callback);

  //Call the on_entry function with the base address
  cte.actions[action].on_entry(base);

  //Before notifying action, make sure to set available action events for debug
  
main_q.push([3, "if_debug_assoc", base, "action_events", Object.keys(actions[action].handlers)])
  

  //Notify action
  var payload = {from: null, to: action};
main_q.push([3, "if_event", base, "action", payload])

  return base;
}

//Called when an event is received
function controller_event_callback(ep, event_name, info) {
  //Grab the controller instance
  var inst = tel_deref(ep);

  //Now, get the ctable entry
  var cte = inst.cte;

  //Now find the event handler
  var handler = cte.actions[inst.action].handlers[event_name];
  if (handler !== undefined) {
    handler(ep, info);
  } else {
    //Recurse
    if (inst.event_gw != null) {
      controller_event_callback(inst.event_gw, event_name, info);
    }
  }
}

//Everything to do with dynamic dispatch

//Receive some messages
//Each message is in one flat array
//that has the following format
//[n_args, function_name, *args]
//Here is an example with one call
//  [1, 'print', 'hello world']
//Here is an example with two successive calls
//  [2, 'mul', 3, 4, 1, 'print', 'hello world']
function int_dispatch(q) {
  //Where there is still things left on the queue
  while (q.length > 0) {
    //Grab the first thing off the queue, this is the arg count
    var argc = q.shift();

    //Grab the next thing and look that up in the function table. Pass args left
    this[q.shift()].apply(null, q.splice(0, argc));
  }

  //Now push all of what we can back
  var dump = [];

  //Send main queue
  if (main_q.length > 0) {
    var out = [0];
    for (var i = 0; i < main_q.length; ++i) {
      out.push.apply(out, main_q[i]);
    }
    dump.push(out);
    main_q = [];
  }

  if (net_q.length > 0 && net_q_rem > 0) {
    //Always pick the minimum between the amount remaining and the q length
    var n = net_q.length < net_q_rem ? net_q.length : net_q_rem;

    var out = [1];
    var piece = net_q.splice(0, n);
    for (var i = 0; i < piece.length; ++i) {
      out.push.apply(out, piece[i]);
    }
    dump.push(out);

    net_q_rem -= n;
  }

  if (disk_q.length > 0 && disk_q_rem > 0) {
    //Always pick the minimum between the amount remaining and the q length
    var n = disk_q.length < disk_q_rem ? disk_q.length : disk_q_rem;

    var out = [2];
    var piece = disk_q.splice(0, n);
    for (var i = 0; i < piece.length; ++i) {
      out.push.apply(out, piece[i]);
    }
    dump.push(out);

    disk_q_rem -= n;
  }

  if (cpu_q.length > 0 && cpu_q_rem > 0) {
    //Always pick the minimum between the amount remaining and the q length
    var n = cpu_q.length < cpu_q_rem ? cpu_q.length : cpu_q_rem;

    var out = [3];
    var piece = cpu_q.splice(0, n);
    for (var i = 0; i < piece.length; ++i) {
      out.push.apply(out, piece[i]);
    }
    dump.push(out);

    cpu_q_rem -= n;
  }

  if (gpu_q.length > 0 && gpu_q_rem > 0) {
    //Always pick the minimum between the amount remaining and the q length
    var n = gpu_q.length < gpu_q_rem ? gpu_q.length : gpu_q_rem;

    var out = [4];
    var piece = gpu_q.splice(0, n);
    for (var i = 0; i < piece.length; ++i) {
      out.push.apply(out, piece[i]);
    }
    dump.push(out);

    gpu_q_rem -= n;
  }

  if (dump.length != 0) {
    if_dispatch(dump);
  }
}

function ping() {
main_q.push([0, "pong"])
}

function ping1(arg1) {
main_q.push([1, "pong1", arg1])
}

function ping2(arg1, arg2) {
main_q.push([1, "pong2", arg1])
main_q.push([2, "pong2", arg1, arg2])
}

function ping3(arg1) {
  if (arg1 == "main") {
main_q.push([0, "pong3"])
  } else if (arg1 == "net") {
net_q.push([0, "pong3"])
  } else if (arg1 == "disk") {
disk_q.push([0, "pong3"])
  } else if (arg1 == "cpu") {
cpu_q.push([0, "pong3"])
  } else if (arg1 == "gpu") {
gpu_q.push([0, "pong3"])
  }
}

function ping4(arg1) {
  if (arg1 == "main") {
main_q.push([0, "pong4"])
  } else if (arg1 == "net") {
net_q.push([0, "pong4"])
  } else if (arg1 == "disk") {
disk_q.push([0, "pong4"])
  } else if (arg1 == "cpu") {
cpu_q.push([0, "pong4"])
  } else if (arg1 == "gpu") {
gpu_q.push([0, "pong4"])
  }
}

function ping4_int(arg1) {
  if (arg1 == "main") {
  } else if (arg1 == "net") {
    ++net_q_rem;
  } else if (arg1 == "disk") {
    ++disk_q_rem;
  } else if (arg1 == "cpu") {
    ++cpu_q_rem;
  } else if (arg1 == "gpu") {
    ++gpu_q_rem;
  }
}

//Queue something to be sent out
main_q = [];
net_q = [];
disk_q = [];
cpu_q = [];
gpu_q = [];

//Each queue has a max # of things that can be en-queued
//These are decremented when the message is sent (not just queued)
//and then re-incremented at the appropriate int_* mod entry.
net_q_rem = 5;
disk_q_rem = 5;
cpu_q_rem = 5;
gpu_q_rem = 5;

//Network Callback Related

var tp_to_info = {};

function get_req(owner, url, params, callback) {
  //Even though it's the same function, create a tp because we need to track owner somehow.
  var tp = tel_reg(get_req_callback);
  tp_to_info[tp] = {
    owner: owner,
    callback: callback
  };

  //Create request
net_q.push([4, "if_net_req", "GET", url, params, tp])
}

function get_req_callback(tp, success, info) {
  var _info = tp_to_info[tp];
  if (tel_exists(_info.owner) === true) {
    _info.callback(info);
  }

  tel_del(tp);
  delete tp_to_info[tp];
}

//Support for the telepathy protocol
tel_idx = 0

//Global table linking telepointers to objects (like functions)
tel_table = {};

//This function creates N telepathic pointers and returns the starting index
//of the first pointer returned.  Successive pointers are just increments
//of the base value by one. Should be used as much as possible as it
//reduces the communication overhead (by allowing pipelining on futures), 
//and prevents native pointers from entering the system (which allows more
//interesting abstractions like slaves)
function tels(n) {
  var o = tel_idx;
  tel_idx += n;
  return o;
}

function tel_reg(e) {
  var tp = tels(1);
  tel_table[tp] = e;

  return tp;
}

function tel_reg_ptr(e, tp) {
  tel_table[tp] = e;
}

function tel_del(tp) {
  delete tel_table[tp];
}

function tel_deref(tp) {
  return tel_table[tp];
}

function tel_exists(tp) {
  return tp in tel_table;
}


  //////////////////////////////////////////////////
  //Start of rest on_init
  
    //Code inserted here is put into the global space, add initialization
    //procedures, functions that need to be called, etc.
    //
    //You may use the function respond(info) within here to 

    //Store the in-progress requests as a list of hashes
    //that contain an array in the order of [event_pointer, evenct_name]
    var service_rest_tp_to_einfo = {}

    function service_rest_callback(tp, success, info) {
      ////Lookup event info
      var einfo = service_rest_tp_to_einfo[tp];

      ////Send info back to service
      int_event(einfo[0], einfo[1], {success: success, info: info});

      //Remove entries in telepointer table and rest service info
      tel_del(tp);
      delete service_rest_tp_to_einfo[tp];
    }

/*
*  Secure Hash Algorithm (SHA512)
*  http://www.happycode.info/
*/

function SHA512(str) {
  function int64(msint_32, lsint_32) {
    this.highOrder = msint_32;
    this.lowOrder = lsint_32;
  }

  var H = [new int64(0x6a09e667, 0xf3bcc908), new int64(0xbb67ae85, 0x84caa73b),
      new int64(0x3c6ef372, 0xfe94f82b), new int64(0xa54ff53a, 0x5f1d36f1),
      new int64(0x510e527f, 0xade682d1), new int64(0x9b05688c, 0x2b3e6c1f),
      new int64(0x1f83d9ab, 0xfb41bd6b), new int64(0x5be0cd19, 0x137e2179)];

  var K = [new int64(0x428a2f98, 0xd728ae22), new int64(0x71374491, 0x23ef65cd),
      new int64(0xb5c0fbcf, 0xec4d3b2f), new int64(0xe9b5dba5, 0x8189dbbc),
      new int64(0x3956c25b, 0xf348b538), new int64(0x59f111f1, 0xb605d019),
      new int64(0x923f82a4, 0xaf194f9b), new int64(0xab1c5ed5, 0xda6d8118),
      new int64(0xd807aa98, 0xa3030242), new int64(0x12835b01, 0x45706fbe),
      new int64(0x243185be, 0x4ee4b28c), new int64(0x550c7dc3, 0xd5ffb4e2),
      new int64(0x72be5d74, 0xf27b896f), new int64(0x80deb1fe, 0x3b1696b1),
      new int64(0x9bdc06a7, 0x25c71235), new int64(0xc19bf174, 0xcf692694),
      new int64(0xe49b69c1, 0x9ef14ad2), new int64(0xefbe4786, 0x384f25e3),
      new int64(0x0fc19dc6, 0x8b8cd5b5), new int64(0x240ca1cc, 0x77ac9c65),
      new int64(0x2de92c6f, 0x592b0275), new int64(0x4a7484aa, 0x6ea6e483),
      new int64(0x5cb0a9dc, 0xbd41fbd4), new int64(0x76f988da, 0x831153b5),
      new int64(0x983e5152, 0xee66dfab), new int64(0xa831c66d, 0x2db43210),
      new int64(0xb00327c8, 0x98fb213f), new int64(0xbf597fc7, 0xbeef0ee4),
      new int64(0xc6e00bf3, 0x3da88fc2), new int64(0xd5a79147, 0x930aa725),
      new int64(0x06ca6351, 0xe003826f), new int64(0x14292967, 0x0a0e6e70),
      new int64(0x27b70a85, 0x46d22ffc), new int64(0x2e1b2138, 0x5c26c926),
      new int64(0x4d2c6dfc, 0x5ac42aed), new int64(0x53380d13, 0x9d95b3df),
      new int64(0x650a7354, 0x8baf63de), new int64(0x766a0abb, 0x3c77b2a8),
      new int64(0x81c2c92e, 0x47edaee6), new int64(0x92722c85, 0x1482353b),
      new int64(0xa2bfe8a1, 0x4cf10364), new int64(0xa81a664b, 0xbc423001),
      new int64(0xc24b8b70, 0xd0f89791), new int64(0xc76c51a3, 0x0654be30),
      new int64(0xd192e819, 0xd6ef5218), new int64(0xd6990624, 0x5565a910),
      new int64(0xf40e3585, 0x5771202a), new int64(0x106aa070, 0x32bbd1b8),
      new int64(0x19a4c116, 0xb8d2d0c8), new int64(0x1e376c08, 0x5141ab53),
      new int64(0x2748774c, 0xdf8eeb99), new int64(0x34b0bcb5, 0xe19b48a8),
      new int64(0x391c0cb3, 0xc5c95a63), new int64(0x4ed8aa4a, 0xe3418acb),
      new int64(0x5b9cca4f, 0x7763e373), new int64(0x682e6ff3, 0xd6b2b8a3),
      new int64(0x748f82ee, 0x5defb2fc), new int64(0x78a5636f, 0x43172f60),
      new int64(0x84c87814, 0xa1f0ab72), new int64(0x8cc70208, 0x1a6439ec),
      new int64(0x90befffa, 0x23631e28), new int64(0xa4506ceb, 0xde82bde9),
      new int64(0xbef9a3f7, 0xb2c67915), new int64(0xc67178f2, 0xe372532b),
      new int64(0xca273ece, 0xea26619c), new int64(0xd186b8c7, 0x21c0c207),
      new int64(0xeada7dd6, 0xcde0eb1e), new int64(0xf57d4f7f, 0xee6ed178),
      new int64(0x06f067aa, 0x72176fba), new int64(0x0a637dc5, 0xa2c898a6),
      new int64(0x113f9804, 0xbef90dae), new int64(0x1b710b35, 0x131c471b),
      new int64(0x28db77f5, 0x23047d84), new int64(0x32caab7b, 0x40c72493),
      new int64(0x3c9ebe0a, 0x15c9bebc), new int64(0x431d67c4, 0x9c100d4c),
      new int64(0x4cc5d4be, 0xcb3e42b6), new int64(0x597f299c, 0xfc657e2a),
      new int64(0x5fcb6fab, 0x3ad6faec), new int64(0x6c44198c, 0x4a475817)];

  var W = new Array(64);
  var a, b, c, d, e, f, g, h, i, j;
  var T1, T2;
  var charsize = 8;

  function utf8_encode(str) {
    return unescape(encodeURIComponent(str));
  }

  function str2binb(str) {
    var bin = [];
    var mask = (1 << charsize) - 1;
    var len = str.length * charsize;

    for (var i = 0; i < len; i += charsize) {
      bin[i >> 5] |= (str.charCodeAt(i / charsize) & mask) << (32 - charsize - (i % 32));
    }

    return bin;
  }

  function binb2hex(binarray) {
    var hex_tab = "0123456789abcdef";
    var str = "";
    var length = binarray.length * 4;
    var srcByte;

    for (var i = 0; i < length; i += 1) {
      srcByte = binarray[i >> 2] >> ((3 - (i % 4)) * 8);
      str += hex_tab.charAt((srcByte >> 4) & 0xF) + hex_tab.charAt(srcByte & 0xF);
    }

    return str;
  }

  function safe_add_2(x, y) {
    var lsw, msw, lowOrder, highOrder;

    lsw = (x.lowOrder & 0xFFFF) + (y.lowOrder & 0xFFFF);
    msw = (x.lowOrder >>> 16) + (y.lowOrder >>> 16) + (lsw >>> 16);
    lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

    lsw = (x.highOrder & 0xFFFF) + (y.highOrder & 0xFFFF) + (msw >>> 16);
    msw = (x.highOrder >>> 16) + (y.highOrder >>> 16) + (lsw >>> 16);
    highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

    return new int64(highOrder, lowOrder);
  }

  function safe_add_4(a, b, c, d) {
    var lsw, msw, lowOrder, highOrder;

    lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF);
    msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (lsw >>> 16);
    lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

    lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (msw >>> 16);
    msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (lsw >>> 16);
    highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

    return new int64(highOrder, lowOrder);
  }

  function safe_add_5(a, b, c, d, e) {
    var lsw, msw, lowOrder, highOrder;

    lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF) + (e.lowOrder & 0xFFFF);
    msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (e.lowOrder >>> 16) + (lsw >>> 16);
    lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

    lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (e.highOrder & 0xFFFF) + (msw >>> 16);
    msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (e.highOrder >>> 16) + (lsw >>> 16);
    highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

    return new int64(highOrder, lowOrder);
  }

  function maj(x, y, z) {
    return new int64(
      (x.highOrder & y.highOrder) ^ (x.highOrder & z.highOrder) ^ (y.highOrder & z.highOrder),
      (x.lowOrder & y.lowOrder) ^ (x.lowOrder & z.lowOrder) ^ (y.lowOrder & z.lowOrder)
    );
  }

  function ch(x, y, z) {
    return new int64(
      (x.highOrder & y.highOrder) ^ (~x.highOrder & z.highOrder),
      (x.lowOrder & y.lowOrder) ^ (~x.lowOrder & z.lowOrder)
    );
  }

  function rotr(x, n) {
    if (n <= 32) {
      return new int64(
       (x.highOrder >>> n) | (x.lowOrder << (32 - n)),
       (x.lowOrder >>> n) | (x.highOrder << (32 - n))
      );
    } else {
      return new int64(
       (x.lowOrder >>> n) | (x.highOrder << (32 - n)),
       (x.highOrder >>> n) | (x.lowOrder << (32 - n))
      );
    }
  }

  function sigma0(x) {
    var rotr28 = rotr(x, 28);
    var rotr34 = rotr(x, 34);
    var rotr39 = rotr(x, 39);

    return new int64(
      rotr28.highOrder ^ rotr34.highOrder ^ rotr39.highOrder,
      rotr28.lowOrder ^ rotr34.lowOrder ^ rotr39.lowOrder
    );
  }

  function sigma1(x) {
    var rotr14 = rotr(x, 14);
    var rotr18 = rotr(x, 18);
    var rotr41 = rotr(x, 41);

    return new int64(
      rotr14.highOrder ^ rotr18.highOrder ^ rotr41.highOrder,
      rotr14.lowOrder ^ rotr18.lowOrder ^ rotr41.lowOrder
    );
  }

  function gamma0(x) {
    var rotr1 = rotr(x, 1), rotr8 = rotr(x, 8), shr7 = shr(x, 7);

    return new int64(
      rotr1.highOrder ^ rotr8.highOrder ^ shr7.highOrder,
      rotr1.lowOrder ^ rotr8.lowOrder ^ shr7.lowOrder
    );
  }

  function gamma1(x) {
    var rotr19 = rotr(x, 19);
    var rotr61 = rotr(x, 61);
    var shr6 = shr(x, 6);

    return new int64(
      rotr19.highOrder ^ rotr61.highOrder ^ shr6.highOrder,
      rotr19.lowOrder ^ rotr61.lowOrder ^ shr6.lowOrder
    );
  }

  function shr(x, n) {
    if (n <= 32) {
      return new int64(
       x.highOrder >>> n,
       x.lowOrder >>> n | (x.highOrder << (32 - n))
      );
    } else {
      return new int64(
       0,
       x.highOrder << (32 - n)
      );
    }
  }

  str = utf8_encode(str);
  strlen = str.length*charsize;
  str = str2binb(str);

  str[strlen >> 5] |= 0x80 << (24 - strlen % 32);
  str[(((strlen + 128) >> 10) << 5) + 31] = strlen;

  for (var i = 0; i < str.length; i += 32) {
    a = H[0];
    b = H[1];
    c = H[2];
    d = H[3];
    e = H[4];
    f = H[5];
    g = H[6];
    h = H[7];

    for (var j = 0; j < 80; j++) {
      if (j < 16) {
       W[j] = new int64(str[j*2 + i], str[j*2 + i + 1]);
      } else {
       W[j] = safe_add_4(gamma1(W[j - 2]), W[j - 7], gamma0(W[j - 15]), W[j - 16]);
      }

      T1 = safe_add_5(h, sigma1(e), ch(e, f, g), K[j], W[j]);
      T2 = safe_add_2(sigma0(a), maj(a, b, c));
      h = g;
      g = f;
      f = e;
      e = safe_add_2(d, T1);
      d = c;
      c = b;
      b = a;
      a = safe_add_2(T1, T2);
    }

    H[0] = safe_add_2(a, H[0]);
    H[1] = safe_add_2(b, H[1]);
    H[2] = safe_add_2(c, H[2]);
    H[3] = safe_add_2(d, H[3]);
    H[4] = safe_add_2(e, H[4]);
    H[5] = safe_add_2(f, H[5]);
    H[6] = safe_add_2(g, H[6]);
    H[7] = safe_add_2(h, H[7]);
  }

  var binarray = [];
  for (var i = 0; i < H.length; i++) {
    binarray.push(H[i].highOrder);
    binarray.push(H[i].lowOrder);
  }
  return binb2hex(binarray);
}
  

  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  //Start of rest on_request
  function service_rest_req(info, ep, ename) {
    
    //Code that handles a payload goes here.
    //You have access to `info`, `ep`, and `ename` which was given in the ServiceRequest macro

    //Create a GET request that will respond to the telepointer
    var tp = tel_reg(service_rest_callback);

    //Now register the event information to respond to when a callback is received
    service_rest_tp_to_einfo[tp] = [ep, ename]

    //Start the request
net_q.push([4, "if_net_req", "GET", info.url, info.params, tp])
  

  }
  //////////////////////////////////////////////////

MODS = ['ui', 'event', 'net', 'segue', 'controller', 'debug'];
PLATFORM = 'CHROME';
function int_embed_surface(sp) {
}
//Event handler table
evt = {};

function int_event(ep, event_name, info) {
  var f = evt[ep];
  if (f != undefined) {
    f(ep, event_name, info);
  }
}

function reg_evt(ep, f) {
  evt[ep] = f;
}

function dereg_evt(ep) {
  delete evt[ep];
}

//Spec helpers
////////////////////////////////////////////////////////////////
function spec_event_handler(ep, event_name, info) {
main_q.push([3, "if_event", ep, event_name, info])
}
reg_evt(3848392, spec_event_handler);

function int_spec_event_dereg() {
  dereg_evt(3848392);
}
////////////////////////////////////////////////////////////////
function int_net_cb(tp, success, info) {
  //Re-increase
  ++net_q_rem;
  tel_deref(tp)(tp, success, info);
}

//Spec helpers
/////////////////////////////////////////////////////
function get_int_net_cb_spec() {
main_q.push([1, "get_int_net_cb_spec", int_net_cb_spec])
}

//Manually register pointer at special index for testing, int_net_cb
//will call this pointer under test conditions so it's a good test
//for bost telepathy and net
tel_reg_ptr(function(tp, a, b) { int_net_cb_spec = [tp, a, b] }, -3209284741);
/////////////////////////////////////////////////////
//Contains bottom view as key and a the values are also a hash
//that contains the 'top' thing
//{
//  'nav_container' =>
//    {
//      'nav_container' => 'name'
//    }
//}
int_segue_interceptors = {
}

//Contains an array 

//Register a segue intercept
//name - The name of the segue to be given if_segue_do
//from_view_name - The name of the bottom view to intercept
//to_view_name - The name of the top view to intercept

function reg(name, from_view_name, to_view_name) {
  //Create hash if it dosen't already exist
  int_segue_interceptors[from_view_name] = int_segue_interceptors[from_view_name] || {};
  int_segue_interceptors[from_view_name][to_view_name] = name;
}

//Will send the 'if' commands
function intercept_if_necessary(bottom_view_name, top_view_name, from_vp, to_vp) {
  console.log("Intercept if necessars")
  if (int_segue_interceptors[bottom_view_name] && int_segue_interceptors[bottom_view_name][top_view_name]) {
    var rez = int_segue_interceptors[bottom_view_name][top_view_name];

main_q.push([3, "if_segue_do", rez, from_vp, to_vp])
  }
}

reg("modal", "nav_container", "nav_container.detach");
reg("unmodal", "nav_container", "nav_container.attach");

//Debug stub
ctable = {
  
      root: {
        root_view: 'container',
        spots: ["main","content"],
        actions: {
          
              splash: {
                on_entry: function(__base__) {
                  //Controller information, includes action, etc. (controller_info)
                  var __info__ = tel_deref(__base__);

                  //The 'context' which is user-defined
                  var context = __info__.context;
                  var ptr = _embed("splash", __base__+1+1, {}, __base__);
            __info__.embeds.push(ptr);
                },
                handlers: {
                  
                }
              },
          
        },
      },
  
      splash: {
        root_view: 'splash',
        spots: ["main"],
        actions: {
          
              index: {
                on_entry: function(__base__) {
                  //Controller information, includes action, etc. (controller_info)
                  var __info__ = tel_deref(__base__);

                  //The 'context' which is user-defined
                  var context = __info__.context;
                  
                },
                handlers: {
                  
                }
              },
          
        },
      },
  
}
