document.addEventListener("deviceready", callReadyOnce, false);

var calledReady = false;
function callReadyOnce() { if (!calledReady) { onDeviceReady(); calledReady = true; } }

// PhoneGap is ready
function onDeviceReady() { navigator.splashscreen.hide(); doSetup(); }



function doSetup() {
    
    addDeviceTypeToBody();
    setTimeout('showStuff()',500);
    
    //jquery mobile tweaks
    $.mobile.buttonMarkup.hoverDelay = 100;
    $(document).bind("mobileinit", function(){ $.mobile.pushStateEnabled = false; });
    
    // warn if no internet
    if ( (navigator.connection.type.toLowerCase == 'none') && (navigator.connection.type.toLowerCase == '') ) { $('#lostConnection').show(); }
    
    //prevent scrolling - document.ontouchmove = function(e) {e.preventDefault()};
    function stopScrolling( touchEvent ) { touchEvent.preventDefault(); }
    document.addEventListener( 'touchmove' , stopScrolling , false );

    //do login stuff
    doLogin();
    
    //load media logic
    readyPhoto();
    readyVideo();
    readyJournal();
    readyAudio();
    
    keepOnTop();    
    
    getUserOBJ();
}

function shouldRotateToOrientation(orientation) {  
    //force portrait orientation
	//console.log(orientation);
    //var dmForBody = device.model.toLowerCase();
    //var deviceModelAgent = dmForBody.split(" ");
    //var deviceModelAgentres = deviceModelAgent[0];
    
    //if(deviceModelAgentres === 'ipad'){
    //   document.addEventListener("orientationchange", updateOrientation);
    //} else{
    //    return orientation = 0;
    //}
     return orientation == 0;
}

function addDeviceTypeToBody() {
    console.log('-----------------------------------------');
    console.log('Device Platform: ' + device.platform);
    console.log('Device Name: ' + device.name);
    console.log('Device Version: ' + device.version);   
    
    console.log('Device Model: ' + device.model);

    console.log('Device UUID: ' + device.uuid);
    console.log('Device Cordova: ' + device.cordova);
    
    console.log('width: ' + $(document).width() + ' height: ' + $(document).height());
    console.log('-----------------------------------------');
    

    
    var dv = device.platform.toLowerCase();
    var dm = device.model.toLowerCase();
    dm = dm.replace(/\s/g, '');
    dm = dm.replace(/,/g, '-');
    $('body').addClass('platform-' + dv);
    $('body').addClass(dv + '-model-' + dm);
    
    if ( dm == 'iphone5-1' ) {
        $('#picture-add').addClass(dv + '-model-' + dm);
        $('#video-add').addClass(dv + '-model-' + dm);
        $('#audio-add').addClass(dv + '-model-' + dm);
        $('#ndpTA').addClass(dv + '-model-' + dm);
    }
    
    
}

function hideLoadBlock() { $('#loadBlock').fadeOut(1000); $('#wrap').fadeIn(1000); }
function showStuff() { $('body').css('visibility','visible'); }

