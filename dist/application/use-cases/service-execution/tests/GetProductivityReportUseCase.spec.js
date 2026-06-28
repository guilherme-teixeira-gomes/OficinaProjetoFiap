"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GetExecutionsByPeriodUseCase_1 = require("../GetExecutionsByPeriodUseCase");
const GetProductivityReportUseCase_1 = require("../GetProductivityReportUseCase");
jest.mock("../GetExecutionsByPeriodUseCase");
describe("GetProductivityReportUseCase", () => {
    let getProductivityReportUseCase;
    let mockGetExecutionsByPeriod;
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetExecutionsByPeriod = jest.fn();
        GetExecutionsByPeriodUseCase_1.GetExecutionsByPeriodUseCase.mockImplementation(() => ({
            execute: mockGetExecutionsByPeriod
        }));
        getProductivityReportUseCase = new GetProductivityReportUseCase_1.GetProductivityReportUseCase();
    });
    describe("execute", () => {
        it("deve gerar relatório de produtividade", async () => {
            const startDate = new Date("2024-01-01");
            const endDate = new Date("2024-01-31");
            const mockExecutions = [
                {
                    id: 1,
                    serviceOrderId: 1,
                    serviceId: 1,
                    durationMinutes: 60,
                    status: "CONCLUIDO",
                    startedAt: new Date(),
                    finishedAt: new Date(),
                    service: { id: 1, name: "Troca de óleo" },
                    serviceOrder: {
                        id: 1,
                        mechanicId: 1,
                        mechanic: { id: 1, name: "João" }
                    }
                },
                {
                    id: 2,
                    serviceOrderId: 2,
                    serviceId: 2,
                    durationMinutes: 30,
                    status: "CONCLUIDO",
                    startedAt: new Date(),
                    finishedAt: new Date(),
                    service: { id: 2, name: "Alinhamento" },
                    serviceOrder: {
                        id: 2,
                        mechanicId: 1,
                        mechanic: { id: 1, name: "João" }
                    }
                },
                {
                    id: 3,
                    serviceOrderId: 3,
                    serviceId: 1,
                    durationMinutes: 45,
                    status: "CONCLUIDO",
                    startedAt: new Date(),
                    finishedAt: new Date(),
                    service: { id: 1, name: "Troca de óleo" },
                    serviceOrder: {
                        id: 3,
                        mechanicId: 2,
                        mechanic: { id: 2, name: "Maria" }
                    }
                }
            ];
            mockGetExecutionsByPeriod.mockResolvedValue(mockExecutions);
            const result = await getProductivityReportUseCase.execute(startDate, endDate);
            expect(result).toHaveLength(2);
            const mechanic1 = result.find(r => r.mechanicId === 1);
            expect(mechanic1.totalServices).toBe(2);
            expect(mechanic1.totalHours).toBe("1.50"); // 90 minutos = 1.5 horas
            const mechanic2 = result.find(r => r.mechanicId === 2);
            expect(mechanic2.totalServices).toBe(1);
            expect(mechanic2.totalHours).toBe("0.75"); // 45 minutos = 0.75 horas
        });
        it("deve gerar relatório vazio quando não há execuções", async () => {
            const startDate = new Date("2024-01-01");
            const endDate = new Date("2024-01-31");
            mockGetExecutionsByPeriod.mockResolvedValue([]);
            const result = await getProductivityReportUseCase.execute(startDate, endDate);
            expect(result).toEqual([]);
        });
        it("deve ignorar execuções sem mecânico", async () => {
            const startDate = new Date("2024-01-01");
            const endDate = new Date("2024-01-31");
            const mockExecutions = [
                {
                    id: 1,
                    serviceOrderId: 1,
                    serviceId: 1,
                    durationMinutes: 60,
                    status: "CONCLUIDO",
                    service: { id: 1, name: "Troca de óleo" },
                    serviceOrder: {
                        id: 1,
                        mechanicId: null,
                        mechanic: null
                    }
                }
            ];
            mockGetExecutionsByPeriod.mockResolvedValue(mockExecutions);
            const result = await getProductivityReportUseCase.execute(startDate, endDate);
            expect(result).toEqual([]);
        });
    });
});
