define(['model'], function (model){

  var volume = .5;

  function createAudioElement(file) {
    var audio = new Audio();
    audio.src = file;
    audio.volume = volume;
    return audio;
  }

  return {
    play: function (type){
      if (type === model.SoundType.CLICK){
        createAudioElement( __resources.audio.click ).play();
      } else {
        createAudioElement( __resources.audio.explosion ).play();
      }
    },

    mute: function (){
      volume = 0;
    },

    unmute: function (){
      volume = .5;
    }
  }
});
