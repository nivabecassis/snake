# Projet Jeu SNAKE

## Notes

- Snake moves around based on user input (arrow keys)
- Singe Page Application (use Js to show/hide the next page)
- Home page 
- Game page
- Need a data structure for the state of the environment
  - 2D array for the board

- Snake info
  - where is the head of the snake
  - what direction is he going?
  - array holding the snake's coords
  - on every snake move: check if the new coords of the head === coords of any part of the snake
  - on every snake move: shift the coords of the snake by one

- Allow user to input directions of the snake's head using arrow keys

- Level selection:
  - Every level is stored in JSON format
  - Each level definition contains basic info like dimensions, delay, walls, fruit