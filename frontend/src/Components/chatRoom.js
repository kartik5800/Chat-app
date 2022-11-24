import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Moment from 'react-moment'
import { io } from "socket.io-client"

const ChatRoom = () => {

    const location = useLocation()
    const msgBoxRef = useRef()

    const [data, setData] = useState({})
    const [msg, setMsg] = useState("")
    const [loading, setLoading] = useState(false)
    const [allMessages, setMessages] = useState([])
    const [socket, setSocket] = useState()

    const navigate = useNavigate();

    var Chats = JSON.parse(localStorage.getItem("message") || "[]")
    var Chat = {
        Name: data.name,
        Message: msg,
        time: new Date(),
        Chat_Room: data.room,

    }
    Chats.push(Chat)

    const userjoinleft = () => {

    }

    const [items, setItems] = useState([]);
    console.log("msg data", items);

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('message'));
        console.log("items", items);
        if (items) {
            setItems(items);

        }
    }, []);

    useEffect(() => {
        const socket = io("http://localhost:9000")
        setSocket(socket)

        socket.on("connect", () => {
            console.log("socket Connected")
            socket.emit("joinRoom", location.state.room)
            socket.on('user-connected', (socket_name) => {
                userjoinleft(socket_name, 'joined')
            })

        })
    }, [])

    useEffect(() => {

        if (socket) {
            socket.on("getLatestMessage", (newMessage) => {
                console.log(allMessages)
                console.log(newMessage)
                setMessages([...allMessages, newMessage])
                msgBoxRef.current.scrollIntoView({ behavior: "smooth" })
                setMsg("")
                setLoading(false)
            })
        }
    }, [socket, allMessages])

    useEffect(() => {
        setData(location.state)
    }, [location])

    const handleChange = e => setMsg(e.target.value)
    const handleEnter = e => e.keyCode === 13 ? onSubmit() : ""
    const onSubmit = () => {
        localStorage.setItem("message", JSON.stringify(Chats))
        if (msg) {

            setLoading(true)
            const newMessage = { time: new Date(), msg, name: data.name }
            socket.emit("newMessage", { newMessage, room: data.room })
            console.log(newMessage);
        }
    }


    const logout = () => {
        localStorage.clear();
        navigate("/");
    }


    return (
        <>
            <div>
            <button className="btn btn-warning btnwidth align-left" onClick={logout}><i class="fa-solid fa-power-off"></i></button>
                <div className="row d-flex chatbg1">
                    {/* <div className=" userpart">

                        
                    </div> */}
                    
                    <div className=" chatpart">
                    
                        <div className="">
                        
                            <div className="text-center mb-4 text-capitalize">
                                <h1 className="text-dark mb-4 back p-3"><span className="text-danger">{data?.room}</span> Chat Room</h1>

                            </div>
                            <div className="p-3 mb-4" style={{ height: "54vh", overflowY: "scroll" }}>


                                {
                                    items.map((msg) => {
                                        return data.name === msg.Name
                                            ?
                                            <div className="row justify-content-end pl-5 ">
                                                <div className="d-flex flex-column align-items-end m-1 ">
                                                    <div>
                                                        <p className="mb-0 d-flex flex-column align-items-end"> <span className="mx-2">{msg.Name}</span></p>
                                                        <div className="adminmsg minwidth">{msg.Message}
                                                            <div className="d-flex justify-content-end adminmsg_time">

                                                                <p>  <small className="text-muted"><Moment format='MMMM Do YYYY, h:mm:ss a'>{msg.time}</Moment></small></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div className="row justify-content-start">
                                                <div className="d-flex flex-column">
                                                    <div>
                                                        <p className="mb-0"> <span className="mx-2">{msg.Name}</span></p>
                                                        <div className="clientmsg minwidth">{msg.Message}

                                                            <div className="d-flex justify-content-start adminmsg_time">

                                                                <p> <small className="text-muted"><Moment format='MMMM Do YYYY, h:mm:ss a'>{msg.time}</Moment></small></p>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                    })
                                }




                                {
                                    allMessages.map(msg => {
                                        return data.name === msg.name
                                            ?
                                            <div className="row justify-content-end pl-5 ">
                                                <div className="d-flex flex-column align-items-end m-1 ">
                                                    <div>
                                                        <p className="mb-0 d-flex flex-column align-items-end"> <span className="mx-2">{msg.name}</span></p>
                                                        <div className="adminmsg minwidth">{msg.msg}
                                                            <div className="d-flex justify-content-end adminmsg_time">

                                                                <p>  <small className="text-muted"><Moment fromNow>{msg.time}</Moment></small></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div className="row justify-content-start">
                                                <div className="d-flex flex-column">
                                                    <div>
                                                        <p className="mb-0"> <span className="mx-2">{msg.name}</span></p>
                                                        <div className="clientmsg minwidth">{msg.msg}

                                                            <div className="d-flex justify-content-start adminmsg_time">

                                                                <p> <small className="text-muted"><Moment fromNow>{msg.time}</Moment></small></p>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                    })
                                }
                                <div ref={msgBoxRef} ></div>
                            </div>
                            <div className="form-group d-flex">
                                <input type="text" className="form-control bg-light" name="message" onKeyDown={handleEnter} placeholder="Type your message" value={msg} onChange={handleChange} />
                                <button type="button" className="btn btn-warning mx-2" disabled={loading} onClick={onSubmit}>
                                    {
                                        loading
                                            ?
                                            <div class="spinner-border spinner-border-sm text-primary"></div>
                                            :
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                                                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"></path>
                                            </svg>
                                    }
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>




    )
}

export default ChatRoom