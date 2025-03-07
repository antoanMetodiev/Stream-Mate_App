import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import { HomePage } from './components/HomePage/HomePage';
import { CinemaRecordPage } from './components/Movies/CinemaRecordPage';
import { CinemaRecordDetails } from './components/Movies/CinemaRecordsList/CinemaRecord/CinemaRecordDetails/CinemaRecordDetails';
import { ActorDetails } from './components/Movies/CinemaRecordsList/CinemaRecord/CinemaRecordDetails/CastSection/Actor/ActorDetails/ActorDetails';
import { Login } from './components/Auth/Login/Login';
import { Register } from './components/Auth/Register/Register';
import { User } from './types/User';
import { TV_ChannelsComponent } from './components/TV_Channels/TV_ChannelsComponent';
import { TV_ChannelDetails } from './components/TV_Channels/TV_ChannelsList/TV_Channel/TV_ChannelDetails/TV_ChannelDetails';
import { UserChatFinderMenu } from './components/UserChatFinderMenu/UserChatFinderMenu';
import { UserDetails } from './components/UserChatFinderMenu/FindUsers/User/UserDetails/UserDetails';
import { FriendRequest } from './types/FriendRequest';

function App() {
	const [user, setUser] = useState<User | null>(null);
	const [preRenderApp, setPrerenderApp] = useState(false);

	useEffect(() => {
		if (location.pathname == "/") localStorage.removeItem("LAST_CINEMA_RECORDS");
	}, [location.pathname]);

	useEffect(() => {
		const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://streammate-org.onrender.com";
		const fetchUser = async () => {
			try {
				const response = await axios.get(BASE_URL + "/get-user", { withCredentials: true });
				setUser(response.data);  // Записваме потребителските данни
			} catch (error) {
				console.log("Не успяхме да вземем данните на потребителя", error);
				setUser(null);  // Ако има грешка, не сме логнати
			};
		};

		fetchUser();
	}, []);


	// 🔹 WebSocket свързан с потребителя
	useEffect(() => {
		if (!user) return;

		const BASE_WS_URL = window.location.href.includes("local") ? "ws://localhost:8080" : "wss://streammate-org.onrender.com";
		const socket = new WebSocket(BASE_WS_URL + `/frRequest?username=${user.username}`);

		socket.onmessage = (event) => {
			debugger;
			try {
				const data = JSON.parse(event.data);
				if (data.type === "received_friend_request_cancellation") {
					debugger;
					console.log("Received Friend request was canceled:", data.message);
					const userCanceledUsername = data.message;

			
					console.log(user);

					setUser(prevUser => {
						if (!prevUser) return prevUser; // Ако потребителят не е зададен, връщаме същото състояние.

						const updatedRequests = prevUser.sentFriendRequests.filter(
							request => request.receiverUsername !== userCanceledUsername
						);

						return {
							...prevUser,
							sentFriendRequests: updatedRequests
						};
					});

					const truthy = true;
					setPrerenderApp(truthy);

				} else if (data.type === "sended_friend_request_cancellation") {
					debugger;
					console.log("Sended Friend request was canceled:", data.message);
					const userCanceledUsername = data.message;

					setUser(prevUser => {
						if (!prevUser) return prevUser; // Проверка дали user е наличен

						const updatedRequests = prevUser.sentFriendRequests.filter(
							request => request.senderUsername !== userCanceledUsername
						);

						return {
							...prevUser,
							sentFriendRequests: updatedRequests
						};
					});

				} else if (data.type === "friend_request") {
					console.log("Received Friend request by:", data.message);
					const sendedRequest: FriendRequest = data.message;

					setUser(prevUser => {
						if (!prevUser) return prevUser;
						const updatedRequests = [...prevUser?.receivedFriendRequests, sendedRequest];

						return {
							...user,
							receivedFriendRequests: updatedRequests
						};
					});
				};

			} catch (error) {
				console.error("Error parsing WebSocket message:", error);
			};
		};

		socket.onopen = () => console.log("WebSocket connected.");
		socket.onclose = () => console.log("WebSocket connection closed.");
		socket.onerror = (error) => console.error("WebSocket error:", error);

		return () => {
			socket.close();
		};

	}, [user?.username]); // WebSocket се рестартира само ако user се промени




	return (
		<>
			{user && <UserChatFinderMenu user={user} setUser={setUser} />}

			<Routes>
				<Route path="/login" element={<Login setUser={setUser} />} />
				<Route path="/register" element={<Register />} />
				<Route path="/" element={<HomePage user={user} setUser={setUser} />} />
				<Route path="/actors/:id" element={<ActorDetails />} />

				<Route path="/user-details/:username" element={<UserDetails />} />



				{/* Movies */}
				<Route path="/movies" element={<CinemaRecordPage />} />
				<Route path="/movies/search/:movie" element={<CinemaRecordPage />} />
				<Route path="/movies/search/:movie/:id" element={<CinemaRecordDetails />} />

				{/* Series */}
				<Route path="/series" element={<CinemaRecordPage />} />
				<Route path="/series/search/:series" element={<CinemaRecordPage />} />
				<Route path="/series/search/:series/:id" element={<CinemaRecordDetails />} />


				{/* TV-Channels */}
				<Route path="/tv-channels" element={<TV_ChannelsComponent />} />
				<Route path="/tv-channels/:name" element={<TV_ChannelDetails />} />
			</Routes>
		</>
	)
}

export default App;
