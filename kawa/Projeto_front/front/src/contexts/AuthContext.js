import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const login = async (email, senha) => {
    setIsLoading(true);
    try {
      const response = await api.post('/usuarios/login', { email, senha });
      if (response.data === true) {
        // O backend retornou 'true'. Simulamos um token para manter o estado.
        const fakeToken = 'secret-auth-token';
        await AsyncStorage.setItem('userToken', fakeToken);
        setUserToken(fakeToken);
      } else {
        throw new Error('Email ou senha inválidos.');
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await AsyncStorage.removeItem('userToken');
    setUserToken(null);
    setIsLoading(false);
  };

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      setUserToken(token);
    } catch (e) {
      console.error('Erro ao verificar token:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, isLoading, userToken }}>
      {children}
    </AuthContext.Provider>
  );
};