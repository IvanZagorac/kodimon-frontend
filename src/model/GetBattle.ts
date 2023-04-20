import Pokemon from "./Pokemon";

export default interface GetBattle{
    _id:string;
    pokemon1:Pokemon;
    pokemon2:Pokemon;
    winner:Pokemon;
    logs:string[];
    userId:string;
    time:Date;

}