"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceOrderService = void 0;
const ClientRepository_1 = require("../repositories/ClientRepository");
const ServiceOrderRepository_1 = require("../repositories/ServiceOrderRepository");
const VehicleRepository_1 = require("../repositories/VehicleRepository");
const ServiceRepository_1 = require("../repositories/ServiceRepository");
const PartRepository_1 = require("../repositories/PartRepository");
class ServiceOrderService {
    async execute(data) {
        const client = await ClientRepository_1.ClientRepository.findOne({ where: { document: data.clientDocument } });
        if (!client)
            throw new Error("Cliente não encontrado");
        let vehicle = await VehicleRepository_1.VehicleRepository.findOne({ where: { plate: data.vehicle.plate } });
        if (!vehicle) {
            vehicle = VehicleRepository_1.VehicleRepository.create({ ...data.vehicle, client });
            vehicle = await VehicleRepository_1.VehicleRepository.save(vehicle);
        }
        const services = await ServiceRepository_1.ServiceRepository.findByIds(data.services);
        const parts = await PartRepository_1.PartRepository.findByIds(data.parts);
        // CORREÇÃO: Usar "RECEBIDA" em maiúsculo para bater com o ENUM
        const order = ServiceOrderRepository_1.ServiceOrderRepository.create({
            client,
            vehicle,
            services: services,
            parts: parts,
            status: "RECEBIDA" // ← AGORA ESTÁ CORRETO!
        });
        return await ServiceOrderRepository_1.ServiceOrderRepository.save(order);
    }
    async list() {
        return ServiceOrderRepository_1.ServiceOrderRepository.find({ relations: ["client", "vehicle", "services", "parts"] });
    }
    async getById(id) {
        return ServiceOrderRepository_1.ServiceOrderRepository.findOne({ where: { id }, relations: ["client", "vehicle", "services", "parts"] });
    }
    async updateStatus(id, status) {
        // Validar se o status existe no ENUM
        const validStatus = ["RECEBIDA", "EM_DIAGNOSTICO", "AGUARDANDO_APROVACAO", "EM_EXECUCAO", "FINALIZADA", "ENTREGUE"];
        if (!validStatus.includes(status)) {
            throw new Error(`Status inválido. Use um dos: ${validStatus.join(", ")}`);
        }
        const order = await ServiceOrderRepository_1.ServiceOrderRepository.findOne({ where: { id } });
        if (!order)
            throw new Error("Ordem de serviço não encontrada");
        order.status = status;
        return ServiceOrderRepository_1.ServiceOrderRepository.save(order);
    }
}
exports.ServiceOrderService = ServiceOrderService;
