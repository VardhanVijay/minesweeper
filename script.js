const levelSelect = document.querySelector('.minesweeper-level');
const restart=document.querySelector('.restart');
const Endrestart=document.querySelector('.end-restart');
const gameOver=document.querySelector('.gameover');

function startGame (){
    const flag = document.querySelector('.flag-no');
    const gameboard=document.querySelector('.game-board');
    const gameCol=document.querySelector('.game-col');
    gameboard.innerHTML=""; 
    flag.innerHTML="";
    gameOver.style.visibility='hidden';

    let level=levelSelect.value;

    let board=[];
    let boardSize=levelMapper[level].boardSize;
    let mineCount=levelMapper[level].mineCount;
    let mines=[];
    let flagCount=mineCount;
    let flagArr=[];

    flag.append("🚩",flagCount); 

    function createBoard() {
        for(let i=0;i<boardSize;i++){
            const row=document.createElement('div');
            row.classList.add('game-row');
            let rowArray=[];

            for(let j=0;j<boardSize;j++){
                const col=document.createElement('div');
                col.classList.add('game-col');

                col.addEventListener('click', () => findBomb(i, j));
                col.addEventListener('contextmenu', function(event) {
                    event.preventDefault();
                    addflag(i, j);
                });

                rowArray.push(col);
                row.append(col);
            }
            board.push(rowArray);
            gameboard.append(row);
        }
        
        for(let i=0;i<mineCount;i++){
            let row=Math.floor(Math.random()*boardSize);
            let col=Math.floor(Math.random()*boardSize);
            mines.push([row,col]);
        }
    }

    let vis=[];
    for(let i=0;i<boardSize;i++){
        let rowCheck=[];
        for(let j=0;j<boardSize;j++){
            rowCheck.push(false);
        }
        vis.push(rowCheck);
    }
    
    function check(i,j){
        if(i<0 || i>=boardSize || j<0 || j>=boardSize) return false;

        return true;
    }
    createBoard();
    
    function findBomb(prevRow,prevCol){
        if(vis[prevRow][prevCol]) return; 
        const index=flagArr.findIndex(item => item[0] === prevRow && item[1] === prevCol);
        const minefind=mines.findIndex(item => item[0] === prevRow && item[1] === prevCol);
        if(index != -1) return;
        if(minefind != -1){
            endScreen();
        }
        let xDr=[1,-1,0,0,-1,1,-1,1];
        let yDr=[0,0,-1,1,-1,-1,1,1];
        let cnt=0;

        vis[prevRow][prevCol]=true;

        if(prevCol+prevRow %2==0) board[prevRow][prevCol].classList.add('backgroundChange-odd');
        else board[prevRow][prevCol].classList.add('backgroundChange-even');

        if(mines.find(pair => pair[0] === prevRow && pair[1] === prevCol)){
            return;
        }

        for(let i=0;i<8;i++){
            let newR=prevRow+xDr[i];
            let newC=prevCol+yDr[i];

            if(!check(newR,newC)) continue;
            
            const target = mines.find(pair => pair[0] === newR && pair[1] === newC);
            if (target) {
                cnt++;
            }
            
        }

        if(cnt ==0){
            // board[prevRow][prevCol].append(cnt);
            for(let i=0;i<8;i++){
                let newR=prevRow+xDr[i];
                let newC=prevCol+yDr[i];

                if(check(newR,newC) && !vis[newR][newC])findBomb(newR,newC);
            }
        }
        else board[prevRow][prevCol].append(cnt);

    }

    function addflag(flagrow, flagcol) {
        if(flagCount==0) return;
        
        if(vis[flagrow][flagcol]) return;
        const index = flagArr.findIndex(item => item[0] === flagrow && item[1] === flagcol);
        console.log(index);
        if (index !== -1) {
            flagArr.splice(index, 1);
            board[flagrow][flagcol].innerHTML="";
            flagCount++;
            flag.innerHTML="";
            flag.append("🚩",flagCount); 
        }
        
        else{
            flagArr.push([flagrow, flagcol]);
            flagCount--;
            flag.innerHTML="";
            flag.append("🚩",flagCount); 
            board[flagrow][flagcol].append('🚩');
        }
    }
    function endScreen() {
        mines.forEach(ele=>{
            board[ele[0]][ele[1]].append('💣');
        })

        board.forEach(row => {
            row.forEach(col => {
                col.classList.add('disabled'); 
            });
        });
        gameOver.style.visibility='visible';
    }
    
}

document.addEventListener('DOMContentLoaded',startGame);
levelSelect.addEventListener('change',startGame);
restart.addEventListener('click',startGame);
Endrestart.addEventListener('click',startGame);

const levelMapper={
    easy:{
        boardSize : 10,
        mineCount : 10
    },
    med:{
        boardSize : 15,
        mineCount : 15
    },
    hard:{
        boardSize : 20,
        mineCount : 20
    }
}