// Fix onclick for the links, which gets messed up when the onmousedown
// and onmouseup events get called on different elements
$(document).ready(function() {
    $('.nav li').each(function(i, li) {
        $(li).mouseup(function() {
            window.location = li.firstChild.href;
        });
    });
});


Dropzone.autoDiscover = false;

const myDropzone = new Dropzone("#my-awesome-dropzone", { autoProcessQueue: false, maxFiles: 200 });

const $button = document.getElementById('submit-files');
$button.addEventListener('click', function () {
  // Retrieve selected files
  const acceptedFiles = myDropzone.getAcceptedFiles();
  for (let i = 0; i < acceptedFiles.length; i++) {
    myDropzone.processFile(acceptedFiles[i]);
    //console.log(acceptedFiles[i]);
  }
})

