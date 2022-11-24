import './App.css';
import {Routes, Route } from "react-router-dom";
import MainForm from './Components/mainForm';
import ChatRoom from './Components/chatRoom';


function App() {
	return (
		<div className="container-fluid bg-color text-dark d-flex align-items-center justify-content-center" style={{height: "100vh"}}>


				<Routes>
					<Route index element={<MainForm />} />
					<Route path="chat/:roomId" element={<ChatRoom />} />
				</Routes>
		</div>
	);
}

export default App;
