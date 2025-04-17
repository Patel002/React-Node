import { Terms } from "../model/terms.model.js";

const setTerms = async (req,res) => {
    try {
        const { fullTerm, type } = req.body;
    
        if (!fullTerm || !type) {
          return res.status(400).json({ message: "fullTerm and type are required" });
        }
    
        const newTerm = await Terms.create({ fullTerm, type });
        res.status(201).json({ message: "Term created successfully", term: newTerm });
      } catch (error) {
        console.error("Error creating term:", error);
        res.status(500).json({ message: "Internal server error when creating term" });
      }
    };

const getTerms = async (req, res) => {
    try {
        const { type } = req.query;
    
        const where = type ? { type } : {}; 
        const terms = await Terms.findAll({ where });
    
        res.status(200).json({ terms });
      } catch (error) {
        console.error("Error fetching terms:", error);
        res.status(500).json({ message: "Internal server error when fetching terms" });
      }
    };

const updateTerms = async(req, res) => {
    try{
    const { id } = req.params;
    const { fullTerm, type } = req.body;

    const term = await Terms.findByPk(id);
    if (!term) {
      return res.status(404).json({ message: "Term not found" });
    }

    await term.update({ fullTerm, type });
    res.status(200).json({ message: "Term updated successfully", term });
  } catch (error) {
    console.error("Error updating term:", error);
    res.status(500).json({ message: "Internal server error when updating term" });
  }

}

export {
    setTerms,
    getTerms,
    updateTerms
}