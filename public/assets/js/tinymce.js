tinymce.init({
    selector: 'textarea#default',
    height: 300,
    plugins: [
        'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
        'searchreplace', 'wordcount', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media',
        'table', 'emoticons', 'advanced template', 'codesample', 'html', 'uploadfile', 'line', 'strikethrough'
    ],
    toolbar: 'undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify |' +
        'bullist numlist outdent indent | link image uploadfile | print preview media fullscreen | ' +
        'forecolor backcolor emoticons line table',
    menu: {
        favs: { title: 'menu', items: 'code visualaid | searchreplace | emoticons' }
    },
    menubar: 'favs file edit view insert format tools table',
    content_style: 'body{font-family: "Times New Roman", Times, serif; font-size:16px;}'
   
});


document.addEventListener('DOMContentLoaded', function () {
    var selectElement = document.getElementById('inputGroupSelect01');
    var hideShowDiv = document.querySelector('.hide-show');
    selectElement.addEventListener('change', function () {
        if (selectElement.value !== "") {
            hideShowDiv.style.display = 'block';
        } else {
            hideShowDiv.style.display = 'none';
        }
    });
});
