//START OF JAVASCRIPT CODE//

//Alert Player to click new game to start playing at Game Status
const endgametext = document.querySelector('.endgametext');
const newgametext = () => 'Press New Game';
endgametext.innerHTML = newgametext()

//For enabling & disabling cell elements
let activecell=false;

//Calling elements from HTML and assigning variables
    const cellElements = document.querySelectorAll('.cell');
    const NewGameBtn = document.getElementById('NewGameBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const ExitGameBtn = document.getElementById('ExitGameBtn');

//Player variable declaration and winning combinations
    const playerX = 'X';
    const playerO = 'O';
    const WinCombos = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];

//Array list for storing X and O values in the board
    let gameboard = ['','','','','','','','','']

//Clickable buttons for the whole game
    cellElements.forEach(cell => cell.addEventListener('click',clickedcell));
    NewGameBtn.addEventListener('click',NewGame);
    ExitGameBtn.addEventListener('click',ExitGame);
    prevBtn.addEventListener('click',prevMove);
    nextBtn.addEventListener('click',nextMove);

//Store and retrieve cellindex with X or O value in local storage
    let moves=[];
    function addlocalstorage (moves){
        localStorage.setItem('moves',JSON.stringify(moves));
        getfromlocalstorage(moves);
    }

    function getfromlocalstorage(moves){
        const reference = localStorage.getItem('moves');
        if (reference){
        moves=JSON.parse(reference);
        }
    }

//Clear local storage when refreshed
    window.onunload= function () {
        localStorage.removeItem('moves');
    }

//Determining which index was clicked and should be disabled when clicked
    function clickedcell(cellevent){
        const celltarget=cellevent.target;
        const cellindex=parseInt(celltarget.getAttribute('data-cell-index'));
        if (gameboard[cellindex] !== "" || !activecell) {
        return;
    }
        gameplay(celltarget,cellindex);
        validategameresult(cellindex);
    }

//Display X or O moves in game board and in console
    let currentplayer = playerX;
    function gameplay(celltarget,cellindex){
        gameboard[cellindex] = currentplayer;
        celltarget.innerHTML = currentplayer;
        const gamemove = {
        index: cellindex,
        add: gameboard[cellindex]
    };
    displaymovelist(cellindex)
    previndexhistory.push(gamemove.index);
    prevvaluehistory.push(gamemove.add);
    moves.push(gamemove);
    console.log(gameboard);
    addlocalstorage(moves,cellindex);
    }

//Displaying move history of players
    const ul = document.getElementById('ul');
    function displaymovelist(cellindex){
    const list= document.createElement('li');
    list.id='movehistory';
        let x = cellindex;
        if(x<3){
            row=1;
            column = x + 1;
        } else if (x>=3 && x<6) {
            row=2;
            column = x - 2;
        } else if (x>=6 && x<9){
            row=3;
            column = x - 5;
        }
        list.innerHTML=`${ul.children.length+1}- Player: ${gameboard[cellindex]} Row: ${row} Column: ${column}`;
        ul.appendChild(list);
    }

//Setting first player as X and evaluating if there's already a winner
    const wintext = () => `PLAYER ${currentplayer} WINS`;
    const drawtext = () => 'DRAW';
    function validategameresult(){
        let win=false;
        for(i=0;i<gameboard.length-1;i++){
            let a=gameboard[WinCombos[i][0]];
            let b=gameboard[WinCombos[i][1]];
            let c=gameboard[WinCombos[i][2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            win = true;
            break
        }
        }
        if (win){
            endgametext.innerHTML=wintext();
            activecell=false;
            prevBtn.disabled=false;
            updatescoreboard();
            return;
        }
        let draw = !gameboard.includes("");
        if (draw){
            endgametext.innerHTML=drawtext();
            activecell=false;
            prevBtn.disabled=false;
            return;
        }
        changeplayer();
        }

//Updates whose player's turn is currently on game
function changeplayer(){
    currentplayer = currentplayer === playerX ? playerO : playerX;
    endgametext.innerHTML = `Now Playing: Player ${currentplayer}`;
}

//Updating Scoreboard of players every end of game
const Xscore=document.getElementById('Xscore');
const Oscore=document.getElementById('Oscore');
Xscore.disabled=true;
Oscore.disabled=true;
let addXscore=0;
let addOscore=0;
function updatescoreboard(){
    if (currentplayer===playerX){
        addXscore++;
        Xscore.value=addXscore;
    } else if (currentplayer===playerO){
        addOscore++;
        Oscore.value=addOscore;
    }
    }

//Initialize previous and next button before a game
prevBtn.disabled=true;
nextBtn.disabled=true;

//Insert move history when going through all the moves after a game
let movelist=[];
//Stores move history in array and removes last move when prev button is clicked
    let previndexhistory=[];
    let prevvaluehistory=[];
    function prevMove(){
        movelist.push(ul.lastElementChild.innerHTML);
        console.log(movelist);
        ul.lastElementChild.remove();
        nextBtn.disabled=false;
        let lastmove = previndexhistory[previndexhistory.length-1];
        let lastvalue = prevvaluehistory[prevvaluehistory.length-1];
        const prevgamemove = {
            index: lastmove,
            remove: lastvalue
        }
        moves.push(prevgamemove);
        nextvaluehistory.push(lastvalue);
        nextindexhistory.push(lastmove);
        gameboard[lastmove]='';
        previndexhistory.pop();
        prevvaluehistory.pop();
        addlocalstorage(moves);
        getfromlocalstorage(moves);
        if (previndexhistory.length<1){
            prevBtn.disabled=true;
        } else if (previndexhistory.length>=1) {
            prevBtn.disabled=false;
        }
        cellElements[lastmove].innerHTML=gameboard[lastmove];
    }

//Stores move history and re-adds the most recent move from undo array when next button is clicked
    let nextindexhistory=[];
    let nextvaluehistory=[];
    function nextMove(){
        list=document.createElement('li');
        list.innerHTML=movelist[movelist.length-1];
        ul.appendChild(list);
        movelist.pop();
        let lastmove = nextindexhistory[nextindexhistory.length-1];
        let lastvalue = nextvaluehistory[nextvaluehistory.length-1];
        const nextgamemove = {
            index: lastmove,
            readd: lastvalue
        }
        moves.push(nextgamemove);
        prevvaluehistory.push(lastvalue);
        previndexhistory.push(lastmove);
        gameboard[lastmove]=lastvalue;
        nextindexhistory.pop();
        nextvaluehistory.pop();
        addlocalstorage(moves);
        getfromlocalstorage(moves);
        if (nextindexhistory.length<1){
            nextBtn.disabled=true;
        } else if (nextindexhistory.length>=1){
            nextBtn.disabled=false;
            prevBtn.disabled=false;
        }
        cellElements[lastmove].innerHTML=lastvalue;
        console.log(gameboard);
}
    
//Clearing game and score board, enabling clickable cells and clearing move history
    function NewGame(){
        Xscore.disabled=true;
        Oscore.disabled=true;
        prevBtn.disabled=true;
        nextBtn.disabled=true;
        cellElements.forEach(cell=>cell.classList.remove('disabled'));
        ul.innerHTML='';
        endgametext.innerHTML = `Now Playing: Player ${playerX}`;
        gameboard = ["", "", "", "", "", "", "", "", ""];
        currentplayer = playerX;
        document.querySelectorAll('.cell').forEach(cell => cell.innerHTML='');
        cellElements.forEach(cell => cell.addEventListener('click',clickedcell));
        activecell=true;
        localStorage.removeItem('moves');
        previndexhistory=[];
        prevvaluehistory=[];
        nextindexhistory=[];
        nextvaluehistory=[];
        movelist=[];
        console.clear();
    }

//Exit browser when clicked
    function ExitGame(){
        window.close();
    }