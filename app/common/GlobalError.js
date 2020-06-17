
class GlobalError extends Error {
    constructor (code, msg) {
        super(msg);
        this.code = code;
        this.message = msg;
    }
}

export default GlobalError;