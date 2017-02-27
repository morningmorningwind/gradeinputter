$(document).ready(function() {
  window.Vars={};
  Vars.state=0.0;
  Vars.mx=100;
  Vars.col=-1;
  Vars.idf=-1;
  if(isAPIAvailable()) {
    $('#file').bind('change', prepare);
  };
  $('#cmd').on('keyup', function (e) {
      if (e.keyCode == 13) {
        if (this.value=="help"){
          out("<hr>")
          out("Steps:","orange")
          out('1. create the columns for recording the grades on "Blackboard" beforehand (if they are created off-line, the online system may not be able to recognize).','red')
          out("2. download the full grade book in .csv format (the comma-separated file type).",'blue')
          out("3. browse the file, and enjoy (remember to save it when it is done).",'blue')
          out("<hr>")
          out("Commands:","orange")
          out("col=9 (column #9 will be used to record the grades.)",'blue')
          out("col=7, 9 (column #7 and #9 will be used to record the grades.)",'blue')
          out("idf=3 (column #3 will be used to identify the students.)",'blue')
          out("nd=4 (the last 4 digits of the identifier will be used to locate the students.)",'blue')
          out("max=10 (the maxium allowed score is set to be 10---this is for automatic error-checking only)",'blue')
          out("add Quiz2 (create a column named Quiz2.)",'blue')
          out("del 10 (delete column #10)",'blue')
          out("<hr>")
        }else{
          out(this.value);
          updateStates(this.value);
          execCmd(this.value);
          }
          this.value='';
      }
  });
});

function updateStates(s){
  if ((Vars.idf==-1)||/idf\s*=\s*\d{1,3}\s*/.test(s)){
    Vars.state=2.1;
  }else if (Vars.col==-1 || /col\s*=(\s*\d{1,3}[\s|,]*)+/.test(s)){
    Vars.state=1.1;
  }else if (/nd\s*=\s*\d{1,3}\s*/.test(s)){
    Vars.state=2.2;
  }else if (/add\s+.*/.test(s)){
    Vars.state=2.3;
  }else if (/del\s+\d+/.test(s)){
    Vars.state=2.4;
  }else if (/max\s*=\s*\d{1,3}\s*/.test(s)){
    Vars.state=2.5;
  }else if (Vars.state!=4.0 && RegExp("\\d{"+Vars.nd+"}").test(s)){
    Vars.state=3.0;
  }else{
    if (Vars.state==-1){
      out("Invalid input",'red');
      beep();
    }
  }
}
          


function execCmd(s){
  //commands
    if (Vars.state==1.1){
      if (/col\s*=(\s*\d{1,3}[\s|,]*)+/.test(s)){
        var num=s.match(/\d{1,3}/g).map(function (x){return Number(x)-1})
        if (Math.max.apply(null,num)<Vars.data[0].length && Math.min.apply(null,num)>0){
          out('Grades will be recorded in column '+num.map(function(x){return x+1}).join(', ')+'.','lime');
          Vars.col=num;
          Vars.state=-1;
          out("Please input the last 4 digits of the student's C number:",'lime');
        }else{
          out('Out of range!','red');
          beep();
        }
      }else{
        out('Invalid input!','red');
        beep();
      }
    }else if (Vars.state==2.1){
    if (Vars.idf==-1){Vars.nd=4;}
    Vars.idf=Number(s.match(/\d{1,3}/)[0])-1;
    out("The last "+String(Vars.nd)+ " digits of column "+(Vars.idf+1)+" are now set for identifying the students.",'orange');
    if (Vars.col==-1){
      out('Please set the column for recording the grades by inputting "col=xxx", where xxx is the sequence number of the column (see "preview" at the bottom):','orange');
      Vars.state=1.1;
    }else{
      Vars.state=-1;
    }
  }else if (Vars.state==2.2){
    Vars.nd=Number(s.match(/\d{1,3}/)[0]);
    out("Number of digits to use as locator is set to be "+s+".",'orange');
    Vars.state=-1;
  }else if (Vars.state==2.3){
    var name = s.match(/add\s+(.*)/)[1];
    for (i=0;i<Vars.data.length;i++){
      if(i==0){
        Vars.data[i].push(name);
      }else{
        Vars.data[i].push('');
      }
    }
    printPrev();
    out("A new column named"+name+" is created!","lime");
    Vars.state=-1;
  }else if (Vars.state==2.4){
    var col = Number(s.match(/del\s+(\d+)/)[1]);
    for (i=0;i<Vars.data.length;i++){
        Vars.data[i].splice(col-1,1);
      }
    printPrev();
    out("Column "+col+" is deleted!","orange");
    Vars.state=-1;
  }else if (Vars.state==2.5){
    var col = Number(s.match(/max\s*=\s*(\d{1,3})\s*/)[1]);
    Vars.mx=Number(col);
    out("The maximum grade is set to be "+col+".","orange");
    Vars.state=-1;
  }else if (Vars.state==3.0){
    if (RegExp('^\\d{'+Vars.nd+'}$').test(s)){
      Vars.loc=locate(RegExp('(.*'+s+')$'))
      if (Vars.loc.ids.length>1){
        beep()
        out('More than 1 students are located, please choose the correct one (input the number in [ ]):','red')
        for (i=0;i<Vars.loc.ids.length;i++){
          out('['+String(i)+'] '+Vars.loc.vars[i],'orange');
        };
        Vars.state=3.1;
      }else if(Vars.loc.ids.length==1){
        Vars.id=Vars.loc.ids[0];
        out(Vars.loc.vars[0]+"'s grade: ")
        Vars.state=4.0
      }else{
        out('Student not found!','red')
        beep();
      }}else{
        out("Invalid input!","red");
        beep()
      }
  }else if (Vars.state==3.1){
    if (range(0,Vars.loc.ids.length-1,1).includes(Number(s))){
      Vars.id=Vars.loc.ids[Number(s)];
      out(Vars.loc.vars[Number(s)]+"'s grade: ");
      Vars.state=4.0
        }else{
          out('Invalid input!','red');
          beep();
        }
  }else if (Vars.state==4.0){
  	s=s.match(/\d+/g).map(Number);
    if (s.length==Vars.col.length){
      if (Math.min.apply(null,s)>=0 && Math.max.apply(null,s)<=Vars.mx){
      	for (i=0;i<s.length;i++){
      		Vars.data[Vars.id][Vars.col[i]]=s[i];
      	}
        Vars.state=3.0;
        out('next student: ')
      }else{
        out('The grades should be within 0-'+String(Vars.mx)+'!','red');
        beep();
      }
    }else{
      out('Invalid input for grades!','red');
      beep();
    }
  }
}         
function locate(reg){
    var found={'vars':[],'ids':[]};
    var x='';
    for (i=1;i<Vars.data.length;i++){
      x=Vars.data[i][Vars.idf].match(reg);
      if (x != null){
        if (x.length>0){
          found.ids.push(i);
          found.vars.push(x[0])
        }
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
    Vars.data=$.csv.toArrays(csv);
    Vars.state=1.0;//{'grade':false,'id':false,'multi':false,'add':false,'del':false,'giveup':false};
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
        out('Please set the column for recording the grades by inputting "col=xxx", where xxx is the sequence number of the column (see "preview" at the bottom):','orange');
        Vars.state=1.1;
        $('#cmd').val('col=');
        break;
      };
      }
    if (Vars.idf==-1){
        out("Can't locate the C number. Please set the column for identifying the students by hand (idf=xxx)!",'red');
        beep();
    
    }
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