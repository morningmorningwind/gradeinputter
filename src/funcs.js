$(document).ready(function() {
  if(isAPIAvailable()) {
    $('#file').bind('change', handleFileSelect);
  };
  $("#cmd").on('keyup', function (e) {
      if (e.keyCode == 13) {
          out(this.value);
          this.value='';
      }
  });
});

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

function handleFileSelect(evt) {
  var file = evt.target.files[0]; // FileList object

  // read the file metadata
  var output = ''
      output += '<span style="font-weight:bold;">' + escape(file.name) + '</span><br />\n';
      output += ' - FileType: ' + (file.type || 'n/a') + '<br />\n';
      output += ' - FileSize: ' + file.size + ' bytes<br />\n';
      output += ' - LastModified: ' + (file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a') + '<br />\n';
  alert(file);
  // read the file contents
  printTable(file);

  // post the results
  $('#list').append(output);
}

function printTable(file) {
  var reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function(event){
    var csv = event.target.result;
    var data = $.csv.toArrays(csv);
    window.data1=data
    var html = '';
    for(var row in data) {
      html += '<tr>\r\n';
      for(var item in data[row]) {
        html += '<td>' + data[row][item] + '</td>\r\n';
      }
      html += '</tr>\r\n';
    }
    $('#contents').html(html);
  };
  reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
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