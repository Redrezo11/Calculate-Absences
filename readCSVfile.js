const baseCode = (output) => `{
let documents = document.querySelectorAll("span");
let spanList = [];


const studentList = ${output}


function isNormalInteger(str) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
}

function parseIntegerString(x, txtLength) {
    for (let i = 0; i < txtLength - 9; i++) {
        let testString = x.substring(i,i+9);
        if (isNormalInteger(testString)) {
            return testString;
        }

    }

}

 for (let i=0; i<documents.length;i++) {
     let studentId = null;
     let document = documents[i];
     let documentTxt = documents[i].innerHTML;
     let txtLength = 0;
     if (documentTxt!==undefined||documentTxt===null) {
         txtLength = documents[i].innerHTML.length;
     }
     documentClass  = documents[i].class;
     if (txtLength>10) {
         studentId = documentTxt.substring(9,txtLength);
         let foundString = parseIntegerString(studentId, txtLength);
          if(studentId.length>=3) {
             //check for repeating values.
             let found = spanList.find(entry=> {
                if(entry === foundString) {
                    return true;
                }
             });
             if(found===undefined||found===null) {

                 spanList.push(foundString);
             }

          }

     }



}

const absentList = [];

for (student of studentList) {
      let found = spanList.find(studentId=>{
           if(studentId==student.id) {
               return true;
            }
      });

      if (found===null||found===undefined) {
          absentList.push(student);
      }
}
for (student of absentList ) {
   console.log("#: " + student.serialNumber + ", id: " + student.id );
}

}

`
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

/*---------------------Clipboard function.-----------------------------*/


function copyToClipboard() {
  /* Get the text field */

  var copyText = document.getElementById("textArea");

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/

  /* Copy the text inside the text field */
  document.execCommand("copy");

  /* Alert the copied text */
  alert("Copied code to Clipboard, press CTRL-V to paste text");
}

/*----------------------Parse File --------------------------------------*/


function parseFile() {
    document.getElementById("clipboardBtn").style.visibility="visible";

    let obj = null;
    let result = null;
    const myfile = document.getElementById("myfile").files[0];
    const code = document.getElementById("code");
    const textArea = document.getElementById("textArea");

    xl2json.parseExcel(myfile,(obj)=>{
    console.log('callback successfully executed');
    let students=[];
    let output = "";
    for (entry of obj) {
        if (isNormalInteger(entry.Campus)) {
          students.push(entry);
        }
    }

    output += '[';
    for (student of students) {
        output += `{id:${student['Tabuk - Male']} , serialNumber:${student.Campus}},`
    }
    output += ']'
    textArea.innerHTML = baseCode(output);


  });


}
