(function() {
  'use strict';

  angular.module('app')
  .component('csvmanage', {
    controller: csvmanageController,
    templateUrl: 'src/csvmanage/csvmanage.component.html'
  });

  csvmanageController.$inject = ['$http', '$state'];

  function csvmanageController($http, $state) {
    const vm = this;
    vm.independent = '';
    vm.showUpload = true;
    vm.showOptions = false;
    // vm.showOptions = true


    vm.$onInit = function(){
      // $http.get user csv data, assign to vm.rawcsvstring
      console.log('csvmanage');
    };

    vm.upload = function(){
      var input = document.getElementById('fileinput');

      // if(input.files[0]){ use file reader fxn }
      var file = input.files[0];

      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function(event) {
        var csvData = event.target.result;
        let rawcsvstring = JSON.stringify(csvData);

        var csvCookie = 'csv_data='+JSON.stringify(csvData);
        console.log('csvCookie', csvCookie);
        document.cookie = csvCookie;

        rawcsvstring = rawcsvstring.substring(1, rawcsvstring.length-1);

        vm.matrixObj = {
          test: 'test',
          elemObjArr: [],
          xMatrix: [],
          yMatrix: []
        };

        let csvReplaceString = rawcsvstring.replace(/\\r\\n/g, '%');

        let csvLineSplitArr = csvReplaceString.split(/%/);
        vm.headerArr = csvLineSplitArr.shift().split(',');
        csvLineSplitArr.pop();
        // csvLineSplitArr does not include headers after headerArr definied
        console.log('headerArr', vm.headerArr);

        for (let i = 0; i < vm.headerArr.length; i++) {
          let elemObj = {
            name: vm.headerArr[i],
            dependent: false,
            col_index: i,
            valsArr: []
          };
          vm.matrixObj.elemObjArr.push(elemObj);
        }
        console.log('elemObjArr', vm.matrixObj.elemObjArr);

        let masterMatrixObj = {};
        csvLineSplitArr.forEach(function(line){
          let lineArr = line.split(',');
          for (let i = 0; i < lineArr.length; i++) {
            // lineArr[i] = individual data point
            if(masterMatrixObj[i]){
              masterMatrixObj[i].push(lineArr[i]);
            }
            else{
              masterMatrixObj[i] = [];
              masterMatrixObj[i].push(lineArr[i]);
            }
          }

        })
        vm.matrixObj.elemObjArr.forEach(function(elem){
          // elem = elemObj in array
          elem.valsArr = masterMatrixObj[elem.col_index];
        });

        vm.showOptions = true;
        vm.showUpload = false;


        // TODO add in $http update (get) route to add cookie to db
            // store csv string as vm.rawcsvstring to be accesible throughout controller


        // TODO define fxn to create Xmatrix,Ymatrix,labels[]
        // call fxn w. JSON.stringify(csvData) as parameter

      };
      reader.onerror = function() {
        console.log('Unable to read ' + file.fileName);
      };

      // else{
        // get user's csv file from $onInit get fxn, should be vm.rawcsvstring
      // }

          // TODO set up independent/dependent selector section

    };

    // TODO create constructor for csv data
      // include variable name array, dependent variable, y & x arrays
    // TODO make csv.separator customizable

    let initializeMatrixObj = function(rawcsvstring){


      // return matrixObj
    };


    // TODO fxn for submitting variable declarations
        // define xMatrix and yMatrix
        // $state.go matrixObj and /regression







    // vm.setSelection = function(){
    //
    //   let indIndex = headerArr.indexOf(vm.independent);
    //   let depNameArr = ['constant'];
    //   let depIndex = [];
    //   vm.variables.forEach(function(elem){
    //     if(elem.dependent){
    //       depIndex.push(headerArr.indexOf(elem.name));
    //       depNameArr.push(elem.name);
    //     }
    //   });
    //   for(let key in csvObj){
    //     let tempArr = csvObj[key];
    //     indMatrix.push([tempArr[indIndex]]);
    //     tempArr.splice(indIndex, 1);
    //     tempArr.unshift(1);
    //     depMatrix.push(tempArr);
    //   }
    //
    //   let xPrXinv = math.inv(math.multiply(math.transpose(depMatrix), depMatrix));
    //   let xPrY = math.multiply(math.transpose(depMatrix), indMatrix);
    //   let bHat = math.multiply(xPrXinv, xPrY);
    //   let sse = math.multiply(math.transpose(indMatrix),indMatrix) - math.multiply(math.transpose(bHat), math.multiply(math.transpose(depMatrix), indMatrix));
    //   let sumY = 0;
    //   indMatrix.forEach(function(elem){
    //     sumY += parseFloat(elem[0]);
    //   });
    //   let ssr = math.multiply(math.transpose(bHat), math.multiply(math.transpose(depMatrix), indMatrix))-(sumY*sumY)/(Object.keys(csvObj).length);
    //   let sst = sse + ssr;
    //
    //
    //
    //   let matrixObj = {
    //     'variables': headerArr,
    //     'depVariables': depNameArr,
    //     'C': xPrXinv,
    //     'bHat': bHat,
    //     'X': depMatrix,
    //     'y': indMatrix,
    //     'n': Object.keys(csvObj).length,
    //     'k': depIndex.length,
    //     'p': depIndex.length+1,
    //     'sse': sse,
    //     'ssr': ssr,
    //     'sst': sst
    //   };
    //   $state.go("regression", {matrixObj: matrixObj});
    //
    //   };

      // vm.dependentFilter = function(val){
      //   return val.name !== vm.independent;
      // };


  } // close controller


})();
