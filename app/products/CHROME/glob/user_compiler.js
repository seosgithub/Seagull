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
