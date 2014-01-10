function readyVideo() {
    
    videoApp = new videoApp();
    videoApp.run();    
    
}

function videoApp(){}

videoApp.prototype={

    _pictureSource: null,
    _destinationType: null,            
    
    _captureCount: 0,
    _captureArray: null,    
    
    run: function(){
        var that=this;
	    that._pictureSource = navigator.camera.PictureSourceType;
	    that._destinationType = navigator.camera.DestinationType;                
        
        $('#captureVideoButton').on('tap',function() { that._captureVideo.apply(that,arguments);  });
        $('#getVideoFromLibraryButton').on('tap',function() {  that._getVideoFromLibrary.apply(that,arguments); });        
        
        $('#videoSaveUpload').click(function() {
            if (that._captureCount > 0) {
                
                var videoTitle = $('#video').val(); keepOnTop();
                
                if (videoTitle.length > 0) {
                    console.log('Uploading: ' + that._captureArray[0].fullPath);
                    toastr.info('Uploading...');
                    
                    //function uploadFile(postURI,fileURI,fileName,title,media,lat,lng,content)
                    uploadFile('http://www.lifestimecapsule.com/ajax/upload',that._captureArray[0].fullPath,that._captureArray[0].fullPath,videoTitle,'video',-1,-1,'');
                    
                } else {
                    toastr.error('Please provide a title for this video.','Video Upload Error');     
                }
            } else {
                toastr.error('A video has yet to be recorded!','Video Upload Error'); 
            }
            
        });
    },    

	_captureVideo:function() {
		var that = this;
        
		navigator.device.capture.captureVideo(
            function() { that._captureSuccess.apply(that, arguments); }, 
            function() { videoApp._onFail.apply(that, arguments); }
        ,{
            limit:1,
            duration: 40000
        });
	},    
    
	_captureSuccess:function(capturedFiles) {
		var that = this;
        
        that._captureCount = capturedFiles.length;
        that._captureArray = capturedFiles;
        that._showVideo();
	},    
    
    _onFail: function(error) {
        toastr.error('No Video was taken!');
    },
    
    
    _showVideo: function() {
        var that = this;
        var videoURL = that._captureArray[0].fullPath.toLowerCase(); 

        if (videoURL.indexOf('.mov') > -1 ) {
            var code = '<video id="show-video-js" width="' + $(document).width() + '" height="' + ($(document).height()-340) + '"><source src="' + that._captureArray[0].fullPath + '"></video>';
            $('#videoContent').html(code);      
        } else {
            $('#videoContent').html('').addClass('noPreview');
        }
    },
    
    
    
    _getVideoFromLibrary: function() {
        var that= this;
        
        navigator.camera.getPicture(
            function(){ that._onPhotoURISuccess.apply(that,arguments); }, 
            function(){ that._onLibraryFail.apply(that,arguments); } 
        ,{
            quality: 50,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
            mediaType: navigator.camera.MediaType.VIDEO,
            correctOrientation : true
        });        
    },
    
    _onPhotoURISuccess: function(imageURI) {
        var that = this;
        
        if (imageURI.indexOf('content://') > -1) {
            
            try {
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) { console.log(fileSystem.name); }, function(evt) {
                
                    toastr.error('Uh oh! An error occurred.','Video File Capture Error');
                    
                });
                window.resolveLocalFileSystemURI(imageURI, function(fileEntry) {
            
                    console.log(fileEntry.fullPath);
                    var mediaArray = [];
                    var mediaFile = {};
                    
                    mediaFile.name = '';
                    mediaFile.fullPath = fileEntry.fullPath;
                    mediaFile.type = '';
                    mediaFile.lastModifiedDate = '';
                    mediaFile.size = 1;
                    
                    mediaArray.push(mediaFile);
            
                    that._captureCount = 1;
                    that._captureArray = mediaArray;
                    that._showVideo();                    
                    
                }, function(evt){ 
                    
                    toastr.error('Uh oh! An error occurred.','Video File Capture Error');
                    
                });
            } catch(err) {
                console.log('Error: ' + err);
                toastr.error('Uh oh! An error occurred.','Video File Capture Error');
            }
            
        } else {
            
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
            that._showVideo();            
            
        }

    },
    
    _onLibraryFail: function(message) {
        toastr.error('No Video was Taken!');
    }
}