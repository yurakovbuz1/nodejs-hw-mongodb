function ctrlWrapper(controller) {
    return async (req, res, next) => {
        try {
            await controller(req, res, next);
        } catch (error) {
            console.error(error);                   // use next(createHttpError)
        }
    };
}

export { ctrlWrapper };
