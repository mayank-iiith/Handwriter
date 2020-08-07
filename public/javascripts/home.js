$(document).ready(function(){
    $('#inputFile').change(function(){
        $("#err-status").addClass("hide");
        $("#success-status").addClass("hide");
      });

    $('#convertBtn').on('click', function () {
        let files = new FormData();
        var ins = document.getElementById('inputFile').files.length;
        $("#err-status").addClass("hide");
        $("#success-status").addClass("hide");
        if(ins==0){
            $("#err-status").text("No File Selected.").removeClass("hide");
            return 0;
        }
        files.append('inputFile', $('#inputFile')[0].files[0]); 
        var file = $('#inputFile')[0].files[0].name;
        var extension = file.split('.').pop();
        if(extension !== 'txt') {
            $("#err-status").text("File should be .txt File").removeClass("hide");
            return 0;
        }
        var fileName = file.substring(0,file.length-4) + '-output.jpg';

        $("#convert").addClass("hide");
        $("#loading").removeClass("hide");

        $.ajax({
            type: 'POST',
            url: '/convert',
            data: files,
            contentType: false,
            processData: false,
            success: function (response) {
                if(!response.success){
                    $("#convert").removeClass("hide");
                    $("#loading").addClass("hide");
                    $("#inputFile").val("");
                    $("#err-status").text(response.message).removeClass("hide");
                    return 0;
                }
                var a = document.createElement('a');
                a.href = response.imgaddress;
                a.download = fileName;
                a.click();
                $("#success-status").text(`File downloaded with FileName: ${fileName}`).removeClass("hide");
                $("#convert").removeClass("hide");
                $("#loading").addClass("hide");
                $("#inputFile").val("");
                },
            error: function (err) {
                $("#convert").removeClass("hide");
                $("#loading").addClass("hide");
                $("#inputFile").val("");
                $("#err-status").text("Something Went Wrong. Please Try Again later.").removeClass("hide");
            }
        });
    });
});