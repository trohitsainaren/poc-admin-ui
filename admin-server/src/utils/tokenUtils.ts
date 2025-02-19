import { Request } from 'express';



export function GetProfileTokenFromRequest(req: Request): string {
  let profileToken = req.headers['x-lacp-profile'];
  if (Array.isArray(profileToken)) {
    profileToken = profileToken[0];
  }
  return typeof profileToken === 'string' ? profileToken.replace(/=/g, '') : '';
}

export function GetProfileTokenNoChange(req: Request): string {
  let profileToken = req.headers['x-lacp-profile'];
  if (Array.isArray(profileToken)) {
    profileToken = profileToken[0];
  }
  return typeof profileToken === 'string' ? profileToken : '';
}

export function GetSecureTokenFromRequest(req: Request): string {
  let secureToken = req.headers['x-lacp-secure'];
  if (Array.isArray(secureToken)) {
    secureToken = secureToken[0];
  }
  return typeof secureToken === 'string' ? secureToken : '';
}





export function ProcessTokenToNextRequest(req: Request) {
  let profileToken = GetProfileTokenNoChange(req);
  if (typeof profileToken === 'string') {
    req.headers['x-lacp-profile'] = profileToken;
  }
}


