// $(document).ready(function() {
//   var text = $('.user_legit_name').text();

// var length = text.length;
// var timeOut;
// var character = 0;

// function typeWriter() {
//     timeOut = setTimeout(function() {
//         character++;
//         var type = text.substring(0, character);
//         $('.user_legit_name').text(type);
//         typeWriter();

//         if (character == length) {
//             clearTimeout(timeOut);
//         }

//     }, 100);

// };