/**
 * Middleware extracting and attaching access token from headers/cookies to request object.
 */
export const extractToken = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }
    req.token = token;
    next();
};
