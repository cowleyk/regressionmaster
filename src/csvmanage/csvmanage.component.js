(function() {
  'use strict';
  // const fs = require('fs');

  angular.module('app')
  .component('csvmanage', {
    controller: csvmanageController,
    templateUrl: 'src/csvmanage/csvmanage.component.html'
  });

  csvmanageController.$inject = ['$scope', '$state'];

  function csvmanageController($scope, $state) {
    const vm = this;

    vm.upload = function(){
      var data = null;
      var input = document.getElementById('fileinput');
      var file = input.files[0];
      // console.log(file);
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function(event) {
          var csvData = event.target.result;
          console.log(csvData);
          console.log(typeof csvData);
          // csvData is the string we need!


          // data = $.csv.toArrays(csvData);
          // if (data && data.length > 0) {
          //   console.log(data);
          //   console.log('Imported -' + data.length + '- rows successfully!');
          // } else {
          //     console.log('No data to import!');
          // }
      };
      reader.onerror = function() {
          console.log('Unable to read ' + file.fileName);
      };

    }

    // vm.$onInit = function(){
    //   $('#txtFileUpload').addEventListener('change', vm.upload, false);
    // }
    vm.variables = [];
    vm.showUpload = true;
    let headerArr;
    let csvObj = {};
    let indMatrix = [];
    let depMatrix = [];
    vm.manipData = function(){
      // run when 'upload' button clicked



    };

    // TODO create constructor for csv data
      // include variable name array, dependent variable, y & x arrays
    // TODO make csv.separator customizable

    vm.setSelection = function(){

      let indIndex = headerArr.indexOf(vm.independent);
      let depNameArr = ['constant'];
      let depIndex = [];
      vm.variables.forEach(function(elem){
        if(elem.dependent){
          depIndex.push(headerArr.indexOf(elem.name));
          depNameArr.push(elem.name);
        }
      });
      for(let key in csvObj){
        let tempArr = csvObj[key];
        indMatrix.push([tempArr[indIndex]]);
        tempArr.splice(indIndex, 1);
        tempArr.unshift(1);
        depMatrix.push(tempArr);
      }

      let xPrXinv = math.inv(math.multiply(math.transpose(depMatrix), depMatrix));
      let xPrY = math.multiply(math.transpose(depMatrix), indMatrix);
      let bHat = math.multiply(xPrXinv, xPrY);
      let sse = math.multiply(math.transpose(indMatrix),indMatrix) - math.multiply(math.transpose(bHat), math.multiply(math.transpose(depMatrix), indMatrix));
      let sumY = 0;
      indMatrix.forEach(function(elem){
        sumY += parseFloat(elem[0]);
      });
      let ssr = math.multiply(math.transpose(bHat), math.multiply(math.transpose(depMatrix), indMatrix))-(sumY*sumY)/(Object.keys(csvObj).length);
      let sst = sse + ssr;



      let matrixObj = {
        'variables': headerArr,
        'depVariables': depNameArr,
        'C': xPrXinv,
        'bHat': bHat,
        'X': depMatrix,
        'y': indMatrix,
        'n': Object.keys(csvObj).length,
        'k': depIndex.length,
        'p': depIndex.length+1,
        'sse': sse,
        'ssr': ssr,
        'sst': sst
      };
      $state.go("regression", {matrixObj: matrixObj});

      };

      vm.dependentFilter = function(val){
        return val.name !== vm.independent;
      };

      vm.showOptions = false;

  }


})();
