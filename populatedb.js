// Get arguments passed on command line
const userArgs = process.argv.slice(2);
console.log(userArgs);
const users = [];
const comments = [];
require("dotenv").config();

const Post = require("./models/post");
const Comment = require("./models/comment");
const User = require("./models/user");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = process.env.DB_STRING;
main().catch((err) => console.log(err));
async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  await createUsers();
  await createComments();
  await createPosts();
  mongoose.connection.close();
}

async function userCreate(username, password, isAuthor, index) {
  const user = new User({
    username: username,
    password: password,
    isAuthor: isAuthor,
  });
  users[index] = user;
  console.log(`Added user`);
  await user.save();
}

async function commentCreate(text, author, date, index) {
  const comment = new Comment({
    text: text,
    author: author,
    date: date,
  });
  comments[index] = comment;
  await comment.save();
}

async function postCreate(title, text, author, comments, published, date) {
  const post = new Post({
    title: title,
    text: text,
    author: author,
    comments: comments,
    published: published,
    date: date,
  });
  await post.save();
}

async function createUsers() {
  await Promise.all([
    userCreate("one", "testing", false, 0),
    userCreate("two", "twooo", true, 0),
    userCreate("three", "threes", false, 0),
  ]);
}

async function createComments() {
  await Promise.all([
    commentCreate("hahahh", users[0], new Date(), 0),
    commentCreate("This is the best", users[0], new Date(), 1),
    commentCreate("omg", users[2], new Date(), 2),
  ]);
}

async function createPosts() {
  await Promise.all([
    postCreate(
      "first post",
      "This is the first ever post",
      users[1],
      comments[0],
      true,
      new Date(),
    ),
    postCreate(
      "Second post",
      "This is the second ever post",
      users[1],
      comments.slice(1),
      true,
      new Date(),
    ),
  ]);
}
