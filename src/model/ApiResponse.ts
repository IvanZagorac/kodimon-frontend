import User from "./User";

export default interface ApiResponse{
    status:number;
    user:User;
    token:string;

}