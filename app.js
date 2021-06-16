const history = require('connect-history-api-fallback')
const bodyParser = require('body-parser')
const session = require('cookie-session')
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const sha1 = require('sha1')
const salt = "JypOZT7Gmc"

const app = express()

app.use(
	session({
		name: 'session',
		keys: ['sdgrfdvddasq4t3e', 'hk4o5hgnewlkdvnfdhbi'],
		cookie: {
			secure: true,
			expires: 36000
		},
	}),
)

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const User = mongoose.model('User', new mongoose.Schema({
	email: {
		type: String,
		unique: true,
	},
	password: String,
	isAdmin: { type: Boolean, default: false }
}))
const Post = mongoose.model('Post', new mongoose.Schema({
	content: String,
	title: String
}))

app.get('/user', async (req, res) => {
	if (req.session.userid) {
		const user = await User.findById(req.session.userid).catch(() => { return false })

		if (user) {
			res.status(200).send({
				email: user.email,
				isAdmin: user.isAdmin
			})
			return
		}
	}
	res.sendStatus(401)
})
app.post("/user/register", async (req, res) => {
	const newUser = new User({
		email: req.body.email.toLowerCase(),
		password: sha1(salt + req.body.password + salt)
	})

	const result = await newUser.save().catch(() => { return false })
	if (result) {
		req.session.userid = result._id
		res.status(200).send(result.email)
		return
	}
	res.sendStatus(400)
})
app.post("/user/login", async (req, res) => {
	const result = await User.findOne({
		email: req.body.email.toLowerCase(),
		password: sha1(salt + req.body.password + salt)
	}).catch(() => { return false })

	if (result) {
		req.session.userid = result._id
		res.status(200).send({
			email: result.email,
			isAdmin: result.isAdmin
		})
		return
	}
	res.sendStatus(400)
})
app.post("/user/logout", (req, res) => {
	req.session.userid = false
	res.sendStatus(200)
})

app.get("/news/list", async (req, res) => {
	res.status(200).send(await Post.find().catch(() => { return false }))
})

app.post("/news/admin/delete", async (req, res) => {
	if (!(await User.findById(req.session.userid))?.isAdmin) {
		res.sendStatus(401)
		return false
	}
	if (!req.body.postID) {
		res.sendStatus(400)
		return
	}

	await Post.findByIdAndRemove(req.body.postID)
	res.sendStatus(200)
})
app.post("/news/admin/create", async (req, res) => {
	if (!(await User.findById(req.session.userid))?.isAdmin) {
		res.sendStatus(401)
		return false
	}
	if (!req.body.content || !req.body.title) { res.sendStatus(400); return }

	await new Post({
		content: req.body.content,
		title: req.body.title,
		date: new Date(),
	}).save()

	res.sendStatus(200)
})

process.openStdin().addListener("data", async function (d) {
	const cmdPattern = /\/(?<cmd>\w+) (?<args>.*)/ig
	const { cmd, args } = cmdPattern.exec(d.toString())?.groups || {}

	if (!cmd) {
		console.log("Forgot about slash '/' ?")
		return
	}

	if (cmd == "addadmin") {
		const result = await User.updateOne({
			email: args,
		}, {
			isAdmin: true
		})

		if (result.ok) {
			console.log(`> ${args} добавлен в группу админов`)
		} else {
			console.log("> Invalid email")
		}
	} else if (cmd == "deladmin") {
		const result = await User.updateOne({
			email: args,
			isAdmin: true
		}, {
			isAdmin: false
		})

		if (result.ok) {
			console.log(`> ${args} удалён из админ группы`)
		} else {
			console.log("> Invalid email")
		}
	} else {
		console.log("> Unknown command;\n> Command list: /addadmin, /deladmin")
	}
});

app.use(history())
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/dist/index.html')
})

mongoose
	.connect('mongodb+srv://ROBODEVIL:0960325557BigD@cluster0.otypb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.then(() => {
		app.listen(5000)
	})
