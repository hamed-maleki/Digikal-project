var selectedUser,selectedUserInfo,info;
var selectedUserInfo
$( document ).ready(function() {
    $.getJSON("media/data/info.json", function(result){
        // console.log(result)
        var userLength = result.users.length;
        info = result
        for(var i = 0;i < userLength; i++) {
            $(".list-group").append(
                "<li class='list-group-item' id='user-list-"+result.users[i].id+"' onclick='showMessage("+result.users[i].id+")'>\
                    <img class='img-fluid rounded float-left' src='media/images/"+result.users[i].pic+"'>\
                    <div class='user-info'>\
                        <div>"+result.users[i].name+"\
                        </div>\
                        <div id='last-message-"+result.users[i].id+"'>"+result.users[i].lastMessage+"\
                        </div>\
                    </div>\
                    <span class='badge badge-pill badge-primary' id='read-badge-"+result.users[i].id+"'>"+result.users[i].unreadCount+"</span>\
                </li>"
            )
            if(result.users[i].unreadCount === 0) {
                $("#read-badge-"+result.users[i].id).addClass("hidden")
            }
            if(result.users[i].lastMessage == null) {
                $("#last-message-"+result.users[i].id).html("")
            }
        }
    })
    
})
var showMessage = function (id) {
    // console.log(info)
    selectedUser = id;
    $(".chat-container").removeClass("hidden");
    $("#text").val("")
    $(".chat-content").empty();
    $("#read-badge-"+id).addClass("hidden");
    $(".list-group-item").removeClass("selected");
    $("#user-list-"+id).addClass("selected");
    for(var i = 0; i < info.users.length;i++) {
        if(id == info.users[i].id) {
            selectedUserInfo = info.users[i]
            $(".chat-header img").attr("src","media/images/"+selectedUserInfo.pic);
            $(".chat-header span").html(selectedUserInfo.name);
        }
    }
    var customeLength = info.messages.length
    for(var i = 0; i < customeLength;i++) {
        if(id == info.messages[i].userId) {
            appendMessage(info.messages[i])
            break;
        }
    }
}
var appendMessage = function(data) {
    
    for(var i =0; i < data.details.length;i++) {
        if(data.details[i].type == "get") {
            for(var j = 0; j < data.details[i].content.length;j++){
                $(".chat-content").append(
                    "<div class='recived-message'>\
                    <p>"+data.details[i].content[j]+"\
                    </p>\
                </div>"
                )
            }
        }else {
            for(var j = 0; j < data.details[i].content.length;j++){
                $(".chat-content").append(
                    "<div class='send-message'>\
                    <p>"+data.details[i].content[j]+"\
                    </p>\
                </div>"
                )
            }
        }
    }
}
var reply  = function() {
    for(var i = 0; i < info.messages.length;i++){
        if(info.messages[i].userId == selectedUser) {
            var itemToAdd = {
                type:"get",
                content:["this is reply"]
            }
            info.messages[i].details.unshift(itemToAdd)
            showMessage(selectedUser)
            break;
        }
    }
}
var addingMessage = function(){
    var allowed = false;
    var index;
    if(selectedUserInfo.hasMessage) {
        allowed = true;
    }else {
        selectedUserInfo.hasMessage = true
    }
    selectedUserInfo.lastMessage = $("#text").val();
    $("#last-message-"+selectedUser).html($("#text").val())
    if(allowed) {
        for(var i = 0; i < info.messages.length;i++){
           index = i
            if(info.messages[i].userId == selectedUser) {
                var itemToAdd = {
                    type:"send",
                    content:[$("#text").val()]
                }
                info.messages[i].details.unshift(itemToAdd)
                showMessage(selectedUser)
                break;
            }
        }
    }else {
        var newMessage = {
            userId:selectedUser,
            details:[
                {
                    type:"send",
                    content:[$("#text").val()]
                }
            ]
        }
        info.messages.push(newMessage);
        index = info.messages.length - 1
        showMessage(selectedUser)
    }
    setTimeout(function(){
        var itemToAdd = {
            type:"get",
            content:["this is reply"]
        }
        info.messages[index].details.unshift(itemToAdd);
        if($("#user-list-"+info.messages[index].userId).hasClass("selected")){
            showMessage(selectedUser)
        }else {
            console.log("thi sdkfjh")
            $("#read-badge-"+info.messages[index].userId).html("1")
            $("#read-badge-"+info.messages[index].userId).removeClass("hidden");
        }
    },2000)
    // console.log($("#text").val())
}
var showInfo = function() {
    $(".modal img").attr("src","media/images/"+selectedUserInfo.pic);
    $(".modal span").html(selectedUserInfo.name);
    $("#phone").html(selectedUserInfo.phoneNo);
    $("#address").html(selectedUserInfo.address);
   $("#extra-info").modal(); 
}