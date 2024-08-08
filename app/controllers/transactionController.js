const Transaction = require('../models/trasaction.model');
const Inventory = require('../models/inventory.model');
const { ObjectId } = require("mongoose").Types;

exports.createTransaction = async (req, res) => {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ statusCode: 400, message: "Please provide valid items." });
    }

    try {
        const itemIds = items.map(item => item.id);
        const inventoryItems = await Inventory.find({ _id: { $in: itemIds } });

        if (inventoryItems.length !== itemIds.length) {
            return res.status(404).json({ statusCode: 404, message: "One or more items are not available." });
        }

        // Check if requested quantities exceed available inventory
        for (const item of items) {
            const inventoryItem = inventoryItems.find(i => i._id.toString() === item.id);
            if (inventoryItem && inventoryItem.quantity < item.quantity) {
                return res.status(400).json({
                    statusCode: 400,
                    message: `Insufficient quantity for item with ID ${item.id}. Available: ${inventoryItem.quantity}, Requested: ${item.quantity}.`
                });
            }
        }

        const totalAmount = inventoryItems.reduce((total, inventoryItem) => {
            const item = items.find(i => i.id === inventoryItem._id.toString());
            return total + (inventoryItem.price * item.quantity);
        }, 0);
        
        const formattedTotalAmount = parseFloat(totalAmount.toFixed(3));
        const transaction = new Transaction({ items, totalAmount: formattedTotalAmount, date: new Date() });
        await transaction.save();

        const updatePromises = items.map(item => {
            return Inventory.updateOne(
                { _id: new ObjectId(item.id) },
                { $inc: { quantity: -item.quantity } }
            );
        });
        
        await Promise.all(updatePromises);
        
        return res.status(201).json({ statusCode: 201, message: "Transaction created successfully.", transaction });
    } catch (error) {
        console.error("Error adding transaction:", error);
        return res.status(500).json({ statusCode: 500, message: "Something went wrong. Please try again later." });
    }
};


exports.getListOfTransaction = async (req, res) => {
    try {
        const transactions = await Transaction.aggregate([
            {
                $lookup: {
                    from: "inventories",
                    let: { itemIds: "$items.id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$_id", { $toObjectId: "$$itemIds" }] }
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                description: 1
                            }
                        }
                    ],
                    as: "itemDetails"
                }
            },
            {
                $unwind: "$itemDetails"
            },
            {
                $group: {
                    _id: "$_id",
                    totalAmount: { $first: "$totalAmount" },
                    createdAt: { $first: "$createdAt" },
                    items: {
                        $push: {
                            id: "$items.id",
                            name: "$itemDetails.name",
                            description: "$itemDetails.description"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    totalAmount: 1,
                    createdAt: 1,
                    items: 1
                }
            }
        ]);

        return res.status(200).json({ statusCode: 200, transactions });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return res.status(500).json({ statusCode: 500, message: "Unable to retrieve transactions. Please try again later.", error: error.message });
    }
};


exports.getTransactionDetail = async (req, res) => {
    const { id } = req.query;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ statusCode: 400, message: "Invalid transaction ID." });
    }

    try {
        const transaction = await Transaction.findById(id);

        if (!transaction) {
            return res.status(404).json({ statusCode: 404, message: "Transaction not found." });
        }

        const itemsWithDetails = await Promise.all(
            transaction.items.map(async (item) => {
                const inventoryItem = await Inventory.findById(item.id).select('name description');
                return {
                    id: item.id,
                    name: inventoryItem ? inventoryItem.name : null,
                    description: inventoryItem ? inventoryItem.description : null,
                };
            })
        );

        return res.status(200).json({ statusCode: 200, transaction: { ...transaction._doc, items: itemsWithDetails } });
    } catch (error) {
        console.error("Error fetching transaction:", error);
        return res.status(500).json({ statusCode: 500, message: "Unable to retrieve transaction details. Please try again later.", error: error.message });
    }
};
