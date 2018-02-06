/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function(){// we wait until the client has loaded and contacted us that it is ready to go.

  socket.emit('answer',"Hey, I'm Boo a simple chat bot. Let\'s explore your culinary impulses together!"); //We start with the introduction;
  setTimeout(timedQuestion, 5000, socket,"What is your Name?"); // Wait a moment and respond with a question.

});
  socket.on('message', (data)=>{ // If we get a new message from the client we process it;
        console.log(data);
        questionNum= bot(data,socket,questionNum);	// run the bot function with the new message
      });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});

var desert;
var name;

//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data,socket,questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

/// These are the main statments that make up the conversation.
  if (questionNum == 0) {
  answer= 'Heyyyy, ' + input + ' :-)';// output response
  name = input;
  waitTime =2000;
  question = name + ', let\'s get started... what\'s your favorite desert?';			    	// load next question
  }
  else if (questionNum == 4) {
  answer= 'Wow! Yum, it\'s been a while since I\'ve had ' + input +'.';
  desert = input
  waitTime =3000;
  question = 'I was also wondering... what\'s your favorite type of fruit?';			    	// load next question
  }
  else if (questionNum == 2) {
    if(input.toLowerCase()==='banana'|| input.toLowerCase()==='bananas'){
      answer = 'I LOVE BANANAS!';
    } else {
      answer = "Cool... Cool..."
    } 
  waitTime = 2000;
  question = name + ", serious question: How does a " + desert + ' with ' + input + ' on top sound?'
  }
  else if (questionNum == 3) {
    if(input.toLowerCase()==='good'|| input.toLowerCase()==='great' || input.toLowerCase()==='yum' || input.toLowerCase()==='wow' || input.toLowerCase()==='cool'){
      answer = 'Agreed! That sounds AMAZING!';
    } else {
      answer = "Ya... I don't know... it's not my favorite."
    } 
  waitTime = 2000;
  question = 'Coke or Pepsi?';            // load next question
  }
  else if (questionNum == 1) {
    if(input.toLowerCase()==='coke'|| input.toLowerCase()==='coca-cola'){
      answer = 'Yup! ' + input + ' is in fact the correct answer.';
      waitTime =2000;
      question = 'How do you feel about creme brulee?';
    } else{
      answer='CANNOT COMPUTE! CANNOT COMPUTE! \n I\'ll ask again, I think you may have slipped on your keyboard.'
      question = '';
      waitTime = 2000;
      questionNum--;
    }
  // load next question
  } 
  else{
    answer= 'We\'re done here! See you again soon.';// output response
    waitTime =0;
    question = '';
  }


/// We take the changed data and distribute it across the required objects.
  socket.emit('answer',answer);
  setTimeout(timedQuestion, waitTime,socket,question);
  return (questionNum+1);
}

function timedQuestion(socket,question) {
  if(question!=''){
  socket.emit('question',question);
}
  else{
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
