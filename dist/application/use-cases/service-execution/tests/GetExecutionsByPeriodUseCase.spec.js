"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceExecutionRepository_1 = require("../../../../infrastructure/repositories/ServiceExecutionRepository");
const GetExecutionsByPeriodUseCase_1 = require("../GetExecutionsByPeriodUseCase");
jest.mock("../../../infrastructure/repositories/ServiceExecutionRepository", () => ({
    ServiceExecutionRepository: {
        find: jest.fn(),
    }
}));
jest.mock("typeorm", () => ({
    Between: jest.fn((start, end) => ({ between: { start, end } }))
}));
describe("GetExecutionsByPeriodUseCase", () => {
    let getExecutionsByPeriodUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        getExecutionsByPeriodUseCase = new GetExecutionsByPeriodUseCase_1.GetExecutionsByPeriodUseCase();
    });
    describe("execute", () => {
        it("deve buscar execuções por período", async () => {
            const startDate = new Date("2024-01-01");
            const endDate = new Date("2024-01-31");
            const mockExecutions = [{
                    id: 1,
                    status: "CONCLUIDO",
                    service: { id: 1, name: "Troca de óleo" },
                    serviceOrder: { id: 1, mechanic: { id: 1 } }
                }];
            ServiceExecutionRepository_1.ServiceExecutionRepository.find.mockResolvedValue(mockExecutions);
            const result = await getExecutionsByPeriodUseCase.execute(startDate, endDate);
            expect(result).toHaveLength(1);
            expect(ServiceExecutionRepository_1.ServiceExecutionRepository.find).toHaveBeenCalledWith({
                where: {
                    startedAt: expect.any(Object),
                    status: "CONCLUIDO"
                },
                relations: ["service", "serviceOrder", "serviceOrder.mechanic"]
            });
        });
        it("deve retornar array vazio quando não há execuções", async () => {
            const startDate = new Date("2024-01-01");
            const endDate = new Date("2024-01-31");
            ServiceExecutionRepository_1.ServiceExecutionRepository.find.mockResolvedValue([]);
            const result = await getExecutionsByPeriodUseCase.execute(startDate, endDate);
            expect(result).toEqual([]);
        });
    });
});
