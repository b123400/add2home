// Generated by CoffeeScript 1.6.3
(function() {
  $(function() {
    var canSubmit, currentUUID, errorIfSubmit, myDropzone, refreshSubmitButton, uploaded;
    currentUUID = uuid.v4().substr(0, 5);
    uploaded = false;
    myDropzone = new Dropzone("div#droparea", {
      url: "/upload",
      thumbnailWidth: 400,
      thumbnailHeight: 400,
      maxFiles: 1,
      accept: function(file, done) {
        return done();
        if (file.type.indexOf('image' !== -1)) {
          alert('not supported mime type');
          return window.location.href = '/';
        } else {
          return done();
        }
      },
      params: {
        uuid: currentUUID
      }
    });
    myDropzone.on('addedfile', function() {
      return $('#droparea .message').hide();
    });
    myDropzone.on('drop', function(e) {
      return e.preventDefault();
    });
    myDropzone.on('success', function() {
      uploaded = true;
      $('#droparea').addClass('disable');
      return refreshSubmitButton();
    });
    $("div#droparea").addClass("dropzone");
    $('#url-uuid').val(currentUUID);
    errorIfSubmit = function() {
      if (!uploaded) {
        return "image";
      }
      if ($('#url-field').val() === "") {
        return "url";
      }
      return null;
    };
    canSubmit = function() {
      return errorIfSubmit() === null;
    };
    refreshSubmitButton = function() {
      return $('#url-submit').prop('disabled', !canSubmit());
    };
    $('#submit-div').on('mouseover', function() {
      var error;
      error = errorIfSubmit();
      if (error === "image") {
        return $('.image-error').fadeIn();
      } else if (error === "url") {
        return $('.url-error').fadeIn();
      }
    });
    $('#submit-div').on('mouseout', function() {
      return $('.image-error,.url-error').fadeOut();
    });
    return $('#url-field').on('keyup', function() {
      return refreshSubmitButton();
    });
  });

}).call(this);