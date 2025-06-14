
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs?: number;
}

interface RateLimitState {
  attempts: number[];
  isBlocked: boolean;
  blockUntil?: number;
}

export const useRateLimit = (config: RateLimitConfig) => {
  const { toast } = useToast();
  const stateRef = useRef<RateLimitState>({
    attempts: [],
    isBlocked: false
  });

  const isAllowed = useCallback((): boolean => {
    const now = Date.now();
    const state = stateRef.current;

    // Check if still blocked
    if (state.isBlocked && state.blockUntil && now < state.blockUntil) {
      const remainingTime = Math.ceil((state.blockUntil - now) / 1000);
      toast({
        title: "Demasiadas solicitudes",
        description: `Espera ${remainingTime} segundos antes de intentar nuevamente`,
        variant: "destructive",
      });
      return false;
    }

    // Clear expired attempts
    state.attempts = state.attempts.filter(
      attempt => now - attempt < config.windowMs
    );

    // Check rate limit
    if (state.attempts.length >= config.maxAttempts) {
      state.isBlocked = true;
      state.blockUntil = now + (config.blockDurationMs || config.windowMs);
      
      toast({
        title: "Límite de solicitudes excedido",
        description: `Máximo ${config.maxAttempts} intentos cada ${Math.round(config.windowMs / 1000)} segundos`,
        variant: "destructive",
      });
      return false;
    }

    // Clear block if expired
    if (state.isBlocked && (!state.blockUntil || now >= state.blockUntil)) {
      state.isBlocked = false;
      state.blockUntil = undefined;
    }

    return true;
  }, [config, toast]);

  const recordAttempt = useCallback(() => {
    stateRef.current.attempts.push(Date.now());
  }, []);

  const reset = useCallback(() => {
    stateRef.current = {
      attempts: [],
      isBlocked: false
    };
  }, []);

  return {
    isAllowed,
    recordAttempt,
    reset,
    isBlocked: stateRef.current.isBlocked
  };
};
