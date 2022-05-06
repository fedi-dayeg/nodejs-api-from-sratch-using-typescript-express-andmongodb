import ProductModel, {ProductDocument} from "../models/product.model";
import {DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery} from "mongoose";
import {omit} from "lodash";
import UserModel from "../models/user.model";
import {ZodNumber, ZodString} from "zod";
/**
 * @param input
 * service for create new product
 */
export async function createProduct(
    input: { image: ZodString["_output"]; price: ZodNumber["_output"]; description: ZodString["_output"]; title: ZodString["_output"]; user: any }
) {
    try {
        return ProductModel.create(input);
    } catch (e: any) {
        throw new Error(e)
    }

}

/**
 * @param query
 * @param options
 * service for find product
 */
export async function findProduct(query: FilterQuery<ProductDocument>, options: QueryOptions = {lean: true}) {
     return ProductModel.findOne(query, {}, options);
}

export async function getAllProduct(){
    return ProductModel.find();
}

/**
 * @param queru
 * @param update
 * @param options
 * service for find and update a product
 */
export async function findAndUpdateProduct(queru: FilterQuery<ProductDocument>, update: UpdateQuery<ProductDocument>, options: QueryOptions) {
     return ProductModel.findOneAndUpdate(queru, update,options);
}

/**
 * @param query
 * service for delete product
 */
export async function deleteProduct(query: FilterQuery<ProductDocument>) {
     return ProductModel.deleteOne(query);
}