import jwt from "jsonwebtoken";

export function sign(payload:any, secret:string, exp="12h"){ 
  return jwt.sign(payload, secret, { expiresIn: exp }); 
}

export function verify(token:string, secret:string){ 
  return jwt.verify(token, secret); 
}

