function readyPhoto() {
    
    photoApp = new photoApp();
    photoApp.run();    
    
}

function photoApp(){}

photoApp.prototype={

    _pictureSource: null,
    _destinationType: null,        
    
    _captureCount: 0,
    _captureArray: null,
    
    run: function(){
        var that=this;
	    that._pictureSource = navigator.camera.PictureSourceType;
	    that._destinationType = navigator.camera.DestinationType;        
        
        $('#capturePhotoButton').on('tap',function() { that._capturePic.apply(that,arguments);  });
        $('#getPhotoFromLibraryButton').on('tap',function() { that._getPhotoFromLibrary.apply(that,arguments); });
        
        $('#photoSaveUpload').click(function() {
            if (that._captureCount > 0) {
                
                var photoTitle = $('#photo').val(); keepOnTop();
                
                if (photoTitle.length > 0) {
                    console.log('Uploading: ' + that._captureArray[0].fullPath);
                    toastr.info('Uploading...');                    
                    
                    //function uploadFile(postURI,fileURI,fileName,title,media,lat,lng,content)
                    uploadFile('http://www.lifestimecapsule.com/ajax/upload',that._captureArray[0].fullPath,that._captureArray[0].fullPath,photoTitle,'photo',-1,-1,'');
                    
                } else {
                    toastr.error('Please provide a title for this photo.','Photo Upload Error');     
                }
            } else {
                toastr.error('A photo has yet to be taken!','Photo Upload Error'); 
            }
            
        });
    },    

	_capturePhoto:function() {
		var that = this;
        
		navigator.device.capture.captureImage(
            function() { that._captureSuccess.apply(that, arguments); }, 
            function() { that._onFail.apply(that, arguments); }
        ,{
            limit:1, quality:25
        });
	},    
    
    _capturePic:function() {
        var that = this;
        
        navigator.camera.getPicture(
            function(imageURI) { 
            
                $('#photoImage').css('display','block').attr('src',imageURI);
                
                var mediaArray = [];
                var mediaFile = {};
                
                mediaFile.name = '';
                mediaFile.fullPath = imageURI;
                mediaFile.type = '';
                mediaFile.lastModifiedDate = '';
                mediaFile.size = 1;
                
                mediaArray.push(mediaFile);
        
                that._captureCount = 1;
                that._captureArray = mediaArray;
                
            },
            function() {  }, { correctOrientation : true, quality: 50, destinationType: Camera.DestinationType.FILE_URI });
    },
    
	_captureSuccess:function(capturedFiles) {
		var that = this;
        
        that._captureCount = capturedFiles.length;
        that._captureArray = capturedFiles;
        
        /* the rest of this code only works for one image. may need to be revised when we move to handle multiple images */
        $('#photoImage').attr('src',that._captureArray[0].fullPath);
	},    
    
    _onFail: function(error) {
        //toastr.error('Failed! Error: ' + error.code);
        toastr.error('No Photo Taken!','Photo Upload Error');
    },
    
    
    //Get Photo from Device Library
    _getPhotoFromLibrary: function() {
        var that= this;
        
        navigator.camera.getPicture(
            function(){ that._onPhotoURISuccess.apply(that,arguments); }, 
            function(){ that._onLibraryFail.apply(that,arguments); } 
        ,{
            quality: 50,
            destinationType: that._destinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
            mediaType: Camera.MediaType.PHOTO,
            correctOrientation : true
        });        
    },    
    
    _onPhotoURISuccess: function(imageURI) {
        var that = this;
        
        $('#photoImage').css('display','block').attr('src',imageURI);

        var mediaArray = [];
        var mediaFile = {};
        
        mediaFile.name = '';
        mediaFile.fullPath = imageURI;
        mediaFile.type = '';
        mediaFile.lastModifiedDate = '';
        mediaFile.size = 1;
        
        mediaArray.push(mediaFile);

        that._captureCount = 1;
        that._captureArray = mediaArray;
    },
    
    _onLibraryFail: function(message) {
        toastr.error('No Photos Selected!','Photo Upload Error');
    },
    
}





