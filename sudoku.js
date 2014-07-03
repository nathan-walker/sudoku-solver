/*
 * Nathan's Sudoku Solver
 * Copyright 2014 - Nathan Walker
 * Licensed under MIT License
 * Developed for the Gannon University Programming Contest
 * Capable of solving most Easy, Medium, and Hard puzzles from WebSudoku
*/ 

/*
 * EXTENSIONS TO THE JS ARRAY OBJECT
*/

// Adds a function to all array objects that adds all items passed 
// to the array that aren't already present
Array.prototype.addValues = function (values) {
	values.forEach(function (element, index, array) {
		if (element !== null && this.indexOf(element) === -1) {
			this.push(element);
		}
	}, this);
};

// Adds a function to all array objects that removes all items passed 
// from the array if the items are present
Array.prototype.removeValues = function (values) {
	values.forEach(function (element, index, array) {
		if (element !== null && this.indexOf(element) !== -1) {
			this.splice(this.indexOf(element), 1);
		}
	}, this);
};

/*
 * I/O FUNCTIONS FOR THE SUDOKU BOARDS
*/
 
// Accepts a board object and prints it to the JavaScript console
// Used in the initial debugging of the program before the GUI was finished
function logSudokuBoard(board) {
	var i;
	var n;
	var activeRow;
	var values;
	for (i = 0; i < 9; i += 1) {
		if (i === 3 || i === 6) {
			console.log("---------------------");
		}
		activeRow = board[i];
		values = [];
		n = 0;
		for (n = 0; n < 9; n += 1) {	
			if (n === 3 || n === 6) {
				values.push("|");
			}
			values.push((activeRow[n].getValue() || " "));
		}
		console.log(values.join(" "));	
	}
}

// Accepts a board object and outputs it to the HTML page
function printSudokuBoard(board) {
	var i;
	var n;
	var activeRow;
	var values;
	var tablecells;
	for (i = 0; i < 9; i += 1) {
		activeRow = board[i];
		n = 0;
		for (n = 0; n < 9; n += 1) {	
			$("#row"+i+" td.column"+n).text((activeRow[n].getValue() || ""));
		}	
	}
}

// Takes input from the page and inserts it into the myBoard variable
function loadSudokuBoard() {
	$("#valuesremoved").remove();
	myBoard = makeBoard();
	var removedValues = false;
	var rows = [0,1,2,3,4,5,6,7,8];
	var columns = [0,1,2,3,4,5,6,7,8];
	rows.forEach(function (row, rowindex, rowarray) {
		columns.forEach(function (column, columnindex, columnarray) {
			var square = $("#row"+row+" td.column"+column);
			var number = Number($(square).text());
			if (!isNaN(number) && number > 0 && number < 10) {
				myBoard[row][column].setValue(number);
			} else {
				removedValues = true;
				$(square).text("");
			}
		});
	});
	
	// Put a notice if any values were removed from the board
	if (removedValues === true) {
		$("#solveparagraph").after("<p id='valuesremoved'>If there were values that were not numbers 0-9, they were removed</p>");
	}
}

/*
 * MAKER FUNCTIONS FOR THE CLASSES USED
*/

// Creates a row object
// Arguments: row number followed by values for squares if you provide them
var makeRow = function(rn) {
	var that = {};
	
	var i;
	
	// Make the 9 square for the row	
	for (i = 0; i < 9; i += 1) {
		that[i] = makeSquare(rn, i, getBoxNumber(rn, i), (arguments[i+1] ? arguments[i+1].getValue() : null));
	}
	
	// Returns an array of all numbers present in the row
	that.getAllValues = function() {
		var results = [];
		
		for (i = 0; i < 9; i += 1) {
			results.addValues([that[i].getValue()]);
		}
		
		return results;
	};
	
	that.clone = function () {
		return makeRow(rn, that[0].clone(), that[1].clone(), that[2].clone(), that[3].clone(), that[4].clone(), that[5], that[6].clone(), that[7].clone(), that[8].clone());
	};
	
	// Return a row object
	return that;
	
};


// Gets the number of a box based on row/column coordinates
// referenced 0-8 going top to bottom and left to right
// The 9 boxes on the Sudoku board would be:
/*
 * 0 | 1 | 2
 *-----------
 * 3 | 4 | 5
 *-----------
 * 6 | 7 | 8
 *
*/

function getBoxNumber(r, c) {
	if (r >= 0 && r <= 2) {
		if (c >= 0 && c <= 2) {
			return 0;
		} else if (c >= 3 && c <= 5) {
			return 1;
		} else if (c >= 6 && c <= 8) {
			return 2;
		} else {
			throw {
				name: "LengthError",
				message: "A column should be between 0 and 8"
			}
		}
	} else if (r >= 3 && r <= 5) {
		if (c >= 0 && c <= 2) {
			return 3;
		} else if (c >= 3 && c <= 5) {
			return 4;
		} else if (c >= 6 && c <= 8) {
			return 5;
		} else {
			throw {
				name: "LengthError",
				message: "A column should be between 0 and 8"
			}
		}
	} else if (r >= 6 && r <= 8) {
		if (c >= 0 && c <= 2) {
			return 6;
		} else if (c >= 3 && c <= 5) {
			return 7;
		} else if (c >= 6 && c <= 8) {
			return 8;
		} else {
			throw {
				name: "LengthError",
				message: "A column should be between 0 and 8"
			}
		}
	} else {
		throw {
			name: "LengthError",
			message: "A row should be between 0 and 8"
		}
	}
}

// Creates a board object
// Can accept rows in order as arguments
var makeBoard = function() {
	var that = {};
	
	var i;
	for (i = 0; i < 9; i += 1) {
		that[i] = (arguments[i] || makeRow(i));
	}
	
	// Gets all numbers in a specific row
	that.getRowValues = function (row) {
		return that[row].getAllValues();
	};
	
	// Gets all numbers in a specific column
	that.getColumnValues = function (column) {
		var results = [];
		for (i = 0; i < 9; i += 1) {
			results.addValues([ that[i][column].getValue() ]);
		}
		
		return results;
	};
	
	// Returns the rows that are included in a certain box
	that.getBoxRows = function (box) {
		var rows = [];
		if (box >= 0 && box < 3) {
			rows = [0,1,2];
		} else if (box >= 3 && box < 6) {
			rows = [3,4,5];
		} else if (box >= 6 && box <= 8) {
			rows = [6,7,8];
		} else {
			throw {
				name: "UnknownError",
				message: "An unknown error occured when finding box values"
			}
		}
		
		return rows;
	}
	
	// Returns the columns that are included in a certain box
	that.getBoxColumns = function (box) {
		var columns = [];
		if (box % 3 === 0) {
			columns = [0,1,2];
		} else if (box % 3 === 1) {
			columns = [3,4,5];
		} else if (box % 3 === 2) {
			columns = [6,7,8];
		} else {
			throw {
				name: "UnknownError",
				message: "An unknown error occured when finding box values"
			}
		}
		
		return columns;
	}
	
	// Returns all of the numbers in a specific box
	that.getBoxValues = function(box) {
		var results = [];
		var columns = that.getBoxColumns(box);
		var rows = that.getBoxRows(box);
		
		
		rows.forEach(function (row, rowindex, rowarray) {
			columns.forEach(function (column, columnindex, columnarray) {
				results.addValues([that[row][column].getValue()]);
			});
		});
		
		return results;
	};
	
	that.clone = function () {
		return makeBoard(that[0].clone(), that[1].clone(), that[2].clone(), that[3].clone(), that[4].clone(), that[5], that[6].clone(), that[7].clone(), that[8].clone());
	};
	
	// Get the number of boxes that are filled
	that.getFilledCount = function() {
		var rows = [0,1,2,3,4,5,6,7,8];
		var columns = [0,1,2,3,4,5,6,7,8];
		var filledCount = 0;
		rows.forEach(function (row, rowindex, rowarray) {
			columns.forEach(function (column, columnindex, columnarray) {
				if (that[row][column].getValue()) {
					filledCount += 1;
				}
			});
		});
		return filledCount;
	};
	
	return that;
};

// Creates a square object
// Takes 4 arguments: row number, column number, box number, and a value
// If the square is not filled, please set value to null
var makeSquare = function(row, column, box, value) {
	var that = {};
	
	var possibleValues = undefined;
	
	that.getRow = function() {
		return row;
	};

	that.getColumn = function() {
		return column;
	};

	that.getBox = function() {
		return box;
	};

	that.getValue = function() {
		return value;
	};

	that.setValue = function(v) {
		value = v;
	};
	
	that.getPossibleValues = function() {
		if(value !== null) {
			throw {
				name: "AlreadySetError",
				message: "This box is already set."
			}
		} else {
			return possibleValues;
		}
	};
	
	that.findPossibleValues = function(board) {
		if(value !== null) {
			throw {
				name: "AlreadySetError",
				message: "This box is already set."
			}
		} else {
			possibleValues = [1,2,3,4,5,6,7,8,9];
			possibleValues.removeValues(board.getRowValues(row));
			possibleValues.removeValues(board.getColumnValues(column));
			possibleValues.removeValues(board.getBoxValues(box));
			if (possibleValues.length === 0) {
				throw {
					name: "ImpossibleBoardError",
					message: "Something is wrong, this board is impossible",
					trace: (function () {var err = new Error();return err.stack;})()
				}
			}
			return possibleValues;
		}
	};
	
	that.clone = function () {
		return makeSquare(row, column, box, value);
	};

	return that;
};

/* 
 * SOLVER FUNCTIONS
*/

// The most important function.
// Attempts to solve a Sudoku board object
var solveSudokuBoard = function(board) {
	var rows = [0,1,2,3,4,5,6,7,8];
	var columns = [0,1,2,3,4,5,6,7,8];
	var boxes = [0,1,2,3,4,5,6,7,8];
	var filledCount = board.getFilledCount();
	
	console.log(filledCount+" squares filled to begin");
	
	// Makes sure the Sudoku board is possible.
	function checkSudokuBoard() {
		rows.forEach(function (row, rowindex, rowarray) {
			var values = [];
			columns.forEach(function (column, columnindex, columnarray) {
				
				var currentValue = board[row][column].getValue();
								
				if (currentValue) {
					// Check if a value is already included in the row
					if (values.indexOf(currentValue) !== -1) {
						throw {
							name: "ImpossibleBoardError"
						}
					} else {
						values.push(currentValue);
					}
				} 
			});
		});
		
		columns.forEach(function (column, columnindex, columnarray) {
			var values = [];
			columns.forEach(function (row, rowindex, rowarray) {
				
				var currentValue = board[row][column].getValue();
								
				if (currentValue) {
					// Check if a value is already included in the column
					if (values.indexOf(currentValue) !== -1) {
						throw {
							name: "ImpossibleBoardError"
						}
					} else {
						values.push(currentValue);
					}
				} 
			});
		});
		
		var boxes = [0,1,2,3,4,5,6,7,8];
		
		boxes.forEach(function (box, boxindex, boxarray) {
			var columns = board.getBoxColumns(box);
			var rows = board.getBoxRows(box);
			var values = [];
			rows.forEach(function (row, rowindex, rowarray) {
				columns.forEach(function (column, columnindex, columnarray) {
					
					var currentValue = board[row][column].getValue();
					// Check if a value is already included in the box				
					if (currentValue) {
						if (values.indexOf(currentValue) !== -1) {
							throw {
								name: "ImpossibleBoardError"
							}
						} else {
							values.push(currentValue);
						}
					} 
				});
			});
		});

	}
	
	// Fills in any squares that have only one possible value
	function fillPossibleSquares() {
		rows.forEach(function (row, rowindex, rowarray) {
			columns.forEach(function (column, columnindex, columnarray) {
				try 
					{ var possibleValues = board[row][column].findPossibleValues(board); } 
				catch(e) 
					{ var possibleValues = undefined; }
				
				if (possibleValues && possibleValues.length === 1) {
					board[row][column].setValue(possibleValues[0]);
					filledCount += 1;
				}
			});
		});
	}
	
	// Checks if number can only go in one possible spot in a row
	function fillByRow(number) {
		
		rows.forEach(function (row, rowindex, rowarray) {
			var potentials = [];
			columns.forEach(function (column, columnindex, columnarray) {
				try 
					{ var possibleValues = board[row][column].findPossibleValues(board); } 
				catch(e) 
					{ var possibleValues = undefined; }
				
				if (possibleValues && possibleValues.indexOf(number) !== -1) {
					potentials.push([row, column]);
				}
			});
			if (potentials.length === 1) {
				board[potentials[0][0]][potentials[0][1]].setValue(number);
				filledCount += 1;
			}
		});

	}
	
	// Checks if number can only go in one possible spot in a column
	function fillByColumn(number) {
		columns.forEach(function (column, columnindex, columnarray) {
			var potentials = [];
			rows.forEach(function (row, rowindex, rowarray) {
				try 
					{ var possibleValues = board[row][column].findPossibleValues(board); } 
				catch(e) 
					{ var possibleValues = undefined; }
				
				if (possibleValues && possibleValues.indexOf(number) !== -1) {
					potentials.push([row, column]);
				}
			});
			if (potentials.length === 1) {
				board[potentials[0][0]][potentials[0][1]].setValue(number);
				filledCount += 1;
			}
		});
		
	}
	
	// Checks if number can only go in one possible spot in a box
	function fillByBox(number) {
		
		var boxes = [0,1,2,3,4,5,6,7,8];
		
		boxes.forEach(function (box, boxindex, boxarray) {
			var columns = board.getBoxColumns(box);
			var rows = board.getBoxRows(box);
			var potentials = [];
			rows.forEach(function (row, rowindex, rowarray) {
				columns.forEach(function (column, columnindex, columnarray) {
					try 
						{ var possibleValues = board[row][column].findPossibleValues(board); } 
					catch(e) 
						{ var possibleValues = undefined; }
					
					if (possibleValues && possibleValues.indexOf(number) !== -1) {
						potentials.push([row, column]);
					}
				});
				
			});
			if (potentials.length === 1) {
				board[potentials[0][0]][potentials[0][1]].setValue(number);
				filledCount += 1;
			}
		});
		
	}
	
	// The last value of filledCount.  Included to prevent infinite loops.	
	var lastValue = 0;
	
	// Number of solve attempts
	var iterations = 0;
	
	while (lastValue !== filledCount && filledCount < 81) {
		lastValue = filledCount;
		try {
			checkSudokuBoard();
			fillPossibleSquares();
			var i;
			for (i = 1; i < 10; i += 1) {
				fillByRow(i);
				fillByColumn(i);
				fillByBox(i);
				//logSudokuBoard(myBoard);
				console.log(filledCount+" squares filled");
			}
			iterations += 1;
		}
		catch (e) {
			if (e.name === "ImpossibleBoardError") {
				alert("This board is not possible.  Make sure that no numbers are repeated in boxes, rows, or columns.");
				lastValue = filledCount;
			} else {
				throw e;
			}
		}
	}
	console.log(iterations+" iterations run");
	
		
	if (filledCount === 81) {
		return true;
	} else {
		return false;
	}

}

/* 
 * MAIN FUNCTIONS OF THE SCRIPT
*/

// Creates the main board object
var myBoard = makeBoard();


// Loads a pre-set, hard-coded puzzle from WebSudoku.com 
function loadHardPuzzle() {
	myBoard[0][8].setValue(7);
	myBoard[1][0].setValue(1);
	myBoard[1][3].setValue(8);
	myBoard[1][6].setValue(5);
	myBoard[2][1].setValue(2);
	myBoard[2][2].setValue(5);
	myBoard[2][3].setValue(4);
	myBoard[2][8].setValue(1);
	myBoard[3][2].setValue(7);
	myBoard[3][3].setValue(3);
	myBoard[3][5].setValue(8);
	myBoard[4][0].setValue(5);
	myBoard[4][2].setValue(3);
	myBoard[4][3].setValue(7);
	myBoard[4][5].setValue(1);
	myBoard[4][6].setValue(2);
	myBoard[4][8].setValue(9);
	myBoard[5][3].setValue(5);
	myBoard[5][5].setValue(6);
	myBoard[5][6].setValue(7);
	myBoard[6][0].setValue(2);
	myBoard[6][5].setValue(4);
	myBoard[6][6].setValue(9);
	myBoard[6][7].setValue(5);
	myBoard[7][2].setValue(8);
	myBoard[7][5].setValue(9);
	myBoard[7][8].setValue(4);
	myBoard[8][0].setValue(3);
}

// Loads a pre-set, hard-coded puzzle from WebSudoku.com 
function loadMediumPuzzle() {
	myBoard[0][1].setValue(5);
	myBoard[0][2].setValue(7);
	myBoard[0][6].setValue(4);
	myBoard[0][8].setValue(2);
	myBoard[1][0].setValue(9);
	myBoard[1][3].setValue(3);
	myBoard[1][6].setValue(1);
	myBoard[2][1].setValue(6);
	myBoard[2][2].setValue(8);
	myBoard[2][6].setValue(5);
	myBoard[2][7].setValue(9);
	myBoard[3][1].setValue(1);
	myBoard[3][4].setValue(8);
	myBoard[3][5].setValue(2);
	myBoard[4][0].setValue(6);
	myBoard[4][8].setValue(9);
	myBoard[5][3].setValue(1);
	myBoard[5][4].setValue(5);
	myBoard[5][7].setValue(7);
	myBoard[6][1].setValue(7);
	myBoard[6][2].setValue(3);
	myBoard[6][6].setValue(6);
	myBoard[6][7].setValue(5);
	myBoard[7][2].setValue(6);
	myBoard[7][5].setValue(4);
	myBoard[7][8].setValue(1);
	myBoard[8][0].setValue(8);
	myBoard[8][2].setValue(1);
	myBoard[8][6].setValue(9);
	myBoard[8][7].setValue(2);
}


// Loads a pre-set, hard-coded puzzle from WebSudoku.com 
function loadEasyPuzzle() {
	myBoard[0][0].setValue(3);
	myBoard[0][1].setValue(7);
	myBoard[0][2].setValue(6);
	myBoard[0][6].setValue(2);
	myBoard[0][8].setValue(4);
	myBoard[1][1].setValue(2);
	myBoard[1][3].setValue(6);
	myBoard[1][4].setValue(3);
	myBoard[1][5].setValue(7);
	myBoard[1][6].setValue(5);
	myBoard[2][0].setValue(9);
	myBoard[2][3].setValue(2);
	myBoard[2][4].setValue(8);
	myBoard[2][6].setValue(7);
	myBoard[2][7].setValue(6);
	myBoard[3][1].setValue(1);
	myBoard[3][3].setValue(8);
	myBoard[3][4].setValue(6);
	myBoard[3][5].setValue(3);
	myBoard[3][7].setValue(9);
	myBoard[4][0].setValue(2);
	myBoard[4][1].setValue(4);
	myBoard[4][5].setValue(5);
	myBoard[4][7].setValue(3);
	myBoard[4][8].setValue(6);
	myBoard[5][1].setValue(8);
	myBoard[5][2].setValue(3);
	myBoard[5][5].setValue(9);
	myBoard[5][6].setValue(1);
	myBoard[5][8].setValue(7);
	myBoard[6][0].setValue(4);
	myBoard[6][2].setValue(8);
	myBoard[6][3].setValue(5);
	myBoard[6][4].setValue(9);
	myBoard[6][6].setValue(6);
	myBoard[7][0].setValue(1);
	myBoard[7][2].setValue(7);
	myBoard[7][3].setValue(3);
	myBoard[7][7].setValue(2);
	myBoard[7][8].setValue(5);
	myBoard[8][2].setValue(2);
	myBoard[8][4].setValue(1);
	myBoard[8][5].setValue(6);
	myBoard[8][7].setValue(4);
	myBoard[8][8].setValue(8);
}

// The rest of the script binds actions to the buttons on the page
// Requires basic jQuery
$("#solve").click(function() {
	loadSudokuBoard(myBoard);
	solveSudokuBoard(myBoard);
	printSudokuBoard(myBoard);
	
});
$("#easypuzzle").click(function() {
	myBoard = makeBoard();
	loadEasyPuzzle();
	printSudokuBoard(myBoard);
});
$("#mediumpuzzle").click(function() {
	myBoard = makeBoard();
	loadMediumPuzzle();
	printSudokuBoard(myBoard);
});
$("#hardpuzzle").click(function() {
	myBoard = makeBoard();
	loadHardPuzzle();
	printSudokuBoard(myBoard);
});
$("#clearboard").click(function() {
	myBoard = makeBoard();
	printSudokuBoard(myBoard);
});