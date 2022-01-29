
/*------------------------------------------------------------------*/

var jsonObj = null;

function isNormalInteger(str) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
}

var ExcelToJSON = function() {

  this.parseExcel = function(file, callback) {
    var reader = new FileReader();

    reader.onload = function(e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, {
        type: 'binary'
      });

    workbook.SheetNames.forEach(function(sheetName) {
        // Here is your object
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        jsonObj = XL_row_object;
        //or execute callback function passed in
        callback(XL_row_object);

      })

    }; //END OF PARSE EXCEL

    reader.onerror = function(ex) {
      // console.log(ex);
    };

    reader.readAsBinaryString(file);
  };
};

var xl2json = new ExcelToJSON();

/****************************/


function parseFile() {

  let text = document.getElementById("text");
  let grades = {
      aPlus: {counter: 0, percentage: null},
      a: {counter: 0, percentage: null},
      bPlus:{counter: 0, percentage: null},
      b:{counter: 0, percentage: null},
      cPlus:{counter: 0, percentage: null},
      c:{counter: 0, percentage: null},
      dPlus:{counter: 0, percentage: null},
      d:{counter: 0, percentage: null},
      f:{counter: 0, percentage: null},
      w:{counter: 0, percentage: null},
      dn:{counter: 0, percentage: null}
  }


    let obj = null;
    let result = null;
    const myfile = document.getElementById("myfile").files[0];

    xl2json.parseExcel(myfile,(obj)=>{
    console.log('callback successfully executed');
    let numOfStudents=obj.length - 5;
    let gradeList = [];
    let output = "";
    console.log(obj);
    console.log(obj[3]['Tabuk - Male']);
    for (entry of obj) {
        gradeList.push(entry.undefined);
    }
    gradeList.splice(0, 5);

    for(grade of gradeList) {
      switch (grade) {
          case 'A+':
               grades.aPlus.counter += 1;
               break;
          case 'A':
              grades.a.counter += 1;
              break;
          case 'B+':
              grades.bPlus.counter += 1;
              break;
          case 'B':
              grades.b.counter += 1;
              break;
          case 'C+':
              grades.cPlus.counter += 1;
              break;
          case 'C':
              grades.c.counter += 1;
              break;
          case 'D':
              grades.d.counter +=1;
              break;
          case 'D+':
              grades.dPlus.counter += 1;
              break;
          case 'F':
              grades.f.counter +=1;
              break;
          case 'DN':
              grades.dn.counter +=1;
              break;
          case 'W':
              grades.w.counter +=1;
              break;
          default:
              break;
      }
  }

  grades.aPlus.percentage = Math.floor((grades.aPlus.counter/numOfStudents)*10000) /100 ;
  grades.aPlus.percentage.toFixed(1);
  grades.a.percentage = Math.floor((grades.a.counter/numOfStudents)*10000)/100;
  grades.bPlus.percentage = Math.floor((grades.bPlus.counter/numOfStudents)*10000)/100;
  grades.b.percentage = Math.floor((grades.b.counter/numOfStudents)*10000)/100;
  grades.cPlus.percentage = Math.floor((grades.cPlus.counter/numOfStudents)*10000)/100;
  grades.c.percentage = Math.floor((grades.c.counter/numOfStudents)*10000)/100;
  grades.dPlus.percentage = Math.floor((grades.dPlus.counter/numOfStudents)*10000)/100;
  grades.d.percentage = Math.floor((grades.d.counter/numOfStudents)*10000)/100;
  grades.f.percentage = Math.floor((grades.f.counter/numOfStudents)*10000)/100;
  grades.w.percentage = Math.floor((grades.w.counter/numOfStudents)*10000)/100;
  grades.dn.percentage = Math.floor((grades.dn.counter/numOfStudents)*10000)/100;
  



  let pass=numOfStudents - grades.f.counter  - grades.w.counter - grades.dn.counter;
  let passPercentage = Math.floor((  (100 - grades.f.percentage) -grades.w.percentage - grades.dn.percentage )*100)/100;

  console.log(`Number of Students: ${numOfStudents}`);
  console.log(`Passed: ${pass} students, ${passPercentage}%. Failed: ${grades.f.counter} students, ${grades.f.percentage}%`);
  console.log(`withdrawn: ${grades.w.counter} students, percentage: ${grades.w.percentage}%`);
  console.log(`Denied Entry: ${grades.dn.counter}, percentage: ${grades.dn.percentage}%`);
  console.log(`number of A+: ${grades.aPlus.counter}, percentage: ${grades.aPlus.percentage}%`);
  console.log(`number of A's: ${grades.a.counter}, percentage: ${grades.a.percentage}%`);
  console.log(`number of B+: ${grades.bPlus.counter}, percentage: ${grades.bPlus.percentage}%`);
  console.log(`number of B's: ${grades.b.counter}, percentage: ${grades.b.percentage}%`);
  console.log(`number of C+: ${grades.cPlus.counter}, percentage: ${grades.cPlus.percentage}%`);
  console.log(`number of C: ${grades.c.counter}, percentage: ${grades.c.percentage}%`);
  console.log(`number of D+: ${grades.dPlus.counter}, percentage: ${grades.dPlus.percentage}%`);
  console.log(`number of D: ${grades.d.counter}, percentage: ${grades.d.percentage}%`);
  console.log(`number of F: ${grades.f.counter}, percentage: ${grades.f.percentage}%`);
 
  if (obj[1]['Tabuk - Male']) {
      output += `Department : ${obj[1]['Tabuk - Male']}\n`;
  }
  if(obj[3]['Tabuk - Male']) {
    output += `Section number: ${obj[3]['Tabuk - Male']}\n`;
  }
  if (obj[1]['Tabuk - Female']) {
      output += `Department : ${obj[1]['Tabuk - Female']}\n`;
  }
  if(obj[3]['Tabuk - Female']) {
    output += `Section number: ${obj[3]['Tabuk - Female']}\n`;
  }


  output += `Number of Students: ${numOfStudents}\n`;
  output += `number of A+: ${grades.aPlus.counter}, percentage: ${grades.aPlus.percentage}%\n`;
  output += `number of A's: ${grades.a.counter}, percentage: ${grades.a.percentage}%\n`;
  output += `number of B+: ${grades.bPlus.counter}, percentage: ${grades.bPlus.percentage}%\n`;
  output += `number of B's: ${grades.b.counter}, percentage: ${grades.b.percentage}%\n`;
  output += `number of C+: ${grades.cPlus.counter}, percentage: ${grades.cPlus.percentage}%\n`;
  output += `number of C: ${grades.c.counter}, percentage: ${grades.c.percentage}%\n`;
  output += `number of D+: ${grades.dPlus.counter}, percentage: ${grades.dPlus.percentage}%\n`;
  output += `number of D: ${grades.d.counter}, percentage: ${grades.d.percentage}%\n`;
  output += `number of F: ${grades.f.counter}, percentage: ${grades.f.percentage}%\n`;
  output += `Denied Entry: ${grades.dn.counter}, percentage: ${grades.dn.percentage}%\n`;
  output += `Passed: ${pass} students, ${passPercentage}%.\nFailed: ${grades.f.counter} students, ${grades.f.percentage}%\n`;
  output += `withdrawn: ${grades.w.counter} students, percentage: ${grades.w.percentage}%\n`;

  console.log(text);
  text.innerHTML = output;

  });  //ParseExcel End.


}