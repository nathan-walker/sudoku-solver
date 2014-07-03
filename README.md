# sudoku-solver
A program that solves most Sudoku puzzles.  Tested with Easy, Medium, and Hard puzzles from WebSudoku.  Developed for the Gannon University programming contest.

Copyright 2014 - Nathan Walker

Licensed under an MIT License (see LICENSE).

## Installation
This program is developed as a JavaScript web application, so it doesn't need to be compiled or installed.  In fact, most computers already have all of the necessary software installed to run this application.  All that you should need is a modern web browser on Windows, Mac OS X, or Linux.

The latest versions of these browsers should all work fine:

* Google Chrome
* Mozilla Firefox
* Internet Explorer

### Loading the application

There are two possible methods for loading the application:  accessing it locally or using a hosted version.  The hosted version is probably the easier and recommended version.

####Local Access
Clone the repository on GitHub or download the master.

Open the "sudoku-solver" folder and double-click on the "sudoku.html" file to open it.  The program should launch in your web browser.

If you get some warning about allowing scripts, make sure that you allow them.  These scripts power the application.

####Using Google Drive
The Sudoku Solver can also be accessed hosted on the Internet like any other web site.  You can access this at: [http://code.nwalker.org/sudoku-solver](http://code.nwalker.org/sudoku-solver)

## Using the Application
This application is fairly straightforward to use.  If you click one of the three Insert Puzzle buttons at the top, you can insert included sample puzzles into the Sudoku board.  If you ever wish to clear the board, this button is also in the top navigation bar.

In the 81 boxes, you can also enter any numbers that you want from your own Sudoku puzzle.  You can get puzzles from online Sudoku sources like [WebSudoku](http://www.websudoku.com) if you'd like.

After the puzzle is inputted into the boxes, click the big "Solve This Puzzle" to solve the Sudoku puzzle.

## Libraries used
[jQuery](http://jquery.com) is the only external library used in this application outside of the stock JavaScript/HTML/CSS functions.  

## The Method Developed for Solving Puzzles

In order to solve Sudoku puzzles, I developed the following method based somewhat off of the way that I solve Sudoku puzzles personally.  The application uses these steps:

1. Find any squares that only have one possible value.  Insert this value.
2. Look at each row individually and see if there are any numbers that can only go in one place for that row.  For example, some rows only have one place where the required "1" can go.  Fill in those numbers.
3. Do the same thing as Step 2 with each column and 3x3 box.
4. Repeat until the puzzle is completely solved.

The program will automatically stop itself if it stops making progress so that an infinite loop does not occur.


