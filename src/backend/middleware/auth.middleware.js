import jwt from 'jsonwebtoken';

const isSuperAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // console.log('authHeader : ', authHeader);

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "You are not authorized"
        });
    }

    const token = authHeader.split(" ")[1];
    // console.log('token : ', token);

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log('decode : ', decode.role);
        
        if(decode.role !== 'super admin') {
            return res.status(401).json({
                message: "You are not authorized"   
            });
        }
    } catch (error) {
        return res.status(401).json({
            message: "Error from middleware of authorization of By super admin's token"
        });
    }

    next();
};


export { isSuperAdmin };