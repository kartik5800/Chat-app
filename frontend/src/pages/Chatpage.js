import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Chatpage = () => {
  const [chats, setchats] = useState([])

    const FetchChats =async () => {
        const {data} = await axios.get('/api/chat');
        console.log(data);
        setchats(data)
    }

useEffect(() => {

FetchChats();
 
}, [])


  return (
    <>
    <div>
      {
        chats.map((chat) =>{
          return(
            <div key={chat._id}>{chat.chatName}</div>
          )
        })
      }
    </div>
    </>
  )
}

export default Chatpage