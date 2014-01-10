function readyAudio() {
    
    audioApp = new audioApp();
    audioApp.run();    
    
}

function audioApp(){}

audioApp.prototype={
    
    _captureCount: 0,
    _captureArray: null,     

    run: function(){
        var that=this;
        
        $('#captureAudioButton').on('tap',function() { that._captureAudio.apply(that,arguments);  });
        
        $('#audioSaveUpload').on('tap',function() {
            if (that._captureCount > 0) {
                
                var audioTitle = $('#audio').val(); keepOnTop();
                
                if (audioTitle.length > 0) {
                    console.log('Uploading: ' + that._captureArray[0].fullPath);
                    toastr.info('Uploading...');
                    
                    //function uploadFile(postURI,fileURI,fileName,title,media,lat,lng,content)
                    uploadFile('http://www.lifestimecapsule.com/ajax/upload',that._captureArray[0].fullPath,that._captureArray[0].fullPath,audioTitle,'audio',-1,-1,'');
                    
                } else {
                    toastr.error('Please provide a title for this audio clip.','Audio Upload Error');     
                }
            } else {
                toastr.error('An audio clip has yet to be recorded!','Audio Upload Error'); 
            }
            
        });
    },    
    

	_captureAudio:function() {
		var that = this;
        
		navigator.device.capture.captureAudio(
            function() { that._captureSuccess.apply(that, arguments); }, 
            function() { audioApp._onFail.apply(that, arguments); }
        ,{
            limit:1,
            duration: 120
        });
	},    
    
	_captureSuccess:function(capturedFiles) {
		var that = this;
        
        that._captureCount = capturedFiles.length;
        that._captureArray = capturedFiles;
        
        var audioFile = that._captureArray[0].fullPath;
        console.log(audioFile);
        
        if (audioFile.indexOf('3ga') > -1) {
            //$('#audioArea #audioContainer').html('<audio controls style="width: 300px;"><source src="' + that._captureArray[0].fullPath + '" type="audio/mpeg"></audio>');    
            
            $('#audio-add').addClass('noPreview');
        } else {
            $('#audioArea #audioContainer').html('<audio controls style="width: 300px;"><source src="' + that._captureArray[0].fullPath + '"></audio>');
        }
        
        
	},    
    
    _onFail: function(error) {
        toastr.error('Failed! Error: ' + error.code);
    }    
}