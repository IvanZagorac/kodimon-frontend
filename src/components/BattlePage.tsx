
import {Button, Card, Col, Container, Modal, ModalBody, ModalHeader, ModalTitle, Row} from "react-bootstrap";
import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {setImageURL} from "./images";
import { imagesPath, photoURL} from "../config/photoURL";
import Pokemon from "../model/Pokemon";
import {config} from "../config/config";
import Axios from "axios";
import { motion} from "framer-motion";
import PokemonHealth from "./PokemonHealth";
import Battle from "../model/Battle";
import {decodedToken, tokenExist} from "../config/token";

function BattlePage (){
    const pokemon1Ref = useRef<Pokemon>({
        _id:"",
        name:"",
        url:"",
        defense:0,
        speed:0,
        attack:0,
        hp:0,
    });
    const pokemon2Ref = useRef<Pokemon>({
        _id:"",
        name:"",
        url:"",
        defense:0,
        speed:0,
        attack:0,
        hp:0,
    });

    const[misOrMessage1,setMisOrMessage1]=useState<string>("");
    const[misOrMessage2,setMisOrMessage2]=useState<string>("");
    const[leftArrowIMG,setLeftArrowIMG]=useState<string>("");
    const[rightArrowIMG,setRightArrowIMG]=useState<string>("");
    const logs=useRef<string[]>([]);
    const[pokemon1Turn,setPokemon1Turn]=useState<boolean>(false);
    const[isAttacking,setIsAttacking]=useState<boolean>(false);
    const[move1,setMove1]=useState<boolean>(false);
    const[move2,setMove2]=useState<boolean>(false);
    const[pokemon2Turn,setPokemon2Turn]=useState<boolean>(false);
    const pokemon1Win=useRef<boolean>(false);
    const pokemon2Win=useRef<boolean>(false);
    const[winModalVisible,setWinModalVisible]=useState<boolean>(false);
    const[variablePokemon1HP,setVariablePokemon1HP]=useState<number>(pokemon1Ref.current.hp);
    const[variablePokemon2HP,setVariablePokemon2HP]=useState<number>(pokemon2Ref.current.hp)
    const[pokemon1IMG,setPokemon1IMG]=useState<string>("");
    const[pokemon2IMG,setPokemon2IMG]=useState<string>("");
    const[isLogin,setIsLogin]=useState(false);
    const navigate=useNavigate();

    const navigateToHome=()=>{
        navigate("/")
    }

    const navigateToBattle=()=>{
        window.location.reload();
    }

    const navigateToNewOpponent=()=>{
        navigate("/newOpponent");
    }
    const  navigateToHistory=()=>{
        navigate("/history")
    }

    const logicForAttack=async()=>{
        if(pokemon1Turn){
            setMove1(true);
            setMisOrMessage2("")
            let attack = pokemon1Ref.current.attack / 2;
            let attackDamage=(attack*pokemon2Ref.current.defense) /100;
            attackDamage=attack-attackDamage;
            attackDamage = attackDamage < 0 ? 0 : attackDamage; // zaštita od negativne vrijednosti
            setMisOrMessage1(`${attackDamage} DMG!`)
            const missChance = 20;
            const hitChance = Math.floor(Math.random() * 100);

            if (hitChance < missChance) {
                addLog(`${pokemon1Ref.current.name} missed ${pokemon2Ref.current.name}`);
                setMove1(false);
                setMisOrMessage1("MISS!")
                setPokemon2Turn(true);
                setPokemon1Turn(false);
                return;
            }

            const updatedPokemon2 = {
                ...pokemon2Ref.current,
                hp:pokemon2Ref.current.hp<0 ? 0 : (pokemon2Ref.current.hp -= attackDamage).toFixed(2),
            };
            addLog(`${pokemon1Ref.current.name} attacked ${pokemon2Ref.current.name} for ${attackDamage} DMG`)

            await Axios.patch(config.pool+"pokemon/attack/"+pokemon2Ref.current._id, updatedPokemon2)
                .then((res)=>{
                    //setVariablePokemon2HP(res.data.hp);
                    setPokemon2Turn(true);
                    setPokemon1Turn(false);
                })

            setMove1(false);
        }else{
            setMove2(true);
            setMisOrMessage1("");
            let attack = pokemon2Ref.current.attack / 2;
            let attackDamage=(attack*pokemon1Ref.current.defense) /100;
            attackDamage=attack-attackDamage;
            attackDamage = attackDamage < 0 ? 0 : attackDamage; // zaštita od negativne vrijednosti
            setMisOrMessage2(`${attackDamage} DMG!`)
            const missChance = 20;
            const hitChance = Math.floor(Math.random() * 100);

            if (hitChance < missChance) {
                addLog(`${pokemon2Ref.current.name} missed ${pokemon1Ref.current.name}`);
                setMove2(false);
                setMisOrMessage2("MISS!")
                setPokemon1Turn(true);
                setPokemon2Turn(false);
                return;
            }

            const updatedPokemon = {
                ...pokemon1Ref.current,
                hp:pokemon1Ref.current.hp<0?0 :(pokemon1Ref.current.hp -= attackDamage).toFixed(2),
            };

            addLog(`${pokemon2Ref.current.name} attacked ${pokemon1Ref.current.name} for ${attackDamage} DMG`)


            await Axios.patch(config.pool+"pokemon/attack/"+pokemon1Ref.current._id, updatedPokemon)
                .then((res)=>{
                    //setVariablePokemon1HP(res.data.hp);
                    setPokemon1Turn(true);
                    setPokemon2Turn(false);
                })

            setMove2(false);
        }
    }

    const doLogout=()=>{
        localStorage.removeItem('token');
        setIsLogin(false);
        navigate("/");
    }


    const addLog = (message:string) => {
        //setLogs([...logs, message]);
        logs.current=[...logs.current,message]
    };

    const whenPokemonDied=async()=>{

        if(pokemon1Ref.current.hp<=0||pokemon2Ref.current.hp<=0){
            setMisOrMessage1("");
            setMisOrMessage2("")
            if(pokemon1Ref.current.hp<=0){
                pokemon2Win.current=true;
                addLog(`${pokemon1Ref.current.name} died`);
                pokemon1Ref.current.hp=0;
                const updatedPokemon1 = {
                    hp: pokemon1Ref.current.hp,
                }
                console.log(updatedPokemon1)
                await Axios.patch(config.pool+"pokemon/attack/"+pokemon1Ref.current._id, updatedPokemon1)
                //updatePokemon(pokemon1Ref.current._id, updatedPokemon1);

            }else{
                pokemon1Win.current=true;
                addLog(`${pokemon2Ref.current.name} died `);
                pokemon2Ref.current.hp=0;
                const updatedPokemon2 = {
                    hp: pokemon2Ref.current.hp,
                };
                console.log(updatedPokemon2)
                await Axios.patch(config.pool+"pokemon/attack/"+pokemon2Ref.current._id, updatedPokemon2)
                //updatePokemon(pokemon2Ref.current._id, updatedPokemon2);
            }

            setTimeout(() => {
                pokemon1Ref.current.hp=variablePokemon1HP;
                pokemon2Ref.current.hp=variablePokemon2HP;
                const updatedPokemon1 = {
                    hp: variablePokemon1HP,
                };
                const updatedPokemon2 = {
                    hp: variablePokemon2HP,
                };
                Axios.patch(config.pool+"pokemon/attack/"+pokemon1Ref.current._id, updatedPokemon1)
                Axios.patch(config.pool+"pokemon/attack/"+pokemon2Ref.current._id, updatedPokemon2)
            }, 3000);

            let winner:Pokemon={
                _id:"",
                name:"",
                url:"",
                defense:0,
                speed:0,
                attack:0,
                hp:0,
            };

            if(pokemon1Win.current){
                winner=pokemon1Ref.current;
            }
            if(pokemon2Win.current){
                winner=pokemon2Ref.current
            }

            let userId=decodedToken()._id;

            const battle:Battle={
                pokemon1:pokemon1Ref.current,
                pokemon2:pokemon2Ref.current,
                logs:logs.current,
                winner:winner,
                userId:userId,
                time:new Date()

            }

            await Axios.post(config.pool+"battle", battle)
                .then((res)=>{
                    console.log(res.data)
                })
            setWinModalVisible(true);

        }

    }

     const getPokemon1Pokemon2=async ()=>{
        const cancelToken=Axios.CancelToken;
          await Axios.get(config.pool+"pokemon/both",{cancelToken:cancelToken.source().token})
             .then((res:any)=>{
                 pokemon1Ref.current=res.data[0];
                 pokemon2Ref.current=res.data[1];
                 setImageURL(setPokemon1IMG,imagesPath+res.data[0].url);
                 setImageURL(setPokemon2IMG,imagesPath+res.data[1].url);
                 setImageURL(setRightArrowIMG,photoURL.arrowRight);
                 setImageURL(setLeftArrowIMG,photoURL.arrowLeft);
                 setVariablePokemon1HP(pokemon1Ref.current.hp);
                 setVariablePokemon2HP(pokemon2Ref.current.hp);
                 if(pokemon1Ref.current.speed>pokemon2Ref.current.speed){
                     setPokemon1Turn(true);
                     setPokemon2Turn(false);

                 }
                 if(pokemon2Ref.current.speed>pokemon1Ref.current.speed){
                     setPokemon2Turn(true);
                     setPokemon1Turn(false);
                 }


             }).catch(err=>{
                 if(Axios.isCancel(err)){
                     console.log("canceled")
                 }
              })

         return ()=>{
              cancelToken.source().cancel();
         }
     }

     const attackLogic=async()=>{
         setIsAttacking(true)
         setTimeout(() => {
             setIsAttacking(false)
         }, 1500)

        await logicForAttack()

        await whenPokemonDied()

     }

    useEffect(()=>{
        void getPokemon1Pokemon2();
        tokenExist(setIsLogin);

    },[])

    return(

            <Container className="cont">
                <Row>
                    <Col  className="flex-row height" lg="10" md="10" sm="8" xs="8">
                        <Row className="pokemoni">
                        <Col lg="5">
                            <Card className="mt-5">
                                <Card.Header className="dFlex">
                                    {PokemonHealth(pokemon1Ref.current.hp,variablePokemon1HP)}
                                </Card.Header>
                                <Card.Body className="dFlex">
                                        <motion.div
                                            initial={{x:0}}
                                            animate={{x:move1?[0,200,0] :0}}
                                            transition={{duration:1.5}}
                                        >
                                            <p className="message">{misOrMessage1}</p>
                                            <img className="pokemonIMG" src={pokemon1IMG} alt={pokemon1Ref.current.name}
                                            />
                                        </motion.div>

                                    <h2 className="hStyle">{pokemon1Ref.current.name}</h2>

                                </Card.Body>
                                <Card.Footer >
                                    <h3  className="text-center mb-4 statsStyle">STATS:</h3>
                                    <Row>
                                    <Col className="dFlex" lg="6" md="6" sm="6" xs="12">
                                        <p className="pStats">HP:{variablePokemon1HP}</p>
                                        <p className="pStats">Attack:{pokemon1Ref.current.attack}</p>
                                    </Col>

                                    <Col className="dFlex" lg="6" md="6" sm="6" xs="12">
                                        <p className="pStats">Defense:{pokemon1Ref.current.defense}</p>
                                        <p className="pStats">Speed:{pokemon1Ref.current.speed}</p>
                                    </Col>
                                    </Row>

                                </Card.Footer>
                            </Card>
                        </Col>
                        <Col lg="2" className="mt-5 dFlex">

                            <img src={pokemon1Turn? rightArrowIMG : leftArrowIMG} alt="arrowIMG"/>
                            <Button className="attackBTN " onClick={attackLogic} disabled={isAttacking}>Attack</Button>

                        </Col>

                        <Col lg="5" >
                            <Card className="mt-5">
                                <Card.Header className="dFlex">
                                    {PokemonHealth(pokemon2Ref.current.hp,variablePokemon2HP)}
                                </Card.Header>
                                <Card.Body className="dFlex">
                                        <motion.div
                                            initial={{x:0}}
                                            animate={{x:move2?[0,-200,0] :0}}
                                            transition={{ duration:1.5}}
                                        >
                                            <p className="message">{misOrMessage2}</p>
                                            <img className="pokemonIMG" src={pokemon2IMG}/>
                                        </motion.div>

                                    <h2  className="hStyle">{pokemon2Ref.current.name}</h2>

                                </Card.Body>
                                <Card.Footer >
                                    <h3 className="text-center mb-4 statsStyle">STATS:</h3>
                                    <Row>
                                        <Col className="dFlex" lg="6" md="6" sm="6" xs="12">
                                            <p>HP:{variablePokemon2HP}</p>
                                            <p>Attack:{pokemon2Ref.current.attack}</p>
                                        </Col>

                                        <Col className="dFlex" lg="6" md="6" sm="6" xs="12">
                                            <p>Defense:{pokemon2Ref.current.defense}</p>
                                            <p>Speed:{pokemon2Ref.current.speed}</p>
                                        </Col>
                                    </Row>

                                </Card.Footer>
                            </Card>
                        </Col>
                        </Row>
                        <Row className="logs">
                            <Col className="flex-row" lg="12" md="12" sm="12" xs="12">
                                <Card>
                                    <Card.Header>
                                        LOGS
                                    </Card.Header>
                                    <Card.Body>

                                        <ul >
                                            {logs.current.map((message,index)=>(
                                                <li key={index} >
                                                    {message}
                                                </li>
                                            ))
                                            }
                                        </ul>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>

                    <Col lg="2" md="2" sm="4" xs="4" className="meni ">
                        <div className="meniDiv" >
                            <Button className="meniBtn1" onClick={navigateToHome}>Home</Button>
                            <Button className="meniBtn2" onClick={navigateToBattle}>New Game</Button>
                            <Button className="meniBtn2" onClick={navigateToHistory}>History</Button>
                            {isLogin ? (
                                <>
                                    <Button className="meniBtn2" onClick={doLogout}>Logout</Button>
                                </>
                            ) : ""}

                        </div>
                    </Col>
                </Row>


                <Modal
                    dialogClassName="modal-90w"
                    centered
                    show={winModalVisible}
                    >
                    <ModalHeader className="textCenter" >
                        <ModalTitle className="textCenter" >{pokemon1Win.current===true ? `${pokemon1Ref.current.name} won!` : `${pokemon2Ref.current.name} won!`}</ModalTitle>
                    </ModalHeader>
                    <ModalBody className="modalMeni">
                        <div className="modalMeniDiv" >
                            <Button className="meniBtn1" onClick={navigateToHome}>Home</Button>
                            <Button className="meniBtn2" onClick={navigateToBattle}>New Game</Button>
                            <Button className="meniBtn2" onClick={navigateToNewOpponent}>New Opponent</Button>
                        </div>
                    </ModalBody>
                </Modal>
            </Container>

    )

}


export default BattlePage;