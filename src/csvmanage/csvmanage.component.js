(function() {
  'use strict';
  // const fs = require('fs');

  angular.module('app')
  .component('csvmanage', {
    controller: csvmanageController,
    templateUrl: 'src/csvmanage/csvmanage.component.html'
  });

  csvmanageController.$inject = ['$scope', '$parse'];

  function csvmanageController($scope, $parse) {
    const vm = this;
      $scope.csv = {
      	content: null,
      	header: true,
      	headerVisible: true,
      	separator: ',',
      	separatorVisible: true,
      	result: null,
      	encoding: 'ISO-8859-1',
      	encodingVisible: true,
          uploadButtonLabel: "upload a csv file"
      };


      vm.manipData = function(){
        let fileData = $scope.csv.content;


        let split1 = fileData.split(/\n/);
        // for (var i = 0; i < split1.length; i++) {
        //   split1[i] = split1[i].split(',');
        // }
        let headerArr = split1[0].split(',');
        console.log(headerArr);
      }
      // WANT:
      // dependent = [[obs1],[obs2], ... [obsN]]
      // independents = [[ind11, ind21, ind31 ...], [ind12, ind22, ind32 ...], [ind1N, ind2N, ind3N ...]]
  }


})();






// var _lastGoodResult = '';
// vm.toPrettyJSON = function (json, tabWidth) {
// 	var objStr = JSON.stringify(json);
// 	var obj = null;
// 	try {
// 		obj = $parse(objStr)({});
// 	} catch(e){
// 		// eat $parse error
//     console.log(_lastGoodResult);
// 		return _lastGoodResult;
// 	}
//
// 	var result = JSON.stringify(obj, null, Number(tabWidth));
// 	_lastGoodResult = result;
//
// 	return result;
// };

// csvmanageController.$inject = ['$http', '$state', 'ngCsvImport'];
//
// function csvmanageController($http, $state, ngCsvImport){
//   const vm = this;
//   console.log('csvmanageController');
//
//   // vm.csv = {
//   // 	content: null,
//   // 	header: true,
//   // 	headerVisible: true,
//   // 	separator: ',',
//   // 	separatorVisible: true,
//   // 	result: null,
//   // 	encoding: 'ISO-8859-1',
//   // 	encodingVisible: false,
//   //   uploadButtonLabel: "upload a csv file"
//   // };
//
//   vm.$onInit = function(){
//     console.log('$onInit fired');
//   };
//
//   vm.grabCsv = function(){
//     console.log('uploadButton');
//     console.log(vm.csvData);
//     console.log(document.getElementById("csvFile").value);
//     console.log(typeof document.getElementById("csvFile").value);
//     let file = document.getElementById("csvFile").value;
//     // filesystem.fileRead(file);
//     filesystem.fs.readFile(file, function(err, data){
//       if(err){
//         console.log(err);
//       }
//       console.log(data);
//     })
//
//   }
//
//
//
// }
