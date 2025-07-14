export type RegisterUserBody = {
    email: string;
    firstname: string;  
    lastname: string;
    password: string; 
}

export type LoginUserBody = {
    email: string;
    password: string; 
}