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
import { CallNotification } from './types/CallNotification';
import { Message } from './types/Message';
import { Friend } from './types/Friend';
import { MessageType } from './types/enums/MessageType';
import { OrderCinemaRecord } from './components/OrderCinemaRecord/OrderCinemaRecord';
import { OrderEngine } from './components/OrderCinemaRecord/OrderEngine/OrderEngine';
import { EditProfile } from './components/UserChatFinderMenu/FindUsers/User/UserDetails/UserDetailsHeader/EditProfile/EditProfile';

function App() {
	const [user, setUser] = useState<User | null>(null);
	const [webSocket, setSocket] = useState<WebSocket | null>(null);
	const [currentChatFriend, setCurrentChatFriend] = useState<Friend | null>(null); // В моменташния приятел, с който сме влезли в чат!
	const [messagesWithCurrentFriend, setMessagesWithCurrentFriend] = useState<Message[] | []>([]);
	const [incomingCall, setIncomingCall] = useState<CallNotification | null>(null);

	useEffect(() => {
		if (location.pathname == "/") localStorage.removeItem("LAST_CINEMA_RECORDS");
	}, [location.pathname]);

	useEffect(() => {
		debugger;
		const BASE_URL = window.location.href.includes("local") ? "http://localhost:8080" : "https://streammate-org.onrender.com";
		const fetchUser = async () => {
			try {
				const response = await axios.get(BASE_URL + "/get-user", { withCredentials: true });
				console.log(response.data);
				setUser(response.data);  // Записваме потребителските данни
			} catch (error) {
				console.log("Не успяхме да вземем данните на потребителя", error);
				setUser(null);  // Ако има грешка, не сме логнати
			};
		};

		fetchUser();
	}, []);


	// FriendRequests operations WebSocket:
	useEffect(() => {
		debugger;
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


	// ChatWebSocket:
	useEffect(() => {
		debugger;
		if (!user) return;

		const BASE_URL = window.location.href.includes("local") ? "ws://localhost:8080" : "wss://streammate-org.onrender.com";
		const ws = new WebSocket(BASE_URL + `/chat?userId=${user.id}`);

		ws.onmessage = (event) => {
			console.log("Received message:", event.data);
			let newMessage: Message = JSON.parse(event.data);

			debugger;
			if (newMessage.messageType == MessageType.TEXT) {
				if (newMessage.owner == currentChatFriend?.realUserId) {

					setMessagesWithCurrentFriend(prevMessages => [...(prevMessages || []), newMessage]);

				};

			} else {

				debugger;
				const callNotification: CallNotification = JSON.parse(event.data);

				if ((callNotification.callType === MessageType.VIDEO_CALL || callNotification.callType === MessageType.AUDIO_CALL)
					&& callNotification.caller !== user.username) {

					console.log("Incoming call from", callNotification.caller);
					setIncomingCall(callNotification);

					let saveMessage: Message = {
						owner: callNotification.caller,
						createdOn: callNotification.timestamp,
						receiver: callNotification.receiver,
						messageText: callNotification.messageText,
						messageType: callNotification.callType,
					}
					setMessagesWithCurrentFriend(prevMessages => [...(prevMessages || []), saveMessage]);
				};
			};
		};

		ws.onopen = () => { console.log("Connected to WebSocket"); };
		ws.onclose = () => { console.log("WebSocket connection closed"); };
		setSocket(ws);

	}, [user?.username, currentChatFriend]);


	return (
		<>
			{user && (
				<UserChatFinderMenu
					user={user}
					setUser={setUser}
					webSocket={webSocket}

					currentChatFriend={currentChatFriend}
					setCurrentChatFriend={setCurrentChatFriend}
					messagesWithCurrentFriend={messagesWithCurrentFriend}
					setMessagesWithCurrentFriend={setMessagesWithCurrentFriend}

					incomingCall={incomingCall}
					setIncomingCall={setIncomingCall}
				/>
			)}

			<Routes>
				<Route path="/order-cinema-record" element={<OrderCinemaRecord />} />
				<Route path="/order/:cinemaRecord" element={<OrderEngine />} />
				<Route path="/user-details/:username/edit-profile" element={<EditProfile />} />

				<Route path="/login" element={<Login setUser={setUser} />} />
				<Route path="/register" element={<Register setUser={setUser }/>} />
				<Route path="/" element={<HomePage user={user} setUser={setUser} />} />
				<Route path="/actors/:id" element={<ActorDetails />} />

				<Route path="/user-details/:username" element={<UserDetails />} />

				{/* Movies */}
				<Route path="/movies" element={<CinemaRecordPage user={user} />} />
				<Route path="/movies/search/:movie" element={<CinemaRecordPage user={user} />} />
				<Route path="/movies/genres/:genre" element={<CinemaRecordPage user={user} />} />
				<Route path="/movies/:movie" element={<CinemaRecordDetails />} />
				<Route path="/movies/search/:movie/:id" element={<CinemaRecordDetails />} />

				{/* Series */}
				<Route path="/series" element={<CinemaRecordPage user={user} />} />
				<Route path="/series/genres/:genre" element={<CinemaRecordPage user={user} />} />
				<Route path="/series/search/:series" element={<CinemaRecordPage user={user} />} />
				<Route path="/series/search/:series/:id" element={<CinemaRecordDetails />} />
				<Route path="/series/:series" element={<CinemaRecordDetails />} />


				{/* TV-Channels */}
				<Route path="/tv-channels" element={<TV_ChannelsComponent />} />
				<Route path="/tv-channels/:name" element={<TV_ChannelDetails />} />
			</Routes>
		</>
	)
}

export default App;
