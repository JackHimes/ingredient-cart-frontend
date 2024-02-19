export interface KrogerAccessJwt {
    aud: string;        // Audience
    exp: number;        // Expiration Time (Unix timestamp)
    iat: number;        // Issued At (Unix timestamp)
    iss: string;        // Issuer
    sub: string;        // Subject
    scope: string;      // Scope
    authAt: number;     // Authentication Time (Unix timestamp with nanoseconds)
    pfcx: string;       // Custom Claim (pfcx)
    azp: string;        // Authorized Party
  }