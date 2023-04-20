
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use


const firebaseConfig = {
    apiKey: "AIzaSyAvVVoNZLawLC8gYPAcrwImQi7kasPhIHw",
    authDomain: "kodimon-app.firebaseapp.com",
    projectId: "kodimon-app",
    storageBucket: "kodimon-app.appspot.com",
    messagingSenderId: "702947348420",
    appId: "1:702947348420:web:b5e579a6e0588b30a39e91",
    measurementId: "G-XZYGZ5KSYC"
};


const app = initializeApp(firebaseConfig);
export const storage=getStorage(app);
if(!storage){
    console.log("nes")
}
export const db=getFirestore(app)
const analytics = getAnalytics(app);
/*try{

            const querySnapshot = await getDocs(pokemonCollection);
            const pokemonsData = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            })) as Pokemon[];
            console.log(pokemonsData)
            setPokemons(pokemonsData)

        }catch(err){
            console.error(err)
        }

        try{

            if (pokemons.length >= 2) {
                console.log("uslo if")
                let random1, random2;
                do {
                    random1 = Math.floor(Math.random() * pokemons.length);
                    random2 = Math.floor(Math.random() * pokemons.length);
                } while (random1 === random2);
                setPokemon1(pokemons[random1]);
                setPokemon2(pokemons[random2]);
            }
        }catch(err){
            console.error(err);
        }*/

/*try{
            setPokemons(pokemonList);
            if (pokemons.length >= 2) {
                console.log("uslo if ")
                let random1, random2;
                do {
                    random1 = Math.floor(Math.random() * pokemons.length);
                    random2 = Math.floor(Math.random() * pokemons.length);
                } while (random1 === random2);
                setPokemon1(pokemons[random1]);
                setPokemon2(pokemons[random2]);

            }
        }catch(err){
            console.log(err)
        }*/


/*setImageURL(setPokemon1IMG,imagesPath+pokemon1.url);
        setImageURL(setPokemon2IMG,imagesPath+pokemon2.url);
        if(pokemon1.speed>pokemon2.speed){
            console.log("turn1")
            setImageURL(setRightArrowIMG,photoURL.arrowRight);
            setPokemon1Turn(true);
        }
        if(pokemon2.speed>pokemon1.speed){
            console.log("turn2")
            setImageURL(setArrowIMG,photoURL.arrowLeft);
            setPokemon2Turn(true);
        }*/


