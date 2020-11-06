import axios from "axios";

export const HOST = "http://localhost:8002";

export const TIME= async ()=>{
    return(await axios.get(HOST+"/config"));
}
