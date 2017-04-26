angular.module('app_editor', ['ngResource','editor.services','lang.services', 'env.services'])

.controller('ctrl_editor', function($scope, $http, componente_env, componente, plantillas, plantillas_comp, template, lang, tree, env_lang) {

//editors = [];
$scope.environment_selected = $("#key_module").val();
console.log($scope.environment_selected);
$scope.components = [];


$scope.itr_plantillas=0;
$scope.treeModel = [];
// $("#jstree").jstree();
$scope.nodeComponente=[];
//$scope.component_selected;
$scope.component_selected = {
    id: null,
    nombre: null,
};

$scope.template_selected = {
    id: null,
    nombre: null,
};

$scope.GencoPlantillas;
$scope.GencoComponentes;



$scope.langs = [];
$scope.langs=env_lang.get({id:$("#key_module").val()});//lang.query();
// $scope.langs = [];
// $scope.langs=lang.query();


$scope.dataLang = {
    repeatSelectLang: null,
    availableOptions: $scope.langs,
};

$scope.tabs = [];
        // $scope.isTabSelected=false;
$scope.current_template;
$scope.current_pos=0;
$scope.current_editor=null;

editors = [];

$scope.node_selected;
$scope.ConfirmDeleteCallback;


$(function () {

        $(document)
            .on('dnd_move.vakata', function (e, data) {
                var t = $(data.event.target);
                var isRenderas = data.data.obj[0].getAttribute('data-renderas');                

                if(!t.closest('.jstree').length) {
                    if(t.closest('.ace_content').length) {
                        if(isRenderas == undefined || isRenderas == null || isRenderas == 'component'){
                            data.helper.find('.jstree-icon').removeClass('jstree-ok').addClass('jstree-er');
                        }else{
                            data.helper.find('.jstree-icon').removeClass('jstree-er').addClass('jstree-ok');    
                        }                        
                    }
                    else {
                        data.helper.find('.jstree-icon').removeClass('jstree-ok').addClass('jstree-er');
                    }
                }
            })
            .on('dnd_stop.vakata', function (e, data) {
                var t = $(data.event.target);
                console.log(data.data.obj[0].getAttribute('data-renderas'));
                $(this).attr("data-id");
                console.log(t);

                var isRenderas = data.data.obj[0].getAttribute('data-renderas');
                if(isRenderas == undefined || isRenderas == null || isRenderas == 'component'){
                    return;
                }

                console.log(data.data.obj[0].id);
                var node = $('#jstree').jstree(true).get_node(data.data.obj[0].id);
                var nodeParent = $('#jstree').jstree(true).get_node(node.parents[0]);
                console.log(node);
                console.log(nodeParent);

// var lnLevel = 2;
// var loParent = $("#" + data.data.obj[0].id);
//             var lsParents =  data.data.obj[0].innerText + ' >';
//             for (var ln = 0; ln <= lnLevel -1 ; ln++) {
//                 var loParent = loParent.parent().parent();
//                 if (loParent.children()[1] != undefined) {
//                     lsParents += loParent.children()[1].text + " > ";
//                 }
//             }
//             if (lsParents.length > 0) {
//                 lsParents = lsParents.substring(0, lsParents.length - 1);
//             }

//             console.log(lsParents)

                if(t[0].closest('.ace_content')) {
                    console.log('append');
                    $scope.insertKey(node, nodeParent);
                }   

            });
  });


/* Ya construidos los arboles cargo los items de directorio elemento*/
$scope.getDirTree = function(){
tree.get({id:$scope.environment_selected}, function(success){
                        
                        console.log('success');    
                        //$('#jstreeBuilds').jstree();
                        //$('#jstreeBuilds').jstree(true).settings.core.data = success.dirs;
                        //$('#jstreeBuilds').jstree(true).refresh();

                        $('#jstree').jstree();
                        $('#jstree').jstree(true).settings.core.data = success.dirs;
                        $('#jstree').jstree(true).refresh();
                                                    
                    },function(error){                        
                        $scope.showMessage($scope.getDataError(error)); 
                    });
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
//$scope.plantillas = plantillas_comp.query({id:1});




// $scope.treeModel = [];

// {
//   id          : "string" // will be autogenerated if omitted
//   text        : "string" // node text
//   icon        : "string" // string for custom
//   state       : {
//     opened    : boolean  // is the node open
//     disabled  : boolean  // is the node disabled
//     selected  : boolean  // is the node selected
//   },
//   children    : []  // array of strings or objects
//   li_attr     : {}  // attributes for the generated LI node
//   a_attr      : {}  // attributes for the generated A node
// }

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
        $('#jstree').jstree(true).settings.core.data = $scope.nodeComponente;
        $('#jstree').jstree(true).refresh();
    }

    

}



$scope.$on('LastRepeaterElement', function(){
    console.log('emit');
    $("#jstree").jstree();

});


// componente.query(
//                     function(success){
//                         console.log('OK');
//                         console.log(success); //wait_conversion();
//                         // $scope.components = success;
// // $scope.components = [
// //     {
// //         id_componente: 1,
// //         nombre: "UI",
// //         descripcion: "",
// //         id_entorno: 1
// //     },
// //     {
// //         id_componente: 2,
// //         nombre: "Backend",
// //         descripcion: "",
// //         id_entorno: 1
// //     }
// // ];


//                         // load();















//                     },function(error){
//                         console.log('ERR');
//                         console.log(error);  
//                 });
  


// data.then(function onSuccess(response) {
//     // access data from 'response'
//    console.log(response);
//    $scope.components = response;
// },
// function onFail(response) {
//     // handle failure
// });
// angular.forEach(angular.fromJson(data).list, function(item){
//     console.log(item);
// })

// console.log($scope.components);

// tmp.$promise.then(function (data) {
//         console.log(data);
//         $scope.components = data;
// });




// $scope.components = [
//     {
//         id_componente: 1,
//         nombre: "UI",
//         descripcion: "",
//         id_entorno: 1
//     },
//     {
//         id_componente: 2,
//         nombre: "Backend",
//         descripcion: "",
//         id_entorno: 1
//     }
// ];

$scope.reload_tree = function(){
    console.log('push');

    $scope.createTreeModel();
    $scope.load();
    //$scope.load();

//     var tmp = new plantillas({
//         id_plantilla: 4,
//         nombre: "Controler",
//         descripcion: "",
//         id_lenguaje: 1,
//         id_lenguajeprocesador: 1,
//         id_componente: 1
//     })

// $scope.plantillas.push(tmp);
// $scope.load();
// console.log($scope.plantillas);
//     $('#jstree').jstree(true).settings.core.data = [
//             'Simple root node',
//             {
//                 'id' : 'node_2',
//                 'text' : 'Root node with options',
//                 'state' : { 'opened' : true, 'selected' : true },
//                 'children' : [ { 'text' : 'Child 1' }, 'Child 2']
//             },
//             {
//                 'id' : 'node_3',
//                 'text' : 'Root node with options',
//                 'state' : { 'opened' : true, 'selected' : true },
//                 'children' : [ { 'text' : 'Child 1' }, 'Child 2']
//             }

//         ];
// $('#jstree').jstree(true).refresh();

}


console.log($scope.components);

                        // $scope.templates = [
                        //     {
                        //         "id_plantilla": 1,
                        //         "nombre": "ORM",
                        //         "descripcion": "",
                        //         "archivo": "http://localhost:8000/user_templates/user_templates/PlantillaORM_multiple.xsl",
                        //         "id_lenguaje": 1,
                        //         "id_lenguajeprocesador": 1,
                        //         "id_componente": 1
                        //     },
                        //     {
                        //         "id_plantilla": 2,
                        //         "nombre": "DAO",
                        //         "descripcion": "http://localhost:8000/user_templates/user_templates/PlantillaORM_multiple.xsl",
                        //         "archivo": null,
                        //         "id_lenguaje": 1,
                        //         "id_lenguajeprocesador": 1,
                        //         "id_componente": 1
                        //     },
                        //     {
                        //         "id_plantilla": 3,
                        //         "nombre": "Controler",
                        //         "descripcion": "",
                        //         "archivo": null,
                        //         "id_lenguaje": 1,
                        //         "id_lenguajeprocesador": 1,
                        //         "id_componente": 1
                        //     }
                        // ];


/** holds tabs, we will perform repeat on this **/
        // $scope.tabs = [{
        //     id:1,
        //     content:'This is a default tab on load'
        // }]
        
        

            $("#jstree").jstree({
                //'core':{check_callback : true},
                "core" : {
                "check_callback" : function (operation, node, node_parent, node_position, more) {
                        // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
                        // in case of 'rename_node' node_position is filled with the new node name                      
                        

                        if(operation == 'move_node'){
                            var validator;
                            console.log('core check');
                            console.log(node_parent);
                            if(node_parent==null || typeof node_parent.li_attr == 'undefined'){
                                return false;
                            }
                                

                            console.log(node_parent.li_attr['data-renderas']); 
                            console.log(node_parent);
                            var renderas = node_parent.li_attr['data-renderas'];
                            console.log(renderas);
                            console.log(node_parent);

                            if(typeof renderas == 'undefined'){
                                return false;
                            }
                           // console.log(node.data['renderas']);
                           // console.log(node_parent.data['renderas']);                       
                            validator = renderas === 'component' ? true : false;    
                            if(validator){
                                //console.log(node_parent);
                                //console.log(node);
                                validator = node.li_attr['data-renderas'] === 'template' ? true : false; 

                            }   
                            return validator;
                        }
                        return true;
                    }
            },
            "crrm" : { move : { check_move : function (m) { return false; } } },
            "plugins" : [  "contextmenu","dnd", "sort","crrm" ],
            "contextmenu": {
                "items": function ($node) {

                    console.log($node.li_attr['data-renderas'] );

                    if($node.li_attr['data-renderas'] === 'component')
                        return {

                            "Rename": {
                                "label": "Edit Component",
                                "action": function (data) {
                                   // this.rename(obj);
                                    console.log(data);
                                    
                                    var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                    $scope.node_selected = obj;
                                    //inst.edit(obj);
                                    
                                    $scope.component_selected.nombre = obj.text;
                                    $scope.component_selected.id = obj.id;
                                    console.log($scope.component_selected);
                                    $scope.load_component(obj.id);
                                    //Hago que la interfaz refresque el titulo con el valor de component_selected
                                    angular.element($("#ctrl_editor")).scope().$apply();
                                    //$('#component-edit-modal').modal('show');
                                    $('#component-edit-modal').modal('show').on('shown.bs.modal', function() {
                                            $('#component-edit-modal #id_nombre').focus();
                                    });
        
                                }
                            },
                            "Delete": {
                                "label": "Delete Component",
                                "action": function (data) {
                                    var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                    $scope.node_selected = obj;
                                    //inst.edit(obj);                                    
                                    $scope.component_selected.nombre = obj.text;
                                    $scope.component_selected.id = obj.id;                                    
                                    $scope.showConfirmDelete("Do you really want to delete <b>" + obj['text'] + "</b> component?");
                                    $scope.ConfirmDeleteCallback = function(){$scope.delete_component()}
                                    
                                }
                            },
                            "CreateTempl": {
                                "label": "Create Template",
                                "separator_before": true,
                                "action": function (data) {
                                    var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                    //inst.edit(obj);
                                    $scope.node_selected = obj;
                                    
                                    $scope.component_selected.nombre = obj.text;
                                    $scope.component_selected.id = obj.id;
                                    $scope.new_template($scope.component_selected.id);                                    
                                    //Hago que la interfaz refresque el titulo con el valor de component_selected
                                    angular.element($("#ctrl_editor")).scope().$apply();
                                    $('#template-create-modal').modal('show');
                                    $('#template-create-modal').modal('show').on('shown.bs.modal', function() {
                                            $('#template-create-modal #id_nombre').focus();
                                    });
                                    //this.create(obj);
                                //     //alert('render');
                                //     //getCode();


                                }
                                
                            },
                        };
                    else{
                        return {

                  //           "Open": {
                  //               "label": "Open Template",
                  //               "action": function (data) {
                  //                  // this.rename(obj);
                  //                   //$('#template-edit-modal').modal('show')
                  //                   console.log('open');
                  // //                    var inst = $.jstree.reference(data.reference),
                  //                   // obj = inst.get_node(data.reference);
                  //                   // inst.edit(obj);
                  //                   // console.log(data);
                  //               }
                  //           },
                            "Rename": {
                                "label": "Edit Template",
                                "action": function (data) {
                                    var inst = $.jstree.reference(data.reference);
                                    obj = inst.get_node(data.reference);
                                    $scope.node_selected = obj;
                                    // var instP = $.jstree.reference(obj.parent.reference);
                                    // objP = instP.get_node(obj.parent.reference);
                                    console.log('debut');
                                    console.log(obj.parenteNode);    
                                    console.log(obj.parent);    
                                    console.log($("#"+obj.parent).attr("data-rendername"));
                                    $scope.component_selected.nombre = $("#"+obj.parent).attr("data-rendername");;
                                    $scope.component_selected.id = $("#"+obj.parent).attr("data-renderid");;
                                    $scope.template_selected.nombre = obj.li_attr['data-rendername'];
                                    $scope.template_selected.id = obj.li_attr['data-renderid'];
                                    $scope.load_template($scope.template_selected.id);
                                    //$('#template-edit-modal').modal('show');
                                    $('#template-edit-modal').modal('show').on('shown.bs.modal', function() {
                                            $('#template-edit-modal #id_nombre').focus();
                                    });
                                    console.log(data);
                  //                    var inst = $.jstree.reference(data.reference),
                                    // obj = inst.get_node(data.reference);
                                    // inst.edit(obj);
                                    // console.log(data);
                                }
                            },
                            "Delete": {
                                "label": "Delete Template",
                                "action": function (data) {
                                    var inst = $.jstree.reference(data.reference);
                                    obj = inst.get_node(data.reference);
                                    $scope.node_selected = obj;
                                    //inst.edit(obj);
                                    
                                    $scope.template_selected.nombre = obj.li_attr['data-rendername'];
                                    $scope.template_selected.id = obj.li_attr['data-renderid'];
                                    $scope.showConfirmDelete("Do you really want to delete <b>" + obj['text'] + "</b> template?");
                                    $scope.ConfirmDeleteCallback = function(){$scope.delete_template()}
                                    //$scope.new_template(obj.id);
                                    //angular.element($("#ctrl_editor")).scope().$apply();
                                    //$('#template-delete-modal').modal('show');
                                }
                            }
                        };
                    }

                }
            }
            });


            $.jstree.defaults.core.dblclick_toggle = false;

            $("#jstree").bind("dblclick.jstree", function (event) {
                event.preventDefault();
                console.log('ress'); 
               var node = $(event.target).closest("li");
               // var data = node.data;

               var renderas =node.data("renderas");
               var id =node.data("renderid");
               // Do my action
               
               if(renderas === 'template'){
                console.log(node.text()); 
                $scope.addTab(id.toString(), node.text());
               }
               
            });

            $('#jstree').on('click.jstree', function (e, data) {
                console.log(data);
                   // var loMainSelected = data;
                   // console.log(loMainSelected.node.parents);
                    //$scope.component_selected = loMainSelected.node.parents;
            });


            // $("#jstree").on("dblclick", 'li a', function (event) {  
            //     $.jstree.defaults.core.dblclick_toggle = false;

            //     console.log('renderasvvvvv');
            //     var node = $(event.target).closest("li");
            //     // var node = $(event.target);
            //    // var data = node.data;
            //    console.log(node.li[0].id);
            //    var renderas =node.data("renderas");
            //    var id =node.data("renderid");
            //    // Do my action

            //    console.log(renderas);
               
            //    if(renderas === 'archive'){
            //     console.log(node); 
            //     $scope.addTab(id.toString());
            //    }

            //     event.preventDefault();

            // });

    

        $scope.new_component = function(){

            $scope.GencoComponentes = new componente();
            console.log($scope.GencoComponentes);
            $scope.GencoComponentes.id_entorno = ""+$scope.environment_selected;
            //$('#component-create-modal').modal('show');
            $('#component-create-modal').modal('show').on('shown.bs.modal', function() {
                    $('#component-create-modal #id_nombre').focus();
            });

      
        }

        $scope.save_component = function(){

            console.log($scope.GencoComponentes);
            $scope.GencoComponentes.$save(function(success){   
                //$scope.load_components();      
                var nodeDef = {'id': success.id_componente, 
                                'parent': '#', 
                                'text': success.nombre, 
                                'icon':"glyphicon glyphicon-folder-open", 
                                'li_attr':{'data-renderas':"component",
                                            'data-renderid': success.id_componente, 
                                            'data-rendername':success.nombre
                                        }
                            }
                $scope.addTreeNode($('#jstree').jstree(true).get_node('#'), nodeDef, $('#jstree').jstree(true));
                $('#component-create-modal').modal('hide')
            }, function(error){
                $scope.showMessage($scope.getDataError(error));
            });
            
        } 

        $scope.delete_component = function(){

            componente.delete({id: $scope.component_selected.id},function(success){                
                console.log(success);
                //$scope.reload_tree();
                $('#jstree').jstree(true).delete_node($scope.node_selected); 
            },function(error){
                $scope.showMessage($scope.getDataError(error));
            });
            //     console.log(success);           
            //     $scope.load_components();
            //     $('#component-delete-modal').modal('hide');
            // },function(error){
                
            //     console.log(error);
            // });
            
        } 


        $scope.update_component = function(){

            $scope.GencoComponentes.$update(function(success){
                $scope.renameTreeNode($scope.node_selected, success.nombre);
                $('#component-edit-modal').modal('hide');
            }, function(error){
                $scope.showMessage($scope.getDataError(error));
            });
            
        } 

        $scope.load_component = function(id_component){

            console.log(id_component);
            var data = componente.get({id:id_component});
            $scope.GencoComponentes = data;
            // data.$promise.then(function(data){
            //     $scope.descripcion = data.descripcion;
            //     $scope.nombre = data.nombre;
            // });

            //$scope.tmpGencoComponente =  $scope.GencoComponente;
            //$scope.langs=env_lang.get({id:id_env});

      
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
            $scope.GencoPlantillas.$save(function(success){   
                console.log(success);
                //$scope.reload_tree();
                //$scope.load_entities($scope.repo_selected.id);
                var nodeDef = {'id': 'template' + success.id_plantilla, 
                                'parent': success.id_componente, 
                                'text': success.nombre, 
                                'icon':"glyphicon glyphicon-file", 
                                'li_attr':{'data-renderas':"entity",
                                            'data-renderid': success.id_plantilla, 
                                            'data-rendername':success.nombre
                                        }
                            }
                $scope.addTreeNode($scope.node_selected, nodeDef, $('#jstree').jstree(true));                
                $('#template-create-modal').modal('hide');
            }, function(error){
                $scope.showMessage($scope.getDataError(error));
            });
            
        } 

        $scope.load_template = function(id_template){

            var data = plantillas.get({id:id_template});
            $scope.GencoPlantillas = data;
            data.$promise.then(function(data){
                console.log(data.id_lenguaje);
                //$scope.GencoPlantillas.id_lenguaje = data.id_lenguaje.toString();
                 // $scope.nombre = data.nombre;
                $scope.dataLang.repeatSelectLang = data.id_lenguaje.toString();        
                $scope.GencoPlantillas.id_lenguajeprocesador = data.id_lenguajeprocesador.toString();
        });
        } 

        $scope.update_template = function(){
            $scope.GencoPlantillas.$update(function(success){
                //$scope.reload_tree();
                $scope.renameTreeNode($scope.node_selected, success.nombre);
                $('#template-edit-modal').modal('hide')
            },function(error){
                $scope.showMessage($scope.getDataError(error));
            });

        }

        $scope.delete_template = function(){

            plantillas.delete({id: $scope.template_selected.id},function(success){
                console.log(success);
                //$scope.reload_tree();
                $('#jstree').jstree(true).delete_node($scope.node_selected); 
            },function(error){
                $scope.showMessage($scope.getDataError(error));
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
                $scope.selectTab(id_template, pos, true);
                return;
            }
                

            // pos = $scope.plantillas.map(function(x) {return x.id_plantilla.toString()}).indexOf(id_template);
            // console.log(pos);
            //$scope.current_template=$scope.templates[pos];

            //$scope.counter++;
            // var config = {
            //     headers : {
            //         'Authorization':'Basic YWRtaW46YWRtaW4='
            //     }
            // }
           
            var data;


           //  $http.get('gencoui/tmpl/'+id_template)
           // .then(
           //     function(response){
           //          data = response.data;// success callback
           //          console.log(data);
           //          // templateObj = data.templateObj[0];
           //          // $scope.tabs.push({id_plantilla:id_template, nombre: $scope.plantillas[pos].nombre ,content: data});
           //          $scope.tabs.push({id_plantilla:id_template, nombre: data.templateName ,content: data.fileContent});
           //          console.log('select');
           //          $scope.selectedTab = $scope.tabs.length - 1; //set the newly added tab active. 
           //          $scope.selectTab(id_template, $scope.selectedTab);
           //          //Render -> Wait
           //     }, 
           //     function(response){
           //       // failure callback
           //     }
           //  );


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
                                    $scope.selectTab(id_template, $scope.selectedTab, false);
                                },function(error){
                                    console.log('ERR');
                                    console.log(error);  
            });


            //data = 'function foo(items)';
            
            //editor.setValue(data + " index -> ");
            // var editor = ace.edit("editor");
            //     //editor.setTheme("ace/theme/default");
            //     editor.getSession().setMode("ace/mode/java");
            //     editor.$blockScrolling = Infinity;

        }
        
        /** Function to delete a tab **/
        $scope.deleteTab = function(index){
            // $scope.isTabSelected=true;
            console.log($scope.tabs[index]);
            console.log(editors[index]);
            $scope.tabs.splice(index,1);
            //$('#'+editors[index].container.id).remove();
            //editors.splice(index,1);
            var aceId = editors[index].container.id;
            editors[index].destroy();
            $('#'+aceId).remove();
            editors.splice(index,1);


            var index = $scope.tabs.length; 
            if(index==0){
                console.log('indece cero');
                 //remove the object from the array based on index
            }else{
                $scope.selectedTab = index - 1;
                $scope.selectTab($scope.tabs[index-1].id_plantilla, $scope.selectedTab, true);    
            }
        
        }
        
        $scope.selectedTab = 0; //set selected tab to the 1st by default.
        
        /** Function to set selectedTab **/
        $scope.selectTab = function(id_template, pos, flgUpd){
            idTempl= "tmpl" + id_template;
            //$scope.selectedTab = index;
            //pos = $scope.tabs.map(function(x) {return x.id_plantilla.toString()}).indexOf(id_template);
            // editor.setValue($scope.tabs[pos] + " index -> " + $scope.templates[pos].nombre);
            console.log('alfa - ' + pos + ' ... ' + $scope.current_pos);
            //console.log('beta - ' + $scope.$index);
            

            //@Generics actualizo el contenido en memoria en caso de que haya sido modificado 
            
            if(flgUpd){     
                //$scope.tabs[$scope.current_pos].content = editors[$scope.current_pos].getValue();
                if(pos!=$scope.current_pos){
                    $('#'+editors[$scope.current_pos].container.id).attr('hidden', true);
                }
                $('#'+editors[pos].container.id).attr('hidden', false); 
                editors[pos].focus();
            }else{                
                if(pos!=$scope.current_pos && editors[$scope.current_pos] != undefined){
                    $('#'+editors[$scope.current_pos].container.id).attr('hidden', true);
                }
                $('#tabPanel').append('<div id="' + idTempl + '" class="editor"></div>')
                var editor = ace.edit(idTempl);
                editor.setTheme("ace/theme/eclipse");
                editor.getSession().setMode("ace/mode/python");
                editor.$blockScrolling = Infinity;
                editors[pos]=editor;
                editors[pos].setValue($scope.tabs[pos].content);
            }
            
            //
            $scope.current_editor= idTempl;
            $scope.current_template = id_template;
            $scope.current_pos = pos;

            if(!$scope.$$phase) {
                $scope.$apply();
            }
            //
            // angular.element($("#ctrl_editor")).scope().$apply();
        }


        $scope.submit = function() {
        // if ($scope.text) {
        //   $scope.list.push(this.text);
        //   $scope.text = '';
        // }
            var content = editors[$scope.current_pos].getValue();

            /*Actualizo el contenido en memoria antes de hacer el request por si hay un cambio de tab no se va a perder
            el contenido ni haya necesidad de hacer otra peticion al API Rest*/
            pos = $scope.tabs.map(function(x) {return x.id_plantilla.toString()}).indexOf($scope.current_template);
            $scope.tabs[pos].content=content;
 

            // var config = {
            //     headers : {
            //         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Authorization':'Basic YWRtaW46YWRtaW4='
            //     }
            // }

            // var data = $.param({                
            //     editor: content
            // });

           //  $http.post('gencoui/tmpl/'+$scope.current_template, data, config)
           // .then(
           //     function(response){
           //      //Render -> Wait
           //       // success callback            
                    

           //     }, 
           //     function(response){
           //       // failure callback
           //     }
           //  );
            var templ = new template({editor: content});
    //                 conv.$save();
            templ.$save({id_plantilla:$scope.current_template}, function(success){

            }, function(error){

            })

            // console.log('post editor');
            // console.log(editor.getValue());
        };




        $scope.preview = function() {
        // if ($scope.text) {
        //   $scope.list.push(this.text);
        //   $scope.text = '';
        // }
            var content = editor.getValue();
            editor_preview.setValue('');

            /*Actualizo el contenido en memoria antes de hacer el request por si hay un cambio de tab no se va a perder
            el contenido ni haya necesidad de hacer otra peticion al API Rest*/
            //pos = $scope.tabs.map(function(x) {return x.id_plantilla.toString()}).indexOf($scope.current_template);
            //$scope.tabs[pos].content=content;
 

            // var config = {
            //     headers : {
            //         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Authorization':'Basic YWRtaW46YWRtaW4='
            //     }
            // }

            // var data = $.param({                
            //     editor: content
            // });

            var templ = new template({editor: content});
    //                 conv.$save();
            templ.$update({id_plantilla:$scope.current_template}, function(success){
                                    data = success;// success callback
                                    console.log(data);
                                    editor_preview.setValue(data.fileContent);
                                    $('#template-preview-modal').modal('show');  
                                },function(error){
                                    console.log('ERR');
                                    console.log(error);  
            })

           //  $http.post('gencoui/tmpl_preview/'+$scope.current_template, data, config)
           // .then(
           //     function(response){
           //      console.log(response.data);
           //      editor_preview.setValue(response.data);
           //      $('#template-preview-modal').modal('show');           
           //      //Render -> Wait
           //       // success callback            
                    

           //     }, 
           //     function(response){
           //       // failure callback
           //     }
           //  );

        };


        $scope.insertKey = function(node, nodeParent) {
            // var content = editor.getValue();
            // editor_preview.setValue('');


            var session = editor.session
            session.insert(
               editor.selection.getCursor()
            , '[@ ' + nodeParent.li_attr['data-rendername'] + '/' + node.li_attr['data-rendername'] + ' ' + node.li_attr['data-renderid'] + '-' + guid() + ' @] ')
        }   

        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            
            // return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            // s4() + '-' + s4() + s4() + s4();

            return s4() + s4() + '-' + s4() + '-' + s4()
            
        } 

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


        // $scope.save_template = function(){
        //     var position = 'inside';
        //     var parent = $('#jstree').jstree('get_selected');
        //     console.log(parent);
        //     // var newNode = { state: "open", data: { "text":'render', "id":'add',"icon":"glyphicon glyphicon-file", "data-renderas":"archive" } };
        //     //var newNode = { state: "open", data: { "text":'render', "id":'add'} };
        //     var Node = { "text" : 'snipet', "icon":"glyphicon glyphicon-file", "state": {"opened": true, "selected": true}, "data":{"renderas":"component", "renderid":4}};

        //     // $('#jstree').jstree("create_node", parent,Node, position,   false, false);
        //     // nodeId = $('#jstree').jstree().create_node(parent , Node, position, false, false);
        //     // $("#jstree").jstree("create_node", parent,{ "data":"new_node", "icon":"glyphicon glyphicon-file", "attr" : "data-renderas='component'", "data-renderas":"archive"}, position,  false, true);
        //     $("#jstree").jstree("create_node", parent,Node, position,  false, true);
        //     // console.log(nodeId);
        //     // attributes = {
        //     // 'data-renderas' : 'archive',
        //     // 'data-mode' : 'edit',
        //     // 'data-action' : 'getTopic'
        //     // };
        //     // $('#jstree').jstree('select_node', nodeId);
        //     // $('#'+nodeId).attr({'data-renderas' : 'archive'}); // and same thing here
        //     // console.log($('#'+nodeId));
        //     //var node = $('#jstree').jstree.get_selected();
        //     //console.log(node);
        //     //node.attr("data-jstree",{"icon":"glyphicon glyphicon-file"});

        //     var tmp = new plantillas({
        //         id_plantilla: 4,
        //         nombre: "Sbippet",
        //         descripcion: "",
        //         id_lenguaje: 1,
        //         id_lenguajeprocesador: 1,
        //         id_componente: 3
        //     })

        //     $scope.plantillas.push(tmp);

        //     $('#template-create-modal').modal('hide');
        // }



    /*
    * data: datos del nodo seleccionado que activa el menu, de esta se puede obtener el nodo seleccionado, y una instancia para 
            manipular el arbol.
    */
    $scope.addTreeNode = function(node, newNode, jsTree){
        jsTree.create_node(node.id,newNode);
    }

    $scope.renameTreeNode = function(node, newText){
        $('#jstree').jstree('set_text', node, newText); 
    }

    $scope.setTemplLang = function (lang) {
        $scope.GencoPlantillas.id_lenguaje = lang.id_lenguaje;        
        $('#imgTmplLang').attr('src',lang.lang.icon.upload);
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
        console.log(error);
       if(error.data['detail']!=null){
        return error.data['detail'];
       } if(error.data!=null){
            var resp='';
            angular.forEach(error.data, function(value, key){    
                console.log(key + ' - ' + value);
                resp += key + ' - ' + value + '<br/>';
            });
            return resp;
       }
    }

    //$scope.load_components();
    $scope.getDirTree();

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
 // return function(scope, element, attrs) {

 //    if (scope.$last===true){
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) { 
          // iteration is complete, do whatever post-processing
          // is necessary
                if(attr['renderas'] == 'archive'){
                  
                    //itr_plantillas++;
                    //console.log(scope.components.length);
                    //console.log(itr_plantillas);
                    //if(itr_plantillas==scope.components.length)
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



// return function(scope) {
// if (scope.$last===true){
//     scope.$emit('LastRepeaterElement');
// }
// };
});