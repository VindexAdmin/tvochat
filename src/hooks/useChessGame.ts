import { useState, useEffect, useRef } from 'react';
import { Chess, Square } from 'chess.js';
import { ChessGameService, ChessGameEvents } from '../services/ChessGameService';

export const useChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [playerColor, setPlayerColor] = useState<'white' | 'black' | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameResult, setGameResult] = useState<{ result: 'win' | 'loss' | 'draw'; reason: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [opponentId, setOpponentId] = useState<string | null>(null);

  const chessService = useRef<ChessGameService | null>(null);

  useEffect(() => {
    const events: ChessGameEvents = {
      onGameStart: (color, opponent) => {
        console.log('Game started with color:', color);
        setPlayerColor(color);
        setOpponentId(opponent);
        setIsSearching(false);
        setIsGameActive(true);
        setGameResult(null);
        setError(null);
        setGame(new Chess());
        setLastMove(null);
      },
      onMove: (from, to, promotion) => {
        console.log('Move received:', { from, to, promotion });
        setLastMove({ from, to });
        setGame(chessService.current!.getGame());
      },
      onGameEnd: (result, reason) => {
        console.log('Game ended:', { result, reason });
        setGameResult({ result, reason });
        setIsGameActive(false);
      },
      onOpponentDisconnected: () => {
        setError('Opponent disconnected');
        setIsGameActive(false);
      },
      onError: (errorMessage) => {
        console.error('Chess game error:', errorMessage);
        setError(errorMessage);
        setIsSearching(false);
      }
    };

    chessService.current = new ChessGameService(events);
    chessService.current.initialize();

    return () => {
      if (chessService.current) {
        chessService.current.destroy();
      }
    };
  }, []);

  const findGame = () => {
    if (chessService.current) {
      setIsSearching(true);
      setError(null);
      setGameResult(null);
      chessService.current.findGame();
    }
  };

  const makeMove = (from: Square, to: Square, promotion?: string) => {
    if (chessService.current && chessService.current.makeMove(from, to, promotion)) {
      setLastMove({ from, to });
      setGame(chessService.current.getGame());
      return true;
    }
    return false;
  };

  const resign = () => {
    if (chessService.current) {
      chessService.current.resign();
    }
  };

  const offerDraw = () => {
    if (chessService.current) {
      chessService.current.offerDraw();
    }
  };

  const isPlayerTurn = () => {
    return chessService.current ? chessService.current.isPlayerTurn() : false;
  };

  return {
    game,
    playerColor,
    isSearching,
    isGameActive,
    gameResult,
    error,
    lastMove,
    opponentId,
    findGame,
    makeMove,
    resign,
    offerDraw,
    isPlayerTurn: isPlayerTurn()
  };
};