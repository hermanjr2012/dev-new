function readyJournal() {
    
    //fade bg paper on click
    $('#ndpTA').click(function() { 
        $('#ndpTA').addClass('active-journal');
        /*css('background','#FFF');*/
    });

    
    //handle save & upload click
    $('#journalSaveUpload input').on('tap',function() {
    
        var journalTitle = $('#journal').val();
        var journalText = $('#ndpTA').val();
        keepOnTop();
        
        if (journalTitle.length > 0) {
        
            if (journalText.length > 0) {
            
                console.log('Posting Journal - Title: ' + journalTitle);
                toastr.info('Uploading...');
                $.post("http://www.lifestimecapsule.com/ajax/upload", { "title": journalTitle, "content": journalText, "media": 'journal', crossDomain: true })
                    .success(function(data) { 
                        toastr.success('Upload Success!');    
                        $('#journal').val('');
                        $('#ndpTA').val('');
                        $('#ndpTA').removeClass('active-journal');
                    })
                    .fail(function (xhRequest, ErrorText, thrownError) { console.log(xhRequest.status + ', ' + ErrorText + ', ' + thrownError); toastr.error('Please check your internet connection and try your upload again.','Journal Upload Error'); });
                
            } else { toastr.error('Please provide some content for this journal entry.','Journal Upload Error'); }        
            
        } else { toastr.error('Please provide a title for this journal entry.','Journal Upload Error'); }
        
    });

}