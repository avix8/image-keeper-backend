import joi from "joi";

const id = joi.string().required().hex().length(24);
const label = joi.string().required().max(100);

export default {
    setLabel: joi.object({ id, label }),
    id: joi.object({ id }),
};
