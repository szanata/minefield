define(['model'], function (model){

  var
    fxElAmount = 10,
    currentFxClickEl = 0,
    volume = 30,
    playMethodName = '',
    audioSupport = true;

  function createDeprecatedAudioElements(){
    
    $('body').append('<div style="display:none;" id="box_FX"></div>');
    
    //create click effects
    for (var i = 0; i < fxElAmount; i++){
      $('#box_FX').append('<embed src="fx/click.wav" data-fx="click" data-serial="' + i + '"/>');
    }
    
    //create explosion FX
    $('#box_FX').append('<embed src="fx/explosion.wav" id="explosion"/>');
    
    //common audio properties
    $('#box_FX > embed').attr({
      autostart: false,
      enablejavascript: true,
      volume: 50,
      width: 0,
      height: 0
    });
  };
    
  function createHtml5AudioElements(){
  
    var audioWrapper = $('<div></div>')

    // create click audios
    for (var i = 0; i < fxElAmount; i++){  
      var audio = new Audio();
      audio.src = 'fx/square_click.wav';
      audio.volume = .5;
      audio.setAttribute('data-fx','click');
      audio.setAttribute('data-serial', i );
      audioWrapper.append(audio);
    }
    //create explosion audio
    var audio = new Audio();
    audio.src = 'fx/explosion.wav';
    audio.volume = .5;
    audio.setAttribute('data-fx','explosion');
    audioWrapper.append(audio);

    playMethodName = 'play'
    $('body').append(audioWrapper);
  };

  return {
    
    init:function (){
    
      //deteck html5 wav reprodution support
      var html5Audio = document.createElement('audio')
      if (html5Audio !== undefined && typeof html5Audio.canPlayType === 'function' && html5Audio.canPlayType('audio/wav')){
        createHtml5AudioElements();

      //trash quicktime or realmedia plugins
      } else {
        //first, the system must have audio support
        if (typeof document.createElement('embed').Play === 'function'){
          playMethodName = 'Play';
          createDeprecatedAudioElements();
        } else if (typeof document.createElement('embed').DoPlay === 'function'){
          playMethodName = 'DoPlay';
          createDeprecatedAudioElements();
        } else {
          audioSupport = false;
        }
      }
    },
        
    play: function (type){
      if (audioSupport){
        if (type === model.SoundType.CLICK){
          try{
            $('[data-fx="click"][data-serial="' + currentFxClickEl + '"]').get(0)[playMethodName]();
            currentFxClickEl++;
            if (currentFxClickEl > fxElAmount -1){
              currentFxClickEl = 0;
            }
          }catch (e){}
        } else if (type === model.SoundType.EXPLOSION){
          try{
            $('[data-fx="explosion"]').get(0)[playMethodName]();
          }catch (e){}
        }
      }
    },
  }
});