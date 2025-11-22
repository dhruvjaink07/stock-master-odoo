import Warehouse from "../models/Warehouse.js"

export const getWarehouses = async (req, res, next) => {
  try {
    const warehouses = await Warehouse.find()
    res.status(200).json({ success: true, data: warehouses })
  } catch (error) {
    next(error)
  }
}

export const createWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.create(req.body)
    res.status(201).json({ success: true, data: warehouse })
  } catch (error) {
    next(error)
  }
}

export const updateWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" })
    }

    res.status(200).json({ success: true, data: warehouse })
  } catch (error) {
    next(error)
  }
}

export const deleteWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id)

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" })
    }

    res.status(200).json({ success: true, message: "Warehouse deleted" })
  } catch (error) {
    next(error)
  }
}
