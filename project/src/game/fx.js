import clickFile from '../fx/click.wav';
import explosionFile from '../fx/explosion.wav';

const createFX = () => {
  let volume = .5;

  const createAudioElement = file => {
    const audio = new Audio();
    audio.src = file;
    audio.volume = volume;
    return audio;
  };

  const audioClick = createAudioElement( clickFile );
  const audioExplosion = createAudioElement( explosionFile );

  const setupVolume = () => {
    audioClick.volume = volume;
    audioExplosion.volume = volume;
  };

  return {
    playClick() {
      audioClick.play();
    },

    playExplosion() {
      audioExplosion.play();
    },

    mute() {
      volume = 0;
      setupVolume();
    },

    unmute() {
      volume = .5;
      setupVolume();
    }
  };
};

export default createFX();
