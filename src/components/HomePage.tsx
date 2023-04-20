
import {
    Alert,
    Button,
    Card,
    Col,
    Container,
    Form,
    Modal,
    Row
} from "react-bootstrap";
import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {photoURL} from "../config/photoURL";
import {setImageURL} from "./images";
import axios from "axios";
import {config} from "../config/config";
import {useForm, useFormState} from 'react-hook-form';
import User from "../model/User";
import {z, ZodType} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {decodedToken, tokenExist} from "../config/token";

type FormData={
    email:string;
    password:string;
    repeatPassword:string;
    fullName:string;
    username:string
}

function HomePage (){
    const[kodimonNatpisURL,setKodimonNatpisURL]=useState<string>("");
    const[kodimonLogoURL,setKodimonLogoURL]=useState<string>("");
    const[isLogin,setIsLogin]=useState<boolean>(false);
    const[user,setUser]=useState<User>({
        username:"",
        password:"",
        _id:"",
        name:"",
        email:""
    });
    const[loginModal,setLoginModal]=useState<boolean>(false);
    const token=useRef<string>("");
    const expiresIn=useRef<Date>(new Date());
    const[loginUsername,setLoginUsername]=useState<string>("");
    const[loginPassword,setLoginPassword]=useState<string>("");
    const[email,setEmail]=useState<string>("");
    const[password,setPassword]=useState<string>("");
    const[repeatPassword,setRepeatPassword]=useState<string>("");
    const[name,setName]=useState<string>("");
    const[username,setUsername]=useState<string>("");
    const[message,setMessage]=useState<string>("");
    const[registerModal,setRegisterModal]=useState<boolean>(false);
    const navigate=useNavigate();
    const schema:ZodType<FormData>=z.object({
        email:z.string().email(),
        password:z.string().min(4).max(20),
        repeatPassword:z.string().min(4).max(20),
        fullName:z.string().min(6).max(30).refine((value) => value.split(" ").length > 1, {
        message: "Full name must contain forename and surname",
        }),
        username:z.string().min(4).max(20)

    }).refine((data)=>
        data.password===data.repeatPassword,{
            message:"Passwords do not match",
            path:["repeatPassword"]
        })
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        resolver:zodResolver(schema),
    });

    const navigateToBattle=()=>{
        navigate("battle")
    }

    const  navigateToHistory=()=>{
        navigate("history")
    }

    const handleRegisterModal=()=>{
        setRegisterModal(true)
    }

    const handleLoginModal=()=>{
        setLoginModal(true);
    }

    const doLogout=()=>{
        localStorage.removeItem('token');
        setIsLogin(false);
    }




    const doLogin=async()=>{
        await axios.post(config.pool+"auth",{
            username:loginUsername,
            password:loginPassword
        })
            .then((res:any)=>{
                if (res.data.status == 200){
                    setUser(res.data.user);
                    if (res.data.token) {
                        token.current = res.data.token;
                        localStorage.setItem('token', token.current);
                        setTimeout(() => {
                            localStorage.removeItem('token');
                        }, 40 * 60 * 1000);
                    }
                    setIsLogin(true)
                    setLoginModal(false);
                    setLoginUsername("");
                    setLoginPassword("");
                    setMessage("");

                } else {
                    if (res.data.description) {
                        setMessage(res.data.description);
                    }
                }
            })
    }

    const doRegistration=async(data:FormData)=>{
        console.log(data)
        await axios.post(config.pool+"auth/register",{
            email:data.email,
            password:data.password,
            name:data.fullName,
            username:data.username
        })
            .then((res:any)=>{
                if(res){
                    if(res.data.token){
                        console.log(res.data.token)
                        token.current = res.data.token;
                        localStorage.setItem('token', token.current);
                        setTimeout(() => {
                            localStorage.removeItem('token');
                        }, 40 * 60 * 1000);
                    }
                    setIsLogin(true)
                    setRegisterModal(false)
                    setName("");
                    setUsername("");
                    setEmail("");
                    setPassword("");

                }else {
                    setMessage("Wrong credentials");

                }
            })

    }

    useEffect(()=>{
        setImageURL(setKodimonNatpisURL,photoURL.kodimonNatpis)
        setImageURL(setKodimonLogoURL,photoURL.kodiLogo)
        tokenExist(setIsLogin);
        console.log(token.current)

        if(decodedToken()){
            console.log(decodedToken().exp)
        }

    },[])




    return(
        <Container className="cont">
            <div className="welcomeIns">
                {isLogin ? (
                    <h2>Hi {decodedToken().username}.Welcome to the pokemon battle game</h2>
                ) : (
                    <h2>You need to login or register if you don't have your own account to have a battle</h2>
                )}

            </div>
            <img className="kodimonNatpis" src={kodimonNatpisURL}/>
            <img className="kodimonLogo" src={kodimonLogoURL}/>
            {isLogin ? (
                <>
                    <Button className="newGameBtn" onClick={navigateToBattle}>New Game</Button>
                    <Button className="historyBtn" onClick={navigateToHistory}>History</Button>
                    <Button className="logout" onClick={doLogout}>Logout</Button>
                </>
            ) : (
                <>
                    <Button className="newGameBtn" onClick={handleLoginModal}>Login</Button>
                    <Button className="historyBtn" onClick={handleRegisterModal}>Register</Button>
                </>
            )}
            <Modal
                centered
                show={registerModal}
                onHide={() => setRegisterModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>User Register</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(doRegistration)}>
                        <Col lg="8" md="8" sm="12">
                            <Form.Group>
                                <Form.Label htmlFor="email"> E-mail:</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Email"
                                    id="email"
                                    {...register("email", {
                                    })}
                                    value={email}
                                    onChange={event=>{
                                        setEmail(event.target.value);
                                    }
                                }
                                />
                                {errors.email && (
                                <span className="error">{errors.email.message}</span>
                                )}
                            </Form.Group>
                        </Col>

                        <Col lg="8" md="8" sm="12">
                            <Form.Group>
                                <Form.Label htmlFor="password">Password</Form.Label>
                                <Form.Control
                                    id="password"
                                    {...register("password", {
                                    })}
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={event=>
                                    {setPassword(event.target.value)
                                    }}

                                />
                                {errors.password && (
                                    <span className="error">{errors.password.message}</span>
                                )}
                            </Form.Group>
                        </Col>

                        <Col lg="8" md="8" sm="12">
                            <Form.Group>
                                <Form.Label htmlFor="repeatPassword">Repeat password</Form.Label>
                                <Form.Control
                                    id="repeatPassword"
                                        {...register("repeatPassword", {
                                        required: true,
                                        pattern: /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z\d]{8,}$/
                                    })}
                                    type="password"
                                    placeholder="Password"
                                    value={repeatPassword}
                                    onChange={event=>
                                    {setRepeatPassword(event.target.value)
                                    }}

                                />
                                {errors.repeatPassword && (
                                    <span className="error">{errors.repeatPassword.message}</span>
                                )}

                            </Form.Group>
                        </Col>


                        <Col md="8">
                            <Form.Group>
                                <Form.Label htmlFor="fullName">Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Name"
                                    id="fullName"
                                    {...register("fullName", {
                                        required: true,
                                        pattern: /^[a-zA-Z]+ [a-zA-Z]+$/
                                    })}
                                    value={name}
                                    onChange={event=>{
                                        setName(event.target.value)
                                    }}

                                />
                                {errors.fullName && (
                                <span className="error">{errors.fullName.message}</span>
                            )}

                            </Form.Group>
                        </Col>
                        <Col md="8">
                            <Form.Group>
                                <Form.Label htmlFor="username">Username</Form.Label>
                                <Form.Control
                                    id="username"
                                    {...register("username", {
                                    required: true,
                                    minLength: 4
                                    })}
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={event=>{
                                        setUsername(event.target.value)
                                    }}

                                />
                                 {errors.username && (
                                <span className="error">{errors.username.message}</span>
                                )}

                            </Form.Group>
                        </Col>
                        <Col md="6">
                    <Form.Group>
                        <Form.Control className="submitBtn" type="submit"/>
                    </Form.Group>
                        </Col>

                </Form>
                </Modal.Body>

            </Modal>

            <Modal
                centered
                show={loginModal}
                onHide={() => setLoginModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>User Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                            <Col lg="6" md="6" sm="12">
                                <Form.Group>
                                    <Form.Label htmlFor="username">Username:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Username"
                                        id="username"
                                        value={loginUsername}
                                        onChange={event=>setLoginUsername(event.target.value)}
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg="6" md="6" sm="12">
                                <Form.Group>
                                    <Form.Label htmlFor="password">Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        id="password"
                                        value={loginPassword}
                                        onChange={event=>setLoginPassword(event.target.value)}

                                    />
                                </Form.Group>
                            </Col>

                        <Form.Group>
                            <Button className="registerBtn" onClick={()=>doLogin()} variant="primary">Login</Button>
                        </Form.Group>

                    </Form>
                    <Alert variant="danger" className={message ? '' : 'd-none'}>{message}</Alert>
                </Modal.Body>

            </Modal>
        </Container>

    )

}

export default HomePage;
