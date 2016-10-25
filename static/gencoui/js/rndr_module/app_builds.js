angular.module('app_editor', ['ngResource','editor.services','lang.services','builds.services','repository.services'])

.controller('ctrl_editor', function($scope, $http, componente_env, componente, plantillas, plantillas_comp, template, lang, directorioelemento, tree, directorio, archivo, fileUpload, repository, entity_repo, entitydef) {

//editors = [];
$scope.environment_selected = $("#key_module").val();
$scope.project_selected = $("#key_project").val();
$scope.node_selected;
console.log($scope.environment_selected);
$scope.components = [];


$scope.itr_plantillas=0;
$scope.treeModel = [];
$scope.nodeComponente=[];
$scope.component_selected = {
    id: null,
    nombre: null,
};

$scope.template_selected = {
    id: null,
    nombre: null,
};

$scope.repository_selected = {
    data: null,
};

$scope.entity_selected = {
    data: null,
};
$scope.entities_selects = '';

$scope.entity_added;

$scope.GencoPlantillas;
$scope.GencoComponentes;
$scope.GencoDirectorios = new directorio();
$scope.GencoArchivos = new archivo();
$scope.repositories = [];



$scope.langs = [];
$scope.langs=lang.query();

$scope.all_repository=repository.query();
$scope.all_entities=[];
$scope.GencoRepositorioEntidad;


$scope.GencoEntidadDefinicion = new entitydef();
$scope.GencoEntidadFields = [];

$scope.all_references=[];



$scope.globalMessage = 'NA';

$scope.dataLang = {
    repeatSelectLang: null,
    availableOptions: $scope.langs,
};

setListenterContent();

$("#jstreeFolders").jstree({
    "core" : {
                "check_callback" : function (operation, node, node_parent, node_position, more) {
                        // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
                        // in case of 'rename_node' node_position is filled with the new node name                      
                        if (more) {
                            if (more.is_multi) {
                                more.origin.settings.dnd.always_copy = true;
                            } else {
                                more.origin.settings.dnd.always_copy = false;
                            }
                        }

                        var validator;

                        if(node_parent==null || typeof node_parent.li_attr == 'undefined'){
                            return false;
                        }
                            
                        //console.log(node_parent);
                        var renderas = node_parent.li_attr['data-renderas'];

                        if(typeof renderas == 'undefined'){
                            return false;
                        }
                      
                        validator = renderas === 'component' ? true : false;    
                        if(validator && operation == 'move_node'){

                            validator = node.li_attr['data-renderas'] === 'archive' ? true : false; 

                        }   
                        return validator;
                        
                    }
            },
    "types": {
            "file" : {
                "icon" : "glyphicon glyphicon-file"
            },
            "default" : {
                "icon" : "glyphicon glyphicon-folder-open"
            }

    },        
    "crrm": {
        "move": {
            "always_copy": true
        }
    },
    "plugins" : [ "contextmenu", "sort", "dnd", "types", "crrm" ],
            "contextmenu": {
                "items": function ($node) {

                    console.log($node.li_attr['data-renderas'] );

                    if($node.li_attr['data-renderas'] === 'template')
                        return {

                            "Rename": {
                                "label": "Select Entities",
                                "action": function (data) {
                                   // this.rename(obj);
                                    console.log(data);
                                    
                                    var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                    //inst.edit(obj);
                                    
                                    //$scope.component_selected.nombre = obj.text;
                                    //$scope.component_selected.id = obj.id;
                                    //console.log($scope.component_selected);
                                    if($scope.repository_selected.data == null || $scope.repository_selected.data == undefined){
                                        $scope.globalMessage = "No repository selected";
                                        angular.element($("#ctrl_editor")).scope().$apply();
                                        console.log($scope.globalMessage);
                                        $('#info-modal').modal('show');      
                                        return;                                  
                                    }
                                    
                                    
                                    $scope.template_entities_load(obj.id);


                                    
                                    //Hago que la interfaz refresque el titulo con el valor de component_selected
                                    //angular.element($("#ctrl_editor")).scope().$apply();
                                    //$('#component-edit-modal').modal('show');
        
                                }
                            },
                            "Delete": {
                                "label": "Detach Template",
                                "action": function (data) {
                                   // this.rename(obj);
                                    console.log(data);
                                    
                                    var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                    //inst.edit(obj);
                                    console.log(obj);
                                    // $scope.component_selected.nombre = obj.text;
                                    // $scope.component_selected.id = obj.id;
                                    // console.log($scope.component_selected);
                                    $scope.delete_directorioelemento(obj.li_attr['data-renderiddirtemplate'], obj);
                                    //this.remove(obj);
                                    //$("#jstreeFolders").jstree(true).remove(obj);
                                    //Hago que la interfaz refresque el titulo con el valor de component_selected
                                    //angular.element($("#ctrl_editor")).scope().$apply();
                                    //$('#component-edit-modal').modal('show');
        
                                }
                            },

                        };
                    else{


                        var tmp = $.jstree.defaults.contextmenu.items();
                            delete tmp.create.action;
                            tmp.create.label = "New";
                            tmp.create.submenu = {
                                "create_folder" : {
                                    "separator_after"   : true,
                                    "label"             : "Folder",
                                    "action"            : function (data) {


                                            var inst = $.jstree.reference(data.reference),
                                            obj = inst.get_node(data.reference);
                                            //inst.create_node(obj, { type : "default" }, "last", function (new_node) {
                                            //setTimeout(function () { inst.edit(new_node); },0);
                                            $scope.node_selected = data;
                                            $scope.new_directorio($scope.project_selected, obj.id);                                            

                                        //});


                                    }
                                },
                                "create_file" : {
                                    "label"             : "File",
                                    "action"            : function (data) {
                                        var inst = $.jstree.reference(data.reference),
                                        obj = inst.get_node(data.reference);
                                        $scope.node_selected = data;
                                        console.log(data);
                                        $scope.new_file(obj.id);
                                    }
                                }
                            };
                            if(this.get_type($node) === "file") {
                                delete tmp.create;
                            }

                            tmp.rename = {


                                        "label": "Edit",
                                        "action": function (data) { 
                                            console.log('rename');

                                            var inst = $.jstree.reference(data.reference),
                                            obj = inst.get_node(data.reference);
                                            $scope.node_selected = data;

                                            //para los archivos y templates el id viene en este atributo
                                            var renderId = obj.li_attr['data-renderid'];
                                            //aqui viene definido el tipo de nodo pintado (file, folder, template)
                                            var renderAs = obj.li_attr['data-renderas'];
                                            
                                            if(renderAs === 'folder'){
                                                $scope.load_directorio(obj.id);
                                                $('#folder-edit-modal').modal('show');
                                            }else{
                                                $scope.load_file(renderId);
                                                $('#file-edit-modal').modal('show');
                                            }
                                            
                                            // tree.edit($node);
                                    },   
                            }

                            tmp.remove = {

                                        "label": "Delete",
                                        "action": function (data) { 
                                            console.log('delete');
                                            
                                            var inst = $.jstree.reference(data.reference),
                                            obj = inst.get_node(data.reference);
                                            $scope.node_selected = data;        
                                            $scope.delete_directorio(obj.id, obj);             
                                            // tree.edit($node);
                                    },   
                            }

                            delete tmp.ccp;
                            return tmp;
                            // var tree = $("#jstreeFolders").jstree(true);

                            //     return {
                            //         "Create": {
                            //             "separator_before": false,
                            //             "separator_after": false,
                            //             "label": "Create",
                            //             "action": function (obj) {          
                            //                 console.log('node');
                            //                 console.log($node);                                        
                            //                 $node = tree.create_node($node);                                            
                            //                 tree.edit($node);
                            //             }
                            //         },
                            //         "Rename": {
                            //             "separator_before": false,
                            //             "separator_after": false,
                            //             "label": "Rename",
                            //             "action": function (obj) { 
                            //                 tree.edit($node);
                            //             }
                            //         },                         
                            //         "Remove": {
                            //             "separator_before": false,
                            //             "separator_after": false,
                            //             "label": "Remove",
                            //             "action": function (obj) { 
                            //                 tree.delete_node($node);
                            //             }
                            //         }
                            //     };
                    }    

                }
            }

    }).bind("copy_node.jstree", function(e, data) {
        console.log(data.node);
        // var inst = $.jstree.reference(data.reference);
        // obj = inst.get_node(data.reference);
        // obj.text;
        // obj.id;
        // console.log(obj);
        // console.log(obj.id);

        // console.log("Drop node " + data.node.id + " to " + data.parent + " " + data.node.li_attr['data-renderid']);

        console.log(data.parent);

        $scope.new_directorioelemento(data.parent,  data.node.li_attr['data-renderid'], null, data.node, null);

        //$('#jstreeFolders').jstree(true).delete_node(data.node);
    });



tree.update({id:1}, function(success){
                        
                        console.log('success');    
                        $('#jstreeBuilds').jstree();
                        $('#jstreeBuilds').jstree(true).settings.core.data = success.dirs;
                        $('#jstreeBuilds').jstree(true).refresh();

                        $('#jstreeFolders').jstree();
                        $('#jstreeFolders').jstree(true).settings.core.data = success.dirs;
                        $('#jstreeFolders').jstree(true).refresh();
                                                    
                    },function(error){
                        console.log('ERR');
                        console.log(error);  
                    });



//  $('#jstreeFolders').jstree(true).settings.core.data = [
//             {'id' : 'root',
//                 'text' : '/',
//                 'icon' : 'glyphicon glyphicon-folder-open',
//                 'li_attr':{'data-renderas':'component'}
//             },
//             // {
//             //     'id' : 'node_2',
//             //     'text' : 'Root node with options',
//             //     'icon' : 'glyphicon glyphicon-folder-open',
//             //     'state' : { 'opened' : false, 'selected' : true },
//             //     'li_attr':{'data-renderas':'archive'},
//             //     'children' : [ { 'text' : 'Child 1' }, 'Child 2']
//             // },
//             // {
//             //     'id' : 'node_3',
//             //     'text' : 'Root node with options',
//             //     'icon' : 'glyphicon glyphicon-folder-open',
//             //     'state' : { 'opened' : false, 'selected' : true },
//             //     'children' : [ { 'text' : 'Child 1' }, 'Child 2']
//             // }

//          ];

        
// $('#jstreeFolders').jstree(true).refresh();


// $('#jstreeBuilds').jstree();
// $('#jstreeBuilds').jstree(true).settings.core.data = [
//             {'id' : 'root',
//                 'text' : '/',
//                 'icon' : 'glyphicon glyphicon-folder-open',
//                 'li_attr':{'data-renderas':'component'}
//             },

//          ];
// $('#jstreeBuilds').jstree(true).refresh();


console.log($scope.dataLang);

$scope.printTree = function(){
    console.log('arbol');
    console.log($scope.nodeComponente[0].children.splice(1,1));
    
    console.log($scope.nodeComponente);
    //$('#jstree').jstree(true).refresh();
    var v = $('#jstreeFolders').jstree(true).get_json('#', {flat:true})
    var mytext = JSON.stringify(v);
    console.log(mytext);

    //$('#jstree').jstree(true).settings.core.data = $scope.nodeComponente;
    $('#jstree').jstree(true).refresh();
}


$scope.load_components = function(){
    $scope.components = [];
    $scope.components = componente_env.query({id_entorno:$scope.environment_selected}, function(success){
                            console.log('success');
                            console.log(success);
                            $scope.createTreeModel(); 
                            
                        },function(error){
                            console.log('ERR');
                            console.log(error);  
        });
}

$scope.createTreeModel = function(){
    
   console.log('init');
    $scope.nodeComponente=[];
    proccess = [];
    angular.forEach($scope.components, function(value, key){

        console.log(value);

        proccess.push(1);
        plantillas_comp.query({id:value.id_componente}, function(success){
            proccess.pop();
            add_templates(proccess, value, success);
        },function(error){
            proccess.pop();
            add_templates(proccess, value, null);  
        });

    })

}


function add_templates(proccess, componente, plantillas){
    
    var nodePlantillas=[];
    
    if(plantillas != null){

        angular.forEach(plantillas, function(value, key){    
            nodePlantillas.push({'parent': componente.id_componente, 'text':value.nombre + '<sub style="color:#CCCCCC">'  + value.lang.nombre + '</sub>', 'icon':"glyphicon glyphicon-file", 'li_attr':{'data-renderas':'archive', 'data-renderid': value.id_plantilla, 'data-rendername': value.nombre}});
        });
        $scope.nodeComponente.push({'id': componente.id_componente,'text':componente.nombre, 'icon':"glyphicon glyphicon-folder-open", 'children':nodePlantillas, 'li_attr':{'data-renderas':'component','data-renderid': componente.id_componente, 'data-rendername': componente.nombre}});

    }

    //Render -> Wait
    if(proccess.length<=0){
        $("#jstree").jstree('destroy');
        $scope.load();
        console.log('--------------------------------------------------');
        console.log($scope.nodeComponente);
        $('#jstree').jstree(true).settings.core.data = $scope.nodeComponente;
        $('#jstree').jstree(true).refresh();
    }

    

}



$scope.reload_tree = function(){
    console.log('push');

    $scope.createTreeModel();
    $scope.load();
 

}


console.log($scope.components);


        
        $scope.tabs = [];
        // $scope.isTabSelected=false;
        $scope.current_template;




        $scope.load = function(){

            $("#jstree").jstree({
                "core" : {
                "check_callback" : function (operation, node, node_parent, node_position, more) {
                        // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
                        // in case of 'rename_node' node_position is filled with the new node name                      
                        
                        var validator;

                        if(node_parent==null || typeof node_parent.li_attr == 'undefined'){
                            return false;
                        }
                            

                      
                        console.log(operation);
                        if(operation == 'move_node' || operation == 'copy_node'){

                            validator = false; 

                        }   
                        return validator;
                        
                    }
            },
            "crrm": { "move": { "always_copy": "multitree" } },
            "plugins" : [ "dnd","sort", "crrm" ],
            });


            //$.jstree.defaults.core.dblclick_toggle = false;
            //$("#jstree").jstree.defaults.dnd.always_copy = true;




        }

        $scope.new_directorioelemento = function(id_directorio, id_plantilla, id_archivo, node, nodeDef){

            var direlemento = new directorioelemento();
            direlemento.id_directorio = id_directorio;                    
            direlemento.id_plantilla = id_plantilla;
            direlemento.id_archivo = id_archivo;
            
            $scope.save_directorioelemento(direlemento, node, nodeDef);
            // if(!$scope.save_directorioplantilla($scope.GencoDirectorioPlantilla)){
            //     console.log('remove');
            //     $('#jstreeFolders').jstree(true).delete_node(node);            
            // }
            //$('#component-create-modal').modal('show');

      
        }

        $scope.save_directorioelemento = function(directorioelemento, node, nodeDef){
            console.log(directorioelemento);
            directorioelemento.$save(function(success){
                console.log(success);
                if(nodeDef != null || nodeDef != undefined){
                    nodeDef.id = success.id_dirplantilla;
                    nodeDef.parent = success.id_directorio;
                    //nodeDef.li_attr.data-renderiddirtemplate = success.id_dirplantilla;
                    $scope.addTreeNode(node, nodeDef);
                }
            },function(error){
                
                console.log(error);
                $('#jstreeFolders').jstree(true).delete_node(node); 
                //delete from restapi
                //agregar la llamada al metodo delete_archivo
            });
            
        } 

        $scope.delete_directorioelemento = function(id_dirplantilla, node){

            directorioelemento.delete({id: id_dirplantilla},function(success){
                console.log('****************************************************');
                console.log(node);           
                
                //delete from tree
                $('#jstreeFolders').jstree(true).delete_node(node);

                
            },function(error){
                
                console.log(error);

            });
            
        } 


        $scope.new_directorio = function(id_proyecto, id_padre){
            $scope.GencoDirectorios = new directorio();
            $scope.GencoDirectorios.id_proyecto = id_proyecto;
            $scope.GencoDirectorios.id_padre = id_padre;
            $('#folder-create-modal').modal('show');
            //$scope.save_directorio($scope.GencoDirectorio, node);
      
        }

        $scope.save_directorio = function(){

            $scope.GencoDirectorios.$save(function(success){
                console.log(success);
                var nodeDef = {'id': success.id_directorio, 
                                'parent': success.id_padre, 
                                'text': success.nombre, 
                                'icon':"glyphicon glyphicon-folder-open", 
                                'li_attr':{'data-renderas':"component",
                                            'data-renderid': success.id_directorio, 
                                            'data-rendername':success.nombre
                                        }
                            }
                $scope.addTreeNode($scope.node_selected, nodeDef);
            },function(error){
                
                console.log(error);
                //$('#jstreeFolders').jstree(true).delete_node(node); 
            });
            //$scope.GencoDirectorios = new directorio();
            $('#folder-create-modal').modal('hide');
        } 


        $scope.delete_directorio = function(id_directorio, node){

            directorio.delete({id_directorio: id_directorio},function(success){
                console.log('****************************************************');
                console.log(node);           
                
                //delete from tree
                $('#jstreeFolders').jstree(true).delete_node(node);

                
            },function(error){
                
                console.log(error);

            });
            
        }


        $scope.load_directorio = function(id_folder){

            console.log(id_folder);
            var data = directorio.get({id_directorio:id_folder}, 
                                        function(success){
                                            $scope.GencoDirectorios = data;                                
                                        }, 
                                        function(error){
                                            console.log(error);    
                                        }
                );
            
        }


        $scope.update_directorio = function(){
            console.log($scope.GencoDirectorios);
            $scope.GencoDirectorios.$update(function(success){
                console.log(success);

                //$scope.addTreeNode($scope.node_selected, nodeDef);
                //$('#jstreeFolders').jstree(true).rename_node($scope.node_selected, success.nombre);
                $scope.renameTreeNode($scope.node_selected, success.nombre);
                // $("#jstreeFolders").jstree('rename_node', $scope.node_selected , success.nombre );
                $('#folder-edit-modal').modal('hide');
            },function(error){
                
                console.log(error);
                //$('#jstreeFolders').jstree(true).delete_node(node); 
            });
            //$scope.GencoDirectorios = new directorio();
            
        } 

        /*
        * data: datos del nodo seleccionado que activa el menu, de esta se puede obtener el nodo seleccionado, y una instancia para 
                manipular el arbol.
        */
        $scope.addTreeNode = function(data, newNode){
            var inst = $.jstree.reference(data.reference),
            obj = inst.get_node(data.reference);
            inst.create_node(obj, newNode, "last", function (new_node) {
                console.log(new_node);
            })
        }

        $scope.renameTreeNode = function(data, newText){
            var inst = $.jstree.reference(data.reference),
            obj = inst.get_node(data.reference);
            console.log(data);
            console.log('rename');
            console.log(newText);
            console.log(obj);
             $('#jstreeFolders').jstree('set_text', obj, newText);

        }



        $scope.new_file = function(id_padre){
            $scope.GencoArchivos = new archivo();
            $('#file-create-modal').modal('show');
            //$scope.save_directorio($scope.GencoDirectorio, node);
      
        }

        $scope.save_file = function(){
            console.log('save file');
            console.log($scope.GencoArchivos);
            //console.log($scope.GencoArchivos.upload);
            //console.log(document.getElementById("id_upload").value);


            var file = $scope.myFile;
            console.log('file is ' );
            console.dir(file);
            //console.log(file.name);
            
            var myFoo = new File([editor.getValue()], "foo.log");
            //var fooStream = new FileOutputStream(myFoo, false); // true to append
                                                                 // false to overwrite.
            console.log(myFoo);
            //var myBytes = "New Contents\n".getBytes();
            //fooStream.write(myBytes);
            //fooStream.close();







            // console.log(fileUpload.uploadFileToUrl(file, $scope.GencoArchivos));
            //new Promise(function(resolve, reject) { 
                console.log($scope.node_selected.parent);
                console.log($scope.node_selected);
                var inst = $.jstree.reference($scope.node_selected.reference),
                obj = inst.get_node($scope.node_selected.reference);
                console.log('////////////////////////////');
                console.log(obj.id);
                console.log(obj);

            var respuesta = fileUpload.saveFileToUrl(myFoo, $scope.GencoArchivos, obj, $scope.node_selected, $scope.new_directorioelemento);
                            // $scope.new_directorioelemento(id_directorio, id_plantilla, id_archivo, node, nodeDef);
                            // data = $scope.node_selected;
                            // $scope.new_directorioelemento(data.parent, null, null, data.node, null);
            //});
                console.log('respuesta ' + respuesta);
            // })
            // .then (function(result) {
            //    console.log(result);
            //    console.log('fin promise');
            // })


            // $scope.GencoArchivos.$save(function(success){
            //     console.log(success);

            //     var newNode = {
            //                     'id': 'f', 
            //                     'parent': '#', 
            //                     'text': success.nombre + '<sub style="color:#CCCCCC">file</sub>', 'icon':"glyphicon glyphicon-file", 
            //                     'li_attr':{
            //                                 'data-renderas':"file", 
            //                                 'data-renderid': success.id_archivo,
            //                                 'data-renderiddirtemplate': 'f', 
            //                                 'data-rendername': success.nombre
            //                             }
            //                 }
            //                 console.log('save file');
                
            //     var inst = $.jstree.reference($scope.node_selected.reference),
            //     obj = inst.get_node($scope.node_selected.reference);
            //     $scope.new_directorioelemento(obj.id, null, success.id_archivo, $scope.node_selected, newNode)
            //     // var newNode = {'id': 'f'+ success.id_dirplantilla, 'parent': success.id_directorio, 'text': success.id_plantilla.nombre + '<sub style="color:#CCCCCC">'  + i.id_plantilla.id_lenguaje.nombre + '</sub>', 'icon':"glyphicon glyphicon-file", 'li_attr':{'data-renderas':"archive", 'data-renderid': i.id_plantilla_id,'data-renderiddirtemplate': i.id_dirplantilla, 'data-rendername': i.id_plantilla.nombre}}
            //     // $scope.addTreeNode($scope.node_selected, newNode);
            // },function(error){
                
            //     console.log(error);
            //     //$('#jstreeFolders').jstree(true).delete_node(node); 
            // });



            // var formData = new FormData($(this)[0]);

            // $.post($(this).attr("action"), formData, function(data) {
            //     alert(data);
            // });

            // //$scope.GencoArchivos = new archivo();
            // $('#file-create-modal').modal('hide');
        } 

       $scope.update_file = function(){
            console.log('update file');
            console.log($scope.GencoArchivos);


            var file = $scope.myFile;
            console.log('file is ' );
            console.dir(file);

            
            var myFoo = new File([editor2.getValue()], "foo.log");

            console.log(myFoo);

                console.log($scope.node_selected.parent);
                console.log($scope.node_selected);
                var inst = $.jstree.reference($scope.node_selected.reference),
                obj = inst.get_node($scope.node_selected.reference);

            var respuesta = fileUpload.updateFileToUrl(myFoo, $scope.GencoArchivos, obj, $scope.node_selected, $scope.renameTreeNode);

            console.log('respuesta ' + respuesta);
            $('#file-edit-modal').modal('hide');
        } 


        $scope.load_file = function(id_file){

            console.log('data passssss');

            archivo.get({id:id_file}, 
                                    function(success){
                                        $scope.GencoArchivos = success;
                                        $http.get($scope.GencoArchivos.upload).success(function(data) {
                                            editor2.setValue(data);
                                        }).error(function(data){
                                            console.log(error);
                                        });
                                                                      
                                    }, 
                                    function(error){
                                        console.log(error);    
                                    });

        }

        $scope.change_repository = function(){
            repository.query(
                            function(success){
                                $scope.repositories = success;
                                $('#repository-change-modal').modal('show');
                            }, 
                            function(error){
                                console.log(error);    
            });
        }



        $scope.all_entity_init = function(){
            //Hacemos que al cargar se inicialicen con false
            //aca agregar el valor que se registro previamente 
            console.log($scope.all_entities.map(function(x){return false;}));
            $scope.entity_added=$scope.all_entities.map(function(x){return false;});
            $scope.all_references=$scope.all_entities.map(function(x){return null;});
        }

        $scope.template_entities_load = function(id_file){
            console.log('obtener entidades');
            console.log($scope.repository_selected)

            entity_repo.query({id_repositorio: $scope.repository_selected.data.id_repositorio}, 
                function(success){
                    //angular.element($("#ctrl_editor")).scope().$apply();
                    if(!$scope.$$phase) {
                          $scope.$apply();
                    }
                    $scope.all_entities = success;
                    $scope.all_entity_init();
                    console.log(success);
                    $('#template-entities-modal').modal('show');

                },
                function(error){
                    console.log(error);
                })


        }



        $scope.get_template_entity =  function(index){

            //index = 0;
            proccess = [];

            /**@Generics
            * lang_added es el arrglo que se pinta y que corresponde al mismo array all_langs. Se usa lang_added para determinar cual esta seleccionado y con el index de los
            * seleccionados vamos al array base(all_langs[])
            **/
            $scope.entities_selects = '[';
            angular.forEach($scope.entity_added, function(value, key){
                console.log(key);
                if(value){
                    $scope.entities_selects += $scope.all_entities[key].nombre + ',';
                } 
            });
            $scope.entities_selects += ']';

            //$scope.entities_selects = '[';
           // angular.forEach($scope.entity_added, function(value, key){

                //if(value){
                //    console.log($scope.all_entities[key]);
                    //$scope.entities_selects += $scope.all_entities[index].nombre + ',';
                    console.log($scope.entity_added[index]);
                    if($scope.entity_added[index]){
                        //$scope.all_references[index] = $scope.load_entity($scope.all_entities[index].id_entidad);    
                        entitydef.query({id_entidad:$scope.all_entities[index].id_entidad}, function(success){
                            // proccess.pop();
                            $scope.all_references[index] =  success;
                            console.log(success);
                            //$scope.GencoEntidadFields =success;
                        },function(error){
                            // proccess.pop();
                            console.log(error);
                        });

                    }else{
                        $scope.all_references[index]=[];
                    }
                    

                    console.log($scope.all_references[index]);

                //}  
                   

              //  index++;

            //})
            //$scope.entities_selects += ']';
        }


        $scope.load_entity = function(id_entity){
            // $scope.entity_selected.id = id_entity;

            // $scope.GencoEntidadDefinicion = new entitydef();
            // $scope.pk_fields = [];
            // $scope.GencoEntidadDefinicion.id_entidad = id_entity;
            // var data = entity.get({id_entidad:id_entity});
            // $scope.GencoEntidad = data;
            // data.$promise.then(function(data){
                
                entitydef.query({id_entidad:id_entity}, function(success){
                    // proccess.pop();
                    return success;
                    //$scope.GencoEntidadFields =success;
                },function(error){
                    // proccess.pop();
                    console.log(error);
                });

            // });

        } 


         $scope.save_template_entity =  function(){

            index = 0;
            proccess = [];

            angular.forEach($scope.entity_added, function(value, key){

                if(value){
                    console.log($scope.all_entities[key]);
                    // proccess.push(1);
                    // conv = new env_lang({id_entorno: $scope.GencoEntorno.id_entorno, id_lenguaje: $scope.all_langs[key].id_lenguaje});
                    // console.log(conv);
                    // conv.$save(
                    //     function(success){
                    //     console.log('OK');
                    //     console.log(success.data); //wait_conversion();
                    //     proccess.pop();
                    //     add_lang_validator(proccess, $scope.GencoEntorno.id_entorno, $scope.load_env);
                    //     },function(error){
                    //     console.log('ERR');
                    //     console.log(error.data); 
                    //     proccess.pop();
                    //     add_lang_validator(proccess, $scope.GencoEntorno.id_entorno, $scope.load_env);  
                    // }); 
                }else{
              
                    // proccess.push(1);
                    // conv = new env_lang({id_entorno: $scope.GencoEntorno.id_entorno, id_lenguaje: $scope.all_langs[key].id_lenguaje});
                    // conv.$delete(
                    //     function(success){
                    //         console.log('OK');
                    //         console.log(success); //wait_conversion();
                    //         proccess.pop();
                    //         add_lang_validator(proccess, $scope.GencoEntorno.id_entorno, $scope.load_env);
                    //     },function(error){
                    //         console.log('ERR');
                    //         console.log(error);  
                    //         proccess.pop();  
                    //         add_lang_validator(proccess, $scope.GencoEntorno.id_entorno, $scope.load_env);
                    // });
                }    
                   

                index++;

            })

         }












        $scope.update_component = function(){

            $scope.GencoComponentes.$update(function(){
            $scope.load_components(); 
            $('#component-edit-modal').modal('hide');
            });
            
        } 

        $scope.load_component = function(id_component){

            console.log(id_component);
            var data = componente.get({id:id_component});
            $scope.GencoComponentes = data;
        }

        $scope.new_template = function(id_componente){

            $scope.GencoPlantillas= new plantillas();
            console.log($scope.GencoPlantillas);
            $scope.GencoPlantillas.id_componente = id_componente;
            console.log('new');

      
        }

        $scope.save_template = function(){

            console.log($scope.GencoPlantillas);
            $scope.GencoPlantillas.id_lenguaje = $scope.dataLang.repeatSelectLang;
            $scope.GencoPlantillas.$save(function(){   
                $scope.reload_tree();      
                $('#template-create-modal').modal('hide')
            });
            
        } 

        $scope.load_template = function(id_template){

            var data = plantillas.get({id:id_template});
            $scope.GencoPlantillas = data;
            data.$promise.then(function(data){
                console.log(data.id_lenguaje);
                $scope.dataLang.repeatSelectLang = data.id_lenguaje.toString();        
                $scope.GencoPlantillas.id_lenguajeprocesador = data.id_lenguajeprocesador.toString();
        });
        } 

        $scope.update_template = function(){
            $scope.GencoPlantillas.$update(function(){
                $scope.reload_tree();      
                $('#template-edit-modal').modal('hide')
            });

        }

        $scope.delete_template = function(){

            plantillas.delete({id: $scope.template_selected.id},function(success){
                console.log(success);
                $scope.reload_tree();
                $('#template-delete-modal').modal('hide');
            },function(error){
                console.log(error);
            });
            
        } 

        $scope.cancel = function(){
            $scope.GencoEntorno = $scope.tmpGencoEntorno;
            $('#template-create-modal').modal('hide');
            $('#template-preview-modal').modal('hide');
            $('#component-create-modal').modal('hide');
            $('#component-edit-modal').modal('hide');
            $('#template-edit-modal').modal('hide');
            $('#template-delete-modal').modal('hide');
            $('#component-delete-modal').modal('hide');            
        } 

        //$scope.counter = 1;
        /** Function to add a new tab **/
        $scope.addTab = function(id_template, name){
            console.log('desde arbol ' + id_template);
            
            pos = $scope.tabs.map(function(x) {return x.id_plantilla.toString()}).indexOf(id_template);

            if(pos>=0){
                $scope.selectedTab=pos;
                $scope.selectTab(id_template, pos);
                return;
            }
            

            var data;


            template.get({id_plantilla:id_template}, function(success){
                                    console.log('success');
                                    console.log(success);
                                    data = success;// success callback
                                    console.log(data);
                                    // templateObj = data.templateObj[0];
                                    // $scope.tabs.push({id_plantilla:id_template, nombre: $scope.plantillas[pos].nombre ,content: data});
                                    $scope.tabs.push({id_plantilla:id_template, nombre: data.templateName ,content: data.fileContent});
                                    console.log('select');
                                    $scope.selectedTab = $scope.tabs.length - 1; //set the newly added tab active. 
                                    $scope.selectTab(id_template, $scope.selectedTab);
                                },function(error){
                                    console.log('ERR');
                                    console.log(error);  
            });


        }
        
        /** Function to delete a tab **/
        $scope.deleteTab = function(index){
            // $scope.isTabSelected=true;
            $scope.tabs.splice(index,1);
            var index = $scope.tabs.length; 
            if(index==0){
                 //remove the object from the array based on index
                editor.setValue('');    
            }else{
                $scope.selectedTab = index - 1;
                $scope.selectTab($scope.tabs[index-1].id_plantilla, $scope.selectedTab);    
            }
            
            
        }
        
        $scope.selectedTab = 0; //set selected tab to the 1st by default.
        
        /** Function to set selectedTab **/
        $scope.selectTab = function(id_template, pos){
            
            editor.setValue($scope.tabs[pos].content);
            editor.setTheme("ace/theme/eclipse");
            editor.getSession().setMode("ace/mode/python");
            $scope.current_template = id_template;

            if(!$scope.$$phase) {
                $scope.$apply();
            }

        }


        $scope.submit = function() {

            var content = editor.getValue();

            /*Actualizo el contenido en memoria antes de hacer el request por si hay un cambio de tab no se va a perder
            el contenido ni haya necesidad de hacer otra peticion al API Rest*/
            pos = $scope.tabs.map(function(x) {return x.id_plantilla.toString()}).indexOf($scope.current_template);
            $scope.tabs[pos].content=content;
 
            var templ = new template({editor: content});
            templ.$save({id_plantilla:$scope.current_template})

            console.log('post editor');
            console.log(editor.getValue());
        };




        $scope.preview = function() {

            var content = editor.getValue();
            editor_preview.setValue('');

            var templ = new template({editor: content});
            templ.$update({id_plantilla:$scope.current_template}, function(success){
                                    data = success;// success callback
                                    console.log(data);
                                    editor_preview.setValue(data.fileContent);
                                    $('#template-preview-modal').modal('show');  
                                },function(error){
                                    console.log('ERR');
                                    console.log(error);  
            })


        };


        function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }




        $scope.load_components();


        function setListenterContent() {
                var fileInput = document.getElementById('fileInput');
                var fileDisplayArea = document.getElementById('fileDisplayArea');
                //var editor = document.getElementById('editor');

                fileInput.addEventListener('change', function(e) {
                    var file = fileInput.files[0];
                    var textType = /text.*/;

                    if (file.type.match(textType)) {
                        var reader = new FileReader();

                        reader.onload = function(e) {
                            //fileDisplayArea.innerText = reader.result;
                            editor.setValue(reader.result);
                        }

                        reader.readAsText(file);    
                    } else {
                        fileDisplayArea.innerText = "File not supported!"
                    }
                });
        }


  });

angular.module('app_editor').config(function($httpProvider){

    $httpProvider.defaults.headers.common['Authorization'] = 'Basic YWRtaW46YWRtaW4=';
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

})

angular.module('app_editor').directive('emitLastRepeaterElement', function($timeout) {
 var itr_plantillas = 0;   

    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) { 

                if(attr['renderas'] == 'archive'){
 
                    $timeout(function () {
                        scope.load();
                    });

                }

                if(attr['renderas'] == 'component'){
                   console.log('termino component'); 
                }
              
            }
        }

  };   


});


angular.module('app_editor').directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

