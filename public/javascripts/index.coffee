$ ->
  currentUUID = uuid.v4().substr(0,5)
  uploaded = false
  
  myDropzone = new Dropzone "div#droparea", 
    url             : "/upload"
    thumbnailWidth  : 400
    thumbnailHeight : 400
    maxFiles : 1
    accept : (file,done)->
      return done()
      if file.type.indexOf 'image' != -1
        alert 'not supported mime type'
        window.location.href = '/'
      else
        done()
    params : 
      uuid : currentUUID

  myDropzone.on 'addedfile', ->

    $('#droparea .message').hide()

  myDropzone.on 'drop', (e)->
    e.preventDefault()

  myDropzone.on 'success', ->
    uploaded = true
    $('#droparea').addClass 'disable'
    refreshSubmitButton()

  $("div#droparea").addClass "dropzone"

  $('#url-uuid').val(currentUUID);

  errorIfSubmit = ->
    if !uploaded
      return "image"
    if $('#url-field').val() is ""
      return "url"
    return null

  canSubmit = -> errorIfSubmit() is null

  refreshSubmitButton = ->
    $('#url-submit').prop 'disabled', !canSubmit()

  $('#submit-div').on 'mouseover', ->
    error = errorIfSubmit()
    if error is "image"
      $('.image-error').fadeIn()
    else if error is "url"
      $('.url-error').fadeIn()

  $('#submit-div').on 'mouseout', ->
    $('.image-error,.url-error').fadeOut()


  $('#url-field').on 'keyup', ->
    refreshSubmitButton()