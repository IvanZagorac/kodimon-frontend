
import {Button, Col, Container, Modal, Row, Table} from "react-bootstrap";
import React, {useEffect, useRef, useState,} from "react";
import {useNavigate} from "react-router-dom";
import GetBattle from "../model/GetBattle";
import Axios from "axios";
import {config} from "../config/config";
import {decodedToken, tokenExist} from "../config/token";


function HistoryBattlePage (){
    const[selectedBattles,setSelectedBattle]=useState<GetBattle | undefined>(undefined);
    const[battles,setBattles]=useState<GetBattle[]>([])
    const[loggedInUserId,setLoggedInUserId]=useState<string>("");
    const[isLogin,setIsLogin]=useState(false);
    const navigate=useNavigate();



    const navigateToBattle=()=>{
        navigate("/battle")
    }
    const navigateToHome=()=>{
        navigate("/")
    }

    const doLogout=()=>{
        localStorage.removeItem('token');
        setIsLogin(false);
        navigate("/");
    }

    const handleBattleClick = (battleId:string) => {
        const battle:GetBattle |undefined = battles.find((b:GetBattle) => b._id === battleId);
        setSelectedBattle(battle);
    };

    const getAllBattles=async()=>{
        await Axios.get(config.pool+"battle")
            .then((res)=>{
                setBattles(res.data)
            })
    }

    const deleteBattle=(id:string)=>{
        Axios.delete(config.pool+"battle/"+id)
            .then((res)=>{
                console.log(res)
            })
        void getAllBattles();
    }


    useEffect(()=>{
        void getAllBattles();
        tokenExist(setIsLogin)
        setLoggedInUserId(decodedToken()._id);
        console.log(loggedInUserId)

    },[])

    return(
        <Container className="cont">
            <Row className="w-100">
                <Col  className="flex-row height col-12 col-lg-10 col-sm-8" >
                    <div className="table-responsive">
                    <Table className="table" hover   bordered style={{ overflowX: 'auto',minWidth: '500px' }}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Pokemon1</th>
                            <th>Pokemon2</th>
                            <th>Logs</th>
                            <th>Winner</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            battles.map((battle) => {
                                if (battle.userId === loggedInUserId) {

                                    return (
                                        <tr>
                                            <td className="text-right">{battle._id}</td>
                                            <td className="text-right">{battle.pokemon1.name}</td>
                                            <td className="text-right">{battle.pokemon2.name}</td>
                                            <td className="text-right">
                                                <Button onClick={() => handleBattleClick(battle._id)}>
                                                    View Logs
                                                </Button>
                                            </td>
                                            <td className="text-right">{battle.winner.name}</td>
                                            <td className="text-right"><button onClick={() => deleteBattle(battle._id)} className="btn btn-danger">X</button></td>
                                        </tr>
                                    );
                                } else {
                                    return null;
                                }
                            })
                        }

                        </tbody>
                    </Table>
                    </div>
                        <Modal
                            centered
                            show={selectedBattles !==undefined}
                            onHide={() => setSelectedBattle(undefined)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Battle Logs</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <ul >
                                    {selectedBattles?.logs.map((message,index)=>(
                                        <li key={index} >
                                            {message}
                                        </li>
                                    ))
                                    }
                                </ul>
                            </Modal.Body>

                        </Modal>

                </Col>

                <Col lg="2"  sm="4"  className="meni ">
                    <div className="meniDivv" >
                        <Button className="meniBtn1" onClick={navigateToHome}>Home</Button>
                        <Button className="meniBtn2" onClick={navigateToBattle}>New Game</Button>
                        {isLogin ? (
                            <>
                                <Button className="meniBtn2" onClick={doLogout}>Logout</Button>
                            </>
                        ) : ""}

                    </div>
                </Col>
            </Row>
        </Container>

    )

}

export default HistoryBattlePage;
