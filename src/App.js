import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { auth, db } from "./firebase";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import DeleteIcon from "@material-ui/icons/Delete";

export function App(props) {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .add({ text: newTask, checked: false })
      .then(() => {});
    setNewTask("");
  };

  const deleteTask = task_id => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .doc(task_id)
      .delete();
  };

  const changeCheck = (checked, task_id) => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .doc(task_id)
      .update({ checked: checked });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      if (u) {
        setUser(u);
      } else {
        props.history.push("/");
      }
      // do something
    });

    return unsubscribe;
  }, [props.history]);

  useEffect(() => {
    let unsubscribe;

    if (user) {
      unsubscribe = db
        .collection("users")
        .doc(user.uid)
        .collection("tasks")
        .onSnapshot(snapshot => {
          console.log(snapshot.docs);
          const user_tasks = snapshot.docs.map(qs => {
            const user_task = {
              id: qs.id,
              text: qs.data().text,
              complete: qs.data().complete
            };
            return user_task;
          });
          setTasks(user_tasks);
        });
    }
    return unsubscribe;
  }, [user]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        props.history.push("/");
      })
      .catch(error => {
        alert(error.mesage);
      });
  };

  if (!user) {
    return <div />;
  }

  return (
    <div>
      <AppBar position="static" color="Primary">
        <Toolbar>
          <Typography
            color="inherit"
            style={{ flexGrow: "1", marginLeft: "30px" }}
          >
            To Do List
          </Typography>
          <Typography color="inherit" style={{ marginRight: "30px" }}>
            Hi! {user.email}
          </Typography>
          <Button color="inherit" onClick={handleSignOut}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}
      >
        <Paper style={{ padding: "30px", width: "700px" }}>
          <Typography variant="h6">To Do List</Typography>
          <div style={{ display: "flex", marginTop: "30px" }}>
            <TextField
              fullWidth={true}
              onKeyPress={e => {
                if (e.key === "Enter") {
                  addTask();
                }
              }}
              placeholder="Add a new task here"
              style={{ marginRight: "30px" }}
              value={newTask}
              onChange={event => {
                setNewTask(event.target.value);
              }}
            />
            <Button color="primary" variant="contained" onClick={addTask}>
              {" "}
              Add
            </Button>
          </div>
          <List>
            {tasks.map(value => (
              <ListItem key={value.id}>
                <ListItemIcon>
                  <Checkbox
                    onChange={e => {
                      changeCheck(e.target.checked, value.id);
                    }}
                    checked={value.checked} //checked={checked.indexOf(value) !== -1}
                  />
                </ListItemIcon>
                <ListItemText primary={value.text} />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => {
                      deleteTask(value.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </div>
    </div>
  );
}
