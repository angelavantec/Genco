var buildApp = angular.module('app_builds', ['ngResource','editor.services','lang.services','builds.services','repository.services']);

buildApp.controller('ctrl_builds', [ 
                '$scope', '$http', 'componente_env', 'componente', 'plantillas', 'plantillas_comp', 'template', 'lang', 'directorioelemento',  'dir_tmpl_tree', 'dir_item_tree','repotree', 'directorio', 'archivo', 'plantillaentidad', 'fileUpload', 'repository', 'entity_repo', 'entitydef', 'buildproject','fulltree',
                function($scope, $http, componente_env, componente, plantillas, plantillas_comp, template, lang, directorioelemento, dir_tmpl_tree, dir_item_tree,repotree, directorio, archivo, plantillaentidad, fileUpload, repository, entity_repo, entitydef, buildproject, fulltree) {

//editors = [];
$scope.environment_selected = $("#key_module").val();
$scope.project_selected = $("#key_project").val();
$scope.name_project_selected = $("#name_project").val();
$scope.node_selected;
$scope.node_item_selected;
console.log($scope.environment_selected);
$scope.components = [];


$scope.itr_plantillas=0;
$scope.treeModel = [];
$scope.nodeComponente=[];

$scope.direlemento_selected = {
    id: null,
    nombre: null,
    id_padre: null,
    nombre_padre: null,
    tags: null,
    as_list: null,
};

$scope.elementoentidad_selected = {
    id: null,
    nombre: null,
    nombre_padre: null,
    tag: null,
};


$scope.template_selected = {
    id: null,
    nombre: null,
};

$scope.repository_selected = {
    data: null,
};

$scope.entity_added = { 
    entity: null,
    scope: null,
};


/*combobox de entidades del repositorio*/
$scope.types_types = [];
$scope.Conversions = [];
$scope.EntityTags = [];

$scope.entities_added = [];
$scope.template_tags=[];
$scope.entity_scope=[];



$scope.GencoPlantillas;
$scope.GencoComponentes;
$scope.GencoDirectorios = new directorio();
$scope.GencoArchivos = new archivo();
$scope.GencoElementoEntidad = new plantillaentidad();
$scope.repositories = [];



$scope.langs = [];
$scope.langs=lang.query();

$scope.all_repository=repository.query();
$scope.all_entities=[];
$scope.GencoRepositorioEntidad;


$scope.GencoEntidadDefinicion = new entitydef();
$scope.GencoEntidadFields = [];


$scope.globalMessage = 'NA';
$scope.ConfirmDeleteCallback = null;

$scope.dataLang = {
    repeatSelectLang: null,
    availableOptions: $scope.langs,
};

$scope.asListModel = {
       value : true
};

$scope.templateName = '';

typeError = 'ERROR';
typeInfo = 'INFO';
typeWarning = 'WARNING';

    /*Instancia del arbol de la seccion de FOLDERS*/

    $("#jstreeFolders").jstree({
    "core" : {
                "check_callback" : function (operation, node, node_parent, node_position, more) {
                        // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
                        // in case of 'rename_node' node_position is filled with the new node name                      

// return true;

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
                            
                        console.log(node_parent);
                        var renderas = node_parent.li_attr['data-renderas'];

                        if(typeof renderas == 'undefined'){
                            return false;
                        }
                      
                        validator = renderas === 'folder' ? true : false;  
                        console.log(renderas);  
                        if(validator && operation == 'move_node'){

                            validator = (node.li_attr['data-renderas'] === 'file' || node.li_attr['data-renderas'] === 'template') ? true : false;

                            // if(validator){
                                
                            //     console.log(node.li_attr['data-renderid'] + '  ' + node_parent.li_attr['data-renderid']);
                            //     $scope.direlemento_selected = {id:node.li_attr['data-renderid'], nombre:node.li_attr['data-rendername'], id_padre: node_parent.li_attr['data-renderid'],nombre_padre:node_parent.li_attr['data-rendername'], tags:'', as_list:'' };
                            //     // $scope.direlemento_selected = {id:node.li_attr['data-renderid'], nombre:node.li_attr['data-rendername'], nombre_padre:node_parent.li_attr['data-rendername'], tags:node.li_attr['data-rendertags'], as_list:node.li_attr['data-renderaslist'] };
                            //     $scope.update_directorioelemento();
                            // }

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
                                    
                                    // var inst = $.jstree.reference(data.reference),
                                    // obj = inst.get_node(data.reference);
                                    // var renderId = obj.li_attr['data-renderid'];
                                    // //inst.edit(obj);
                                    var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                    //var renderId = obj.li_attr['data-renderid'];                                    
                                    //$scope.elementoentidad_selected = {id:renderId, nombre:obj.li_attr['data-rendername']};    
                         
                                    if($scope.repository_selected.data == null || $scope.repository_selected.data == undefined){
                                        $scope.infoBubble('Select Repository!','#dropdownRepo');  
                                        return;                                  
                                    }


                                    $scope.node_item_selected = obj;


                                    var renderId = obj.li_attr['data-renderiddirtemplate'];          
                                    var nodeParent = inst.get_node(obj.parents[0]);
                                    $scope.direlemento_selected = {id:renderId, nombre:obj.li_attr['data-rendername'], nombre_padre:nodeParent.li_attr['data-rendername'], tags:obj.li_attr['data-rendertags'], as_list:obj.li_attr['data-renderaslist'] };

                                    if($scope.direlemento_selected.as_list==1){
                                        $scope.asListModel.value = true;
                                    }else{
                                        $scope.asListModel.value = false;
                                    }
                                    $scope.getItemTree(renderId, $scope.repository_selected.data.id_repositorio);
        
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
                                    $scope.showConfirmDelete("Do you really want to detach " + obj['text'] + " Template?");
                                    $scope.ConfirmDeleteCallback = function(){$scope.delete_directorioelemento(obj.li_attr['data-renderiddirtemplate'], obj)};
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
                                            $scope.node_selected = obj; //data;
                                            $scope.new_directorio($scope.project_selected, obj.id);                                            

                                        //});


                                    }
                                },
                                "create_file" : {
                                    "label"             : "File",
                                    "action"            : function (data) {
                                        var inst = $.jstree.reference(data.reference),
                                        obj = inst.get_node(data.reference);
                                        $scope.node_selected = obj; //data;
                                        console.log(data);
                                        $scope.new_file(obj.id);
                                    }
                                }
                            };
                            
                            if($node.li_attr['data-renderas'] === 'file'){
                                delete tmp.create;
                            }

                            // if(this.get_type($node) === "file") {
                            //     delete tmp.create;
                            // }

                            tmp.rename = {


                                        "label": "Edit",
                                        "action": function (data) { 
                                            console.log('rename');

                                            var inst = $.jstree.reference(data.reference),
                                            obj = inst.get_node(data.reference);
                                            $scope.node_selected = obj; //data;

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
                                            $scope.node_selected = obj; //data;        
                                            //$scope.delete_directorio(obj.id, obj);             
                                            // tree.edit($node);

                                            //para los archivos y templates el id viene en este atributo
                                            var renderId = obj.li_attr['data-renderid'];
                                            //aqui viene definido el tipo de nodo pintado (file, folder, template)
                                            var renderAs = obj.li_attr['data-renderas'];
                                            
                                            if(renderAs === 'folder'){
                                                $scope.showConfirmDelete("Do you really want to delete " + obj['text'] + " Folder?");
                                                $scope.ConfirmDeleteCallback = function(){$scope.delete_directorio(renderId, obj)};
                                                //$('#folder-edit-modal').modal('show');
                                            }else{
                                                $scope.showConfirmDelete("Do you really want to delete " + obj['text'] + " File?");
                                                $scope.ConfirmDeleteCallback = function(){$scope.delete_file(renderId, obj)};
                                                // $('#file-edit-modal').modal('show');
                                            }

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
        $("#jstreeFolders").jstree(true).select_node(data.node.id);
        $scope.new_directorioelemento(data.parent,  data.node.li_attr['data-renderid'], null, data.node, null);

        //$('#jstreeFolders').jstree(true).delete_node(data.node);
    }).bind("dblclick.jstree", function(e) {

        

        var tree = $(this).jstree(); 
        var node = tree.get_node(e.target); 
        
        if(node.li_attr['data-renderas'] != 'template'){
            //$scope.direlemento_selected = {id:null, nombre:null};
            //angular.element($("#ctrl_editor")).scope().$apply();
            return;                                  
        }

        if($scope.repository_selected.data == null || $scope.repository_selected.data == undefined){
            $scope.infoBubble('Select Repository!','#dropdownRepo');  
            return;                                  
        }

        var nodePath = tree.get_path(node).join("/");
        var renderId = node.li_attr['data-renderiddirtemplate'];          
        var nodeParent = tree.get_node(node.parents[0]);
        $scope.direlemento_selected = {id:renderId, nombre:node.li_attr['data-rendername'], nombre_padre:nodeParent.li_attr['data-rendername'], tags:node.li_attr['data-rendertags'], as_list:node.li_attr['data-renderaslist'] };

        $scope.node_item_selected = node;
        if($scope.direlemento_selected.as_list==1){
            $scope.asListModel.value = true;
        }else{
            $scope.asListModel.value = false;
        }
        $scope.getItemTree(renderId, $scope.repository_selected.data.id_repositorio);

    }).bind("move_node.jstree", function(e, data) {
        console.log('SE movio un nodo hacer update ././././././../.');
        console.log(data.node.li_attr['data-renderid']);
        console.log(data.parent);
        $("#jstreeFolders").jstree(true).select_node(data.node.id);
        $scope.update_directorioelemento(data.node.li_attr['data-renderiddirtemplate'],  data.parent);
    });

    /*Instancia del arbol de la seccion de ENTITIES*/
    /*IMPORTANTE*/
    /* Para que el arbol permita manipular(create, rename, delete) los nodos check_callback debe ser true*/
    $('#jstreeBuilds').jstree({        
        'core':{check_callback : true},
        "plugins" : [ "contextmenu", "sort", "dnd" ],
        "contextmenu": {
                "items": function ($node) {

                    console.log($node.li_attr['data-renderas'] );

                    if($node.li_attr['data-renderas'] === 'template')
                        return {

                            "Rename": {
                                "label": "Change Entity",
                                "action": function (data) {

                                    var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                    var renderId = obj.li_attr['data-renderid'];                                    
                                    $scope.elementoentidad_selected = {id:renderId, nombre:obj.li_attr['data-rendername']};    
                                    $scope.node_item_selected = obj;                            
                                    
                                    //cargar combobox entidades
                                    //$scope.template_entities_load(renderId);
                                    angular.element($("#ctrl_builds")).scope().$apply();
                                    $('#template-entities-modal').modal('show');
                                    
        
                                }
                            },
                            "Delete": {
                                "label": "Detach Entity",
                                "action": function (data) {
                                    
                                    var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                    $scope.node_item_selected = obj;
                                    $scope.showConfirmDelete("Do you really want to detach " + obj['text'] + " Link?");
                                    $scope.ConfirmDeleteCallback = function(){$scope.delete_elementoentidad(obj.li_attr['data-renderid'], obj)};
                                    //borrar direlementoentidad   
                                    //$scope.delete_directorioelemento(obj.li_attr['data-renderiddirtemplate'], obj);
                                    //$scope.delete_elementoentidad(obj.li_attr['data-renderid'], obj);
        
                                }
                            },

                        };
                    else{

                        return {
                            "Rename": {
                                "label": "Change Entity",
                                "action": function (data) {

                                    var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);

                                    var nodeParent = $('#jstreeBuilds').jstree(true).get_node(''+obj.parent)
                                    var renderId = nodeParent.li_attr['data-renderid'];
                                    $scope.elementoentidad_selected = {id:renderId, nombre_padre:nodeParent.li_attr['data-rendername'], tag: obj.li_attr['data-renderid']};    
                                    $scope.node_item_selected = obj;                            
                                    angular.element($("#ctrl_builds")).scope().$apply();
                                    $('#template-entities-tag-modal').modal('show');
        
                                }
                            },
                        
   
                        }
                    }    

                }
        }
    }).bind("dblclick.jstree", function(e) {

        var tree = $(this).jstree(); 
        var obj = tree.get_node(e.target); 


        // if(obj.li_attr['data-renderas']=='template'){
        //     return;
        // }
        console.log(obj.parent);    
        var nodeParent = tree.get_node(''+obj.parent);
        console.log(nodeParent);
        //si el length es mayo a cero es un tag sino es un template
        if(nodeParent.parents.length>0){
            $scope.elementoentidad_selected = {id:nodeParent.li_attr['data-renderid'], nombre_padre:nodeParent.li_attr['data-rendername'], tag: obj.li_attr['data-renderid']};
            $scope.node_item_selected = obj;                            
            angular.element($("#ctrl_builds")).scope().$apply();
            $('#template-entities-tag-modal').modal('show');
        }else{
            $scope.elementoentidad_selected = {id: null,nombre: null,nombre_padre: null,tag: null,};
            $scope.node_item_selected = obj;
            angular.element($("#ctrl_builds")).scope().$apply();
            $('#template-entities-modal').modal('show');
        }        
        

    });


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

/* Ya construidos los arboles cargo los items de directorio elemento*/
$scope.getCmpTree = function(){



    fulltree.get(function(success){    
    //tree.get({id:$scope.environment_selected}, function(success){

                                 
                            var idTree;
                            //console.log('success');    
                            //$('#jstreeBuilds').jstree();
                            //$('#jstreeBuilds').jstree(true).settings.core.data = success.dirs;
                            //$('#jstreeBuilds').jstree(true).refresh();

                            angular.forEach(success.envs, function(value, key){ 
                                console.log('-----------');
                                console.log(value);
                                console.log('-----------');
                                idTree='jstree'+ value.idEnv;   

                                var txt1 = "<div id='" + idTree + "'></div>";               // Create element with HTML  
                                $("#envTree").append('<p style="padding-top: 10px;"><span class="label label-primary   ">' +value.nombre + '</span></p>');
                                $("#envTree").append(txt1);
                                //$('#'+idTree).jstree();
                                
                                // $('#jstree').jstree();
                                //                 $('#jstree').jstree(true).settings.core.data = success.envs[0].dirs;
                                //                 $('#jstree').jstree(true).refresh(); 
                                $('#'+idTree).jstree({
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
                                }).bind("dblclick.jstree", function(e) {

                                    console.log('preview template');

                                    var tree = $(this).jstree(); 
                                    var node = tree.get_node(e.target); 
                                    
                                    var renderAs = node.li_attr['data-renderas'];
                                    var renderId = node.li_attr['data-renderid']; 

                                    console.log(node);      

                                    if(renderAs === 'template'){                                            
                                        $scope.load_template(renderId);
                                        $('#template-view-modal').modal('show');
                                    }
                                });

                                $('#'+idTree).jstree(true).settings.core.data = value.dirs;
                                $('#'+idTree).jstree(true).refresh();

                            });
                            
                                                        
                        },function(error){                        
                            $scope.showMessage($scope.getDataError(error), typeError); 
                        });

    }

/* Ya construidos los arboles cargo los items de directorio elemento*/
$scope.getDirTree = function(){
dir_tmpl_tree.get({id:$scope.project_selected}, function(success){
                        
                        console.log('success');    
                        //$('#jstreeBuilds').jstree();
                        //$('#jstreeBuilds').jstree(true).settings.core.data = success.dirs;
                        //$('#jstreeBuilds').jstree(true).refresh();

                        $('#jstreeFolders').jstree();
                        $('#jstreeFolders').jstree(true).settings.core.data = success.dirs;
                        $('#jstreeFolders').jstree(true).refresh();
                                                    
                    },function(error){                        
                        $scope.showMessage($scope.getDataError(error), typeError);
                    });
}

/* Ya construidos los arboles cargo los items de elemento plantilla*/
$scope.getItemTree = function(id_direlemento, id_repositorio){

                    /* si no hay elemento seleccionado retornamos ya que no hay elemento_entidad que solicitar al api rest*/ 
                    if(id_direlemento === null){
                        return;
                    }   
                    dir_item_tree.get({id_direlemento:id_direlemento, id_repositorio:id_repositorio}, function(success){
                        
                        console.log('success');    
                        $('#jstreeBuilds').jstree();
                        $('#jstreeBuilds').jstree(true).settings.core.data = success.dirs;
                        $('#jstreeBuilds').jstree(true).refresh();                        

                    },function(error){
                        $('#jstreeBuilds').jstree(true).settings.core.data = {};
                        $('#jstreeBuilds').jstree(true).refresh(); 
                        $scope.showMessage($scope.getDataError(error), typeError);  
                    });
}

// $scope.printTree = function(){

//     var v = $('#jstreeFolders').jstree(true).get_json('#', {flat:true})
//     var mytext = JSON.stringify(v);
//     console.log(mytext);

//     //$('#jstree').jstree(true).settings.core.data = $scope.nodeComponente;
//     $('#jstree').jstree(true).refresh();
// }


// $scope.load_components = function(){
//     $scope.components = [];
//     $scope.components = componente_env.query({id_entorno:$scope.environment_selected}, function(success){
//                             console.log('success');
//                             console.log(success);
//                             $scope.createTreeModel(); 
                            
//                         },function(error){
//                             $scope.showMessage($scope.getDataError(error)); 
//         });
// }

// $scope.createTreeModel = function(){
    
//    console.log('init');
//     $scope.nodeComponente=[];
//     proccess = [];
//     angular.forEach($scope.components, function(value, key){

//         console.log(value);

//         proccess.push(1);
//         plantillas_comp.query({id:value.id_componente}, function(success){
//             proccess.pop();
//             add_templates(proccess, value, success);
//         },function(error){
//             proccess.pop();
//             add_templates(proccess, value, null);  
//         });

//     })

// }


// function add_templates(proccess, componente, plantillas){
    
//     var nodePlantillas=[];
    
//     if(plantillas != null){

//         angular.forEach(plantillas, function(value, key){    
//             nodePlantillas.push({'parent': componente.id_componente, 'text':value.nombre + '<sub style="color:#CCCCCC">'  + value.lang.nombre + '</sub>', 'icon':"glyphicon glyphicon-file", 'li_attr':{'data-renderas':'template', 'data-renderid': value.id_plantilla, 'data-rendername': value.nombre}});
//         });
//         $scope.nodeComponente.push({'id': componente.id_componente,'text':componente.nombre, 'icon':"glyphicon glyphicon-folder-open", 'children':nodePlantillas, 'li_attr':{'data-renderas':'component','data-renderid': componente.id_componente, 'data-rendername': componente.nombre}});

//     }

//     //Render -> Wait
//     if(proccess.length<=0){
//         $("#jstree").jstree('destroy');
//         $scope.load();
//         console.log('--------------------------------------------------');
//         console.log($scope.nodeComponente);
//         $('#jstree').jstree(true).settings.core.data = $scope.nodeComponente;
//         $('#jstree').jstree(true).refresh();
//         setTimeout(function(){$scope.infoBubble('Drag Templates here!','#jstreeFolders');},2000);
        
//     }

    

// }



// $scope.reload_tree = function(){
//     console.log('push');

//     $scope.createTreeModel();
//     $scope.load();
 

// }


// console.log($scope.components);


        
        $scope.tabs = [];
        // $scope.isTabSelected=false;
        $scope.current_template;




        // $scope.load = function(){




            //$.jstree.defaults.core.dblclick_toggle = false;
            //$("#jstree").jstree.defaults.dnd.always_copy = true;




        // }

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
            console.log('nodeeeeeee');
            console.log(node);
            directorioelemento.$save(function(success){
                console.log(success);
                
                // if(nodeDef != null || nodeDef != undefined){
                //     nodeDef.id = success.id_direlemento;
                //     nodeDef.parent = success.id_directorio;
                //     //nodeDef.li_attr.data-renderiddirtemplate = success.id_dirplantilla;
                //     $scope.addTreeNode(node, nodeDef, $('#jstreeFolders').jstree(true));
                // }

                if(nodeDef != null && nodeDef.li_attr['data-renderas']=='file'){
                    //Se agrega el nodoDef solo para archivos ya que las plantillas son agregadas por DND
                    $scope.addTreeNode(node, nodeDef, $('#jstreeFolders').jstree(true));
                    $('#file-create-modal').modal('hide');
                    $('#file-edit-modal').modal('hide');
                    //$scope.showMessage("<b>" + nodeDef['text'] + "</b> was created.");
                }else{
                    node.li_attr["data-renderiddirtemplate"] = success.id_direlemento;
                    console.log(node);
                }

            },function(error){
                
                $scope.showMessage($scope.getDataError(error), typeError);
                $('#jstreeFolders').jstree(true).delete_node(node); 
                //delete from restapi
                //agregar la llamada al metodo delete_archivo
            });
            
        } 

        $scope.delete_directorioelemento = function(id_direlemento, node){

            directorioelemento.delete({id: id_direlemento},function(success){
                console.log('****************************************************');
                console.log(node);           
                
                //delete from tree
                $('#jstreeFolders').jstree(true).delete_node(node);

                
            },function(error){
                
                $scope.showMessage($scope.getDataError(error), typeError);

            });
            
        }

        $scope.update_directorioelemento_asList = function(){

            dirElemento = new directorioelemento();
            var $btn = $('#chkAsList').button('loading')
    // business logic...
    console.log('?????????????????????????????');
    
            directorioelemento.get({id: $scope.direlemento_selected.id}, function(success){
                dirElemento = success;
                dirElemento.entidades_en_lista = $scope.asListModel.value ? 1 : null;
                dirElemento.$update(function(success){
                    //console.log(success);
                    //console.log(success.entidades_en_lista);
                    //console.log($scope.node_item_selected.li_attr['data-renderaslist']);
                    $scope.node_item_selected.li_attr['data-renderaslist']=success.entidades_en_lista;
                    //console.log($scope.node_item_selected.li_attr['data-renderaslist']);

                //nodeChild = $('#jstreeBuilds').jstree(true).get_node(''+$scope.node_item_selected.id)
                //console.log(nodeChild.li_attr['data-renderid'] + nodeChild.li_attr['data-renderentity']);
                //obj[nodeChild.li_attr['data-renderid']] = parseInt(nodeChild.li_attr['data-renderentity']);


                    $btn.button('reset')                    
                },function(error){
                    $scope.showMessage($scope.getDataError(error),typeError);
                    $btn.button('reset')
                });

            }, function(error){
                $scope.showMessage($scope.getDataError(error), typeError);
                $btn.button('reset')
            })

        }


        $scope.update_directorioelemento = function(id, id_parent){

            dirElemento = new directorioelemento();

            directorioelemento.get({id: id}, function(success){
                dirElemento = success;
                dirElemento.id_directorio = id_parent;
                dirElemento.$update(function(success){
                },function(error){
                    $scope.showMessage($scope.getDataError(error),typeError);
                });

            }, function(error){
                $scope.showMessage($scope.getDataError(error),typeError);
            })

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
                                'li_attr':{'data-renderas':"folder",
                                            'data-renderid': success.id_directorio, 
                                            'data-rendername':success.nombre
                                        }
                            }
                console.log($scope.node_selected)
                console.log(nodeDef);
                $scope.addTreeNode($scope.node_selected, nodeDef, $('#jstreeFolders').jstree(true));
                $('#folder-create-modal').modal('hide');
            },function(error){
               $scope.showMessage($scope.getDataError(error),typeError);
            });
            //$scope.GencoDirectorios = new directorio();
            
        } 


        $scope.delete_directorio = function(id_directorio, node){

            directorio.delete({id_directorio: id_directorio},function(success){
                console.log('****************************************************');
                console.log(node);           
                
                //delete from tree
                $('#jstreeFolders').jstree(true).delete_node(node);

                
            },function(error){
                $scope.showMessage($scope.getDataError(error),typeError);

            });
            
        }


        $scope.load_directorio = function(id_folder){

            console.log(id_folder);
            var data = directorio.get({id_directorio:id_folder}, 
                                        function(success){
                                            $scope.GencoDirectorios = data;                                
                                        }, 
                                        function(error){
                                            $scope.showMessage($scope.getDataError(error), typeError);
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
                $scope.showMessage($scope.getDataError(error), typeError);
            });
            //$scope.GencoDirectorios = new directorio();
            
        } 

        /*
        * data: datos del nodo seleccionado que activa el menu, de esta se puede obtener el nodo seleccionado, y una instancia para 
                manipular el arbol.
        */
        $scope.addTreeNode = function(node, newNode, jsTree){
            console.log(jsTree);
            //if(jsTree!= null || jsTree != undefined){
                jsTree.create_node(node.id,newNode);                
           // }else{
                //var inst = $.jstree.reference(data.reference),
                //obj = inst.get_node(data.reference);
                //inst.create_node(obj, newNode, "last", function (new_node) {
                //    console.log(new_node);
                //})

          //  }
            
        }

        $scope.renameTreeNode = function(node, newText){

             //   var inst = $.jstree.reference(data.reference),
             //   obj = inst.get_node(data.reference);
                //console.log(data);
                //console.log('rename');
                //console.log(newText);
                //console.log(obj);
                $('#jstreeFolders').jstree('set_text', node, newText);
           
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
                obj = $scope.node_selected; //inst.get_node($scope.node_selected.reference);
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

                console.log($scope.node_selected);
                obj = $scope.node_selected; //inst.get_node($scope.node_selected.reference);

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
                                            $scope.showMessage($scope.getDataError(error), typeError);
                                        });
                                                                      
                                    }, 
                                    function(error){
                                        $scope.showMessage($scope.getDataError(error), typeError);
                                    });

        }

        $scope.load_template = function(id_template){

            template.get({id_plantilla:id_template}, function(success){
                                    console.log(success);
                                    
                                    //$scope.tabs.push({id_plantilla:id_template, nombre: data.templateName ,content: data.fileContent});
                                    $scope.templateName = success.templateName;
                                    console.log($scope.templateName );
                                    //$scope.GencoArchivos.descripcion = success.descripcion;
                                    editor3.setValue(success.fileContent);
                                },function(error){
                                    $scope.showMessage($scope.getDataError(error), typeError);
            });

        }


        $scope.delete_file = function(id_file, node){

            archivo.delete({id: id_file},function(success){
                console.log('****************************************************');
                console.log(node);           
                
                //delete from tree
                $('#jstreeFolders').jstree(true).delete_node(node);

                
            },function(error){
                
                $scope.showMessage($scope.getDataError(error), typeError);

            });
            
        }


        $scope.load_repository = function(){
            repository.query(
                            function(success){
                                $scope.repositories = success;
                                //$('#repository-change-modal').modal('show');
                            }, 
                            function(error){
                                $scope.showMessage($scope.getDataError(error), typeError);
            });
        }


        $scope.infoBubble = function(message, elementId){

            var p = $( elementId );
            var position = p.offset();
            var iwith = p.width();
            $('#popBubbleText').html(message);
            $("#popBubble").css({top: position.top-60, left: position.left-180, position:'absolute'});
            $("#popBubble").show("fast", function(){
                setTimeout(function(){hideBubble()},3000);
            });

        }
        function hideBubble(){
            $("#popBubble").hide("fast");
        }


        $scope.change_repository = function(repository){
            console.log(repository.nombre);
            $scope.repository_selected.data = repository;
            $scope.load_entities(repository.id_repositorio);            
            $scope.getItemTree($scope.direlemento_selected.id, $scope.repository_selected.data.id_repositorio);

            
            
        }


        $scope.new_elemento_entidad = function(id_direlemento, id_entidad){

            console.log($scope.direlemento_selected.nombre);
            //$('#jstreeBuilds').jstree('create_node', $("#jstreeBuilds"), nodeDef, 'last', false, false);            
            //$("#jstreeBuilds").jstree(true).select_node('#');
            //var node = $('#jstreeBuilds').jstree(true).get_node('1')
            //console.log(node)
            //var parent = $('#jstreeBuilds').jstree('get_selected');
            //$('#jstreeBuilds').jstree(true).create_node('#',nodeDef);


            //console.log(parent);
            //var newNode = { state: "open", data: "New nooooode!" };
            //$('#jstreeBuilds').jstree("create_node", parent, "last", newNode, false, false);
            // console.log(node);
            // var inst = $('#jstreeBuilds').jstree.reference(node.reference),
            // obj = inst.get_node(node.reference);
            // $('#jstreeBuilds').jstree(true).create_node(obj, nodeDef, "last", function (new_node) {
            //     console.log(node);
            // })


            //$('#jstreeBuilds').jstree('create_node', '#', nodeDef, 'last');
            //console.log(nodo);            
            $scope.GencoElementoEntidad = new plantillaentidad();
            $scope.GencoElementoEntidad.id_direlemento = id_direlemento;
            $scope.GencoElementoEntidad.id_entidad = id_entidad;
            $scope.GencoElementoEntidad.tags = $scope.direlemento_selected.tags;
            //$scope.GencoElementoEntidad.entidades_en_lista = $('#chkAsList').val() ? 1 : 0;
            $scope.save_elemento_entidad();
      
        }

        $scope.save_elemento_entidad = function(){
            $scope.GencoElementoEntidad.$save(function(success){
                console.log(success);
                var nodeName = $scope.direlemento_selected.nombre + '<sub style="color:#CCCCCC">@</sub>' + '<b>' + $("#cbxEntity option:selected").text(); + '</b>';

                var nodeDef = {'id': success.id_elementoentidad, 
                                'parent': '#', 
                                'text': nodeName, 
                                'icon':"glyphicon glyphicon-folder-open", 
                                'li_attr':{'data-renderas':"direlemento",
                                            'data-renderid': success.id_elementoentidad, 
                                            'data-rendername':$scope.direlemento_selected.nombre,
                                            'data-renderentity': success.id_entidad
                                        }
                            }
                $scope.addTreeNode($('#jstreeBuilds').jstree(true).get_node('#'), nodeDef, $('#jstreeBuilds').jstree(true));
                var nodeChild = {};
                if (success.tags!= null || success.tags != undefined){
                    //tags = getIterableFromTags(elemento.tags)  
                    console.log( ''+success.tags)  
                    var data = JSON.parse(''+success.tags);
                    console.log(data);

                    ///var obj = {a: 1, b: 2};
                    //var data = {"UI/abm 2-076c017c-5fcc-218d": -1};
                    for (var key in data) {
                      if (data.hasOwnProperty(key)) {
                        var val = data[key];
                        nodeChild = {'id': key + success.id_elementoentidad, 
                                    'parent': success.id_elementoentidad, 
                                    'text': key + '<sub style="color:#CCCCCC">@</sub>' + '<b></b>', 
                                    'icon':"glyphicon glyphicon-file", 
                                    'li_attr':{'data-renderas':"tagelemento", 
                                                'data-renderid': key, 
                                                'data-rendername': key,
                                                'data-renderentity': -1
                                            }
                                    }
                        $scope.addTreeNode($('#jstreeBuilds').jstree(true).get_node(''+success.id_elementoentidad), nodeChild, $('#jstreeBuilds').jstree(true));
                      }
                    }
                    // for (var key in data){
                    //     console.log(key);
                    //     //key will be -> 'id'
                    //     //dictionary[key] -> 'value'
                    //     // nodeChild = {'id': key + success.id_elementoentidad, 
                    //     //             'parent': success.id_elementoentidad, 
                    //     //             'text': key + '<sub style="color:#CCCCCC">@</sub>' + '<b></b>', 
                    //     //             'icon':"glyphicon glyphicon-file", 
                    //     //             'li_attr':{'data-renderas':"file", 
                    //     //                         'data-renderid': key, 
                    //     //                         'data-rendername': key}
                    //     //             }
                    //     // $scope.addTreeNode($('#jstreeBuilds').jstree(true).get_node(''+success.id_elementoentidad), nodeChild, $('#jstreeBuilds').jstree(true));
                    // }
                        
                }
                 
                //$('#chkAsList').prop('checked', false);
            },function(error){
                
                $scope.showMessage($scope.getDataError(error), typeError);
            }); 
        }


        $scope.update_elemento_entidad = function(id_direlemento, id_entidad){

            //console.log($scope.elementoentidad_selected.id);
            //node = $('#jstreeBuilds').jstree(true).get_node(''+$scope.elementoentidad_selected.id)
            node = $scope.node_item_selected;

            var id_elementoentidad = node.li_attr['data-renderid'];


            console.log(node);
            var obj={};
            var nodeChild;
            for(var i = 0; i < node.children_d.length; i++) {
                nodeChild = $('#jstreeBuilds').jstree(true).get_node(''+node.children_d[i])
                //console.log(nodeChild.li_attr['data-renderid'] + nodeChild.li_attr['data-renderentity']);
                obj[nodeChild.li_attr['data-renderid']] = parseInt(nodeChild.li_attr['data-renderentity']);
            }    
            
            //console.log(obj);
            //console.log(JSON.stringify(obj));

            $scope.GencoElementoEntidad = new plantillaentidad();
            $scope.GencoElementoEntidad.id_direlemento = id_direlemento;
            $scope.GencoElementoEntidad.id_entidad = id_entidad;
            $scope.GencoElementoEntidad.id_elementoentidad = id_elementoentidad;
            $scope.GencoElementoEntidad.tags = JSON.stringify(obj);
            //$scope.GencoElementoEntidad.entidades_en_lista = $('#chkAsList').val()? 1 : 0;

            $scope.GencoElementoEntidad.$update(function(success){
                //console.log(success);
                var nodeName = $scope.direlemento_selected.nombre + '<sub style="color:#CCCCCC">@</sub>' + '<b>' + $("#cbxEntity option:selected").text(); + '</b>';

                //$scope.addTreeNode($('#jstreeBuilds').jstree(true).get_node('#'), nodeDef, $('#jstreeBuilds').jstree(true));
                //console.log('dfdfdfddddddddddd');
                //console.log($("#cbxEntity option:selected").text());
                $scope.renameTreeNode($scope.node_item_selected, nodeName);
                $('#template-entities-modal').modal('hide');
                //$('#chkAsList').prop('checked', false);
            },function(error){
                $scope.showMessage($scope.getDataError(error), typeError);
            });


        }


        $scope.update_elemento_entidad_tag = function(id_direlemento, id_entidadTag){

            nodeTag = $scope.node_item_selected;
            var id_elementoentidad = $scope.elementoentidad_selected.id;


            var nodeDirelemento = $('#jstreeBuilds').jstree(true).get_node(''+nodeTag.parent);
            var id_entidad = nodeDirelemento.li_attr['data-renderentity'];

            var obj={};
            var nodeChild;
            for(var i = 0; i < nodeDirelemento.children_d.length; i++) {
                nodeChild = $('#jstreeBuilds').jstree(true).get_node(''+nodeDirelemento.children_d[i]);
                if($scope.elementoentidad_selected.tag == nodeChild.li_attr['data-renderid']){
                    obj[nodeChild.li_attr['data-renderid']] = parseInt(id_entidadTag);
                }else{
                    obj[nodeChild.li_attr['data-renderid']] = parseInt(nodeChild.li_attr['data-renderentity']);
                }                
            }    
            
            $scope.GencoElementoEntidad = new plantillaentidad();
            $scope.GencoElementoEntidad.id_direlemento = id_direlemento;
            $scope.GencoElementoEntidad.id_entidad = id_entidad;
            $scope.GencoElementoEntidad.id_elementoentidad = id_elementoentidad;
            $scope.GencoElementoEntidad.tags = JSON.stringify(obj);
            //$scope.GencoElementoEntidad.entidades_en_lista = $('#chkAsList').val()? 1 : 0;

            $scope.GencoElementoEntidad.$update(function(success){
                //console.log(success);
                var nodeName = $scope.elementoentidad_selected.tag + '<sub style="color:#CCCCCC">@</sub>' + '<b>' + $("#cbxEntityTag option:selected").text(); + '</b>';

                //$scope.addTreeNode($('#jstreeBuilds').jstree(true).get_node('#'), nodeDef, $('#jstreeBuilds').jstree(true));
                //console.log('dfdfdfddddddddddd');
                //console.log($("#cbxEntity option:selected").text());
                $scope.renameTreeNode($scope.node_item_selected, nodeName);
                $('#template-entities-tag-modal').modal('hide');
                //$('#chkAsList').prop('checked', false);
            },function(error){
                $scope.showMessage($scope.getDataError(error), typeError);
            });


        }


        $scope.delete_elementoentidad = function(id_elementoentidad, node){

            //var id_elementoentidad = node.li_attr['data-renderid'];

            plantillaentidad.delete({id: id_elementoentidad},function(success){
                $('#jstreeBuilds').jstree(true).delete_node(node); 
            },function(error){
                $scope.showMessage($scope.getDataError(error), typeError);
            });
            
        }

        $scope.load_entities = function(id_repositorio){

            $scope.types_types=entity_repo.query({id_repositorio:id_repositorio}, 
                                        function(success){
                                            //$scope.GencoDirectorios = data; 
                                            console.log(success);                               
                                        }, 
                                        function(error){
                                            $scope.showMessage($scope.getDataError(error), typeError);
                                        }
                );
            
        }

        $scope.showMessage = function(message, type){
            $('#imConfirm').html(message);

            $('#borderMessage').css('border-left-color', '#eee');
            
            if(type==typeError){
                $('#borderMessage').css('border-left-color', '#d9534f');
            }else if(type==typeInfo){
                $('#borderMessage').css('border-left-color', '#5bc0de');
            }else if(type==typeWarning){
                $('#borderMessage').css('border-left-color', '#f0ad4e');
            }

            $('#message-modal').modal('show');

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


    $scope.buildProject = function(){
        if($scope.repository_selected.data == null || $scope.repository_selected.data == undefined){
            $scope.infoBubble('Select Repository!','#dropdownRepo');  
            return;                                  
        }
        var $btn = $('#btnBuildProject').button('loading');



// $http({
//     url: 'http://127.0.0.1:8000/gencoui/buildproject/1/1',
//     method: "GET",
//     headers: {
//        'Content-type': 'application/json'
//     },
//   responseType: "arraybuffer"
// }).success(function (data, status, headers, config) {
//     console.log(data);
//    var file = new Blob([data], { type: 'application/binary' });
// var fileURL = URL.createObjectURL(file);
// window.open(fileURL);
// var link=document.createElement('a');
// link.href=fileURL;
// link.download="testing.zip";
// link.click();
//     window.open(objectUrl);
// }).error(function (data, status, headers, config) {
//     //upload failed
// });


        console.log('inciciando build');
        var respuesta = buildproject.getBuild($scope.project_selected, $scope.repository_selected.data.id_repositorio, $scope.name_project_selected, $scope.showMessage, $scope.getDataError);
        console.log('respuesta ' + respuesta);
        //$scope.showMessage('The project was build successfully', typeInfo);
        $btn.button('reset');
//             function(success){
//                 $btn.button('reset');
//                 $scope.showMessage('The project was build successfully', typeInfo);
//                 // var anchor = angular.element('<a/>');
//                 // anchor.attr({
//                 //     href: 'data:attachment/zip;charset=utf-8,' + encodeURI(success),
//                 //     target: '_blank',
//                 //     download: 'build.zip'
//                 // })[0].click();

// /*
//                 var a = document.createElement('a');
//                 var blob = new Blob([success], {'type':"application/zip"});
//                 a.href = URL.createObjectURL(blob);
//                 a.download = "takeatool.zip";
//                 a.click();
// */              
//                 //console.log(success);
//                 // var blob = new Blob([success], {type: "application/binary"});
//                 // var fileURL = URL.createObjectURL(blob);
//                 // window.open(fileURL);
//                 // //var fileName = "QCPReport.zip";
//                 // //var blob = success;
//                 // console.log('blob');
//                 // console.log(blob);

//                 //console.log('data:attachment/csv;charset=utf-8,' + encodeURI(success));
//                 //saveAs(blob, fileName);

//                 // uriContent = "data:application/zip," + encodeURIComponent(success);
//                 // console.log(uriContent);
//                 // newWindow=window.open(uriContent, 'takeatool.zip');


//                 // var blob2=new Blob([success]);
//                 // console.log(blob2);
//                 //     var link=document.createElement('a');
//                 //     link.href=window.URL.createObjectURL(blob2);
//                 //     link.download="myFileName.txt";
//                 //     link.click();

//                 // var URL = $window.URL || $window.webkitURL || $window.mozURL || $window.msURL;
//                 //     if ( URL ) {
//                 //         var blob = new Blob([success],{type:'application/zip'});
//                 //         var url = URL.createObjectURL(blob);
//                 //         $window.open(url);
//                 //     }

//             },function(error){
//                 $btn.button('reset');
//                 $scope.showMessage($scope.getDataError(error), typeError);
//             });
    }

        $scope.template_entities_load = function(id_plantilla){

            plantillas.get({id: id_plantilla},function(success){
                console.log(success);
                $scope.template_tags = JSON.parse(success.tags);                
                //$scope.reload_tree();
                //$('#template-delete-modal').modal('hide');
            },function(error){
                console.log(error);
            });

            console.log('obtener entidades');
            console.log($scope.repository_selected)

            entity_repo.query({id_repositorio: $scope.repository_selected.data.id_repositorio}, 
                function(success){
                    //angular.element($("#ctrl_editor")).scope().$apply();
                    if(!$scope.$$phase) {
                          $scope.$apply();
                    }
                    $scope.all_entities = success;
    
                    console.log(success);
                    $('#template-entities-modal').modal('show');

                },
                function(error){
                    console.log(error);
                })


        }



        // $scope.add_entity =  function(index){
        //     // var id_entity = $scope.all_entities[index].id_entidad;
        //     var entitySelected = $scope.all_entities[index];
        //     var entityAdded = { entity:null, scope:null};
        //     entityAdded.entity = entitySelected;

        //     // $scope.entity_added
        //     // $scope.entities_added.push($scope.all_entities[index]);
        //     entitydef.query({id_entidad:entitySelected.id_entidad}, function(success){
        //             // proccess.pop();
        //             // $scope.entity_scope.push(success);
        //             entityAdded.scope = success;

        //             $scope.entities_added.push(entityAdded);
        //             //$scope.GencoEntidadFields =success;
        //         },function(error){
        //             // proccess.pop();
        //             console.log(error);
        //         });

        // }




        // $scope.save_entity_selecteds = function(id_entity){
            
        //     console.log($scope.entities_added);
        // }


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


        /*Cargar valores inciales*/
        setListenterContent();
        //$scope.load_components();
        $scope.load_repository();
        $scope.getCmpTree();
        $scope.getDirTree();




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


}]);

angular.module('app_builds').config(['$httpProvider',function($httpProvider){

    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

}])

// angular.module('app_builds').directive('emitLastRepeaterElement', function($timeout) {
//  var itr_plantillas = 0;   

//     return {
//         restrict: 'A',
//         link: function (scope, element, attr) {
//             if (scope.$last === true) { 

//                 if(attr['renderas'] == 'archive'){
 
//                     $timeout(function () {
//                         scope.load();
//                     });

//                 }

//                 if(attr['renderas'] == 'component'){
//                    console.log('termino component'); 
//                 }
                
//             }
//         }

//   };   


// });


angular.module('app_builds').directive('fileModel', ['$parse', function ($parse) {
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

