import { Routes, Route, useNavigate } from 'react-router-dom';

import { HomePage } from './components/HomePage/HomePage';
import { CinemaRecordPage } from './components/Movies/CinemaRecordPage';
import { CinemaRecordDetails } from './components/Movies/CinemaRecordsList/CinemaRecord/CinemaRecordDetails/CinemaRecordDetails';
import { ActorDetails } from './components/Movies/CinemaRecordsList/CinemaRecord/CinemaRecordDetails/CastSection/Actor/ActorDetails/ActorDetails';
import { Login } from './components/Auth/Login/Login';
import { Register } from './components/Auth/Register/Register';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from './types/User';
import { Chat } from './components/Chat/Chat';

function App() {
	const [user, setUser] = useState<User | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		debugger;
		if(location.pathname == "/") localStorage.removeItem("LAST_CINEMA_RECORDS");
	}, [location.pathname]);

	useEffect(() => {
		// Асинхронна функция за получаване на потребителски данни
		const fetchUser = async () => {
			try {
				const response = await axios.get("http://localhost:8080/get-user", { withCredentials: true });
				console.log(response.data);
				
				setUser(response.data);  // Записваме потребителските данни
			} catch (error) {
				console.log("Не успяхме да вземем данните на потребителя", error);
				setUser(null);  // Ако има грешка, не сме логнати
			};
		};

		fetchUser();  // Извикваме асинхронната функция
	}, []);  // Тази заявка ще се изпълни само при зареждане на компонента


	return (
		<Routes>
			<Route path="/" element={<HomePage user={user} setUser={setUser} />} />
			<Route path="/actors/:id" element={<ActorDetails />} />
			<Route path="/login" element={<Login setUser={setUser} />} />
			<Route path="/register" element={<Register />} />
			{/* <Route path="/" element={<Chat />} /> */}


			{/* Movies */}
			<Route path="/movies" element={<CinemaRecordPage />} />
			<Route path="/movies/search/:movie" element={<CinemaRecordPage />} />
			<Route path="/movies/search/:movie/:id" element={<CinemaRecordDetails />} />

			{/* Series */}
			<Route path="/series" element={<CinemaRecordPage />} />
			<Route path="/series/search/:series" element={<CinemaRecordPage />} />
			<Route path="/series/search/:series/:id" element={<CinemaRecordDetails />} />
		</Routes>
	)
}

export default App;
