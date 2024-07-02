import { Document, Model } from "mongoose"

/**
 * Adds a specified field with a default value to documents in a model that do not have the field.
 * @param {mongoose.Model} model - The Mongoose model to update.
 * @param {string} field - The field name to check and add if not exists.
 * @param {*} defaultValue - The default value to set for the field.
 * @returns {Promise<number>} - The number of documents updated.
 */
export const addFieldIfNotExists = async(
  model: Model<Document>,
  field: string,
  defaultValue: any): Promise<number> => {
  try {
    // Find documents that do not have the specified field
    const docsWithoutField = await model.find({ [field]: { $exists: false } })

    if (docsWithoutField.length === 0) {
      console.log(`No documents without ${field} found.`)
      return 0
    }

    // Update documents to add the specified field with the default value
    const updatePromises = docsWithoutField.map(doc => 
      model.findByIdAndUpdate(
        doc._id,
        { $set: { [field]: defaultValue } },
        { new: true }
      )
    )

    await Promise.all(updatePromises)
    console.log(`${docsWithoutField.length} documents updated with ${field}.`)
    return docsWithoutField.length
  } catch (error) {
    console.error(`Failed to update documents:`, error)
    throw error
  }
}

