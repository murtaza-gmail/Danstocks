import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(undefined);
	const [userData, setUserData] = useState(undefined);
	const [isToken, setIsToken] = useState(false)

	function login (authToken, userData) {
		setIsToken(true)
		setToken(authToken)
		setUserData(userData) 
	}

	function logout () {
		setIsToken(false)
		setToken(undefined)
		setUserData(undefined)
	}

	const authContextValue = {userData, setIsToken, token, login, logout}
	return <AuthContext.Provider value={authContextValue}> {children} </AuthContext.Provider>
}