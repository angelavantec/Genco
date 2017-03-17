angular.module('app_entities', ['ngResource','repository.services'])

.controller('ctrl_entities', function($scope, repository, entity_repo, entity, entitydef, repo_tree, popupService) {

  $scope.fields = [];
  $scope.repositories = [];
  $scope.GencoRepositorio;
  $scope.nodeRepository = [];
  $scope.entity_selected;
  $scope.repo_selected;
  $scope.GencoEntidad = [];
  $scope.GencoEntidadDefinicion = new entitydef();
  $scope.GencoEntidadDefinicionEdit = new entitydef();
  $scope.GencoEntidadFields = [];
  $scope.pk_fields = [];
  $scope.field_selected;
  $scope.repoEntities = [];


  $scope.repository_selected = {
      id: null,
      nombre: null,
  };

  $scope.entity_selected = {
      id: null,
      nombre: null,
  };

  /*Instancia del arbol de la seccion de ENTITIES*/
  /*IMPORTANTE*/
  /* Para que el arbol permita manipular(create, rename, delete) los nodos check_callback debe ser true*/
  
    $("#jstree").jstree({
      'core':{check_callback : true},
    //     "core" : {
    //     "check_callback" : function (operation, node, node_parent, node_position, more) {
    //             // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
    //             // in case of 'rename_node' node_position is filled with the new node name                      
                

    //             var validator;

    //             if(node_parent==null || typeof node_parent.li_attr == 'undefined'){
    //                 return false;
    //             }
                    
    //             console.log(node_parent);
    //             var renderas = node_parent.li_attr['data-renderas'];

    //             if(typeof renderas == 'undefined'){
    //                 return false;
    //             }
                    
    //             validator = renderas === 'repository' ? true : false;    
    //             if(validator && operation == 'move_node'){

    //                 validator = node.li_attr['data-renderas'] === 'archive' ? true : false; 

    //             }   
    //             return validator;
                
    //         }
    // },
    "plugins" : [  "contextmenu","dnd" ],
    "contextmenu": {
        "items": function ($node) {

            console.log($node.li_attr['data-renderas'] );

            if($node.li_attr['data-renderas'] === 'repository')
                return {

                    "Rename": {
                        "label": "Edit Repository",
                        "action": function (data) {
                          console.log(data);
                          
                          var inst = $.jstree.reference(data.reference),
                          obj = inst.get_node(data.reference);
                          //inst.edit(obj);
                          
                          $scope.repository_selected.nombre = obj.text;
                          $scope.repository_selected.id = obj.id;
                          console.log($scope.repository_selected);
                          $scope.load_repository(obj.id);
                          //Hago que la interfaz refresque el titulo con el valor de component_selected
                          angular.element($("#ctrl_entities")).scope().$apply();
                          $('#repository-edit-modal').modal('show');
                        }
                    },
                    "Delete": {
                        "label": "Delete Repository",
                        "action": function (data) {
                            var inst = $.jstree.reference(data.reference),
                            obj = inst.get_node(data.reference);
                            //inst.edit(obj);
                            
                            $scope.repository_selected.nombre = obj.text;
                            $scope.repository_selected.id = obj.id;
                            //$scope.new_template(obj.id);
                            $scope.node_item_selected = obj;
                            $scope.showConfirmDelete("Do you really want to delete <b>" + obj['text'] + "</b> repository?");
                            $scope.ConfirmDeleteCallback = function(){$scope.delete_repository( $scope.node_item_selected)};
                        }
                    },
                    "CreateTempl": {
                        "label": "Create Entity",
                        "action": function (data) {

                          var inst = $.jstree.reference(data.reference),
                          obj = inst.get_node(data.reference);
                          //inst.edit(obj);
                          
                          $scope.repository_selected.nombre = obj.text;
                          $scope.repository_selected.id = obj.id;
                          $scope.new_entity($scope.repository_selected.id);
                          $scope.repo_selected = obj;
                          //Hago que la interfaz refresque el titulo con el valor de component_selected
                          //angular.element($("#ctrl_entities")).scope().$apply();                         

                        }
                        
                    },
                };
            else{
                return {

                    "Delete": {
                        "label": "Delete Entity",
                        "action": function (data) {
                            var inst = $.jstree.reference(data.reference),
                            obj = inst.get_node(data.reference);
                            //inst.edit(obj);
                            
                            $scope.entity_selected.nombre = obj.li_attr['data-rendername'];
                            $scope.entity_selected.id = obj.li_attr['data-renderid'];
                            $scope.node_item_selected = obj;
                            $scope.showConfirmDelete("Do you really want to delete <b>" + obj['text'] + "</b> entity?");
                            $scope.ConfirmDeleteCallback = function(){$scope.delete_entity($scope.node_item_selected)};
                            //$scope.new_template(obj.id);
                            //angular.element($("#ctrl_entities")).scope().$apply();
                            //$('#entity-delete-modal').modal('show');
                        }
                    }
                };
            }

        }
    }
    });

   $('#jstree').bind("dblclick.jstree", function (e) {
        e.preventDefault();
        var tree = $(this).jstree(); 
        var obj = tree.get_node(e.target); 
        var objParent = tree.get_node(''+obj.parent);

        var renderas =obj.li_attr['data-renderas'];

        if(renderas === 'entity'){
           $scope.entity_selected.id = obj.li_attr['data-renderid'];
           $scope.node_item_selected = obj;         
           $scope.load_entity($scope.entity_selected.id);

           if($scope.repo_selected == undefined || $scope.repo_selected == null ){
              $scope.load_entities(objParent.id);
           }else if($scope.repo_selected.id != objParent.id){
              $scope.load_entities(objParent.id);
           }
           $scope.repo_selected = objParent;
             
        }
       
    });




  $scope.load_repositories = function(){
    repo_tree.get({}, function(success){
                            
                            console.log('success');    
                            $('#jstree').jstree();
                            $('#jstree').jstree(true).settings.core.data = success.dirs;
                            $('#jstree').jstree(true).refresh();
                                                        
                        },function(error){                        
                            console.log('ERR');
                            console.log(error);  
                        });
  }

  $scope.load_entities = function(id_repositorio){
      entity_repo.query({id_repositorio:id_repositorio}, function(success){
          $scope.repoEntities = success;
      },function(error){
      });
  }


  // $scope.createTreeModel = function(){
  //   counter = 0;
  //   idRow = 0;
  //   // proccess = [];
  //   //$scope.nodeRepository = [];
  //   angular.forEach($scope.repositories, function(value, key){

  //     // if(counter == 0 || counter%2==0){
  //     if(counter == 0 ){
  //       idRow++;
  //       $( "#rndr" ).append( "<div id='row_"+ idRow +"'  style='margin-bottom: 20px; width: 90%'>");
                
  //     }
  //     //counter++;    
      
  //     $( "#row_"+idRow ).append("<div><div id='repo_"+ value.id_repositorio +"'></div></div>" );  
      
  //     // proccess.push(1);
  //     entity_repo.query({id_repositorio:value.id_repositorio}, function(success){
  //         // proccess.pop();
  //         add_entities(null, value, success);
  //     },function(error){
  //         // proccess.pop();
  //         add_entities(null, value, null);  
  //     });

  //   });



  // }

// function add_entities(proccess, repository, entidades){
    
//     var nodeEntidades=[];
//     $scope.nodeRepository=[];
    
//     if(entidades != null){

//         angular.forEach(entidades, function(value, key){    
//             nodeEntidades.push({'parent': repository.id_repositorio, 'text':value.nombre, 'icon':"glyphicon glyphicon-list-alt", 'li_attr':{'data-renderas':'archive', 'data-renderid': value.id_entidad}});

//         });

//       $scope.nodeRepository.push({'id': repository.id_repositorio,'text':repository.nombre, 'icon':"/static/gencoui/img/rndr/metadata18.png", 'children':nodeEntidades, 'li_attr':{'data-renderas':'repository'}});
//       console.log(nodeEntidades);

//     }

//           //$.jstree.defaults._themes = "default-dark";
//       $("#repo_" + repository.id_repositorio).jstree('destroy');
//       $scope.load("#repo_" + repository.id_repositorio);
//       $('#repo_'+repository.id_repositorio).jstree(true).settings.core.data = $scope.nodeRepository;
//       $('#repo_'+repository.id_repositorio).jstree(true).refresh();


//         // $("#jstree").jstree('destroy');
//         // $scope.load();
//         // $('#jstree').jstree(true).settings.core.data = $scope.nodeComponente;
//         // $('#jstree').jstree(true).refresh();


// }


// $scope.loadx = function(id_repositorio){


//   //angular.forEach($scope.repositories, function(value, key){

//     $(id_repositorio).jstree({
//         "core" : {
//         "check_callback" : function (operation, node, node_parent, node_position, more) {
//                 // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
//                 // in case of 'rename_node' node_position is filled with the new node name                      
                

//                 var validator;

//                 if(node_parent==null || typeof node_parent.li_attr == 'undefined'){
//                     return false;
//                 }
                    
//                 console.log(node_parent);
//                 var renderas = node_parent.li_attr['data-renderas'];

//                 if(typeof renderas == 'undefined'){
//                     return false;
//                 }
                    
//                 validator = renderas === 'repository' ? true : false;    
//                 if(validator && operation == 'move_node'){

//                     validator = node.li_attr['data-renderas'] === 'archive' ? true : false; 

//                 }   
//                 return validator;
                
//             }
//     },
//     "plugins" : [  "contextmenu","dnd" ],
//     "contextmenu": {
//         "items": function ($node) {

//             console.log($node.li_attr['data-renderas'] );

//             if($node.li_attr['data-renderas'] === 'repository')
//                 return {

//                     "Rename": {
//                         "label": "Edit Repository",
//                         "action": function (data) {
//                           console.log(data);
                          
//                           var inst = $.jstree.reference(data.reference),
//                           obj = inst.get_node(data.reference);
//                           //inst.edit(obj);
                          
//                           $scope.repository_selected.nombre = obj.text;
//                           $scope.repository_selected.id = obj.id;
//                           console.log($scope.repository_selected);
//                           $scope.load_repository(obj.id);
//                           //Hago que la interfaz refresque el titulo con el valor de component_selected
//                           angular.element($("#ctrl_entities")).scope().$apply();
//                           $('#repository-edit-modal').modal('show');
//                         }
//                     },
//                     "Delete": {
//                         "label": "Delete Repository",
//                         "action": function (data) {
//                             var inst = $.jstree.reference(data.reference),
//                             obj = inst.get_node(data.reference);
                                    
//                             $scope.repository_selected.nombre = obj.text;
//                             $scope.repository_selected.id = obj.id;
                           
//                             //angular.element($("#ctrl_entities")).scope().$apply();
//                             //$('#repository-delete-modal').modal('show');
//                             $scope.node_item_selected = obj;
//                                     $scope.showConfirmDelete("Do you really want to delete " + obj['text'] + " Repository?");
//                                     $scope.ConfirmDeleteCallback = function(){$scope.delete_repository()};
//                         }
//                     },
//                     "CreateTempl": {
//                         "label": "Create Entity",
//                         "action": function (data) {

//                           var inst = $.jstree.reference(data.reference),
//                           obj = inst.get_node(data.reference);
                          
//                           $scope.repository_selected.nombre = obj.text;
//                           $scope.repository_selected.id = obj.id;
//                           $scope.new_entity($scope.repository_selected.id);
//                           //Hago que la interfaz refresque el titulo con el valor de component_selected
//                           angular.element($("#ctrl_entities")).scope().$apply();
//                           $('#entity-create-modal').modal('show');

//                         }
                        
//                     },
//                 };
//             else{
//                 return {

//           //           "Open": {
//           //               "label": "Open Template",
//           //               "action": function (data) {
//           //                  // this.rename(obj);
//           //                   //$('#template-edit-modal').modal('show')
//           //                   console.log('open');
//           // //                    var inst = $.jstree.reference(data.reference),
//           //                   // obj = inst.get_node(data.reference);
//           //                   // inst.edit(obj);
//           //                   // console.log(data);
//           //               }
//           //           },
//           //           "Rename": {
//           //               "label": "Edit Template",
//           //               "action": function (data) {
//           //                  // this.rename(obj);
//           //                   $('#template-edit-modal').modal('show')
//           //                   console.log(data);
//           // //                    var inst = $.jstree.reference(data.reference),
//           //                   // obj = inst.get_node(data.reference);
//           //                   // inst.edit(obj);
//           //                   // console.log(data);
//           //               }
//           //           },
//                     "Delete": {
//                         "label": "Delete Entity",
//                         "action": function (data) {
//                             var inst = $.jstree.reference(data.reference),
//                             obj = inst.get_node(data.reference);
//                             //inst.edit(obj);
                            
//                             $scope.entity_selected.nombre = obj.li_attr['data-rendername'];
//                             $scope.entity_selected.id = obj.li_attr['data-renderid'];
//                             //$scope.new_template(obj.id);
//                             angular.element($("#ctrl_entities")).scope().$apply();
//                             $('#entity-delete-modal').modal('show');
//                         }
//                     }
//                 };
//             }

//         }
//     }
//     });


//     $.jstree.defaults.core.dblclick_toggle = false;

//     $(id_repositorio).bind("dblclick.jstree", function (event) {
//         event.preventDefault();
//         console.log('ress'); 
//         var node = $(event.target).closest("li");
//        // var data = node.data;

//         var renderas =node.data("renderas");
//         var id =node.data("renderid");
//        // Do my action
       
//         if(renderas === 'archive'){
//          console.log(node.text()); 
//          $scope.load_entity(id.toString());
//         }
       
//     });

//   //});

// }


  

  //   $scope.langs = [];
  //   $scope.envs=env.query(
  //                   function(success){
  //                       if($scope.envs.length>0){
  //                           $scope.selectedTab = 0;
  //                           $scope.load_env($scope.envs[0].id_entorno);
  //                       }    
  //                   },function(error){
  //                       console.log('ERR');
  //                       console.log(error);  
  //   });
  //   $scope.GencoEntorno = new env();
  //   $scope.tmpGencoEntorno;
  //   $scope.descripcion = '';
  //   $scope.nombre = '';

  //   $scope.all_langs=lang.query();

   
    $scope.load_entity = function(id_entity){
        $scope.entity_selected.id = id_entity;

        $scope.GencoEntidadDefinicion = new entitydef();
        $scope.pk_fields = [];
        $scope.GencoEntidadDefinicion.id_entidad = id_entity;
        var data = entity.get({id_entidad:id_entity});
        $scope.GencoEntidad = data;
        data.$promise.then(function(data){
            
            entitydef.query({id_entidad:id_entity}, function(success){
                // proccess.pop();
                $scope.GencoEntidadFields =success;
            },function(error){
                // proccess.pop();
                console.log(error);
            });

        });

    } 


  $scope.greaterThan = function(prop, val){
      return function(item){
        return item[prop] > val;
      }
  }


  $scope.add_field = function(){
     
      $scope.GencoEntidadDefinicion.id_entidad = $scope.entity_selected.id;

      console.log($scope.GencoEntidadDefinicion);

      if($scope.GencoEntidadDefinicion.es_pk!=undefined){
        $scope.GencoEntidadDefinicion.es_pk = $scope.GencoEntidadDefinicion.es_pk.toString();
      }        

      if($scope.GencoEntidadDefinicion.obligatorio!=undefined){
        $scope.GencoEntidadDefinicion.obligatorio = $scope.GencoEntidadDefinicion.obligatorio.toString();
      }      

      $scope.GencoEntidadDefinicion.$save(function(success){   
          // $scope.envs=env.query();    
          //$scope.load_repositories();
          $scope.load_entity($scope.entity_selected.id);
          $scope.GencoEntidadDefinicion = new entitydef(); 
          //$('#repository-add-modal').modal('hide')
      }, function(error){
          console.log(error);
      });
      
  } 

  $scope.add_entity_ref = function(){

    // $scope.GencoEntidadDefinicion.id_entidad = $scope.entity_selected;

    // console.log($scope.GencoEntidadDefinicion);

      // $scope.GencoEntidadDefinicion.nombre = $scope.GencoEntidadDefinicion.entidad_ref;
      // $scope.GencoEntidadDefinicion.id_tipodato = '1';
      var ves_pk = 'false';

      if($scope.GencoEntidadDefinicion.es_pk!=undefined)
        ves_pk = $scope.GencoEntidadDefinicion.es_pk.toString();

      conv = new entitydef({id_entidad: $scope.entity_selected.id, entidad_ref: $scope.GencoEntidadDefinicion.entidad_ref, nombre: $scope.GencoEntidadDefinicion.entidad_ref, id_tipodato: 1, es_pk:ves_pk});


      conv.$save(
          function(success){
          console.log('OK');
          $scope.load_entity($scope.entity_selected.id);
          $scope.GencoEntidadDefinicion = new entitydef(); 
          },function(error){
          console.log('ERR');
          console.log(error);  
      });  



      // if($scope.GencoEntidadDefinicion.es_pk!=undefined)
      //   $scope.GencoEntidadDefinicion.es_pk = $scope.GencoEntidadDefinicion.es_pk.toString();

      // $scope.GencoEntidadDefinicion.$save(function(){   
      //     // $scope.envs=env.query();    
      //     //$scope.load_repositories();
      //     $scope.load_entity($scope.entity_selected);
      //     $scope.GencoEntidadDefinicion = new entitydef(); 
      //     //$('#repository-add-modal').modal('hide')
      // }, function(error){
      //     console.log(error);
      // });
      
  } 



    $scope.new_repository = function(){

        $scope.GencoRepositorio= new repository(); 
    } 

    $scope.save_repository = function(){

        $scope.GencoRepositorio.$save(function(success){   
          console.log(success);
          var nodeDef = {'id': success.id_repositorio, 
                          'parent': '#', 
                          'text': success.nombre, 
                          'icon':"glyphicon glyphicon-folder-open", 
                          'li_attr':{'data-renderas':"repository",
                                      'data-renderid': success.id_repositorio, 
                                      'data-rendername':success.nombre
                                  }
                      }

          $scope.addTreeNode($('#jstree').jstree(true).get_node('#'), nodeDef, $('#jstree').jstree(true));
          $('#repository-create-modal').modal('hide');
        },function(error){
            $scope.showMessage(parseErrorMessage(error));
        });
        
    } 

    $scope.delete_repository = function(node){

        repository.delete({id_repositorio: $scope.repository_selected.id},function(success){
            console.log(success);           
            $('#jstree').jstree(true).delete_node(node); 
        },function(error){
            $scope.showMessage(parseErrorMessage(error));
        });

    } 


    $scope.update_repository = function(){

        $scope.GencoRepositorio.$update(function(){
        $scope.load_repositories();   
          $('#repository-edit-modal').modal('hide');
        });
        
    } 

    $scope.load_repository = function(id_repositorio){

        console.log(id_repositorio);
        var data = repository.get({id_repositorio:id_repositorio});
        $scope.GencoRepositorio = data;
 
    }
 


    $scope.new_entity = function(id_repositorio){

        $scope.GencoEntidad= new entity();
        $scope.GencoEntidad.id_repositorio = id_repositorio;
        angular.element($("#ctrl_entities")).scope().$apply();
        $('#entity-create-modal').modal('show');

    } 

    $scope.save_entity = function(){

        $scope.GencoEntidad.$save(function(success){
            console.log(success);
            var nodeDef = {'id': 'entity' + success.id_entidad, 
                            'parent': success.id_repositorio, 
                            'text': success.nombre, 
                            'icon':"glyphicon glyphicon-file", 
                            'li_attr':{'data-renderas':"entity",
                                        'data-renderid': success.id_entidad, 
                                        'data-rendername':success.nombre
                                    }
                        }
            $scope.addTreeNode($scope.repository_selected, nodeDef, $('#jstree').jstree(true));
            $scope.load_entities($scope.repo_selected.id);
        },function(error){
            $scope.showMessage(parseErrorMessage(error));
        }); 

        $('#entity-create-modal').modal('hide')
    }

    $scope.delete_entity = function(node){

        entity.delete({id_entidad: $scope.entity_selected.id},function(success){
            console.log(success)
            $('#jstree').jstree(true).delete_node(node);
            $('#jstree').jstree(true).delete_node(node); 
        },function(error){
            $scope.showMessage(parseErrorMessage(error));
        });
        
    } 



  //   $scope.edit = function(){
  //       $scope.tmpGencoEntorno =  $scope.GencoEntorno;
  //       $scope.GencoEntorno.id_grupo = $scope.GencoEntorno.id_grupo.toString(); 
  //   }



  //   $scope.all_lang_init = function(){
  //       console.log($scope.all_langs.map(function(x){return false;}));
  //       $scope.lang_added=$scope.all_langs.map(function(x){return false;});
  //   }


  //   $scope.save_add_lang = function(){
        
  //       console.log($scope.lang_added);

  //       index = 0;
  //       //total = $scope.lang_added.length;
  //       proccess = [];

  //       //console.log($scope.conversionsObj);
  //       //console.log($scope.types);

  //       angular.forEach($scope.lang_added, function(value, key){

  //           if(value){
  //               console.log($scope.all_langs[key]);
  //               //send_add_lang($scope.all_langs[key].id_lenguaje,'POST', index, total, $scope.GencoEntorno.id_entorno, $scope.load_env);
  //               proccess.push(1);
  //               conv = new env_lang({id_entorno: $scope.GencoEntorno.id_entorno, id_lenguaje: $scope.all_langs[key].id_lenguaje});
  //               console.log(conv);
  //               conv.$save(
  //                   function(success){
  //                   console.log('OK');
  //                   console.log(success.data); //wait_conversion();
  //                   proccess.pop();
  //                   add_lang_validator(proccess, $scope.GencoEntorno.id_entorno, $scope.load_env);
  //                   },function(error){
  //                   console.log('ERR');
  //                   console.log(error.data); 
  //                   proccess.pop();
  //                   add_lang_validator(proccess, $scope.GencoEntorno.id_entorno, $scope.load_env);  
  //               }); 
  //           }else{
  //               //console.log('DEL');
  //               //send_add_lang(null,'NA', index, total, null, $scope.load_env);
  //               proccess.push(1);
  //               conv = new env_lang({id_entorno: $scope.GencoEntorno.id_entorno, id_lenguaje: $scope.all_langs[key].id_lenguaje});
  //               conv.$delete(
  //                   function(success){
  //                       console.log('OK');
  //                       console.log(success); //wait_conversion();
  //                       proccess.pop();
  //                       add_lang_validator(proccess, $scope.GencoEntorno.id_entorno, $scope.load_env);
  //                   },function(error){
  //                       console.log('ERR');
  //                       console.log(error);  
  //                       proccess.pop();  
  //                       add_lang_validator(proccess, $scope.GencoEntorno.id_entorno, $scope.load_env);
  //               });
  //           }    
               

  //           index++;

  //       })

        
  //   }




  //   function add_lang_validator(proccess, id_env, callback){
        
  //       console.log("longitud " +proccess.length);
  //       //setTimeout(function() { }, 5000);

  //       if(proccess.length<=0){
  //           console.log('reload');
  //           callback(id_env);
  //           $('#lang-add-modal').modal('hide');

  //       }

  //   }


    $scope.get_pk_fields = function() {
        console.log('snipet');
        var id_entity = $scope.GencoEntidadDefinicion.entidad_ref;
        entitydef.query({id_entidad:id_entity}, function(success){
            // proccess.pop();
            $scope.pk_fields =success;
        },function(error){
            // proccess.pop();
            console.log(error);
        });
    };


    $scope.deleteField=function(fieldDefinition){
      $scope.field_selected = fieldDefinition;
      $('#field-delete-modal').modal('show')
    }

    $scope.delete_field=function(fieldDefinition){
      var pos;

            //if(popupService.showPopup('Really delete this? \n' + fieldDefinition.id_entidaddef + '-' + fieldDefinition.nombre)){
                entitydef.delete({id: $scope.field_selected.id_entidaddef},function(){
                  pos = $scope.GencoEntidadFields.map(function(x) {return x.id_entidaddef}).indexOf($scope.field_selected.id_entidaddef);
                  console.log($scope.GencoEntidadFields);
                  if(pos>=0){
                      $scope.GencoEntidadFields.splice(pos, 1);
                      console.log($scope.GencoEntidadFields);
                      if(!$scope.$$phase) {
                          $scope.$apply();
                      }

                  }

                  $('#field-delete-modal').modal('hide');

                },function(error){
                  // proccess.pop();
                  console.log(error);
                });
            //}
    }


    $scope.editField=function(fieldDefinition){
      $scope.field_selected = fieldDefinition;
      $scope.GencoEntidadDefinicionEdit = fieldDefinition;
      $scope.GencoEntidadDefinicionEdit.id_tipodato = fieldDefinition.id_tipodato.toString();

      console.log($scope.GencoEntidadDefinicionEdit.es_pk);
      console.log($scope.GencoEntidadDefinicionEdit.obligatorio);
      

      if ($scope.GencoEntidadDefinicionEdit.es_pk != null && $scope.GencoEntidadDefinicionEdit.es_pk.toUpperCase() == 'TRUE'){
        $("#edit_es_pk").prop('checked', true);
      }else{
        $("#edit_es_pk").prop('checked', false);
      }
        
      if ($scope.GencoEntidadDefinicionEdit.obligatorio != null && $scope.GencoEntidadDefinicionEdit.obligatorio.toUpperCase() == 'TRUE'){
        $("#edit_obligatorio").prop('checked', true);
      }else{
        $("#edit_obligatorio").prop('checked', false);
      }
        
    }

    $scope.update_field = function(){

      console.log($scope.GencoEntidadDefinicionEdit);

      if ($("#edit_es_pk").prop('checked')){
        $scope.GencoEntidadDefinicionEdit.es_pk = 'True';
      }else{
        $scope.GencoEntidadDefinicionEdit.es_pk = 'False';
      }
        

      if($("#edit_obligatorio").prop('checked')){
        $scope.GencoEntidadDefinicionEdit.obligatorio = 'True';
      }else{
        $scope.GencoEntidadDefinicionEdit.obligatorio = 'False';
      }
        
      $scope.GencoEntidadDefinicionEdit.$update({id:$scope.GencoEntidadDefinicionEdit.id_entidaddef},function(){
      //$scope.load_repositories();   
        $('#field-edit-modal').modal('hide');
      });
        
    } 


    $scope.cancel = function(){
        $scope.GencoRepositorio = $scope.tmpGencoRepositorio
        $('#entity-create-modal').modal('hide');
        $('#entity-edit-modal').modal('hide');
        $('#repository-create-modal').modal('hide');
        $('#repository-edit-modal').modal('hide');
        $('#entity-delete-modal').modal('hide');
        $('#repository-delete-modal').modal('hide'); 
        $('#field-delete-modal').modal('hide'); 
        $('#field-edit-modal').modal('hide');       
    } 


    /*
    * data: datos del nodo seleccionado que activa el menu, de esta se puede obtener el nodo seleccionado, y una instancia para 
            manipular el arbol.
    */
    $scope.addTreeNode = function(node, newNode, jsTree){
        console.log('agregor');
        jsTree.create_node(node.id,newNode);                    
    }

    $scope.showMessage = function(message){
      $('#imConfirm').html(message);
      $('#info-modal').modal('show');
    }

    $scope.showConfirmDelete = function(message){
        $('#tedmConfirm').html(message);
        $('#confirm-delete-modal').modal('show');
    }

    $scope.confirm_delete = function(){
        $('#confirm-delete-modal').modal('hide');
       $scope.ConfirmDeleteCallback();
    }

    function parseErrorMessage(error){
      var obj;
      var message;

      obj = error.data;

      
      console.log(obj);
      
         for (var key in obj) {
           //if (obj.hasOwnProperty(key)) {
              if(Array.isArray(obj[key])){
                message += '<br>' + obj[key][0];
              }else{
                return obj[key];
              } 
           //}
          }
        return message;    

    }
    /*
    Inicializamos el UI
    */
    $scope.load_repositories();


  });

angular.module('app_entities').config(function($httpProvider){

    $httpProvider.defaults.headers.common['Authorization'] = 'Basic YWRtaW46YWRtaW4=';
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    // $httpProvider.defaults.headers.common['Authorization'] = 'Basic YWRtaW46YWRtaW4=';
    // $httpProvider.defaults.withCredentials = true;
    // delete $httpProvider.defaults.headers.common['X-Requested-With'];

})

