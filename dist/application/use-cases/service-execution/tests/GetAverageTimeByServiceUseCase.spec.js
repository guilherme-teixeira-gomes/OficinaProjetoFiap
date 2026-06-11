"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceExecutionRepository_1 = require("../../../../infrastructure/repositories/ServiceExecutionRepository");
const GetAverageTimeByServiceUseCase_1 = require("../GetAverageTimeByServiceUseCase");
jest.mock("../../../infrastructure/repositories/ServiceExecutionRepository", () => ({
    ServiceExecutionRepository: {
        find: jest.fn(),
    }
}));
describe("GetAverageTimeByServiceUseCase", () => {
    let getAverageTimeUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        getAverageTimeUseCase = new GetAverageTimeByServiceUseCase_1.GetAverageTimeByServiceUseCase();
    });
    describe("execute", () => {
        it("deve calcular média de tempo", async () => {
            ServiceExecutionRepository_1.ServiceExecutionRepository.find.mockResolvedValue([
                { durationMinutes: 60 },
                { durationMinutes: 30 }
            ]);
            const result = await getAverageTimeUseCase.execute(1);
            expect(result.averageMinutes).toBe(45);
            expect(result.totalExecutions).toBe(2);
            expect(result.minMinutes).toBe(30);
            expect(result.maxMinutes).toBe(60);
        });
        it("deve retornar média zero quando não há execuções", async () => {
            ServiceExecutionRepository_1.ServiceExecutionRepository.find.mockResolvedValue([]);
            const result = await getAverageTimeUseCase.execute(1);
            expect(result.averageMinutes).toBe(0);
            expect(result.totalExecutions).toBe(0);
            expect(result.minMinutes).toBe(0);
            expect(result.maxMinutes).toBe(0);
        });
        it("deve ignorar execuções sem duração", async () => {
            ServiceExecutionRepository_1.ServiceExecutionRepository.find.mockResolvedValue([
                { durationMinutes: 60 },
                { durationMinutes: null },
                { durationMinutes: 30 }
            ]);
            const result = await getAverageTimeUseCase.execute(1);
            expect(result.averageMinutes).toBe(45);
            expect(result.totalExecutions).toBe(2);
        });
    });
});
