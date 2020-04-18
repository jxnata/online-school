const jwt = require('jsonwebtoken');
auth_config = require('../../config/auth.json');

module.exports = (req, res, next)=>{
    const auth_header = req.headers.authorization;
    if (!auth_header)
        return res.status(401).send({error: "Token não informado!"});
    
    const parts = auth_header.split(' ');
    
    if (!parts.length === 2 )
        return res.status(401).send({error: "Erro no Token!"});
    
    const [schema, token] = parts;

    if (!/^Bearer$/i.test(schema))
        return res.status(401).send({error: "Token invalido!"});

    jwt.verify(token, auth_config.secret, (err, decoded) => {
        if (err) return res.status(401).send({ error: "Token invalido!", data: err });
    
    
        req.user_id = decoded.id;
        req.type = decoded.type;

        return next();

    });
};
