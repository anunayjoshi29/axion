module.exports = ({ meta, config, managers }) => {
    return ({ req, res, next }) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('token required but not found');
            return managers.responseDispatcher.dispatch(res, { ok: false, code: 401, errors: 'unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        let decoded = null;
        try {
            decoded = managers.token.verifyShortToken({ token });
            if (!decoded) {
                console.log('failed to decode-1');
                return managers.responseDispatcher.dispatch(res, { ok: false, code: 401, errors: 'unauthorized' });
            }
        } catch (err) {
            console.log('failed to decode-2');
            return managers.responseDispatcher.dispatch(res, { ok: false, code: 401, errors: 'unauthorized' });
        }
        next(decoded);
    };
};