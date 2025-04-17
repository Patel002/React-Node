import { Accounting } from "../model/accounting.model.js";

 const getAccounting = async (req, res) => {
    try {
        const accounting = await Accounting.findAll();

        return res.status(200).json({ message: "Accounting fetched successfully", accounting });
    } catch (error) {
        return res.status(500).json({ message: "Error while getting accounting", error: error.message });
    }
};

 const setAccounting = async (req, res) => {
    try {
        const { glCodeId, type } = req.body;

        if (!glCodeId || !type) {
            return res.status(400).json({ message: "glCodeId and type are required" });
        }

        const existingglCodeId = await Accounting.findOne({ where: { type } });

        if (existingglCodeId) {
            return res.status(400).json({ message: "Accounting glCodeId already exists" });
        }

        const accounting = await Accounting.create({ glCodeId, type });

        return res.status(200).json({ message: "Accounting created successfully", accounting });

    } catch (error) {
        return res.status(500).json({ message: "Error while creating accounting", error: error.message });
    }
};

 const updateAccounting = async (req, res) => {
    try {
        const { id } = req.params;
        const { glCodeId } = req.body;

        if (!glCodeId) {
            return res.status(400).json({ message: "glCodeId  required" });
        }

        const accounting = await Accounting.findByPk(id);

        if (!accounting) {
            return res.status(400).json({ message: "Accounting not found" });
        }

        const updatedAccounting = await accounting.update({ glCodeId });

        return res.status(200).json({ message: "Accounting updated successfully", updatedAccounting });

    } catch (error) {
        return res.status(500).json({ message: "Error while updating accounting", error: error.message });
    }
};

export{
    getAccounting,
    setAccounting,
    updateAccounting
}