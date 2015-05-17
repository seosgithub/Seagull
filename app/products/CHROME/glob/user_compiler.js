ctable = {
  
      hierarchy: {
        root_view: 'hierarchy',
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
  
      root: {
        root_view: 'container_split',
        spots: ["main","content","sidebar"],
        actions: {
          
              splash: {
                on_entry: function(__base__) {
                  //Controller information, includes action, etc. (controller_info)
                  var __info__ = tel_deref(__base__);

                  //The 'context' which is user-defined
                  var context = __info__.context;
                  var ptr = _embed("rotate", __base__+1+1, {}, __base__);
            __info__.embeds.push(ptr);
          

            var ptr = _embed("hierarchy", __base__+2+1, {}, __base__);
            __info__.embeds.push(ptr);
                },
                handlers: {
                  
                }
              },
          
        },
      },
  
      rotate: {
        root_view: 'rotate',
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
                  var info = {
        url: "http://localhost:3000/search",
        params: {},
      }

            service_rest_req(info, __base__, "search_res");
                },
                handlers: {
                  
                    search_res: function(__base__, params) {
                      var __info__ = tel_deref(__base__);
                      var context = __info__.context;

                      
      var info = {name: params.info[0].name};

           main_q.push([3, "if_event", __base__, "found", info])
              

                    },
                  
                }
              },
          
        },
      },
  
}
