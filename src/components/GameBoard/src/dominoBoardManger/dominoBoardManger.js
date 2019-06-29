class Domino{
    constructor(firstNum, secondNum, vertical){
        this.firstNum  = firstNum;
        this.secondNum = secondNum;
        this.vertical  = vertical;
    }
    
}
class DominoNode{
    constructor(row,col ,domino){
        this.row = row;
        this.col = col; 
        this.domino = domino;
        this.childNodes=
        {
            left  : null,
            right : null,
            up    : null,
            down  : null
        };
    }
    checkIfLeaf(){
        ans = !((this.childNodes.left)||(this.childNodes.right)||(this.childNodes.upl)||(this.childNodes.down ));
        return ans;
    }
}
class DominoBoardManger{
    constructor(row, col){
        this.row = row;
        this.col = col;
        this.validNumbers = [0,1,2,3,4,5,6];
        this.dominoTree = null;
    }
    insertDominoToTree(domino){
        if(this.dominoTree == null){
            if(domino.firstNum == domino.secondNum){
                this.dominoTree = new DominoNode(domino.firstNum,domino.secondNum, true);
            }
            else{
                this.dominoTree = new DominoNode(domino.firstNum,domino.secondNum, false);
            }
        }
        else{
            _insertDominoToTree(domino, this.dominoTree);
        }
           
    }

    _insertDominoToTree(domino,curNode){}


    
}
export default DominoBoardManger;