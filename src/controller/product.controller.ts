import {NextFunction, Request, Response} from "express";
import {CreateProductInput, DeleteProductInput, ReadProductInput, UpdateProductInput} from "../schema/product.schema";
import {
    createProduct,
    deleteProduct,
    findAndUpdateProduct,
    findProduct,
    getAllProduct
} from "../service/product.service";
import logger from "../utils/logger";

/**
 * @param req
 * @param res
 * @param next
 * create new  product controller
 */
export async function createProductHandler(
    req: Request<{}, {}, CreateProductInput["body"]>,
    res: Response
) {
    const userId = res.locals.user._id;

    const body = req.body;

    const product = await createProduct({ ...body, user: userId });

    return res.send(product);
}

/**
 * @param req
 * @param res
 * @param next
 * update product controller
 */
export async function updateProductHandler(req: Request<UpdateProductInput['params']>, res: Response, next: NextFunction) {

    // get product ID from params
    const productId = req.params.productId;

    // we need to fin the product
    const product = await findProduct({productId});

    // if the product does not exist then return 404 status

    if (!product) return res.sendStatus(404);

    return res.status(200).send(product);

}

/**
 * @param req
 * @param res
 * @param next
 * get product list controller
 */
export async function getProductHandler(
    req: Request<UpdateProductInput["params"]>,
    res: Response
) {
    const productId = req.params.productId;
    const product = await getAllProduct();

    if (!product) {
        return res.sendStatus(404);
    }

    return res.send(product);
}



/**
 * @param req
 * @param res
 * @param next
 * delete product controller
 */
export async function deleteProductHandler(req: Request<DeleteProductInput['params']>, res: Response, next: NextFunction) {
    const userId = res.locals.user._id;

    const productId = req.params.productId;

    const product = await findProduct({productId});

    if (!productId) return res.status(404);

    if (String(product?.user) !== userId) {
        return res.sendStatus(403);
    }

   await deleteProduct({productId});

    return res.sendStatus(200);
}