minefield
=========

Simple js minefield game

Play at: http://minefield.szanata.com


Changelog
----------

v 1 **initial**:
  - 3 difficulty levels to choose from;
  - auto fit field on window size;
  - pause button;
  - restart button;
  - reversive mines left counter;
  - chronometer;
  - win/lose detection with:
    - total time;
    - squared revelead;
    - mines left;
    - clics count;
  - final design, with colors, background, textures, images and fonts. Theme: milita.

v 1.1:
  - added: new game button on top menu;
  - added: view board functionality. When game is over, player can view the board over the end game popup to see game details;
  - added: when user loses, the mines are not revealed, this whay the "restart" funcionality is usefull;
  - fixed: when the window is resize vertically, sometimes the field break and the squares loses their order;
  - fixed: when user restart the game from a lose, and soon loses again, the explosion sound was not being played;
  - added: new FX library, only with HTML5 audio support;
  - added: better space use: the field is now using the max usable height.
