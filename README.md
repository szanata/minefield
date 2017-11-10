# minefield

Simple js minefield game.

Play at: http://minefield.szanata.com


## Changelog

### v1.0.0 **initial**:
  - 3 difficulty levels to choose from
  - Auto fit field to window size
  - Pause feature
  - Restart feature
  - Mines left counter
  - Chronometer
  - Win/lose show game statistics like:
    - Total time
    - Squares opened
    - Mines left
    - Clicks count
  - Final design, with colors, background, textures, images and fonts. Theme: militia.

### v1.1.0:
  - Added: New game button on top menu
  - Added: View board feature.
    - When game is over, players can view the board over the end game popup
  - Added: When user loses, the mines are not revealed, this way the "restart" feature is useful
  - Added: New FX library, only with HTML5 audio support
  - Added: Better space use: the field is now using the max usable height.
  - Fixed: When the window is resized vertically, sometimes the field was breaking and the squares were losing their order
  - Fixed: When user restart the game from a lose, and soon loses again, the explosion sound was not being played

### v1.2.0:
  - Various internals improvements
