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

## To-Do

[x] Add check when generating fruit that it is not placed on a wall  
[x] Implement wall hit check  
[x] Add game end functionality properly  
[x] Fix game end functionality bugs  

## GitLab

[GitLab projet url](https://forge.univ-lyon1.fr/p1603891/projet-jeu-snake)

Background image attribution:
<a href="https://www.vecteezy.com">Free Vector Design by: vecteezy.com</a>