const express=require("express");
const app=express();
const port=8080;
const path=require("path");
const{v4:uuidv4}=require('uuid');
const methodOverride=require("method-override");
const session = require('express-session');
const student_verify = require("./student_verify");
const faculty_verify = require("./faculty_verify");

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(session({
    secret: 'your-secret-key', // Replace with a random string for session encryption
    resave: false,
    saveUninitialized: true
}));

let posts=[
    {
        id:uuidv4(),
        username:"Sanjeev",
        content:"How to crack interviews?",
        answer:"To crack interviews, thoroughly understand the job requirements, and practice common questions and problem-solving. Additionally, showcase your skills confidently with examples from your experience."
    },
    {
        id:uuidv4(),
        username:"Rahul",
        content:"How to study Operating Systems?",
        answer:"Study Operating Systems by focusing on theoretical concepts and practical implementations through hands-on projects and simulations. Additionally, grasp key topics such as process management, memory allocation, and file systems to build a comprehensive understanding."
    },
    {
        id:uuidv4(),
        username:"Manikanta",
        content:"How to pay college fee online?",
        answer:"Go to college website and select payment option"
    },
    {
        id:uuidv4(),
        username:"Rahul",
        content:"How to improve CGPA?",
        answer:"To improve your CGPA, focus on understanding course material deeply and manage your study time effectively. Seek help when needed and consistently review and practice your subjects."
    }
]
let student_login=[
    {
        username:"Sanjeev",
        password:1234
    },
    {
        username:"Rahul",
        password:1234
    },
    {
        username:"Manikanta",
        password:1234
    }
    
]
let faculty_login=[
    {
        username:"Srinivas",
        password:1234
    },
    {
        username:"Lokesh",
        password:1234
    }
];
app.get("/login",(req,res)=>{
    res.render("login.ejs");
});
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.render("index", { posts, req: { session: { username: null } } }); // Redirect in case of an error while destroying the session // Redirect in case of an error while destroying the session
        }
        res.clearCookie("connect.sid"); // Clear the cookie that stored the session ID
        return res.render("index", { posts, req: { session: { username: null } } }); // Redirect in case of an error while destroying the session
    });
});

app.post("/verify_student_login", (req, res) => {
    let { uname, psw } = req.body;
    let flag = 0;
    for (let i = 0; i < student_login.length; i++) {
        if (student_login[i].username == uname && student_login[i].password == psw) {
            req.session.username=uname;
            req.session.category="student";
            flag = 1;
            res.redirect("/posts");
            return; // Exit after successful login
        }
    }
    if (flag == 0) {
        res.send("<script>alert('Please enter correct username and password'); window.location.href='/login';</script>");
    }
});
app.post("/verify_faculty_login", (req, res) => {
    let { uname, psw } = req.body;
    let flag = 0;
    for (let i = 0; i < faculty_login.length; i++) {
        
        if (faculty_login[i].username == uname && faculty_login[i].password == psw) {
            req.session.username=uname;
            req.session.category="faculty";
            flag = 1;
            res.redirect("/posts");
            return; // Exit after successful login
        }
    }
    if (flag === 0) {
        res.send("<script>alert('Please enter correct username and password'); window.location.href='/login';</script>");
    }
});
app.get("/posts",(req,res)=>{
    // res.send("Working good");
    console.log(req.session.username);
    res.render("index.ejs",{posts,req});
});
app.get("/posts/new",student_verify,(req,res)=>{
    res.render("new.ejs");
});
app.post("/posts",(req,res) => {
    let {content}=req.body;
    let id=uuidv4();
    let username=req.session.username;
    console.log("Username:"+username);
    posts.push({id,username,content});
    res.render("index.ejs",{posts,req});
});
app.get("/posts/:id",(req,res)=>{
    let {id}=req.params;
    let post=posts.find((p)=>id===p.id);
    res.render("show.ejs",{post});
 
});

app.patch("/posts/:id",(req,res)=>{
    let {id}=req.params;
    let newContent=req.body.content;
   let post=posts.find((p)=>id===p.id);
   post.content=newContent;
   res.redirect("/posts");
    console.log(post);
})
//Answering a query
app.get("/posts/:id/answer",faculty_verify,(req,res)=>{
    let {id}=req.params;
    let post=posts.find((p)=>id===p.id);
    res.render("answer.ejs",post);
});
app.patch("/posts/answer/:id",(req,res)=>{
    let {id}=req.params;
    let newAnswer=req.body.answer;
    let post=posts.find((p)=>id===p.id);
    post.answer=newAnswer;
    res.render("show.ejs",{post});
});
app.get("/posts/:id/edit", (req, res) => {
    const postId = req.params.id;
    const post = posts.find(p => p.id === postId);

    if (!post) {
        res.status(404).send("Post not found");
        return;
    }
    res.render("edit.ejs", { post });
});


app.delete("/posts/:id",(req,res)=>{
    let {id}=req.params;
    posts=posts.filter((p)=>id!==p.id);
    // res.send("delete success");
    res.redirect("/posts");
})

app.listen(port,()=>{
    console.log("Listening to to port 8080");
});
