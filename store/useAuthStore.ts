import {create} from "zustand"

interface User { 
    username : string,
    email : string,
    profilePic : String
}

interface AuthState{
    user : User | null,
    token : string | null,
    login : (userData:User, jwt : string)=> void,
    logout : ()=> void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token : null,
    login : (userData,jwt)=> set({user:userData,token:jwt}),
    logout : ()=> set({user:null,token:null})
}));