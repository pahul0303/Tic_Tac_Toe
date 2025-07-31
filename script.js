document.addEventListener('DOMContentLoaded', () => {
    // Game state variables
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    let gameMode = 'two-player'; // 'two-player' or 'ai'
    
    // DOM elements
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status');
    const resetButton = document.getElementById('reset-btn');
    const twoPlayerButton = document.getElementById('two-player-btn');
    const aiPlayerButton = document.getElementById('ai-player-btn');
    const themeToggle = document.getElementById('theme-toggle');
    
    // Winning conditions (indices of winning combinations)
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    // Initialize the game
    function initializeGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        
        // Clear the board UI
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'win');
        });
        
        updateStatus(`${currentPlayer}'s turn`);
    }
    
    // Update game status display
    function updateStatus(message) {
        statusDisplay.textContent = message;
    }
    
    // Handle cell click
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        // If cell is already filled or game is not active, ignore the click
        if (board[clickedCellIndex] !== '' || !gameActive) {
            return;
        }
        
        // Process the move
        processMove(clickedCellIndex);
        
        // If in AI mode and game is still active, let AI make a move
        if (gameMode === 'ai' && gameActive && currentPlayer === 'O') {
            setTimeout(makeAIMove, 500);
        }
    }
    
    // Process a player move
    function processMove(cellIndex) {
        // Update the board
        board[cellIndex] = currentPlayer;
        
        // Update the UI
        cells[cellIndex].textContent = currentPlayer;
        cells[cellIndex].classList.add(currentPlayer.toLowerCase());
        
        // Check for win or draw
        const roundWon = checkWin();
        const roundDraw = checkDraw();
        
        if (roundWon) {
            handleWin(roundWon);
        } else if (roundDraw) {
            handleDraw();
        } else {
            // Switch player
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateStatus(`${currentPlayer}'s turn`);
        }
    }
    
    // Check if current player has won
    function checkWin() {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
                return winningConditions[i]; // Return the winning combination
            }
        }
        return null;
    }
    
    // Check if the game is a draw
    function checkDraw() {
        return !board.includes('');
    }
    
    // Handle win
    function handleWin(winningCombination) {
        gameActive = false;
        
        // Highlight winning cells
        winningCombination.forEach(index => {
            cells[index].classList.add('win');
        });
        
        updateStatus(`${currentPlayer} wins!`);
    }
    
    // Handle draw
    function handleDraw() {
        gameActive = false;
        updateStatus("Game ended in a draw!");
    }
    
    // AI move (simple random move for now)
    function makeAIMove() {
        if (!gameActive) return;
        
        // Simple AI: find all empty cells and pick one randomly
        const emptyCells = board.map((cell, index) => cell === '' ? index : null)
                               .filter(val => val !== null);
        
        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const aiChoice = emptyCells[randomIndex];
            processMove(aiChoice);
        }
    }
    
    // Event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    resetButton.addEventListener('click', initializeGame);
    
    twoPlayerButton.addEventListener('click', () => {
        gameMode = 'two-player';
        twoPlayerButton.classList.add('active');
        aiPlayerButton.classList.remove('active');
        initializeGame();
    });
    
    aiPlayerButton.addEventListener('click', () => {
        gameMode = 'ai';
        aiPlayerButton.classList.add('active');
        twoPlayerButton.classList.remove('active');
        initializeGame();
    });
    
    themeToggle.addEventListener('click', () => {
        document.body.setAttribute('data-theme', 
            document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
        
        // Update icon
        const icon = themeToggle.querySelector('i');
        if (document.body.getAttribute('data-theme') === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
    
    // Initialize the game when page loads
    initializeGame();
});