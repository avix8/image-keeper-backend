import joi from "joi";

const id = joi.string().required();
const label = joi.string().required().max(100);

export default {
    setLabel: joi.object({ id, label }),
    id: joi.object({ id }),
};
