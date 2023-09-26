import {Navigate} from 'react-router-dom'
import {useContext, useEffect} from 'react';
import UserContext from '../UserContext';

export default function Logout(){
	const {unsetUser, setUser} = useContext(UserContext);

	// Clear the localStorage of the user's information
	unsetUser();

	// Placing the setUser setter function inside of a useEffect is necessary because of updates within React JS that a state or another component cannot be updated while trying to render a different component
	// By adding the useEffect, this will allow the logout page to render first before triggering the useEffect which change the state of our user
	useEffect(()=>{
		setUser({
			id:null,
			isAdmin:null
		})
	}, [])

	return(
		<Navigate to = '/login'/>
	)
}