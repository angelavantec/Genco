angular.module('app_lang', ['ngResource','lang.services'])

.controller('ctrl_lang', function($scope, lang, lang_tipodato, conversion) {

    $scope.langs = [];
    $scope.langs=lang.query();

    $scope.types = [];
    $scope.types=lang_tipodato.query({id:3});
    console.log($scope.langs);
    $scope.types_types = [];


    $scope.data = {
    repeatSelect: null,
    availableOptions: $scope.langs,
    };

    


    $scope.datad = [];
    $scope.selectedCnv = [];
    $scope.Conversions = [];


    convArr = [];
    conversionArr = [];


    $scope.GencoTipodato;

    conversionObj = function(id_tipodato, id_tipodato_cnv, id_conversion){
        this.id_tipodato = id_tipodato;
        this.id_tipodato_cnv = id_tipodato_cnv;
        this.id_conversion = id_conversion;
    };

    $scope.conversionsObj = [];


    $scope.lang_selected;
    // $scope.selectedCnv = conversion.query({id_tipodato__id_lenguaje:3, id_tipodato_cnv__id_lenguaje:2});// [ 'usa', 'canada', 'mexico' ];
    // console.log($scope.selectedCnv);
   // console.log( $scope.selectedCnv );

    //console.log(types);
    //console.log(types_types);



    //console.log(conversion.query({id_conversion:2}));
    //$scope.GencoEntorno = new env();
    //$scope.tmpGencoEntorno;
    //$scope.descripcion = '';

    $scope.load_lang = function(id_lang){

        $scope.types=lang_tipodato.query({id:id_lang});
        $scope.data.repeatSelect = null;
        $scope.types_types = [];
        $scope.Conversions = [];
        $scope.lang_selected = $scope.langs[$scope.langs.map(function(x) {return x.id_lenguaje}).indexOf(id_lang)].nombre;

  //       var data = lang.get({id:id_lang});
  //       $scope.GencoEntorno = data;
  //       data.$promise.then(function(data){
  //           $scope.descripcion = data.descripcion;
  //       });

  //       $scope.tmpGencoEntorno =  $scope.GencoEntorno;
		// $scope.langs=env_lang.get({id:id_lang});

    } 


    $scope.new_type = function(id_lang){

        $scope.GencoTipodato= new lang_tipodato();
        console.log($scope.GencoTipodato);
        $scope.GencoTipodato.id_lenguaje = ""+id_lang;
        console.log('new');

  
    } 

    $scope.edit_type = function(index){

        console.log($scope.types[index].id_tipodato);
        $scope.GencoTipodato= $scope.types[index];
        $scope.GencoTipodato.id_lenguaje = $scope.GencoTipodato.id_lenguaje.toString();
        // console.log($scope.GencoTipodato);
        // $scope.GencoTipodato.id_lenguaje = ""+id_lang;
        // console.log('new');

  
    } 


    $scope.save_type = function(){


        console.log($scope.GencoTipodato);
        $scope.GencoTipodato.$save(function(){   
            $scope.load_lang($scope.GencoTipodato.id_lenguaje);       
            $scope.new_type($scope.GencoTipodato.id_lenguaje);
            //$('#type-add-modal').modal('hide')
        });
        
    } 

    $scope.update_type = function(){
        console.log($scope.GencoTipodato);
        $scope.GencoTipodato.$update(function(){
            $scope.load_lang($scope.GencoTipodato.id_lenguaje);       
            $('#type-edit-modal').modal('hide')
        });

    }


    $scope.print = function(message){
       // $scope.lang-selected = lang_selected
        console.log('data ' + message);
        //$scope.types_types=lang_tipodato.query({id:$scope.data.repeatSelect});

    }

    $scope.cancel = function(){
        $('#type-add-modal').modal('hide');
        $('#type-edit-modal').modal('hide');
        $('#lang-add-modal').modal('hide');
    }


    $scope.getTypesCombos = function(id_lang){
        var id_lang_cnv = $scope.data.repeatSelect;
        console.log('lenguje conversion '+id_lang_cnv+" lenguaje origen " + id_lang);
        $scope.types_types=lang_tipodato.query({id:id_lang_cnv});
        $scope.Conversions = [];
        $scope.selectedCnv = conversion.query({id_tipodato__id_lenguaje:id_lang, id_tipodato_cnv__id_lenguaje:id_lang_cnv});
        

        load_types();

        //$scope.Conversions = tmpConversions;
        console.log('3 trmina carga combo');
        console.log($scope.Conversions);
    }



    function load_types(){
        var tmpConversions = [];
        
        //convArr = [];
        //conversionArr = [];
        var tmpConversionsObj = [];
        var tmpConvObj = null;

        console.log($scope.types);


        angular.forEach($scope.types, function(value, key){

            $scope.selectedCnv.$promise.then(function (data) {
                //console.log(data.map(function(x) {return x.id_tipodato}).indexOf(value.id_tipodato));

                pos = data.map(function(x) {return x.id_tipodato}).indexOf(value.id_tipodato);
                console.log(pos);

                if(pos>=0) {
                    // $scope.Conversions.push(conversionArr[pos]); 
                    tmpConversions.push(data[pos].id_tipodato_cnv); 
                    tmpConvObj = new conversionObj(data[pos].id_tipodato, data[pos].id_tipodato_cnv, data[pos].id_conversion);            
                    tmpConversionsObj.push(tmpConvObj);
                    
                }else{
                    // $scope.Conversions.push("");                     
                    tmpConversions.push(null);
                    tmpConversionsObj.push(new conversionObj(value.id_tipodato,null,null));                     
                }

            })

        //     setTimeout(function(){
            

        // }, 3000)
        

        });
        
        console.log('1 trmina carga conversiones ');
        $scope.Conversions = tmpConversions;
        $scope.conversionsObj = tmpConversionsObj;

    }


    $scope.new_lang = function(id_lang){

        $scope.GencoLenguajes= new lang();
        console.log($scope.GencoLenguajes);
        //$scope.GencoTipodato.id_lenguaje = ""+id_lang;
        console.log('new lang');

  
    } 

    $scope.save_lang = function(){


        console.log($scope.GencoLenguajes);
        $scope.GencoLenguajes.$save(function(){   
            $scope.langs=lang.query();
            $('#lang-add-modal').modal('hide')
        });
        
    } 


    // $scope.save_conversion = function(id_lang){
    //     index = 0;
    //     reload = false;
    //     // console.log($scope.Conversions);
    //     // if (conversionsObj.length <= 0)
    //     //     return;

    //     angular.forEach($scope.types, function(value, key){

    //         if($scope.Conversions[index]!=null){

    //             //pos = conversionsObj.indexOf($scope.Conversions[index]);
    //             //pos = conversionsObj.map(function(x) {return x.id_tipodato_cnv}).indexOf($scope.Conversions[index]);

                

    //             if(conversionsObj[index].id_conversion!=null){

    //                 if(conversionsObj[index].id_tipodato_cnv!=$scope.Conversions[index]){
    //                     console.log( value.id_tipodato + " conv to  " + $scope.Conversions[index] + " -> PUT " + conversionsObj[index].id_conversion);
    //                     var conv = new conversion({id_tipodato: value.id_tipodato, id_tipodato_cnv: $scope.Conversions[index], id_conversion: conversionsObj[index].id_conversion});
    //                     conv.$update();
    //                     reload = true;
    //                 }    
    //             }else{
    //                 console.log( value.id_tipodato + " conv to  " + $scope.Conversions[index] + " -> POST ");
    //                 var conv = new conversion({id_tipodato: value.id_tipodato, id_tipodato_cnv: $scope.Conversions[index]});
    //                 conv.$save();
    //                 reload = true;

    //             }

                
            
    //         }else{
    //             //pos = conversionsObj.map(function(x) {return x.id_tipodato}).indexOf(value.id_tipodato);
    //             if (conversionsObj[index].id_conversion != null) {
    //                 console.log( value.id_tipodato + " conv to  " + $scope.Conversions[index] + " -> DEL " + conversionsObj[index].id_conversion);    
    //             };
    //             reload = true;

    //         }

    //         index++;

           
   
    //         // pos = convArr.indexOf(value.id_tipodato);
    //         // //console.log(pos);

    //         // if(pos>=0) {
    //         //      console.log( value.id_tipodato + " conv to  " + conversionArr[pos]); //$scope.Conversions.push(conversionArr[pos]); 
    //         // }
    //         // // else{
    //         // //     $scope.Conversions.push(""); 
    //         // // }

    //         if($scope.types.length == index && reload){
    //         //$scope.load_lang(id_lang);
    //         //$scope.data.repeatSelect = id_lang;
    //             console.log('reload ' + $scope.types.length + " " + index);
    //             $scope.getTypesCombos();
    //         }
            
    //     })

        
    // }


    $scope.save_conversion = function(id_lang){

        console.log($scope.Conversions);
        console.log($scope.conversionsObj);
        save_conversion_validator(id_lang, $scope.getTypesCombos );
    //             index = 0;
    //     reload = false;


    //     angular.forEach($scope.types, function(value, key){

    //         if($scope.Conversions[index]!=null){

    //             //pos = conversionsObj.indexOf($scope.Conversions[index]);
    //             //pos = conversionsObj.map(function(x) {return x.id_tipodato_cnv}).indexOf($scope.Conversions[index]);

                

    //             if(conversionsObj[index].id_conversion!=null){

    //                 if(conversionsObj[index].id_tipodato_cnv!=$scope.Conversions[index]){
    //                     console.log( value.id_tipodato + " conv to  " + $scope.Conversions[index] + " -> PUT " + conversionsObj[index].id_conversion);
    //                     var conv = new conversion({id_tipodato: value.id_tipodato, id_tipodato_cnv: $scope.Conversions[index], id_conversion: conversionsObj[index].id_conversion});
    //                     conv.$update();
    //                     reload = true;
    //                 }    
    //             }else{
    //                 console.log( value.id_tipodato + " conv to  " + $scope.Conversions[index] + " -> POST ");
    //                 var conv = new conversion({id_tipodato: value.id_tipodato, id_tipodato_cnv: $scope.Conversions[index]});
    //                 conv.$save();
    //                 reload = true;

    //             }

                
            
    //         }else{
    //             //pos = conversionsObj.map(function(x) {return x.id_tipodato}).indexOf(value.id_tipodato);
    //             if (conversionsObj[index].id_conversion != null) {
    //                 console.log( value.id_tipodato + " conv to  " + $scope.Conversions[index] + " -> DEL " + conversionsObj[index].id_conversion);    
    //             };
    //             reload = true;

    //         }

    //         index++;

    // })
                           
    }


    function save_conversion_validator(id_lang, callback){

        index = 0;
        //total = $scope.types.length;
        proccess = [];
        //console.log($scope.conversionsObj);
        //console.log($scope.types);

        angular.forEach($scope.types, function(value, key){

            if($scope.Conversions[index]!=null){

                if($scope.conversionsObj[index].id_conversion!=null){

                    if($scope.conversionsObj[index].id_tipodato_cnv!=$scope.Conversions[index]){
                      //  console.log( value.id_tipodato + " conv to  " + $scope.Conversions[index] + " -> PUT " + $scope.conversionsObj[index].id_conversion);                        
                      //  send_conversion(value,'PUT', index, total, id_lang, callback);  
                        proccess.push(1);
                        conv = new conversion({id_tipodato: value.id_tipodato, id_tipodato_cnv: $scope.Conversions[index], id_conversion: $scope.conversionsObj[index].id_conversion});
                        conv.$update(
                            function(success){
                                console.log('OK');
                                console.log(success); //wait_conversion();
                                proccess.pop();
                                conversion_validator(proccess, id_lang, callback);
                            },function(error){
                                console.log('ERR');
                                console.log(error);
                                proccess.pop();
                                conversion_validator(proccess, id_lang, callback);   
                        });
                        
                    }    
                }else{
                    //console.log( value.id_tipodato + " conv to  " + $scope.Conversions[index] + " -> POST ");
                    //send_conversion(value,'POST', index, total, id_lang, callback);
                    proccess.push(1);
                    conv = new conversion({id_tipodato: value.id_tipodato, id_tipodato_cnv: $scope.Conversions[index]});
                    conv.$save(
                        function(success){
                        console.log('OK');
                        console.log(success); //wait_conversion();
                        proccess.pop();
                        conversion_validator(proccess, id_lang, callback);
                        },function(error){
                        console.log('ERR');
                        console.log(error);  
                        proccess.pop();  
                        conversion_validator(proccess, id_lang, callback);
                    });  

                }

                
            
            }else{

                 if ($scope.conversionsObj[index].id_conversion != null) {
                    //console.log( value.id_tipodato + " conv to  " + $scope.Conversions[index] + " -> DEL " + $scope.conversionsObj[index].id_conversion);    
                    //send_conversion(value,'DEL', index, total, id_lang, callback);
                    proccess.push(1);
                    conv = new conversion({id_tipodato: value.id_tipodato, id_tipodato_cnv: $scope.Conversions[index], id_conversion: $scope.conversionsObj[index].id_conversion});
                    conv.$delete(
                        function(success){
                            console.log('OK');
                            console.log(success); //wait_conversion();
                            proccess.pop();
                            conversion_validator(proccess, id_lang, callback);
                        },function(error){
                            console.log('ERR');
                            console.log(error); 
                            proccess.pop();
                            conversion_validator(proccess, id_lang, callback);   
                    });

                }
                

            }


            index++;

    })

    console.log('termina save ');

    //callback(3);

  };

    function conversion_validator(proccess, id_lang, callback){

        //Render -> Wait
        if(proccess.length<=0){
            console.log('reload');
            callback(id_lang);
        }

        

    }





  });

angular.module('app_lang').config(function($httpProvider){

    $httpProvider.defaults.headers.common['Authorization'] = 'Basic YWRtaW46YWRtaW4=';
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

})
