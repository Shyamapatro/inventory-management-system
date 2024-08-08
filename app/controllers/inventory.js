const Inventory = require('../models/inventory.model');

const { ObjectId } = require("mongoose").Types;
/**
 * Adds a new item to the inventory.
 */
exports.addItem = async (req, res, next) => {
    try {
        const { name } = req.body;

        const existingItem = await Inventory.findOne({ name });

        if (existingItem) {
            return res.status(400).json({
                statusCode: 400,
                message: "Item with the same name already exists.",
            });
        }

        const newInventory = new Inventory(req.body);
        const savedInventory = await newInventory.save();

        return res.status(201).json({
            statusCode: 201,
            message: "data successfully added.",
            data: savedInventory,
        });
    } catch (error) {
        console.error("Error adding new data:", error);

        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

/**
 * Fetches the list of all items in the inventory.
 */
exports.getListOfItems = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        if (isNaN(page) || page < 1) {
            page = 1; 
        }

        if (isNaN(limit) || limit < 1) {
            limit = 10; 
        } else if (limit > 100) {
            limit = 100; 
        }
        const skip = (page - 1) * limit;
        const category = req.query.category;
        const filter = category ? { category } : {};
        
        const inventoryData = await Inventory.find(filter)
            .skip(skip)
            .limit(limit);

        const totalItems = await Inventory.countDocuments(filter);

        if (!inventoryData.length) {
            return res.status(404).json({
                statusCode: 404,
                message: "No inventory items found.",
                data: []
            });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Details successfully fetched.",
            data: inventoryData,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalItems / limit),
                totalItems: totalItems
            }
        });
    } catch (error) {
        console.error("Error fetching inventory data:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error.",
            error: error.message
        });
    }
};

/**
 * Fetche one item from the inventory.
 */
exports.getItemDetail = async (req, res, next) => {
    try {
        const { id } = req.query;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                statusCode: 400,
                message: "Invalid item ID."
            });
        }
        const inventoryData = await Inventory.findOne({ _id: id });
        return res.status(200).json({
            statusCode: 200,
            message: "Details successfully fetched.",
            data: inventoryData
        });
    } catch (error) {
        console.error("Error fetching inventory data:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error.",
            error: error.message
        });
    }
};
/**
 * Updates details of an existing item in the inventory.
 */
exports.updateItemDetail = async (req, res, next) => {
    try {
        const { id } = req.query;
        const { name, description, imageUrl, category, quantity } = req.body;

        // Check if the ID is valid
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                statusCode: 400,
                message: "Invalid item ID."
            });
        }

        const updateObj = {};
        if (name !== undefined) updateObj.name = name;
        if (description !== undefined) updateObj.description = description;
        if (imageUrl !== undefined) updateObj.imageUrl = imageUrl;
        if (category !== undefined) updateObj.category = category;
        if (quantity !== undefined) updateObj.quantity = quantity;

        // Check if there are fields to update
        if (Object.keys(updateObj).length === 0) {
            return res.status(400).json({
                statusCode: 400,
                message: 'No fields provided for update.'
            });
        }

        // Perform the update operation
        await Inventory.findByIdAndUpdate(id, { $set: updateObj });

        return res.status(200).json({
            statusCode: 200,
            message: "data successfully updated.",
        });
    } catch (error) {
        console.error("Error updating  data:", error);

        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error.",
            error: error.message
        });
    }
};
/**
 * Deletes an existing item from the inventory.
 */
exports.deleteItemDetail = async (req, res, next) => {
    try {
        const { id } = req.query;

        // Check if the ID is valid
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Invalid item ID.'
            });
        }

        // Check if the item exists
        const item = await Inventory.findById(id);
        if (!item) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Item not found.'
            });
        }

        // Perform the delete operation
        await Inventory.deleteOne({ _id: ObjectId(id) });

        return res.status(200).json({
            statusCode: 200,
            message: 'Data successfully deleted.'
        });
    } catch (error) {
        console.error('Error deleting stock data:', error);
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal server error.',
            error: error.message
        });
    }
};

