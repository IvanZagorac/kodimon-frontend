import Pokemon from "./Pokemon";

export default interface Battle{
    pokemon1:Pokemon;
    pokemon2:Pokemon;
    winner:Pokemon;
    logs:string[];
    userId:string;
    time:Date;

}