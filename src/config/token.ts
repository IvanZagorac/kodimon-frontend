import jwtDecode from "jwt-decode";

export function decodedToken(){
    const token:string | null  = localStorage.getItem('token');
    let decodedToken:any;
    if(token!==null){
        decodedToken = jwtDecode(token);
    }

    return decodedToken;

}

export function tokenExist(setIsLogin:any){
    let token=localStorage.getItem("token");
    if(token){
        setIsLogin(true)
    }else{
        setIsLogin(false);
    }
}


