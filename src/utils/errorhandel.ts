export const asyerrohander = (func :any) => {
    return (req :any, res :any, next :any) => {
        func(req, res, next).catch((err:any) => {
            console.error("[error-caught]", err.message, "at", req.method, req.path);
            next(err)
        });
    }
}