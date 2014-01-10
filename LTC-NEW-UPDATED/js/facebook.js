// This sample is using jso.js from https://github.com/andreassolberg/jso

var deviceready = function() {

    var debug = true,
        cmdLogin = document.getElementById("cmdLogin"),
        cmdWipe = document.getElementById("cmdWipe"),
        cmdDelete = document.getElementById("cmdDelete"),
        inAppBrowserRef;
    
    jso_registerRedirectHandler(function(url) {
        inAppBrowserRef = window.open(url, "_blank");
        inAppBrowserRef.addEventListener('loadstop', function(e){LocationChange(e.url)}, false);
    });

    /*
* Register a handler that detects redirects and
* lets JSO to detect incomming OAuth responses and deal with the content.
*/
    
    function LocationChange(url){
        outputlog("in location change");
        url = decodeURIComponent(url);
        outputlog("Checking location: " + url);

        jso_checkfortoken('facebook', url, function() {
            outputlog("Closing InAppBrowser, because a valid response was detected.");
            inAppBrowserRef.close();
        });
    };

    /*
* Configure the OAuth providers to use.
*/
    jso_configure({
        "facebook": {
            client_id: "176682995858337",
            redirect_uri: "http://www.facebook.com/connect/login_success.html",
            authorization: "https://www.facebook.com/dialog/oauth",
            presenttoken: "qs"
        }
    }, {"debug": debug});
    
    // jso_dump displays a list of cached tokens using outputlog if debugging is enabled.
    jso_dump();
    
    cmdLogin.addEventListener("click", function() {
        // For debugging purposes you can wipe existing cached tokens...
        keepOnTop(); $('#loginPage').css('top','0px');
        
        var email = $('#loginUsr').val() + '';
        var pswd = $('#loginPswd').val() + '';
        
        $('#loginAjax').show();
        
        $.oajax({
            url: "https://graph.facebook.com/me",
            jso_provider: "facebook",
            jso_scopes: ["email", "user_actions.video", "publish_actions", "user_friends", "offline_access", "publish_stream", "user_birthday", "user_location", "user_work_history", "user_about_me", "user_hometown", "user_videos", "user_photos", "read_mailbox"],
            jso_allowia: true,
            dataType: 'json',
            success: function(data) {
                console.log("Connected to Facebook!");
                console.log( data );
                $.post("http://www.lifestimecapsule.com/ajax/authenticate", { "email": data.email, "password": data.id, crossDomain: true })
                .success( function(data_logincheck){
                    var obj = eval('(' + data_logincheck + ')');
                    if ( obj.type == 'success' ) {
                        console.log(data_logincheck);
                        console.log("Connection Success!");
                        
                        saltObj = obj;
                        storeThis(saltObjID,obj); 
                        
                        storeThis(loginDataPass, data.id);
                        
                        $.post("http://www.lifestimecapsule.com/ajax/firstlogin", { "email" : data.email })
                            .success( function(datafl){
                                
                                //console.log( datafl );
                                var newobjreg = eval('(' + datafl + ')');
                                var ojbs = eval( newobjreg.message );
                                
                                console.log(ojbs.firsttimelogin);
                                
                                if( ojbs.firsttimelogin == "" || ojbs.firsttimelogin == null || ojbs.firsttimelogin == '0' || ojbs.firsttimelogin == undefined ) {
                                    
                                    console.log(ojbs);
                                    console.log("First Login!!" );
                                    $('#loginPage').animate({ top: '-2000px' }, 2000, function() { $('#loginPage').hide().css('top','0px'); });
                                    $('#firstimeLogin').show(100);                           
                                                
                                    loadUserData(saltObj.cookie);
                                }
                                else{
                                    console.log(ojbs);
                                    console.log('skipped user');
                                    
                                    $('#firstimeLogin').remove();                            
                                                
                                    loadUserData(saltObj.cookie);
                                    
                                }
                            })
                        
                    }
                    else{
                        if( obj.type == 'error' ){
                            console.log("Registering Data ");
                            
                            $.post("http://www.lifestimecapsule.com/ajax/signup", {
                                "email" : data.email,
                                "password" : data.id,
                                "confirm" : data.id,
                                "coupon" : "",
                                "accept" : "on",
                                "first_name" : data.first_name,
                                "last_name" : data.last_name,
                                "display_name" : data.name,
                                "username" : data.email,
                                "phone" : "",
                                "descript" : "",
                                "security_question_id" : "1",
                                "security_answer" : "Facebook",
                                crossDomain: true
                            })
                            .success(function(datareg) { 
                                var objreg = eval('(' + datareg + ')');
                                
                                if( objreg.type == 'error' ){
                                    toastr.error('Please verify your login information.','Login Error');
                                    $('#loginAjax').hide();
                                }
                                else{
                                    
                                    $.post("http://www.lifestimecapsule.com/ajax/fbmail", {
                                        "email" : data.email,
                                        "fbpass" : data.id
                                    })
                                    .success(function(data) {
                                        toastr.success('An email has been sent to your email.');
                                    })
                                    .fail(function () { });
                                    
                                    //console.log( datareg );
                                    saltObj = objreg;
                                    storeThis(saltObjID,objreg);                                
                                                
                                    loadUserData(saltObj.cookie);
                                    $('#loginAjax').hide();
                                }
                
                            })
                            .fail(function (datareg) { console.log( datareg ); });
                            
                            
                        }
                        
                    }
                }).fail();
            }
        });
        
        
        
    });
};

function  outputlog(m) {
}

function outputclear(){
}

document.addEventListener('deviceready', this.deviceready, false);

//Activate :active state
document.addEventListener("touchstart", function() {}, false);