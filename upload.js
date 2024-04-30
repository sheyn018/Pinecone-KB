// upload.js
function uploadFile() {
    console.log("Uploading file...");
    
    var fileInput = document.getElementById('fileInput');
    if (fileInput.files && fileInput.files.length) {
        var file = fileInput.files[0];

        var formData = new FormData();
        formData.append('file', file);
        
        fetch('http://localhost:5500', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.text())  // or response.json() if the server responds with JSON
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    } 
    
    else {
        console.log("No file selected");
    }
}
