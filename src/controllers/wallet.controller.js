import { isValidObjectId } from "mongoose";
import Wallet from "../models/wallet.model.js";
import ApiFeature from "../utils/api-feature.utils.js";
import { BadRequestException } from "../exceptions/bad-request.exception.js";
import { ConflictException } from "../exceptions/conflic.exception.js"; 

class WalletController {
  #_walletModel;

  constructor() {
    this.#_walletModel = Wallet;
  }

  // Get all wallets with filtering, sorting, and pagination
  getAllWallets = async (req, res, next) => {
    try {
      const query = { ...req.query };

      // GET ALL FILTERED WALLETS COUNT
      const allResultsCount = await new ApiFeature(
        this.#_walletModel.find(),
        query
      )
        .filter()
        .sort("createdAt")
        .limitFields()
        .getQuery()
        .countDocuments();

      // EXECUTE QUERY
      const allFilteredWallets = await new ApiFeature(
        this.#_walletModel.find(),
        query
      )
        .filter()
        .sort("createdAt")
        .limitFields()
        .paginate()
        .getQuery()
        .populate("customer_id");

      res.send({
        message: "success",
        page: req.query?.page || 0,
        limit: req.query?.limit || 10,
        results: allResultsCount,
        data: allFilteredWallets,
      });
    } catch (error) {
      next(error);
    }
  };

  // Create a new wallet
  createWallet = async (req, res, next) => {
    try {
      const { customer_id, type, card } = req.body;

      // Check if customer_id is valid
      this.#_checkObjectId(customer_id);

      await this.#_walletModel.create({
        customer_id,
        type,
        card,
      });

      res.status(201).send({
        message: "Wallet created successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  // Update a wallet by ID
  updateWallet = async (req, res, next) => {
    try {
      const { walletId } = req.params;
      const { customer_id, type, card } = req.body;

      // Check if walletId is valid
      this.#_checkObjectId(walletId);

      // Check if customer_id is valid
      if (customer_id) {
        this.#_checkObjectId(customer_id);
      }

      await this.#_walletModel.findByIdAndUpdate(walletId, {
        customer_id,
        type,
        card,
      }, { new: true });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  // Delete a wallet by ID
  deleteWallet = async (req, res, next) => {
    try {
      const { walletId } = req.params;

      // Check if walletId is valid
      this.#_checkObjectId(walletId);

      await this.#_walletModel.findByIdAndDelete(walletId);

      res.send({
        message: "Wallet successfully deleted",
      });
    } catch (error) {
      next(error);
    }
  };

  // Private method to check if ObjectId is valid
  #_checkObjectId = (id) => {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Given ${id} is not a valid ObjectID`);
    }
  };
}

export default new WalletController();
