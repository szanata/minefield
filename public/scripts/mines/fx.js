define(['model'], function (model){

  function createAudioElement(file){
    var audio = new Audio();
    audio.src = file;
    audio.volume = .5;
    return audio;
  }

  return {
    play: function (type){
      if (type === model.SoundType.CLICK){
        createAudioElement('fx/square_click.wav').play();
      } else {
        createAudioElement('fx/explosion.wav').play();  
      }
    },
  }
});