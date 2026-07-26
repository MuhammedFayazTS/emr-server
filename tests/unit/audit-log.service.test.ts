import AuditLogService, { computeDiff } from "../../src/modules/audit-log/audit-log.service";
import { AuditAction } from "../../src/modules/audit-log/audit-log.types";

import type AuditLogRepository from "../../src/modules/audit-log/audit-log.repository";

describe("AuditLogService Unit Tests", () => {
    describe("computeDiff", () => {
        it("should return null for both before and after if both are empty", () => {
            const result = computeDiff(null, null);
            expect(result).toEqual({ before: null, after: null });
        });

        it("should handle CREATE action (before is null)", () => {
            const after = { name: "Cardiology", isActive: true };
            const result = computeDiff(null, after);
            expect(result).toEqual({ before: null, after });
        });

        it("should handle DELETE action (after is null)", () => {
            const before = { name: "Cardiology", isActive: true };
            const result = computeDiff(before, null);
            expect(result).toEqual({ before, after: null });
        });

        it("should compute diff for updated properties and ignore __v", () => {
            const before = { _id: "1", name: "Cardiology", isActive: true, __v: 0 };
            const after = { _id: "1", name: "Cardiology Updated", isActive: true, __v: 1 };
            const result = computeDiff(before, after);
            expect(result).toEqual({
                before: { name: "Cardiology" },
                after: { name: "Cardiology Updated" },
            });
        });
    });

    describe("AuditLogService methods", () => {
        let mockRepository: jest.Mocked<AuditLogRepository>;
        let service: AuditLogService;

        beforeEach(() => {
            mockRepository = {
                create: jest.fn(),
                find: jest.fn(),
                findByEntity: jest.fn(),
            } as any;
            service = new AuditLogService(mockRepository);
        });

        it("should successfully log an audit record", async () => {
            mockRepository.create.mockResolvedValue({ _id: "log1" } as any);

            await service.log({
                actorType: "USER",
                action: AuditAction.CREATE,
                entityType: "Department",
                entityId: "dept123",
            });

            expect(mockRepository.create).toHaveBeenCalledTimes(1);
            expect(mockRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    actorType: "USER",
                    action: AuditAction.CREATE,
                    entityType: "Department",
                    entityId: "dept123",
                }),
            );
        });

        it("should catch errors in log method and never throw", async () => {
            const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
            mockRepository.create.mockRejectedValue(new Error("Database write error"));

            await expect(
                service.log({
                    actorType: "USER",
                    action: AuditAction.CREATE,
                    entityType: "Department",
                }),
            ).resolves.not.toThrow();

            expect(consoleSpy).toHaveBeenCalledWith(
                "AuditLogService.log failed",
                expect.any(Error),
            );
            consoleSpy.mockRestore();
        });

        it("should log changes with computed diff using logChange", async () => {
            mockRepository.create.mockResolvedValue({ _id: "log2" } as any);

            const before = { name: "Old Dept" };
            const after = { name: "New Dept" };

            await service.logChange({
                actorType: "USER",
                action: AuditAction.UPDATE,
                entityType: "Department",
                entityId: "dept123",
                before,
                after,
            });

            expect(mockRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    action: AuditAction.UPDATE,
                    changes: {
                        before: { name: "Old Dept" },
                        after: { name: "New Dept" },
                    },
                }),
            );
        });

        it("should delegate find to repository", async () => {
            const mockResult = { data: [], total: 0, page: 1, totalPages: 1 };
            mockRepository.find.mockResolvedValue(mockResult as any);

            const query = { page: 1, limit: 10 };
            const result = await service.find(query);

            expect(mockRepository.find).toHaveBeenCalledWith(query);
            expect(result).toBe(mockResult);
        });

        it("should delegate findByEntity to repository", async () => {
            const mockLogs = [{ _id: "log1" }] as any;
            mockRepository.findByEntity.mockResolvedValue(mockLogs);

            const result = await service.findByEntity("Department", "dept123");

            expect(mockRepository.findByEntity).toHaveBeenCalledWith("Department", "dept123");
            expect(result).toBe(mockLogs);
        });
    });
});
