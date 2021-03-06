angular.module('app_entities', ['ngResource','repository.services'])

.controller('ctrl_entities', function($scope, repository, entity_repo, entity, entitydef, repo_tree, popupService, searchRepo, cloneRepo) {

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
  $scope.node_selected;


  $scope.pageFoundRepos = {}
  $scope.reposToClone = []


  $scope.repository_selected = {
      id: null,
      nombre: null,
  };

  $scope.entity_selected = {
      id: null,
      nombre: null,
      desripcion: null,
  };

  $scope.ConfirmDeleteCallback;
  $scope.wdnMode=0; /* 1=save, 2=update*/

  /*Instancia del arbol de la seccion de ENTITIES*/
  /*IMPORTANTE*/
  /* Para que el arbol permita manipular(create, rename, delete) los nodos check_callback debe ser true*/
  
    $("#jstree").jstree({
      // 'core':{check_callback : true},
        "core" : {
        "check_callback" : function (operation, node, node_parent, node_position, more) {
                // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
                // in case of 'rename_node' node_position is filled with the new node name                      
                              
                if(operation == 'move_node'){
                    return false;
                }   
                return true;
                
            }
    },
    "plugins" : [  "contextmenu","dnd" ],
    "contextmenu": {
        "items": function ($node) {

            console.log($node.li_attr['data-renderas'] );

            if($node.li_attr['data-renderas'] === 'repository')
                return {
                    "CreateTempl": {
                        "label": "Create Entity",
                        "separator_after": true,
                        "action": function (data) {

                          var inst = $.jstree.reference(data.reference),
                          obj = inst.get_node(data.reference);
                          $scope.node_selected = obj;
                          
                          $scope.repository_selected.nombre = obj.text;
                          $scope.repository_selected.id = obj.id;
                          $scope.new_entity($scope.repository_selected.id);
                          $scope.repo_selected = obj;
                          //Hago que la interfaz refresque el titulo con el valor de component_selected
                          //angular.element($("#ctrl_entities")).scope().$apply();                         

                        }
                        
                    },

                    "Rename": {
                        "label": "Edit Repository",                        
                        "action": function (data) {
                          console.log(data);
                          
                          var inst = $.jstree.reference(data.reference),
                          obj = inst.get_node(data.reference);
                          $scope.node_selected = obj;
                          
                          $scope.repository_selected.nombre = obj.text;
                          $scope.repository_selected.id = obj.id;
                          console.log($scope.repository_selected);
                          $scope.load_repository(obj.id);
                          //Hago que la interfaz refresque el titulo con el valor de component_selected
                          angular.element($("#ctrl_entities")).scope().$apply();
                          $('#repository-modal').modal('show').on('shown.bs.modal', function() {
                                            $('#repository-modal #id_nombre').focus();
                          });
                        }
                    },
                    "Delete": {
                        "label": "Delete Repository",
                        "action": function (data) {
                            var inst = $.jstree.reference(data.reference),
                            obj = inst.get_node(data.reference);
                            $scope.node_selected = obj;
                            
                            $scope.repository_selected.nombre = obj.text;
                            $scope.repository_selected.id = obj.id;
                            //$scope.new_template(obj.id);
                            $scope.node_item_selected = obj;
                            $scope.showConfirmDelete("Do you really want to delete <b>" + obj['text'] + "</b> repository?");
                            $scope.ConfirmDeleteCallback = function(){$scope.delete_repository( $scope.node_item_selected)};
                        }
                    },

                };
            else{
                return {
                    "CreateTempl": {
                        "label": "Edit Entity",
                        "separator_after": true,
                        "action": function (data) {

                          var inst = $.jstree.reference(data.reference),
                          obj = inst.get_node(data.reference);
                          $scope.node_selected = obj;
                          $scope.entity_selected.nombre = obj.li_attr['data-rendername'];
                          $scope.entity_selected.id = obj.li_attr['data-renderid'];
                          $scope.node_item_selected = obj;
                          $scope.load_entity($scope.entity_selected.id);                          
                          $scope.edit_entity($scope.entity_selected.id);
                
                          //Hago que la interfaz refresque el titulo con el valor de component_selected
                          //angular.element($("#ctrl_entities")).scope().$apply();                         

                        }
                        
                    },
                    "Delete": {
                        "label": "Delete Entity",
                        "action": function (data) {
                            var inst = $.jstree.reference(data.reference),
                            obj = inst.get_node(data.reference);
                            $scope.node_selected = obj;
                            
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
           $("#RepoDesc").html('Repository: ' + $scope.repo_selected.text);
           console.log(objParent);
             
        }
       
    });




  $scope.load_repositories = function(){
    showBusy();
    repo_tree.get({}, function(success){
                              
                            $('#jstree').jstree();
                            $('#jstree').jstree(true).settings.core.data = success.dirs;
                            $('#jstree').jstree(true).refresh();
                            hideBusy();                            
                        },function(error){                        
                            $scope.showMessage($scope.getDataError(error));
                            hideBusy();
                        });
  }

  $scope.load_entities = function(id_repositorio){
      showBusy();
      entity_repo.query({id_repositorio:id_repositorio}, function(success){
          $scope.repoEntities = success;
          hideBusy();
      },function(error){
        $scope.showMessage($scope.getDataError(error));
        hideBusy();
      });
  }


   
  $scope.load_entity = function(id_entity){
        showBusy();
        $scope.entity_selected.id = id_entity;
        $scope.GencoEntidadDefinicion = new entitydef();
        $scope.pk_fields = [];
        $scope.GencoEntidadDefinicion.id_entidad = id_entity;

        var data = entity.get({id_entidad:id_entity},function(success){
          $scope.GencoEntidad = data;
          $scope.entity_selected.nombre=data.nombre;
          $scope.entity_selected.descripcion=data.descripcion;

          entitydef.query({id_entidad:id_entity}, function(success){                
                $scope.GencoEntidadFields =success;
                hideBusy();
            },function(error){
                $scope.showMessage($scope.getDataError(error));
                hideBusy();
            });
          
        }          
        ,function(error){
          $scope.showMessage($scope.getDataError(error));
          hideBusy();
        });        

  } 


  $scope.greaterThan = function(prop, val){
      return function(item){
        return item[prop] > val;
      }
  }


  $scope.add_field = function(){
      showBusy();
      $scope.GencoEntidadDefinicion.id_entidad = $scope.entity_selected.id;

      console.log($scope.GencoEntidadDefinicion);

      if($scope.GencoEntidadDefinicion.es_pk!=undefined){
        $scope.GencoEntidadDefinicion.es_pk = $scope.GencoEntidadDefinicion.es_pk.toString();
      }        

      if($scope.GencoEntidadDefinicion.obligatorio!=undefined){
        $scope.GencoEntidadDefinicion.obligatorio = $scope.GencoEntidadDefinicion.obligatorio.toString();
      }      

      $scope.GencoEntidadDefinicion.$save(function(success){             
          $scope.load_entity($scope.entity_selected.id);
          $scope.GencoEntidadDefinicion = new entitydef(); 
          hideBusy();
      }, function(error){
          $scope.showMessage($scope.getDataError(error));
          hideBusy();
      });
      
  } 

  $scope.add_entity_ref = function(){
      if($scope.GencoEntidadDefinicion.entidad_ref==undefined || $scope.GencoEntidadDefinicion.entidad_ref==null){
        $scope.showMessage('Please, select a entity to link.');
        return;
      }
      showBusy();
      var ves_pk = 'false';

      if($scope.GencoEntidadDefinicion.es_pk!=undefined)
        ves_pk = $scope.GencoEntidadDefinicion.es_pk.toString();
      console.log($scope.GencoEntidadDefinicion.entidad_ref.nombre);
      conv = new entitydef({id_entidad: $scope.entity_selected.id, entidad_ref: $scope.GencoEntidadDefinicion.entidad_ref.id_entidad, nombre: $scope.GencoEntidadDefinicion.entidad_ref.nombre, id_tipodato: null, es_pk:ves_pk});


      conv.$save(
          function(success){
            $scope.load_entity($scope.entity_selected.id);
            $scope.GencoEntidadDefinicion = new entitydef(); 
            hideBusy();
          },function(error){
            $scope.showMessage($scope.getDataError(error)); 
            hideBusy();
      });
      
  } 


    $scope.saveOrUpdateRepo = function(){
        var mode = $scope.wdnMode;
        if(mode==1){
            $scope.save_repository();
        }else if(mode==2){
            $scope.update_repository();
        }
        
    } 

    $scope.new_repository = function(){
        $scope.wdnMode = 1;
        $scope.GencoRepositorio= new repository();
        $('#repository-modal').modal('show').on('shown.bs.modal', function() {
                                            $('#repository-modal #id_nombre').focus();
        });
    } 

    $scope.save_repository = function(){
        showBusy();
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
          $('#repository-modal').modal('hide');
          hideBusy();
        },function(error){
            $scope.showMessage($scope.getDataError(error));
            hideBusy();
        });
        
    } 

    $scope.delete_repository = function(node){
        showBusy();
        repository.delete({id_repositorio: $scope.repository_selected.id},function(success){          
            $('#jstree').jstree(true).delete_node(node); 
            hideBusy();
        },function(error){
            $scope.showMessage($scope.getDataError(error));
            hideBusy();
        });

    } 


    $scope.update_repository = function(){
        showBusy();
        $scope.GencoRepositorio.$update(function(success){
          $scope.renameTreeNode($scope.node_selected, success.nombre);        
          $('#repository-modal').modal('hide');
          hideBusy();
        },function(error){
            $scope.showMessage($scope.getDataError(error));
            hideBusy();
        });
        
    } 

    $scope.load_repository = function(id_repositorio){
        showBusy();
        $scope.wdnMode = 2;
        var data = repository.get({id_repositorio:id_repositorio},function(success){            
            $scope.GencoRepositorio = success;
            hideBusy();
        },function(error){
            $scope.showMessage($scope.getDataError(error));
            hideBusy();
        });
        
    }
 

    $scope.new_entity = function(id_repositorio){
        $scope.wdnMode = 1;
        $scope.GencoEntidad= new entity();
        $scope.GencoEntidad.id_repositorio = id_repositorio;
        angular.element($("#ctrl_entities")).scope().$apply();
        $('#entity-modal').modal('show').on('shown.bs.modal', function() {
            $('#entity-modal #id_nombre').focus();
        });
    }

    $scope.edit_entity = function(id_entity){
        showBusy();
        $scope.wdnMode = 2;
        entity.get({id_entidad:id_entity}, function(success){
            $scope.GencoEntidad = success;
            hideBusy();
        }, function(error){
            $scope.showMessage($scope.getDataError(error));
            hideBusy();
        });
        $('#entity-modal').modal('show').on('shown.bs.modal', function() {
            $('#entity-modal #id_nombre').focus();
        });
    }


    $scope.saveOrUpdateEntity = function(){
        var mode = $scope.wdnMode;
        if(mode==1){
            $scope.save_entity();
        }else if(mode==2){
            $scope.update_entity();
        }
        
    } 

    $scope.update_entity = function(){
        showBusy();
        $scope.GencoEntidad.$update(function(success){
          $scope.renameTreeNode($scope.node_selected, success.nombre);
          //$scope.load_repositories();
          $scope.entity_selected.nombre=success.nombre;
          $scope.entity_selected.descripcion=success.descripcion;
          $('#entity-modal').modal('hide');
          hideBusy();
        },function(error){
            $scope.showMessage($scope.getDataError(error));
            hideBusy();
        });
        
    } 

    $scope.save_entity = function(){
        showBusy();
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
            $scope.entity_selected.id = success.id_entidad;
            $scope.load_entity($scope.entity_selected.id);
            $("#RepoDesc").html('Repository: ' + $scope.repo_selected.text);
            hideBusy();
        },function(error){
            $scope.showMessage($scope.getDataError(error));
            hideBusy();
        }); 

        $('#entity-modal').modal('hide')
    }

    $scope.delete_entity = function(node){
        showBusy();
        entity.delete({id_entidad: $scope.entity_selected.id},function(success){
            $('#jstree').jstree(true).delete_node(node); 
            hideBusy();
        },function(error){
            $scope.showMessage($scope.getDataError(error));
            hideBusy();
        });
        
    } 


    $scope.get_pk_fields = function() {
        showBusy();
        var id_entity = $scope.GencoEntidadDefinicion.entidad_ref;
        entitydef.query({id_entidad:id_entity}, function(success){
            $scope.pk_fields =success;
            hideBusy();
        },function(error){
            $scope.showMessage($scope.getDataError(error));
            hideBusy();
        });
    };


    $scope.deleteField=function(fieldDefinition){
      $scope.field_selected = fieldDefinition;
      //$('#field-delete-modal').modal('show')
      $scope.showConfirmDelete("Do you really want to delete <b>" + fieldDefinition.nombre + "</b> field?");
      $scope.ConfirmDeleteCallback = function(){$scope.delete_field($scope.field_selected)}
    }

    $scope.delete_field=function(fieldDefinition){
      showBusy();
      var pos;

      entitydef.delete({id: $scope.field_selected.id_entidaddef},function(success){
        pos = $scope.GencoEntidadFields.map(function(x) {return x.id_entidaddef}).indexOf($scope.field_selected.id_entidaddef);
        //console.log($scope.GencoEntidadFields);
        if(pos>=0){
            $scope.GencoEntidadFields.splice(pos, 1);
            //console.log($scope.GencoEntidadFields);
            if(!$scope.$$phase) {
                $scope.$apply();
            }

        }
        hideBusy();

      },function(error){
          $scope.showMessage($scope.getDataError(error));
          hideBusy();
      });
    }


    $scope.editField=function(fieldDefinition){
      $scope.field_selected = fieldDefinition;
      $scope.GencoEntidadDefinicionEdit = fieldDefinition;
      $scope.GencoEntidadDefinicionEdit.id_tipodato = fieldDefinition.id_tipodato.toString();

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
      showBusy();
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
        
      $scope.GencoEntidadDefinicionEdit.$update({id:$scope.GencoEntidadDefinicionEdit.id_entidaddef},function(success){
        $('#field-edit-modal').modal('hide');
        hideBusy();
      }, function(error){
        $scope.showMessage($scope.getDataError(error));
        hideBusy();
      });
        
    } 


    $scope.cancel = function(){
        $scope.GencoRepositorio = $scope.tmpGencoRepositorio
        $('#entity-modal').modal('hide');
        $('#repository-modal').modal('hide');
        $('#field-delete-modal').modal('hide'); 
        $('#field-edit-modal').modal('hide');       
    } 

    /*
    Cloning repository 
    */
    $scope.searchRepos =  function(pagenum){
        
        var searchKey = $('#findRepoKey').val();
        //console.log(searchKey);

        if(searchKey.trim().length==0 || searchKey.trim()=='' || searchKey==undefined || searchKey==null){
            $scope.showMessage('Invalid text for search');            
            return;
        }

        showBusy();
        // var sl = new searchLangs({keysearch: searchKey, page:1})
        // console.log(sl);
        searchRepo.get({keysearch: searchKey, page:pagenum}, function(success){
            console.log(success.repos);
            $scope.setChecktoSearchRepos(success.langs);          
            $scope.pageFoundRepos = success;
            hideBusy();
            
        }, function(error){
            $scope.showMessage($scope.getDataError(error));
            hideBusy();
        });
    }


    $scope.addToCloneRepos = function(index){
        showBusy();
        var pos=0;

        pos = $scope.reposToClone.map(function(x) {return x.id_repositorio}).indexOf($scope.pageFoundRepos.repos[index].id_repositorio);


        if(pos>=0) {
            $scope.reposToClone.splice(pos,1);
        }else{
            $scope.reposToClone.push($scope.pageFoundRepos.repos[index]);
        } 

        showBusy();
        //console.log($scope.reposToClone);
         
    }


    $scope.setChecktoSearchRepos = function(repos){
        showBusy();
        var pos=0;

        angular.forEach($scope.reposToClone, function(value, key){

            pos = repos.map(function(x) {return x.id_repositorio}).indexOf(value.id_repositorio);

            if(pos>=0) {
                (repos[pos])['checked']=true;
            }    
            // }else{
            //     ($scope.pageFoundLangs.langs[pos])['checked']=false;
            // }  
        
        });
        hideBusy();
        return repos;
  
         
    }


    $scope.save_clone_repo = function(){
        
        if($scope.reposToClone.length<=0){
            $scope.showMessage('Please select a Lanaguage for clone');
            return;
        }

        var cloneRepos = '[' + $scope.reposToClone.map(function(x) {return x.id_repositorio}).toString() + ']'
        
        showBusy();
        clone = new cloneRepo({repos: cloneRepos});
        clone.$save(function(success){
            console.log(success);
            $scope.reposToClone = [];
            $scope.pageFoundRepos = {};
            $scope.load_repositories();
            // $scope.getLangTree();
            $('#repo-clone-modal').modal('hide')
            showBusy();
        }, function(error){
            $scope.showMessage($scope.getDataError(error));
            showBusy();
        });
         
    }

    /*
    * data: datos del nodo seleccionado que activa el menu, de esta se puede obtener el nodo seleccionado, y una instancia para 
            manipular el arbol.
    */

    $scope.renameTreeNode = function(node, newText){        
        $('#jstree').jstree('set_text', node, newText);         
    }

    $scope.addTreeNode = function(node, newNode, jsTree){
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

    $scope.getDataError = function(error){
       if(error.data['detail']!=null){
        return error.data['detail'];
       } if(error.data!=null){

            var resp='';

            if (error.data instanceof Array || error.data instanceof Object) {
                angular.forEach(error.data, function(value, key){        
                    resp += key + ' - ' + value + '<br/>';
                });
            }else{

                resp = error.data;
            }
                        
            return resp;
       }
    }
    /*
    Inicializamos el UI
    */
    $scope.load_repositories();


  });

angular.module('app_entities').config(function($httpProvider){

    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

})

