// make connection
var socket = io.connect("http://localhost:4000");


// message from client to server
var $username = $("#username");
var $messageForm = $("#messageForm");
var $handle = $("#handle");
var $message = $("#message");
var $button = $("#send");
var $output = $("#output");
var $feedback = $("#feedback");
var $chatWindow = $("#chat-window");
var $userArea = $("#user-area");
var $chatArea = $("#chat-area");
var $userForm = $("#userForm");
var $users = $("#users");

// when 'send' is clicked emit message
$messageForm.submit(function(e){
    e.preventDefault();
    socket.emit("new message", {
        message: $message.val(),
        handle: $handle.val()
    });
    $message.val("");

    $chatWindow.animate({
        scrollTop: $chatWindow.get(0).scrollHeight
    }, 1000);
});

$userForm.submit(function(e){
    e.preventDefault();
    socket.emit("new user", $username.val(), function(data){
        if (data){
            $userArea.hide();
            $chatArea.css("display", "flex");
        }
    });
    $username.val("");
});

$message.keypress(function(){
    socket.emit("typing", {
        message: $message.val(),
        handle: $handle.val()
    });
});

socket.on('new message', function(data){
    $feedback.html("");
    
    // get time;
    var now = new Date();
    var time = "("+now.getHours()+":"+("0"+now.getMinutes()).slice(-2)+")";

    $output.append("<p><em>"+ time +"</em><strong> "+ data.user +"</strong>: " + data.msg.message +"</div>");
});

socket.on('typing', function(data){
    $feedback.html("<p><em>"+data.user+" is typing a message...</em></p>");
});

socket.on('get users', function(data){
    var html = '';
    for (i = 0; i < data.length; i++){
        html += "<li class='list-group-item'>"+ data[i] +"</li>";
    }
    $users.html(html);
}); 