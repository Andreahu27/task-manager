require("dotenv").config();

const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const methodOverride = require("method-override");

// (1) Install Mongoose with npm install mongoose
// Connect mongoose based on function below

const mongoose = require("mongoose");

const onlinePort = `mongodb+srv://andreahu27:${process.env.DB_PASS}@cluster0.wii1ff5.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(onlinePort || "mongodb://localhost/todos");

// (2) Create a Schema (see Todo.js file)

// (3) Import Schema created
const Todo = require("./Todo");

// (4) Create and save in DB one instance of schema
// const todo = new Todo({ task: "Brush teeth", category: "home" });
// todo.save().then(() => console.log(todo));

// Notes on patch and delete requests
// 1. Install "npm i method-override"
// 2. Require methodOverride with "require" - const methodOverride = require("method-override");
// 3. Insert app.use(methodOverride("_method"))
// 4. In the form, at the of the action link, add "_?method=PATCH" (or PUT, or DELETE)
// 5. Keep "method" key of html form as POST

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));

let todos = require("./to-dos.json");

let category = "all";

// (5) Query the database and render on the home page
app.get("/", async (req, res) => {
  // await Todo (Todo is the schema) allows for queries
  todos = await Todo.find({});

  res.render("home", { todos: todos, category: category });
});

// (7) Update the todo creation path
// Make it async await
// Create an instance of Todo, and save it
app.post("/todo", async (req, res) => {
  const todoCreated = req.body;
  const newTodo = await new Todo(todoCreated);
  newTodo.save();
  //   todo.id = uuid.v4();
  //   todos.push(todo);
  //   fs.writeFileSync("./to-dos.json", JSON.stringify(todos));
  res.redirect("/");
});

app.get("/:id/done", async (req, res) => {
  const targetId = req.params.id;
  const todoCurrent = await Todo.findById(targetId);
  //   todoSelected.save();

  const todoSelected = await Todo.updateOne(
    { _id: targetId },
    { $set: { done: !todoCurrent.done } }
  );

  const todoPrint = await Todo.findById(targetId);
  console.log(todoPrint);
  res.redirect("/");
});

// (8)
app.get("/:id/editpage", async (req, res) => {
  const idTarget = req.params.id;
  // const todoSelected = todos.filter((t) => t.id === req.params.id)[0];
  const todoSelected = await Todo.findById(idTarget);
  //res.send(todoSelected);
  res.render("edit", { todo: todoSelected });
});

// (6) Update the delete path
// Make the function an async await function
// Use the deleteOne function from Todo (schema) to delete
app.delete("/todo/:id", async (req, res) => {
  const idTarget = req.params.id;
  // todos = todos.filter((t) => t.id !== idTarget);

  todos = await Todo.deleteOne({ _id: idTarget });

  //fs.writeFileSync("./to-dos.json", JSON.stringify(todos));
  res.redirect("/");
});

// (9)
app.patch("/:id/edit", async (req, res) => {
  //   todos.forEach((todo) => {
  //     if (todo.id === req.params.id) {
  //       todo.task = req.body.task || todo.task;
  //       todo.category = req.body.category || todo.category;
  //     }
  //   });

  const targetId = req.params.id;
  const newTask = req.body.task;
  const newCategory = req.body.category;

  const todos = await Todo.updateOne(
    { _id: targetId },
    { $set: { task: newTask, category: newCategory } }
  );

  fs.writeFileSync("./to-dos.json", JSON.stringify(todos));
  //   res.send("ciao");
  res.redirect("/");

  //   const todoUpdate = todos.filter((t) => t.id === req.params.id)[0];
  //   todoUpdate.task = req.body.task || todoUpdate.task;
  //   todoUpdate.category = req.body.category || todoUpdate.category;
});

// (8) Update category path
// Request all todos, but filtered

app.get("/:category", async (req, res) => {
  const category = req.params.category;
  // let todosCategoryFil = todos.filter((t) => t.category === category);
  const todosCategoryFil = await Todo.find({ category: category });
  console.log(todosCategoryFil);
  res.render("home", { todos: todosCategoryFil, category: category });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Connection established");
});
