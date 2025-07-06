import React from 'react';
import { Chess } from 'chess.js';
import { Crown, Clock, Users, Trophy, AlertTriangle } from 'lucide-react';

interface GameStatusProps {
  game: Chess;
  playerColor: 'white' | 'black';
  isPlayerTurn: boolean;
  gameTime?: { white: number; black: number };
  opponentName?: string;
}

export const GameStatus: React.FC<GameStatusProps> = ({
  game,
  playerColor,
  isPlayerTurn,
  gameTime,
  opponentName = 'Opponent'
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getGameStatus = () => {
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        const winner = game.turn() === 'w' ? 'Black' : 'White';
        const isPlayerWinner = (winner.toLowerCase() === playerColor);
        return {
          status: 'checkmate',
          message: isPlayerWinner ? 'You won by checkmate!' : 'You lost by checkmate',
          icon: <Trophy className="w-5 h-5" />,
          color: isPlayerWinner ? 'text-green-400' : 'text-red-400'
        };
      } else if (game.isDraw()) {
        let reason = 'Draw';
        if (game.isStalemate()) reason = 'Draw by stalemate';
        else if (game.isThreefoldRepetition()) reason = 'Draw by repetition';
        else if (game.isInsufficientMaterial()) reason = 'Draw by insufficient material';
        
        return {
          status: 'draw',
          message: reason,
          icon: <Users className="w-5 h-5" />,
          color: 'text-yellow-400'
        };
      }
    } else if (game.inCheck()) {
      const inCheckPlayer = game.turn() === 'w' ? 'White' : 'Black';
      const isPlayerInCheck = inCheckPlayer.toLowerCase() === playerColor;
      return {
        status: 'check',
        message: isPlayerInCheck ? 'You are in check!' : 'Opponent is in check',
        icon: <AlertTriangle className="w-5 h-5" />,
        color: isPlayerInCheck ? 'text-red-400' : 'text-orange-400'
      };
    }

    return {
      status: 'playing',
      message: isPlayerTurn ? 'Your turn' : `${opponentName}'s turn`,
      icon: <Crown className="w-5 h-5" />,
      color: isPlayerTurn ? 'text-blue-400' : 'text-gray-400'
    };
  };

  const status = getGameStatus();

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700">
      {/* Game Status */}
      <div className={`flex items-center space-x-2 mb-4 ${status.color}`}>
        {status.icon}
        <span className="font-semibold">{status.message}</span>
      </div>

      {/* Player Info */}
      <div className="space-y-3">
        {/* Opponent */}
        <div className={`flex items-center justify-between p-2 rounded-lg ${
          !isPlayerTurn && !game.isGameOver() ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-gray-700/50'
        }`}>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              playerColor === 'white' ? 'bg-gray-800 border-2 border-gray-600' : 'bg-white'
            }`}></div>
            <span className="font-medium">{opponentName}</span>
            <span className="text-xs text-gray-400">
              ({playerColor === 'white' ? 'Black' : 'White'})
            </span>
          </div>
          {gameTime && (
            <div className="flex items-center space-x-1 text-sm">
              <Clock className="w-4 h-4" />
              <span>{formatTime(playerColor === 'white' ? gameTime.black : gameTime.white)}</span>
            </div>
          )}
        </div>

        {/* Player */}
        <div className={`flex items-center justify-between p-2 rounded-lg ${
          isPlayerTurn && !game.isGameOver() ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-gray-700/50'
        }`}>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              playerColor === 'white' ? 'bg-white' : 'bg-gray-800 border-2 border-gray-600'
            }`}></div>
            <span className="font-medium">You</span>
            <span className="text-xs text-gray-400">
              ({playerColor === 'white' ? 'White' : 'Black'})
            </span>
          </div>
          {gameTime && (
            <div className="flex items-center space-x-1 text-sm">
              <Clock className="w-4 h-4" />
              <span>{formatTime(playerColor === 'white' ? gameTime.white : gameTime.black)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Move count */}
      <div className="mt-4 text-center text-sm text-gray-400">
        Move {Math.ceil(game.history().length / 2)}
      </div>
    </div>
  );
};