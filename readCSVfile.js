

const baseCode = (output) =>
`
{
//mutable values: classNumber, startTime, absentSessionTime;
const startTime = "${startTime}"; //start time assumed to be military time and starting at 00;
const lateTime = createLateTime(startTime); //20 minutes added
const superLateTime = createSuperLateTime(startTime);
const absentSessionTime ="${absentSessionTime}"; //45 minutes for 3 hours.
let documents = document.querySelectorAll("span");
let objectList = []; //contains   { tr: null, spanId: , spanElement};
let spanList = [];
let absentTimeShort = [];
let absentSecondSession = [];
let lateList = [];

// {id: , serialNumber: },
const studentList = ${output}

function getStudent(stringId) {
    //value assumed to be a string.
    let studentId = parseInt(stringId);
//     console.log( studentList.find(student=>student.id===studentId));
    return studentList.find(student=>student.id===studentId);

}

function createLateTime(time) {
    //add twenty minutes;
    let newTime = time.split(":");
    return newTime[0] + ":" + "20";
};

function createSuperLateTime(time) {
    //add twenty minutes;
    let newTime = time.split(":");
    return newTime[0] + ":" + "50";
};

function isNormalInteger(str) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
}

function parseIntegerString(x, txtLength) {
    for (let i = 0; i < txtLength - 9; i++) {
        //substring is i, i+8 in the array position.
        let testString = x.substring(i,i+9);
        if (isNormalInteger(testString)) {
            return testString;
        }
        //found integer string
    }

}

function parseHtmlTime(text) {
    let output = text.split("-->");
    output = output[4].split("<!--");
    output = output[0];
    return output;
}

function convertToMilitary(time) {
    if (time.search("AM")!==-1) {
        let newTime = time.replace(" AM","");
        return newTime;
    } else {
        let newTime = time.replace(" PM","");
        splitTime = newTime.split(":");
        if(splitTime[0]==="12") {
            return newTime;
        } else {
            let newHour = parseInt(splitTime[0]) + 12;
            let newTime = newHour + ":" + splitTime[1];
            return newTime;
        }
    }
}
/***End of Functions ******/
//find Title and Date of the report

let title = document.querySelectorAll("h1");
let date = document.querySelectorAll("h3");
title = title[0].childNodes[0].innerHTML;
date = date[0].innerText;

console.log('');
console.log('Class# ' + title);
console.log(date);


//find Students
 for (let i=0; i<documents.length;i++) {
     let studentId = null;

     // document, this is the element that should be searched in the documentlist.
     let document = documents[i];
     let documentTxt = documents[i].innerHTML;
     let txtLength = 0;
     if (documentTxt!==undefined||documentTxt===null) {
         txtLength = documents[i].innerHTML.length;
     }
     documentClass  = documents[i].class;
     if (txtLength>10) {
         studentId = documentTxt.substring(12,txtLength);
         let foundString = parseIntegerString(studentId, txtLength);
          if(studentId.length>=3) {
             //check for repeating values.
             let found = spanList.find(entry=> {
                if(entry === foundString) {
                    return true;
                }
             });
             if(found===undefined||found===null) {
                 //need to push the span element as well as the Found ID number to parse later.
                 let parentEl = document.parentElement.parentElement;

                 //found string can become undefined
                 if (foundString!==undefined) {
                     if (foundString.length>=9) {
                         spanList.push(foundString);
                         objectList.push({tr: parentEl, spanId: foundString, joinTime: convertToMilitary(parseHtmlTime(parentEl.childNodes[8].innerHTML)),
                         totalTime: parentEl.childNodes[12].childNodes[7].innerHTML,
                         lastLeave: convertToMilitary(parentEl.childNodes[10].outerText) });
                     }
   
                 }
                 //if (foundString.length>=9) {
                 //    spanList.push(foundString);
                 //    objectList.push({tr: parentEl, spanId: foundString, joinTime: convertToMilitary(parseHtmlTime(parentEl.childNodes[8].innerHTML)),
                 //    totalTime: parentEl.childNodes[12].childNodes[7].innerHTML,
                 //    lastLeave: convertToMilitary(parentEl.childNodes[10].outerText) });
                 }

             }

          }

     }



}

for (object of objectList) {

    //check whether absentTime is too short.
    if (object.totalTime < absentSessionTime) {

        let student = getStudent(object.spanId);
        student.totalTime = object.totalTime;
        absentTimeShort.push(student);

    }
     else if (startTime==="11:00"&&object.lastLeave<"13:20") {
        let student = getStudent(object.spanId);
        student.lastLeave = object.lastLeave;
        absentSecondSession.push(student);
    }
    else if(object.joinTime > lateTime) {
        let student = getStudent(object.spanId);
        student.joinTime = object.joinTime;
        lateList.push(student);
    }

}




//now check against the class List.
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

console.log('---------------------------------');
console.log('');
console.log('Late list:')


if (lateList.length==0) {
    console.log("None");
} else {
    let superLateList = [];
    if (lateList.length>1) {
         lateList.sort( (a,b) =>  a.serialNumber > b.serialNumber ? 1: -1);
    }
    for (student of lateList) {
         if (student.joinTime > superLateTime) {
            superLateList.push(student);
         } else {
             console.log('#:' + student.serialNumber + ', id: ' + student.id + ', join time: ' + student.joinTime + ' MST');
         }
    }
    if (superLateList.length>0) {
        if (lateList.length==0) {
            console.log('None');
        }
        console.log('');
        console.log('Super Late list (should be marked absent):');
        for (student of superLateList) {
            console.log('#:' + student.serialNumber + ', id: ' + student.id + ', join time: ' + student.joinTime + ' MST');
        }
    }

}


if (absentTimeShort.length>0) {
    console.log('');
    console.log('Absence list, those who stayed in session under total time of ' + absentSessionTime + ': ');

     //if list is greater than 1 element sort it.
    if (absentTimeShort.length>1) {
         absentTimeShort.sort( (a,b) =>  a.serialNumber > b.serialNumber ? 1: -1);
    }
    for (student of absentTimeShort) {
        console.log('#: '+ student.serialNumber + ', id: ' + student.id + ', total time in session: ' + student.totalTime );
    }
}

if (absentSecondSession.length>0) {
    console.log('');
    console.log('Absence list, those who left before the 2nd session (1:20PM or 13:20 MST): ');
    //if list is greater than 1 element sort it.
    if (absentSecondSession.length>1) {
         absentSecondSession.sort( (a,b) =>  a.serialNumber > b.serialNumber ? 1: -1);
    }


    for (student of absentSecondSession) {
        console.log('#: ' + student.serialNumber + ', id: ' + student.id + ', left at: ' + student.lastleave + ' MST');
    }
}

console.log('');
console.log("Absence list, those who were not present:")
for (student of absentList ) {
    if(student.serialNumber!==3)  console.log('#: ' + student.serialNumber + ', id: ' + student.id );
}

}
`
/*----------------Input Handling functions for start time and absent session time -------------------*/
var startTime='8:00';
var absentSessionTime='00:45'; //45minutes for 3hours.

function selectTime(event) {
  startTime = event.target.value;
}

function selectSession(event) {
  absentSessionTime=event.target.value;
}


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
