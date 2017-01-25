$(document).ready(function() {
  if(isAPIAvailable()) {
    $('#file').bind('change', prepare);
  };
  $("#cmd").on('keyup', function (e) {
      if (e.keyCode == 13) {
          out(this.value);
          execCmd(this.value);
          this.value='';
      }
  });
});

function updateStates(s){
  {'grade':false,'id':false,'multi':false,'add':false,'del':false,'giveup':false,'idf':false,'nd',false}
};
  //commands
  if (/idf\s*=\s*\d{1,3}\s*/.test(s)){
    Vars.states.idf=true;
  }else if (/nd\s*=\s*\d{1,3}\s*/.test(s)){
    Vars.states.nd=true;
  }else if (/add\s+.*/.test(s)){
    Vars.states.add=true;
  }else if (/del\s+\d+/.test(s)){
    Vars.del=true;
  }else if ("/\d{"+Vars.nd+"}/".test(s)){
    Vars.
  }
        
      
      
  }else if (Vars.score==-1 && ){

  }else{

  }}
          


function execCmd(s){
  //commands
  if (/idf\s*=\s*\d{1,3}\s*/.test(s)){
    Vars.idf=Number(s.match(/\d{1,3}/)[0])
  }else if (/nd\s*=\s*\d{1,3}\s*/.test(s)){
    Vars.nd=Number(s.match(/\d{1,3}/)[0])
  }else if (/new\s+.*/.test(s)){
    var name = s.match(/new\s+(.*)/)[1];
    for (i=0;i<Vars.data.length;i++){
      if(i==0){
        Vars[i].push(name);
      }else{
        Vars[i].push('');
      }
    }
    printPrev();
    out("A new column named"+name+" is created!","lime")
  }else if (/delete\s+\d+/.test(s)){
    var col = Number(s.match(/delete\s+(\d+)/)[1]);
    for (i=0;i<Vars.data.length;i++){
        Vars[i].splice(col-1,1);
      }
    printPrev();
    out("A new column named"+name+" is created!","lime")
  }else if ("/\d{"+Vars.nd+"}/".test(s)){
      loc=locate('(/.*'+s+')$/')
          Vars.states.id=false;
          Vars.states.multi=true;
          beep()
          out('More than 1 students are located, please choose the correct one (input the number):','red')
        }else{
          Vars.states.id=true;
        }
        
        
      }else{
        Vars.states.id=false;
        beep();
        out("This student isn't found!",'red')
      }
      
      
  }else if (Vars.score==-1 && ){

  }else{

  }
          }
            
function locate(reg){
    var found={'vars':[],'ids':[]};
    var x='';
    for (i=1;i<Vars.data.length;i++){
      x=Vars.data[i][Vars.idf].match(reg);
      if (x.length>0){
        found.ids.push(i);
        found.vars.push(x[0])
      }
    }
    return found
  }

function prepare(evt){
  var file = evt.target.files[0]; // FileList object
  var reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function(event){
    var csv = event.target.result;
    window.Vars={};
    Vars.data=$.csv.toArrays(csv);
    Vars.states={'grade':false,'id':false,'multi':false,'add':false,'del':false,'giveup':false};
    printPrev();
    out("You've loaded '"+file.name+"'.");
    out("Total number of students: "+String(Vars.data.length-1));
    var reg=/[cC]\d{5,}/;
    for (i = 0; i < Vars.data[0].length; i++) {
      x=reg.test(Vars.data[1][i]);
      if (x){
        Vars.idf=i;
        Vars.nd=4;
        out('The C number is found at column '+(Vars.idf+1)+', and the last 4 digits of it will be used to identify the students.','lime')
        out('If you want to change the identifier to other column, you can input "idf=xxx", where xxx is the column sequence number','blue');
        out('If you want to change the number of digits to be used, you can input "nd=xxx", where xxx is the number of digits.','blue');
        break;
      };
      if (i == Vars.data[0].length-1){
        out('Please set the column for identifying the students by inputting "idf=xxx", where xxx is the sequence number of the column (see "preview" at the bottom).','blue');
      };
    }
    out("now you may start recording grades (you can change settings at anytime using commands).",'lime')
  }
}


function out(s,color){
  if (typeof color == 'undefined'){
    color='black';
  } 
  $('#console-content').append('<p class="msg" style="color:'+color+'">'+s+'</p>')
  $('#console').scrollTop($("#console")[0].scrollHeight);
}

function isAPIAvailable() {
  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
    return true;
  } else {
    // source: File API availability - http://caniuse.com/#feat=fileapi
    // source: <output> availability - http://html5doctor.com/the-output-element/
    document.writeln('The HTML5 APIs used in this form are only available in the following browsers:<br />');
    // 6.0 File API & 13.0 <output>
    document.writeln(' - Google Chrome: 13.0 or later<br />');
    // 3.6 File API & 6.0 <output>
    document.writeln(' - Mozilla Firefox: 6.0 or later<br />');
    // 10.0 File API & 10.0 <output>
    document.writeln(' - Internet Explorer: Not supported (partial support expected in 10.0)<br />');
    // ? File API & 5.1 <output>
    document.writeln(' - Safari: Not supported<br />');
    // ? File API & 9.2 <output>
    document.writeln(' - Opera: Not supported');
    return false;
  }
}

function printPrev() {
    var data=Vars.data.slice(0,4);
    data.splice(0,0,range(1,data[0].length,1));
    var html = '';
    for(var row in data) {
      html += '<thead><tr>\r\n';
      for(var item in data[row]) {
        html += '<td>' + data[row][item] + '</td>\r\n';
      }
      html += '</tr></thead>\r\n';
    }
    $('#preview-content').html(html);
}

function saveCSV(filename, rows) {
    var csvFile = '';
    csvFile = $.csv.fromArrays(rows,{'delimiter':'"'})
    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
function beep() {
  var sound = document.getElementById("player");
  sound.play();
}

function range(start, end, step) {
    var range = [];
    var typeofStart = typeof start;
    var typeofEnd = typeof end;

    if (step === 0) {
        throw TypeError("Step cannot be zero.");
    }

    if (typeofStart == "undefined" || typeofEnd == "undefined") {
        throw TypeError("Must pass start and end arguments.");
    } else if (typeofStart != typeofEnd) {
        throw TypeError("Start and end arguments must be of same type.");
    }

    typeof step == "undefined" && (step = 1);

    if (end < start) {
        step = -step;
    }

    if (typeofStart == "number") {

        while (step > 0 ? end >= start : end <= start) {
            range.push(start);
            start += step;
        }

    } else if (typeofStart == "string") {

        if (start.length != 1 || end.length != 1) {
            throw TypeError("Only strings with one character are supported.");
        }

        start = start.charCodeAt(0);
        end = end.charCodeAt(0);

        while (step > 0 ? end >= start : end <= start) {
            range.push(String.fromCharCode(start));
            start += step;
        }

    } else {
        throw TypeError("Only string and number types are supported");
    }

    return range;

}