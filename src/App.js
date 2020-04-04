import React from "react";
import { useState, useReducer } from "react";
// material
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import useMediaQuery from '@material-ui/core/useMediaQuery';

// socket.io
import io from "socket.io-client";
let socket;


const useStyles = makeStyles(theme => ({
  app: {
    color: "#fffffe",
    display: "grid",
    gridTemplateColumns: "1fr 3fr"
  },
  chatRooms: {
    background: "#242629",
    height: "100vh",
    display: "flex",
    flexDirection: 'column',
    textAlign: "center"
  },
  chatBox: {
    height: '100vh',
    background: "#16161a",
    display: "flex",
    flexDirection: 'column'
  },
  chatRoomsTitle: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  },
  roomTitle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#94a1b2"
  },
  messageLine: {
    marginBottom: "1rem",
    display: "flex"
  },
  messageBox: {
    padding: ".5rem",
    overflowY: "scroll"
  },
  inputBox: {
    background: "#94a1b2",
    display: "flex",
    flexDirection: 'column'
  },
  messageBubble: {
    padding: ".5rem .7rem .5rem .7rem",
    borderRadius: ".7rem"
  }
}));

function App() {
  const classes = useStyles();
  const matches = useMediaQuery('(min-width:600px)');
  const [currentRoom, setCurrentRoom] = useState("room");
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState("frank");

  const [state, dispatch] = useReducer(reducer, {
    room: [
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" }
    ]
  });

  let rooms = Object.keys(state);

  function reducer(state, action) {
    let { type, payload } = action;
    switch (type) {
      case "RECEIVE MESSAGE":
        return {
          ...state,
          [payload.room]: [
            ...state[payload.room],
            {
              user: payload.user,
              content: payload.content
            }
          ]
        };
      case "NEW ROOM":
        return {
          ...state,
          [payload]: [
            {
              content: "New room created!"
            }
          ]
        };
      default:
        return state;
    }
  }

  if (!socket) {
    socket = io("http://192.168.0.105:4000");
    if (!currentUser) setCurrentUser(prompt("What's your name?"));

    socket.on("receiveMsg", msg => {
      dispatch({ type: "RECEIVE MESSAGE", payload: msg });
    });

    socket.on("new room", name => {
      dispatch({ type: "NEW ROOM", payload: name });
    });
  }

  let messageLineEl = (msg, i) => {
    return msg.user == currentUser ? (
      <div
        key={i}
        className={classes.messageLine}
        style={{
          justifyContent: "flex-end"
        }}
      >
        <div
          className={classes.messageBubble}
          style={{ background: "#3f51b5" }}
        >
          {msg.content}
        </div>
        {msg.user && (
          <Avatar style={{ marginLeft: ".5rem", background: "#3f51b5" }}>
            {msg.user[0].toUpperCase()}
          </Avatar>
        )}
      </div>
    ) : (
      <div
        key={i}
        className={classes.messageLine}
        style={{
          justifyContent: "flex-start"
        }}
      >
        {msg.user && (
          <Avatar style={{ marginRight: ".5rem" }}>
            {msg.user[0].toUpperCase()}
          </Avatar>
        )}
        <div className={classes.messageBubble} style={{ background: "#777" }}>
          {msg.content}
        </div>
      </div>
    );
  };

  function submitMessage() {
    socket.emit("sendMsg", {
      room: currentRoom,
      user: currentUser,
      content: message
    });
    setMessage("");
  }

  function addRoom() {
    let roomName = prompt("insert room name");
    socket.emit("add room", roomName);
  }

  return (
    <div className={classes.app}>
      <div className={classes.chatRooms}>
        <div className={classes.chatRoomsTitle}>
          <Typography variant="h3">Chat App</Typography>
          <Typography variant="h5" style={{ color: "#999" }}>
            by frank
          </Typography>
        </div>
        <List className={classes.list}>
          {rooms.map((room, i) => (
            <ListItem key={i} button onClick={e => setCurrentRoom(room)}>
              <ListItemText primary={room} />
            </ListItem>
          ))}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => addRoom()}
          >
            Add Room
          </Button>
        </List>
      </div>
      <div className={classes.chatBox}>
        <div className={classes.roomTitle}>
          <Typography variant="h4">
            {currentRoom || "Please Select A Room."}
          </Typography>
        </div>
        <div className={classes.messageBox}>
          {state[currentRoom].map((msg, i) => messageLineEl(msg))}
        </div>
        <div className={classes.inputBox}>
          <textarea
            placeholder="Text here..."
            style={{
              background: "transparent",
              color: "#fff",
              resize: "none",
              height: '20vh'
            }}
            value={message}
            onChange={e => {
              setMessage(e.target.value);
            }}
          ></textarea>
          <Button
            className={classes.inputBtn}
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => submitMessage()}
          >
            send
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
