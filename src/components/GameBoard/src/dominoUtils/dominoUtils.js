function DominoUtils(){}
DominoUtils.isDominoEqual =function(domino, otherDomino)
    {
      if(domino && otherDomino){
        return (domino.firstNum == otherDomino.firstNum && domino.secondNum == otherDomino.secondNum);
      }
      else{
        return domino ==otherDomino;
      }
    };

export default DominoUtils;