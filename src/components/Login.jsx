import { useState, useEffect } from "react"
import { useAuth } from "./AppContentext"
import { useNavigate } from "react-router-dom"
import bcrypt from "bcryptjs"
import Main from "./Main"
import { doc, collection, getDocs, updateDoc } from "firebase/firestore"
import { signInWithEmailAndPassword } from "firebase/auth"
import { db, auth } from "../firebase"
import "../css/Login.css"
import Error from "./ErrorPage"
const Login = () => {
	const navigate = useNavigate()
	const { setSigned } = useAuth()
	const [loginFormData, setLoginFormData] = useState({
		username: "",
		password: "",
	})

	const [docId, setDocId] = useState(0)
	const [loggedIn, setLoggedIn] = useState(false)
	const [error, setError] = useState("")
	const [users, setUsers] = useState([])
	const userRef = collection(db, "Users")

	const getUsers = async () => {
		try {
			const querySnapshot = await getDocs(userRef)
			querySnapshot.forEach((doc) => {
				console.log(doc.id, " => ", doc.data())
				setUsers(doc.data())
				setDocId(doc.id)
			})
		} catch (error) {
			console.error("Error fetching data: ", error)
			setError("Failed to retrieve records, ", error)
		}
	}

	console.log(`Api key: ${import.meta.env.VITE_JRLA_MOTO_API_KEY}`)
	useEffect(() => {
		getUsers()
	},[])

	/*
	function credentials(loginFormData) {
		const saltRounds = 10
		const { username, password } = loginFormData
		let unameValidate = false

		if (
			(username.includes(".com") || username.includes(".fi")) &&
			username.includes("@")
		) {
			unameValidate = true
		}

		const storedHash = localStorage.getItem("hash")

		bcrypt.compare(password, users.hash, function (err, result) {
			setSigned(result)

			if (result) {
				setLoggedIn(result)
				localStorage.setItem("loggedIn", true)
				localStorage.setItem("username", username)
				localStorage.setItem("firsname", users.firstname)
				const updateUserRef = doc(db, "Users", docId)
				updateDoc(updateUserRef, {
					loggedIn: true,
				})
			}

			if (!result) {
				const updateUserRef = doc(db, "Users", docId)
				updateDoc(updateUserRef, {
					loggedIn: false,
				})

				throw {
					message: "The password validation failed",
					statusText: "Invalid password",
					status: 403,
				}
			}
		})
	}
*/
	const handleSubmit = async (e) => {
		e.preventDefault()
		await signInWithEmailAndPassword(
			auth,
			loginFormData.username,
			loginFormData.password
		)
			.then((userCredential) => {
				const user = userCredential.user
				console.log("User", user)
				setSigned(true)
				navigate("/")
			})
			.catch((error) => {
				const errorCode = error.code
				const errorMessage = error.message
				console.log(errorCode, errorMessage)
			})
	}

	function handleChange(e) {
		const { name, value } = e.target
		setLoginFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	return (
		<div>
			{error && <Error />}
			{!loggedIn && (
				<div className="login-container">
					<form
						onSubmit={handleSubmit}
						className="login-form"
					>
						<input
							name="username"
							onChange={handleChange}
							type="email"
							placeholder="Sähköposti - käyttäjätunnuksena"
							value={loginFormData.username}
						/>
						<input
							name="password"
							onChange={handleChange}
							type="password"
							placeholder="Salasana"
							value={loginFormData.password}
						/>
						<button>Kirjaudu</button>
					</form>
				</div>
			)}
			{loggedIn && <Main />}
		</div>
	)
}

export default Login
