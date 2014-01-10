
var  _tmpFiles = [];

var galleryFileList = {
   
    
    init: function() {
        _tmpFiles = [];
    },
    getFileList: function(data) {
        _tmpFiles.push(data);
    },
    bufferFileList: function() {
         return _tmpFiles;      
    }
}







$(document).on('tap','.thumbnails-wrapper',function(e){

    var t = $(event.e);
    //console.log(e);
    if (t.is('input:checkbox')) {
        return;
    }
    var checkbox = $(this).find("input[type='checkbox']");
        checkbox.prop("checked", !checkbox.is(':checked'));
});



/* a tag wont accept tap so resort back to click */
$(document).on('click','#uploadselected',function(e){
     $("#gallery-list").each(function(i,div) {
              $(div).find('input:checked').each(function(i,el){
                  // alert($(el).attr('data-value'));
                  galleryFileList.getFileList($(el).attr('data-value'));
                 
          	  });
      });
    
    var tmp = galleryFileList.bufferFileList();
    if( tmp instanceof Array ){
        //alert(galleryFileList.bufferFileList());
        var photoTitle = $('#photosmulti').val(); 
        if (tmp.length > 0) {
            
            if (photoTitle.length > 0) {
                toastr.info('Uploading...');            
                //function uploadFile(postURI,fileURI,fileName,title,media,lat,lng,content)
                for (index = 0; index < tmp.length; ++index) {
                    uploadFile('http://www.lifestimecapsule.com/ajax/upload',tmp[index],tmp[index],photoTitle,'photo',-1,-1,'');
                }            
            } else{
                toastr.error('Please provide a title for this photo.','Photo Upload Error');
            }
            
        } else {
            toastr.error('Please select photo to upload','Photo Upload Error');     
        }        
    }  
    
    
    /*reset array*/
    galleryFileList.init();
});


/* bind this div to change event */

$(document).bind("pagebeforechange",function(e,data){
	var toPage = data.toPage;

	if(typeof toPage === 'string') {
		var u = $.mobile.path.parseUrl(toPage);
		toPage = u.hash || '#' + u.pathname.substring(1);
    		if(toPage === '#photogallery')	 {
                
           
              var domParent = $('#gallery-list');
                 //check if images already loaded
                if (domParent.html() == '') {
                 CameraRoll.getPhotos(function(picdata){

                                      if(picdata!=null) {
                    var htmlString = '';
            		htmlString = htmlString + '<li><div class="thumbnails-wrapper">';
            		htmlString = htmlString + '	<input data-value="'+picdata+'" type="checkbox" name="checkbox-sel[]"  />';
            		htmlString = htmlString + '	<img src="'+picdata+'"/>';
            		htmlString = htmlString + '</div></li>';	
            		domParent.append(htmlString);
                                      }

                });
                 }
                
    		}
	    }
    
	
});