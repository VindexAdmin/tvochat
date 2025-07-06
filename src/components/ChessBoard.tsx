import React, { useState, useEffect } from 'react';
import { Chess, Square, PieceSymbol, Color } from 'chess.js';

interface ChessBoardProps {
  game: Chess;
  playerColor: 'white' | 'black';
  onMove: (from: Square, to: Square, promotion?: string) => void;
  isPlayerTurn: boolean;
  lastMove?: { from: Square; to: Square } | null;
}

const pieceUnicode: Record<string, string> = {
  'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
  'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟'
};

export const ChessBoard: React.FC<ChessBoardProps> = ({
  game,
  playerColor,
  onMove,
  isPlayerTurn,
  lastMove
}) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);
  const [promotionSquare, setPromotionSquare] = useState<{ from: Square; to: Square } | null>(null);

  const board = game.board();
  const isFlipped = playerColor === 'black';

  const getSquareName = (row: number, col: number): Square => {
    const file = String.fromCharCode(97 + (isFlipped ? 7 - col : col));
    const rank = (isFlipped ? row + 1 : 8 - row).toString();
    return (file + rank) as Square;
  };

  const handleSquareClick = (square: Square) => {
    if (!isPlayerTurn) return;

    if (selectedSquare === square) {
      setSelectedSquare(null);
      setPossibleMoves([]);
      return;
    }

    if (selectedSquare && possibleMoves.includes(square)) {
      // Check if this is a pawn promotion
      const piece = game.get(selectedSquare);
      const isPromotion = piece?.type === 'p' && 
        ((piece.color === 'w' && square[1] === '8') || 
         (piece.color === 'b' && square[1] === '1'));

      if (isPromotion) {
        setPromotionSquare({ from: selectedSquare, to: square });
      } else {
        onMove(selectedSquare, square);
        setSelectedSquare(null);
        setPossibleMoves([]);
      }
    } else {
      const piece = game.get(square);
      if (piece && piece.color === (playerColor === 'white' ? 'w' : 'b')) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        setPossibleMoves(moves.map(move => move.to as Square));
      } else {
        setSelectedSquare(null);
        setPossibleMoves([]);
      }
    }
  };

  const handlePromotion = (piece: string) => {
    if (promotionSquare) {
      onMove(promotionSquare.from, promotionSquare.to, piece);
      setPromotionSquare(null);
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  };

  const isSquareHighlighted = (square: Square) => {
    return lastMove && (lastMove.from === square || lastMove.to === square);
  };

  const renderSquare = (row: number, col: number) => {
    const square = getSquareName(row, col);
    const piece = board[row][col];
    const isLight = (row + col) % 2 === 0;
    const isSelected = selectedSquare === square;
    const isPossibleMove = possibleMoves.includes(square);
    const isHighlighted = isSquareHighlighted(square);

    let squareClass = `w-12 h-12 flex items-center justify-center text-2xl cursor-pointer relative transition-all duration-200 ${
      isLight ? 'bg-amber-100' : 'bg-amber-800'
    }`;

    if (isSelected) {
      squareClass += ' ring-4 ring-blue-400 ring-inset';
    } else if (isPossibleMove) {
      squareClass += ' ring-2 ring-green-400 ring-inset';
    } else if (isHighlighted) {
      squareClass += ' ring-2 ring-yellow-400 ring-inset';
    }

    if (!isPlayerTurn) {
      squareClass += ' cursor-not-allowed opacity-75';
    }

    return (
      <div
        key={square}
        className={squareClass}
        onClick={() => handleSquareClick(square)}
      >
        {piece && (
          <span className="select-none">
            {pieceUnicode[piece.color + piece.type.toUpperCase()]}
          </span>
        )}
        {isPossibleMove && !piece && (
          <div className="w-3 h-3 bg-green-400 rounded-full opacity-60"></div>
        )}
        {isPossibleMove && piece && (
          <div className="absolute inset-0 border-4 border-green-400 rounded-full opacity-60"></div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-8 gap-0 border-4 border-amber-900 rounded-lg overflow-hidden shadow-2xl">
        {Array.from({ length: 8 }, (_, row) =>
          Array.from({ length: 8 }, (_, col) => renderSquare(row, col))
        )}
      </div>

      {/* Promotion Modal */}
      {promotionSquare && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg p-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Choose promotion piece:</h3>
            <div className="flex space-x-2">
              {['q', 'r', 'b', 'n'].map((piece) => (
                <button
                  key={piece}
                  onClick={() => handlePromotion(piece)}
                  className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-3xl transition-colors"
                >
                  {pieceUnicode[(playerColor === 'white' ? 'w' : 'b') + piece.toUpperCase()]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Coordinate labels */}
      <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-2 text-xs text-gray-600">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i}>
            {String.fromCharCode(97 + (isFlipped ? 7 - i : i))}
          </span>
        ))}
      </div>
      <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-between py-2 text-xs text-gray-600">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i}>
            {isFlipped ? i + 1 : 8 - i}
          </span>
        ))}
      </div>
    </div>
  );
};