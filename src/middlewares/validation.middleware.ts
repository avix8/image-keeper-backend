const validate = (property) => (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req[property]);
    if (error) {
        return res.status(400).json(error.details[0]);
    }
    req.body = value;
    next();
};

const validatePost = validate("body");
const validateGet = validate("params");

export { validatePost, validateGet };
