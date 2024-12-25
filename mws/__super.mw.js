module.exports = ({ meta, config, managers }) =>{
    return ({req, res, next, results})=>{
        const accessControl = results.__token.userKey;;
        if(accessControl !== "super"){
            return managers.responseDispatcher.dispatch(res, {ok: false, code:401, errors: 'unauthorized, you must be a super admin'});
        }
    
        next(accessControl);
    }
}